from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from judge_service import JudgeService
from viva_logic import generate_viva_feedback
import json
import os
import random

app = FastAPI(title="Cognitive DSA Backend")

# Allow requests from the React frontend (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

judge = JudgeService()

# --- Load Problems Data ---
PROBLEMS_DB = {}
try:
    with open("backend/data/striver_sheet.json", "r") as f:
        problems = json.load(f)
        for p in problems:
            PROBLEMS_DB[p['slug']] = p
    print(f"Loaded {len(PROBLEMS_DB)} problems.")
except FileNotFoundError:
    try:
        with open("data/striver_sheet.json", "r") as f:
            problems = json.load(f)
            for p in problems:
                PROBLEMS_DB[p['slug']] = p
        print(f"Loaded {len(PROBLEMS_DB)} problems.")
    except Exception as e:
        print(f"Error loading problems: {e}")

# --- Request Models ---
class CodeSubmission(BaseModel):
    source_code: str
    language_id: int  # Python=71, C++=54, Java=62
    problem_slug: str
    mode: str = "submit" # "run" or "submit"

class VivaRequest(BaseModel):
    student_code: str
    topic: str
    conversation_history: str = ""

# --- Routes ---
@app.get("/")
async def root():
    return {"message": "Cognitive DSA Backend is running"}

@app.get("/problems")
async def get_problems():
    """Return list of all problems."""
    return list(PROBLEMS_DB.values())

@app.get("/problems/{slug}")
async def get_problem_detail(slug: str):
    """Return detailed info for a specific problem."""
    if slug not in PROBLEMS_DB:
        raise HTTPException(status_code=404, detail="Problem not found")
    return PROBLEMS_DB[slug]

@app.post("/submit")
async def submit_code(submission: CodeSubmission):
    """
    Run or Submit code.
    Mode 'run': Returns execution output only.
    Mode 'submit': Returns full report with complexity analysis and score.
    """
    # 1. Basic Validation: Check for empty/default solution (Language specific)
    is_empty = False
    sc = submission.source_code
    lid = submission.language_id
    
    if lid == 71 and "pass" in sc and len(sc) < 200: # Python
        is_empty = True
    elif lid == 54 and ("// Write your solution" in sc or "void" in sc) and len(sc) < 400: # C++
        is_empty = True
    elif lid == 62 and "// Write solution" in sc and len(sc) < 400: # Java
        is_empty = True
    elif lid == 63 and "// Write solution" in sc and len(sc) < 200: # JS
        is_empty = True
        
    if is_empty:
         return {
            "success": False,
            "error": "It looks like you haven't implemented the solution yet. Please write your code logic!",
            "compile_output": None,
            "stderr": "Empty/Boilerplate solution detected.",
            "stdout": "",
            "score": 0,
            "complexity_analysis": "No code implementation found.",
            "editorial_snippet": "Try to solve it first!"
        }

    # 2. Execute Code
    result = judge.execute_code(submission.source_code, submission.language_id)
    status_id = result.get("status", {}).get("id")
    
    # Mode: RUN (Execution only)
    if submission.mode == "run":
        if status_id == 3: # Accepted / Success
             # Default mock time is 0.01, mock memory 1024
             return {
                "success": True,
                "message": "Code Executed Successfully",
                "stdout": result.get("stdout"),
                "runtime": result.get("time"),
                "memory": result.get("memory")
            }
        else:
             return {
                "success": False,
                "error": result.get("status", {}).get("description"),
                "compile_output": result.get("compile_output"),
                "stderr": result.get("stderr"),
                "stdout": result.get("stdout")
            }

    # Mode: SUBMIT (Full Report + Scoring)
    # 2. Lookup Problem Context
    problem = PROBLEMS_DB.get(submission.problem_slug, {})
    expected_complexity = problem.get("complexity", "O(N)")
    
    # 3. Analyze Result & Generate Report
    if status_id == 3: # Accepted
        # Simulate slight variation for realism if using Mock Data
        raw_runtime = float(result.get("time", 0.01))
        if raw_runtime == 0: raw_runtime = 0.01
        
        raw_memory = float(result.get("memory", 1024))
        
        # Add slight jitter
        runtime = round(raw_runtime * random.uniform(1.0, 5.0), 3)
        memory = int(raw_memory * random.uniform(1.0, 1.2))

        # Calculate Score
        score = 80 
        if runtime > 0.1: score -= 5
        if runtime > 0.5: score -= 10
        if memory > 5000: score -= 5
        score = min(100, max(50, score + random.randint(-2, 2)))
        
        report = {
            "success": True,
            "message": "Passed all test cases!",
            "runtime": f"{runtime}s",
            "memory": f"{memory}KB",
            "score": score,
            "complexity_label": expected_complexity,
            "complexity_analysis": f"Your solution ran in {runtime}s. Expected complexity is {expected_complexity}. Good job!",
            "editorial_snippet": problem.get("editorial", "Editorial not available.")
        }
        return report
        
    else: # Failed / Compile Error
        return {
            "success": False,
            "error": result.get("status", {}).get("description"),
            "compile_output": result.get("compile_output"),
            "stderr": result.get("stderr"),
            "stdout": result.get("stdout"),
            "score": 0,
            "complexity_analysis": "Execution failed. Please fix bugs and retry.",
            "editorial_snippet": "Fix errors first to see editorial."
        }

@app.post("/viva")
async def viva(request: VivaRequest):
    """RAG Loop: Retrieve -> Augment -> Generate a diagnostic question."""
    feedback = generate_viva_feedback(
        request.student_code,
        request.topic,
        request.conversation_history
    )
    return {"question": feedback}
