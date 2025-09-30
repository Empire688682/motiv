"use client";

import { useState } from "react";

export default function TestPasswordResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://motiv-app-yenh2.ondigitalocean.app/api/v1";
      
      
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

  const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset link sent to your email");
        
      } else {
        setError(data.error || "Failed to send reset email");
        
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Test Password Reset
        </h1>
        
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-1 focus:ring-[#D72638] focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D72638] hover:bg-[#b91e2e] disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-700/50 text-green-300 rounded-xl text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-700/50 text-red-300 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
          <h3 className="text-sm font-medium text-white mb-2">Debug Info:</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Using fallback'}</div>
            <div>Full endpoint: {(process.env.NEXT_PUBLIC_API_URL || "https://motiv-app-yenh2.ondigitalocean.app/api/v1")}/auth/forgot-password</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Check browser console for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}