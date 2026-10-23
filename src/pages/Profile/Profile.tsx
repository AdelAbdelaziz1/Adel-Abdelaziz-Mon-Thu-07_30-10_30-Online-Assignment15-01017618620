import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bookmark,
  Camera,
  Clock3,
  Expand,
  FileText,
  Mail,
  MessageCircle,
  Repeat2,
  ThumbsUp,
  Users,
} from "lucide-react";
import {
  getMyPosts,
  getSavedPosts,
  toggleBookmark,
} from "../../services/profile.services";
import { UserContext } from "../../component/context/UserContext";

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ---------- Shared post card (used by My Posts and Saved) ---------- */
type PostCardProps = {
  post: any;
  author: { name?: string; username?: string; photo?: string };
  onView: () => void;
  onUnsave?: () => void;
};

function PostCard({ post, author, onView, onUnsave }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_6px_rgba(15,23,42,.05)] transition hover:shadow-sm">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <img
              alt={author.name}
              src={author.photo}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-900">
                {author.name}
              </p>
              <p className="truncate text-xs font-semibold text-slate-500">
                @{author.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] transition hover:bg-[#e7f3ff]"
            >
              View details
            </button>
            {onUnsave && (
              <button
                onClick={onUnsave}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50"
              >
                <Bookmark size={13} fill="currentColor" />
                Unsave
              </button>
            )}
          </div>
        </div>

        <div className="pt-3">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
            {post.body}
          </p>
          {post.image && (
            <img
              src={post.image}
              alt=""
              className="mt-3 max-h-96 w-full rounded-xl object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <span className="inline-flex items-center gap-2 font-semibold">
            <ThumbsUp size={14} className="text-[#1877f2]" />
            {post.likesCount ?? post.likes?.length ?? 0} likes
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <Repeat2 size={14} className="text-[#1877f2]" />
            {post.sharesCount ?? 0} shares
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <MessageCircle size={14} className="text-[#1877f2]" />
            {post.commentsCount ?? post.comments?.length ?? 0} comments
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Clock3 size={13} />
          {formatDate(post.createdAt)}
        </span>
      </div>
    </article>
  );
}

const emptyBox =
  "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm";

function Profile() {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [posts, setPosts] = useState<any[]>([]);

  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [savedError, setSavedError] = useState("");

  const navigate = useNavigate();

  const userContext = useContext(UserContext);
  const userDetails = userContext?.userDetails;

  // My posts
  useEffect(() => {
    if (!userDetails?._id) return;

    async function fetchPosts() {
      try {
        const res = await getMyPosts(userDetails!._id);
        setPosts(res.data.data?.posts ?? res.data.posts ?? []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPosts();
  }, [userDetails?._id]);

  useEffect(() => {
    if (activeTab !== "saved" || savedLoaded) return;

    async function fetchSaved() {
      setLoadingSaved(true);
      setSavedError("");
      try {
        const res = await getSavedPosts();
        setSavedPosts(
          res.data.data?.bookmarks ??
            res.data.bookmarks ??
            res.data.data?.posts ??
            res.data.posts ??
            []
        );
        setSavedLoaded(true);
      } catch (err) {
        console.error(err);
        setSavedError("Could not load saved posts. Please try again.");
      } finally {
        setLoadingSaved(false);
      }
    }

    fetchSaved();
  }, [activeTab, savedLoaded]);

  async function handleUnsave(postId: string) {
    const previous = savedPosts;
    setSavedPosts((p) => p.filter((x) => x._id !== postId)); 
    try {
      await toggleBookmark(postId);
    } catch (err) {
      console.error(err);
      setSavedPosts(previous); 
    }
  }

  if (!userDetails) {
    return <p className="p-6 text-slate-500">Loading profile...</p>;
  }

  const savedCount = savedLoaded
    ? savedPosts.length
    : (userDetails.bookmarksCount ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <div className="space-y-5 sm:space-y-6">
          {/* ===== Header ===== */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
            {/* Cover */}
            <div className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]" />
              <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

              <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
                <label className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                  <Camera size={13} />
                  Add cover
                  <input accept="image/*" className="hidden" type="file" />
                </label>
              </div>
            </div>

            {/* Info card */}
            <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
              <div className="rounded-3xl border border-white/60 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-end gap-4">
                      <div className="group/avatar relative shrink-0">
                        <button
                          type="button"
                          className="cursor-zoom-in rounded-full"
                        >
                          <img
                            alt={userDetails.name}
                            src={userDetails.photo}
                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                          />
                        </button>

                        <button
                          type="button"
                          title="View profile photo"
                          aria-label="View profile photo"
                          className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#1877f2] opacity-100 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-50 sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100"
                        >
                          <Expand size={16} />
                        </button>

                        <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                          <Camera size={17} />
                          <input
                            accept="image/*"
                            className="hidden"
                            type="file"
                          />
                        </label>
                      </div>

                      <div className="min-w-0 pb-1">
                        <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                          {userDetails.name}
                        </h2>
                        <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                          @{userDetails.username}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                          <Users size={13} />
                          Route Posts member
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid w-full grid-cols-3 gap-2 lg:w-[520px]">
                    {[
                      { label: "Followers", value: userDetails.followersCount },
                      { label: "Following", value: userDetails.followingCount },
                      { label: "Bookmarks", value: savedCount },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          {item.label}
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                          {item.value ?? 0}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About + counters */}
                <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-extrabold text-slate-800">
                      About
                    </h3>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <Mail size={15} className="text-slate-500" />
                        {userDetails.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users size={15} className="text-slate-500" />
                        Active on Route Posts
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                        My posts
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {posts.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                        Saved posts
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {savedCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== Tabs + Posts ===== */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    activeTab === "posts"
                      ? "bg-white text-[#1877f2] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText size={15} />
                  My Posts
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                    activeTab === "saved"
                      ? "bg-white text-[#1877f2] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Bookmark size={15} />
                  Saved
                </button>
              </div>

              <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
                {activeTab === "posts" ? posts.length : savedCount}
              </span>
            </div>

            {activeTab === "posts" ? (
              posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      author={userDetails}
                      onView={() => navigate(`/postDetails/${post._id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className={emptyBox}>You have not posted yet.</p>
              )
            ) : loadingSaved ? (
              <p className={emptyBox}>Loading saved posts...</p>
            ) : savedError ? (
              <div className={`${emptyBox} flex items-center justify-between gap-3`}>
                <span className="text-red-600">{savedError}</span>
                <button
                  onClick={() => setSavedLoaded(false)}
                  className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
                >
                  Retry
                </button>
              </div>
            ) : savedPosts.length > 0 ? (
              <div className="space-y-3">
                {savedPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    author={post.user ?? userDetails}
                    onView={() => navigate(`/postDetails/${post._id}`)}
                    onUnsave={() => handleUnsave(post._id)}
                  />
                ))}
              </div>
            ) : (
              <p className={emptyBox}>You have no saved posts.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Profile;