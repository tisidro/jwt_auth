require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

//allows app use json from the body that gets passed to it inside of a request
app.use(express.json())

const posts = [
  {
    username: 'Terri',
    title: 'hi'
  },
  {
    username: 'Tina',
    title: 'meow'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

//create token (post) to authenticate request using JWT so specific users can use the request
app.post('./login', (req, res) => {
  //authenticate user

  const username = req.body.username
  const user = { name: username }

  //create json web token
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  //   to generate random secret token string for .env file enter this into terminal:
  //   node (enter) require('crypto').randomBytes(64).toString('hex')

  //return access token with our user info in it as our json
  res.json({ accessToken: accessToken })
})

//middleware to authenticate token
function authenticateToken (req, res, next) {
  const authHeader = req.headers['authorization']
  //if we have an auth header, then return the header token portion which we split on the space
  //otherwise just return undefined
  const token = authHeader && authHeader.split(' ')[1]
  //Bearer TOKEN
  if (token == null) return res.sendStatus(401) //lets them know no token

  //verifying the token with jwt.verify()
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403) //this token no longer valid so you don't have access
    req.user = user
    next()
  })
}

app.listen(3000)
