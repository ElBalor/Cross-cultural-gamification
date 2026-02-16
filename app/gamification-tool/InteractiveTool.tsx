'use client';

import { useState } from 'react';
import { ToolConfig } from '@/lib/analysis';
import StepCounterComponent from '@/components/StepCounter';

interface InteractiveToolProps {
  config: ToolConfig;
  mode: string;
}

export default function InteractiveTool({ config, mode }: InteractiveToolProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stepCounterActive, setStepCounterActive] = useState(false);
  
  const handleStepUpdate = (steps: number, distance: number, calories: number) => {
    // This could be used to update gamification elements based on steps
    console.log(`Steps: ${steps}, Distance: ${distance}m, Calories: ${calories}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 sm:p-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] mb-2">Cross-Cultural Tool</h1>
            <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">{mode}</p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 mb-8">
              {['dashboard', 'steps', 'leaderboard', 'rewards'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 font-black text-sm capitalize ${
                    activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-indigo-50 rounded-2xl p-6 text-center">
                      <h3 className="font-black text-indigo-700 mb-2">Activity Level</h3>
                      <p className="text-3xl font-black text-indigo-600">
                        {config.primaryFocus}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6 text-center">
                      <h3 className="font-black text-purple-700 mb-2">Theme</h3>
                      <p className="text-3xl font-black text-purple-600 capitalize">
                        {config.theme.replace('-', ' ')}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6 text-center">
                      <h3 className="font-black text-green-700 mb-2">Participants</h3>
                      <p className="text-3xl font-black text-green-600">
                        {config.totalParticipants}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-black text-gray-800 mb-4">Cultural Elements</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Leaderboard Name</p>
                        <p className="font-bold text-gray-800">{config.culturalContext.leaderboardName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Reward Name</p>
                        <p className="font-bold text-gray-800">{config.culturalContext.rewardName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Music Genre</p>
                        <p className="font-bold text-gray-800">{config.culturalContext.musicGenre}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Location Signal</p>
                        <p className="font-bold text-gray-800">{config.culturalContext.locationSignal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'steps' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-800">Step Tracking</h2>
                    <button
                      onClick={() => setStepCounterActive(!stepCounterActive)}
                      className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm ${
                        stepCounterActive
                          ? 'bg-red-500 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {stepCounterActive ? 'Stop' : 'Start'} Tracking
                    </button>
                  </div>
                  
                  <StepCounterComponent 
                    isActive={stepCounterActive} 
                    onStepUpdate={handleStepUpdate} 
                  />
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <h3 className="font-black text-yellow-800 mb-2">Tip</h3>
                    <p className="text-yellow-700">
                      Keep your phone in your pocket or bag while walking for accurate step counting. 
                      The app uses your device's motion sensors to detect steps.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-800">Leaderboard</h2>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
                      {config.culturalContext.leaderboardName}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {config.showLeaderboard ? (
                      <>
                        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black mr-3">1</div>
                            <div>
                              <p className="font-bold text-gray-800">You</p>
                              <p className="text-xs text-gray-500">Local Champion</p>
                            </div>
                          </div>
                          <p className="font-black text-indigo-600">12,450 steps</p>
                        </div>
                        
                        {[2, 3, 4, 5].map((rank) => (
                          <div key={rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-black mr-3">{rank}</div>
                              <div>
                                <p className="font-bold text-gray-800">User {rank}</p>
                                <p className="text-xs text-gray-500">Local Runner</p>
                              </div>
                            </div>
                            <p className="font-black text-gray-600">{10000 - rank * 1000} steps</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500 font-medium">Leaderboard is not enabled in your personalized protocol</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-gray-800">Rewards</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest">
                      {config.culturalContext.rewardName}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.showRewards ? (
                      <>
                        <div className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
                          <div className="text-yellow-500 text-3xl mb-3">🏆</div>
                          <h3 className="font-black text-gray-800 mb-1">Daily Streak</h3>
                          <p className="text-sm text-gray-600">Keep walking for 7 days straight</p>
                          <div className="mt-3 w-full bg-yellow-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        
                        <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                          <div className="text-blue-500 text-3xl mb-3">🏅</div>
                          <h3 className="font-black text-gray-800 mb-1">10k Steps</h3>
                          <p className="text-sm text-gray-600">Reach 10,000 steps in a day</p>
                          <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                        </div>
                        
                        <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                          <div className="text-green-500 text-3xl mb-3">🎯</div>
                          <h3 className="font-black text-gray-800 mb-1">Weekly Goal</h3>
                          <p className="text-sm text-gray-600">Walk 50,000 steps this week</p>
                          <div className="mt-3 w-full bg-green-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                        
                        <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                          <div className="text-purple-500 text-3xl mb-3">🌟</div>
                          <h3 className="font-black text-gray-800 mb-1">Explorer Badge</h3>
                          <p className="text-sm text-gray-600">Visit 10 new locations</p>
                          <div className="mt-3 w-full bg-purple-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 text-center py-10 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500 font-medium">Rewards are not enabled in your personalized protocol</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}