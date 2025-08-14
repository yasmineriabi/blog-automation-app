"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/auth/AuthGuard";
import useBlogStore from "@/store/blogs";
import Button from "@/components/Button";
import SimpleHeader from "@/components/SimpleHeader";

export default function AllBlogsPage() {
  const router = useRouter();
  const { approvedBlogsWithDomains, loading, fetchApprovedBlogsWithDomains } = useBlogStore();

  useEffect(() => {
    fetchApprovedBlogsWithDomains();
  }, [fetchApprovedBlogsWithDomains]);

  const handleReadMore = (blogId: string) => {
    router.push(`/blogs/${blogId}`);
  };

  const handleBackToHome = () => {
    router.push('/dashboard');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <SimpleHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={handleBackToHome}
              className="w-auto px-4 py-2 mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">All Approved Blogs</h1>
            <p className="text-gray-600 mt-2">Discover all our approved blog content</p>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading blogs...</p>
            </div>
          ) : approvedBlogsWithDomains.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No approved blogs available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {approvedBlogsWithDomains.map((blog) => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {blog.domain}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2">
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
          )}
        </div>
      </div>
    </AuthGuard>
  );
} 