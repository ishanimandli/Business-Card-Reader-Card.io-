const button = document.getElementById('submit-new-user');

button.addEventListener('click', (event) => {
  const fname = document.getElementById('fname');
  const lname = document.getElementById('lname');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone'); 

  if(fname.value==""){
    event.preventDefault();
    alert("Enter your first name.");
    fname.focus();
  }
  if(lname.value==""){
    event.preventDefault();
    alert("Enter your last name.");
    lname.focus();
  }
  if(username.value==""){
    event.preventDefault();
    alert("Enter your username.");
    username.focus();
  }

  if(password.value==""){
    event.preventDefault();
    alert("Enter your password.");
    password.focus();
  }

  if(phone.value==""){
    event.preventDefault();
    alert("Enter your phone number.");
    phone.focus();
  }

  if(email.value==""){
    event.preventDefault();
    alert("Enter your email id.");
    email.focus();
  }

  $.get('/isavailable',{user:username.value,email_id:email.value},(resp) => {
    if(resp == 'usename'){
      event.preventDefault()
      alert("This username is already selected. Try some other username.");
      email.focus();
    }
    else if(resp == 'email'){
      event.preventDefault()
      alert("This email id is already used by some other user. Try some other email id.");
      email.focus();
    }
    else{
      $.post('/signup/submit',{fname:fname.value,
                               lname:lname.value,
                               username:username.value,
                               password:password.value,
                               email:email.value,
                               phone:phone.value}, (resp) =>{
                                 if(resp == true){
                                    document.getElementById('signup_form').style.display='none';
                                 }
                                 else{
                                   event.preventDefault();
                                   alert("This username or email id is already used. Try agian with new username or email id.")
                                 }
                               });
    }
  });
  
});
document.getElementById('signup').addEventListener('click',() =>{
  document.getElementById('signup_form').style.display='block';
});
document.getElementById('close_signup').addEventListener('click',() =>{
  document.getElementById('signup_form').style.display='none';
});