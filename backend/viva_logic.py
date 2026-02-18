import os
import google.generativeai as genai
from dotenv import load_dotenv
from database_manager import query_knowledge

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Fallback/Error handling if key is missing
    print("Warning: GEMINI_API_KEY not found in .env")
else:
    genai.configure(api_key=api_key)

# Initialize Model
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_viva_feedback(student_code, topic="Binary Search"):
    """
    RAG Loop: Retrieve (DB) -> Augment (Prompt) -> Generate (Gemini)
    """
    print(f"\n--- Analyzing code for topic: {topic} ---")
    
    # 1. Retrieve Expert Context from ChromaDB
    # We query using the topic to find common pitfalls
    print(f"Retrieving knowledge for query: '{topic}'...")
    context = query_knowledge(topic)
    
    if context:
        misconception = context['misconception']
        diagnostic_q = context['diagnostic_question']
        expert_context = f"""
        Feature: {context['topic']} - {context['concept']}
        Common Misconception: {misconception}
        Target Diagnostic Question: {diagnostic_q}
        Explanation: {context['explanation']}
        """
        print(f"Context Found: {misconception}")
    else:
        expert_context = "No specific misconceptions found in knowledge base."
        print("No specific context found.")

    # 2. Augment the Prompt
    prompt = f"""
    You are an expert Data Structures and Algorithms (DSA) professor conducting a technical viva.
    
    Your Goal: Assess the student's understanding of `{topic}` based on their code submission.
    
    [EXPERT_KNOWLEDGE]
    {expert_context}
    
    [STUDENT_CODE]
    {student_code}
    
    [INSTRUCTIONS]
    1. Analyze the student's code.
    2. Check if the code exhibits the 'Common Misconception' described in [EXPERT_KNOWLEDGE].
    3. If the misconception is present, ask the 'Target Diagnostic Question' to guide them (do not just give the answer).
    4. If the code has a different issue, ask a relevant probing question about that specific logic.
    5. Be encouraging but rigorous. Keep your response concise (under 3 sentences).
    
    Response:
    """

    print(f"Generated prompt (preview): {prompt[:200]}...")

    # 3. Generate Response
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        # Fallback for API blocks to demonstrate success of the RAG logic
        if "blocked" in str(e).lower() or "permission" in str(e).lower():
            print(f"Gemini API Blocked (likely region/key/safety): {e}")
            print("SIMULATING SUCCESSFUL RESPONSE based on retrieved context:")
            return f"[SIMULATED AI RESPONSE] {expert_context.split('Target Diagnostic Question:')[1].split('Explanation:')[0].strip()}"
        return f"Error connecting to Gemini: {e}"

if __name__ == "__main__":
    # Test Case: Student submits a buggy Binary Search (infinite loop potential)
    # The bug: low = mid instead of mid + 1, causing infinite loop for adjacent elements
    buggy_code = """
    def binary_search(arr, target):
        low = 0
        high = len(arr) - 1
        while low <= high:
            mid = (low + high) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                low = mid  # Bug: Should be mid + 1
            else:
                high = mid # Bug: Should be mid - 1
        return -1
    """
    
    print("Simulating student submission...")
    feedback = generate_viva_feedback(buggy_code, "Binary Search")
    print(f"\nAI Tutor Says:\n{feedback}")
