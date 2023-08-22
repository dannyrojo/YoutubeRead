from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/fetch_webpage', methods=['POST'])
def fetch_webpage():
    try:
        data = request.json
        if 'url' not in data:
            return jsonify({'error': 'URL not provided'}), 400
        
        url = data['url']
        response = requests.get(url)
        
        if response.status_code == 200:
            return jsonify({'content': response.text}), 200
        else:
            return jsonify({'error': 'Failed to fetch webpage'}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
