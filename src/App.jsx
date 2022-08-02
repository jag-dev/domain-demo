import UAuth from '@uauth/js'
import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'

import './App.css';

const uauth = new UAuth({
    clientID: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: "openid wallet"
  })

const App: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [user, setUser] = useState()

  // Check to see if the user is inside the cache
  useEffect(() => {
    setLoading(true)
    uauth
      .user()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Login with a popup and save the user
  const handleLogin = () => {
    setLoading(true)
    uauth
      .loginWithPopup()
      .then(() => uauth.user().then(setUser))
      .catch(setError)
      .finally(() => setLoading(false))
  }

  // Logout and delete user
  const handleLogout = () => {
    setLoading(true)
    uauth
      .logout()
      .then(() => setUser(undefined))
      .catch(setError)
      .finally(() => setLoading(false))
  }

  if (loading) {
    return <>Loading...</>
  }

  if (error) {
    console.error(error)
    return <>{String(error.stack)}</>
  }

  if (user) {
    return (
      <>
        <pre className="positioned">{JSON.stringify(user, null, 2)}</pre>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </>
    )
  }

  return <>
    <h1 className="title positioned">Authentication Demo</h1>
    <button className="login-btn positioned" onClick={handleLogin}></button>
   </>
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

export default App;