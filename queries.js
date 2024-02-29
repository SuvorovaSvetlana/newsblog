const Pool = require('pg').Pool;
const pool = new Pool ({
      user: 'postgres',
      password: '123',
      host: 'localhost',
      port: 3036,
      database: 'newsblog'
});


const jwt = require('jsonwebtoken');
const crypto = require('crypto');


function hashPassword(password){
      const secret = "Hallo newsblog";
      const hash = crypto.createHmac('sha256', secret)
      .update(password)
      .digest('hex');
      return hash;
}


pool.connect();

const newUserLogin = async (req, res) => {
      
      try{
            const {login, password, isadmin} = req.body;
            const newPassword =  hashPassword(password);
            const result = await pool.query('INSERT INTO users (user_login, user_password, isadmin) VALUES ($1, $2, $3) RETURNING *', [login, newPassword, isadmin])
            console.log(newPassword);
            res.status(201).send(result.rows[0])
      } catch (error){
            console.error(error)
      }
}

const getAllUser = async (req, res)=>{
      const result = await pool.query('SELECT * FROM users')
      res.json(result.rows)
}

const userIdentify = async (req, res) =>{
      const id = parseInt(req.params.id);
      try{
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
            res.send(result.rows[0])
            console.log(result.rows[0].id)
      }catch(error){
            console.log('error', error)
      }
}

const userAutoriz = async (req, res) =>{
      const {user_login, user_password} = req.body;
      try{
            const result = await pool.query ('SELECT * FROM users WHERE user_login = $1', [user_login])
            const hash = hashPassword(user_password)
            if(result.rows[0].user_password === hash){
                  const token = jwt.sign({user_login}, 'secret', {expiresIn: '8h'})
                  if(result.rows[0].isadmin === true){
                        res.json({token, "role": "admin"})
                  }else {
                        res.json({token, "role": "user"})
                  }
            }else{
                  res.status(401).json({error: 'Неправильные учетные данные'})
            }
      }catch(error){
            console.error(error)
      }

}

const newPost = async (req, res) => {
      const { postTitle, postText, postInfo, postImg, userId } = req.body;
      try{
            const result = await pool.query('INSERT INTO  posts (post_title, post_text, post_info, post_img, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [postTitle, postText, postInfo, postImg, userId])
            res.status(201).json(result.rows[0])
      }catch (error){
            console.error(error)
      }
}
const getOnePost = async (req, res) =>{
      const id = parseInt(req.params.id);
      try{
            const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id])
            res.status(200).send(result.rows[0])
      }catch(error){
            console.error(error)
      }
}
const getAllposts = async (req, res) =>{
      const result = await pool.query('SELECT * FROM posts')
      res.send(result.rows)
}

const changeOnePost = async (req, res) =>{
      const id = parseInt(req.params.id);
      const {postTitle, postText, postInfo, postImg} = req.body;
      try{
            const result = await pool.query('UPDATE posts SET post_title = $1, post_text = $2, post_info = $3, post_img = $4 WHERE id = $5 RETURNING *', [postTitle, postText, postInfo, postImg, id])
            res.json(result.rows[0])
      }catch(error){
            console.error(error)
      }
}

const deleteOnePost = async (req, res) =>{
      const id = parseInt(req.params.id);
      try{
            await pool.query ('DELETE FROM posts WHERE ID = $1', [id])
            res.send({success: true})
      } catch (error){
            console.error(error)
      }
}

const deleteAllPosts = async (req, res) =>{
      try{
            await pool.query ('DELETE FROM posts')
            res.send({success: true})
      }catch(error){
            console.error(error)
      }
}

const deleteOneUser = async (req, res) =>{
      const id = parseInt(req.params.id);
      try{
            await pool.query ('DELETE FROM users WHERE id = $1', [id]);
            res.send({success: true})
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
      deleteOnePost,
      deleteAllPosts,
      deleteOneUser,
      userIdentify,
      userAutoriz,
}