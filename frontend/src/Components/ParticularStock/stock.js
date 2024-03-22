import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import "chart.js/auto";

import { Line } from 'react-chartjs-2';
import "./particularStock.css";
import { Button, Result, Form, Table, InputNumber, Tag, Space } from 'antd';
import { Link } from 'react-router-dom';
import ResultBuying from '../../../src/Components/Use/Result'

function LeftTabsExample() {
    const storedUser=localStorage.getItem('user')
    const [quantity, setQuantity] = useState('');
    const [risk_cov, setRiskCov] = useState('');
    const [risk_cor, setRiskCor] = useState('');
    const [var_portfolio_cov, setVarCov] = useState('');
    const [var_portfolio_cor, setVarCor] = useState('');
    const [pnl, setPnl] = useState('');
    const [risk_cov_old, setRiskCovOld] = useState('');
    const [risk_cor_old, setRiskCorOld] = useState('');
    const [var_portfolio_cov_old, setVarCovOld] = useState('');
    const [var_portfolio_cor_old, setVarCorOld] = useState('');
    const [pnl_old, setPnlOld] = useState('');
    const [Prices, setPrices] = useState([]);
    const [chartData, setChartData] = useState({});
    const [quantity2, setQuantity2] = useState('');
    const [successMessage, setSuccessMessage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [stockinfo, setStockInfo] = useState({});
    const [new_stk_pos, setStockPos] = useState({});
    const [new_pos, setPosition] = useState({});
    const [user, setUser]=useState(null);
    const [stk_id, setStkId] = useState(2);
    const [stk_name, setStkName] = useState("");
    const handleSubmit2 = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/buyStock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qty: quantity2, stk_id: stk_id,user:user }), // Default stk_id as 2
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message);
                setStockPos(data.stk_psn);
                setPosition(data.position);
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setUser(JSON.parse(storedUser));
        setStkId(JSON.parse(localStorage.getItem('stkid')));
        setStkName(JSON.parse(localStorage.getItem('stkname')));
        // Fetch closing prices from backend
        fetchClosingPrices();
        fetchStkData();
    }, []);

    const fetchClosingPrices = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/getPrices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stk_id: stk_id }), // default stk_id as 2
            });
            const data = await response.json();
            setPrices(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const fetchStkData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/getStockInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stk_id: stk_id }), // default stk_id as 2
            });
            const data = await response.json();
            setStockInfo(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        // Prepare data for chart
        const labels = Prices.map((price, index) => price['Date'].slice(0, -9));// Assuming each price corresponds to one label
        const close_data = Prices.map(price => parseFloat(price['Close'])); // Extract closing prices and convert to numbers
        const open_data = Prices.map(price => parseFloat(price['Open'])); // Extract closing prices and convert to numbers
        const high_data = Prices.map(price => parseFloat(price['High'])); // Extract closing prices and convert to numbers
        const low_data = Prices.map(price => parseFloat(price['Low'])); // Extract closing prices and convert to numbers

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Closing Prices',
                    data: close_data,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Opening Prices',
                    data: open_data,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'High',
                    data: high_data,
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Low',
                    data: low_data,
                    fill: false,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    tension: 0.1
                },
            ]
        })
    }, [Prices]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/getRiskandPNL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity, stk_id: stk_id ,user:user }), // static stock_id as 1
            });
            const data = await response.json();
            setVarCov(data.portfolio_var_covariance);
            setVarCor(data.portfolio_var_correlation);
            setRiskCov(data.risk_covariance);
            setRiskCor(data.risk_correlation);
            setPnl(data.pnl);
            setVarCovOld(data.portfolio_var_covariance_old);
            setVarCorOld(data.portfolio_var_correlation_old);
            setRiskCovOld(data.risk_covariance_old);
            setRiskCorOld(data.risk_correlation_old);
            setPnlOld(data.pnl_old);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const StockInfoTable = ({ data }) => {
        return (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Position ID</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Stock ID</th>
                <th>User</th>
                <th>Weighed Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.position_id}</td>
                  <td>{item.psn_qty}</td>
                  <td>{item.pv}</td>
                  <td>{item.stk_id}</td>
                  <td>{item.user}</td>
                  <td>{item.weighed_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      };
      
    // Table fourth
    const columns = [
        {
            title: 'Stock Attribute Name',
            dataIndex: 'name',
            key: 'name',
        },
    
        {
            title: 'Value',
            key: 'val',
            dataIndex: 'val',
            render: (tags) => (
                <span>
                <Tag color={'royalblue' } key={tags}>
                    {tags}
                </Tag>
            
                </span>
            ),
        },
    ];
        // Table fourth
        const columns2 = [
            {
                title: 'Attribute',
                dataIndex: 'name',
                key: 'name',
            },

            {
                title: 'Old',
            key: 'old',
            dataIndex: 'old',
            render: (tags) => (
                <span>
                <Tag color={'royalblue'} key={tags}>
                    {tags}
                </Tag>
            
                </span>
            ),
            },
            {
                title: 'New',
            key: 'new',
            dataIndex: 'new',
            render: (tags) => (
                <span>
                <Tag color={'mediumseagreen'} key={tags}>
                    {tags}
                </Tag>
            
                </span>
            ),
            },

        ];
    const data2=[{key:1,name:'Risk ',old:risk_cov_old,new:risk_cov},
    // {key:2,name:'Risk using Correlation',old:risk_cor_old,new:risk_cor},
    {key:3,name:'Portfolio Variance ',old:var_portfolio_cov_old,new:var_portfolio_cov},
    // {key:4,name:'Portfolio Variance using Correlation',old:var_portfolio_cor_old,new:var_portfolio_cor},
    {key:5,name:'PnL',old:pnl_old,new:pnl}
    ]

    const data=[]
    let i=0;
    for (const [key, value] of Object.entries(stockinfo)) {
        data.push({
            key: i,
            name: key,
            val: value,
        });
    }
    return (
        <div>
            <h2 style={{textAlign: 'center'}}> {stk_name }</h2>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
            <Row>
                <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="first">Risk Calculation</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second">Buying Stock</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="third">Stock Graph</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="fourth">Stock Information</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <div>
                                <Form onSubmit={handleSubmit}>
                                    <h2><b>Quantity</b></h2>
                                    <Form.Item>
                                        <InputNumber style={{ width: '50%' }}
                                            value={quantity}
                                            onChange={(e) => {setQuantity(e)}}
                                        />
                                    </Form.Item>
                                    <Button type="primary" style={{ fontSize: '100%', backgroundColor: '#1f2fa5' }} onClick={handleSubmit}>Submit</Button>
                                </Form>
                               
                            </div>

    
                            
                            <Table
                                columns={columns2}
                                pagination={{
                                    position: ['bottomCenter'],
                                }}
                                dataSource={data2}
                            />

                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            {/* Contents for Buying Stock tab */}
                            <Form onSubmit={handleSubmit2} style={{ justifyContent: 'center', alignItems: '' }}>
                                <h2 style={{ textAlign: 'center' }}><b>Buying Stock</b></h2>
                                <h2><b>Quantity</b></h2>
                                <Form.Item>
                                    <InputNumber style={{ width: '50%' }}
                                        type="number"
                                        value={quantity2}
                                        onChange={(e) => setQuantity2(e)}
                                    />
                                </Form.Item>

                                <Button type="primary" style={{ fontSize: '100%', backgroundColor: '#1f2fa5' }} disabled={loading}onClick={handleSubmit2}>Submit</Button>
                            </Form>
                            {successMessage && <p>{successMessage}</p> && (
                                <Result
                                    status="success"
                                    title="Successfully Calculated !"
                                    subTitle="The Transaction has been successfully Updated."
                                    extra={[
                                        <Button style={{ backgroundColor: '#1f2fa5' }} key="console" >
                                            Done
                                        </Button>,
                                        <Button key="buy" onClick={ () => setSuccessMessage(1-successMessage) }> Calculate Again</Button>,
                                        // <div>
                                        // <h3>Current Stock Information</h3>
                                        // <StockInfoTable data={new_stk_pos} />
                                        // <h3>Updated Position Table</h3>
                                        // <StockInfoTable data={new_pos} />
                                        // </div>
                                       
                                    ]}
                                />
                            )

                            }
                            
                        </Tab.Pane>
                        <Tab.Pane eventKey="third">
                            {/* Contents for Stock Information tab */}
                            {/* Render line chart */}
                            {Prices.length > 0 && (
                                <div className="chart-container">
                                    <Line data={chartData} />
                                </div>
                            )}
                        </Tab.Pane>
                        <Tab.Pane eventKey='fourth'>
                
                            <Table
                                columns={columns}
                                pagination={{
                                    position: ['bottomCenter'],
                                }}
                                dataSource={data}
                            />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </div>

    );
}

export default LeftTabsExample;