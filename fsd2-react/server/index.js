import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Simple health
app.get('/health', (req, res) => res.json({ ok: true }))

// Minimal /login endpoint for local development
app.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  // Dummy auth logic for local testing
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' })
  }
  if (email === 'test@example.com' && password === 'password') {
    return res.json({ success: true, user: { email, name: 'Dev User' } })
  }
  // Accept any password for other emails in dev mode
  return res.json({ success: true, user: { email } })
})

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`)
})
