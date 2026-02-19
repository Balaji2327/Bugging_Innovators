import chromadb
import json
import os
from chromadb.utils import embedding_functions

# Initialize the persistent client once
# This will create/read from the './db' folder
chroma_client = chromadb.PersistentClient(path="./db")

# Use the default embedding function (all-MiniLM-L6-v2)
default_ef = embedding_functions.DefaultEmbeddingFunction()

# Create or get the collection
collection = chroma_client.get_or_create_collection(
    name="dsa_misconceptions",
    embedding_function=default_ef
)

def load_data(json_file_path="dsa_data.json"):
    """
    Reads the JSON file and 'upserts' (updates or inserts) data into ChromaDB.
    Supports both misconception format and Striver problem format.
    """
    if not os.path.exists(json_file_path):
        print(f"Error: {json_file_path} not found.")
        return

    print(f"Loading data from {json_file_path}...")
    
    with open(json_file_path, 'r') as f:
        data = json.load(f)

    ids = []
    documents = []
    metadatas = []

    for idx, item in enumerate(data):
        # Determine format based on keys
        if 'misconception' in item:
            # Old format (misconceptions)
            doc_id = f"misconception_{item['topic'].replace(' ', '_')}_{idx}"
            text_content = f"Topic: {item['topic']}. Concept: {item['concept']}. Misconception: {item['misconception']}."
            # Normalized metadata for RAG
            meta = item.copy()
            meta['type'] = 'misconception'
        
        elif 'title' in item:
            # New format (Striver Sheet Problems)
            doc_id = f"problem_{item['id']}_{item['slug']}"
            text_content = (
                f"Problem: {item['title']}. Topic: {item['topic']}. "
                f"Description: {item['description']}. "
                f"Hints: {' '.join(item['hints'])}. "
                f"Editorial: {item['editorial']}"
            )
            # Normalize metadata keys so viva_logic doesn't crash on access
            meta = {
                'topic': item['topic'],
                'concept': item['title'],
                'misconception': item['description'][:200] + "...", # Fallback for display
                'diagnostic_question': item['hints'][0] if item['hints'] else "Check edge cases.",
                'explanation': item['editorial'],
                'type': 'problem',
                'full_json': json.dumps(item) # Store full data stringified if needed
            }
        
        else:
            continue

        ids.append(doc_id)
        documents.append(text_content)
        metadatas.append(meta)

    if ids:
        collection.upsert(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print(f"Successfully upserted {len(ids)} documents into ChromaDB.")
    else:
        print("No valid data found to insert.")

def query_knowledge(query_text, n_results=1):
    """
    Queries the database for the most relevant diagnostic questions/misconceptions.
    Returns the metadata of the top match.
    """
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    
    if results['ids'] and results['ids'][0]:
        # Return the metadata of the first result
        top_result = results['metadatas'][0][0]
        print(f"Found relevant context: {top_result['topic']} - {top_result['misconception']}")
        return top_result
    else:
        print("No relevant context found.")
        return None

if __name__ == "__main__":
    # If run directly, load the data and test a query
    load_data()
    
    # Test Query
    print("\n--- Testing Query ---")
    test_query = "student stuck in infinite loop binary search"
    result = query_knowledge(test_query)
    if result:
        print(f"Diagnostic Question: {result['diagnostic_question']}")
