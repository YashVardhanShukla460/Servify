/**
 * Spinner — Loading indicator component
 *
 * WHAT: A spinning circle shown while data is loading.
 * WHY: Users need visual feedback. Without it, they think the app is broken.
 *
 * USAGE:
 *   <Spinner />               — medium size (default)
 *   <Spinner size="sm" />     — small
 *   <Spinner size="lg" />     — large
 */

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
}

const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        border-gray-200
        border-t-blue-600
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner
