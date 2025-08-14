"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/auth/AuthGuard";
import useBlogStore from "@/store/blogs";
import Button from "@/components/Button";
import SimpleHeader from "@/components/SimpleHeader";

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
      <div className="min-h-screen bg-gray-50">
        <SimpleHeader />
        <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
          <h1>Pending Blogs</h1>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {blogs.length === 0 ? (
            <p>No pending blogs.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{blog.title}</td>
                    <td style={{ padding: "8px" }}>
                      <Button
                        onClick={() => handleReadMore(blog._id)}
                        className="w-auto px-3 py-1 text-sm mr-2"
                      >
                        Read More
                      </Button>
                      <button
                        onClick={() => handleAction(blog._id, "accept")}
                        style={{ marginRight: "8px" }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(blog._id, "reject")}
                        style={{ color: "red" }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
