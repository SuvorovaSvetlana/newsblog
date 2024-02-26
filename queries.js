const Pool = require('pg').Pool;
const pool = new Pool ({
      user: 'postgres',
      password: '123',
      host: 'localhost',
      port: 3036,
      database: 'newsblog'
});

pool.connect();

const newUserLogin = async (req, res) => {
      const {login, password, isadmin} = req.body;
      try{
            const result = await pool.query('INSERT INTO users (user_login, user_password, isadmin) VALUES ($1, $2, $3)', [login, password, isadmin])
            res.status(201).send(`User added ${result.rows[0]}`)
      } catch (error){
            console.error(error)
      }
}

const getAllUser = async (req, res)=>{
      const result = await pool.query('SELECT * FROM users')
      res.send(result.rows)
}

const newPost = async (req, res) => {
      const { postTitle, postText, postInfo, postImg, userId } = req.body;
      try{
            const result = await pool.query('INSERT INTO  posts (post_title, post_text, post_info, post_img, user_id) VALUES ($1, $2, $3, $4, $5)', [postTitle, postText, postInfo, postImg, userId])
            res.status(201).send('Post added')
      }catch (error){
            console.error(error)
      }
}
const getOnePost = async (req, res) =>{
      const id = req.params.id;
      try{
            const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id])
            res.status(200).send(result.rows[0])
      }catch(error){
            console.error(error)
      }
}
const getAllposts = async (req, res) =>{
      const result = await pool.query('SELECT * FROM posts')
      res.send(result)
}

const changeOnePost = async (req, res) =>{
      const id = parseInt(req.params.id);
      const {postTitle, postText, postInfo, postImg} = req.body;
      try{
            const result = await pool.query('UPDATE posts SET post_title = $1, post_text = $2, post_info= $3, post_img = $4 WHERE id = $5', [postTitle, postText, postInfo, postImg, id])
            res.status(200).send(result.rows[0])
            console.log(result.rows[0])
      }catch(error){
            console.error(error)
      }
}


module.exports = {
      newUserLogin,
      getAllUser,
      newPost,
      getAllposts,
      getOnePost,
      changeOnePost,
}