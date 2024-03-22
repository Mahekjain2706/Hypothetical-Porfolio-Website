import React, { useState } from 'react';
// import './login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import SignUp from '../SignUp/SignUp.jsx';
import axios from 'axios';
import StockList from '../StocksPage/stockspage.js';

// import { Link } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  
  const handleLogin = async (e) => {
    if(e)e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/', {
        username,
        password
      });
      console.log('Login successful!', response.data);
      // const parsedUserData = JSON.parse(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log(localStorage.getItem('user'));
      setLoggedIn(true);

    } catch (error) {
      console.error('Error:', error);
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin();
  };
  // const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate('/signup');
  // };



  function handleClick(e) {
    window.location.href = <SignUp/>;
    e.preventDefault();
  }


  return (
    <div className='bigWrapper'>
      
      <div className="wrapper">
        {loggedIn ? (
          // Render the Main component when logged in
          <StockList />
        ) : (
          // Render the login form when not logged in
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
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
            <div className="remember-forget">
              <label>
                <input type="checkbox" /> Remember me?
              </label>
              <a href={<SignUp/>}> Forget password?</a>
            </div>
            <button type="submit">Log In</button>

            <div className="register-link">
                 {/* <button onClick={handleClick}>Don't have an account? SignUp</button> */}
                Don't have an account? <a href={<SignUp/>} onClick={handleClick}>SignUp</a>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

export default Login;



