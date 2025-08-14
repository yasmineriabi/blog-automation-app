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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <SimpleHeader />
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Blogs Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing content from our community of writers and creators
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome back, {user?.username || 'User'}!
              </h3>
            </div>
          </div>

          {/* Admin Actions */}
          {user?.role === 'admin' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Admin Actions</h3>
              <Button
                onClick={handleAdminDashboard}
                className="w-full mb-3"
              >
                Manage Pending Blogs
              </Button>
            </div>
          )}

          {/* Approved Blogs Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Approved Blogs</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading blogs...</p>
              </div>
            ) : approvedBlogsWithDomains.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">No approved blogs available yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {approvedBlogsWithDomains.slice(0, 12).map((blog) => (
                    <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="p-6">
                        <div className="mb-4">
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {blog.domain}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2">
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
                      className="w-auto px-8 py-3 text-lg"
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