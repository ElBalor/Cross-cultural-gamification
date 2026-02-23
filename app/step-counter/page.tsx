'use client';

import { useState, useEffect, useRef } from 'react';

declare global {
  interface Navigator {
    userAgent: string;
  }
}

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [status, setStatus] = useState('Ready to count steps');
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  
  const stepThreshold = 15; // Acceleration threshold to detect a step
  const stepDistance = 0.762; // Average step distance in meters (2.5 ft)
  const caloriesPerStep = 0.04; // Approximate calories burned per step
  
  const lastAcceleration = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastStepTime = useRef<number>(0);
  const sensorSupported = useRef<boolean>(false);

  // Check if device supports motion sensors
  useEffect(() => {
    const checkSensorSupport = () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        // iOS 13+ devices require permission
        sensorSupported.current = true;
      } else if ('ondevicemotion' in window) {
        // Non-iOS devices
        sensorSupported.current = true;
      } else {
        sensorSupported.current = false;
      }
    };

    checkSensorSupport();
  }, []);

  // Request permission for iOS devices
  const requestPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        if (permissionState === 'granted') {
          startCounting();
        } else {
          setStatus('Permission denied. Cannot access motion sensors.');
        }
      } catch (error) {
        setStatus('Error requesting permission: ' + (error as Error).message);
      }
    } else {
      startCounting();
    }
  };

  const startCounting = () => {
    if (!sensorSupported.current) {
      setStatus('Device does not support motion sensors');
      return;
    }

    setIsCounting(true);
    setStatus('Walking... Keep moving!');
    
    window.addEventListener('devicemotion', handleMotion);
  };

  const stopCounting = () => {
    setIsCounting(false);
    setStatus('Step counting paused');
    window.removeEventListener('devicemotion', handleMotion);
  };

  const resetCounter = () => {
    setSteps(0);
    setCalories(0);
    setDistance(0);
    setStatus('Counter reset. Ready to count steps');
  };

  const handleMotion = (event: DeviceMotionEvent) => {
    if (!isCounting) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    // Calculate the magnitude of acceleration
    const accX = acceleration.x || 0;
    const accY = acceleration.y || 0;
    const accZ = acceleration.z || 0;
    
    const magnitude = Math.sqrt(accX * accX + accY * accY + accZ * accZ);
    
    // Detect step based on acceleration magnitude and timing
    const currentTime = Date.now();
    const timeSinceLastStep = currentTime - lastStepTime.current;
    
    // Only count a step if acceleration exceeds threshold and enough time has passed
    if (magnitude > stepThreshold && timeSinceLastStep > 300) { // 300ms minimum between steps
      setSteps(prev => {
        const newSteps = prev + 1;
        setCalories(newSteps * caloriesPerStep);
        setDistance(newSteps * stepDistance);
        lastStepTime.current = currentTime;
        return newSteps;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] mb-2">Step Counter</h1>
            <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">Track Your Walking Journey</p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="text-center mb-10">
              <div
                className={`text-7xl sm:text-8xl font-black text-indigo-600 mb-4 ${isCounting ? 'animate-pulse' : ''}`}
              >
                {steps}
              </div>
              <p className="text-gray-500 font-medium">Steps</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-indigo-600">{distance.toFixed(2)}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Distance (m)</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-purple-600">{calories.toFixed(2)}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Calories</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-center bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm font-bold text-gray-700">{status}</p>
              </div>
              
              {!isCounting && steps > 0 && (
                <div className="text-center bg-green-50 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-bold text-green-700">Great job! You walked {steps} steps.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {!isCounting ? (
                <button
                  onClick={requestPermission}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Start Counting Steps
                </button>
              ) : (
                <button
                  onClick={stopCounting}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  Pause Counting
                </button>
              )}

              <button
                onClick={resetCounter}
                className="w-full bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Reset Counter
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <h3 className="font-black text-gray-700 mb-3">How It Works</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span>Your device's motion sensors detect walking movements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span>Each detected step increases your step count</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span>Distance and calories are estimated based on your steps</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}