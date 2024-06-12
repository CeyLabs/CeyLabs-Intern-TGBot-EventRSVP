import requests

async def invite_to_group(user_id, group_chat_id, token):
    url = f"https://api.telegram.org/bot{token}/getMe"
    params = {
        "chat_id": group_chat_id,
        "user_id": user_id
    }
    try:
        response = requests.post(url, data=params)
        response.raise_for_status()
        data = response.json()
        if not data.get("ok"):
            raise Exception(f"Failed to add user to group. Reason: {data.get('description')}")
    except requests.RequestException as e:
        raise Exception(f"Error while adding user to group: {e}")

async def share_invitation_link(chat_id, group_invite_link, context):
    try:
        await context.bot.send_message(chat_id=chat_id, text=f"Thank you for registering! Join the group using this link: {group_invite_link}")
    except Exception as e:
        raise Exception(f"Error while sending group invitation link: {e}")
