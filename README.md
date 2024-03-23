Enter these commands

```
cd hypothetical-trade-analyzer/backend/tradeAnalyzer
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

On another terminal
```
python hypothetical-trade-analyzer/backend/tradeAnalyzer/core/utils/insertstocks.py
```

Start frontend
```
cd hypothetical-trade-analyzer/frontend
npm install
npm install --save chart.js react-chartjs-2
npm start

Note: If the page directed by react is not http://localhost:3000/
change the url to http://localhost:3000/ 
```
