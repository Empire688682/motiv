"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserProfileModal } from "@/components/auth/UserProfileModal";

export default function TestModalErrors() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mockUser] = useState({
    id: "test-user",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    location: "New York, NY"
  });

  const handleUpdateProfile = async (userData: any) => {
    // Simulate error for testing
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error("Test error: Profile update failed");
  };

  const handleLogout = () => {
    // Logout clicked
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white mb-8">Test Modal Error Handling</h1>
        
        <button
          onClick={() => setShowAuthModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Test Auth Modal Errors
        </button>
        
        <button
          onClick={() => setShowProfileModal(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Test Profile Modal Errors
        </button>

        <div className="text-sm text-gray-400 space-y-2">
          <p><strong>Auth Modal Test:</strong> Try logging in with invalid credentials - modal should stay open with specific error message.</p>
          <p><strong>Profile Modal Test:</strong> Try updating profile - it will simulate an error and keep modal open for retry.</p>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showProfileModal && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={mockUser}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}