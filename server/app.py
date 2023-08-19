# Server Initial Setup
from flask import Flask, request, jsonify, session,redirect,url_for
from flask_cors import CORS, cross_origin

from flask_session import Session
from pymongo import MongoClient

# Flask and CORS setup
app = Flask(__name__)
CORS(app)
client = MongoClient("mongodb+srv://jiaqicheng1104:blM7TkA6NqY8n1vH@dta.p2gykgh.mongodb.net/?retryWrites=true&w=majority")
db = client["DTA"]

user_collection = db["user"]
profile_collection = db["profile"]
token_collection = db["token"]

# oauth meta
from flask import url_for, redirect,render_template
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from email.message import EmailMessage
from googleapiclient.discovery import build
from google.oauth2 import credentials
from datetime import datetime
import secrets
import base64
import os

load_dotenv()
app.secret_key = os.getenv('SECRET_KEY')

def update_token(name, token, refresh_token=None, access_token=None):
    if refresh_token:
        item = token_collection.find_one({"name": name, "refresh_token": refresh_token})
    elif access_token:
        item = token_collection.find_one({"name": name, "access_token": access_token})
    else:
        return

    if item:
        item["access_token"] = token["access_token"]
        item["refresh_token"] = token.get("refresh_token")
        item["expires_at"] = token["expires_at"]
        token_collection.update_one({"_id": item["_id"]}, {"$set": item})

oauth = OAuth(app, update_token=update_token)

oauth.register(
    name='googleProfile',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={'scope': 'openid profile email'}
)

oauth.register(
    name='googleSendEmail',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    authorize_url="https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent",
    client_kwargs={'scope': 'https://www.googleapis.com/auth/gmail.send'}
)

# routes

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


#############################################
#                                           #
#     forget password routes and logic      #
#                                           #
#############################################
@app.route('/forget-password', methods=['POST'])
def forget_password_req():
  data = request.get_json()
  inp_email = data['email']
  
  if inp_email == None:
    return jsonify({'message': 'No email provided'}), 400
  
  user = user_collection.find_one({'Email': inp_email})
  
  if user == None:
    return jsonify({'message': 'Email not found in database'}), 400
  
  send_reset_link(inp_email)
  
  return jsonify({'message': 'Success'}), 200


def send_reset_link(email):
  token = token_collection.find_one({'name': 'googleSendEmail'})
  
  reset_token = create_reset_token(email)
  
  creds = credentials.Credentials(
    token=token["access_token"],
    refresh_token=token["refresh_token"],
    token_uri="https://oauth2.googleapis.com/token",
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    scopes=['https://www.googleapis.com/auth/gmail.send']
  )
  
  service = build('gmail','v1',credentials=creds)
  encoded_email = create_reset_email(reset_token,email)
  (service.users().messages().send(userId="me", body=encoded_email).execute())


# creates and stores reset token
def create_reset_token(email):
  
  ret = secrets.token_urlsafe(32)
  
  # expire time for the token is 1 hour
  expires_at = datetime.now().timestamp() + 3600
  token_type = "reset_token"
  reset_token = ret
  user = user_collection.find_one({'Email': email})
  
  new_tok = {
    'reset_token': reset_token,
    'expires_at': expires_at,
    'token_type': token_type,
    'user': user['_id']
  }
  
  token_collection.insert_one(new_tok)
  
  return ret


def create_reset_email(reset_token, receiver):
  email = EmailMessage()
  email['To'] = receiver
  email['From'] = 'dta672023@gmail.com'
  email['Subject'] = "Password Reset for Daily Task Assistant"
  email.set_content("Hello, this daily task assistant, \n Please click the following link to change your password:\n http://localhost:8080/reset-password/{}\n The link will expire in one hour".format(reset_token))
  
  encoded_message = base64.urlsafe_b64encode(email.as_bytes()).decode()
  return {
    'raw': encoded_message
  }


@app.route('/reset-password/<reset_token>', methods=['GET','POST'])
def reset_password(reset_token):
  
  if request.method == 'GET':
    token = token_collection.find_one({'reset_token': reset_token})
    
    if token == None or datetime.now().timestamp() > token['expires_at']:
      
      if(token != None):
        token_collection.delete_one({'_id': token['_id']})
      
      return render_template('link-expired.html')
    
    return render_template('reset-password.html', reset_token=reset_token, message="")
  
  elif request.method == 'POST':
    
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')
    
    if new_password != confirm_password:
      return render_template('reset-password.html', reset_token=reset_token, message="Passwords must be the same!")
    
    token = token_collection.find_one({'reset_token': reset_token})
    user_id = token['user']
    
    user_collection.update_one({'_id': user_id}, { '$set': {'PassWord': new_password}})
    token_collection.delete_one({'_id': token['_id']})
    
    return redirect('http://localhost:3030/')

  return jsonify({'message': 'invalid request method'}), 400

# uncomment the following two routes and send a request to 
# /send-email-setup logged in as admin gmail 
# to setup access token for admins
# *** Make sure to delete the old token first! ***
# note to self - may need to implement the above to do automatic
@app.route('/send-email-setup')
def send_mail_setup():
    redirect_uri = url_for('send_mail_auth', _external=True)
    return oauth.googleSendEmail.authorize_redirect(redirect_uri)


@app.route('/send-email-auth')
def send_mail_auth():
    token = oauth.googleSendEmail.authorize_access_token()
    
    name = "googleSendEmail"
    access_token = token["access_token"]
    refresh_token = token["refresh_token"]
    expires_at = token["expires_at"]
    token_type = token["token_type"]
    user = user_collection.find_one({"Username": "admin"})
    
    print(user, flush=True)
    
    new_token = {
      "name": name,
      "access_token": access_token,
      "refresh_token": refresh_token,
      "expires_at": expires_at,
      "token_type": token_type,
      "user": user["_id"]
    }
    
    token_collection.insert_one(new_token)
    return jsonify({'message': 'Success'}), 200


if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port="8000")