import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()

  return (
    <header className="header">
      <div className="container">
        <h1>작업치료 평가 툴</h1>
        <p>ICF 기반 종합 평가 시스템</p>
      </div>
      <nav className="navigation">
        <div className="container">
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''}
              >
                홈
              </Link>
            </li>
            <li>
              <Link 
                to="/physical-function" 
                className={location.pathname === '/physical-function' ? 'active' : ''}
              >
                신체기능 평가
              </Link>
            </li>
            <li>
              <Link 
                to="/activity-participation" 
                className={location.pathname === '/activity-participation' ? 'active' : ''}
              >
                활동/참여 평가
              </Link>
            </li>
            <li>
              <Link 
                to="/cognitive-assessment" 
                className={location.pathname === '/cognitive-assessment' ? 'active' : ''}
              >
                인지평가
              </Link>
            </li>
            <li>
              <Link 
                to="/whodas" 
                className={location.pathname === '/whodas' ? 'active' : ''}
              >
                WHODAS 2.0
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header
