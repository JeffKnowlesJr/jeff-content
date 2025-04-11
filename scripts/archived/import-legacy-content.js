import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

// Define content types
const contentTypes = ['blog', 'projects']

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created directory: ${dirPath}`)
  }
}

// Function to import a specific content type
function importContentType(type) {
  const legacyDir = path.join(rootDir, 'legacy.app', type)
  const targetDir = path.join(rootDir, 'content', type)

  // Create target directory if it doesn't exist
  ensureDirectoryExists(targetDir)

  // Check if legacy directory exists
  if (!fs.existsSync(legacyDir)) {
    console.warn(`Legacy directory not found: ${legacyDir}`)
    return 0
  }

  // Read legacy directory
  const files = fs.readdirSync(legacyDir)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  // Copy each file
  markdownFiles.forEach((fileName) => {
    const sourcePath = path.join(legacyDir, fileName)
    const targetPath = path.join(targetDir, fileName)

    fs.copyFileSync(sourcePath, targetPath)
    console.log(`Imported ${fileName}`)
  })

  return markdownFiles.length
}

// Function to import all content
function importAllContent() {
  console.log('Starting content import from legacy app...\n')

  // Ensure the content directory exists
  ensureDirectoryExists(path.join(rootDir, 'content'))

  // Import each content type
  contentTypes.forEach((type) => {
    const importCount = importContentType(type)
    console.log(`\nImported ${importCount} ${type} files\n`)
  })

  console.log('Import process completed!')
}

// Execute the import
importAllContent()
