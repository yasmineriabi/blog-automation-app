"use client";
import { useEffect } from "react";
import useAuth from '@/store/auth';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import Button from '@/components/Button';
import SimpleHeader from '@/components/SimpleHeader';
import useBlogStore from '@/store/blogs';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { approvedBlogsWithDomains, loading, fetchApprovedBlogsWithDomains } = useBlogStore();

  useEffect(() => {
    fetchApprovedBlogsWithDomains();
  }, [fetchApprovedBlogsWithDomains]);

  const handleAdminDashboard = () => {
    router.push('/admin/pending-blogs');
  };

  const handleViewBlogs = () => {
    // TODO: Redirect to user's blog viewing page when implemented
    router.push('/user/blogs');
  };

  const handleReadMore = (blogId: string) => {
    router.push(`/blogs/${blogId}`);
  };

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

          {/* User Info Card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Welcome back, {user?.username || 'User'}!
              </h3>
              <p className="text-sm text-muted-foreground">
                Role:{" "}
                <span className="capitalize font-medium">
                  {user?.role || "user"}
                </span>
              </p>
            </div>
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
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Latest Blogs</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-muted-foreground">Loading blogs...</p>
              </div>
            ) : approvedBlogsWithDomains.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">No approved blogs available yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {approvedBlogsWithDomains.slice(0, 12).map((blog) => (
                    <div
                      key={blog._id}
                      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="mb-4">
                          <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                            {blog.domain}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-card-foreground mb-4 line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <Button
                          onClick={() => handleReadMore(blog._id)}
                          className="w-full"
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {approvedBlogsWithDomains.length > 12 && (
                  <div className="text-center">
                    <Button
                      onClick={() => router.push('/blogs')}
                      size="lg"
                    >
                      See More Blogs
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
