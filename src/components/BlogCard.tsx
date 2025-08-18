"use client";

import Button from "./Button";

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
  const getContentPreview = (content: string) => {
    const firstSentence = content.split(".")[0];
    return firstSentence.length > 100 ? firstSentence.substring(0, 100) + "..." : firstSentence + "...";
  };

  //put in in utils and call it here
  const formatDate = (dateString: string | { $date: string } | null | undefined) => {
    try {
      // Handle different date formats that might come from the backend
      let date;
      
      if (typeof dateString === 'string') {
        // If it's already a valid date string, use it directly
        date = new Date(dateString);
      } else if (dateString && typeof dateString === 'object' && '$date' in dateString) {
        // Handle MongoDB date format
        date = new Date(dateString.$date);
      } else {
        // Fallback to current date if invalid
        date = new Date();
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'Date not available';
    }
  };

  //put in in utils and call it here
  const getDomainColor = (domain: string) => {
    // Array of pastel gradient color schemes - Blue, Green, Violet palette
    const colorSchemes = [
      { bg: "bg-gradient-to-r from-blue-200 to-blue-300", text: "text-blue-800", shadow: "shadow-blue-200/30" },
      { bg: "bg-gradient-to-r from-blue-100 to-blue-200", text: "text-blue-700", shadow: "shadow-blue-100/30" },
      { bg: "bg-gradient-to-r from-sky-200 to-sky-300", text: "text-sky-800", shadow: "shadow-sky-200/30" },
      { bg: "bg-gradient-to-r from-cyan-200 to-cyan-300", text: "text-cyan-800", shadow: "shadow-cyan-200/30" },
      { bg: "bg-gradient-to-r from-teal-200 to-teal-300", text: "text-teal-800", shadow: "shadow-teal-200/30" },
      { bg: "bg-gradient-to-r from-emerald-200 to-emerald-300", text: "text-emerald-800", shadow: "shadow-emerald-200/30" },
      { bg: "bg-gradient-to-r from-green-200 to-green-300", text: "text-green-800", shadow: "shadow-green-200/30" },
      { bg: "bg-gradient-to-r from-lime-200 to-lime-300", text: "text-lime-800", shadow: "shadow-lime-200/30" },
      { bg: "bg-gradient-to-r from-indigo-200 to-indigo-300", text: "text-indigo-800", shadow: "shadow-indigo-200/30" },
      { bg: "bg-gradient-to-r from-violet-200 to-violet-300", text: "text-violet-800", shadow: "shadow-violet-200/30" },
      { bg: "bg-gradient-to-r from-purple-200 to-purple-300", text: "text-purple-800", shadow: "shadow-purple-200/30" },
      { bg: "bg-gradient-to-r from-fuchsia-200 to-fuchsia-300", text: "text-fuchsia-800", shadow: "shadow-fuchsia-200/30" },
      { bg: "bg-gradient-to-r from-blue-100 to-cyan-200", text: "text-blue-700", shadow: "shadow-blue-100/30" },
      { bg: "bg-gradient-to-r from-emerald-100 to-teal-200", text: "text-emerald-700", shadow: "shadow-emerald-100/30" },
      { bg: "bg-gradient-to-r from-violet-100 to-purple-200", text: "text-violet-700", shadow: "shadow-violet-100/30" },
      { bg: "bg-gradient-to-r from-cyan-100 to-blue-200", text: "text-cyan-700", shadow: "shadow-cyan-100/30" },
    ];

    // Generate a consistent hash from the domain name
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      const char = domain.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use the hash to select a color scheme
    const colorIndex = Math.abs(hash) % colorSchemes.length;
    return colorSchemes[colorIndex];
  };

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