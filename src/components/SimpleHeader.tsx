"use client";
import { useRouter } from 'next/navigation';
import useAuth from '@/store/auth';
import Button from './Button';

export default function SimpleHeader() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  // Don't show header on login/signup pages
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Brand Logo - Home Button */}
          <button
            onClick={handleHome}
            className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Blogs Platform
          </button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="w-auto px-4 py-2 bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
} 