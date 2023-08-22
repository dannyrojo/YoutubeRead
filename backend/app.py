from flask import Flask, request, jsonify, abort
import requests
from requests.exceptions import (Timeout, InvalidURL)
from flask_cors import CORS
from flask_limiter import Limiter
from urllib.parse import urlparse

app = Flask(__name__)

#Configure app-level permissions

CORS(app, origins=["chrome-extension://ahaeigklbfodjikacnfinmladbogkcla"]) #ORIGIN

app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  #INCOMING SIZE LIMITER

limiter = Limiter( #INCOMING RATE LIMITER
    app,
    default_limits=["100 per day","100 per hour"]
)

#Configure user permissions 
def check_auth(username, password):
    return username == 'admin' and password == 'secret'

#Configure outgoing permissions
ALLOWED_DOMAINS = ["www.youtube.com"]
def get_domain_from_url(url):
    parsed_url = urlparse(url)
    return parsed_url.netloc



@app.route('/fetch_webpage', methods=['POST'])
@limiter.limit("15 per minute")
def fetch_webpage():
    try:
        #Authenticate
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return jsonify({"error": "Unauthorized"}), 401
        
        #Grab Data
        data = request.json
        
        #Check that there is an url, or formatted correctly
        if 'url' not in data:
            return jsonify({'error': 'URL not provided'}), 400
        
        #Save url
        url = data['url']

        #Check if youtube.com
        domain = get_domain_from_url(url)
        if domain not in ALLOWED_DOMAINS:
            return jsonify({'error': 'Domain not allowed'}), 403
        
        #SCRIPT
        response = requests.get(url, timeout=10, stream=True)
        content_length = int(response.headers.get('content-length', 0))
        if content_length > 3 * 1024 * 1024:  # EXTERNAL SIZE LIMITER
            return jsonify({'error': 'The content is too large'}), 413
        response.content # Download and store to response.

        if response.status_code == 200:
            return jsonify({'content': response.text}), 200
        else:
            return jsonify({'error': 'Failed to fetch webpage'}), response.status_code
    
    # Network Error Handlers
    except Timeout:
        return jsonify({'error': 'Network problem.  Please check your connection.'}), 503
    except InvalidURL:
        return jsonify({'error': 'InvalidURL.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
