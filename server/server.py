from flask import Flask, redirect, render_template, request, session, flash, jsonify, current_app
from model import db, User, Card, Company_info, Phone_info, Email_info,connect_to_db
from flask_cors import CORS
from cardScanner import scan_card
import json
import jwt
import datetime
from functools import wraps
from werkzeug.utils import secure_filename
import os
from twilio.rest import Client

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "uploadCards"
CORS(app)
app.secret_key = "thisisasecretkey"



# TO DO: remember to update code
base_api_url = '/api/v1'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # print('------------------------',request)
        token = request.headers['Authorization']
        if 'Bearer' in token:
            #  Remove Bearer from string
            token = token[7:]
        if not token:
            return jsonify({'message': 'Token is missing','status': 403})
        try:
            data = jwt.decode(token, app.secret_key)
        except:
            return jsonify({'message':'Invalid token!','status': 403})

        return f(*args,**kwargs)
    return decorated


def get_user_id():
    token = request.headers['Authorization']
    token = token[7:]
    data = jwt.decode(token,app.secret_key)
    return data['user_id']


@app.route(f'{base_api_url}/login', methods = ['Post'])
def log_in():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    
    if user and user.password == password:
        token = jwt.encode({'user_id':user.user_id, 
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours = 24)},
                            app.secret_key)    
        name = f'{user.first_name} {user.last_name}'
        res = jsonify({"token": token.decode('UTF-8'),
                       "name": name,
                       "message": 'successfully logged in.', 
                       "status": 200 })

        return res

    return jsonify({ "message": 'usename or password is wrong', "status": 400 })
        

@app.route(f'{base_api_url}/signup', methods = ['Post'])
def new_user():
    data = request.get_json()
    fname = data.get('fname')
    lname = data.get('lname')
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    phone = data.get('phone')
    
    user = User.query.filter((User.username==username) | (User.email_id==email)).first()
    # print(user)
    if user is None:
        db.session.add(User(first_name=fname,
                            last_name=lname,
                            username=username,
                            password=password,
                            email_id=email,
                            phone_number=phone))
        db.session.commit()
        # TO DO: jsonify
        return jsonify({ "message": 'user successfully added.', "status": 200 })

    else:
        return jsonify({ "message": 'user is not successfully added.', "status": 500 })

@app.route(f'{base_api_url}/getCardData', methods = ['Get'])
@token_required
def get_cards():
    
    user_id = get_user_id()
    cards = Card.query.filter(Card.user_id == user_id).all()
    
    # print(cards)
    if cards is not None:
        card_info = []
        company_set=set()
        for card in cards:
            company_set.add(card.company.company_name)
            card_info.append({"id":card.card_id, "name":card.first_name+" "+card.last_name})
        return jsonify({"cards":card_info,"comapny_list":list(company_set), "message":"successfully fetched all cards.","status":200})
    else:
        return jsonify({"message":"There is no card record stored by this user.","status":500})


@app.route(f'{base_api_url}/searchByCompany/<companyName>')
@token_required
def search_By_Name(companyName):
    company = Company_info.query.filter(Company_info.company_name == companyName).first()
    # print(company)
    cards = Card.query.filter(Card.company_id==company.company_id, Card.user_id==get_user_id()).all()
    card_info = []
    for card in cards:
        card_info.append({"id":card.card_id, "name":card.first_name+" "+card.last_name})
    return jsonify({"cards":card_info,"message":"successfully fetched all cards.","status":200})


@app.route(f'{base_api_url}/userProfile')
@token_required
def user_profile():
    user = User.query.get(get_user_id())
    return jsonify({"info":{"fname":user.first_name, "lname":user.last_name,"phone":user.phone_number,"email":user.email_id}, "status": 200})


@app.route(f'{base_api_url}/setUserProfile', methods = ['Post'])
@token_required
def set_User_Profile():
    profile = request.get_json()
    user_id = get_user_id()
    fname = profile.get('fname')
    lname = profile.get('lname')
    phone = profile.get('phone')
    email = profile.get('email')
    
    user = User.query.get(user_id)
    user.first_name = fname
    user.last_name = lname
    user.email_id = email
    user.phone_number = phone

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Successfully updated.", "status": 200})


@app.route(f'{base_api_url}/showCardData/<card_id>')
@token_required
def show_card(card_id):
    card = Card.query.get(card_id)
    # print(card)
    phones = Phone_info.query.filter(Phone_info.card_id==card_id).all()
    emails = Email_info.query.filter(Email_info.card_id==card_id).all()
    phone_list = []
    email_list = []
    for phone in phones:
        phone_list.append({"phone_id":phone.id, "phone_num":phone.phone_number})
    for email in emails:
        email_list.append({"id":email.id, "email_id":email.email_id})
    return jsonify({"cardData":{"fname":card.first_name,
                                 "lname":card.last_name,
                                 "jobTitle":card.job_title,
                                 "company":card.company.company_name,
                                 "phones":phone_list,
                                 "emails":email_list,
                                 "description":card.discription},
                    "message": "Successfully fetched",
                    "status": 200})


@app.route(f'{base_api_url}/updateCard', methods = ['Post'])
@token_required
def update_card():
    card_data = request.get_json()
    card_id = card_data.get('card_id')
    fname = card_data.get('fname')
    lname = card_data.get('lname')
    emails = card_data.get('emails')
    phones = card_data.get('phones')
    jobTitle = card_data.get('jobTitle')
    company = card_data.get('companyName')
    discription = card_data.get('description')

    card = Card.query.get(card_id)
    company_obj = Company_info.query.filter(Company_info.company_name == company).first()
    phone_obj = card.phones
    email_obj = card.email

    if company_obj is None:
        db.session.add(card.card_id,company)

    card.first_name = fname
    card.last_name = lname
    card.job_title = jobTitle
    card.discription = discription
    card.company_id = company_obj.company_id

    db.session.add(card)
    db.session.commit()

    for phone in phones:
        # print('--------------------------'+str(phone['phone_id']))
        phone_obj = Phone_info.query.get(phone['phone_id'])
        phone_obj.phone_number = phone['phone_num']
        db.session.add(phone_obj)
        db.session.commit()

    for email in emails:
        email_obj = Email_info.query.get(email['id'])
        email_obj.email_id = email['email_id']
        db.session.add(email_obj)
        db.session.commit()

    return jsonify({"message":"Successfully updated", "status": 200})

@app.route(f'{base_api_url}/deleteCard', methods = ['Post'])
@token_required
def delete_Card():
    formData = request.get_json()
    card_id = formData.get('card_id')

    card = Card.query.get(card_id)

    cards = Card.query.filter(Card.company_id == card.company_id).all()

    card.deleteCard()
    
    
    if cards is None:
        company = Company_info.query.get(company_id)
        db.session.delete(company)
        
    db.session.commit()

    return jsonify({"message": "Card is successfully deleted.","status": 200})


@app.route(f'{base_api_url}/updatePassword', methods = ['Post'])
@token_required
def update_password():
    update_details = request.get_json()
    username = update_details.get('username')
    old_password = update_details.get('oldPassword')
    new_password = update_details.get('newPassword')

    user = User.query.filter(User.username == username).first()
    if user is None:
        return jsonify({"message": "Invalid username or password", "status": 4011})
    elif user.password != old_password:
        return jsonify({"message": "Invalid username or password", "status": 401})
    else:
        user.password = new_password
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Password is successfully updated.", "status": 200})


@app.route(f'{base_api_url}/scanCard', methods = ['Post'])
@token_required
def scan_Card():
    image_File = request.files['file']
    # print(request.files['file'].filename)
    
    filename = secure_filename(image_File.filename)
    # print(os.path.join(os.path.dirname(__file__),app.config['UPLOAD_FOLDER'], filename))
    image_File.save(os.path.join(os.path.dirname(__file__),app.config['UPLOAD_FOLDER'], filename))
    data = scan_card(filename)
    print('-----------------------------------------------------')
    # print(data)
    phone_list = []
    email_list = []

    for index,phone in enumerate(data['phones']):
        phone_list.append({"phone_id":"p"+str(index), "phone_num":phone})
    for index,email in enumerate(data['emails']):
        email_list.append({"id":"e"+str(index), "email_id":email})
    print(data)
    return jsonify({"data":{'name':data['name'],
                            'phones':phone_list,
                            'emails':email_list,
                            'jobTitle':data['jobTitle']},
                    "message":"Data is fetched successfully.","status":200})


@app.route(f'{base_api_url}/saveNewCard',methods=['Post'])
@token_required
def save_new_card():
    newCard = request.get_json()

    user_id = get_user_id()
    fname = newCard.get('fname')
    lname = newCard.get('lname')
    phone_list = newCard.get('phone_number')
    email_list = newCard.get('email_id')
    jobTitle = newCard.get('jobTitle')
    company = newCard.get('company')
    description = newCard.get('description')
    # print(newCard)

    isCompany = Company_info.query.filter(Company_info.company_name == company).first()
    if isCompany is None:
        c_id = db.session.add(Company_info(company_name = company))
        db.session.commit()
        # print(c_id)
    
    company_data = Company_info.query.filter(Company_info.company_name == company).first()

    db.session.add(Card(user_id = user_id,
                        first_name = fname,
                        last_name = lname,
                        company_id = company_data.company_id,
                        job_title = jobTitle,
                        discription = description))
    db.session.commit()

    card = Card.query.filter(Card.user_id == user_id).order_by(Card.card_id.desc()).first()

    for phone in phone_list:
        db.session.add(Phone_info(card_id = card.card_id,
                                  phone_number = phone['phone_num']))

    for email in email_list:
        db.session.add(Email_info(card_id = card.card_id,
                                  email_id = email['email_id']))

    db.session.commit()
    
    # 
    # client = Client(account_sid, auth_token)

    # message = client.messages \
    #                 .create(
    #                     body=f'{fname} {lname} has been added successfully.',
    #                     from_='+12066732998',
    #                     to='+12139521102'
    #                 )

    # print(message.sid)
    return jsonify({'message': 'Success','status':200})




if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')

