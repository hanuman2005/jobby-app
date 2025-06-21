import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const {history} = props

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>

      <ul className="mobile-section-header">
        <li>
          <Link to="/" className="nav-item">
            <AiFillHome />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-item">
            <BsFillBriefcaseFill />
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="mobile-logout-button"
            onClick={onLogout}
          >
            <FiLogOut />
          </button>
        </li>
      </ul>

      <ul className="desktop-section-header">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/jobs">Jobs</Link>
        </li>
      </ul>

      <button
        type="button"
        className="desktop-logout-button"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
