import {renderPosts} from "./renderPosts.js"

fetch('http://localhost:3000/logIn')
.then(res => res.json())
.then((res) =>logIn = res)
let logIn = [];

fetch('http://localhost:3000/posts')
.then(res => res.json())
.then((res) => {renderPosts(res)})



const getAccountBtn = document.getElementById('getAccountBtn');

function getAccount (e){
      console.log(e.target)
      fetch('http://localhost:3000/userpage/userpage.html')
}

const userIcon = document.getElementById('userIcon');
userIcon.addEventListener('click', ()=>{
      const authorizationMenu = document.getElementById('authorizationMenu');
      authorizationMenu.classList.remove('none');

      const closeFormBtn = document.getElementById('closeFormBtn');
      const entranceBtn = document.getElementById('entranceBtn');
      const registrationBtn = document.getElementById('registrationBtn');

            function userLog (e) {
                  if(e.target === closeFormBtn){
                        authorizationMenu.classList.add('none');
                        const closeFormRegistr = document.getElementById('closeFormRegistr');
                        closeFormRegistr.addEventListener('click', ()=> {
                              modalWindowRegistration.classList.add('none');
                              const password = document.getElementById('passwordRegistr');
                              const login = document.getElementById('emailRegistr');
                              login.value = '';
                              password.value = '';
                        },{once: true})
                        
                  } else if(e.target === entranceBtn){
                        const modalWindowAuthorization = document.getElementById('modalWindowAuthorization');
                        modalWindowAuthorization.classList.remove('none');
                        authorizationMenu.classList.add('none');
                        const entranceAuthorizBtn = document.getElementById('entranceAuthorizBtn');
                        entranceAuthorizBtn.addEventListener('click', async(e)=>{
                              const emailAuthoriz = document.getElementById('emailAuthoriz');
                              const userEmail = emailAuthoriz.value;
                              const passwordAuthoriz = document.getElementById('passwordAuthoriz');
                              const userPassword = passwordAuthoriz.value;
                              const response = await fetch('http://localhost:3000/logIn')
                              .then(res => res.json())
                              .then((res) => res.find((user)=>user.login === userEmail))
                              const user = response;
                              if(user.password == userPassword){
                                    console.log('111', user.password)
                                    alert('Вы прошли авторизацию успешно');
                                    getAccountBtn.classList.remove('none');
                                    modalWindowAuthorization.classList.add('none');
                                    getAccountBtn.addEventListener('click', getAccount);
                                    
                              }
                        }, {once: true})

                        const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
                        forgotPasswordBtn.addEventListener('click', (e)=>{
                              alert('Хотите востановить пароль?');
                        }, {once: true});

                        const closeFormAutoriz = document.getElementById('closeFormAutoriz');
                        closeFormAutoriz.addEventListener('click', ()=> {
                              modalWindowAuthorization.classList.add('none');
                        }, {once: true})

                  } else if(e.target === registrationBtn){
                        const modalWindowRegistration = document.getElementById('modalWindowRegistration');
                        modalWindowRegistration.classList.remove('none');
                        authorizationMenu.classList.add('none');
                        console.log(e.target)
                        const registration = document.getElementById('registration');



                        registration.addEventListener('click', async(e)=> {
                              console.log(e.target)
                              const login = document.getElementById('emailRegistr');
                              const newLogin = login.value;
                              const password = document.getElementById('passwordRegistr')
                              const newPassword = password.value;
                              modalWindowRegistration.classList.add('none');
                              alert('Вы прошли регистрацию успешно');
                              login.value = '';
                              password.value = '';

                              let user = {
                                    login: newLogin,
                                    password: newPassword,
                                    userId: logIn.length +1,
                                    isAdmin: false,
                              }
                              logIn.push(user);
                              authorizationMenu.removeEventListener('click', userLog)
                              const response = await fetch('http://localhost:3000/logIn',{
                                    method: 'POST',
                                    body: JSON.stringify(user),
                                    headers: {'Content-Type': 'application/json'},
                              })
                              return response.json();
                        },{once: true})
                  }
            }
            authorizationMenu.addEventListener('click', userLog, {once: true});  
      
      })


  