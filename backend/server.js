import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import connectDB from './config/db.conn.js'

import taskRoutes from '../backend/routes/tasks.routes.js'

import { notFound, errorHandler } from './middleware/error.middleware.js'

dotenv.config()

const app = express()

app.use(express.json({ limit: '30mb', type: 'application/json' }))

var corsOrigin = { origin: 'http://localhost:3001' }
app.use(cors())

//upload file at temp location
app.use(fileUpload({ useTempFiles: true }))

connectDB()

app.get('/', (req, res) => {
  res.send('health check route')
})

app.use('/api/v1/tasks', taskRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port number ${PORT}`
      .brightMagenta
  )
)
