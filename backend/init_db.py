import chromadb
import json
import os
from chromadb.utils import embedding_functions

def init_db():
    print("Initializing ChromaDB...")
    
    # 1. Connect to ChromaDB (Persistent)
    # This creates a folder named 'dsa_chroma_db' in the current directory
    try:
        chroma_client = chromadb.PersistentClient(path="./dsa_chroma_db")
        
        # 2. Get or Create Collection
        # Using default embedding function (all-MiniLM-L6-v2)
        collection = chroma_client.get_or_create_collection(name="dsa_patterns")
        
        # 3. Load Data
        if not os.path.exists('dsa_data.json'):
            print("Error: dsa_data.json not found!")
            return

        with open('dsa_data.json', 'r') as f:
            data = json.load(f)

        ids = []
        documents = []
        metadatas = []

        for idx, item in enumerate(data):
            # Create a unique ID for each entry
            doc_id = f"pattern_{idx}_{item['topic'].replace(' ', '_')}"
            
            # The text to embed - combining topic, concept and misconception
            text_content = f"Topic: {item['topic']}\nConcept: {item['concept']}\nMisconception: {item['misconception']}\nDiagnostic Question: {item['diagnostic_question']}"
            
            ids.append(doc_id)
            documents.append(text_content)
            metadatas.append(item)

        # 4. Upsert Data (Update if exists, Insert if new)
        collection.upsert(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"Successfully loaded {len(ids)} patterns into ChromaDB.")
        
        # Verify count
        count = collection.count()
        print(f"Total documents in collection: {count}")
        
    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == "__main__":
    init_db()
