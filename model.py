from flask_sqlalchemy import SQLAlchemy



db = SQLAlchemy()

class User(db.Model):
    """ Creates user table in database and define relationship with card table. """

    __tablename__ = "users"

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



class Card(db.Model):
    """ Creates card table in database and define relationship with user, phone_no_info, company_info tables. """

    __tablename__ = "card"

    # Columns in card table
    card_id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.user_id'))
    first_name = db.Column(db.String(30),
                           nullable =False)
    last_name = db.Column(db.String(30),
                           nullable =False) 
    company_id = db.Column(db.Integer,
                           db.ForeignKey('company_info.company_id')) 
    job_title = db.Column(db.String(100),
                           nullable =False)
    discription = db.Column(db.String,
                           nullable =True)
    
    # Relationship definition
    user = db.relationship('User',
                           backref='user_cards')
    company = db.relationship('Company_info',
                            backref='company_cards')
    phone = db.relationship('Phone_info',
                            backref='card_phones')
    email = db.relationship('Email_info',
                            backref='card_emails')



class Company_info(db.Model):
    """ Creates company_info table in database and define relationship with card table. """

    __tablename__ = "company_info"

    # Columns in company_info table
    company_id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    company_name = db.Column(db.String(80),
                           nullable =False,
                           unique = True)



class Phone_info(db.Model):
    """ Creates phone_no_info table in database and define relationship with card table. """

    __tablename__ = "phone_no_info"

    # Columns in phone_no_info table
    id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    card_id = db.Column(db.Integer,
                        db.ForeignKey('card.card_id'))
    phone_number = db.Column(db.String(20),
                           nullable =False,
                           unique = True)  



class Email_info(db.Model):
    """ Creates phone_no_info table in database and define relationship with card table. """

    __tablename__ = "email_info"

    # Columns in phone_no_info table
    id = db.Column(db.Integer, 
                        primary_key = True,
                        autoincrement = True)
    card_id = db.Column(db.Integer,
                        db.ForeignKey('card.card_id'))
    email_id = db.Column(db.String(80),
                           nullable =False,
                           unique = True)  




def connect_to_db():
    """ Connects to the database. """
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgres:///bizCardBook"
    app.config["SQLALCHEMY_ECHO"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    from server import app
    connect_to_db()
    db.create_all()