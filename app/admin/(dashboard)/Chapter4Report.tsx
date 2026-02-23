'use client';

import { useState, useEffect } from 'react';
import {
  analyzeReliability,
  analyzeDetailedFeatures,
  analyzeEngagement,
  analyzeCulturalPatterns,
  analyzeSentiment,
  analyzeFeatureImportance
} from '@/lib/analysis';

interface ReportData {
  reliability: any;
  features: any;
  engagement: any;
  cultural: any;
  sentiment: any;
}

export default function Chapter4Report() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('csv');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [reliability, features, engagement, cultural, sentiment] = await Promise.all([
        analyzeReliability(),
        analyzeDetailedFeatures(),
        analyzeEngagement(),
        analyzeCulturalPatterns(),
        analyzeSentiment()
      ]);

      setReportData({ reliability, features, engagement, cultural, sentiment });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    const format = exportFormat;
    window.open(`/api/export?format=${format}&type=${type}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Generating Chapter 4 Report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-black uppercase tracking-[0.2em] mb-2">Chapter 4: Results & Analysis</h1>
        <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">Research Findings Dashboard</p>
      </div>

      {/* Export Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="font-black text-gray-800 mb-4">Export Data for Statistical Analysis</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Format:</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
              className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm"
            >
              <option value="csv">CSV (Excel/SPSS)</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <button
            onClick={() => handleExport('survey')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all"
          >
            Export Survey Data
          </button>
          <button
            onClick={() => handleExport('interview')}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all"
          >
            Export Interview Data
          </button>
          <button
            onClick={() => handleExport('steps')}
            className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all"
          >
            Export Step Activity
          </button>
          <button
            onClick={() => handleExport('all')}
            className="px-6 py-2 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-gray-900 transition-all"
          >
            Export All Data
          </button>
        </div>
      </div>

      {/* 4.2 Demographic Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black text-sm">4.2</span>
          Demographic Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-widest">Cultural Distribution</h3>
            {reportData?.cultural?.countries && reportData.cultural.countries.length > 0 ? (
              <div className="space-y-2">
                {reportData.cultural.countries.slice(0, 5).map((c: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{c.country}</span>
                    <span className="text-sm font-black text-indigo-600">{c.count} participants</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No data available yet</p>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-widest">Activity Distribution</h3>
            {reportData?.engagement?.activityDistribution ? (
              <div className="space-y-2">
                {Object.entries(reportData.engagement.activityDistribution).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{key}</span>
                    <span className="text-sm font-black text-purple-600">{value} participants</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No data available yet</p>
            )}
          </div>
        </div>
      </div>

      {/* 4.3 Reliability Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black text-sm">4.3</span>
          Reliability Analysis (Cronbach's Alpha)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Construct</th>
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Cronbach's α</th>
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Items</th>
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.reliability?.scales && Object.entries(reportData.reliability.scales).map(([key, scale]: [string, any]) => (
                <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="text-sm font-bold text-gray-800">{scale.description?.split('(')[0]}</div>
                    <div className="text-xs text-gray-500">{scale.description?.split('(')[1]}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-black ${
                      scale.alpha >= 0.7 ? 'text-green-600' : scale.alpha >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {scale.alpha.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-600">{scale.items}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${
                      scale.interpretation === 'Excellent' || scale.interpretation === 'Good' ? 'bg-green-100 text-green-700' :
                      scale.interpretation === 'Acceptable' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {scale.interpretation || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 font-medium">
            <strong>Note:</strong> Cronbach's Alpha measures internal consistency. Values ≥ 0.7 indicate acceptable reliability for research purposes.
          </p>
        </div>
      </div>

      {/* 4.4 Feature Importance Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black text-sm">4.4</span>
          Key Gamification Features (Objective 1)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Rank</th>
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Feature</th>
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Mean Score</th>
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Std. Deviation</th>
                <th className="text-left py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Responses</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.features?.features?.map((feature: any) => (
                <tr key={feature.key} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      feature.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      feature.rank === 2 ? 'bg-gray-100 text-gray-700' :
                      feature.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {feature.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-bold text-gray-800">{feature.label}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-black text-indigo-600">{feature.mean.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-600">{feature.sd.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-600">{feature.count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reportData?.features?.anova && (
          <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-xs text-purple-700 font-medium">
              <strong>Cultural Differences (ANOVA):</strong> F({reportData.features.anova.dfBetween}, {reportData.features.anova.dfWithin}) = {reportData.features.anova.F.toFixed(3)}, p = {reportData.features.anova.pValue.toFixed(4)}
              {reportData.features.anova.significant ? ' - Statistically significant cultural differences detected!' : ' - No significant cultural differences detected.'}
            </p>
          </div>
        )}
      </div>

      {/* 4.9 Motivation & Engagement Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black text-sm">4.9</span>
          Motivation & Engagement Analysis (Objective 4)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Average Engagement</p>
            <p className="text-4xl font-black text-indigo-600">{reportData?.engagement?.metrics?.averageEngagement?.toFixed(2) || 'N/A'}</p>
            <p className="text-xs text-indigo-500 mt-2">Scale: 1-5</p>
            <p className="text-xs font-bold text-indigo-700 mt-2">Level: {reportData?.engagement?.metrics?.engagementLevel || 'N/A'}</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2">Total Responses</p>
            <p className="text-4xl font-black text-purple-600">{reportData?.engagement?.totalResponses || 'N/A'}</p>
            <p className="text-xs text-purple-500 mt-2">Survey participants</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Adoption Likelihood</p>
            <div className="space-y-1 mt-2">
              {Object.entries(reportData?.engagement?.adoptionDistribution || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="font-medium text-gray-600">{key}</span>
                  <span className="font-black text-green-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black text-sm">4.10</span>
          Sentiment Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
            <p className="text-3xl font-black text-green-600">{reportData?.sentiment?.distribution?.positive || 0}</p>
            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mt-1">Positive</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
            <p className="text-3xl font-black text-gray-600">{reportData?.sentiment?.distribution?.neutral || 0}</p>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mt-1">Neutral</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
            <p className="text-3xl font-black text-red-600">{reportData?.sentiment?.distribution?.negative || 0}</p>
            <p className="text-xs font-bold text-red-700 uppercase tracking-widest mt-1">Negative</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
            <p className="text-3xl font-black text-indigo-600">{((reportData?.sentiment?.averageScore || 0) * 100).toFixed(0)}%</p>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mt-1">Avg Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Server-side functions to load data (for client component compatibility)
async function loadReliability() {
  const { analyzeReliability: fn } = await import('@/lib/analysis');
  return fn();
}

async function loadDetailedFeatures() {
  const { analyzeDetailedFeatures: fn } = await import('@/lib/analysis');
  return fn();
}

async function loadEngagement() {
  const { analyzeEngagement: fn } = await import('@/lib/analysis');
  return fn();
}

async function loadCulturalPatterns() {
  const { analyzeCulturalPatterns: fn } = await import('@/lib/analysis');
  return fn();
}

async function loadSentiment() {
  const { analyzeSentiment: fn } = await import('@/lib/analysis');
  return fn();
}
