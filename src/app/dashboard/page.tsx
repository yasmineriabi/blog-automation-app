"use client";
import { useEffect, useState } from "react";
import useAuth from '@/store/auth';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import Button from '@/components/Button';
import SimpleHeader from '@/components/SimpleHeader';
import useBlogStore from '@/store/blogs';
import BlogGrid from '@/components/BlogGrid';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { approvedBlogsWithDomains, loading, fetchApprovedBlogsWithDomains } = useBlogStore();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovedBlogsWithDomains();
    // Get selected domain from localStorage
    const storedDomain = localStorage.getItem('selectedDomain');
    setSelectedDomain(storedDomain);
  }, [fetchApprovedBlogsWithDomains]);

  const handleAdminDashboard = () => {
    router.push('/admin/pending-blogs');
  };


  const handleReadMore = (blogId: string) => {
    router.push(`/blogs/${blogId}`);
  };

  // Filter blogs by selected domain
  const filteredBlogs = selectedDomain 
    ? approvedBlogsWithDomains.filter(blog => blog.domain === selectedDomain)
    : approvedBlogsWithDomains;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to <span className="text-primary">Blogs Platform</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing content from our community of writers and creators
            </p>
          </div>



          {/* Admin Actions */}
          {user?.role === 'admin' && (
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 text-center">Admin Actions</h3>
              <Button
                onClick={handleAdminDashboard}
                className="w-full"
              >
                Manage Pending Blogs
              </Button>
            </div>
          )}

          {/* Approved Blogs Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Latest Blogs</h2>
              {selectedDomain && (
                <p className="text-muted-foreground">
                  Filtered by: <span className="font-medium text-primary">{selectedDomain}</span>
                </p>
              )}
            </div>
            
            <BlogGrid
              blogs={filteredBlogs}
              loading={loading}
              onReadMore={handleReadMore}
              blogsPerPage={12}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
