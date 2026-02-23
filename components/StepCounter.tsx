'use client';

import { useState, useEffect, useRef } from 'react';
import { saveStepActivityAction, logSessionEvent } from '@/app/actions';

interface StepCounterProps {
  onStepUpdate?: (steps: number, distance: number, calories: number) => void;
  isActive?: boolean;
  surveyResponseId?: number;
}

export default function StepCounterComponent({ onStepUpdate, isActive = false, surveyResponseId }: StepCounterProps) {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [lastSaved, setLastSaved] = useState<number>(0);
  
  const stepDistance = 0.762; // Average step distance in meters (2.5 ft)
  const caloriesPerStep = 0.04; // Approximate calories burned per step
  const stepThreshold = 8; // Acceleration threshold to detect a step (lowered from 15 for better sensitivity)
  const minAcceleration = 9.5; // Minimum m/s² to consider as movement
  const maxAcceleration = 12.0; // Maximum m/s² for step detection
  
  const lastStepTime = useRef<number>(0);
  const mounted = useRef(true);
  const sessionId = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const startTime = useRef<number>(Date.now());

  // Check if device supports motion sensors
  useEffect(() => {
    const checkSensorSupport = () => {
      console.log('Checking sensor support...');
      if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        // iOS 13+ devices require permission
        console.log('iOS device detected - permission required');
        setIsSupported(true);
      } else if ('ondevicemotion' in window) {
        // Non-iOS devices
        console.log('Android/Other device detected');
        setIsSupported(true);
      } else {
        console.log('Device does not support motion sensors');
        setIsSupported(false);
      }
    };

    checkSensorSupport();
  }, []);

  // Log session start
  useEffect(() => {
    if (isActive) {
      logSessionEvent({
        surveyResponseId,
        sessionId: sessionId.current,
        pagePath: '/step-counter',
        eventType: 'step_counter_start',
        eventData: { device: typeof navigator !== 'undefined' ? navigator.platform : 'unknown' }
      });
    }
    
    return () => {
      if (mounted.current) {
        logSessionEvent({
          surveyResponseId,
          sessionId: sessionId.current,
          pagePath: '/step-counter',
          eventType: 'step_counter_end',
          duration: Date.now() - startTime.current
        });
      }
    };
  }, [isActive, surveyResponseId]);

  // Handle motion events
  useEffect(() => {
    if (!isActive || !isSupported) return;

    let stepCandidateCount = 0;
    let lastPeakTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!mounted.current) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      // Calculate the magnitude of acceleration
      const accX = acceleration.x || 0;
      const accY = acceleration.y || 0;
      const accZ = acceleration.z || 0;
      
      const magnitude = Math.sqrt(accX * accX + accY * accY + accZ * accZ);
      
      // Debug logging (remove in production)
      // console.log(`Acceleration: X=${accX.toFixed(2)}, Y=${accY.toFixed(2)}, Z=${accZ.toFixed(2)}, Magnitude=${magnitude.toFixed(2)}`);
      
      // Detect step based on acceleration magnitude and timing
      const currentTime = Date.now();
      const timeSinceLastStep = currentTime - lastStepTime.current;
      
      // Better step detection: check if magnitude is in walking range
      // Gravity is ~9.8 m/s², walking creates peaks between 9.5-12 m/s²
      const isWalkingRange = magnitude >= minAcceleration && magnitude <= maxAcceleration;
      const isPeakDetected = magnitude > stepThreshold;
      
      // Only count a step if:
      // 1. In walking acceleration range
      // 2. Enough time passed since last step (350ms = ~170 steps/min max)
      // 3. Detecting a peak in the acceleration pattern
      if (isWalkingRange && isPeakDetected && timeSinceLastStep > 350) {
        console.log(`Step detected! Magnitude: ${magnitude.toFixed(2)}, Time since last: ${timeSinceLastStep}ms`);
        setSteps(prev => {
          const newSteps = prev + 1;
          const newDistance = newSteps * stepDistance;
          const newCalories = newSteps * caloriesPerStep;
          
          setDistance(newDistance);
          setCalories(newCalories);
          
          if (onStepUpdate) {
            onStepUpdate(newSteps, newDistance, newCalories);
          }
          
          lastStepTime.current = currentTime;
          return newSteps;
        });
      }
    };

    // Request permission for iOS devices
    const setupMotionListener = async () => {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const permissionState = await (DeviceMotionEvent as any).requestPermission();
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        } catch (error) {
          console.error('Error requesting motion permission:', error);
          setIsSupported(false);
        }
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
    };

    setupMotionListener();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isActive, isSupported, onStepUpdate]);

  // Save step activity periodically (every 30 seconds)
  useEffect(() => {
    if (!isActive || steps === 0) return;
    
    const saveInterval = setInterval(async () => {
      const now = Date.now();
      if (now - lastSaved > 30000) { // Save every 30 seconds
        await saveStepActivityAction({
          surveyResponseId,
          sessionId: sessionId.current,
          steps,
          distance,
          calories,
          duration: Math.floor((now - startTime.current) / 1000),
          metadata: {
            timestamp: new Date().toISOString(),
            device: typeof navigator !== 'undefined' ? navigator.platform : 'unknown'
          }
        });
        setLastSaved(now);
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(saveInterval);
  }, [isActive, steps, distance, calories, surveyResponseId, lastSaved]);

  // Save on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (steps > 0) {
        saveStepActivityAction({
          surveyResponseId,
          sessionId: sessionId.current,
          steps,
          distance,
          calories,
          duration: Math.floor((Date.now() - startTime.current) / 1000),
          metadata: {
            timestamp: new Date().toISOString(),
            device: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
            final: true
          }
        });
      }
    };
  }, [steps, distance, calories, surveyResponseId]);

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-700 font-medium">Step counting is not supported on this device</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-gray-800 text-lg">Step Counter</h3>
        {isActive && (
          <span className="flex items-center text-xs font-bold text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Active
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-3xl font-black text-indigo-600">{steps}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Steps</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-purple-600">{distance.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Meters</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-green-600">{calories.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Calories</p>
        </div>
      </div>
      
      {lastSaved > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-green-600 font-bold">✓ Data synced to research database</p>
        </div>
      )}
    </div>
  );
}