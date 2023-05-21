from flask import Flask 
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
client = MongoClient("mongodb+srv://jiaqicheng1104:ugDWOD0Oqvc9wVW5@dta.utdqct1.mongodb.net/?retryWrites=true&w=majority")

db = client["DTA"]
user_collection = db["user"]

@app.route('/api', methods=['GET'])
def index():
  return {
    "channel": "The BBB",
    "tutorial": "React, Flask and Docker"
  }

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port="8000")