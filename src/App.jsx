import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Starfield from './components/Starfield.jsx'
import Scanlines from './components/Scanlines.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import Projects from './pages/Projects.jsx'
import About from './pages/About.jsx'
import AboutAsteroidGame from './components/AboutAsteroidGame.jsx'

const ORDER_TARGET = 66

export default function App() {
  const location = useLocation()
  const [orderCount, setOrderCount] = useState(0)
  const [orderUnlocked, setOrderUnlocked] = useState(() => {
    try {
      return window.localStorage.getItem('order-66-unlocked') === 'true'
    } catch {
      return false
    }
  })
  const [gameActive, setGameActive] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const countClick = (event) => {
      if (gameActive || orderUnlocked || event.button !== 0) return
      setOrderCount((current) => {
        const next = Math.min(current + 1, ORDER_TARGET)
        if (next === ORDER_TARGET) {
          setOrderUnlocked(true)
          setGameActive(true)
          try {
            window.localStorage.setItem('order-66-unlocked', 'true')
          } catch {
            // The unlock still works for this visit when storage is unavailable.
          }
        }
        return next
      })
    }
    document.addEventListener('pointerdown', countClick, true)
    return () => document.removeEventListener('pointerdown', countClick, true)
  }, [gameActive, orderUnlocked])

  const exitGame = () => {
    setGameActive(false)
    setOrderCount(0)
  }

  let orderMessage = orderUnlocked ? 'PROTOCOL STORED // HUMAN.EXE' : 'INPUT GHOST // 0x42'
  if (orderCount >= 12) orderMessage = 'THE SECOND SIX IS LISTENING'
  if (orderCount >= 33) orderMessage = 'HALF-LIFE // ORDER UNRESOLVED'
  if (orderCount >= 54) orderMessage = 'EXECUTION WINDOW APPROACHING'
  if (orderCount >= 60) orderMessage = `${ORDER_TARGET - orderCount} LOCKS REMAIN`

  return (
    <>
      <Starfield />
      <Scanlines />
      <Cursor />
      <div
        className={`order-signal${orderCount >= 6 || orderUnlocked ? ' is-awake' : ''}${orderUnlocked ? ' is-unlocked' : ''}`}
        style={{ '--order-progress': `${(orderCount / ORDER_TARGET) * 100}%` }}
        aria-hidden="true"
      >
        <span>{orderMessage}</span>
        <i />
        <small>TRACE // {orderCount.toString(16).toUpperCase().padStart(2, '0')}</small>
      </div>
      <Nav />
      <main className="site">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/about"
            element={<About orderUnlocked={orderUnlocked} onLaunchGame={() => setGameActive(true)} />}
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <AboutAsteroidGame active={gameActive} onExit={exitGame} />
    </>
  )
}
