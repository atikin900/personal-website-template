import { Link } from 'react-router-dom'

const Header = () => {


  return (
    <header>
      <div className="container">
        <div className="logo">
          <svg className="logo-icon" width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#ff003c" strokeWidth="1.5" fill="none" />
            <path d="M2 17L12 22L22 17" stroke="#ff003c" strokeWidth="1.5" fill="none" />
            <path d="M2 12L12 17L22 12" stroke="#ff003c" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="logo-text">Иванцов Никита</span>
        </div>
        
        <nav>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/blog">Блог</Link></li>
            <li><Link to="/goals">Цели</Link></li>
          </ul>
        </nav>


      </div>
    </header>
  )
}

export default Header