declare module '*.md' {
  const content: string
  export default content
}

declare module '*.mdx' {
  import { ComponentType } from 'react'

  export const frontMatter: {
    title: string
    description: string
    date: string
    tags: string[]
    author: {
      name: string
      picture: string
    }
    ogImage: {
      url: string
    }
    [key: string]: any
  }

  const MDXComponent: ComponentType

  export default MDXComponent
}

// For remark plugins
declare module 'remark-*' {
  import { Plugin } from 'unified'
  const plugin: Plugin
  export default plugin
}

// For rehype plugins
declare module 'rehype-*' {
  import { Plugin } from 'unified'
  const plugin: Plugin
  export default plugin
}
