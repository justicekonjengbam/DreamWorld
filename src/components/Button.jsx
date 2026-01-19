import { useButtonSound } from '../hooks/useButtonSound'
import './Button.css'

function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  const playButtonSound = useButtonSound()

  const handleClick = (e) => {
    playButtonSound()
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={handleClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
