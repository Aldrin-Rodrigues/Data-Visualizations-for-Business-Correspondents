
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

@app.route('/Pincode', methods=['GET'])
def Pincode():
    return render_template('/views/openstreetmap.html')

@app.route('/BCsearch', methods=['GET'])
def BCsearch():
    return render_template('/views/BCSearch.html')

@app.route('/BCTracker', methods=['GET'])
def BCTracker():
    return render_template('/views/BCTracker.html')

@app.route('/test', methods=['GET'])
def map3():
    return render_template('/views/map3.html')

@app.route('/cropCompare', methods=['GET'])
def cropCompare():
    return render_template('/views/cropCompare.html')

if __name__ == "__main__":
    app.run(debug=True)