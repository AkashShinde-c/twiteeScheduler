import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import '../CSS/Createaccount.css';

export default function CreateAccount() {
  const [toggle, setToggle] = useState(true);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useHistory();

 
  const token = localStorage.getItem('jwttoken');

  if(token){
    navigate.push('/dashboard');

  }

  useEffect(() => {
    const storedIsConnected = localStorage.getItem('isConnected');
    if (storedIsConnected) {
       localStorage.removeItem('isConnected');
    }
  }, []);
   
  const handleSubmit = (event) => {
    event.preventDefault();
    // Get the email and password values from the refs
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // localStorage.removeItem('jwttoken')
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,'Authorization':localStorage.getItem('jwttoken') },
        body: JSON.stringify({ email: email, password: password })
      };
      if(toggle){
        fetch('http://localhost:2000/login', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.success) {
            
            localStorage.setItem('jwttoken', data.token);
            
            
            navigate.push('/dashboard'); // replace '/dashboard' with the desired URL to redirect to
            // window.open("localhost:2000/auth")
        }
        else{
          window.alert(data.msg)
        }
        });
    emailRef.current.value = '';
    passwordRef.current.value = '';
      }
      else{ 
      fetch('http://localhost:2000/api/users', requestOptions)
        .then(response => response.json())
        .then(data => window.alert(data.message));
    emailRef.current.value = '';
    passwordRef.current.value = '';
  }
  };

  return (
    <>
      <div class="background"></div>
      <form onSubmit={handleSubmit}>
        <h3>{toggle ? 'Login Here' : 'Sign Up'}</h3>

        <label htmlFor="email">Email</label>
        <input type="email" placeholder="Email" id="email" ref={emailRef} />

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" ref={passwordRef} />

        <button type="submit" onClick={handleSubmit}>{toggle ? 'Log In' : 'Sign Up'}</button>
        <div className="registerText">
          {toggle ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setToggle(!toggle)}>
            {toggle ? 'Register' : 'Log In'}
          </span>
        </div>
        <div class="social">
          <div class="go">
            <i class="fab fa-google"></i> Google
          </div>
          <div class="fb">
            <i class="fab fa-facebook"></i> Facebook
          </div>
        </div>
      </form>
    </>
  );
}
