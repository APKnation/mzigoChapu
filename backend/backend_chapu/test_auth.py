import requests
import sys

# Try to register a user
res_reg = requests.post("http://localhost:8000/api/auth/register/", json={
    "username": "testuser",
    "phone_number": "0711111111",
    "password": "testpassword"
})
print("Register:", res_reg.status_code, res_reg.text)

# Try to login
res_login = requests.post("http://localhost:8000/api/auth/token/", json={
    "phone_number": "0711111111",
    "password": "testpassword"
})
print("Login:", res_login.status_code, res_login.text)
