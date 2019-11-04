from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
db = SQLAlchemy(app)

class User(db.Model):

    __table__ = 'user'

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


class Card(db.Model):

    __table__ = 'user'

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
                           db.ForeignKey(company)) 


def connect_to_db():
    app.config["SQLALCHEMY_DATABASE_URL"] = "postgresql:///project-ABCR"
    app.config["SQLALCHEMY_ECHO"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False
    db.init_app(app)


def if __name__ == "__main__":
    connect_to_db()