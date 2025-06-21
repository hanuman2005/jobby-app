import express from 'express'
import { getAllJobs, getJobById } from '../controllers/jobController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getAllJobs)
router.get('/:id', authMiddleware, getJobById)

export default router
