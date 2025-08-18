"use client";

import { useState } from "react";
import AuthGuard from "@/auth/AuthGuard";
import SimpleHeader from "@/components/SimpleHeader";
import useAuth from "@/store/auth";
import Button from "@/components/Button";
import PasswordInput from "@/components/PasswordInput";
import { getCurrentUserDisplayInitials } from "@/utils/getInitials";
import { Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function SecurityPage() {
  const { user, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All password fields are required");
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
      await updatePassword(user._id, formData.currentPassword, formData.newPassword);
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      // Error is already handled in the store
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
        
        <main className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-violet-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-xl font-bold text-violet-700">
                  {userInitials}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{user.username}</h1>
              <p className="text-muted-foreground">Manage your security settings</p>
            </div>
            
            {/* Security Settings Card */}
            <div className="bg-background border border-border rounded-2xl shadow-lg p-6 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <PasswordInput
                  label="Current Password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                
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
                  variant="outline"
                  className="w-full bg-transparent hover:bg-muted/50 border-red-200 text-red-700 hover:text-red-800 hover:border-red-300"
                >
                  Update Password
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 