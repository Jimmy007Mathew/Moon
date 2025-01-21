import React, { useState, useEffect } from "react";
import axios from "axios";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function App() {
  const [date, setDate] = useState("");
  const [moonData, setMoonData] = useState(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  // Fetch moon data on app load for the current date
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // Current date
        setDate(today);
        const response = await axios.post(
          "http://127.0.0.1:8000/phase_for_date",
          {
            date: today,
          }
        );
        setMoonData(response.data);
      } catch (err) {
        setError("Failed to fetch moon phase data. Please try again.");
      }
    };
    fetchInitialData();
  }, []);

  // Fetch moon data for the entered date
  const fetchMoonPhase = async () => {
    try {
      setError("");
      const response = await axios.post(
        "http://127.0.0.1:8000/phase_for_date",
        {
          date: date || undefined,
        }
      );
      setMoonData(response.data);
    } catch (err) {
      setError("Failed to fetch moon phase data. Please try again.");
    }
  };

  // Configure particles for the space-themed background
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particleOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: { value: "#000000" } },
    particles: {
      number: { value: 200 },
      color: { value: "#ffffff" },
      opacity: { value: 0.8, random: true },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 0.5, random: true },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans">
      {/* Animated starry background */}
      <Particles init={particlesInit} options={particleOptions} />

      <div className="w-full max-w-lg p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-5">
          Moon Phase Visualizer
        </h1>

        {/* Date Input */}
        <div className="mb-5 text-center">
          <label className="block mb-2">
            Enter a date (YYYY-MM-DD):{" "}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </label>
          <button
            onClick={fetchMoonPhase}
            className="mt-3 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition"
          >
            Get Moon Phase
          </button>
        </div>

        {/* Display Error */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Display Moon Data */}
        {moonData && !moonData.error && (
          <div className="mt-5 bg-gray-800 p-5 rounded-md shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-3">Moon Phase Details</h2>
            <p>
              <strong>Date:</strong> {moonData.date}
            </p>
            <p>
              <strong>Illumination Percentage:</strong>{" "}
              {moonData.illumination_percentage.toFixed(2)}%
            </p>
            <p>
              <strong>Image Number:</strong> {moonData.image_number}
            </p>
            <div className="mt-4 flex justify-center">
              <img
                src={moonData.image_url}
                alt="Moon Phase"
                className="max-w-full h-auto rounded-md shadow-md"
              />
            </div>

            {/* Toggleable Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-5 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
            >
              {showDetails ? "Hide" : "Show"} Next Moon Details
            </button>
            {showDetails && (
              <div className="mt-4 text-left">
                <p>
                  <strong>Next New Moon:</strong> {moonData.next_new_moon}
                </p>
                <p>
                  <strong>Next Full Moon:</strong> {moonData.next_full_moon}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
