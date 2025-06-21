import Cookies from 'js-cookie'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showSubmissionError: false,
    errMsg: '',
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    history.replace('/')
  }

  submitFailure = errMsg => {
    this.setState({showSubmissionError: true, errMsg})
  }

  submitLoginForm = async event => {
    event.preventDefault()
    const url = 'https://apis.ccbp.in/login'

    const {usernameInput, passwordInput} = this.state

    const userData = {
      username: usernameInput,
      password: passwordInput,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => (
    <div className="input-container">
      <label htmlFor="username">USERNAME</label>
      <input
        id="username"
        placeholder="username"
        type="text"
        onChange={this.onChangeUsername}
      />
    </div>
  )

  renderPasswordField = () => (
    <div className="input-container">
      <label htmlFor="password">PASSWORD</label>
      <input
        id="password"
        placeholder="password"
        type="password"
        onChange={this.onChangePassword}
      />
    </div>
  )

  renderLoginForm = () => {
    const {showSubmissionError, errMsg} = this.state
    return (
      <form onSubmit={this.submitLoginForm} className="form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
        {this.renderUsernameField()}
        {this.renderPasswordField()}
        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmissionError && <p className="error-message">{errMsg}</p>}
      </form>
    )
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return <div className="loginform-container">{this.renderLoginForm()}</div>
  }
}

export default LoginForm
