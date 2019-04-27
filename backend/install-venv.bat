@echo off
pip3 install virtualenv
virtualenv venv
venv\Scripts\pip install -r requirements.txt
echo Installatie klaar!
pause