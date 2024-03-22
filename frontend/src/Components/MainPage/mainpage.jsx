import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Login from '../Login/login';


const StockList = () => {
  const [stocks, setstocks] = useState([]);
  const [user, setUser]=useState(null);

  useEffect(() => {
    // axios.get('http://127.0.0.1:8000/getstocklist/')
    //   .then(res => {
    //     setstocks(res.data);
    //     console.log(res.data)
    //   });
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
      // axios.post('http://127.0.0.1:8000/getUserlist/', user)
    }

  
  }, []);

  useEffect(() => {
    if (user) {
      // You can perform any actions that require the updated user state here
    }
  }, [user]); 

  return (
    // <ul>
    //   {stocks.map(stock => (
    //     <li key={stock.stk_id}>
    //       {stock.stk_name}
    //       {/* Add buttons for edit and delete operations here */}
    //     </li>
    //   ))}
    // </ul>

    <div>
      {user ? (
        <div>
          {/* <p>Welcome, {user['user_name/']}   </p> */}
          {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default StockList;
