const express = require('express')
const app = express()

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

const posts = ['Some posts', 'Some better posts']

app.get('/posts', (req, res) => {
  res.render('posts', { posts: posts })
})

app.get('/posts/detail', (req, res) => {
    res.render('detail')
})

app.listen(5000, err => {
  if (err) console.log(err)

  console.log('Server is running on port 5000...')
})