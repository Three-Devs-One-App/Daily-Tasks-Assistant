from flask import Flask, request, jsonify, session,redirect,url_for
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = "12345"#set it to the environment key instead of hardcode one
CORS(app)
client = MongoClient("mongodb+srv://jiaqicheng1104:blM7TkA6NqY8n1vH@dta.p2gykgh.mongodb.net/?retryWrites=true&w=majority")


db = client["DTA"]
user_collection = db["user"]
profile_collection = db["profile"]

@app.route('/api', methods=['GET'])
def index():
  
  return {
    "channel": "The BBB",
    "tutorial": "React, Flask and Docker"
  }

  
@app.route('/user', methods=['POST','GET'])
def user_create():
  data = request.get_json()
  
  if not data:
      return jsonify({'message': 'No input data provided'}), 400
  
  username = data.get('Username')
  email = data.get('Email')
  password = data.get('pass1')
  
  if not all([username, email, password]):
    return jsonify({'message': 'Missing data'}), 400
  
  user_collection.insert_one({"Username": username,
    "Email": email,"PassWord":password})
  
  return jsonify({'message': 'User created successfully'}), 200

@app.route('/Login', methods=['POST','GET'])
def user_Login():

  data = request.get_json()


  if not data:
      return jsonify({'login': 'No input data provided'}), 400
  
  username = data.get('Username')
  password = data.get('Password')

  
  if not all([username,password]):
    return jsonify({'login': 'Missing data'}), 400
  
  user = user_collection.find_one({'Username':username})

  if user:
     if user['PassWord'] == password:
        print(user['Username'],flush=True)
        session['username'] = user['Username']
        print(session['username'],flush=True)
        return jsonify({'login': 'User Login successfully'}), 200
     else:
       return jsonify({'login': 'Username/Password incorrect'}) , 400
  return jsonify({'login': 'User Not Found'}), 400


@app.route('/Logout', methods=['POST','GET'])
def user_Logout():
    session.pop('username',None)
    return jsonify({'login': 'User Logout successfully'}), 200

@app.route('/check-login', methods=['GET'])
def check_login():
    return jsonify({'loggedIn': True})


if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port="8000")