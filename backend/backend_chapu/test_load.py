import requests

# 1. Login to get fresh token
res_login = requests.post("http://localhost:8000/api/auth/token/", json={
    "phone_number": "0711111111",
    "password": "testpassword"
})
print("Login:", res_login.status_code)
if res_login.status_code == 200:
    token = res_login.json()['access']
    # 2. Post a load
    res_load = requests.post("http://localhost:8000/api/loads/", json={
        "pickup_location": "Dar",
        "dropoff_location": "Mwanza",
        "weight_kg": 500,
        "description": "Test load"
    }, headers={"Authorization": f"Bearer {token}"})
    print("Post Load:", res_load.status_code, res_load.text)
