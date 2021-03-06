const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
  const title = req.body.title
  const name = req.body.name
  const surname = req.body.surname
  const description = req.body.description

  if (title.trim() === '' && name.trim() === '' && surname.trim() === '' && description.trim() === '') {
    res.render('create', { error: true })
  } else {
    fs.readFile('./data/posts.json', (err, data) => {
      if (err) throw err

      const posts = JSON.parse(data)

      posts.push({
        id: id (),  
        title: title,
        name: name,
        surname: surname,
        description: description,
        archive: false
      })

      fs.writeFile('./data/posts.json', JSON.stringify(posts), err => {
        if (err) throw err

        res.render('create', { success: true })
      })
    })
  }
})

app.get('/api/v1/posts', (req, res) => {

  fs.readFile('./data/posts.json', (err,data) => {
    if (err) throw err

    const posts = JSON.parse(data)

    res.json(posts)
  })
})




app.get('/posts', (req, res) => {

  fs.readFile('./data/posts.json', (err, data) => {
    if (err) throw err

    const posts = JSON.parse(data)

    const filteredPosts = posts.filter(post => post.archive == false)

    res.render('posts', { posts: filteredPosts })
  })
})

app.get('/archive', (req, res) => {

  fs.readFile('./data/posts.json', (err, data) => {
    if (err) throw err

    const posts = JSON.parse(data)

    const filteredPosts = posts.filter(post => post.archive == true)

    res.render('posts', { posts: filteredPosts })
  })
})


app.get('/posts/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err
    
        const posts = JSON.parse(data)

        const post = posts.filter(post => post.id == id)[0]

        res.render('detail', { post: post })
      })
})

app.get('/posts/:id/delete', (req, res) => {
  const id = req.params.id

  fs.readFile('./data/posts.json', (err,data) => {
    if (err) throw err

    const posts = JSON.parse(data)

    const filteredPosts = posts.filter(post => post.id !== id)
    
    fs.writeFile('./data/posts.json', JSON.stringify(filteredPosts), err => {
      if (err) throw err
      
      res.redirect('/posts')
    })
  })
})

app.get('/posts/:id/archive', (req, res) => {
  const id = req.params.id

  fs.readFile('./data/posts.json', (err,data) => {
    if (err) throw err

    const posts = JSON.parse(data)

    const post = posts.filter(post => post.id == req.params.id)[0]
    const postIdx = posts.indexOf(post)
    const splicedPost = posts.splice(postIdx, 1)[0]
    splicedPost.archive = true
    posts.push(splicedPost)


    fs.writeFile('./data/posts.json', JSON.stringify(posts), err => {
      if (err) throw err
       
      res.redirect('/archive')
    })
  })
})


app.listen(5000, err => {
  if (err) console.log(err)

  console.log('Server is running on port 5000...')
})


function id () {
   return '_' + Math.random().toString(36).substr(2, 9);
  }