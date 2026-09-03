import Notification from '../models/Notification.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ── GET NOTIFICATIONS ─────────────────────────
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const unreadCount = await Notification.countDocuments({ user: req.user.userId, isRead: false })

    return sendSuccess(res, { notifications, unreadCount })
  } catch (error) { next(error) }
}

// ── MARK AS READ ──────────────────────────────
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isRead: true },
      { new: true }
    )
    if (!notification) return sendError(res, 'Notification not found.', 404)
    
    return sendSuccess(res, { notification })
  } catch (error) { next(error) }
}

// ── MARK ALL AS READ ──────────────────────────
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    )
    return sendSuccess(res, {}, 'All notifications marked as read.')
  } catch (error) { next(error) }
}
