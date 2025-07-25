import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Calendar,
  Loader2,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function App() {
  const [date, setDate] = useState("");
  const [moonData, setMoonData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const audioRef = useRef(new Audio("assets/star.mp3"));

  // Audio controls
  useEffect(() => {
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  const toggleSound = () => {
    if (isMuted) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        const response = await axios.post(
          "https://moon-o9aq.onrender.com/phase_for_date",
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

  // Always use the passed date, or current state as fallback
  const fetchMoonPhase = async (reqDate) => {
    try {
      setLoading(true);
      setError("");
      const apiDate = reqDate || date || undefined;
      const response = await axios.post(
        "https://moon-o9aq.onrender.com/phase_for_date",
        {
          date: apiDate,
        }
      );
      setMoonData(response.data);
    } catch (err) {
      setError("Failed to fetch moon phase data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's moon phase
  const fetchTodaysMoonPhase = async () => {
    try {
      setLoading(true);
      setError("");
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      const response = await axios.post(
        "https://moon-o9aq.onrender.com/phase_for_date",
        {
          date: today,
        }
      );
      setMoonData(response.data);
    } catch (err) {
      setError("Failed to fetch today's moon phase data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Compute new date, update state, and fetch using that new date
  const handlePreviousDay = () => {
    const newDateObj = new Date(date);
    newDateObj.setDate(newDateObj.getDate() - 1);
    const newDateStr = newDateObj.toISOString().split("T")[0];
    setDate(newDateStr);
    fetchMoonPhase(newDateStr);
  };

  const handleNextDay = () => {
    const newDateObj = new Date(date);
    newDateObj.setDate(newDateObj.getDate() + 1);
    const newDateStr = newDateObj.toISOString().split("T")[0];
    setDate(newDateStr);
    fetchMoonPhase(newDateStr);
  };

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  // Handle Date Change from Modal
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchMoonPhase(newDate);
    setShowDatePicker(false);
  };

  // --- Particle options as before ---
  const particleOptions = {
    fullScreen: { enable: false, zIndex: -1 },
    background: { color: "#000000" },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "attract" },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 5,
          duration: 10,
        },
      },
    },
    particles: {
      number: {
        value: 1000,
        density: { enable: true, value_area: 800 },
      },
      color: { value: ["#ffffff", "#87CEEB"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.8,
        random: true,
        animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false },
      },
      size: {
        value: 3,
        random: true,
        animation: { enable: true, speed: 4, minimumValue: 0.3, sync: false },
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-b from-[#0B1120] to-[#1a1b26] text-white font-sans">
      {/* Particles Container */}
      <div className="fixed inset-0 z-0">
        <Particles
          init={particlesInit}
          options={particleOptions}
          style={{ position: "fixed" }}
        />
      </div>

      {/* Sound Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 p-3 bg-gray-800/50 backdrop-blur-lg rounded-full hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ touchAction: "manipulation" }}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-gray-300" />
        ) : (
          <Volume2 className="w-6 h-6 text-blue-400" />
        )}
      </motion.button>

      {/* Day Navigation Buttons */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePreviousDay}
          className="p-3 bg-gray-800/50 backdrop-blur-lg rounded-full hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-gray-700/70"
          style={{ touchAction: "manipulation" }}
        >
          <ChevronLeft className="w-6 h-6 text-blue-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextDay}
          className="p-3 bg-gray-800/50 backdrop-blur-lg rounded-full hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-gray-700/70"
          style={{ touchAction: "manipulation" }}
        >
          <ChevronRight className="w-6 h-6 text-blue-400" />
        </motion.button>
      </div>

      <div className="min-h-screen w-full p-4 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full"
        >
          {/* Header */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-3 mb-8"
          ></motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:gap-12 h-full pt-10">
            {/* Left Side - Controls and New Moon */}
            <div className="w-full lg:w-1/4 flex flex-col gap-6 mb-8 lg:mb-0">
              <div className="flex flex-col gap-4 bg-gray-800/50 p-6 rounded-lg backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  {/* The input is no longer here */}
                  <span className="text-lg">{date}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDatePicker(true)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  disabled={loading}
                  style={{ touchAction: "manipulation" }}
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchTodaysMoonPhase}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  disabled={loading}
                  style={{ touchAction: "manipulation" }}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Moon className="w-6 h-6" />
                      Today's Moon Phase
                    </>
                  )}
                </motion.button>
              </div>

              {moonData && !moonData.error && (
                <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Moon className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold">Next New Moon</h3>
                  </div>
                  <p className="text-lg text-gray-300">
                    {moonData.next_new_moon}
                  </p>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {/* Date Picker Modal */}
              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.98 }}
                      className="bg-gray-900 p-6 rounded-lg flex flex-col items-center gap-4"
                    >
                      <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        className="bg-transparent border border-blue-400 rounded px-3 py-2 text-lg text-white outline-none"
                        autoFocus
                      />
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Cancel
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Center and Right - Moon Display and Details */}
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
                        className="w-full h-full object-cover rounded-full shadow-2xl  ring-blue-500/20"
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

                    <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Sun className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-xl font-semibold">
                          Next Full Moon
                        </h3>
                      </div>
                      <p className="text-lg text-gray-300">
                        {moonData.next_full_moon}
                      </p>
                    </div>
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
