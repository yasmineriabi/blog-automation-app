"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/auth/AuthGuard";
import useBlogStore from "@/store/blogs";
import Button from "@/components/Button";
import SimpleHeader from "@/components/SimpleHeader";
import { Check, X, ArrowRight } from "lucide-react";

export default function PendingBlogsPage() {
  const { blogs, loading, error, fetchPendingBlogs, approveBlog, rejectBlog } = useBlogStore();
  const router = useRouter();

  useEffect(() => {
    fetchPendingBlogs();
  }, [fetchPendingBlogs]);

  const handleAction = async (id: string, action: "accept" | "reject") => {
    if (action === "accept") {
      await approveBlog(id);
    } else {
      await rejectBlog(id);
    }
  };

  const handleReadMore = (id: string) => {
    router.push(`/admin/blogs/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Pending Blogs</h1>
            {error && <div className="text-destructive text-center mb-4">{error}</div>}
            {blogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">No pending blogs.</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-semibold text-foreground">Title</th>
                        <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog._id} className="border-b border-border last:border-b-0">
                          <td className="p-4 text-foreground">{blog.title}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleReadMore(blog._id)}
                                className="p-2"
                                size="sm"
                                variant="outline"
                                title="Read More"
                              >
                                <ArrowRight size={16} />
                              </Button>
                              <Button
                                onClick={() => handleAction(blog._id, "accept")}
                                className="p-2"
                                size="sm"
                                variant="default"
                                title="Accept"
                              >
                                <Check size={16} />
                              </Button>
                              <Button
                                onClick={() => handleAction(blog._id, "reject")}
                                className="p-2"
                                size="sm"
                                variant="destructive"
                                title="Reject"
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
