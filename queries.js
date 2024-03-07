const Pool = require('pg').Pool;
const pool = new Pool ({
      user: 'postgres',
      password: '123',
      host: 'localhost',
      port: 3036,
      database: 'newsblog'
});

pool.connect();

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { send } = require('process');

function hashPassword(password){
      const secret = "Hallo newsblog";
      const hash = crypto.createHmac('sha256', secret)
      .update(password)
      .digest('hex');
      return hash;
}
//let temporaryPasswordToken = null;

const newUserLogin = async (req, res) => {
      try{
            const {login, password, isadmin} = req.body;
            const newPassword =  hashPassword(password);
            const result = await pool.query('INSERT INTO users (user_login, user_password, isadmin) VALUES ($1, $2, $3) RETURNING *', [login, newPassword, isadmin])
            res.status(201).send(result.rows[0])
      } catch (error){
            console.error(error)
      }
}

const getAllUser = async (req, res)=>{
      const userObj = req.user;
      if(userObj.isAdmin){
            try{
                  const result = await pool.query('SELECT * FROM users')
                  res.json(result.rows)
            }catch(error){
                  console.error(error)
            }
      }else{
            try{
                  const result = await pool.query('SELECT * FROM users WHERE is_deleted = false')
                  res.json(result.rows)
            }catch(error){
                  console.error(error)
            }
      }
}

const userAuthorization = async (req, res) =>{
      const {user_login, user_password} = req.body;
      try{
            const result = await pool.query ('SELECT * FROM users WHERE user_login = $1', [user_login])
            if(result.rows[0]){
                  if(result.rows[0].is_deleted){
                        res.send('Вы не зарегистрированы')
                  }else{
                         const hash = hashPassword(user_password)
                        if(result.rows[0].user_password === hash){
                              const token = jwt.sign({user_login, userId: result.rows[0].id, isAdmin: result.rows[0].isadmin, isDeleted: result.rows[0].is_deleted}, 'secret', {expiresIn: '8h'})
                              if(result.rows[0].isadmin === true){
                                    res.json({token, "role": "admin"})
                              }else {
                                    res.json({token, "role": "user"})
                              }
                        }else{
                              res.status(401).send('Забыли пароль?')
                        }
                  }
            }else{
                  res.send('Вы не зарегистрированы')
            }
      }catch(error){
            console.error(error)
      }
}

const logOut = (req, res)=>{
      const headers = req.headers;
      headers.authorization = " ";
      res.send("log Out");
}

const forgotPassword = async(req, res)=>{
      const userLogin = req.body.user_login;
      try{
            const result = await pool.query ('SELECT * FROM users WHERE user_login = $1', [userLogin]);
            userId = result.rows[0].id;
            const temporaryPasswordToken =  jwt.sign({userLogin, userId}, 'secret', {expiresIn: '2h'})
            await pool.query('INSERT INTO forgotPassword (user_id, temporary_password) VALUES($1, $2)', [userId, temporaryPasswordToken]) 
            const URL = `http://localhost:3000/recoverPassword?token=${temporaryPasswordToken}`;
            res.send('Перейдите по ссылке в письме')
            console.log(URL);
            console.log(temporaryPasswordToken)
      }catch(error){
            console.error(error)
      }
}

const newPassword = async (req, res)=>{
      const recoverPasswordToken = req.params.temporaryPasswordToken;
      const userObj = jwt.verify(recoverPasswordToken, 'secret');
      const userLogin = userObj.userLogin;
      const userId = userObj.userId;
      const newPassword = req.body.newPassword;
      const hash = hashPassword(newPassword);
      try{
            const result = await pool.query('SELECT * FROM forgotPassword WHERE temporary_password = $1', [recoverPasswordToken])
            const id = result.rows[0].user_id;
            if(userId === id){
                  try{
                        await pool.query ('UPDATE users SET user_password = $1 WHERE user_login = $2', [hash, userLogin]);
                        
                       // await pool.query ('DELETE FROM forgotPassword WHERE user_id = $1', [userId]);
                  }catch(error){
                        console.error(error)
                  }
            }else{
                  res.send('Неверные учетные данные')
            }      
      }catch(error){
            console.error(error)
      }

      res.send('Новый пароль сохранен')
}

const newPost = async (req, res) => {
      const { postTitle, postText, postInfo, postImg, userId } = req.body;
      const userObj = req.user;
      if(!userObj.isDeleted){
            try{
                  const result = await pool.query('INSERT INTO  posts (post_title, post_text, post_info, post_img, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [postTitle, postText, postInfo, postImg, userId])
                  res.status(201).json(result.rows[0])
            }catch (error){
                  console.error(error)
            }
      }else{
            res.send('You do not have permission to add new post')
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
      const userObj = req.user;
      if(userObj.isAdmin){
            try{
                  const result = await pool.query('UPDATE posts SET post_title = $1, post_text = $2, post_info = $3, post_img = $4 WHERE id = $5 RETURNING *', [postTitle, postText, postInfo, postImg, id])
                  res.json(result.rows[0])
            }catch(error){
                  console.error(error)
            }
      }else{
            try{ 
                  const postUserId = await pool.query('SELECT user_id FROM posts WHERE id = $1', [id])
                  if(postUserId.rows[0].user_id === userObj.userId){
                        try{
                              const result = await pool.query('UPDATE posts SET post_title = $1, post_text = $2, post_info = $3, post_img = $4 WHERE id = $5 RETURNING *', [postTitle, postText, postInfo, postImg, id])
                              res.json(result.rows[0])
                        }catch(error){
                              console.error(error)
                        }
                  }else {
                        res.send("You can not change this post")
                  }
            }catch(error){
                  console.error(error)
            }
      }
}

const deleteOnePost = async (req, res) =>{
      const id = parseInt(req.params.id);
      const userObj = req.user;
      if(userObj.isAdmin){ 
            try{
                  await pool.query ('DELETE FROM posts WHERE ID = $1', [id])
                  res.send({success: true})
            } catch (error){
                  console.error(error)
            }
         }else{
            try{
                  const result = await pool.query ('DELETE FROM posts WHERE ID = $1 AND user_id = $2', [id, userObj.userId])
                  if (result > 0){
                        res.send({success: true})
                  }else {
                        res.send("You can not delete this post")
                  }
            } catch (error){
                  console.error(error)
            } 
         }
}

const deleteAllPosts = async (req, res) =>{
      const userObj = req.user;
      if(userObj.isAdmin){
            try{
                  await pool.query ('DELETE FROM posts')
                  res.send({success: true})
            }catch(error){
                  console.error(error)
            }
      }else{
            res.send('You do not have permission to delete all posts')
      }
}

const deleteOneUser = async (req, res) =>{
      const id = parseInt(req.params.id);
      const userObj = req.user;
      if(userObj.isAdmin || id === userObj.userId){
            try{
                  await pool.query ('UPDATE users SET is_deleted = TRUE WHERE id = $1', [id]);
                  res.send({success: true})
            }catch(error){
                  console.error(error)
            }
      }else{
           res.send('You don`t have permission to delete this user')
      }
}

module.exports = {
      newUserLogin,
      userAuthorization,
      getAllUser,
      newPost,
      getAllposts,
      getOnePost,
      changeOnePost,
      deleteOnePost,
      deleteAllPosts,
      deleteOneUser,
      logOut,
      forgotPassword,
      newPassword,
}