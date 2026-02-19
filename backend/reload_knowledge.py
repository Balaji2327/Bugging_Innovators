from database_manager import load_data, collection

if __name__ == "__main__":
    print("--- Reloading Knowledge Base ---")
    
    # 1. Load Misconceptions
    print("\n[1/2] Loading Misconceptions...")
    load_data("dsa_data.json")
    
    # 2. Load Striver Sheet Problems
    print("\n[2/2] Loading Striver Sheet Problems...")
    load_data("data/striver_sheet.json")
    
    print(f"\nTotal documents in Knowledge Base: {collection.count()}")
    print("--- Done ---")
