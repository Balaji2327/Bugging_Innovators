import os
import google.generativeai as genai
import chromadb
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_setup():
    print("Testing setup...")
    
    # Check Gemini API Key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env file.")
        return

    print(f"Gemini API Key found: {api_key[:5]}...{api_key[-5:]}")

    # Configure Gemini
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Hello, can you hear me?")
        print(f"Gemini Response: {response.text}")
    except Exception as e:
        print(f"Error testing Gemini: {e}")

    # Check ChromaDB
    try:
        chroma_client = chromadb.Client()
        collection = chroma_client.create_collection(name="test_collection")
        collection.add(
            documents=["This is a test document"],
            metadatas=[{"source": "test"}],
            ids=["id1"]
        )
        results = collection.query(
            query_texts=["test"],
            n_results=1
        )
        print("ChromaDB Test: Success")
        print(f"ChromaDB Query Result: {results['documents']}")
    except Exception as e:
        print(f"Error testing ChromaDB: {e}")

if __name__ == "__main__":
    test_setup()
