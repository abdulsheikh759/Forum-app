 import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchPosts, createPost, toggleLike } from "../lib/postApi";
import { getComments, addComment, deleteComment } from "../lib/commentApi";
import { useAuth } from "../ContextApi/AuthContext";
import { toast } from "react-toastify";

export default function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id;

  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [commentText, setCommentText] = useState("");

  const postsContainerRef = useRef(null);
  const bottomRef = useRef(null);

  // ================= LOAD POSTS =================
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(id);

        setPosts(
          data.map((p) => ({
            id: p._id,
            text: p.content,
            authorId: p.author?._id || p.author,
            likes: p.likes || [],        // ✅ ALWAYS ARRAY
            showComments: false,
            comments: [],
          }))
        );
      } catch (err) {
        toast.error("Failed to load posts");
      }
    };

    loadPosts();
  }, [id]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  // ================= CREATE POST =================
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const newPost = await createPost(id, message);

      setPosts((prev) => [
        ...prev,
        {
          id: newPost._id,
          text: newPost.content,
          authorId: currentUserId,
          likes: [],
          showComments: false,
          comments: [],
        },
      ]);

      setMessage("");
    } catch {
      toast.error("Post failed");
    }
  };

  // ================= LIKE / UNLIKE =================
  const handleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: res.post.likes } : p
        )
      );
    } catch {
      toast.error("Like failed");
    }
  };

  // ================= TOGGLE + LOAD COMMENTS =================
  const toggleComments = async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, showComments: !p.showComments } : p
      )
    );

    try {
      const data = await getComments(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: data.map((c) => ({
                  id: c._id,
                  text: c.content,
                  authorId: c.author?._id || c.author,
                })),
              }
            : p
        )
      );
    } catch {
      toast.error("Comments load failed");
    }
  };

  // ================= ADD COMMENT =================
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const c = await addComment(postId, { content: commentText });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    id: c._id,
                    text: c.content,
                    authorId: c.author,
                  },
                ],
              }
            : p
        )
      );

      setCommentText("");
    } catch {
      toast.error("Comment failed");
    }
  };

  // ================= DELETE COMMENT =================
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: p.comments.filter((c) => c.id !== commentId),
              }
            : p
        )
      );
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= UI =================
  return (
    <div className="h-[calc(100vh-80px)] mt-20 bg-[#212121] text-white">
      <div className="flex flex-col h-full">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-700 flex gap-4">
          <button
            onClick={() => navigate("/home")}
            className="bg-black px-4 py-1 rounded"
          >
            Back
          </button>
          <h1 className="font-semibold">Group Chat</h1>
        </div>

        {/* POSTS */}
        <div
          ref={postsContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {posts.map((post) => (
            <div key={post.id} className="bg-[#2a2a2a] p-4 rounded">

              <p>{post.text}</p>
              <p className="text-xs text-gray-400">— {post.authorId}</p>

              <div className="flex gap-4 text-sm mt-2">
                <button onClick={() => handleLike(post.id)}>
                  ❤️ {post.likes.length}
                </button>

                <button onClick={() => toggleComments(post.id)}>
                  💬 {post.comments.length}
                </button>
              </div>

              {post.showComments && (
                <div className="mt-3 space-y-2">
                  {post.comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#1a1a1a] p-2 rounded flex justify-between"
                    >
                      <span>{c.text}</span>

                      {c.authorId === currentUserId && (
                        <button
                          onClick={() =>
                            handleDeleteComment(post.id, c.id)
                          }
                          className="text-red-500"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-black px-2 py-1 rounded"
                      placeholder="Write comment..."
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 px-3 rounded"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* MESSAGE INPUT */}
        <div className="p-4 border-t border-gray-700 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-black px-3 py-2 rounded"
            placeholder="Write message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
