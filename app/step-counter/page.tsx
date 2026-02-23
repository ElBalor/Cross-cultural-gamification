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
  
  // Step detection parameters - tuned for all devices
  const stepThreshold = 9.0; // Base threshold (m/s²)
  const minAcceleration = 8.0; // Minimum for walking
  const maxAcceleration = 15.0; // Maximum for walking
  const minTimeBetweenSteps = 300; // ms (max ~200 steps/min)
  const stepDistance = 0.762; // meters per step
  const caloriesPerStep = 0.04; // calories per step
  
  const lastStepTime = useRef<number>(0);
  const sensorSupported = useRef<boolean>(false);
  const debugCount = useRef<number>(0);
  const accelerationHistory = useRef<number[]>([]);
  const peakDetected = useRef<boolean>(false);
  const stepTimeout = useRef<NodeJS.Timeout | null>(null);

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
        setDeviceType('Android'); // Other mobile devices
        logDebug('📱 Device: Mobile');
      } else {
        setDeviceType('Desktop');
        logDebug('💻 Device: Desktop (limited support)');
      }
    };

    detectDevice();
  }, []);

  // Check sensor support on mount
  useEffect(() => {
    const checkSensorSupport = () => {
      logDebug('🔍 Checking sensor support...');
      
      if (typeof DeviceMotionEvent !== 'undefined') {
        sensorSupported.current = true;
        logDebug('✓ Motion sensors supported');
        
        // Check permission requirements
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          logDebug('ℹ️ iOS 13+ - permission required');
          // Don't auto-request, wait for user gesture
        } else {
          logDebug('✓ No permission required');
          setPermissionGranted(true);
        }
      } else {
        sensorSupported.current = false;
        logDebug('✗ Motion sensors NOT supported');
        setError('Your device does not support motion sensors. Please use a smartphone or tablet.');
        setStatus('Device not supported');
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
      return [...lines.slice(-6), message].join('\n');
    });
  };

  // Request permission (iOS 13+)
  const requestPermission = async () => {
    setError('');
    logDebug('📱 Requesting permission...');
    setStatus('Requesting permission...');
    
    // Check if permission API exists
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        logDebug(`📱 Permission: ${permissionState}`);
        
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          startCounting();
        } else {
          setError('Permission denied. Please enable in: Settings → Safari → Motion & Orientation');
          setStatus('Permission denied');
          logDebug('✗ Permission denied by user');
        }
      } catch (error: any) {
        logDebug(`✗ Error: ${error.message}`);
        
        // iOS-specific error handling
        if (deviceType === 'iOS') {
          setError('iOS requires permission. Go to: Settings → Safari → Motion & Orientation → Enable');
        } else {
          setError('Permission error: ' + error.message);
        }
        setStatus('Error requesting permission');
      }
    } else {
      // Non-iOS or older iOS - no permission needed
      setPermissionGranted(true);
      startCounting();
    }
  };

  const startCounting = () => {
    if (!sensorSupported.current) {
      setError('Motion sensors not supported on this device');
      setStatus('Not supported');
      return;
    }

    setError('');
    setIsCounting(true);
    setStatus('🚶 Walking... Keep moving!');
    logDebug('✓ Step counting started');
    logDebug(`📊 Threshold: ${stepThreshold} m/s²`);
    
    // Add motion listener
    window.addEventListener('devicemotion', handleMotion);
  };

  const stopCounting = () => {
    setIsCounting(false);
    setStatus('⏸ Paused');
    window.removeEventListener('devicemotion', handleMotion);
    logDebug('⏸ Stopped counting');
    
    if (stepTimeout.current) {
      clearTimeout(stepTimeout.current);
      stepTimeout.current = null;
    }
  };

  const resetCounter = () => {
    setSteps(0);
    setCalories(0);
    setDistance(0);
    setError('');
    setDebugInfo('');
    setStatus('Counter reset. Ready to count steps');
    accelerationHistory.current = [];
    peakDetected.current = false;
  };

  // Improved step detection algorithm
  const handleMotion = (event: DeviceMotionEvent) => {
    if (!isCounting) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) {
      logDebug('✗ No acceleration data');
      return;
    }

    // Get acceleration values
    const accX = acceleration.x || 0;
    const accY = acceleration.y || 0;
    const accZ = acceleration.z || 0;
    
    // Calculate magnitude
    const magnitude = Math.sqrt(accX * accX + accY * accY + accZ * accZ);
    
    // Store history for peak detection
    accelerationHistory.current.push(magnitude);
    if (accelerationHistory.current.length > 10) {
      accelerationHistory.current.shift();
    }
    
    // Debug logging every 15 readings
    debugCount.current++;
    if (debugCount.current % 15 === 0) {
      logDebug(`📊 Accel: ${magnitude.toFixed(2)} m/s²`);
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
      // Debounce to prevent double counting
      if (!peakDetected.current) {
        peakDetected.current = true;
        
        logDebug(`✓ STEP! ${magnitude.toFixed(2)} m/s²`);
        
        setSteps(prev => {
          const newSteps = prev + 1;
          setCalories(newSteps * caloriesPerStep);
          setDistance(newSteps * stepDistance);
          return newSteps;
        });
        
        lastStepTime.current = currentTime;
        
        // Reset peak detection after short delay
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] mb-2">Step Counter</h1>
            <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">Universal - Works on All Devices</p>
          </div>

          <div className="p-6 sm:p-10">
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
                   '💻 Desktop/Laptop'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sensors</span>
                <span className={`text-sm font-black ${sensorSupported.current ? 'text-green-600' : 'text-red-600'}`}>
                  {sensorSupported.current ? '✓ Supported' : '✗ Not Supported'}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-sm font-bold text-red-800">⚠️ {error}</p>
              </div>
            )}

            {/* iOS/Android Instructions */}
            {!permissionGranted && deviceType === 'iOS' && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                <p className="text-sm font-bold text-blue-800 mb-2">📱 iOS Users:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Click "Grant Permission & Start" below</li>
                  <li>Tap "Allow" when the popup appears</li>
                  <li>If denied: Settings → Safari → Motion & Orientation → Enable</li>
                </ol>
              </div>
            )}

            {!permissionGranted && deviceType === 'Android' && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
                <p className="text-sm font-bold text-green-800 mb-2">🤖 Android Users:</p>
                <ol className="text-xs text-green-700 space-y-1 list-decimal list-inside">
                  <li>Click "Start Counting" below</li>
                  <li>If prompted, allow motion/physical activity permission</li>
                  <li>Start walking with your phone</li>
                </ol>
              </div>
            )}

            {deviceType === 'Desktop' && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
                <p className="text-sm font-bold text-yellow-800 mb-2">💻 Desktop Users:</p>
                <p className="text-xs text-yellow-700">
                  Most computers don't have motion sensors. For best results, use a smartphone or tablet.
                </p>
              </div>
            )}

            {/* Step Display */}
            <div className="text-center mb-10">
              <div
                className={`text-7xl sm:text-8xl font-black text-indigo-600 mb-4 transition-all ${
                  isCounting ? 'animate-pulse scale-105' : ''
                }`}
              >
                {steps}
              </div>
              <p className="text-gray-500 font-medium">Steps</p>
            </div>

            {/* Stats Grid */}
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
              <div className={`text-center rounded-2xl p-4 mb-4 font-bold text-sm transition-all ${
                isCounting ? 'bg-green-50 text-green-700 animate-pulse' :
                error ? 'bg-red-50 text-red-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                {status}
              </div>
              
              {/* Debug Info */}
              {debugInfo && (
                <div className="text-center bg-black/5 rounded-xl p-3 mb-4 border border-black/10">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                    {debugInfo}
                  </pre>
                </div>
              )}
            </div>

            {/* Control Buttons */}
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
                  {permissionGranted ? '🚶 Start Counting' : '📱 Grant Permission & Start'}
                </button>
              ) : (
                <button
                  onClick={stopCounting}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  ⏸ Pause Counting
                </button>
              )}

              <button
                onClick={resetCounter}
                className="w-full bg-gray-100 text-gray-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                🔄 Reset Counter
              </button>
            </div>

            {/* Requirements */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-black text-gray-700 mb-3 text-sm">⚠️ Requirements</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span><strong>Smartphone or tablet</strong> with accelerometer (iPhone, Android, iPad)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span><strong>HTTPS connection</strong> (or localhost for testing)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span><strong>iOS users:</strong> Must grant motion sensor permission in Settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-black mr-2">•</span>
                  <span>Hold phone in hand or keep in pocket while walking normally</span>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h3 className="font-black text-indigo-700 mb-2 text-xs uppercase tracking-widest">🔧 How It Works</h3>
              <p className="text-xs text-indigo-600 leading-relaxed">
                The step counter uses your device's accelerometer to detect walking motion. 
                When you walk, your phone creates acceleration patterns between 8-15 m/s². 
                Our algorithm detects these peaks and counts them as steps. Walk normally for best results!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
