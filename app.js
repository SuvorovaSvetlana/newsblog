const express =require ('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const router = express.Router();
const path = require('path');
const db = require('./queries');

app.use(express.static('public'));
app.use(express.static('./userpage'));
app.use(express.json());
app.use(bodyParser.json());

app.get('/userPage', (req, res) =>{
 console.log('userPage') 
})

app.get('/posts', db.getAllposts);

app.get('/posts/:id', db.getOnePost)
     
app.get('/logIn', db.getAllUser);

app.put('/posts/:id', db.changeOnePost)

app.post('/logIn', db.newUserLogin);

app.post('/posts', db.newPost);

app.delete('/posts/:id', db.deleteOnePost);

app.delete('/posts', db.deleteAllPosts);

app.delete('/logIn/:id', db.deleteOneUser);

app.listen(port, ()=>{
      console.log(`App listening on port ${port}`)
}) 
