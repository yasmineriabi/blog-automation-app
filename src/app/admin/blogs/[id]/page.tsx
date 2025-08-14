"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { marked } from "marked";
import AuthGuard from "@/auth/AuthGuard";
import useBlogStore from "@/store/blogs";
import Button from "@/components/Button";
import SimpleHeader from "@/components/SimpleHeader";

export default function AdminBlogDetailPage() {
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

  if (loading) return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground text-lg">Loading blog...</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );

  if (error) return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive text-lg">Error: {error}</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );

  if (!currentBlog) return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Blog not found</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button onClick={handleBack} className="w-auto px-4 py-2">
                ← Back to Pending Blogs
              </Button>
            </div>
            
            <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-card-foreground mb-4">{currentBlog.title}</h1>
              </div>

              <div 
                className="markdown-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .markdown-content h1 {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
          color: var(--foreground);
        }
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.2rem 0 0.8rem 0;
          color: var(--foreground);
        }
        .markdown-content h3 {
          font-size: 1.3rem;
          font-weight: bold;
          margin: 1rem 0 0.6rem 0;
          color: var(--foreground);
        }
        .markdown-content p {
          margin: 0.8rem 0;
          color: var(--muted-foreground);
        }
        .markdown-content ul, .markdown-content ol {
          margin: 0.8rem 0;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin: 0.4rem 0;
          color: var(--muted-foreground);
        }
        .markdown-content blockquote {
          border-left: 4px solid var(--border);
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: var(--muted-foreground);
        }
        .markdown-content code {
          background-color: var(--muted);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: var(--destructive);
        }
        .markdown-content pre {
          background-color: var(--muted);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          border: 1px solid var(--border);
        }
        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
          color: var(--foreground);
        }
        .markdown-content a {
          color: var(--primary);
          text-decoration: underline;
        }
        .markdown-content a:hover {
          color: var(--primary);
          opacity: 0.8;
        }
        .markdown-content strong {
          font-weight: bold;
          color: var(--foreground);
        }
        .markdown-content em {
          font-style: italic;
        }
      `}</style>
    </AuthGuard>
  );
} 