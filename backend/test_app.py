import pytest
from app import app

@pytest.fixture
def client():
    # Create a test client for the Flask app
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_fetch_url_array(client):
    # Test the /fetch_url_array route
    response = client.post('/fetch_url_array', json={'url': 'https://example.com'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'url_array' in data

def test_fetch_video_info(client):
    # Test the /fetch_video_info route
    data = {'url': 'https://example.com', 'prompts': {'param1': 'value1', 'param2': 'value2'}}
    response = client.post('/fetch_video_info', json=data)
    assert response.status_code == 200
    data = response.get_json()
    assert 'video_info' in data

def test_missing_url(client):
    # Test missing URL parameter
    response = client.post('/fetch_url_array', json={})
    assert response.status_code == 400

# You can add more test cases as needed
