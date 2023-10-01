from flask import Flask, request, jsonify, abort
import requests
from urllib.parse import urlparse
from requests.exceptions import (Timeout, InvalidURL)
from flask_cors import CORS
from flask_limiter import Limiter
import tunnelblaster as tb

app = Flask(__name__)

CORS(app, resources={r"/fetch_url_array": {"origins": "*"},  #OPEN ORIGINS UNTIL EXTENSION ID PROBLEM IS SOLVED
                    r"/fetch_video_info": {"origins": "*"}})

app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  #INCOMING SIZE LIMITER (1MB)

limiter = Limiter( #INCOMING RATE LIMITER
    app,
    default_limits=["100 per day","100 per hour"]
)

@app.route('/fetch_url_array', methods=['POST'])
@limiter.limit("15 per minute")
def fetch_url_array_endpoint():
    try:
        data = request.json
        if 'url' not in data:
            return jsonify({'error': 'Host URL not provided'}), 400
        url = data['url']
        print("API is processing host URL:", url)
        payload = tb.process_host_url(url) #CHECKS THE HOST URL FOR PLAYLIST OR WRAP IN ARRAY   
        return jsonify({'url_array': payload}), 200  #KEY FOR URL LIST IS 'URL_ARRAY'
    except Exception as e:
        return jsonify({'API failed to process host url': str(e)}), 500

@app.route('/fetch_video_info', methods=['POST'])
@limiter.limit("15 per minute")
def fetch_video_info_endpoint():
    try:
        data = request.json
        if 'url' not in data:
            return jsonify({'error': 'Video url not provided'}), 400
        if 'prompts' not in data:
            return jsonify({'error': 'Config not provided, check browser extension popup'}), 400
        url = data['url']
        config = data['prompts']
        print("API is processing video url:", url) 
        payload = tb.process_video_url(url, config)  #PASS URL AND CONFIG TO FETCH INFORMATION
        print("API processed video url, here is the information:", payload)
        return jsonify({'video_info': payload}), 200 #RETURNS INFORMATION AS OBJECT
    except Exception as e:
        print(jsonify({'API failed to process video url': str(e)}), 500)  #DOUBLE CHECK THE ERROR
        raise e
    
if __name__ == '__main__':
    app.run(debug=True)
