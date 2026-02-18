import requests

url = "http://127.0.0.1:8000/submit"
payload = {
    "source_code": "print('Hello World')",
    "language_id": 71,
    "problem_id": "test_001"
}

try:
    response = requests.post(url, json=payload)
    print(response.status_code)
    print(response.json())
except requests.exceptions.ConnectionError:
    print("Connection Error: Is the server running?")
except Exception as e:
    print(f"An error occurred: {e}")
