const url = 'http://localhost:3000/api/auth/admin-login'
const body = { email: 'admin@bffp.org', password: 'password123' }

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})
  .then(async (res) => {
    const text = await res.text()
    console.log('status', res.status)
    console.log('body', text)
  })
  .catch((err) => {
    console.error(err)
  })
