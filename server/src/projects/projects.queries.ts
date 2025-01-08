import { db } from '../db'

interface Project {
  id: string
  title: string
  description: string
  studentId: string
  status: 'draft' | 'in_progress' | 'completed'
  createdAt: Date
  updatedAt: Date
}

interface CreateProjectData {
  title: string
  description: string
  studentId: string
  status?: 'draft' | 'in_progress' | 'completed'
}

interface UpdateProjectData {
  title?: string
  description?: string
  status?: 'draft' | 'in_progress' | 'completed'
}

export class ProjectQueries {
  async getAllProjects(): Promise<Project[]> {
    const query = `
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `
    const result = await db.query(query)
    return result.rows
  }

  async getProjectById(id: string): Promise<Project | null> {
    const query = `
      SELECT * FROM projects 
      WHERE id = $1
    `
    const result = await db.query(query, [id])
    return result.rows[0] || null
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    const query = `
      INSERT INTO projects (
        title, 
        description, 
        student_id, 
        status,
        created_at,
        updated_at
      ) 
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `
    const values = [
      data.title,
      data.description,
      data.studentId,
      data.status || 'draft'
    ]
    
    const result = await db.query(query, values)
    return result.rows[0]
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project | null> {
    const setClause = Object.entries(data)
      .map(([key, _], index) => `${key} = $${index + 2}`)
      .join(', ')
    
    const query = `
      UPDATE projects 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    
    const values = [id, ...Object.values(data)]
    const result = await db.query(query, values)
    return result.rows[0] || null
  }

  async deleteProject(id: string): Promise<boolean> {
    const query = `
      DELETE FROM projects 
      WHERE id = $1
      RETURNING id
    `
    const result = await db.query(query, [id])
    return result.rowCount > 0
  }
} 