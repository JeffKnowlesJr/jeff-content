import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import dotenv from 'dotenv'
import { executeGraphQL } from '../src/services/appsync-client.ts'

// --- Define the GraphQL Mutation Strings ---
const createBlogPostMutation = /* GraphQL */ `
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      slug
      title
      createdAt
    }
  }
`

const updateBlogPostMutation = /* GraphQL */ `
  mutation UpdateBlogPost($input: UpdateBlogPostInput!) {
    updateBlogPost(input: $input) {
      slug
      title
      updatedAt
    }
  }
`
// --- End of GraphQL Mutation Strings ---

// Load .env.local
dotenv.config({ path: '.env.local' })

// Helper function to format date string or object to ISO 8601 UTC
const formatToAWSDateTime = (dateInput) => {
  let date
  // Check if input is a string, Date object, or something else
  if (dateInput instanceof Date) {
    date = dateInput // Already a Date object
  } else if (typeof dateInput === 'string') {
    try {
      // Attempt to parse the string
      date = new Date(dateInput)
    } catch (e) {
      console.error(`Error parsing date string ${dateInput}:`, e.message)
      return null
    }
  } else {
    // If input is null, undefined, or other non-date type
    return null
  }

  // Check if the date is valid after parsing or if it was already a valid Date object
  if (isNaN(date.getTime())) {
    console.error(`Invalid date value: ${dateInput}`)
    return null
  }

  try {
    // Format to ISO 8601 UTC
    // Note: toISOString() always returns UTC time
    return date.toISOString() // Format as YYYY-MM-DDTHH:mm:ss.sssZ
  } catch (e) {
    console.error(`Error formatting date ${dateInput} to ISOString:`, e.message)
    return null // Or handle error as needed
  }
}

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

async function importBlogPosts() {
  console.log(`Reading blog posts from: ${BLOG_CONTENT_DIR}`)
  const filenames = fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
  console.log(`Found ${filenames.length} markdown files.`)

  if (!process.env.APPSYNC_API_URL || !process.env.APPSYNC_API_KEY) {
    console.error(
      'Error: APPSYNC_API_URL or APPSYNC_API_KEY not found in environment variables.'
    )
    console.error('Make sure they are set in your .env.local file.')
    process.exit(1)
  }

  let successCount = 0
  let errorCount = 0
  let createdCount = 0
  let updatedCount = 0

  for (const filename of filenames) {
    const filePath = path.join(BLOG_CONTENT_DIR, filename)
    console.log(`\nProcessing ${filename}...`)

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      // Handle potential empty files or files without frontmatter
      let data = {}
      let content = ''
      try {
        const parsed = matter(fileContent)
        data = parsed.data
        content = parsed.content
      } catch (e) {
        // If YAML parsing fails (e.g., no ---), use defaults but log warning
        console.warn(
          `  -> Warning: Could not parse frontmatter for ${filename}. Proceeding with defaults/empty values. Error: ${e.message}`
        )
        // Assign slug based on filename if possible, otherwise skip?
        data.slug = path.basename(filename, '.md')
        data.title = data.slug // Default title
        content = fileContent // Use entire file as content if no frontmatter
      }

      const frontmatter = data // Use 'frontmatter' for consistency below

      // Format the date correctly before creating the input object
      const formattedPublishedAt = formatToAWSDateTime(
        frontmatter.datePublished
      )

      // --- Prepare input for Create/Update BlogPostInput ---
      // Fields are identical for CreateBlogPostInput and UpdateBlogPostInput
      const input = {
        slug: frontmatter.slug,
        title: frontmatter.title,
        content: content,
        excerpt: frontmatter.excerpt,
        author: frontmatter.author,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        readingTime: frontmatter.readingTime
          ? parseInt(frontmatter.readingTime)
          : null,
        featuredImage: frontmatter.featuredImage,
        status: frontmatter.status,
        publishedAt: formattedPublishedAt
      }

      // Remove null/undefined fields
      Object.keys(input).forEach((key) => {
        if (input[key] === null || typeof input[key] === 'undefined') {
          delete input[key]
        }
      })

      // Check required fields (same for Create and Update)
      if (!input.slug) throw new Error('Missing required field: slug')
      if (!input.title) throw new Error('Missing required field: title')
      if (!input.content) throw new Error('Missing required field: content')
      if (!input.excerpt) throw new Error('Missing required field: excerpt')
      if (!input.author) throw new Error('Missing required field: author')
      if (!input.publishedAt)
        throw new Error(
          'Missing or invalid required field: publishedAt (from datePublished)'
        )
      if (input.readingTime === null)
        // readingTime is Int!, so null is not allowed after parseInt
        throw new Error('Missing required field: readingTime')
      if (!input.status) throw new Error('Missing required field: status')
      if (!input.tags) throw new Error('Missing required field: tags') // Should be set to [] if missing

      // --- Attempt to CREATE first ---
      try {
        console.log(`  -> Attempting CREATE for slug: ${input.slug}`)
        await executeGraphQL(
          createBlogPostMutation,
          { input },
          { isServer: true }
        )
        console.log(`  -> Successfully CREATED post: ${input.title}`)
        createdCount++
        successCount++
      } catch (createError) {
        // Check if the error is because the item already exists
        // The executeGraphQL function now throws an object with an 'errors' property for GraphQL errors.
        const isConditionalCheckError =
          createError &&
          typeof createError === 'object' &&
          'errors' in createError &&
          Array.isArray(createError.errors) &&
          createError.errors.some(
            (err) =>
              err &&
              err.errorType === 'DynamoDB:ConditionalCheckFailedException'
          )

        if (isConditionalCheckError) {
          console.log(
            `  -> CREATE failed (already exists), attempting UPDATE for slug: ${input.slug}`
          )
          // --- Attempt to UPDATE ---
          try {
            await executeGraphQL(
              updateBlogPostMutation,
              { input },
              { isServer: true }
            )
            console.log(`  -> Successfully UPDATED post: ${input.title}`)
            updatedCount++
            successCount++
          } catch (updateError) {
            // Handle update error separately
            console.error(`  -> UPDATE failed for ${filename}:`)
            if (
              updateError &&
              typeof updateError === 'object' &&
              'errors' in updateError &&
              Array.isArray(updateError.errors)
            ) {
              console.error(
                `    GraphQL Errors: ${JSON.stringify(updateError.errors)}`
              )
            } else {
              // Check if it's an Error instance before accessing .message
              const message =
                updateError instanceof Error
                  ? updateError.message
                  : String(updateError)
              console.error(`    ${message}`)
            }
            errorCount++
          }
        } else {
          // If createError was not a conditional check failure, log the actual error
          console.error(`  -> CREATE failed for ${filename}:`)
          if (
            createError &&
            typeof createError === 'object' &&
            'errors' in createError &&
            Array.isArray(createError.errors)
          ) {
            console.error(
              `    GraphQL Errors: ${JSON.stringify(createError.errors)}`
            )
          } else {
            // Log the whole error if structure is unknown or not a GraphQL error
            console.error(`    Raw Error: ${JSON.stringify(createError)}`)
          }
          errorCount++
        }
      }
    } catch (error) {
      // Catch errors from file reading, frontmatter parsing, or input validation
      console.error(`  -> Error processing ${filename} before API call:`)
      console.error(`    ${error.message}`)
      errorCount++
    }
  }

  console.log(
    `\nImport finished. ${successCount} successful (${createdCount} created, ${updatedCount} updated), ${errorCount} failed.`
  )
}

// Run the import
importBlogPosts().catch((err) => {
  console.error('\nUnhandled error during import:', err)
  process.exit(1)
})
