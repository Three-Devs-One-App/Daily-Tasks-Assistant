from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
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

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port="8000")