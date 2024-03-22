Enter these commands
```
cd backend/tradeAnalyzer/tradeAnalyzer
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
On another terminal
```
python backend/tradeAnalyzer/core/utils/insertstocks.py
```
Start frontend
```
cd frontend
npm install
npm start

Note: If the page directed by react is not http://localhost:3000/
change the url to http://localhost:3000/ 
