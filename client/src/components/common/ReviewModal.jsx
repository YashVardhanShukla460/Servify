import { useState } from 'react'
import Spinner from './Spinner'
import { createReview } from '../../services/reviewService'

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await createReview({ bookingId: booking._id, rating, comment })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-1">Rate your experience</h2>
        <p className="text-sm text-gray-500 mb-6">Service provided by {booking.worker?.user?.name}</p>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label text-center block">Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button type="button" key={star} onClick={() => setRating(star)}
                  className="text-4xl focus:outline-none transition-transform hover:scale-110">
                  <span className={star <= rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Review (Optional)</label>
            <textarea rows="3" className="input-field resize-none" 
              placeholder="How was the service?"
              value={comment} onChange={e => setComment(e.target.value)}></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary flex-1 flex justify-center items-center" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal
