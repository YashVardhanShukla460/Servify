/**
 * Footer — Bottom section of public pages
 */
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                Servi<span className="text-blue-400">fy</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Connecting you with verified home service professionals.
              Quality service, on your schedule.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Cleaning', 'Electrical', 'Plumbing', 'AC Repair', 'Carpentry'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-blue-400 transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Become a Professional</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} Servify. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
