import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import { getPendingWorkers, updateWorkerStatus } from '../../services/adminService'

const AdminDashboardPage = () => {
  const { user } = useSelector(state => state.auth)
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { workers } = await getPendingWorkers()
      setWorkers(workers)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id, status) => {
    try {
      await updateWorkerStatus(id, status)
      await load()
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="card bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard 👑</h1>
          <p className="mt-1 opacity-90">Manage the marketplace, approve workers, and keep things running smoothly.</p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 pt-2">Pending Worker Approvals</h2>
        
        {loading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}
        
        {!loading && workers.length === 0 && (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-4xl mb-4">✅</div>
            <p>All caught up! No pending worker approvals.</p>
          </div>
        )}

        <div className="space-y-4">
          {workers.map(w => (
            <div key={w._id} className="card flex flex-col md:flex-row gap-6">
              <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-500 overflow-hidden">
                {w.user?.profileImage ? <img src={w.user.profileImage} alt="" className="w-full h-full object-cover" /> : w.user?.name?.[0]}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{w.user?.name}</h3>
                <div className="text-sm text-gray-500 mb-2">Joined: {new Date(w.createdAt).toLocaleDateString()}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><span className="font-medium text-gray-800">Email:</span> {w.user?.email}</div>
                  <div><span className="font-medium text-gray-800">Bio:</span> {w.bio || 'Not provided'}</div>
                  <div><span className="font-medium text-gray-800">Experience:</span> {w.experience} years</div>
                  <div><span className="font-medium text-gray-800">Skills:</span> {w.skills?.join(', ') || 'None listed'}</div>
                  <div><span className="font-medium text-gray-800">Service Areas:</span> {w.serviceAreas?.join(', ') || 'None listed'}</div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2 justify-center w-full md:w-32">
                <button onClick={() => handleStatus(w._id, 'approved')} className="btn-primary bg-green-600 hover:bg-green-700 border-none py-2 text-sm w-full">
                  Approve
                </button>
                <button onClick={() => handleStatus(w._id, 'rejected')} className="btn-secondary py-2 text-sm w-full text-red-600 border-red-600 hover:bg-red-50">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboardPage
