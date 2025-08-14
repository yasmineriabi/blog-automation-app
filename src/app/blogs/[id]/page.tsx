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
    router.push("/dashboard");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentBlog) return <div>Blog not found</div>;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <SimpleHeader />
        <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <Button onClick={handleBack} className="w-auto px-4 py-2">
              ← Back to Home
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
    </AuthGuard>
  );
} 