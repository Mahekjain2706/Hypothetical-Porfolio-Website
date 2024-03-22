import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stockpage.css';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Function to fetch stocks from backend
    const fetchStocks = async () => {
      try {
        
        const response = await fetch('http://127.0.0.1:8000/getstocklist');
        if (response.ok) {
          const data = await response.json();
          setStocks(data);
          
        } else {
          console.error('Failed to fetch stocks');
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    // Call the function to fetch stocks
    fetchStocks();
  }, []);

  

  return (
    <div className="stock-list-container">
      <h2>Stock Holdings</h2>
      
      {/* <ul className="stock-list">
        {stocks.map((stock) => (
          <li key={stock.stk_id} onClick={() => {localStorage.setItem('stkid', JSON.stringify(stock.stk_id));localStorage.setItem('stkname', JSON.stringify(stock.stk_name));navigate('/Main')}}>
          {stock.stk_name}
          </li>
        ))}
      </ul> */}
      <div className='stock-list-div'>
             <ul className='stock-list'>
        <li>Facebook</li>
        <li>Facebook</li>
        <li>Facebook</li>
        <li>Facebook</li> 
        <li>Facebook</li>
        <li>Facebook</li>
        <li>Facebook</li>
        <li>Facebook</li>
        <li>Facebook</li>
        <li>Facebook</li>
      </ul>

      </div>
 
    </div>
  );
};

export default StockList;
