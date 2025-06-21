export const login = (req, res) => {
  const { username, password } = req.body
  // ✅ validate credentials (dummy for now)
  if (username === 'user' && password === 'pass') {
    res.status(200).json({ token: 'mock-jwt-token' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
}
