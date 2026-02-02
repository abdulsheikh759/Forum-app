 import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchPosts, createPost, toggleLike } from "../lib/postApi";
import { getComments, addComment, deleteComment } from "../lib/commentApi";
import { fetchGroupMembers } from "../lib/groupApi";
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
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

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
            authorName: p.author?.username || "Unknown",
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

  // ================= LOAD GROUP MEMBERS =================
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchGroupMembers(id);
        setMembers(data);
      } catch (err) {
        toast.error("Failed to load members");
      }
    };

    loadMembers();
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
          authorName: user?.username || "You",
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
                  text: c.comment,
                  authorId: c.author?._id || c.author,
                  authorName: c.author?.username || "Unknown",
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
      const c = await addComment(postId, commentText);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    id: c._id,
                    text: c.comment,
                    authorId: c.author,
                    authorName: user?.username || "You",
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
      <div className="flex h-full relative">

        {/* LEFT SIDEBAR - GROUP MEMBERS */}
        <div className={`
          ${showMembers ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:static
          w-64 md:w-64 lg:w-72
          h-full
          border-r border-gray-700
          overflow-y-auto
          bg-[#212121]
          z-30
          transition-transform duration-300
        `}>
          <div className="p-3 md:p-4 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-base md:text-lg">Group Members</h2>
              <p className="text-xs md:text-sm text-gray-400">{members.length} members</p>
            </div>
            <button
              onClick={() => setShowMembers(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-2">
            {members.map((member) => (
              <div
                key={member._id}
                className="p-2 md:p-3 mb-2 bg-[#2a2a2a] rounded hover:bg-[#333] transition"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm md:text-base">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{member.username}</p>
                    <p className="text-xs text-gray-400 truncate">{member.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay for mobile */}
        {showMembers && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setShowMembers(false)}
          />
        )}

        {/* RIGHT SIDE - POSTS */}
        <div className="flex-1 flex flex-col w-full md:w-auto">

        {/* HEADER */}
        <div className="p-3 md:p-4 border-b border-gray-700 flex gap-2 md:gap-4 items-center">
          <button
            onClick={() => navigate("/home")}
            className="bg-black px-3 md:px-4 py-1 rounded text-sm md:text-base"
          >
            Back
          </button>
          <button
            onClick={() => setShowMembers(true)}
            className="md:hidden bg-blue-600 px-3 py-1 rounded text-sm"
          >
            👥 Members
          </button>
          <h1 className="font-semibold text-sm md:text-base">Group Chat</h1>
        </div>

        {/* POSTS */}
        <div
          ref={postsContainerRef}
          className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4"
        >
          {posts.map((post) => (
            <div key={post.id} className="bg-[#2a2a2a] p-3 md:p-4 rounded">

              <p className="text-sm md:text-base break-words">{post.text}</p>
              <p className="text-xs text-gray-400">— {post.authorName}</p>

              <div className="flex gap-3 md:gap-4 text-sm mt-2">
                <button onClick={() => handleLike(post.id)} className="hover:scale-110 transition">
                  ❤️ {post.likes.length}
                </button>

                <button onClick={() => toggleComments(post.id)} className="hover:scale-110 transition">
                  💬 {post.comments.length}
                </button>
              </div>

              {post.showComments && (
                <div className="mt-3 space-y-2">
                  {post.comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#1a1a1a] p-2 rounded flex justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500 mb-1">{c.authorName}</div>
                        <span className="text-sm md:text-base break-words">{c.text}</span>
                      </div>

                      {c.authorId === currentUserId && (
                        <button
                          onClick={() =>
                            handleDeleteComment(post.id, c.id)
                          }
                          className="text-red-500 hover:scale-110 transition flex-shrink-0"
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
                      className="flex-1 bg-black px-2 py-1 rounded text-sm md:text-base"
                      placeholder="Write comment..."
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 px-2 md:px-3 rounded text-sm md:text-base hover:bg-blue-700 transition"
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
        <div className="p-2 md:p-4 border-t border-gray-700 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-black px-2 md:px-3 py-2 rounded text-sm md:text-base"
            placeholder="Write message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-3 md:px-4 rounded text-sm md:text-base hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>

        </div>
      </div>
    </div>
  );
}
