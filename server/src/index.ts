import express from 'express'
import { projectsRouter } from './projects/projects.routes'

const app = express()

// Register routes
app.use('/api/projects', projectsRouter)

// ... rest of server setup 