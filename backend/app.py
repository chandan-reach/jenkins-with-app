
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

CITY_API_URL = "https://api.cityapi.org/v1/cities"


@app.route("/")
def home():
    return jsonify({
        "message": "Flask Population API is running"
    })


@app.route("/api/population", methods=["GET"])
def get_population():

    name = request.args.get("name", "").strip()
    city = request.args.get("city", "").strip()

    if not name or not city:
        return jsonify({
            "error": "Name and city are required"
        }), 400

    try:
        response = requests.get(
            CITY_API_URL,
            params={"search": city},
            timeout=10
        )

        response.raise_for_status()

        result = response.json()
        cities = result.get("data", [])

        if not cities:
            return jsonify({
                "error": "City not found"
            }), 404

        # Prefer an exact city-name match
        city_data = next(
            (
                item for item in cities
                if item.get("name", "").lower() == city.lower()
            ),
            cities[0]
        )

        return jsonify({
            "name": name,
            "city": city_data.get("name"),
            "country": city_data.get("country_code"),
            "population": city_data.get("population"),
            "message": f"Hello {name}! Here is the population of {city_data.get('name')}."
        })

    except requests.RequestException as error:
        return jsonify({
            "error": "Unable to fetch population data",
            "details": str(error)
        }), 502


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
