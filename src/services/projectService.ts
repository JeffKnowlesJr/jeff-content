import { Project } from '../types/project'

// This is a temporary mock service until we implement an API
export const projectService = {
  listProjects: async (): Promise<Partial<Project>[]> => {
    // Return hardcoded projects that match our markdown files exactly
    return [
      {
        id: '1',
        title: 'Project Zero Documentation',
        slug: 'project-zero-documentation',
        status: 'PUBLISHED',
        projectType: 'Full-Stack Web Application',
        author: 'Compiled with assistance from AI'
      },
      {
        id: '2',
        title: 'Project Omega Documentation',
        slug: 'project-omega-documentation',
        status: 'PUBLISHED',
        projectType: 'Full-Stack Web Application',
        author: 'Compiled with assistance from AI'
      }
    ]
  },

  getProjectBySlug: async (slug: string): Promise<Partial<Project> | null> => {
    const projects = await projectService.listProjects()
    return projects.find((project) => project.slug === slug) || null
  }
}
