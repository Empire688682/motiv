"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export default function TestAuthErrorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const testScenarios = [
    {
      title: "Non-existent Email",
      description: "Try logging in with an email that doesn't exist",
      email: "nonexistent@example.com",
      password: "password123",
      expectedError: "No account found with this email address"
    },
    {
      title: "Wrong Password",
      description: "Try logging in with correct email but wrong password",
      email: "test@example.com", // Replace with existing email
      password: "wrongpassword",
      expectedError: "Incorrect password. Please try again"
    },
    {
      title: "Invalid Email Format",
      description: "Try logging in with invalid email format",
      email: "invalid-email",
      password: "password123",
      expectedError: "Invalid email format"
    },
    {
      title: "Empty Fields",
      description: "Try logging in with empty email or password",
      email: "",
      password: "",
      expectedError: "Email is required"
    },
    {
      title: "Short Password (Signup)",
      description: "Try signing up with password less than 8 characters",
      email: "newuser@example.com",
      password: "123456",
      expectedError: "Password must be at least 8 characters long"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Authentication Error Testing
        </h1>
        
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Test Instructions:
          </h2>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Click "Open Auth Modal" to test authentication</li>
            <li>Try the different test scenarios listed below</li>
            <li>Check that specific error messages appear (not generic ones)</li>
            <li>Open browser developer tools to see console logs</li>
            <li>Verify that errors are user-friendly and specific</li>
          </ol>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {testScenarios.map((scenario, index) => (
            <div key={index} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                {scenario.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {scenario.description}
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-400 mb-1">Test Data:</div>
                <div className="text-sm text-white font-mono">
                  Email: {scenario.email || "(empty)"}
                </div>
                <div className="text-sm text-white font-mono">
                  Password: {scenario.password || "(empty)"}
                </div>
              </div>
              <div className="bg-[#D72638]/10 border border-[#D72638]/30 rounded-lg p-3">
                <div className="text-xs text-[#D72638] mb-1">Expected Error:</div>
                <div className="text-sm text-[#D72638] font-medium">
                  "{scenario.expectedError}"
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#D72638] hover:bg-[#b91e2e] text-white font-medium py-4 px-8 rounded-xl transition-colors text-lg"
          >
            Open Auth Modal
          </button>
        </div>

        <div className="mt-8 bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            What to Look For:
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-[#22c55e] font-medium mb-2">✅ Good Error Messages:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• "No account found with this email address"</li>
                <li>• "Incorrect password. Please try again"</li>
                <li>• "Password must be at least 8 characters long"</li>
                <li>• "Email already exists"</li>
                <li>• "Passwords do not match"</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#ef4444] font-medium mb-2">❌ Bad Error Messages:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• "Invalid credentials" (too generic)</li>
                <li>• "Authentication failed" (not helpful)</li>
                <li>• "Login failed" (doesn't explain why)</li>
                <li>• "Request failed" (technical, not user-friendly)</li>
              </ul>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAuthSuccess={() => {
            console.log("✅ Authentication successful!");
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}