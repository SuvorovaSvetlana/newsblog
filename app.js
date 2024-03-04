const express =require ('express');
const app = express();
const bodyParser = require('body-parser');   
const port = 3000;
const router = express.Router();
const path = require('path');
const db = require('./queries');
const jwt = require('jsonwebtoken');


app.use(express.static('public'));
app.use(express.static('./userpage'));
app.use(express.json());
app.use(bodyParser.json());

app.get('/userPage', (req, res) =>{
 console.log('userPage') 
})

const getUserFromToken = (req, res, next) => {
      const headers = req.headers;  
      const bearerToken = headers.authorization;
      const [bearer, token] = bearerToken.split(' ');
      const userObj = jwt.verify(token, 'secret');
      req.user = userObj;
      next();
}

app.get('/posts', db.getAllposts);

app.get('/posts/:id', getUserFromToken, db.getOnePost)
     
app.get('/logIn', getUserFromToken, db.getAllUser);

app.put('/posts/:id', getUserFromToken, db.changeOnePost)

app.post('/logIn', db.newUserLogin);

app.post('/logOut',getUserFromToken, db.logOut);

app.post('/logIn/authorization', db.userAuthorization);

app.post('/posts', getUserFromToken, db.newPost);

app.post('/forgotPassword', db.forgotPassword, db.newPassword);

app.delete('/posts/:id', getUserFromToken, db.deleteOnePost);

app.delete('/posts',getUserFromToken , db.deleteAllPosts);

app.delete('/logIn/:id', getUserFromToken, db.deleteOneUser);

app.listen(port, ()=>{
      console.log(`App listening on port ${port}`)
}) 
