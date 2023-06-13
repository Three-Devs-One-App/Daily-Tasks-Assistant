# Server Initial Setup
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

# Flask and CORS setup
app = Flask(__name__)
CORS(app)

# Database Connection and Setup
client = MongoClient("mongodb+srv://jiaqicheng1104:blM7TkA6NqY8n1vH@dta.p2gykgh.mongodb.net/?retryWrites=true&w=majority")
db = client["DTA"]

user_collection = db["user"]
profile_collection = db["profile"]
token_collection = db["token"]

# oauth meta
from flask import url_for, redirect
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


@app.route('/Profile', methods=['POST','GET'])
def user_Login():
  data = request.get_json()
  
  if not data:
      return jsonify({'message': 'No input data provided'}), 400
  
  username = data.get('Username')
  password = data.get('Password')
  
  if not all([username,password]):
    return jsonify({'message': 'Missing data'}), 400
  
  return jsonify({'message': 'User Login successfully'}), 200


# forget password routes and logic

@app.route('/forget-password', methods=['POST'])
def forget_password_req():
  print('Request received for email',flush=True)
  
  data = request.get_json()
  inp_email = data['email']
  
  if inp_email == None:
    print('No email provided！', flush=True)
    return jsonify({'message': 'No email provided'}), 400
  
  user = user_collection.find_one({'Email': inp_email})
  
  if user == None:
    print('Email {} not found！'.format(inp_email), flush=True)
    return jsonify({'message': 'Email not found in database'}), 400
  
  send_reset_link(inp_email)
  
  return jsonify({'message': 'Success'}), 200


def send_reset_link(email):
  
  print('sending reset link',flush=True)
  token = token_collection.find_one({'name': 'googleSendEmail'})
  reset_token = secrets.token_urlsafe(32)
  
  print('Creating credentials',flush=True)
  creds = credentials.Credentials(
    token=token["access_token"],
    refresh_token=token["refresh_token"],
    token_uri="https://oauth2.googleapis.com/token",
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    scopes=['https://www.googleapis.com/auth/gmail.send']
  )
  
  print('creating service',flush=True)
  service = build('gmail','v1',credentials=creds)
  
  print('Creating email',flush=True)
  encoded_email = create_reset_email(reset_token,email)
  
  print('Sending email',flush=True)
  (service.users().messages().send(userId="me", body=encoded_email).execute())


def create_reset_email(reset_token, receiver):
  email = EmailMessage()
  email['To'] = receiver
  email['From'] = 'dta672023@gmail.com'
  email['Subject'] = "Password Reset for Daily Task Assistant"
  email.set_content("Hello, this daily task assistant. Please click the following link to change your password: http://localhost:8080/reset-password/{}".format(reset_token))
  
  encoded_message = base64.urlsafe_b64encode(email.as_bytes()).decode()
  return {
    'raw': encoded_message
  }


@app.route('/reset-password/<reset_token>', methods=['GET','POST'])
def reset_password(reset_token):
  return jsonify({'message': reset_token}), 200

# # uncomment the following two routes and send a request to 
# /send-email-setup logged in as admin gmail 
# # to setup access token for admins
# @app.route('/send-email-setup')
# def send_mail_setup():
#     redirect_uri = url_for('send_mail_auth', _external=True)
#     return oauth.googleSendEmail.authorize_redirect(redirect_uri)


# @app.route('/send-email-auth')
# def send_mail_auth():
#     token = oauth.googleSendEmail.authorize_access_token()
    
#     name = "googleSendEmail"
#     access_token = token["access_token"]
#     refresh_token = token["refresh_token"]
#     expires_at = token["expires_at"]
#     token_type = token["token_type"]
#     user = user_collection.find_one({"Username": "admin"})
    
#     print(user, flush=True)
    
#     new_token = {
#       "name": name,
#       "access_token": access_token,
#       "refresh_token": refresh_token,
#       "expires_at": expires_at,
#       "token_type": token_type,
#       "user": user["_id"]
#     }
    
#     token_collection.insert_one(new_token)
#     return jsonify({'message': 'Success'}), 200


if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port="8000")