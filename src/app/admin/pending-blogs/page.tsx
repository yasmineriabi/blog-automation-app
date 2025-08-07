"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/auth/AuthGuard";

// Blog type definition
interface Blog {
  _id: string;
  title: string;
  content: string;
  topicid: string;
  approvedby: string;
  publushedat: string;
  createdat: string;
  status: string;
  createdby: string;
  viewcount: number;
}

export default function PendingBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/pending-blogs", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authorized or error fetching blogs");
        return res.json();
      })
      .then((data) => setBlogs(data))
      .catch((err) => {
        setError("Failed to fetch pending blogs.");
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "accept" | "reject") => {
    // Placeholder for future backend endpoints
    // await fetch(`/api/admin/pending-blogs/${id}/${action}`, { method: "POST", credentials: "include" });
    setBlogs((prev) => prev.filter((blog) => blog._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthGuard allowedRoles={["admin"]}>
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
    </AuthGuard>
  );
}