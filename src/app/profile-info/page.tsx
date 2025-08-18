"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/auth/AuthGuard";
import SimpleHeader from "@/components/SimpleHeader";
import useAuth from "@/store/auth";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { getCurrentUserDisplayInitials } from "@/utils/getInitials";
import { UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfileInfoPage() {
  const { user, updateUsername } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
  });

  // Update form data when user data is available
  useEffect(() => {
    if (user?.username) {
      setFormData(prev => ({
        ...prev,
        username: user.username
      }));
    }
  }, [user?.username]);

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
              <p className="text-muted-foreground">Manage your profile information</p>
            </div>
            
            {/* Profile Information Card */}
            <div className="bg-background border border-border rounded-2xl shadow-lg p-6 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <UserCheck className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
                  <div className="p-3 bg-muted/50 border border-border rounded-lg">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                </div>

                {/* Username (Editable) */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Username</label>
                  <form onSubmit={handleUpdateUsername} className="space-y-3">
                    <FormInput
                      label=""
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
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent hover:bg-muted/50 border-indigo-200 text-indigo-700 hover:text-indigo-800 hover:border-indigo-300"
                    >
                      Update Username
                    </Button>
                  </form>
                </div>

                {/* Role Display */}
                {(user.role === 'admin' || user.role === 'super-admin') && (
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Role</label>
                    <div className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-2 rounded-lg font-medium">
                      {user.role}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 