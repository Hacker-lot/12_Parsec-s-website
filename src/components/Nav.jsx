import { NavLink } from 'react-router-dom'

export default function Nav() {
  const linkClass = ({ isActive }) =>
    'nav__link' + (isActive ? ' is-active' : '')

  return (
    <header className="nav">
      <NavLink to="/" className="nav__brand" data-cursor>
        12_PARSEC<span className="nav__brand-dot">.</span>
      </NavLink>

      <nav className="nav__links" aria-label="Primary">
        <NavLink to="/work" className={linkClass} data-cursor>
          WORK
        </NavLink>
        <NavLink to="/projects" className={linkClass} data-cursor>
          PROJECTS
        </NavLink>
        <NavLink to="/about" className={linkClass} data-cursor>
          ABOUT
        </NavLink>
        <NavLink to="/radio" className={linkClass} data-cursor>
          RADIO
        </NavLink>
      </nav>

      <div className="nav__status">
        SYS<span className="nav__status-dot" />ONLINE
      </div>
    </header>
  )
}
