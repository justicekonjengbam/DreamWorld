import { Link } from 'react-router-dom'
import { useButtonSound } from '../hooks/useButtonSound'

function SoundLink({ to, children, className, onClick }) {
  const playButtonSound = useButtonSound()

  const handleClick = (e) => {
    playButtonSound()
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default SoundLink
