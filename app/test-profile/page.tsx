"use client";

import { useState } from "react";
import { UserProfileModal } from "@/components/auth/UserProfileModal";

export default function TestProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock user data for testing
  const mockUser = {
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    location: "New York, USA",
    role: "user",
    provider: "email", // or "google" to test different states
    created_at: "2024-01-15T10:30:00Z",
    avatar: null // Test without avatar
  };

  const handleUpdateProfile = (updatedUser: any) => {
      // Profile updated logic here
    // In a real app, this would make an API call
  };

  const handleLogout = () => {
      // logout handler
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-8">
          Profile Modal Test
        </h1>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D72638] hover:bg-[#b91e2e] text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Open Profile Modal
        </button>
        
        <div className="mt-8 text-gray-400 text-sm max-w-md">
          <p className="mb-2">
            This page is for testing the redesigned profile modal.
          </p>
          <p>
            The modal features a modern design with better mobile responsiveness 
            and smooth scrolling.
          </p>
        </div>
      </div>

      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={mockUser}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}