"""
URL configuration for tradeAnalyzer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('addstocks/', addStock),
    path('getstocklist/', getstocklist),
    path('getTransactionHis/', getTransactionHis),
    path('getPositionInfo',getPositionInfo),
    path('getCurrentPNL',getCurrentPNL),
    path('getRiskandPNL',getRiskandPNL),
    path('getPrices', getPrices),
    path('getStockInfo', getStockInfo),
    # path('getClosingPrices', getClosingPrices),
    path('buyStock', buyStock),
    path('login/', login),
    path('signup/', signup),
    path('getUserlist', getUserStockList),
    path('getTxnlist', getTxnList),
    path('getPnllist', getPnlList),
    path('getTotalPNL', getTotalPNL)

    
]
