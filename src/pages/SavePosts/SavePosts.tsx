import { useCallback, useEffect, useState } from "react";
import { getSavedPosts } from "../../services/profile.services";
import type { PostCardI } from "../../types/postCard.types";
import PostCard from "../../component/PostCard/PostCard";

export default function SavedPosts() {
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSaved = useCallback(async () => {
    try {
      setError("");
      const res = await getSavedPosts();
      setPosts(
        res.data.data?.bookmarks ??
          res.data.bookmarks ??
          res.data.data?.posts ??
          res.data.posts ??
          [],
      );
    } catch (err) {
      console.error(err);
      setError("Could not load saved posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const box =
    "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm";

  if (loading) return <p className={box}>Loading saved posts...</p>;

  if (error)
    return (
      <div className={`${box} flex items-center justify-between`}>
        <span className="text-red-600">{error}</span>
        <button
          onClick={() => {
            setLoading(true);
            fetchSaved();
          }}
          className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
        >
          Retry
        </button>
      </div>
    );

  if (posts.length === 0) return <p className={box}>You have no saved posts.</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          getPosts={fetchSaved}
          defaultSaved
          onSaveChange={(saved) => {
            if (!saved) setPosts((p) => p.filter((x) => x._id !== post._id));
          }}
        />
      ))}
    </div>
  );
}