from . models import *
import datetime
from django.db.models import Sum
import pandas as pd
import numpy as np
import yfinance as yahooFinance

# Function to calculate covariance matrix
def calculate_covariance_matrix(returns):
    covariance_matrix = np.cov(returns)
    return covariance_matrix

# Function to calculate correlation matrix
def calculate_correlation_matrix(returns):
    correlation_matrix = np.corrcoef(returns)
    return correlation_matrix

# Function to compute risk of new transaction
def compute_transaction_risk(psn_qtys, covariance_matrix, correlation_matrix):
    weights = [row[1] for row in psn_qtys]
    sum_weights=sum(weights)
    if(sum_weights!=0):
        weights=[i/sum_weights for i in weights] # Normalize the weight
    weights=np.array(weights,dtype=float)
    weights = weights.reshape(1, -1)
    variance_covariance = np.dot(weights, np.dot(covariance_matrix, weights.T))
    std_dev_covariance=np.sqrt(variance_covariance)
    variance_correlation = np.dot(weights, np.dot(correlation_matrix, weights.T))
    std_dev_correlation=np.sqrt(variance_correlation)
    return variance_covariance, variance_correlation, std_dev_covariance, std_dev_correlation

def get_current_price(symbol):
    ticker = yahooFinance.Ticker(symbol)
    todays_data = ticker.history(period='1d')
    return todays_data['Close'][0]


def compute_risk(request):
    data = Positiontable.objects.filter(user=request.user) #users position
    stk_ids = [entry.stk_id.stk_id for entry in data] #stocks in users position
    TickerSyms = [entry.stk_id.stk_TickerSym for entry in data] #stocks in users position
    psn_qtys = [[entry.stk_id.stk_id, entry.psn_qty] for entry in data] #quantity of stocks in users position
    returns=[] 
    new_stock_name = request.data['stk_id'] #input stock 
    new_quantity = request.data['quantity'] #input quantity
    if new_stock_name not in stk_ids:
        newTicker=Stocks.objects.filter(stk_id=new_stock_name)[0].stk_TickerSym
        TickerSyms.append(newTicker)
        stk_ids.append(new_stock_name)
        psn_qtys.append([new_stock_name,new_quantity])

    recent_stocks_df = yahooFinance.download(TickerSyms, period="10d")
    # recent_stocks_df = recent_stocks_df.interpolate(method='polynomial', order=2)
    recent_stocks_df = recent_stocks_df.fillna(method='ffill')
    recent_stocks_df = recent_stocks_df.fillna(method='bfill')
    for i in psn_qtys:
        if i[0]==new_stock_name:
            i[1]+=float(new_quantity) #update the quantity of stock if it already exists in the position
            break
    for i,stk_id in enumerate(stk_ids):
        if(len(stk_ids)==1):
            ret = recent_stocks_df['Close']
        else:
            ret = recent_stocks_df['Close'][TickerSyms[i]]
        shifted=ret.shift(1) #shift the stock prices by 1 day
        shifted = shifted.interpolate(method='linear', axis=0, limit_direction='forward')
        #get percentage change in prices of this stock for last 5 days
        l1=list(ret)
        l2=list(shifted)
        if(len(l2)!=1):
            l2[0]=l2[1]
        else:
            l2[0]=0
        lst = [float(float(ret_val) - float(shifted_val)) for ret_val, shifted_val in zip(l1, l2)]
        returns.append(lst)

    covariance_matrix = calculate_covariance_matrix(np.array(returns)) #get covariance matrix 
    correlation_matrix = calculate_correlation_matrix(np.array(returns)) #get correlation matrix
    variance_covariance, variance_correlation, std_dev_covariance, std_dev_correlation = compute_transaction_risk(psn_qtys, covariance_matrix, correlation_matrix)
    return variance_covariance, variance_correlation, std_dev_covariance, std_dev_correlation

def compute_pnl_profile(user):
    psns = Positiontable.objects.filter(user=user).values()
    for pos in psns:
        stkTS=Stocks.objects.get(stk_id=pos['stk_id_id']).stk_TickerSym
        cur_stock_price=get_current_price(stkTS)
        stock_price=Stock_prices.objects.get(stk_id=pos['stk_id_id'])
        stock_price.stk_price=cur_stock_price
        cur_date=datetime.datetime.now()
        stock_price.date_of_pricing=cur_date
        stock_price.save()
        pnl=pos['weighed_price']+cur_stock_price*pos['psn_qty']
        pnl_obj=Pnltable.objects.get(stk_id=pos['stk_id_id'],user=user)
        pnl_obj.pnl=pnl
        pnl_obj.save()

def compute_pnl(user, stk_id, qty, cur_stock_price):
    try:
        psn_obj = Positiontable.objects.get(user=user, stk_id=stk_id)
        overall_qty = psn_obj.psn_qty
        weighed_price = psn_obj.weighed_price
        new_pv=int(weighed_price*overall_qty)+ int(cur_stock_price) * int(qty) 
        if overall_qty > 0:
            weighed_price =( new_pv) / (overall_qty + int(qty))
            pnl = (cur_stock_price - weighed_price) * (overall_qty + int(qty))
        else:
            weighed_price = cur_stock_price
            pnl = 0
    except Positiontable.DoesNotExist:
        weighed_price = cur_stock_price
        pnl = 0
        new_pv = int(cur_stock_price) * int(qty)
    return weighed_price, pnl,new_pv

def StockPrices(request):
    stk=Stocks.objects.filter(stk_id=request.data['stk_id'])[0]
    TS=stk.stk_TickerSym
    recent_stocks_df = yahooFinance.download(TS, period="1mo")

    formatted_prices = []

    for index,price in recent_stocks_df.iterrows():
        formatted_prices.append({'Date': index, 'Close':price['Close'],
                                 'Open':price['Open'],
                                 'High':price['High'],
                                 'Low':price['Low'],
                                 })  # Adjust this based on your actual data structure

    return formatted_prices

