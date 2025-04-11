import { BlogPost } from '@/utils/content-loader'
import { getBlogPostBySlug, listBlogPosts } from '@/graphql/queries'
import { executeGraphQL } from './appsync-client'

type GetBlogPostResponse = {
  getBlogPost: BlogPost
}

type ListBlogPostsResponse = {
  listBlogPosts: {
    items: BlogPost[]
  }
}

/**
 * Fetch a blog post by its slug from AppSync/DynamoDB
 * @param slug The slug of the post to fetch
 * @param isServer Hint whether the call is happening server-side
 */
export async function fetchBlogPostBySlug(
  slug: string,
  isServer: boolean = true // Default to true as these are usually called server-side
): Promise<BlogPost | null> {
  try {
    console.log(
      `Fetching blog post with slug: ${slug}${
        isServer ? ' (server)' : ' (client)'
      }`
    )

    const data = await executeGraphQL<GetBlogPostResponse>(
      getBlogPostBySlug,
      { slug },
      { isServer } // Pass the option
    )

    const post = data.getBlogPost

    if (!post) {
      console.log(`No blog post found with slug: ${slug}`)
      return null
    }

    console.log(`Successfully fetched blog post: ${post.title}`)
    return post
  } catch (error) {
    console.error('Error fetching blog post by slug:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

/**
 * Fetch all published blog posts from AppSync/DynamoDB
 * @param isServer Hint whether the call is happening server-side
 */
export async function fetchAllBlogPosts(
  isServer: boolean = true // Default to true
): Promise<BlogPost[]> {
  try {
    console.log(
      `Fetching all blog posts${isServer ? ' (server)' : ' (client)'}`
    )

    const data = await executeGraphQL<ListBlogPostsResponse>(
      listBlogPosts,
      undefined, // No variables for listBlogPosts
      { isServer } // Pass the option
    )
    const posts = data.listBlogPosts.items

    if (!posts || posts.length === 0) {
      console.log('No blog posts found')
      return []
    }

    // Filter out drafts and sort by date (newest first)
    const publishedPosts = posts
      .filter((post: BlogPost) => post.status?.toLowerCase() === 'published')
      .sort((a: BlogPost, b: BlogPost) => {
        const dateA = new Date(a.publishedAt).getTime()
        const dateB = new Date(b.publishedAt).getTime()
        return dateB - dateA
      })

    console.log(`Successfully fetched ${publishedPosts.length} blog posts`)
    return publishedPosts
  } catch (error) {
    console.error('Error fetching blog posts:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
