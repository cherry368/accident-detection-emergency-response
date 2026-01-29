import requests

def reverse_geocode(lat, lon):
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "lat": lat,
        "lon": lon,
        "format": "json"
    }
    headers = {
        "User-Agent": "AccidentDetectionSystem/1.0"
    }

    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200:
        return "Unknown", "Unknown"

    data = response.json()
    address = data.get("display_name", "Unknown")
    city = (
        data.get("address", {}).get("city") or
        data.get("address", {}).get("town") or
        data.get("address", {}).get("village") or
        "Unknown"
    )

    return address, city
