/**
 * Booking Controller
 *
 * Handles creation, status updates, and retrieval of bookings.
 */
import Booking from '../models/Booking.js'
import Worker from '../models/Worker.js'
import Address from '../models/Address.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ── CREATE BOOKING ──────────────────────────────
export const createBooking = async (req, res, next) => {
  try {
    const { workerId, serviceId, addressId, date, timeSlot, notes } = req.body
    const customerId = req.user.userId

    // 1. Validate inputs
    if (!workerId || !serviceId || !addressId || !date || !timeSlot) {
      return sendError(res, 'All fields are required.', 400)
    }

    const bookingDate = new Date(date)
    if (bookingDate < new Date().setHours(0,0,0,0)) {
      return sendError(res, 'Cannot book in the past.', 400)
    }

    // 2. Check worker and service
    const worker = await Worker.findById(workerId).populate('services')
    if (!worker || worker.status !== 'approved') {
      return sendError(res, 'Worker not available.', 404)
    }

    const offersService = worker.services.find(s => s._id.toString() === serviceId)
    if (!offersService) {
      return sendError(res, 'Worker does not offer this service.', 400)
    }

    // 3. Get pricing for the service
    const pricingEntry = worker.pricing.find(p => p.service.toString() === serviceId)
    const price = pricingEntry ? pricingEntry.price : offersService.basePrice

    // 4. Check address
    const address = await Address.findOne({ _id: addressId, user: customerId })
    if (!address) {
      return sendError(res, 'Address not found.', 404)
    }

    // 5. Conflict detection (check if worker is already booked for this date/time)
    // For simplicity in Phase 9, we check exact date and overlapping time.
    const conflictingBooking = await Booking.findOne({
      worker: workerId,
      date: bookingDate,
      status: { $in: ['pending', 'accepted', 'in_progress'] },
      $or: [
        { startTime: { $lt: timeSlot.end }, endTime: { $gt: timeSlot.start } }
      ]
    })

    if (conflictingBooking) {
      return sendError(res, 'The worker is already booked for this time slot.', 409)
    }

    // 6. Create booking
    const booking = await Booking.create({
      customer: customerId,
      worker: workerId,
      service: serviceId,
      address: {
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      },
      date: bookingDate,
      startTime: timeSlot.start,
      endTime: timeSlot.end,
      totalAmount: price,
      notes: notes?.trim()
    })

    return sendSuccess(res, { booking }, 'Booking created successfully.', 201)
  } catch (error) { next(error) }
}

// ── GET CUSTOMER BOOKINGS ───────────────────────
export const getCustomerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user.userId })
      .populate('worker')
      .populate({ path: 'worker', populate: { path: 'user', select: 'name phone profileImage' } })
      .populate('service', 'name category')
      .sort({ date: -1, createdAt: -1 })
      .lean()

    return sendSuccess(res, { bookings })
  } catch (error) { next(error) }
}

// ── GET WORKER BOOKINGS ─────────────────────────
export const getWorkerBookings = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ user: req.user.userId })
    if (!worker) return sendError(res, 'Worker profile not found.', 404)

    const bookings = await Booking.find({ worker: worker._id })
      .populate('customer', 'name phone profileImage')
      .populate('service', 'name category')
      .sort({ date: -1, createdAt: -1 })
      .lean()

    return sendSuccess(res, { bookings })
  } catch (error) { next(error) }
}

// ── UPDATE BOOKING STATUS ───────────────────────
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const bookingId = req.params.id
    const { userId, role } = req.user

    const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled', 'in_progress', 'completed']
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status.', 400)
    }

    const booking = await Booking.findById(bookingId)
    if (!booking) return sendError(res, 'Booking not found.', 404)

    // Role-based permissions
    if (role === 'customer') {
      if (booking.customer.toString() !== userId) return sendError(res, 'Unauthorized', 403)
      if (status !== 'cancelled') return sendError(res, 'Customers can only cancel bookings.', 400)
      if (['completed', 'rejected'].includes(booking.status)) return sendError(res, 'Cannot cancel a completed or rejected booking.', 400)
    } 
    else if (role === 'worker') {
      const worker = await Worker.findOne({ user: userId })
      if (booking.worker.toString() !== worker._id.toString()) return sendError(res, 'Unauthorized', 403)
      if (status === 'cancelled') return sendError(res, 'Workers must reject, not cancel.', 400)
    }

    booking.status = status
    await booking.save()

    return sendSuccess(res, { booking }, `Booking marked as ${status}.`)
  } catch (error) { next(error) }
}
