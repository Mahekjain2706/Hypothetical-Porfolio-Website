import requests
import yfinance as yf
def get_current_price(symbol):
    ticker = yf.Ticker(symbol)
    todays_data = ticker.history(period='1d')
    print(todays_data)
    return todays_data['Close'][0]

url = 'http://localhost:8000/addstocks/'
data = [
    {"stk_id": 1, "stk_name": "QUALCOMM", "stk_TickerSym": "QCOM", "stk_info": "QUALCOMM Incorporated"},
    {"stk_id": 2, "stk_name": "Cisco Inc.", "stk_TickerSym": "CSCO", "stk_info": "Cisco Systems, Inc."},
    {"stk_id": 3, "stk_name": "Microsoft", "stk_TickerSym": "MSFT", "stk_info": "Microsoft Corporation"},
    {"stk_id": 4, "stk_name": "Starbucks", "stk_TickerSym": "SBUX", "stk_info": "Starbucks Corporation"},
    {"stk_id": 5, "stk_name": "Apple Inc.", "stk_TickerSym": "AAPL", "stk_info": "Apple Inc."},
    {"stk_id": 6, "stk_name": "Google", "stk_TickerSym": "GOOGL", "stk_info": "Alphabet Inc."},
    {"stk_id": 7, "stk_name": "Tesla Inc.", "stk_TickerSym": "TSLA", "stk_info": "Tesla, Inc."},
    {"stk_id": 8, "stk_name": "Amazon.com", "stk_TickerSym": "AMZN", "stk_info": "Amazon.com, Inc."},
]


response = requests.post(url, json=data)
url = 'http://localhost:8000/addStockPrices/'
data = [
    {"stk_id": 1,"stk_price": get_current_price("QCOM")},
    {"stk_id": 2, "stk_price": get_current_price("CSCO")},
    {"stk_id": 3, "stk_price": get_current_price("MSFT")},
    {"stk_id": 4, "stk_price": get_current_price("SBUX")},
    {"stk_id": 5,  "stk_price": get_current_price("AAPL")},
    {"stk_id": 6, "stk_price": get_current_price("GOOGL")},
    {"stk_id": 7,  "stk_price": get_current_price("TSLA")},
    {"stk_id": 8,  "stk_price": get_current_price("AMZN")},
]
response = requests.post(url, json=data)



