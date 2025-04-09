// Lambda function that processes new contact form submissions
// and sends email notifications using Amazon SES

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const ses = new SESClient({ region: process.env.REGION || 'us-east-1' })

// Configure these in Lambda environment variables
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@example.com'
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'admin@example.com'

exports.handler = async (event) => {
  console.log(
    'Processing contact form submissions:',
    JSON.stringify(event, null, 2)
  )

  try {
    // Process each DynamoDB stream record
    for (const record of event.Records) {
      // Only process new submissions
      if (record.eventName !== 'INSERT') {
        console.log(`Skipping non-INSERT event: ${record.eventName}`)
        continue
      }

      const newSubmission = record.dynamodb.NewImage

      if (!newSubmission) {
        console.warn('No new image found in the record')
        continue
      }

      // Extract contact form data
      const id = newSubmission.id?.S
      const name = newSubmission.name?.S
      const email = newSubmission.email?.S
      const subject = newSubmission.subject?.S || 'Contact Form Submission'
      const message = newSubmission.message?.S
      const createdAt = newSubmission.createdAt?.S

      if (!name || !email || !message) {
        console.warn('Missing required fields in submission:', {
          id,
          name,
          email,
          message
        })
        continue
      }

      // Send email notification
      await sendEmailNotification({
        id,
        name,
        email,
        subject,
        message,
        createdAt
      })

      console.log(`Successfully processed submission ${id}`)
    }

    return {
      statusCode: 200,
      body: `Successfully processed ${event.Records.length} records`
    }
  } catch (error) {
    console.error('Error processing contact form submissions:', error)
    throw error
  }
}

async function sendEmailNotification(submission) {
  const { id, name, email, subject, message, createdAt } = submission

  const emailParams = {
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: [RECIPIENT_EMAIL]
    },
    Message: {
      Subject: {
        Data: `New Contact Form: ${subject}`
      },
      Body: {
        Text: {
          Data: `
New contact form submission received:

From: ${name} (${email})
Subject: ${subject}
Date: ${createdAt}
ID: ${id}

Message:
${message}

---
This is an automated notification from your website contact form.
                    `.trim()
        },
        Html: {
          Data: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
        .content { padding: 15px 0; }
        .message { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0; }
        .footer { font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Date:</strong> ${createdAt}</p>
            <p><strong>ID:</strong> ${id}</p>
            
            <div class="message">
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated notification from your website contact form.</p>
        </div>
    </div>
</body>
</html>
                    `.trim()
        }
      }
    }
  }

  try {
    console.log(`Sending email notification for submission ${id}`)
    const command = new SendEmailCommand(emailParams)
    const response = await ses.send(command)
    console.log(`Email sent successfully:`, response)
    return response
  } catch (error) {
    console.error(
      `Error sending email notification for submission ${id}:`,
      error
    )
    throw error
  }
}
