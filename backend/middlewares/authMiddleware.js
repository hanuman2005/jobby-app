const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token === 'mock-jwt-token') {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

export default authMiddleware
