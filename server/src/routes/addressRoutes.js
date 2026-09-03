import express from 'express'
import {
  getAddresses, addAddress, updateAddress,
  deleteAddress, setDefaultAddress,
} from '../controllers/addressController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// All address routes require authentication
router.use(requireAuth)

router.get('/',                  getAddresses)
router.post('/',                 addAddress)
router.patch('/:id',             updateAddress)
router.delete('/:id',            deleteAddress)
router.patch('/:id/default',     setDefaultAddress)

export default router
