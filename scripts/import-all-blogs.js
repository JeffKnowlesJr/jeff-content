import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import dotenv from 'dotenv'
import { executeGraphQL } from '../src/services/appsync-client.ts'

// --- Define the GraphQL Mutation String ---
// Using UpdateBlogPost mutation
const updateBlogPostMutation = /* GraphQL */ `
  mutation UpdateBlogPost($input: UpdateBlogPostInput!) {
    updateBlogPost(input: $input) {
      slug
      title
      updatedAt
    }
  }
`
// --- End of GraphQL Mutation String ---

// Load .env.local
dotenv.config({ path: '.env.local' })

// Helper function to format date string to ISO 8601 UTC
const formatToAWSDateTime = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null // Or throw an error if it's truly required
  }
  try {
    // Attempt to parse the date. Handles YYYY-MM-DD.
    const date = new Date(dateString)
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`)
    }
    // Format to ISO 8601, ensuring it represents UTC midnight if no time was given
    // Adjust based on whether the input already contains time/timezone info
    if (dateString.includes('T')) {
      return date.toISOString() // Assume it's already specific enough
    } else {
      // If only date, create UTC date and format
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
      return utcDate.toISOString() // Format as YYYY-MM-DDTHH:mm:ss.sssZ
    }
  } catch (e) {
    console.error(`Error formatting date ${dateString}:`, e.message)
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

  for (const filename of filenames) {
    const filePath = path.join(BLOG_CONTENT_DIR, filename)
    console.log(`\nProcessing ${filename}...`)

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data: frontmatter, content } = matter(fileContent)

      // Format the date correctly before creating the input object
      const formattedPublishedAt = formatToAWSDateTime(
        frontmatter.datePublished
      )

      // --- Prepare input for UpdateBlogPostInput ---
      // IMPORTANT: Field names MUST match UpdateBlogPostInput in schema.graphql
      const input = {
        // 'id' is usually required for update, but schema uses slug?
        // If update requires ID, we might need a preliminary query step.
        // Assuming slug is the key field for update based on schema pattern.
        slug: frontmatter.slug,
        title: frontmatter.title,
        content: content,
        excerpt: frontmatter.excerpt,
        author: frontmatter.author,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        // category: frontmatter.category, // Not in UpdateBlogPostInput
        readingTime: frontmatter.readingTime
          ? parseInt(frontmatter.readingTime)
          : null,
        featuredImage: frontmatter.featuredImage,
        // ogImage: frontmatter.ogImage, // Not in UpdateBlogPostInput
        status: frontmatter.status,
        publishedAt: formattedPublishedAt // Use the formatted date
        // dateModified: frontmatter.dateModified, // Not in UpdateBlogPostInput (updatedAt is likely auto)
      }

      // Remove null/undefined fields
      Object.keys(input).forEach((key) => {
        if (input[key] === null || typeof input[key] === 'undefined') {
          delete input[key]
        }
      })

      // Check required fields for UpdateBlogPostInput (based on schema ! marks)
      if (!input.slug) throw new Error('Missing required field: slug')
      if (!input.title) throw new Error('Missing required field: title')
      if (!input.content) throw new Error('Missing required field: content')
      if (!input.excerpt) throw new Error('Missing required field: excerpt')
      if (!input.author) throw new Error('Missing required field: author')
      if (!input.publishedAt)
        throw new Error(
          'Missing or invalid required field: publishedAt (from datePublished)'
        ) // Check formatted value
      if (input.readingTime === null)
        throw new Error('Missing required field: readingTime') // Check for null after parseInt
      if (!input.status) throw new Error('Missing required field: status')
      if (!input.tags) throw new Error('Missing required field: tags') // Should be set to [] if missing

      console.log(`  -> Sending UPDATE data for slug: ${input.slug}`)

      // Execute the updateBlogPost mutation
      /* const mutationResult = */ await executeGraphQL(
        updateBlogPostMutation, // Use the correct mutation string
        { input }, // Pass the input object
        { isServer: true }
      )

      console.log(`  -> Successfully UPDATED post: ${input.title}`)
      successCount++
    } catch (error) {
      console.error(`  -> Error processing ${filename}:`)
      if (error.errors) {
        console.error(`    GraphQL Errors: ${JSON.stringify(error.errors)}`)
      } else {
        console.error(`    ${error.message}`)
      }
      errorCount++
    }
  }

  console.log(
    `\nImport finished. ${successCount} updated, ${errorCount} failed.`
  )
}

// Run the import
importBlogPosts().catch((err) => {
  console.error('\nUnhandled error during import:', err)
  process.exit(1)
})
