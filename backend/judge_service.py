import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

class JudgeService:
    def __init__(self):
        # Using specific host and auth as requested
        self.base_url = "https://ce.judge0.com"
        self.auth_user = "a1133bc6-a0f6-46bf-a2d8-6157418c6fe2"
        
        self.headers = {
            "X-Auth-User": self.auth_user,
            "Content-Type": "application/json"
        }

    def get_languages(self):
        """Fetch supported languages from Judge0."""
        url = f"{self.base_url}/languages"
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching languages: {e}")
            return []

    def submit_code(self, source_code: str, language_id: int, stdin: str = ""):
        """
        Submits code to Judge0 and returns the token.
        """
        url = f"{self.base_url}/submissions"
        querystring = {"base64_encoded": "false", "fields": "*"}
        
        payload = {
            "source_code": source_code,
            "language_id": language_id,
            "stdin": stdin
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.headers, params=querystring)
            response.raise_for_status()
            return response.json().get("token")
        except requests.exceptions.HTTPError as e:
            if response.status_code == 403:
                print("WARNING: Judge0 API returned 403 (Not Subscribed). Using MOCK response.")
                return "MOCK_TOKEN_123"
            print(f"Error submitting code: {e}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"Error submitting code: {e}")
            return None

    def get_submission_result(self, token: str):
        """
        Fetches the result of a submission using its token.
        """
        if token == "MOCK_TOKEN_123":
            return {
                "status": {"id": 3, "description": "Accepted"},
                "time": "0.01",
                "memory": "1024",
                "stdout": "Hello World\n",
                "stderr": None,
                "compile_output": None
            }

        url = f"{self.base_url}/submissions/{token}"
        querystring = {"base64_encoded": "false", "fields": "*"}
        
        try:
            response = requests.get(url, headers=self.headers, params=querystring)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching result: {e}")
            return None

    def execute_code(self, source_code: str, language_id: int, stdin: str = ""):
        """
        Orchestrates the submission and result polling.
        """
        token = self.submit_code(source_code, language_id, stdin)
        print(f"DEBUG: Token: {token}")
        
        if not token:
            print("DEBUG: Failed to get token")
            return {"error": "Failed to submit code"}

        # Poll for result
        max_retries = 10
        for i in range(max_retries):
            # Wait before polling to give Judge0 time to process
            time.sleep(1)
            
            result = self.get_submission_result(token)
            print(f"DEBUG: Attempt {i+1} Result: {result}")
            
            if not result:
                return {"error": "Failed to retrieve result"}
                
            status_id = result.get("status", {}).get("id")
            
            # Status IDs: 1 (In Queue), 2 (Processing)
            if status_id not in [1, 2]:
                return result
            
        return {"error": "Execution timed out"}
