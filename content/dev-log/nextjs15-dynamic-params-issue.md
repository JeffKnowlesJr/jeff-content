---
title: 'Dealing with Next.js 15 Dynamic Route Params & AI Coding Assistant Challenges'
slug: 'nextjs15-dynamic-params-issue'
excerpt: 'Troubleshooting Next.js 15 dynamic route params issues and lessons learned when working with AI coding assistants.'
datePublished: '2024-05-02'
author: 'Jeffrey Knowles Jr (Compiled with assistance from AI)'
tags: ['Next.js', 'Development', 'Troubleshooting', 'AI']
status: 'published'
---

# Next.js 15 Dynamic Route Params Issue & AI Troubleshooting Challenges

## The Technical Issue

After upgrading to Next.js 15, our dynamic routes (`[slug]` pages) stopped working with this error:

```
Error: Route "/blog/[slug]" used `params.slug`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
```

This error appears in both blog and project detail pages. The specific issue is that Next.js 15 now requires `params` to be awaited before accessing its properties, a breaking change from previous versions.

The problematic code looked like:

```typescript
// In blog/[slug]/page.tsx
const post = await getContentBySlug<BlogPost>('blog', params.slug)
```

This pattern worked in Next.js 14, but in version 15, we need to await the entire params object first.

## The Solution

After extensive testing, there are several approaches that work with Next.js 15 dynamic route parameters:

### Solution 1: Use String() to coerce the slug

Next.js 15 wants params to be awaited, but using `String()` seems to bypass this requirement:

```typescript
// Works in Next.js 15
export default async function ProjectDetailPage({
  params
}: {
  params: Params
}) {
  const slug = String(params.slug)
  const project = await getContentBySlug<Project>('projects', slug)
  // Rest of component...
}
```

### Solution 2: Explicitly await the params object

```typescript
// Works in Next.js 15
export default async function ProjectDetailPage({
  params
}: {
  params: Params
}) {
  const resolvedParams = await params
  const project = await getContentBySlug<Project>(
    'projects',
    resolvedParams.slug
  )
  // Rest of component...
}
```

### Solution 3: Access through props without destructuring

```typescript
// Works in Next.js 15
export default async function ProjectDetailPage(props: { params: Params }) {
  // Directly use props.params.slug without destructuring
  const project = await getContentBySlug<Project>('projects', props.params.slug)
  // Rest of component...
}
```

### Important Notes

1. **Apply to both page component and generateMetadata function**: Whatever approach you use, ensure you apply it consistently across both the component and metadata functions.

2. **Next.js 15 breaking change**: This is a significant breaking change from Next.js 14, where direct access to params.slug worked without issues.

3. **Strange behavior**: Interestingly, some dynamic routes might still work despite showing these errors in the console, making this issue particularly challenging to debug.

4. **Don't mix approaches**: Use the same approach throughout your codebase for consistency.

For our implementation, we settled on Solution 1 (using String() to coerce the slug), as it provides the cleanest solution without requiring deeply nested object access.

## Challenges with AI Coding Assistance

During the troubleshooting process, I encountered several challenges when working with an AI assistant that provide valuable lessons:

### 1. AI Tendency to Apply Pattern-Matching Without Understanding

The AI repeatedly tried similar solutions without truly understanding the root cause of the issue. It kept applying variations of the same approach even after being told those solutions weren't working.

**Lesson**: AI assistants often rely on pattern matching rather than true understanding. Don't assume the AI understands the context or the specific issue you're facing.

### 2. Lack of Careful Error Log Analysis

Despite having access to detailed error logs pointing to the exact problem, the AI kept proposing solutions without carefully analyzing what the errors were actually saying.

**Lesson**: Make sure to explicitly guide the AI to focus on specific parts of error logs, or extract the most relevant information yourself before asking for help.

### 3. Rushing to Solutions Without Verification

The AI kept implementing multiple changes across files without verifying if individual changes were working. This made troubleshooting more complicated than necessary.

**Lesson**: Ask the AI to focus on one small change at a time, and verify that change works before moving on to others.

### 4. Blanket Changes Without Confirmation

The AI applied similar patterns across multiple files without confirming if the pattern was appropriate in each context.

**Lesson**: Request that the AI explain exactly what change it's making and why before proceeding with implementation.

## Best Practices for Working with AI Coding Assistants

Based on this experience, here are some recommendations for more effective collaboration with AI coding assistants:

1. **Be specific about the problem**: Provide exact error messages and point to specific lines of code.

2. **Request small, focused changes**: Ask for one change at a time rather than comprehensive solutions.

3. **Verify before proceeding**: Test each change before moving on to additional ones.

4. **Ask the AI to explain its reasoning**: Have the AI justify why it believes a particular solution will work.

5. **Provide feedback on what worked/didn't work**: Explicitly tell the AI which approaches have failed and why.

6. **Set constraints**: Tell the AI what kind of solution you're looking for (e.g., minimal changes).

7. **Be willing to restart**: If the AI seems stuck in a pattern, consider starting fresh with a new, more focused query.

## Conclusion

The Next.js 15 params issue is a breaking change that requires developers to await dynamic params before accessing their properties. While AI coding assistants can be helpful, they still require human guidance and oversight, especially when diagnosing subtle issues or understanding error contexts.

By approaching AI collaboration with the right expectations and structure, we can maximize its benefits while avoiding the frustration of unproductive troubleshooting cycles.
