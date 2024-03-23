Enter these commands
```
git clone https://github.com/Mahekjain2706/hypothetical-trade-analyzer.git
cd hypothetical-trade-analyzer
pip install -r requirements.txt
```
```
cd backend/tradeAnalyzer
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
change the url to http://localhost:3000/ and start with Signup
Server will be available at http://127.0.0.1:8000 in your browser
```
