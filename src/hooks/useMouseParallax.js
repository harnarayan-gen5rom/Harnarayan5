import { useState, useEffect } from 'react'

export function useMouseParallax(strength = 0.02) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX - window.innerWidth  / 2) * strength
      const y = (e.clientY - window.innerHeight / 2) * strength
      setOffset({ x, y })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [strength])

  return offset
}
