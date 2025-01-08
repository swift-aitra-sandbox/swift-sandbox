import express from 'express'
import type { Request, Response } from 'express'
import { ProjectQueries } from './projects.queries'

export const projectsRouter = express.Router()
const projectQueries = new ProjectQueries()

// GET /api/projects - Get all projects
projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await projectQueries.getAllProjects()
    res.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// GET /api/projects/:id - Get project by ID
projectsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const project = await projectQueries.getProjectById(id)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// POST /api/projects - Create new project
projectsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const projectData = req.body
    const newProject = await projectQueries.createProject(projectData)
    res.status(201).json({ project: newProject })
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// PUT /api/projects/:id - Update project
projectsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body
    const updatedProject = await projectQueries.updateProject(id, updates)
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json({ project: updatedProject })
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// DELETE /api/projects/:id - Delete project
projectsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await projectQueries.deleteProject(id)
    
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
}) 