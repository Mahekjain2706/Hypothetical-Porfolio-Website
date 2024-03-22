from rest_framework import serializers

from .models import *

class StocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stocks
        fields = '__all__'

class PositiontableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Positiontable
        fields = '__all__'

class PnltableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pnltable
        fields = '__all__'

class TransactiontableSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Transactiontable
        fields = '__all__'

class Stock_pricesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock_prices
        fields = '__all__'

class StocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stocks
        fields = ['stk_id', 'stk_name']

class TransactiontableSerializerUser(serializers.ModelSerializer):
    class Meta:
        model = Transactiontable
        fields = ['txn_id','date','stk_id','txn_qty','txn_price','market_value']

    