@echo off
pip3 install virtualenv
virtualenv venv
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python manage.py migrate
echo Installatie klaar!
pause