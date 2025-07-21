"use client";
import useAuth from '@/store/auth';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-slate-600">This is a protected page. Only logged-in users can see this.</p>
      </div>
    </AuthGuard>
  );
} 