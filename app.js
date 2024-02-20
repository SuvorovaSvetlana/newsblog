const express =require ('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const router = express.Router();
const path = require('path');

app.use(express.static('public'));
app.use(express.static('./userpage'));
app.use(express.json());
app.use(bodyParser.json());


const logIn = [
      {
            login: 'asd@asd.asd',
            password: 123,
            userId: 1,
            isAdmin: true,
      },
      {
            login: '1asd@asd.asd',
            password: 1234,
            userId: 2,
            isAdmin: false,
      },
      {
            login: '2asd@asd.asd',
            password: 12345,
            userId: 3,
            isAdmin: false,
      }
];

const posts = [
      {
            postTitle: "New post 1",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg",
            postId: 1,
      },
      {
            postTitle: "New post 2",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg",
            postId: 2,
      },
      {
            postTitle: "New post 3",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg",
            postId: 3,
      },
      {
            postTitle: "New post 4",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg",
            postId: 4,
      },
]


app.get('userPage', (req, res) =>{
 console.log('userPage')
})

app.get('/posts', (req, res) =>{
      res.send(posts)
})

app.get('/posts/:id', (req, res) =>{
      const id = req.params.id;
      const foundPost = posts.find((post) => post.postId === +id);
      res.send(foundPost);
      console.log(foundPost)
})
     

app.get('/logIn', (req, res) => {
      res.send(logIn)
})


app.post('/logIn', (req, res)=>{ 
      logIn.push(req.body)
      res.json(req.body)
      console.log(logIn)
})
app.listen(port, ()=>{
      console.log(`App listening on port ${port}`)
}) 

/*
const posts = [
      {
            postTitle: "New post 1",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg"
      },
      {
            postTitle: "New post 2",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg"
      },
      {
            postTitle: "New post 3",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg"
      },
      {
            postTitle: "New post 4",
            postText: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
            postInfo: "Last updated 3 mins ago",
            postImg: "./images/news.jpg"
      },
]
*/ 