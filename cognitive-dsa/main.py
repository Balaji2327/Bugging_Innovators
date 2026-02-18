from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from judge_service import JudgeService

app = FastAPI()
judge = JudgeService()

class CodeSubmission(BaseModel):
    source_code: str
    language_id: int # Python=71, C++=54, Java=62
    problem_id: str

@app.post("/submit")
async def submit_code(submission: CodeSubmission):
    # Run the code through Judge0
    result = judge.execute_code(submission.source_code, submission.language_id)
    
    # Check if code passed (Status ID 3 = 'Accepted')
    # Note: result might be an error dict, so using .get safely
    status_id = result.get("status", {}).get("id")
    
    if status_id == 3:
        return {
            "success": True,
            "message": "Code passed test cases. Proceeding to AI Viva...",
            "runtime": result.get("time"),
            "memory": result.get("memory"),
            "stdout": result.get("stdout")
        }
    else:
        return {
            "success": False,
            "error": result.get("status", {}).get("description"),
            "compile_output": result.get("compile_output"),
            "stderr": result.get("stderr"),
            "stdout": result.get("stdout")
        }

@app.get("/")
async def root():
    return {"message": "Cognitive DSA Backend is runnning"}
