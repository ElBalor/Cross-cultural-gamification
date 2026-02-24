'use client';

import { useState, useEffect, useRef } from 'react';

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [status, setStatus] = useState('Ready to count steps');
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [deviceType, setDeviceType] = useState<'iOS' | 'Android' | 'Desktop' | 'Unknown'>('Unknown');
  const [debugInfo, setDebugInfo] = useState('');
  const [error, setError] = useState('');
  const [accuracyMode, setAccuracyMode] = useState<'strict' | 'normal'>('strict');
  
  // STRICT step detection parameters (harder to trigger false steps)
  const stepThreshold = 10.5; // Higher threshold (was 9.0)
  const minAcceleration = 9.0; // Narrower range (was 8.0)
  const maxAcceleration = 13.0; // Narrower range (was 15.0)
  const minTimeBetweenSteps = 400; // Longer debounce (was 300ms) - max ~150 steps/min
  const requiredPeakCount = 3; // Require 3 consecutive peaks before counting
  const stepDistance = 0.762;
  const caloriesPerStep = 0.04;
  
  const lastStepTime = useRef<number>(0);
  const sensorSupported = useRef<boolean>(false);
  const debugCount = useRef<number>(0);
  const accelerationHistory = useRef<number[]>([]);
  const peakCount = useRef<number>(0);
  const stepTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastValidStepMagnitude = useRef<number>(0);

  // Detect device type
  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent;
      
      if (/iPad|iPhone|iPod/.test(ua)) {
        setDeviceType('iOS');
        logDebug('📱 Device: iOS');
      } else if (/Android/.test(ua)) {
        setDeviceType('Android');
        logDebug('🤖 Device: Android');
      } else if (/Mobile/.test(ua)) {
        setDeviceType('Android');
        logDebug('📱 Device: Mobile');
      } else {
        setDeviceType('Desktop');
        logDebug('💻 Device: Desktop (limited support)');
      }
    };

    detectDevice();
  }, []);

  // Check sensor support
  useEffect(() => {
    const checkSensorSupport = () => {
      logDebug('🔍 Checking sensors...');
      
      if (typeof DeviceMotionEvent !== 'undefined') {
        sensorSupported.current = true;
        logDebug('✓ Sensors supported');
        
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          logDebug('ℹ️ iOS 13+ - permission required');
        } else {
          logDebug('✓ No permission needed');
          setPermissionGranted(true);
        }
      } else {
        sensorSupported.current = false;
        logDebug('✗ Sensors NOT supported');
        setError('Device does not support motion sensors');
        setStatus('Not supported');
      }
    };

    checkSensorSupport();
    
    return () => {
      if (stepTimeout.current) clearTimeout(stepTimeout.current);
    };
  }, []);

  const logDebug = (message: string) => {
    setDebugInfo(prev => {
      const lines = prev.split('\n').filter(l => l.trim());
      return [...lines.slice(-5), message].join('\n');
    });
  };

  const requestPermission = async () => {
    setError('');
    logDebug('📱 Requesting permission...');
    setStatus('Requesting permission...');
    
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        logDebug(`📱 Permission: ${permissionState}`);
        
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          startCounting();
        } else {
          setError('Permission denied. Settings → Safari → Motion & Orientation → Enable');
          setStatus('Permission denied');
        }
      } catch (error: any) {
        logDebug(`✗ Error: ${error.message}`);
        if (deviceType === 'iOS') {
          setError('iOS: Settings → Safari → Motion & Orientation → Enable');
        }
        setStatus('Error');
      }
    } else {
      setPermissionGranted(true);
      startCounting();
    }
  };

  const startCounting = () => {
    if (!sensorSupported.current) {
      setError('Motion sensors not supported');
      setStatus('Not supported');
      return;
    }

    setError('');
    setIsCounting(true);
    setStatus('🚶 Walking... Phone must move rhythmically!');
    logDebug('✓ Counting started (STRICT mode)');
    logDebug(`📊 Threshold: ${stepThreshold} m/s²`);
    
    window.addEventListener('devicemotion', handleMotion);
  };

  const stopCounting = () => {
    setIsCounting(false);
    setStatus('⏸ Paused');
    window.removeEventListener('devicemotion', handleMotion);
    logDebug('⏸ Stopped');
    
    if (stepTimeout.current) clearTimeout(stepTimeout.current);
  };

  const resetCounter = () => {
    setSteps(0);
    setCalories(0);
    setDistance(0);
    setError('');
    setDebugInfo('');
    setStatus('Reset. Ready to count steps');
    accelerationHistory.current = [];
    peakCount.current = 0;
    lastValidStepMagnitude.current = 0;
  };

  // STRICT step detection - requires rhythmic walking pattern
  const handleMotion = (event: DeviceMotionEvent) => {
    if (!isCounting) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const accX = acceleration.x || 0;
    const accY = acceleration.y || 0;
    const accZ = acceleration.z || 0;
    
    const magnitude = Math.sqrt(accX * accX + accY * accY + accZ * accZ);
    
    // Store history
    accelerationHistory.current.push(magnitude);
    if (accelerationHistory.current.length > 20) {
      accelerationHistory.current.shift();
    }
    
    // Debug every 20 readings
    debugCount.current++;
    if (debugCount.current % 20 === 0) {
      logDebug(`📊 ${magnitude.toFixed(2)} m/s²`);
    }
    
    const currentTime = Date.now();
    const timeSinceLastStep = currentTime - lastStepTime.current;
    
    if (timeSinceLastStep < minTimeBetweenSteps) {
      return;
    }
    
    // STRICT detection:
    // 1. Must be in narrow walking range (9-13 m/s²)
    const isWalkingRange = magnitude >= minAcceleration && magnitude <= maxAcceleration;
    
    // 2. Must be above threshold
    const isAboveThreshold = magnitude > stepThreshold;
    
    // 3. Check for consistent rhythmic pattern (last 3 peaks similar magnitude)
    const recentMagnitudes = accelerationHistory.current.slice(-10);
    const recentPeaks = recentMagnitudes.filter(m => m > stepThreshold);
    const hasRhythmicPattern = recentPeaks.length >= requiredPeakCount;
    
    // 4. Check magnitude consistency (walking creates consistent peaks)
    if (recentPeaks.length >= 2) {
      const avgMagnitude = recentPeaks.reduce((a, b) => a + b, 0) / recentPeaks.length;
      const magnitudeVariance = recentPeaks.reduce((sum, m) => sum + Math.pow(m - avgMagnitude, 2), 0) / recentPeaks.length;
      const isConsistent = magnitudeVariance < 2.0; // Low variance = consistent walking
      
      // 5. Current magnitude should be similar to recent average
      const isSimilarToRecent = Math.abs(magnitude - avgMagnitude) < 1.5;
      
      if (isWalkingRange && isAboveThreshold && hasRhythmicPattern && isConsistent && isSimilarToRecent) {
        // Additional check: magnitude should be similar to last valid step
        if (lastValidStepMagnitude.current > 0) {
          const diffFromLast = Math.abs(magnitude - lastValidStepMagnitude.current);
          if (diffFromLast > 2.0) {
            // Too different from last step - probably random movement
            return;
          }
        }
        
        logDebug(`✓ STEP! ${magnitude.toFixed(2)}`);
        
        setSteps(prev => {
          const newSteps = prev + 1;
          setCalories(newSteps * caloriesPerStep);
          setDistance(newSteps * stepDistance);
          lastStepTime.current = currentTime;
          lastValidStepMagnitude.current = magnitude;
          return newSteps;
        });
        
        peakCount.current = 0;
        
        if (stepTimeout.current) clearTimeout(stepTimeout.current);
        stepTimeout.current = setTimeout(() => {
          peakCount.current = 0;
        }, minTimeBetweenSteps);
      }
    }
    
    // Track peaks for rhythmic pattern detection
    if (isAboveThreshold) {
      peakCount.current++;
    } else if (magnitude < stepThreshold - 1) {
      peakCount.current = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] mb-2">Step Counter</h1>
            <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">STRICT Mode - Reduced False Steps</p>
          </div>

          <div className="p-6 sm:p-10">
            {/* Accuracy Mode Info */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
              <p className="text-sm font-bold text-blue-800 mb-1">🛡️ STRICT Mode Active</p>
              <p className="text-xs text-blue-700">
                Requires rhythmic walking pattern. Random phone movements won't count as steps. 
                Walk normally with phone in hand for best results!
              </p>
            </div>

            {/* Device Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Device</span>
                <span className={`text-sm font-black px-2 py-1 rounded-lg ${
                  deviceType === 'iOS' ? 'bg-blue-100 text-blue-700' :
                  deviceType === 'Android' ? 'bg-green-100 text-green-700' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {deviceType === 'iOS' ? '📱 iPhone/iPad' : 
                   deviceType === 'Android' ? '🤖 Android' : 
                   '💻 Desktop'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sensors</span>
                <span className={`text-sm font-black ${sensorSupported.current ? 'text-green-600' : 'text-red-600'}`}>
                  {sensorSupported.current ? '✓ Supported' : '✗ Not Supported'}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-sm font-bold text-red-800">⚠️ {error}</p>
              </div>
            )}

            {/* Instructions */}
            {!permissionGranted && deviceType === 'iOS' && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                <p className="text-sm font-bold text-blue-800 mb-2">📱 iOS:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Click "Grant Permission & Start"</li>
                  <li>Tap "Allow" on popup</li>
                  <li>If denied: Settings → Safari → Motion & Orientation → Enable</li>
                </ol>
              </div>
            )}

            {/* Step Display */}
            <div className="text-center mb-10">
              <div className={`text-7xl sm:text-8xl font-black text-indigo-600 mb-4 transition-all ${isCounting ? 'animate-pulse scale-105' : ''}`}>
                {steps}
              </div>
              <p className="text-gray-500 font-medium">Steps</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-indigo-50 rounded-2xl p-4 text-center border border-indigo-100">
                <p className="text-2xl font-black text-indigo-600">{distance.toFixed(2)}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Distance (m)</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
                <p className="text-2xl font-black text-purple-600">{calories.toFixed(2)}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Calories</p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-8">
              <div className={`text-center rounded-2xl p-4 mb-4 font-bold text-sm ${
                isCounting ? 'bg-green-50 text-green-700 animate-pulse' :
                error ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
              }`}>
                {status}
              </div>
              
              {debugInfo && (
                <div className="text-center bg-black/5 rounded-xl p-3 mb-4 border border-black/10">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                    {debugInfo}
                  </pre>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 mb-8">
              {!isCounting ? (
                <button
                  onClick={requestPermission}
                  disabled={!sensorSupported.current && deviceType !== 'Desktop'}
                  className={`w-full px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${
                    !sensorSupported.current && deviceType !== 'Desktop'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {permissionGranted ? '🚶 Start Walking' : '📱 Grant Permission & Start'}
                </button>
              ) : (
                <button
                  onClick={stopCounting}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  ⏸ Pause
                </button>
              )}

              <button
                onClick={resetCounter}
                className="w-full bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                🔄 Reset
              </button>
            </div>

            {/* Important Notes */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-black text-gray-700 mb-3 text-sm">⚠️ Requirements</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span><strong>Smartphone/tablet</strong> with accelerometer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span><strong>HTTPS</strong> (or localhost)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span><strong>iOS:</strong> Settings → Safari → Motion & Orientation → Enable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span><strong>Walk normally</strong> with phone in hand (not shaking!)</span>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h3 className="font-black text-indigo-700 mb-2 text-xs uppercase tracking-widest">🔧 How STRICT Mode Works</h3>
              <p className="text-xs text-indigo-600 leading-relaxed">
                Requires <strong>rhythmic walking pattern</strong> with consistent acceleration peaks. 
                Random movements (shaking, tapping, waving) won't count because they don't create 
                the consistent pattern that walking does. Walk at normal pace for 10-20 seconds 
                to start counting steps!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
