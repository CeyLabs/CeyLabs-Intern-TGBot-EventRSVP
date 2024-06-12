import requests

async def invite_to_group(user_id, group_chat_id, token):
    url = f"https://api.telegram.org/bot{token}/getMe"
    params = {
        "chat_id": group_chat_id,
        "user_id": user_id,
        "until_date": 0,  # Optional: set to 0 for permanent membership
    }
    try:
        response = requests.post(url, data=params)
        response.raise_for_status()
        data = response.json()
        if not data.get("ok"):
            raise Exception(f"Failed to add user to group. Reason: {data.get('description')}")
    except requests.RequestException as e:
        raise Exception(f"Error while adding user to group: {e}")
