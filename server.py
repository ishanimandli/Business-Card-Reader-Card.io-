from flask import Flask, redirect, render_template, request, session, flash, jsonify
from model import db, User, Card, Company_info, Phone_info, Email_info,connect_to_db
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)
app.secret_key = "ABC"
baseAPIurl = '/api/v1'


@app.route(baseAPIurl  + '/login', methods = ['Post'])
def log_in():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    
    if user and user.password == password:
        session['id'] = user.user_id
        id = user.user_id
        print(session['id'])
            
        res = jsonify({"user_id":id, "message": 'successfully logged in.', "status": 200 })

        return res

    return jsonify({ "message": 'usename or password is wrong', "status": 400 })
        

@app.route(baseAPIurl+'/signup', methods = ['Post'])
def new_user():
    data = request.get_json()
    fname = data.get('fname')
    lname = data.get('lname')
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    phone = data.get('phone')
    
    user = User.query.filter((User.username==username) | (User.email_id==email)).first()
    print(user)
    if user is None:
        db.session.add(User(first_name=fname,
                            last_name=lname,
                            username=username,
                            password=password,
                            email_id=email,
                            phone_number=phone))
        db.session.commit()
        return json.dumps({ "message": 'user successfully added.', "status": 200 }), 200

    else:
        return json.dumps({ "message": 'user is not successfully added.', "status": 500 }), 500

@app.route(baseAPIurl+'/getCardData/<id>', methods = ['Get'])
def get_cards(id):
   
    cards = Card.query.filter(Card.user_id==id).all()
    
    print(cards)
    if cards is not None:
        card_info = []
        company_set=set()
        for card in cards:
            company_set.add(card.company.company_name)
            card_info.append({"id":card.card_id, "name":card.first_name+" "+card.last_name})
        return jsonify({"cards":card_info,"comapny_list":list(company_set), "message":"successfully fetched all cards.","status":200})
    else:
        return jsonify({"message":"There is no card record stored by this user.","status":500})


@app.route(baseAPIurl+'/searchByCompany/<id>/<companyName>')
def search_By_Name(id,companyName):
    company = Company_info.query.filter(Company_info.company_name == companyName).first()
    print(company)
    cards = Card.query.filter(Card.company_id==company.company_id, Card.user_id==id).all()
    card_info = []
    for card in cards:
        card_info.append({"id":card.card_id, "name":card.first_name+" "+card.last_name})
    return jsonify({"cards":card_info,"message":"successfully fetched all cards.","status":200})


@app.route(baseAPIurl+'/userProfile/<id>')
def user_profile(id):
    user = User.query.get(id)
    return jsonify({"info":{"fname":user.first_name, "lname":user.last_name,"phone":user.phone_number,"email":user.email_id}, "status": 200})


@app.route(baseAPIurl+'/setUserProfile', methods = ['Post'])
def set_User_Profile():
    profile = request.get_json()
    user_id = profile.get('id')
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


@app.route(baseAPIurl+'/showCardData/<card_id>')
def show_card(card_id):
    card = Card.query.get(card_id)
    print(card)
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


@app.route(baseAPIurl+'/updateCard', methods = ['Post'])
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
    phone_obj = card.phone
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
        print('--------------------------'+str(phone['phone_id']))
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

@app.route(baseAPIurl+'/deleteCard', methods = ['Post'])
def delete_Card():
    formData = request.get_json()
    card_id = formData.get('card_id')
    card = Card.query.get(card_id)
    company_id = card.company_id
    phones = card.phone
    for phone in phones:
        db.session.delete(phone)
        db.session.commit()
    db.session.delete(card)
    db.session.commit()
    cards = Card.query.filter(Card.company_id == company_id).all()
    if cards is None:
        company = Company_info.query.get(company_id)
        db.session.delete(company)
        db.session.commit()

    return jsonify({"message": "Card is successfully deleted.","status": 200})


@app.route(baseAPIurl+'/updatePassword', methods = ['Post'])
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

if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
