"use client";

import Button from "./Button";
import { getContentPreview, formatDate, getDomainColor } from "@/utils/blogUtils";

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    domain: string;
    content: string;
    createdat: string;
    created_by: string;
    approvedby: string;
  };
  onReadMore: (blogId: string) => void;
}

export default function BlogCard({ blog, onReadMore }: BlogCardProps) {

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="mb-4">
          <span className={`inline-block text-xs px-4 py-2 rounded-full font-semibold shadow-lg ${getDomainColor(blog.domain).bg} ${getDomainColor(blog.domain).text} ${getDomainColor(blog.domain).shadow} hover:scale-105 transition-all duration-200`}>
            {blog.domain}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-card-foreground mb-3 line-clamp-2">{blog.title}</h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{getContentPreview(blog.content)}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {/* Date with calendar icon */}
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formatDate(blog.createdat)}</span>
            </div>

            {/* Author with person icon */}
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{blog.created_by}</span>
            </div>

            {/* Approved by username */}
            {blog.approvedby && (
              <div className="flex items-center gap-1">
                <span>{blog.approvedby}</span>
              </div>
            )}
          </div>

          {/* Smaller Read More button */}
          <Button onClick={() => onReadMore(blog._id)} size="sm" variant="outline">
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
} 