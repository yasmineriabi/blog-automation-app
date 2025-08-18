"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import useAuth from "@/store/auth";
import { getCurrentUserDisplayInitials } from "@/utils/getInitials";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout, authenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    router.push("/profile");
    setIsOpen(false);
  };

  if (!authenticated || !user) {
    return null;
  }

  const userInitials = getCurrentUserDisplayInitials(2);
  const isAdmin = user.role === "admin" || user.role === "super-admin";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
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
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {userInitials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user.username}
                </p>
                {isAdmin && (
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
              <User size={16} />
              <span>Profile</span>
            </button>

            {isAdmin && (
              <button
                onClick={handleDashboard}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <Settings size={16} />
                <span>Pending Blogs</span>
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