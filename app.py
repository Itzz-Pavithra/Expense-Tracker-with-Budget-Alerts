from flask import Flask, render_template, request, redirect, url_for
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/expense_tracker"  # Update with your MongoDB URI
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

# Homepage Route
@app.route('/')
def home():
    return render_template("homepage.html")

if __name__ == "__main__":
    app.run(debug=True)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')  # Hash the password

        # Check if the user already exists
        existing_user = mongo.db.users.find_one({'email': email})
        if existing_user:
            return "User already exists"

        # Store user info in the database
        mongo.db.users.insert_one({
            'username': username,
            'email': email,
            'password': hashed_password
        })

        return redirect(url_for('login'))

    return render_template("register.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = mongo.db.users.find_one({'email': email})
        if user and bcrypt.check_password_hash(user['password'], password):  # Verify the password
            return redirect(url_for('dashboard'))  # Redirect to the dashboard page
        else:
            return "Invalid credentials"

    return render_template("login.html")

@app.route('/forgotpassword', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        new_password = request.form['new_password']
        hashed_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

        user = mongo.db.users.find_one({'email': email})
        if user:
            mongo.db.users.update_one(
                {'email': email},
                {'$set': {'password': hashed_new_password}}
            )
            return redirect(url_for('login'))
        else:
            return "Email not found"

    return render_template("forgotpassword.html")
