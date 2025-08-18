"use client";

import { useState } from "react";
import AuthGuard from "@/auth/AuthGuard";
import SimpleHeader from "@/components/SimpleHeader";
import useAuth from "@/store/auth";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import { getCurrentUserDisplayInitials } from "@/utils/getInitials";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUsername, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    if (!user?._id) {
      toast.error("User ID not found");
      return;
    }

    setLoading(true);
    try {
      await updateUsername(user._id, formData.username);
      setFormData(prev => ({ ...prev, username: formData.username }));
    } catch (error) {
      // Error is already handled in the store
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("New password and confirmation are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (!user?._id) {
      toast.error("User ID not found");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(user._id, formData.newPassword);
      setFormData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      // Error is already handled in the store
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const userInitials = getCurrentUserDisplayInitials(2);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Profile Settings</h1>
            
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="flex">
                {/* Left Section - User Info */}
                <div className="w-1/3 p-8 bg-card border-r border-border">
                  <div className="text-center">
                    {/* User Initials */}
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {userInitials}
                      </span>
                    </div>
                    
                    {/* Username */}
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {user.username}
                    </h2>
                    
                    {/* Email */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {user.email}
                    </p>
                    
                    {/* Role - Only show for admin users */}
                    {(user.role === 'admin' || user.role === 'super-admin') && (
                      <div className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                        {user.role}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Separator */}
                <div className="w-px bg-border"></div>

                {/* Right Section - Update Forms */}
                <div className="flex-1 p-8">
                  <div className="space-y-8">
                    {/* Update Username Form */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Update Username</h3>
                      <form onSubmit={handleUpdateUsername} className="space-y-4">
                        <FormInput
                          label="New Username"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          placeholder="Enter new username"
                          autoComplete="username"
                        />
                        <Button 
                          type="submit" 
                          loading={loading}
                          className="w-full"
                        >
                          Update Username
                        </Button>
                      </form>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border pt-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Update Password</h3>
                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <PasswordInput
                          label="New Password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange("newPassword", e.target.value)}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                        />
                        
                        <PasswordInput
                          label="Confirm New Password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                        />
                        
                        <Button 
                          type="submit" 
                          loading={loading}
                          className="w-full"
                        >
                          Update Password
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 