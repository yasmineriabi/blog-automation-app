"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { marked } from "marked";
import AuthGuard from "@/auth/AuthGuard";
import useBlogStore from "@/store/blogs";
import Button from "@/components/Button";
import SimpleHeader from "@/components/SimpleHeader";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchBlogById, currentBlog, loading, error } = useBlogStore();
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    if (params.id) {
      fetchBlogById(params.id as string);
    }
    
    // Cleanup function to clear current blog when component unmounts
    return () => {
      // Clear current blog when leaving this page
      // This will be handled by the store's clearCurrentBlog function
    };
  }, [params.id, fetchBlogById]);

  useEffect(() => {
    if (currentBlog?.content) {
      // Configure marked options for security
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      
      // Convert markdown to HTML - handle both sync and async cases
      const convertMarkdown = async () => {
        try {
          const html = await marked(currentBlog.content);
          setHtmlContent(html);
        } catch (error) {
          console.error('Error converting markdown:', error);
          setHtmlContent(currentBlog.content); // Fallback to plain text
        }
      };
      
      convertMarkdown();
    }
  }, [currentBlog?.content]);

  const handleBack = () => {
    router.push("/admin/pending-blogs");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentBlog) return <div>Blog not found</div>;

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <SimpleHeader />
        <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <Button onClick={handleBack} className="w-auto px-4 py-2">
              ← Back to Pending Blogs
            </Button>
          </div>
          
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", fontWeight: "bold" }}>{currentBlog.title}</h1>
          </div>

          <div 
            className="markdown-content"
            style={{
              lineHeight: "1.6",
              fontSize: "1.1rem",
              padding: "1rem",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>

      <style jsx>{`
        .markdown-content h1 {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
          color: #2d3748;
        }
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.2rem 0 0.8rem 0;
          color: #2d3748;
        }
        .markdown-content h3 {
          font-size: 1.3rem;
          font-weight: bold;
          margin: 1rem 0 0.6rem 0;
          color: #2d3748;
        }
        .markdown-content p {
          margin: 0.8rem 0;
          color: #4a5568;
        }
        .markdown-content ul, .markdown-content ol {
          margin: 0.8rem 0;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin: 0.4rem 0;
          color: #4a5568;
        }
        .markdown-content blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #718096;
        }
        .markdown-content code {
          background-color: #f7fafc;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: #e53e3e;
        }
        .markdown-content pre {
          background-color: #f7fafc;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
        }
        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
          color: #2d3748;
        }
        .markdown-content a {
          color: #3182ce;
          text-decoration: underline;
        }
        .markdown-content a:hover {
          color: #2c5aa0;
        }
        .markdown-content strong {
          font-weight: bold;
          color: #2d3748;
        }
        .markdown-content em {
          font-style: italic;
        }
      `}</style>
    </AuthGuard>
  );
} 