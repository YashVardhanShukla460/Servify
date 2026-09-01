/**
 * MainLayout — wraps all public-facing pages
 *
 * WHAT is a Layout?
 *   A layout is a wrapper component that provides shared structure
 *   (like Navbar + Footer) to multiple pages.
 *
 * WHY use layouts?
 *   Without layouts, you would have to put <Navbar /> and <Footer />
 *   in every single page component. That is messy and hard to maintain.
 *   With a layout, you just wrap the page once and it gets both.
 *
 * HOW it works:
 *   <MainLayout>          <- Renders Navbar
 *     <HomePage />        <- Renders inside {children}
 *   </MainLayout>         <- Renders Footer
 */

import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* min-h-screen ensures footer stays at bottom even on short pages */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
