// GraphQL queries for blog posts
export const listBlogPosts = /* GraphQL */ `
  query ListBlogPosts {
    listBlogPosts {
      items {
        slug
        title
        excerpt
        content
        author
        tags
        readingTime
        featuredImage
        status
        publishedAt
        updatedAt
      }
    }
  }
`

export const getBlogPostBySlug = /* GraphQL */ `
  query GetBlogPost($slug: String!) {
    getBlogPost(slug: $slug) {
      slug
      title
      excerpt
      content
      author
      tags
      readingTime
      featuredImage
      status
      publishedAt
      updatedAt
    }
  }
`

export const getRecentBlogPosts = /* GraphQL */ `
  query GetRecentBlogPosts($limit: Int) {
    listBlogPosts(limit: $limit, filter: { status: { eq: "published" } }) {
      items {
        slug
        title
        excerpt
        author
        tags
        publishedAt
      }
    }
  }
`
