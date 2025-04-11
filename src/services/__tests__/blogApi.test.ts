import { fetchBlogPostBySlug, fetchAllBlogPosts } from '../blogApi'
import { executeGraphQL } from '../appsync-client'

// Mock the executeGraphQL function
jest.mock('../appsync-client')
const mockedExecuteGraphQL = executeGraphQL as jest.MockedFunction<
  typeof executeGraphQL
>

describe('Blog API Service', () => {
  // Save original environment and mock production environment
  const originalEnv = process.env.NODE_ENV

  beforeAll(() => {
    // Mock production environment
    process.env.NODE_ENV = 'production'
  })

  afterAll(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('fetchBlogPostBySlug', () => {
    it('should fetch a blog post by slug successfully', async () => {
      // Mock blog post response
      const mockBlogPost = {
        id: '1',
        slug: 'test-blog-post',
        title: 'Test Blog Post',
        content: 'This is test content',
        excerpt: 'Test excerpt',
        author: 'Test Author',
        tags: ['test', 'blog'],
        readingTime: 5,
        featuredImage: '/images/test.jpg',
        status: 'published',
        datePublished: '2023-01-01',
        dateModified: '2023-01-02'
      }

      // Setup mock to return a successful response
      mockedExecuteGraphQL.mockResolvedValueOnce({
        getBlogPostBySlug: mockBlogPost
      })

      // Call the function with our test slug
      const result = await fetchBlogPostBySlug('test-blog-post')

      // Assertions
      expect(mockedExecuteGraphQL).toHaveBeenCalledTimes(1)
      expect(mockedExecuteGraphQL).toHaveBeenCalledWith(expect.any(String), {
        slug: 'test-blog-post'
      })
      expect(result).toEqual(mockBlogPost)
    })

    it('should return null when no blog post is found', async () => {
      // Setup mock to return null
      mockedExecuteGraphQL.mockResolvedValueOnce({
        getBlogPostBySlug: null
      })

      // Call the function
      const result = await fetchBlogPostBySlug('non-existent-post')

      // Assertions
      expect(mockedExecuteGraphQL).toHaveBeenCalledTimes(1)
      expect(result).toBeNull()
    })

    it('should throw an error when the GraphQL query fails', async () => {
      // Setup mock to throw an error
      const error = new Error('GraphQL error')
      mockedExecuteGraphQL.mockRejectedValueOnce(error)

      // Call the function and expect it to throw
      await expect(fetchBlogPostBySlug('test-post')).rejects.toThrow(
        'GraphQL error'
      )

      expect(mockedExecuteGraphQL).toHaveBeenCalledTimes(1)
    })
  })

  describe('fetchAllBlogPosts', () => {
    it('should fetch all published blog posts successfully', async () => {
      // Mock blog posts response
      const mockBlogPosts = [
        {
          id: '1',
          slug: 'test-post-1',
          title: 'Test Post 1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          author: 'Author 1',
          tags: ['test'],
          readingTime: 5,
          featuredImage: '/images/test1.jpg',
          status: 'published',
          datePublished: '2023-01-02',
          dateModified: '2023-01-03'
        },
        {
          id: '2',
          slug: 'test-post-2',
          title: 'Test Post 2',
          content: 'Content 2',
          excerpt: 'Excerpt 2',
          author: 'Author 2',
          tags: ['test'],
          readingTime: 3,
          featuredImage: '/images/test2.jpg',
          status: 'published',
          datePublished: '2023-01-01', // Earlier date
          dateModified: '2023-01-02'
        },
        {
          id: '3',
          slug: 'draft-post',
          title: 'Draft Post',
          content: 'Draft Content',
          excerpt: 'Draft Excerpt',
          author: 'Author 3',
          tags: ['draft'],
          readingTime: 2,
          featuredImage: '/images/draft.jpg',
          status: 'draft', // This should be filtered out
          datePublished: '2023-01-03',
          dateModified: '2023-01-04'
        }
      ]

      // Setup mock to return blog posts
      mockedExecuteGraphQL.mockResolvedValueOnce({
        listBlogPosts: {
          items: mockBlogPosts
        }
      })

      // Call the function
      const result = await fetchAllBlogPosts()

      // Assertions
      expect(mockedExecuteGraphQL).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2) // Only 2 published posts
      expect(result[0].id).toBe('1') // First post should be the most recent (2023-01-02)
      expect(result[1].id).toBe('2') // Second post is older (2023-01-01)
      expect(result.find((post) => post.status === 'draft')).toBeUndefined() // No draft posts
    })

    it('should return an empty array when no posts are found', async () => {
      // Setup mock to return empty array
      mockedExecuteGraphQL.mockResolvedValueOnce({
        listBlogPosts: {
          items: []
        }
      })

      // Call the function
      const result = await fetchAllBlogPosts()

      // Assertions
      expect(mockedExecuteGraphQL).toHaveBeenCalledTimes(1)
      expect(result).toEqual([])
    })

    it('should throw an error when the GraphQL query fails', async () => {
      // Setup mock to throw an error
      const error = new Error('GraphQL error')
      mockedExecuteGraphQL.mockRejectedValueOnce(error)

      // Call the function and expect it to throw
      await expect(fetchAllBlogPosts()).rejects.toThrow('GraphQL error')

      expect(mockedExecuteGraphQL).toHaveBeenCalledTimes(1)
    })
  })
})
