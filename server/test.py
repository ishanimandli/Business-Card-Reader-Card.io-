from server import app 
import unittest
import requests
from flask import json

class FlaskUnitTest(unittest.TestCase):

    def test_correct_login(self):
        tester = app.test_client(self)
        response = requests.post('http://10.10.10.61:5000/api/v1/login',
                                json.dumps({'username':'ishani123',
                                         'password':'admin'}),
                                headers={'Content-Type': 'application/json'})
        self.assertEqual(response.json()['status'],200)

    def test_incorrect_login(self):
        tester = app.test_client(self)
        response = requests.post('http://10.10.10.61:5000/api/v1/login',
                                json.dumps({'username':'abc',
                                            'password':'abc'}),
                                headers={'Content-Type':'application/json'})

        self.assertEqual(response.json()['status'],400)

    



if  __name__ == "__main__":
    unittest.main()