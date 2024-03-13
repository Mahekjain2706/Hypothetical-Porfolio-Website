from django.shortcuts import render
from rest_framework.views import APIView 
from . models import *
from rest_framework.response import Response 
from rest_framework.decorators import api_view
from . serializers import *
from . utils import *
import datetime
from django.db.models import Sum
import pandas as pd
from django.http import JsonResponse
# Create your views here.
@api_view(['GET'])
def getstocklist(request):
    data = Stocks.objects.all()
    stocks = StocksSerializer(data,many=True)
    return Response(stocks.data)

@api_view(['GET'])
def getTransactionHis(request):
    data = Transactiontable.objects.filter(user=request.user)
    transaction = TransactiontableSerializer(data,many=True)
    return Response(transaction.data)

@api_view(['GET'])
def getPositionInfo(request):
    data = Positiontable.objects.filter(user=request.user)
    position = PositiontableSerializer(data,many=True)
    return Response(position.data)


@api_view(['GET'])
def getCurrentPNL(request):
    data = Pnltable.objects.filter(user=request.user)
    pnl = PnltableSerializer(data,many=True)
    return Response(pnl.data)

@api_view(['POST'])
def getRiskandPNL(request):
    data=request.data
    request.user=Users.objects.all()[0]
    risk,_=compute_risk(request)
    stk=Stocks.objects.get(stk_id=data['stk_id'])
    current_positions = Stock_prices.objects.filter(stk_id=stk)[0].stk_price

    _,_,pnl=compute_pnl(request.user,data['stk_id'],data['quantity'],current_positions)

    return Response({"risk":risk,"pnl":pnl})

@api_view(['POST'])
def addStock(request):
    print(request.data)
    stockdata = StocksSerializer(data=request.data, many=True)
    if stockdata.is_valid():
        stockdata.save()
        return Response("stock data added successfully")


@api_view(['POST'])
def buyStock(request):
    # print(request.data)
    stockdata={
        "stk_id":request.data['stk_id']
    }
    # stockdata = StocksSerializer(data=request.data, many=True)
    qty=request.data['qty']
    cur_date=datetime.date.today()
    cur_stock_price=(Stock_prices.objects.filter(stk_id=stockdata['stk_id'])[0]).stk_price

    #adding current transaction to transaction table
    stk=Stocks.objects.filter(stk_id=stockdata['stk_id'])[0]
    request.user=Users.objects.all()[0]
    txn_obj=Transactiontable(date=cur_date, stk_id=stk, user=request.user, txn_qty=qty, txn_price=cur_stock_price, market_value=qty*cur_stock_price, transaction_type=0) #here 0 denotes that type is buy
    txn_obj.save()

    #adding to position table
    pv, weighed_price, pnl=compute_pnl(request.user, stockdata['stk_id'], qty, cur_stock_price)

    # psn_obj=Positiontable(user=request.user,stk_id=stockdata['stk_id'], psn_qty=qty, last_price=cur_stock_price,weighed_price=weighed_price, date=cur_date, pv=pv)
    psn_obj=Positiontable.objects.filter(user=request.user, stk_id=stockdata['stk_id'])
    if len(psn_obj==0):
        psn_obj=Positiontable(user=request.user,stk_id=stockdata['stk_id'], psn_qty=qty,weighed_price=weighed_price, date=cur_date, pv=pv)
    else:
        psn_obj=psn_obj[0]
    psn_obj['weighed_price']=weighed_price
    psn_obj['pv']=pv
    psn_obj['psn_qty']+=qty

    #adding into pnl table
    pnl_obj=Pnltable.objects.filter(user=request.user, stk_id=stockdata['stk_id'])
    if len(psn_obj==0):
        pnl_obj=Pnltable(user=request.user,pnl=pnl, date=cur_date)
    else:
        pnl_obj=pnl_obj[0]
    pnl_obj['pnl']=pnl
    pnl_obj['date']=cur_date
    pnl_obj.save()

@api_view(['GET'])
def getCurrentPosition(request,stock_name):
    stock=Stocks.objects.get(stk_name=stock_name)
    data = Positiontable.objects.filter(user=request.user,stk_id=stock)
    position = PositiontableSerializer(data,many=True)
    return Response(position.data)

@api_view(['POST'])
def getClosingPrices(request):
    stk_prices=ClosingPrices(request)
    return JsonResponse(stk_prices, safe=False)









