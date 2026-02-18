from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from judge_service import JudgeService
from viva_logic import generate_viva_feedback

app = FastAPI(title="Cognitive DSA Backend")

# Allow requests from the React frontend (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

judge = JudgeService()

# --- Request Models ---
class CodeSubmission(BaseModel):
    source_code: str
    language_id: int  # Python=71, C++=54, Java=62
    problem_id: str
    topic: str = "Binary Search"  # Topic for RAG context

class VivaRequest(BaseModel):
    student_code: str
    topic: str

# --- Routes ---
@app.get("/")
async def root():
    return {"message": "Cognitive DSA Backend is running"}

@app.post("/submit")
async def submit_code(submission: CodeSubmission):
    """Run code through Judge0 and return execution result."""
    result = judge.execute_code(submission.source_code, submission.language_id)
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

@app.post("/viva")
async def viva(request: VivaRequest):
    """RAG Loop: Retrieve -> Augment -> Generate a diagnostic question."""
    feedback = generate_viva_feedback(request.student_code, request.topic)
    return {"question": feedback}
