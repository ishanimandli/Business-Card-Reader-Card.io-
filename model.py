from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
db = SQLAlchemy()

class User(db.Model):
    """ Creates user table in database and define relationship with card table. """

    __table__ = 'user'

    # Columns in user table
    user_id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    username = db.Column(db.String(50),
                         unique = True,
                         nullable = False)
    password = db.Column(db.String(50),
                         unique = True,
                         nullable = False)
    first_name = db.Column(db.String(30),
                           nullable =False)
    last_name = db.Column(db.String(30),
                           nullable =False)
    email_id = db.Column(db.String(80),
                           nullable =False,
                           unique = True)
    phone_number = db.Column(db.String(30),
                           nullable =False) 

    # Relationship definition
    card = db.relationship('card')

class Card(db.Model):
    """ Creates card table in database and define relationship with user, phone_no_info, company_info tables. """

    __table__ = 'card'

    # Columns in card table
    card_id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(User.user_id))
    first_name = db.Column(db.String(30),
                           nullable =False)
    last_name = db.Column(db.String(30),
                           nullable =False) 
    company_id = db.Column(db.Integer,
                           db.ForeignKey(Company_info.company_id)) 
    job_title = db.Column(db.String(1000),
                           nullable =False)
    discription = db.Column(db.String,
                           nullable =True)
    
    # Relationship definition
    user = db.relationship('user')
    company = db.relationship('company_info')
    phone = db.relationship('phone_no_info')





class Company_info(db.Model):

    __table__ = 'company_info'

    # Columns in company_info table
    company_id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(User.user_id))
    company_name = db.Column(db.String(80),
                           nullable =False,
                           unique = True)

    # Relationship definition
    company_card = db.relationship('card')



class Phone_info(db.Model):

    __table__ = 'phone_no_info'

    # Columns in phone_no_info table
    id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    card_id = db.Column(db.Integer,
                        db.ForeignKey(Card.card_id))
    phone_number = db.Column(db.String(20),
                           nullable =False,
                           unique = True)  

    # Relationship definition
    phone_card = db.relationship('card')  


def connect_to_db():
    """ Connects to the database. """
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgres:///bizCardBook"
    app.config["SQLALCHEMY_ECHO"] = False
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    connect_to_db()
    #db.create_all()