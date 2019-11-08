from flask import Flask, redirect, render_template, request, session
from model import db, User, Card, Company_info, Phone_info, Email_info,connect_to_db



app = Flask(__name__)
app.secret_key = "SECRET"

@app.route('/')
def homePage():
    return render_template('homePage.html')


@app.route('/signup')
def sign_up():
    return render_template('signUp.html')

@app.route('/signup/submit', methods = ['Post'])
def new_user():
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')
    phone = request.form.get('phone')

    db.session.add(User(first_name=fname,
                        last_name=lname,
                        username=username,
                        password=password,
                        email_id=email,
                        phone_number=phone))
    db.session.commit()
    print(fname,lname,username,password,email,phone)

    return render_template('homepage.html')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')