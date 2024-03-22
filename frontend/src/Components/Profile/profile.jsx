import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from '../Login/login';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import 'react-tabs/style/react-tabs.css';
import "chart.js/auto";
import { Button, Result, Form, Table, InputNumber, Tag, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userStockList, setstocks] = useState([]);
  const [userTxnList, settxn] = useState([]);
  const [userPnlList, setpnl] = useState([]);
  const [user, setUser]=useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        console.log(localStorage.getItem('user'), 'ye main wala he');
        setUser(JSON.parse(storedUser));
        console.log('paresed', JSON.parse(storedUser))
        console.log('main me aagye', user)
    }

  
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        console.log('User:', user); 
        try {
          const response = await axios.post('http://localhost:8000/getUserlist', {
            user
          });
          setstocks(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error:', error);
        }


        try {
          const response = await axios.post('http://localhost:8000/getTransactionHis/', {
            user
          });
          settxn(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error:', error);
        }



        try {
          const response = await axios.post('http://localhost:8000/getCurrentPNL', {
            user
          });
          console.log("user");

          console.log(user);
          setpnl(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
  
    fetchData(); // Call the async function immediately
  }, [user]);
  

const columnsStockList = [
  {
    title: 'Stock ID',
    dataIndex: 'stk_id',
    key: 'stk_id',
  },
  {
    title: 'Stock Name',
    dataIndex: 'stk_name',
    key: 'stk_name',
  },
];

const columnsTxnList = [
  {
    title: 'ID',
    dataIndex: 'txn_id',
    key: 'txn_id',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Quantity',
    dataIndex: 'txn_qty',
    key: 'txn_qty',
  },
  {
    title: 'Price',
    dataIndex: 'txn_price',
    key: 'txn_price',
  },
  {
    title: 'Market Value',
    dataIndex: 'market_value',
    key: 'market_value',
  },

  {
    title: 'Stock ID',
    dataIndex: 'stk_id',
    key: 'stk_id',
  },


];

const columnsPnlList = [
  {
    title: 'Stock ID',
    dataIndex: 'stk_id',
    key: 'stk_id',
  },
  {
    title: 'Profit and loss',
    dataIndex: 'pnl',
    key: 'pnl',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },

];

return (
    <div>
     
        <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
            <Row>
                <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="first">Stock List</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second">Transaction History</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="third">Profit & Loss</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey='first'>

                            <Table
                                columns={columnsStockList}
                                pagination={{
                                    position: ['bottomCenter'],
                                }}
                                dataSource={userStockList.map(stock => ({
                                  stk_id: stock.stk_id,
                                  stk_name: stock.stk_name,
                              }))}
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey='second'>

                            <Table
                                columns={columnsTxnList}
                                pagination={{
                                    position: ['bottomCenter'],
                                }}
                                dataSource={userTxnList.map(txn => ({
                                  txn_id: txn.txn_id,
                                  date: txn.date,
                                  txn_qty: txn.txn_qty,
                                  txn_price: txn.txn_price,
                                  market_value: txn.market_value,
                                  stk_id: txn.stk_id,

                              }))}
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey='third'>

                            <Table
                                columns={columnsPnlList}
                                pagination={{
                                    position: ['bottomCenter'],
                                }}
                                dataSource={userPnlList.map(pnl => ({
                                  stk_id: pnl.stk_id,
                                  pnl: pnl.pnl,
                                  date: pnl.date,
                                }))}
                            />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    </div>

);
}

export default Profile;

