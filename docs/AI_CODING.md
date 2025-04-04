# AI Coding Guidelines for JKJR Portfolio & Blog

## Overview

This document outlines the rules and guidelines for AI-assisted coding in the JKJR Portfolio & Blog project. These guidelines ensure consistent, high-quality code and maintainable development practices.

## Core Principles

1. **No Placeholder Content** - All content must be real and meaningful. Placeholder text, lorem ipsum, and "coming soon" messages are not acceptable.

2. **No Placeholder Images** - Never create empty placeholder images or dummy image files. Only use real images that exist in the project. If images are missing, document the issue rather than creating placeholder files.

3. **Documentation First** - Document what and why before writing how.

4. **Type Safety** - Use TypeScript for all code. Avoid using `any` unless absolutely necessary.

5. **Component-Based Architecture** - Break UI into reusable components.

6. **Performance Focus** - Optimize for performance from the start.

7. **Accessibility First** - Ensure all components are accessible.

8. **Testing Required** - All code must be testable and include tests when appropriate.

## Development Workflow

1. **Planning Phase**

   - Define requirements clearly
   - Create technical specifications
   - Design component architecture
   - Document API interfaces

2. **Implementation Phase**

   - Write type definitions first
   - Implement components with proper TypeScript typings
   - Follow the style guide
   - Use comments for complex logic

3. **Review Phase**

   - Ensure code meets standards
   - Check for type safety
   - Verify accessibility
   - Run performance tests

4. **Documentation Phase**
   - Document APIs
   - Write usage examples
   - Update technical documentation
   - Document known limitations

## Code Style

1. **Indentation & Formatting**

   - Use 2 spaces for indentation
   - Follow Prettier configuration
   - Run formatter before committing

2. **Naming Conventions**

   - Use camelCase for variables and functions
   - Use PascalCase for types and components
   - Use UPPER_CASE for constants
   - Use kebab-case for file names

3. **Error Handling**
   - Use try/catch for error-prone operations
   - Return appropriate error responses
   - Log errors with context
   - Provide user-friendly error messages

## Version Control

1. **Commit Messages**

   - Use present tense
   - Be descriptive but concise
   - Reference issues where applicable

2. **Branching Strategy**
   - Use feature branches
   - Create PRs for review
   - Keep commits focused

## Security Guidelines

1. **Data Protection**

   - Never commit sensitive information
   - Use environment variables
   - Validate all inputs
   - Sanitize outputs

2. **Authentication**
   - Implement proper auth checks
   - Use secure sessions
   - Apply least privilege principle

## Maintenance

1. **Dependencies**

   - Keep dependencies updated
   - Audit for vulnerabilities
   - Document major version changes

2. **Monitoring**
   - Implement appropriate logging
   - Watch for deprecated features
   - Monitor performance metrics

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag)
