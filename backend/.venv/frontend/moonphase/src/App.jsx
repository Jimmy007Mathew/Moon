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
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-b from-[#0B1120] to-[#1a1b26] text-white font-sans">
      <Particles init={particlesInit} options={particleOptions} />

      <div className="min-h-screen w-full p-4 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full"
        >
          {/* Header - Always on top */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Moon className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
            <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Moon Phase Visualizer
            </h1>
          </motion.div>

          {/* Main Content - Horizontal on desktop, vertical on mobile */}
          <div className="flex flex-col lg:flex-row lg:gap-12 h-full">
            {/* Left Side - Controls */}
            <div className="w-full lg:w-1/4 flex flex-col gap-6 mb-8 lg:mb-0">
              <div className="flex flex-col gap-4 bg-gray-800/50 p-6 rounded-lg backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-white w-full text-lg"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchMoonPhase}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Moon className="w-6 h-6" />
                      Get Moon Phase
                    </>
                  )}
                </motion.button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Right Side - Moon Display and Details */}
            <AnimatePresence>
              {moonData && !moonData.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col lg:flex-row gap-8"
                >
                  {/* Moon Image */}
                  <div className="lg:flex-1 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="relative aspect-square w-full max-w-xl"
                    >
                      <img
                        src={moonData.image_url}
                        alt="Moon Phase"
                        className="w-full h-full object-cover rounded-full shadow-2xl ring-4 ring-blue-500/20"
                      />
                    </motion.div>
                  </div>

                  {/* Moon Details */}
                  <div className="lg:w-1/3 space-y-6">
                    <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-lg">
                      <h3 className="text-2xl font-semibold mb-4 text-blue-400">
                        Current Phase
                      </h3>
                      <p className="text-4xl font-bold mb-2">
                        {moonData.illumination_percentage.toFixed(2)}%
                        Illuminated
                      </p>
                      <p className="text-xl text-gray-400">{moonData.date}</p>
                    </div>

                    <motion.button
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-full p-4 bg-gray-800/50 rounded-lg flex items-center justify-between hover:bg-gray-700/50 transition-colors backdrop-blur-lg"
                    >
                      <span className="font-medium text-xl">
                        Next Moon Events
                      </span>
                      {showDetails ? (
                        <ChevronUp className="w-8 h-8" />
                      ) : (
                        <ChevronDown className="w-8 h-8" />
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-lg">
                            <div className="flex items-center gap-3 mb-4">
                              <Moon className="w-8 h-8 text-blue-400" />
                              <h3 className="text-2xl font-semibold">
                                Next New Moon
                              </h3>
                            </div>
                            <p className="text-xl">{moonData.next_new_moon}</p>
                          </div>

                          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-lg">
                            <div className="flex items-center gap-3 mb-4">
                              <Sun className="w-8 h-8 text-yellow-400" />
                              <h3 className="text-2xl font-semibold">
                                Next Full Moon
                              </h3>
                            </div>
                            <p className="text-xl">{moonData.next_full_moon}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
