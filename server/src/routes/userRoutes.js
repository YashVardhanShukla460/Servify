import express from 'express'
import { getMe, updateMe, updatePassword } from '../controllers/userController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/me',            requireAuth, getMe)
router.patch('/me',          requireAuth, updateMe)
router.patch('/me/password', requireAuth, updatePassword)

export default router
