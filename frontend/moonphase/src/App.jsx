import React, { useState, useEffect } from "react";
import axios from "axios";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

function App() {
  const [date, setDate] = useState("");
  const [moonData, setMoonData] = useState(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
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
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchMoonPhase = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particleOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    background: {
      color: {
        value: "#0B1120",
      },
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#ffffff", "#87CEEB"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.8,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.3,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0B1120] to-[#1a1b26] text-white font-sans">
      <Particles init={particlesInit} options={particleOptions} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl p-8 backdrop-blur-lg bg-gray-900/40 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <Moon className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Moon Phase Visualizer
          </h1>
        </motion.div>

        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-white"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchMoonPhase}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Moon className="w-5 h-5" />
                Get Moon Phase
              </>
            )}
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {moonData && !moonData.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  src={moonData.image_url}
                  alt="Moon Phase"
                  className="w-full rounded-full shadow-2xl ring-4 ring-blue-500/20"
                />

                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">
                      Current Phase
                    </h3>
                    <p className="text-2xl font-bold">
                      {moonData.illumination_percentage.toFixed(2)}% Illuminated
                    </p>
                    <p className="text-gray-400">{moonData.date}</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full p-4 bg-gray-800/50 rounded-lg flex items-center justify-between hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-medium">Next Moon Events</span>
                {showDetails ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </motion.button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Moon className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold">Next New Moon</h3>
                      </div>
                      <p className="text-lg">{moonData.next_new_moon}</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-semibold">Next Full Moon</h3>
                      </div>
                      <p className="text-lg">{moonData.next_full_moon}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
