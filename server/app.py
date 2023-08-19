from flask import Flask, request, jsonify, session,redirect,url_for
from flask_cors import CORS, cross_origin

from flask_session import Session
from pymongo import MongoClient

app = Flask(__name__)

app.config['SECRET_KEY'] = "passcode"
app.config['SESSION_TYPE'] = 'filesystem'
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)

Session(app)

CORS(app, supports_credentials=True)
client = MongoClient("mongodb+srv://jiaqicheng1104:blM7TkA6NqY8n1vH@dta.p2gykgh.mongodb.net/?retryWrites=true&w=majority")


db = client["DTA"]
user_collection = db["user"]
profile_collection = db["profile"]

@app.route('/api', methods=['GET'])
@cross_origin(supports_credentials=True)
def index():
  
  return {
    "channel": "The BBB",
    "tutorial": "React, Flask and Docker"
  }

  
@app.route('/user', methods=['POST','GET'])
@cross_origin(supports_credentials=True)
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
@cross_origin(supports_credentials=True)
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
        username = user['Username']
        print(session['username'],flush=True)
        return jsonify({'login': 'User Login successfully'}), 200
     else:
       return jsonify({'login': 'Username/Password incorrect'}) , 400
  return jsonify({'login': 'User Not Found'}), 400

@app.route('/Logout', methods=['POST','GET'])
@cross_origin(supports_credentials=True)
def user_Logout():
    print("logout called",flush=True)
    session.pop('username',None)
    print('username' in session)
    return jsonify({'login': 'User Logout successfully'}), 200

@app.route('/check-login', methods=['GET'])
@cross_origin(supports_credentials=True)
def check_login():
    print("check_login called",flush=True)
    if 'username' in session:
        print(session['username'],flush=True)
        return jsonify({'loggedIn': True})
    print("username not in session",flush=True)
    return jsonify({'loggedIn': False})

@app.route('/Task', methods=['POST','GET'])
@cross_origin(supports_credentials=True)
def user_Task():
  data = request.get_json()
  
  Task_Name=data.get('Task_Name')
  Task_Priority=data.get('Task_Priority')
  Task_Description=data.get('Task_Description')

  response = user_collection.update_one(
        {"Username": session['username']},
        {
            "$push": {
                "tasks": {
                    "name": Task_Name,
                    "priority": Task_Priority,
                    "description": Task_Description
                }
            }
        }
    )

  if response.modified_count == 1:
    return jsonify({'message': 'TaskAdded'}), 200
  else:
    return jsonify({'message': 'Failed to add task'}), 500


if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port="8000")