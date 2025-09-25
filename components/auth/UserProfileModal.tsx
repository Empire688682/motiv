"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit2, 
  LogOut, 
  Key, 
  Loader2, 
  X, 
  Save, 
  Shield,
  Clock,
  Camera,
  Settings
} from "lucide-react";
import { useState } from "react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: any) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onUpdateProfile,
}: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || user?.Name || "",
    username: user?.username || user?.Username || "",
    email: user?.email || user?.Email || "",
    location: user?.location || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error and success messages when user starts typing
    if (updateError) setUpdateError("");
    if (updateSuccess) setUpdateSuccess("");
  };

  const handleSave = async () => {
    setIsUpdatingProfile(true);
    setUpdateError("");
    setUpdateSuccess("");
    
    try {
      const updatedUser = { ...user, ...formData };
      await onUpdateProfile(updatedUser);
      setUpdateSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      setUpdateError(error.message || "Failed to update profile. Please try again.");
      // Keep editing mode open so user can retry
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || user?.Name || "",
      username: user?.username || user?.Username || "",
      email: user?.email || user?.Email || "",
      location: user?.location || "",
    });
    setUpdateError("");
    setUpdateSuccess("");
    setIsEditing(false);
  };

  const handlePasswordReset = async () => {
    setPasswordResetLoading(true);
    setPasswordResetMessage("");

    const userEmail = user?.email || user?.Email;
    console.log("🔄 Password reset requested for:", userEmail);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://motiv-app-yenh2.ondigitalocean.app/api/v1";
    console.log("🌐 API URL:", apiUrl);

    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      console.log("📊 Response status:", response.status);
      const data = await response.json();
      console.log("📋 Response data:", data);

      if (response.ok) {
        setPasswordResetMessage(data.message || "Password reset link sent to your email");
        console.log("✅ Password reset email sent successfully");
      } else {
        setPasswordResetMessage(data.error || "Failed to send reset email");
        console.log("❌ Password reset failed:", data.error);
      }
    } catch (error) {
      console.error("❌ Network error during password reset:", error);
      setPasswordResetMessage("Network error. Please try again.");
    } finally {
      setPasswordResetLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] w-[95vw] h-[95vh] sm:h-[90vh] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-gray-700 [&>button]:text-white [&>button]:hover:text-gray-300 p-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#1a1a1a]/95 to-[#0f0f0f]/95 backdrop-blur-lg border-b border-gray-700/50">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D72638]/10 rounded-lg">
                  <User className="w-5 h-5 text-[#D72638]" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">
                    My Profile
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm">
                    Manage your account information
                  </DialogDescription>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 profile-modal-scroll">
          {/* Profile Avatar Section */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                {(user.avatar || user.Avatar) ? (
                  <img
                    src={user.avatar || user.Avatar}
                    alt={user.name || user.Name}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#D72638]/20"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#D72638] to-[#a91e2b] rounded-2xl flex items-center justify-center text-white font-bold text-2xl ring-2 ring-[#D72638]/20">
                    {(user.name || user.Name)?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                
                {/* Provider Badge */}
                {user.provider === "google" && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-800">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Upload overlay for future use */}
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  {user.name || user.Name}
                </h3>
                <p className="text-[#D72638] font-medium mb-2">
                  @{user.username || user.Username}
                </p>
                <p className="text-gray-300 text-sm mb-1">
                  {user.email || user.Email}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-[#D72638]/10 rounded-full">
                    <Shield className="w-3 h-3 text-[#D72638]" />
                    <span className="text-xs text-[#D72638] font-medium capitalize">
                      {(user.role || user.Role || 'guest').toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-full">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Since {new Date(user.created_at || user.createdAt || user.CreatedAt || new Date()).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#D72638]/10 rounded-lg">
                    <Settings className="w-4 h-4 text-[#D72638]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Edit Profile</h4>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300 mb-2 block">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 h-12 bg-gray-800/70 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638] rounded-xl"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-300 mb-2 block">
                      Username
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-bold">@</span>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-8 h-12 bg-gray-800/70 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638] rounded-xl"
                        placeholder="Enter your username"
                        minLength={3}
                        maxLength={30}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2 block">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 bg-gray-800/70 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638] rounded-xl"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-300 mb-2 block">
                      Location (Optional)
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="pl-10 h-12 bg-gray-800/70 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638] rounded-xl"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {updateError && (
                    <div className="bg-red-900/20 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                      {updateError}
                    </div>
                  )}

                  {/* Success Message */}
                  {updateSuccess && (
                    <div className="bg-green-900/20 border border-green-700/50 text-green-300 px-4 py-3 rounded-lg text-sm">
                      {updateSuccess}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={isUpdatingProfile}
                      className="flex-1 bg-[#D72638] hover:bg-[#b91e2e] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Basic Information Card */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#D72638]" />
                    Basic Information
                  </h4>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                      <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-[#D72638]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {user.name || user.Name}
                        </p>
                        <p className="text-gray-400 text-sm">Full Name</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                      <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center">
                        <span className="text-[#D72638] font-bold">@</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {user.username || user.Username}
                        </p>
                        <p className="text-gray-400 text-sm">Username</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                      <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#D72638]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium break-all">
                          {user.email || user.Email}
                        </p>
                        <p className="text-gray-400 text-sm">Email Address</p>
                      </div>
                    </div>

                    {user.location && (
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-[#D72638]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {user.location}
                          </p>
                          <p className="text-gray-400 text-sm">Location</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#D72638]" />
                    Account Details
                  </h4>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                      <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#D72638]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium capitalize">
                          {(user.role || user.Role || 'guest').toLowerCase()} Account
                        </p>
                        <p className="text-gray-400 text-sm">Account Type</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                      <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#D72638]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {new Date(user.created_at || user.createdAt || user.CreatedAt || new Date()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-gray-400 text-sm">Member Since</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section - Only show for non-Google users */}
                {user.provider !== "google" && (
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#D72638]" />
                    Security Settings
                  </h4>
                  
                  {passwordResetMessage && (
                    <div className={`mb-4 p-4 rounded-xl text-sm ${
                      passwordResetMessage.includes("sent") || passwordResetMessage.includes("success")
                        ? "bg-green-900/20 border border-green-700/50 text-green-300"
                        : "bg-red-900/20 border border-red-700/50 text-red-300"
                    }`}>
                      {passwordResetMessage}
                    </div>
                  )}

                  <button
                    onClick={handlePasswordReset}
                    disabled={passwordResetLoading}
                    className="w-full flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-[#D72638]/10 rounded-lg flex items-center justify-center">
                      {passwordResetLoading ? (
                        <Loader2 className="w-5 h-5 text-[#D72638] animate-spin" />
                      ) : (
                        <Key className="w-5 h-5 text-[#D72638]" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">
                        Change Password
                      </p>
                      <p className="text-gray-400 text-sm">
                        Send password reset link to your email
                      </p>
                    </div>
                  </button>
                </div>
              )}
              </div>
            )}
          </div>

          {/* Logout Button - Fixed at bottom */}
          <div className="sticky bottom-0 bg-gradient-to-t from-[#1a1a1a] to-transparent pt-4 pb-2">
            <button
              onClick={onLogout}
              className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 hover:text-red-300 font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
