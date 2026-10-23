import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import type { PostCardI } from "../../types/postCard.types";
import { getMyPosts } from "../../services/profile.services";
import { UserContext, type UserContextType } from "../../component/context/UserContext";
import CreatePost from "../../component/PostCard/CreatePost";
import PostSkeleton from "../../component/PostCard/PostSkeleton";
import PostCard from "../../component/PostCard/PostCard";

export default function MyPosts() {
  const { userDetails }: UserContextType = useContext(UserContext)!;
  const userId = userDetails?._id;

  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPosts = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const res = await getMyPosts(userId);
      setPosts(res.data.data?.posts ?? res.data.posts ?? []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error fetching my posts:", error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="min-w-0 space-y-4">
      <CreatePost getPosts={getPosts} />

      {isLoading ? (
        <PostSkeleton />
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} getPosts={getPosts} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm">
          You have not posted yet.
        </p>
      )}
    </div>
  );
}