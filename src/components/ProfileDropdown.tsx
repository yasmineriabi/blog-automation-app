"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User, Shield, UserCheck } from "lucide-react";
import useAuth from "@/store/auth";
import { getCurrentUserDisplayInitials } from "@/utils/getInitials";
import { createClickOutsideHandler, addClickOutsideListener, isAdmin } from "@/utils/uiUtils";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout, authenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = createClickOutsideHandler(dropdownRef, () => setIsOpen(false));
    return addClickOutsideListener(handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
    setIsOpen(false);
  };

  const handleDashboard = () => {
    router.push("/admin/pending-blogs");
    setIsOpen(false);
  };

  const handleProfile = () => {
    router.push("/profile-info");
    setIsOpen(false);
  };

  const handleSecurity = () => {
    router.push("/security");
    setIsOpen(false);
  };

  if (!authenticated || !user) {
    return null;
  }

  const userInitials = getCurrentUserDisplayInitials(2);
  const userIsAdmin = isAdmin(user.role);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 bg-violet-200 text-violet-700 rounded-full hover:bg-violet-300 transition-colors"
      >
        {/* User Avatar with Initials */}
        <span className="text-sm font-medium">
          {userInitials}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-violet-200 text-violet-700 rounded-full flex items-center justify-center text-sm font-medium">
                {userInitials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user.username}
                </p>
                {userIsAdmin && (
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={handleProfile}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <UserCheck size={16} />
              <span>Profile</span>
            </button>

            <button
              onClick={handleSecurity}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Shield size={16} />
              <span>Security</span>
            </button>

            {userIsAdmin && (
              <button
                onClick={handleDashboard}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Manage Blogs</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 