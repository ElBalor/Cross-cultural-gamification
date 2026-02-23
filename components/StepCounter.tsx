'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [deviceType, setDeviceType] = useState<'iOS' | 'Android' | 'Unknown'>('Unknown');
  
  // Optimized parameters for all devices
  const stepThreshold = 9.0;
  const minAcceleration = 8.0;
  const maxAcceleration = 15.0;
  const minTimeBetweenSteps = 300;
  const stepDistance = 0.762;
  const caloriesPerStep = 0.04;
  
  const lastStepTime = useRef<number>(0);
  const mounted = useRef(true);
  const sessionId = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const startTime = useRef<number>(Date.now());
  const debugCount = useRef<number>(0);
  const accelerationHistory = useRef<number[]>([]);
  const peakDetected = useRef<boolean>(false);
  const stepTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detect device type
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) {
      setDeviceType('iOS');
    } else if (/Android/.test(ua)) {
      setDeviceType('Android');
    } else {
      setDeviceType('Unknown');
    }
  }, []);

  // Check if device supports motion sensors
  useEffect(() => {
    const checkSensorSupport = () => {
      console.log('StepCounter: Checking sensor support...');
      
      if (typeof DeviceMotionEvent !== 'undefined') {
        setIsSupported(true);
        console.log('StepCounter: Motion sensors supported');
        
        // Check if iOS 13+ (permission required)
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          console.log('StepCounter: iOS 13+ detected - permission will be required');
        } else {
          console.log('StepCounter: Android or older iOS - no permission needed');
        }
      } else {
        setIsSupported(false);
        console.log('StepCounter: Motion sensors NOT supported');
      }
    };

    checkSensorSupport();
  }, []);

  // Log session start
  useEffect(() => {
    if (isActive) {
      console.log('StepCounter: Activity started');
    }
    
    return () => {
      if (mounted.current && stepTimeout.current) {
        clearTimeout(stepTimeout.current);
      }
    };
  }, [isActive]);

  // Handle motion events
  useEffect(() => {
    if (!isActive || !isSupported) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (!mounted.current) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      // Calculate the magnitude of acceleration
      const accX = acceleration.x || 0;
      const accY = acceleration.y || 0;
      const accZ = acceleration.z || 0;
      
      const magnitude = Math.sqrt(accX * accX + accY * accY + accZ * accZ);
      
      // Store history for peak detection
      accelerationHistory.current.push(magnitude);
      if (accelerationHistory.current.length > 10) {
        accelerationHistory.current.shift();
      }
      
      // Debug logging every 20 readings
      debugCount.current++;
      if (debugCount.current % 20 === 0) {
        console.log(`StepCounter: Accel ${magnitude.toFixed(2)} m/s²`);
      }
      
      // Check if enough time passed since last step
      const currentTime = Date.now();
      const timeSinceLastStep = currentTime - lastStepTime.current;
      
      if (timeSinceLastStep < minTimeBetweenSteps) {
        return;
      }
      
      // Step detection logic
      const isWalkingRange = magnitude >= minAcceleration && magnitude <= maxAcceleration;
      const isAboveThreshold = magnitude > stepThreshold;
      
      // Check for peak in recent history
      const recentMax = Math.max(...accelerationHistory.current);
      const recentMin = Math.min(...accelerationHistory.current);
      const hasPeakVariation = (recentMax - recentMin) > 1.5;
      
      // Count step if conditions met
      if (isWalkingRange && isAboveThreshold && hasPeakVariation) {
        if (!peakDetected.current) {
          peakDetected.current = true;
          console.log(`StepCounter: STEP! ${magnitude.toFixed(2)} m/s²`);
          
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
          
          // Reset peak detection after delay
          if (stepTimeout.current) clearTimeout(stepTimeout.current);
          stepTimeout.current = setTimeout(() => {
            peakDetected.current = false;
          }, minTimeBetweenSteps);
        }
      } else {
        // Reset peak if magnitude returns to normal
        if (magnitude < stepThreshold - 1) {
          peakDetected.current = false;
        }
      }
    };

    // Request permission for iOS devices
    const setupMotionListener = async () => {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          console.log('StepCounter: Requesting iOS permission...');
          const permissionState = await (DeviceMotionEvent as any).requestPermission();
          console.log('StepCounter: Permission result:', permissionState);
          
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          } else {
            console.error('StepCounter: Permission denied');
            setIsSupported(false);
          }
        } catch (error) {
          console.error('StepCounter: Permission error:', error);
          setIsSupported(false);
        }
      } else {
        // Non-iOS or older iOS
        window.addEventListener('devicemotion', handleMotion);
      }
    };

    setupMotionListener();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      if (stepTimeout.current) {
        clearTimeout(stepTimeout.current);
      }
    };
  }, [isActive, isSupported, onStepUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (stepTimeout.current) {
        clearTimeout(stepTimeout.current);
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-700 font-bold text-sm">📱 Motion sensors not supported on this device</p>
        <p className="text-red-600 text-xs mt-1">Please use a smartphone or tablet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-black text-gray-800 text-lg">Step Counter</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {deviceType === 'iOS' ? '📱 iOS Device' : deviceType === 'Android' ? '🤖 Android Device' : '📱 Mobile Device'}
          </p>
        </div>
        {isActive && (
          <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Active
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-3xl font-black text-indigo-600">{steps}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Steps</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-purple-600">{distance.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Meters</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-green-600">{calories.toFixed(1)}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Calories</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          💡 Tip: Hold phone in hand or keep in pocket while walking
        </p>
      </div>
    </div>
  );
}
