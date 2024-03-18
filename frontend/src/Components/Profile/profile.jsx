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


const Profile = () => {
  const [userStockList, setstocks] = useState([]);
  const [userTxnList, settxn] = useState([]);
  const [userPnlList, setpnl] = useState([]);
  const [user, setUser]=useState(null);

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
          const response = await axios.post('http://localhost:8000/getUserlist/', {
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
          const response = await axios.post('http://localhost:8000/getCurrentPNL/', {
            user
          });
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
    title: 'Stock',
    dataIndex: 'c1',
    key: 'c1',
  },
  {
    title: 'Quantity',
    dataIndex: 'c2',
    key: 'c2',
  },
];

const columnsTxnList = [
  {
    title: 'ID',
    dataIndex: 'c1',
    key: 'c1',
  },
  {
    title: 'Date',
    dataIndex: 'c2',
    key: 'c2',
  },
  {
    title: 'Quantity',
    dataIndex: 'c3',
    key: 'c3',
  },
  {
    title: 'Price',
    dataIndex: 'c4',
    key: 'c4',
  },
  {
    title: 'Market Value',
    dataIndex: 'c5',
    key: 'c5',
  },
  {
    title: 'User',
    dataIndex: 'c6',
    key: 'c6',
  },
  {
    title: 'Stock ID',
    dataIndex: 'c7',
    key: 'c7',
  },
  {
    title: 'Transaction Type',
    dataIndex: 'c8',
    key: 'c8',
  },

];

const columnsPnlList = [
  {
    title: 'ID',
    dataIndex: 'c1',
    key: 'c1',
  },
  {
    title: 'Profit and loss',
    dataIndex: 'c2',
    key: 'c2',
  },
  {
    title: 'Date',
    dataIndex: 'c3',
    key: 'c3',
  },
  {
    title: 'Stock ID',
    dataIndex: 'c4',
    key: 'c4',
  },
  {
    title: 'User',
    dataIndex: 'c5',
    key: 'c5',
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
                                dataSource={userStockList}
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey='second'>

                            <Table
                                columns={columnsTxnList}
                                pagination={{
                                    position: ['bottomCenter'],
                                }}
                                dataSource={userTxnList}
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey='third'>

                            <Table
                                columns={columnsPnlList}
                                pagination={{
                                    position: ['bottomCenter'],
                                }}
                                dataSource={userPnlList}
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

