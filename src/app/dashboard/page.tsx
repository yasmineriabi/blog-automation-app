import AuthGuard from '@/auth/AuthGard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-slate-600">This is a protected page. Only logged-in users can see this.</p>
      </div>
    </AuthGuard>
  );
} 