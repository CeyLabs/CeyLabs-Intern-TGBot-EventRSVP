# tests/test_main.py

import unittest
from main import start_command, handle_registration

class TestEventTicketingBot(unittest.TestCase):

    def test_start_command(self):
        self.assertEqual(start_command("Welcome! This bot provides event ticketing functionality."), "Welcome! This bot provides event ticketing functionality.")

    def test_handle_registration(self):
        self.assertEqual(handle_registration("John Doe, johndoe@example.com, 2"), "Registration successful! You have been added to the event group.")

if __name__ == '__main__':
    unittest.main()
