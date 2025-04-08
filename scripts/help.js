#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.join(__dirname, '..', 'package.json')

try {
  // Read and parse package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const scripts = packageJson.scripts || {}

  console.log('\n📋 Available commands:\n')

  // Calculate the longest script name for alignment
  const longestNameLength = Object.keys(scripts).reduce(
    (max, name) => Math.max(max, name.length),
    0
  )

  // Display all available scripts
  Object.entries(scripts).forEach(([name, command]) => {
    const paddedName = name.padEnd(longestNameLength)
    console.log(`  npm run ${paddedName}  →  ${command}`)
  })

  console.log('\nRun any command with: npm run <command-name>')
  console.log('For more details, check package.json\n')
} catch (error) {
  console.error('Error reading package.json:', error.message)
  process.exit(1)
}
