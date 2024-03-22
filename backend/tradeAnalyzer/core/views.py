from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from . serializers import *
import ast
from . utils import *
import datetime
from django.db.models import Sum
import pandas as pd
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.core.serializers import serialize
from django.forms.models import model_to_dict
# Create your views here.
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
import yfinance as yahooFinance
import json

import json


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        userdata = User.objects.filter(user_name=username).values()

        if len(userdata) == 0:
            print("no user")
            return Response({'message': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        user_data = User.objects.get(user_name=username)

        user = json.dumps(model_to_dict(user_data))
        if ((password == userdata[0]['user_pwd'])):
            return JsonResponse({'message': 'Login successful', 'user': user})
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        confirm_pwd = request.data.get('confirm_password')
        #
        userdata = User.objects.filter(user_name=username).values()
        if len(userdata) > 0:
            print("already a user----------")
            return Response({'message': 'Useename taken'}, status=status.HTTP_400_BAD_REQUEST)
        if (password != confirm_pwd):
            return Response({'message': 'Password do not match'}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(password)
        user = User(user_name=username,
                    user_pwd=hashed_password, user_email=email)
        user.save()
        return Response({'message': 'Login successful'})


@api_view(['POST'])
def getStockInfo(request):
    data = request.data
    stk = Stocks.objects.get(stk_id=data['stk_id'])
    stkTickerSym = stk.stk_TickerSym
    try:
        GetStockInformation = yahooFinance.Ticker(stkTickerSym)
        stk_info = GetStockInformation.info
        data = {"Company Sector": stk_info['sector'],
                "Price Earnings Ratio": stk_info['trailingPE'],
                "Company Beta": stk_info['beta'],
                "PE ratio": stk_info['forwardPE'],
                "Dividend Yield": stk_info['dividendYield'],
                "Market Cap": stk_info['marketCap'],
                "Volume": stk_info['volume'],
                "Average Volume": stk_info['averageVolume'],
                "Previous Close": stk_info['previousClose'],
                "Open": stk_info['open'],
                "High": stk_info['dayHigh'],
                "Low": stk_info['dayLow'],
                "52 Week High": stk_info['fiftyTwoWeekHigh'],
                "52 Week Low": stk_info['fiftyTwoWeekLow'],
                "50 Day Moving Average": stk_info['fiftyDayAverage'],
                "200 Day Moving Average": stk_info['twoHundredDayAverage'],
                "Price to Sales Ratio": stk_info['priceToSalesTrailing12Months'],
                "Price to Book Ratio": stk_info['priceToBook'],
                "Currency": stk_info['currency'],
                }
        stk.stk_info = json.dumps(data)
    except:
        data = json.loads(stk.stk_info)

    return Response(data)


@api_view(['GET'])
def getstocklist(request):
    # data =pd.read_csv("D:/desshaw/project/hypothetical-trade-analyzer/csv_files/Stocks.csv")
    data = Stocks.objects.all().values()
    stocks = StocksSerializer(data, many=True)
    return Response(stocks.data)


@api_view(['POST'])
def getUserStockList(request):
    user = request.data.get('user')
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    data = Positiontable.objects.filter(user=userobj).values()
    # stocks=User_StockSerializer(data, many=True)

    stks = []
    for positon in data:
        stk = Stocks.objects.get(pk=positon['stk_id_id'])
        stk = StocksSerializer(stk, many=False)
        stks.append(stk.data)

    return JsonResponse(stks, safe=False)


@api_view(['GET'])
def getTxnList(request):
    data = Transactiontable.objects.all().values()
    txn = TransactiontableSerializer(data, many=False)
    return Response(txn.data)


@api_view(['GET'])
def getPnlList(request):
    data = Pnltable.objects.all().values()
    pnl = PnltableSerializer(data, many=True)
    return Response(pnl.data)


@api_view(['POST'])
def getTransactionHis(request):
    user = request.data['user']
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    data = Transactiontable.objects.filter(user=userobj)
    stocks = TransactiontableSerializerUser(data, many=True)
    return JsonResponse(stocks.data, safe=False)


@api_view(['GET'])
def getPositionInfo(request):
    user = request.data['user']
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    data = Positiontable.objects.filter(user=userobj)
    position = PositiontableSerializer(data, many=True)
    return Response(position.data)


@api_view(['POST'])
def getCurrentPNL(request):
    user = request.data['user']
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    compute_pnl_profile(userobj)
    data = Pnltable.objects.filter(user=userobj)
    stocks = PnltableSerializer(data, many=True)
    return Response(stocks.data)


@api_view(['POST'])
def getTotalPNL(request):
    user = request.data['user']
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    data = Pnltable.objects.filter(user=userobj)
    pnls = []
    data = data.values()
    for stk in data:
        pnls.append(stk['pnl'])
    total_pnl = sum(pnls)
    return Response(total_pnl)


@api_view(['POST'])
def getRiskandPNL(request):
    data = request.data
    user = request.data['user']
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    request.user = userobj
    portfolio_var_covariance, portfolio_var_correlation, risk_covariance, risk_correlation = compute_risk(
        request)
    stk = Stocks.objects.get(stk_id=data['stk_id'])
    # current_positions = Stock_prices.objects.filter(stk_id=stk)[0].stk_price
    pnl_obj = Pnltable.objects.filter(user=request.user, stk_id=data['stk_id'])
    if (len(pnl_obj) == 0):
        pnl = 0
    else:
        pnl = pnl_obj[0].pnl
    pnl_old = pnl
    request.data['quantity'] = 0
    portfolio_var_covariance_old, portfolio_var_correlation_old, risk_covariance_old, risk_correlation_old = compute_risk(
        request)
    # _,_,pnl_old=compute_pnl(request.user,data['stk_id'],data['quantity'],current_positions)

    return Response({"portfolio_var_covariance": portfolio_var_covariance.round(2), "portfolio_var_correlation": portfolio_var_correlation.round(2), "risk_covariance": risk_covariance.round(2), "risk_correlation": risk_correlation.round(2), "pnl": round(pnl, 2),
                     "portfolio_var_covariance_old": portfolio_var_covariance_old.round(2), "portfolio_var_correlation_old": portfolio_var_correlation_old.round(2), "risk_covariance_old": risk_covariance_old.round(2), "risk_correlation_old": risk_correlation_old.round(2), "pnl_old": round(pnl_old, 2)
                     })

# @api_view(['POST'])
# def getRiskandPNLMultiStock(request):
#     data=request.data
#     request.user=Users.objects.all()[0]
#     portfolio_var_covariance, portfolio_var_correlation, risk_covariance, risk_correlation=compute_risk_multistock(request)
#     stk=Stocks.objects.get(stk_id=data['stk_id'])
#     current_positions = Stock_prices.objects.filter(stk_id=stk)[0].stk_price
#     _,_,pnl=compute_pnl(request.user,data['stk_id'],data['quantity'],current_positions)
#     request.data['quantity']=0
#     portfolio_var_covariance_old, portfolio_var_correlation_old, risk_covariance_old, risk_correlation_old=compute_risk(request)
#     _,_,pnl_old=compute_pnl(request.user,data['stk_id'],data['quantity'],current_positions)
#     return Response({"portfolio_var_covariance":portfolio_var_covariance, "portfolio_var_correlation":portfolio_var_correlation, "risk_covariance":risk_covariance, "risk_correlation":risk_correlation,"pnl":pnl,
#                      "portfolio_var_covariance_old":portfolio_var_covariance_old, "portfolio_var_correlation_old":portfolio_var_correlation_old, "risk_covariance_old":risk_covariance_old, "risk_correlation_old":risk_correlation_old,"pnl_old":pnl_old
#                      })


@api_view(['POST'])
def addStock(request):
    stockdata = StocksSerializer2(data=request.data, many=True)
    if not stockdata.is_valid():
        errors = stockdata.errors

        for field, error_list in errors.items():
            # Field-specific error handling
            for error in error_list:
                print(f"Error in field '{field}': {error}")
    if stockdata.is_valid():
        stockdata.save()
        return Response("stock data added successfully")


@api_view(['POST'])
def addStockPrices(request):
    stockdata = Stock_pricesSerializer(data=request.data, many=True)
    if not stockdata.is_valid():
        errors = stockdata.errors

        for field, error_list in errors.items():
            # Field-specific error handling
            for error in error_list:
                print(f"Error in field '{field}': {error}")
    if stockdata.is_valid():
        stockdata.save()
        return Response("stock data added successfully")


@api_view(['POST'])
def buyStock(request):
    # print(request.data)
    stockdata = {
        "stk_id": request.data['stk_id']
    }
    data = request.data
    user = request.data['user']
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    request.user = userobj
    # stockdata = StocksSerializer(data=request.data, many=True)
    qty = request.data['qty']
    cur_date = datetime.date.today()
    stock = (Stocks.objects.filter(stk_id=stockdata['stk_id'])[0])
    stock_price = get_current_price(stock.stk_TickerSym)
    stock_price_obj = Stock_prices.objects.get(stk_id=stockdata['stk_id'])
    stock_price_obj.stk_price = stock_price
    stock_price_obj.date_of_pricing = cur_date
    stock_price_obj.save()
    cur_stock_price = stock_price
    stk = stock
    # txn_obj=Transactiontable(date=cur_date, stk_id=stk, user=request.user, txn_qty=qty, txn_price=cur_stock_price, market_value=qty*cur_stock_price, transaction_type=0) #here 0 denotes that type is buy
    dt = {"date": cur_date, "stk_id": stk.pk, "user": request.user.pk, "txn_qty": qty, "txn_price": int(
        cur_stock_price), "market_value": int(qty*cur_stock_price), "transaction_type": 0}
    txn_obj = TransactiontableSerializer(data=dt, many=False)
    if not txn_obj.is_valid():
        errors = txn_obj.errors
        for field, error_list in errors.items():
            # Field-specific error handling
            for error in error_list:
                print(f"Error in field '{field}': {error}")

    else:
        txn_obj.save()

    # adding to position table
    pv, weighed_price, pnl = compute_pnl(
        request.user, stockdata['stk_id'], qty, cur_stock_price)

    # psn_obj=Positiontable(user=request.user,stk_id=stockdata['stk_id'], psn_qty=qty, last_price=cur_stock_price,weighed_price=weighed_price, date=cur_date, pv=pv)
    psn_obj = Positiontable.objects.filter(
        user=request.user, stk_id=stockdata['stk_id'])
    if len(psn_obj) == 0:
        # create new entry in pos table using serializer
        pos_serializer = PositiontableSerializer(
            data={"user": request.user.pk, "stk_id": stk.pk, "psn_qty": qty,
                  "weighed_price": weighed_price, "date": cur_date, "pv": int(pv)}
        )
        pos_serializer.initial_data
        if pos_serializer.is_valid():
            pos_serializer.save()
        else:
            print("ERR1")
            print(pos_serializer.errors)
        # get the new position object
        psn_obj = Positiontable.objects.filter(
            user=request.user, stk_id=stockdata['stk_id'])
    else:
        # update the existing position object using serializer
        pos_serializer = PositiontableSerializer(
            psn_obj[0], data={"psn_qty": psn_obj[0].psn_qty+int(
                qty), "weighed_price": (int)(weighed_price), "date": cur_date, "pv": int(pv)}
        )
        if pos_serializer.is_valid():
            pos_serializer.save()
        else:
            print("ERR2")
            print(pos_serializer.errors)
        # get the new position object
        psn_obj = Positiontable.objects.filter(
            user=request.user, stk_id=stockdata['stk_id'])

    pnl_obj = Pnltable.objects.filter(
        user=request.user, stk_id=stockdata['stk_id'])
    if len(pnl_obj) == 0:
        pnl_obj = Pnltable(user=request.user, pnl=pnl,
                           date=cur_date, stk_id=stockdata['stk_id'])
    else:
        pnl_obj = pnl_obj[0]
    pnl_obj.pnl = pnl
    pnl_obj.date = cur_date
    pnl_obj.save()
    psn_obj = Positiontable.objects.filter(
        user=request.user, stk_id=stockdata['stk_id'])
    # print(psn_obj.date)
    psn_obj = PositiontableSerializer(instance=psn_obj, many=True)
    # if psn_obj.is_valid():
    #     print("YESS")
    # print("qqYESS")

    position_new = Positiontable.objects.filter(user=request.user)
    position_new = PositiontableSerializer(instance=position_new, many=True)
    return Response({"message": "data updated successfully", "stk_psn": psn_obj.data, "position": position_new.data})
    # return Response({"message":"data updated successfully"})


@api_view(['GET'])
def getCurrentPosition(request, stock_name):
    data = request.data
    user = request.data['user']
    user = user['user']
    user = ast.literal_eval(user)
    userobj = User.objects.get(user_name=user['user_name'])
    request.user = userobj
    stock = Stocks.objects.get(stk_name=stock_name)
    data = Positiontable.objects.filter(user=request.user, stk_id=stock)
    position = PositiontableSerializer(data, many=True)
    return Response(position.data)


@api_view(['POST'])
def getPrices(request):
    stk_prices = StockPrices(request)
    return JsonResponse(stk_prices, safe=False)
