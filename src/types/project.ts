export interface Technology {
  name: string
  icon: string
  color: string
  url: string
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'docs' | 'npm' | 'other'
  url: string
  title: string
}

export interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  technologies: Technology[]
  links: ProjectLink[]
  featured: boolean
  publishDate: string
  content: string
  gallery?: string[]
  stats?: {
    stars?: number
    forks?: number
    downloads?: number
  }
  meta: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface ProjectCategory {
  name: string
  slug: string
  description: string
  count: number
  projects: Project[]
}
