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
  slug: string
  excerpt?: string
  content?: string
  author: string
  status: string
  datePublished?: string
  dateModified?: string
  tags?: string[]
  readingTime?: number | string
  featuredImage?: string
  thumbnailImage?: string
  contentImage?: string
  projectType: string
  projectStatus?: string
  githubUrl?: string
  liveUrl?: string
  techStack?: string[]
  featured?: boolean
  publishedAt?: string
}

export interface ProjectCategory {
  name: string
  slug: string
  description: string
  count: number
  projects: Project[]
}
