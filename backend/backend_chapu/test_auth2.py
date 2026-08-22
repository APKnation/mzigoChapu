import requests
# Try to register a user with same username
res_reg = requests.post("http://localhost:8000/api/auth/register/", json={
    "username": "testuser",
    "phone_number": "0722222222",
    "password": "testpassword"
})
print("Register:", res_reg.status_code, res_reg.text)
