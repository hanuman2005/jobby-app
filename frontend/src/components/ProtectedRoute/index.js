import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const ProtectedRoute = props => {
  const token = Cookies.get('jwt_token')
  return token === undefined ? <Redirect to="/login" /> : <Route {...props} />
}

export default ProtectedRoute
