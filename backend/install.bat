@echo off
pip3 install virtualenv
virtualenv venv
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python manage.py makemigrations api
venv\Scripts\python manage.py migrate
echo Please enter credentials of new admin account
venv\Scripts\python manage.py createsuperuser
echo Installatie klaar!
pause