from flask import Flask, request, jsonify, abort
import requests
from urllib.parse import urlparse
from requests.exceptions import (Timeout, InvalidURL)
from flask_cors import CORS
from flask_limiter import Limiter
import tunnelblaster as tb

app = Flask(__name__)

#CORS Configurations (should probably secure more, maybe with another proxy)
CORS(app, resources={r"/conf_CORS": {"origins": "*"},
                    r"/fetch_url_array": {"origins": "*"},
                    r"/fetch_video_info": {"origins": "*"}})

app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  #INCOMING SIZE LIMITER

limiter = Limiter( #INCOMING RATE LIMITER
    app,
    default_limits=["100 per day","100 per hour"]
)

@app.route('/fetch_url_array', methods=['POST'])
@limiter.limit("15 per minute")
def fetch_url_array_endpoint():
    try:

        #Grab Data
        data = request.json
        
        #Check that there is an url, or formatted correctly
        if 'url' not in data:
            return jsonify({'error': 'Host URL not provided'}), 400
        
        #Save url
        url = data['url']
        print("API is processing host URL:", url)
        
        #Checks if playlist and extracts array of urls
        url_array = tb.process_host_url(url)
        print("API processed host url, here is the array:", url_array)

        #Return array of urls as JSON object
        return jsonify({'url_array': url_array}), 200
        
    # Error Handlers
    except Exception as e:
        return jsonify({'API failed to process host url': str(e)}), 500

@app.route('/fetch_video_info', methods=['POST'])
@limiter.limit("15 per minute")
def fetch_video_info_endpoint():
    try:
        #Grab Data
        data = request.json
        
        #Check that there is an url, or formatted correctly
        if 'url' not in data:
            return jsonify({'error': 'Video url not provided'}), 400
        
        #Save url
        url = data['url']
        print("API is processing video url:", url)
        
        #Checks if playlist and extracts array of urls
        video_info = tb.process_video_url(url)
        print("API processed video url, here is the information:", video_info)

        #Return array of urls as JSON object
        return jsonify({'video_info': video_info}), 200
        
    # Error Handlers
    except Exception as e:
        return jsonify({'API failed to process video url': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
