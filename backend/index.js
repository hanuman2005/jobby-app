import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)

app.get('/', (req, res) => {
  res.send('Jobby Backend API Running')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
