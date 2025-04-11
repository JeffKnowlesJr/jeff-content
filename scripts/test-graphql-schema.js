#!/usr/bin/env node

/**
 * GraphQL Schema Validation Script
 *
 * This script verifies that our GraphQL queries match the AppSync schema.
 * It sends an introspection query to get the schema, then validates our queries.
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set production mode for testing
process.env.NODE_ENV = 'production'

// ANSI color codes for output formatting
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m'
}

// Load environment variables
const APPSYNC_API_URL = process.env.NEXT_PUBLIC_APPSYNC_API_URL
const APPSYNC_API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY

// Read our GraphQL queries from the file
const readGraphQLQueries = () => {
  try {
    const queriesPath = path.resolve(
      process.cwd(),
      'src',
      'graphql',
      'queries.ts'
    )
    const queriesContent = fs.readFileSync(queriesPath, 'utf8')

    // Extract GraphQL query strings from the file
    const queryMatches = queriesContent.match(/`\s*(query[\s\S]*?)`/g) || []

    return queryMatches.map((match) => {
      // Clean up the query string
      return match.replace(/`\s*/g, '').replace(/\s*`/g, '').trim()
    })
  } catch (error) {
    console.error(
      `${COLORS.RED}Error reading GraphQL queries:${COLORS.RESET}`,
      error
    )
    return []
  }
}

// Send an introspection query to get the schema
const fetchSchema = () => {
  return new Promise((resolve, reject) => {
    if (!APPSYNC_API_URL || !APPSYNC_API_KEY) {
      reject(new Error('Missing AppSync API URL or API Key'))
      return
    }

    const introspectionQuery = {
      query: `
        query IntrospectionQuery {
          __schema {
            queryType {
              name
              fields {
                name
                args {
                  name
                  type {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
            types {
              name
              kind
              fields {
                name
                type {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      `
    }

    const requestData = JSON.stringify(introspectionQuery)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APPSYNC_API_KEY
      }
    }

    const req = https.request(APPSYNC_API_URL, options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data)
          if (parsedData.errors) {
            console.error(
              `${COLORS.RED}GraphQL errors:${COLORS.RESET}`,
              parsedData.errors
            )
            reject(new Error('GraphQL errors in introspection query'))
            return
          }
          resolve(parsedData.data)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(requestData)
    req.end()
  })
}

// Test if a query field exists in the schema
const validateQueryField = (schema, queryName) => {
  const queryType = schema.__schema.queryType
  const queryFields = queryType.fields

  const field = queryFields.find((f) => f.name === queryName)
  return !!field
}

// Test if a type has a specific field
const validateTypeField = (schema, typeName, fieldName) => {
  const type = schema.__schema.types.find((t) => t.name === typeName)

  if (!type || !type.fields) {
    return false
  }

  return type.fields.some((f) => f.name === fieldName)
}

// Validate our queries against the schema
const validateQueries = (schema, queries) => {
  console.log(`\n${COLORS.BLUE}Validating GraphQL Queries...${COLORS.RESET}\n`)

  let allValid = true

  for (const query of queries) {
    // Extract query name
    const queryMatch = query.match(/query\s+(\w+)/)
    if (!queryMatch) {
      console.log(
        `${COLORS.YELLOW}Warning: Could not parse query name${COLORS.RESET}`
      )
      console.log(query)
      continue
    }

    const queryName = queryMatch[1]
    console.log(`${COLORS.CYAN}Validating query: ${queryName}${COLORS.RESET}`)

    // Extract fields being queried
    if (query.includes('getBlogPost')) {
      // Check if getBlogPost exists
      if (!validateQueryField(schema, 'getBlogPost')) {
        console.log(
          `${COLORS.RED}Error: Query field 'getBlogPost' does not exist in schema${COLORS.RESET}`
        )
        allValid = false
      } else {
        console.log(
          `${COLORS.GREEN}✓ Query field 'getBlogPost' exists${COLORS.RESET}`
        )
      }

      // Check BlogPost type fields
      const blogPostFields = query.match(/getBlogPost.*?\{([\s\S]*?)\}/)
      if (blogPostFields && blogPostFields[1]) {
        const fields = blogPostFields[1].trim().split(/\s+/).filter(Boolean)

        for (const field of fields) {
          if (!validateTypeField(schema, 'BlogPost', field)) {
            console.log(
              `${COLORS.RED}Error: BlogPost field '${field}' does not exist in schema${COLORS.RESET}`
            )
            allValid = false
          } else {
            console.log(
              `${COLORS.GREEN}✓ BlogPost field '${field}' exists${COLORS.RESET}`
            )
          }
        }
      }
    }

    if (query.includes('listBlogPosts')) {
      // Check if listBlogPosts exists
      if (!validateQueryField(schema, 'listBlogPosts')) {
        console.log(
          `${COLORS.RED}Error: Query field 'listBlogPosts' does not exist in schema${COLORS.RESET}`
        )
        allValid = false
      } else {
        console.log(
          `${COLORS.GREEN}✓ Query field 'listBlogPosts' exists${COLORS.RESET}`
        )
      }

      // Since listBlogPosts returns a connection type, validate that connection has items field
      if (!validateTypeField(schema, 'BlogPostConnection', 'items')) {
        console.log(
          `${COLORS.RED}Error: BlogPostConnection field 'items' does not exist in schema${COLORS.RESET}`
        )
        allValid = false
      } else {
        console.log(
          `${COLORS.GREEN}✓ BlogPostConnection field 'items' exists${COLORS.RESET}`
        )
      }

      // Validate fields inside items
      const itemsFields = query.match(/items\s*\{([\s\S]*?)\}/)
      if (itemsFields && itemsFields[1]) {
        const fields = itemsFields[1].trim().split(/\s+/).filter(Boolean)

        for (const field of fields) {
          if (!validateTypeField(schema, 'BlogPost', field)) {
            console.log(
              `${COLORS.RED}Error: BlogPost field '${field}' does not exist in schema${COLORS.RESET}`
            )
            allValid = false
          } else {
            console.log(
              `${COLORS.GREEN}✓ BlogPost field '${field}' exists${COLORS.RESET}`
            )
          }
        }
      }
    }
  }

  return allValid
}

// Test our GraphQL queries against production API
const testQueries = async () => {
  try {
    console.log(
      `\n${COLORS.MAGENTA}Testing GraphQL Queries Against Production API${COLORS.RESET}\n`
    )

    // Check environment variables
    if (!APPSYNC_API_URL) {
      console.error(
        `${COLORS.RED}Error: Missing NEXT_PUBLIC_APPSYNC_API_URL environment variable${COLORS.RESET}`
      )
      process.exit(1)
    }

    if (!APPSYNC_API_KEY) {
      console.error(
        `${COLORS.RED}Error: Missing NEXT_PUBLIC_APPSYNC_API_KEY environment variable${COLORS.RESET}`
      )
      process.exit(1)
    }

    console.log(`${COLORS.GREEN}✓ Environment variables found${COLORS.RESET}`)
    console.log(
      `${COLORS.BLUE}AppSync API URL: ${APPSYNC_API_URL}${COLORS.RESET}`
    )

    // Read our GraphQL queries
    const queries = readGraphQLQueries()
    console.log(
      `${COLORS.BLUE}Found ${queries.length} GraphQL queries${COLORS.RESET}`
    )

    // Fetch the schema
    console.log(`${COLORS.BLUE}Fetching GraphQL schema...${COLORS.RESET}`)
    const schema = await fetchSchema()
    console.log(
      `${COLORS.GREEN}✓ Successfully fetched GraphQL schema${COLORS.RESET}`
    )

    // Validate our queries against the schema
    const allValid = validateQueries(schema, queries)

    if (allValid) {
      console.log(
        `\n${COLORS.GREEN}All GraphQL queries are valid against the schema!${COLORS.RESET}`
      )
    } else {
      console.log(
        `\n${COLORS.RED}Some GraphQL queries have issues. Please fix them before deploying.${COLORS.RESET}`
      )
      process.exit(1)
    }
  } catch (error) {
    console.error(
      `${COLORS.RED}Error testing GraphQL queries:${COLORS.RESET}`,
      error
    )
    process.exit(1)
  }
}

// Run the tests
testQueries()
