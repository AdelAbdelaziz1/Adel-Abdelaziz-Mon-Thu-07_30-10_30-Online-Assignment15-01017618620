import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import type { PostCardI } from "../../types/postCard.types";
import Sidebar, {
  FEED_TABS,
  type FeedTab,
} from "../../component/Sidebar/Sidebar";
import CreatePost from "../../component/PostCard/CreatePost";
import PostCard from "../../component/PostCard/PostCard";
import PostSkeleton from "../../component/PostCard/PostSkeleton";
import SuggestedFriends from "../../component/SuggestedFriends/SuggestedFriends";
import { getAllPosts } from "../../services/post.service";
import { getMyPosts } from "../../services/profile.services";
import { UserContext } from "../../component/context/UserContext";
import SavedPosts from "../SavePosts/SavePosts";

export default function Home() {
  const [tab, setTab] = useState<FeedTab>("feed");
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userContext = useContext(UserContext);
  const userId = userContext?.userDetails?._id;

  const getPosts = useCallback(async () => {
    // تاب Saved ليه كمبوننت خاص بيجيب بياناته بنفسه
    if (tab === "saved") return;

    setIsLoading(true);
    try {
      if (tab === "myPosts") {
        if (!userId) return;
        const res = await getMyPosts(userId);
        setPosts(res.data.data?.posts ?? res.data.posts ?? []);
      } else {
        const { data } = await getAllPosts();
        setPosts(data.data.posts ?? []);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error fetching posts:", error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [tab, userId]);

  useEffect(() => {
    setPosts([]);
    getPosts();
  }, [getPosts]);

  const showCreatePost = tab !== "saved";

  return (
    <main className="mx-auto max-w-7xl px-3 py-3.5">
      <div className="min-w-0">
        <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <Sidebar active={tab} onChange={setTab} />

          <div className="min-w-0 space-y-4 rounded-2xl text-slate-500">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm xl:hidden">
              <div className="grid grid-cols-2 gap-2">
                {FEED_TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                      tab === id
                        ? "bg-[#e7f3ff] text-[#1877f2]"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {showCreatePost && <CreatePost getPosts={getPosts} />}

            {tab === "saved" ? (
              <SavedPosts />
            ) : isLoading ? (
              <PostSkeleton />
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} getPosts={getPosts} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm">
                {tab === "myPosts"
                  ? "You have not posted yet."
                  : "No posts to show."}
              </p>
            )}
          </div>

          <SuggestedFriends />
        </div>
      </div>
    </main>
  );
}