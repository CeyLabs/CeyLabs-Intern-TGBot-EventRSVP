from datetime import datetime

def register_user(name, email, ticket_count, group_id, load_database, save_to_database):
    # Load the existing database
    database = load_database()

    # Prepare user data to be saved in the database
    user_data = {
        "name": name,
        "email": email,
        "ticket_count": ticket_count,
        "group_id": group_id,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Append the user data to the database
    database.append(user_data)

    # Save to the database
    save_to_database(database)
