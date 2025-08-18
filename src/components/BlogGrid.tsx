"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import BlogCard from "./BlogCard";

interface Blog {
  _id: string;
  title: string;
  domain: string;
  content: string;
  createdat: string;
  created_by: string;
  approvedby: string;
}

interface BlogGridProps {
  blogs: Blog[];
  loading: boolean;
  onReadMore: (blogId: string) => void;
  blogsPerPage?: number;
}

export default function BlogGrid({ 
  blogs, 
  loading, 
  onReadMore, 
  blogsPerPage = 12 
}: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  
  // Ensure current page is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  
  const startIndex = (validCurrentPage - 1) * blogsPerPage;
  const endIndex = Math.min(startIndex + blogsPerPage, blogs.length);
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }, [blogs.length]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        <p className="mt-2 text-muted-foreground">Loading blogs...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-lg">No blogs available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onReadMore={onReadMore}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-8">
          <Button
            onClick={() => handlePageChange(validCurrentPage - 1)}
            disabled={validCurrentPage === 1}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={validCurrentPage === page ? "default" : "outline"}
                size="sm"
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            onClick={() => handlePageChange(validCurrentPage + 1)}
            disabled={validCurrentPage === totalPages}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </>
  );
} 