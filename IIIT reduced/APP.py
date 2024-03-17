
from flask import Flask, request, jsonify, render_template

app=Flask(__name__)

@app.route('/home', methods=['GET'])
def home():
    return render_template('/views/home.html')

@app.route('/visualize', methods=['GET'])
def visualize():
    return render_template('/views/map.html')

@app.route('/', methods=['GET'])
def index():
    return render_template('/views/map2.html')

if __name__ == "__main__":
    app.run(debug=True)