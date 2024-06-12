import json
from datetime import datetime
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Define paths for configuration and database files
CONFIG_PATH = './src/config.json'
DATABASE_PATH = './src/database.json'

# Function to load the database
def load_database():
    try:
        with open(DATABASE_PATH, 'r') as db_file:
            return json.load(db_file)
    except FileNotFoundError:
        return []  # Return an empty list if the database file does not exist

# Function to save to the database
def save_to_database(data):
    with open(DATABASE_PATH, 'w') as db_file:
        json.dump(data, db_file)

# Load configuration from config.json
with open(CONFIG_PATH, 'r') as config_file:
    config = json.load(config_file)
    TOKEN = config.get("token")
    GROUP_CHAT_ID = config.get("group_id")  # Use chat ID directly

# Import utility scripts
from src.utils.event_info import get_event_info
from src.utils.group_invitation import invite_to_group
from src.utils.registration import register_user

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    event_info_text = get_event_info()
    await update.message.reply_text(f"Welcome! This bot provides event ticketing functionality.\n\n{event_info_text}")

async def register_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Please enter your name, email, and number of tickets you want in JSON format (e.g., {\"name\": \"John\", \"email\": \"john@example.com\", \"ticket_count\": 2}):")

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Use /register to register for tickets and get added to the event group.")

async def handle_registration(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    try:
        user_info = json.loads(text)
        name = user_info.get("name")
        email = user_info.get("email")
        ticket_count = user_info.get("ticket_count")
        if name and email and ticket_count:
            # Register user and add to the database
            register_user(name, email, ticket_count, GROUP_CHAT_ID, load_database, save_to_database)

            await update.message.reply_text("Registration successful! You have been added to the event group.")
            await invite_to_group(update.message.chat.id, GROUP_CHAT_ID, TOKEN)
        else:
            await update.message.reply_text("Invalid registration format. Please provide name, email, and ticket count in the JSON format.")
    except json.JSONDecodeError:
        await update.message.reply_text("Invalid registration format. Please enter a valid JSON object containing name, email, and ticket count.")
    except Exception as e:
        await update.message.reply_text(f"An error occurred: {e}")

async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f'Update {update} caused error: {context.error}')

if __name__ == '__main__':
    print('Starting bot..')
    app = Application.builder().token(TOKEN).build()

    # Commands
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('register', register_command))
    app.add_handler(CommandHandler('help', help_command))
    
    # Messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_registration))

    # Error handler
    app.add_error_handler(error)

    # Polling
    print('Polling.....')
    app.run_polling(poll_interval=3)
