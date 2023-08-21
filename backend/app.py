from flask import Flask

app = Flask(__name__)

@app.route('/translate', methods=['POST'])
def process_text():
    data = request.json
    if 'text' in data:
        text_to_process = data['text']


if __name__ == '__main__':
    app.run()