import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../../component/PostCard/PostCard";
import SuggestedFriends from "../../component/SuggestedFriends/SuggestedFriends";
import { getUserFeed } from "../../services/feed.service";
import type { PostCardI } from "../../types/postCard.types";
import PostSkeleton from "../../component/PostCard/PostSkeleton";
import CreatePost from "../../component/PostCard/CreatePost";
import Sidebar, { type FeedTab } from "../../component/Sidebar/Sidebar";

export default function Newsfeed() {
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedTab>("feed");

  const getPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getUserFeed();
      setPosts(data.data.posts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <Sidebar active={activeTab} onChange={setActiveTab} />

          <section className="space-y-4">
            <CreatePost getPosts={getPosts} />

            {loading ? (
              <PostSkeleton />
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                No posts yet. Be the first one to publish.
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} getPosts={getPosts} />
              ))
            )}
          </section>

          <SuggestedFriends />
        </div>
      </main>
    </div>
  );
}
