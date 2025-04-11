import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})
const docClient = DynamoDBDocumentClient.from(client)

async function testDynamoDB() {
  try {
    // Test data
    const testItem = {
      id: 'test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Try to write to DynamoDB
    console.log('Attempting to write to DynamoDB...')
    await docClient.send(
      new PutCommand({
        TableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
        Item: testItem
      })
    )
    console.log('Successfully wrote to DynamoDB')

    // Try to read from DynamoDB
    console.log('Attempting to read from DynamoDB...')
    const result = await docClient.send(
      new GetCommand({
        TableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
        Key: { id: testItem.id }
      })
    )
    console.log('Successfully read from DynamoDB:', result.Item)
  } catch (error) {
    console.error('Error testing DynamoDB:', error)
  }
}

testDynamoDB()
