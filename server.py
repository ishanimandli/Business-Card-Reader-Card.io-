from flask import Flask, redirect, render_template, request, session, flash
from model import db, User, Card, Company_info, Phone_info, Email_info,connect_to_db
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)
app.secret_key = "ABC"
baseAPIurl = '/api/v1'
@app.route(baseAPIurl)
def homePage():
    return render_template('homePage.html')


@app.route(baseAPIurl  + '/login', methods = ['Post'])
def log_in():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    
    if (user is None) or (user.password != password):
        
        return json.dumps({ "message": 'usename or password is wrong', "status": 400 }), 400
    else:
        
        session['id'] = user.user_id
        
    return json.dumps({ "message": 'successfully logged in.', "status": 200 }), 200

@app.route(baseAPIurl+'/su')
def signup():
    return render_template('signUp.html')


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
        return json.dumps({ "message": 'successfully logged in.', "status": 200 }), 200

    else:
        return json.dumps({ "message": 'not successfully logged in.', "status": 500 }), 200



@app.route(baseAPIurl + '/isavailable')
def is_available():
    username = request.args.get('userName')
    email = request.args.get('emailId')
    return json.dumps({ "error": 'Not able to find the username', "status": 500 }), 500
    # user = User.query.filter(User.username == username | User.email_id == email)
    # if user is not None:
    #     if user.username is username:
    #         return 'usename'
    #     else:
    #         return 'email'
    # else:
    #     return False
    # return user != None


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
