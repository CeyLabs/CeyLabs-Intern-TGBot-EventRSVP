# src/utils/database.py

import json

def load_database():
    with open('database.json', 'r') as f:
        return json.load(f)

def save_database(data):
    with open('database.json', 'w') as f:
        json.dump(data, f)
