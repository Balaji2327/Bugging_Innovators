import os
from dotenv import load_dotenv
from database_manager import query_knowledge

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if GROQ_API_KEY == "your_groq_api_key_here":
    GROQ_API_KEY = None

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and ("<" in GEMINI_API_KEY or "your_" in GEMINI_API_KEY):
    GEMINI_API_KEY = None

# ── Try Groq first (fast, free, works everywhere) ─────────────────────────────
groq_client = None
if GROQ_API_KEY:
    try:
        from groq import Groq
        groq_client = Groq(api_key=GROQ_API_KEY)
        print("[AI] Using Groq (Llama 3)")
    except Exception as e:
        print(f"[AI] Groq init failed: {e}")

# ── Fallback: Gemini ──────────────────────────────────────────────────────────
gemini_model = None
if not groq_client and GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel(
            'gemini-1.5-flash',
            safety_settings=[
                {"category": c, "threshold": "BLOCK_NONE"}
                for c in [
                    "HARM_CATEGORY_HARASSMENT",
                    "HARM_CATEGORY_HATE_SPEECH",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "HARM_CATEGORY_DANGEROUS_CONTENT",
                ]
            ]
        )
        print("[AI] Using Gemini 1.5 Flash")
    except Exception as e:
        print(f"[AI] Gemini init failed: {e}")


def _build_system_prompt(topic: str, expert_context: str) -> str:
    return f"""You are an expert DSA (Data Structures & Algorithms) professor conducting a Socratic viva on the topic: **{topic}**.

Your rules:
1. You NEVER give the answer or write corrected code directly. Guide the student to find issues themselves.
2. Ask ONE focused question at a time. Keep replies to 2-4 sentences max.
3. If the student goes off-topic (e.g., greets you, says random things), briefly acknowledge it and firmly steer them back to {topic}.
4. If the student shares code, analyze it for bugs using the expert context below.
5. If the student shows understanding, ask a harder follow-up (edge cases, complexity).
6. Always end with a question.

Expert Context on {topic}:
{expert_context}
"""


def _parse_history(conversation_history: str) -> list:
    """Convert plain text conversation history to Groq/OpenAI message format."""
    messages = []
    if not conversation_history.strip():
        return messages

    lines = conversation_history.strip().split("\n")
    for line in lines:
        line = line.strip()
        if line.startswith("Tutor:"):
            content = line[len("Tutor:"):].strip()
            if content:
                messages.append({"role": "assistant", "content": content})
        elif line.startswith("Student:"):
            content = line[len("Student:"):].strip()
            if content:
                messages.append({"role": "user", "content": content})
    return messages


def generate_viva_feedback(student_code: str, topic: str = "Binary Search", conversation_history: str = "") -> str:
    """
    RAG + LLM Loop:
    1. Retrieve expert context from ChromaDB
    2. Build system prompt with context
    3. Send full conversation history + new message to LLM
    """
    print(f"\n--- Viva request: topic={topic}, input_len={len(student_code)} ---")

    # 1. RETRIEVE
    context = query_knowledge(topic)
    if context:
        expert_context = (
            f"Topic: {context['topic']} — Concept: {context['concept']}\n"
            f"Common Misconception: {context['misconception']}\n"
            f"Key Diagnostic Question: {context['diagnostic_question']}\n"
            f"Explanation: {context['explanation']}"
        )
    else:
        expert_context = f"No specific misconception data found for {topic}. Use general DSA Socratic questioning."

    system_prompt = _build_system_prompt(topic, expert_context)
    history_messages = _parse_history(conversation_history)

    # 2. GENERATE via Groq
    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *history_messages,
                    {"role": "user", "content": student_code},
                ],
                max_tokens=300,
                temperature=0.7,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"[Groq Error] {e}")

    # 3. GENERATE via Gemini fallback
    if gemini_model:
        try:
            full_prompt = system_prompt + "\n\n"
            for m in history_messages:
                role = "Tutor" if m["role"] == "assistant" else "Student"
                full_prompt += f"{role}: {m['content']}\n"
            full_prompt += f"Student: {student_code}\nTutor:"
            response = gemini_model.generate_content(full_prompt)
            return response.text.strip()
        except Exception as e:
            print(f"[Gemini Error] {e}")

    # 4. No API available — smart offline fallback
    print("[OFFLINE MODE] No API available, using rule-based response.")
    return _offline_response(student_code, topic, context, conversation_history)


def _offline_response(student_code: str, topic: str, context, conversation_history: str) -> str:
    """Smart rule-based fallback when no AI API is available."""
    import random

    if not context:
        return (
            f"I can see you're working on **{topic}**. "
            f"Could you share your approach or paste your code so I can guide you?"
        )

    prefixes = [
        "Good. ", "I see. ", "Okay. ", "Interesting. ", "Let's think about that. "
    ]

    def p():
        return random.choice(prefixes)

    s = student_code.lower().strip()

    # Off-topic / greetings
    if len(s) < 15 and not any(c in s for c in ["def ", "for ", "while", "if ", "return"]):
        greetings = [
            f"Hey there! Let's get focused on **{topic}** — go ahead and share your code or explain your approach.",
            f"Hi! I'm ready to help with **{topic}**. Share your code and let's dig in.",
            f"Hello! Let's make the most of our session on **{topic}**. What's your implementation so far?",
        ]
        return random.choice(greetings)

    # Code detected
    if "def " in s or "for " in s or "while" in s or "return" in s:
        return (
            f"{p()}I can see your code. Let me ask you this: **{context['diagnostic_question']}**\n\n"
            f"*(Think about: {context['misconception']})*"
        )

    # Continuation keywords
    if any(w in s for w in ["yes", "correct", "right", "yeah", "i think"]):
        return f"{p()}Good thinking! Now push further — what happens when the array has **duplicate elements** or is completely **empty**?"

    if any(w in s for w in ["no", "wrong", "not", "don't", "idk", "i don't"]):
        return (
            f"{p()}That's alright — let's trace through it step by step. "
            f"Take a small array like `[2, 5, 8]` and target `5`. Walk me through what your `low`, `mid`, and `high` look like after the **first iteration**."
        )

    if any(w in s for w in ["why", "how", "explain", "what", "?"]):
        return (
            f"{p()}Great question. In **{topic}**, {context['misconception']} is a frequent pitfall because:\n"
            f"{context['explanation']}\n\n"
            f"Does that connect to what you were thinking?"
        )

    # Mid / pointer keywords
    if any(w in s for w in ["mid", "low", "high", "pointer", "index"]):
        return (
            f"{p()}You're thinking about the right variables! Now: **{context['diagnostic_question']}**"
        )

    # Generic off-topic steering
    return (
        f"{p()}That's interesting, but let's stay focused on **{topic}**. "
        f"How does what you said relate to **{context['concept']}**? "
        f"If you're unsure, try sharing your code and we'll trace through it together."
    )


if __name__ == "__main__":
    print("=== Test: Initial code submission ===")
    code = "def binary_search(arr, t):\n  l,h=0,len(arr)-1\n  while l<=h:\n    m=(l+h)//2\n    if arr[m]==t: return m\n    elif arr[m]<t: l=m\n    else: h=m\n  return -1"
    r1 = generate_viva_feedback(code, "Binary Search")
    print("Tutor:", r1)

    print("\n=== Test: Off-topic greeting ===")
    r2 = generate_viva_feedback("hiii", "Binary Search", f"Tutor: {r1}\nStudent: hiii")
    print("Tutor:", r2)

    print("\n=== Test: Student answer ===")
    r3 = generate_viva_feedback("I think mid is correct", "Binary Search", f"Tutor: {r1}\nStudent: hiii\nTutor: {r2}\nStudent: I think mid is correct")
    print("Tutor:", r3)
