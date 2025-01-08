import express from 'express'
import { usersRouter } from './users/users.routes'

const app = express()

// Register routes
app.use('/api/users', usersRouter)

// ... rest of server setup 