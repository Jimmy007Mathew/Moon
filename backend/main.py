from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import ephem
import datetime
from typing import Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for specific domains, e.g., ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve moon phase images
app.mount("/moon_images", StaticFiles(directory="moon_images"), name="moon_images")



def calculate_image_number(date_obj,illumination_percentage) -> int:
    
    nextday = date_obj + datetime.timedelta(days=1)
    moon2=ephem.Moon(nextday)
    next_illum = moon2.phase

    if(next_illum>illumination_percentage):
        return round((illumination_percentage) / 100 * 107)
    else:
        return round(108+(1-(illumination_percentage) / 100) * 115)


# Request model
class PhaseRequest(BaseModel):
    date: Optional[str] = None  # Optional date in "YYYY-MM-DD" format

@app.post("/phase_for_date")
def phase_for_date(request: PhaseRequest):
    try:
        # Parse the date or use today's date
        if request.date:
            date_obj = datetime.datetime.strptime(request.date, "%Y-%m-%d").date()
        else:
            date_obj = datetime.date.today()

        # Calculate moon details
        moon = ephem.Moon(date_obj)
        illumination_percentage = moon.phase
        image_number = calculate_image_number(date_obj,illumination_percentage)

        # Construct the image URL using the naming convention
        image_url = f"http://127.0.0.1:8000/moon_images/mp%20({image_number}).png"

        # Calculate next new moon and full moon
        next_new_moon = ephem.next_new_moon(date_obj).datetime().strftime("%Y-%m-%d %H:%M:%S")
        next_full_moon = ephem.next_full_moon(date_obj).datetime().strftime("%Y-%m-%d %H:%M:%S")

        return {
            "date": str(date_obj),
            "illumination_percentage": illumination_percentage,
            "image_number": image_number,
            "image_url": image_url,
            "next_new_moon": next_new_moon,
            "next_full_moon": next_full_moon,
        }
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}
