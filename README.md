# Business Card Reader(Card.io)
Business Card Reader(Card.io) is a web based application that provides users a convenient way to store their business card automatically. It processes the image of the business card provided by the user and extracts information like person name, phone number, email address, job title, company name from an image. It allows users to store the card information and maintain them. This application allows users to share their information to other person through message.

## Table of Contents
  - Tech stack
  - Features
  - Installation
  
## Tech Stack
- **Frontend:** React
- **Backend:** Python, FLask, SQLAlchemy, OpenCV, Pytesseract, numpy
- **Database:** PostgreSQL
- **API:** TWILIO

## Features
It provides features like : 
- Scans business card image provided by user.
- Extract information like person name, phone numbers, email addresses, job title and company name from image and fills out the form for validation to user
- Stores the business card details.
- Update and delete the card details.
- Search the card through person name and company name.
- Share user information to other user whose card is stored in user's account through message.

## Installation
##### Requirements:
- PostgreSQL
- Python 3
- Node.JS
- yarn
- Twilio API key

To have this app running on your local computer, please follow the below steps:

Clone repository:
```sh
$ git clone https://github.com/ishanimandli/Business-Card-Reader.git
```
Create a virtual environment:
(Herer I am using vagrant but if you are using some other virtual machine feel free to use its command to set up virtual enviornment.)
```sh
$ virtualenv env
```
Activate the virtual environment:
```sh
$ source env/bin/activate
```
Install dependencies for backend 🔗:
```sh
$ pip3 install -r requirements.txt
```
Get your own secret keys 🔑 for Flickr and Twilio. Save them to a file secrets.py. Your file should look something like this

```sh
TWILIO_SID = 'abc'
TWILIO_AUTH = 'abc'
```
Create database 'bizCardBook'
```sh
$ createdb bizCardBook
```
Create your database tables
```sh
$ python3 model.py
```
Run the backend from the command line.
```sh
$ python3 server.py
```
Install dependencies for frontend 🔗:
Go to frontend folder and install yarn
```sh
$ sudo port install yarn
```
Install dependencies 
```sh
$ yarn install
```
Run the fromtend from command line
```sh
$ yarn start
```
### Todos

 - Convert web application to mobile application.
 - Provide support for multiple language support and multiple country phone number.
 - Implementation of send a request which can be directly stored instead of message.


**Free Software, Hell Yeah!**

