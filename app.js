const express =require ('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const router = express.Router();
const path = require('path');

app.use(express.static('public'));
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

app.get('/userPage')

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