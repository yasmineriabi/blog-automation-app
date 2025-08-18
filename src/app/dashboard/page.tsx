"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useAuth from '@/store/auth';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import Button from '@/components/Button';
import SimpleHeader from '@/components/SimpleHeader';
import useBlogStore from '@/store/blogs';
import BlogCard from '@/components/BlogCard';
import { scrollToTop } from '@/utils/uiUtils';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { approvedBlogsWithDomains, loading, fetchApprovedBlogsWithDomains } = useBlogStore();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12;

  useEffect(() => {
    fetchApprovedBlogsWithDomains();
    // Get selected domain from localStorage
    const storedDomain = localStorage.getItem('selectedDomain');
    setSelectedDomain(storedDomain);
  }, [fetchApprovedBlogsWithDomains]);




  const handleReadMore = (blogId: string) => {
    router.push(`/blogs/${blogId}`);
  };

  // Filter blogs by selected domain (case-insensitive)
  const filteredBlogs = selectedDomain 
    ? approvedBlogsWithDomains.filter(blog => blog.domain.toLowerCase() === selectedDomain.toLowerCase())
    : approvedBlogsWithDomains;

  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  
  // Ensure current page is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  
  const startIndex = (validCurrentPage - 1) * blogsPerPage;
  const endIndex = Math.min(startIndex + blogsPerPage, filteredBlogs.length);
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
    scrollToTop();
  };

  // Update current page if it's out of bounds
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Reset to page 1 when blogs change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBlogs.length]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
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
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-muted-foreground">Loading blogs...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">No blogs available.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentBlogs.map((blog) => (
                    <BlogCard
                      key={blog._id}
                      blog={blog}
                      onReadMore={handleReadMore}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mb-8">
                    <Button
                      onClick={() => handlePageChange(validCurrentPage - 1)}
                      variant="outline"
                      size="sm"
                      className={`flex items-center space-x-1 ${validCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={validCurrentPage === page ? "primary" : "outline"}
                          size="sm"
                          className="w-10 h-10 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => handlePageChange(validCurrentPage + 1)}
                      variant="outline"
                      size="sm"
                      className={`flex items-center space-x-1 ${validCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
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
