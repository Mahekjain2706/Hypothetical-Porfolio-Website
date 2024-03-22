import React from 'react'
import './SignUp.css'
import Login from '../Login/login.jsx';
import StockList from '../StocksPage/stockspage.js';

import Main from '../MainPage/mainpage';
import { useState } from 'react';
import { FaUser,FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
// import { MdEmail } from "react-icons/md";
import { Link } from 'react-router-dom';

// Inside your component...
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmpwd] = useState('');
    const [email, setEmail] = useState('');
    const [SignedUp, setSignedUp] = useState(false);
  
    const handleSignup = async (e) => {
      if(e)e.preventDefault();
      
      try {
        const response = await axios.post('http://localhost:8000/signup/', {
          username,
          password,
          confirm_password,
          email
        });
        
        console.log(response.data); // Assuming backend returns some data
        // Set login status to true after successful login
        setSignedUp(true);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleSignup();
    };
    // const navigate = useNavigate();

    // const handleClick = () => {
    //   navigate('/login');
    // };
    if (SignedUp) {
      navigate('/StockList');
    }
    return (
      <div className="container bigWrapper" >
        <div className="wrapper">
          {SignedUp ? (
            // Render the Main component when logged in
            navigate('/getlist')
            // <Redirect to="/Main" />
            // <Link to="/Main"></Link>
          ) : (
            // Render the login form when not logged in
            <form onSubmit={handleSubmit}>
              <h1>Sign Up</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaLock className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirm_password}
                  onChange={(e) => setConfirmpwd(e.target.value)}
                />
                <FaLock className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaUser className="icon" />
              </div>

              <div className="remember-forget">
                <label>
                  <input type="checkbox" /> Remember me?
                </label>
                <a href={<Login/>}> Forget password?</a>
              </div>
              <button type="submit">Sign Up</button>
  
              <div className="register-link">
                <p>
                {/* <button onClick={handleClick}>Already have an account? Login</button> */}
                Already have an account? <a href={(<Login/>)}><Link to="/Login">Login</Link></a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };
  
  export default SignUp;
  
