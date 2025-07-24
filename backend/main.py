from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import ephem
import datetime
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/moon_images", StaticFiles(directory="moon_images"), name="moon_images")



def calculate_image_number(date_obj,illumination_percentage) -> int:
    
    nextday = date_obj + datetime.timedelta(days=1)
    moon2=ephem.Moon(nextday)
    next_illum = moon2.phase

    if(next_illum>illumination_percentage):
        return round((illumination_percentage) / 100 * 100)
    else:
        return round(101+(1-(illumination_percentage) / 100) * 100)


class PhaseRequest(BaseModel):
    date: Optional[str] = None  

@app.post("/phase_for_date")
def phase_for_date(request: PhaseRequest):
    try:
        if request.date:
            date_obj = datetime.datetime.strptime(request.date, "%Y-%m-%d").date()
        else:
            date_obj = datetime.date.today()

        moon = ephem.Moon(date_obj)
        illumination_percentage = moon.phase
        image_number = calculate_image_number(date_obj,illumination_percentage)

        image_url = f"https://moon-o9aq.onrender.com/moon_images/{image_number}.jpg"

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
