import requests
import json

# Test data for ambulance creation
test_data = {
    "vehicleNumber": "AMB-001",
    "vehicleModel": "Toyota Hiace",
    "yearMade": "2020",
    "driverName": "John Doe",
    "driverLicense": "DL123456",
    "driverContact": "1234567890",
    "vehicleType": "Basic Life Support",
    "note": "Test ambulance"
}

# API endpoint
url = "http://127.0.0.1:8000/api/admin/ambulance/"

# Headers for JSON content
headers = {
    'Content-Type': 'application/json'
}

try:
    response = requests.post(url, data=json.dumps(test_data), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 201:
        print("SUCCESS: Ambulance created successfully!")
    else:
        print("ERROR: Failed to create ambulance")
except Exception as e:
    print(f"Error: {e}")