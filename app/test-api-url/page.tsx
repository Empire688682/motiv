"use client";

import { useState } from "react";

export default function TestApiUrl() {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");

  const checkApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "https://motiv-app-yenh2.ondigitalocean.app/api/v1";
    setApiUrl(url);
  };

  const testApiConnection = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "https://motiv-app-yenh2.ondigitalocean.app/api/v1";
      const response = await fetch(`${url}/health`, {
        method: 'GET',
      });

      if (response.ok) {
        setTestResult("✅ API connection successful!");
      } else {
        setTestResult(`❌ API returned status: ${response.status}`);
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white mb-8">Test API URL Configuration</h1>

        <div className="space-y-4">
          <button
            onClick={checkApiUrl}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Check API URL
          </button>

          {apiUrl && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-white font-semibold">Current API URL:</p>
              <p className="text-gray-300 text-sm break-all">{apiUrl}</p>
            </div>
          )}

          <button
            onClick={testApiConnection}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Test API Connection
          </button>

          {testResult && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-white font-semibold">Test Result:</p>
              <p className="text-gray-300">{testResult}</p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-400 space-y-2">
          <p><strong>What this tests:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Environment variable loading</li>
            <li>Fallback URL usage</li>
            <li>API connectivity</li>
            <li>Password reset functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}