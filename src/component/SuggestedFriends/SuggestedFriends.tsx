import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Check, Search, UserPlus, Users } from "lucide-react";
import {
  getSuggestedFriends,
  toggleFollow,
} from "../../services/friends.services";

const DEFAULT_AVATAR =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

const PAGE_SIZE = 5;

interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  followersCount?: number;
}

export default function SuggestedFriends() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await getSuggestedFriends(20);
        setUsers(
          res.data.data?.suggestions ??
            res.data.suggestions ??
            res.data.data?.users ??
            [],
        );
      } catch (err) {
        console.error(err);
        setError("Could not load suggestions.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q),
    );
  }, [users, search]);

  const shown = filtered.slice(0, visible);

  function updateSet(
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string,
    add: boolean,
  ) {
    setter((prev) => {
      const next = new Set(prev);
      if (add) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleFollow(userId: string) {
    if (pending.has(userId)) return;

    const wasFollowed = followed.has(userId);
    updateSet(setFollowed, userId, !wasFollowed); // تحديث فوري
    updateSet(setPending, userId, true);

    try {
      const res = await toggleFollow(userId);
      toast.success(
        res.data?.message ?? (wasFollowed ? "Unfollowed" : "Followed"),
      );
    } catch (err) {
      console.error(err);
      updateSet(setFollowed, userId, wasFollowed); // رجّعها لو فشل
      toast.error("Failed to update follow status");
    } finally {
      updateSet(setPending, userId, false);
    }
  }

  return (
    <aside className="hidden h-fit xl:sticky xl:top-[84px] xl:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#1877f2]" aria-hidden="true" />
            <h3 className="text-base font-extrabold text-slate-900">
              Suggested Friends
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
            {users.length}
          </span>
        </div>

        <div className="mb-3">
          <label className="relative block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              placeholder="Search friends..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[78px] animate-pulse rounded-xl border border-slate-200 bg-slate-50"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm font-semibold text-rose-600">{error}</p>
        ) : shown.length === 0 ? (
          <p className="text-sm text-slate-400">
            {search ? "No matching users." : "No suggestions right now."}
          </p>
        ) : (
          <div className="space-y-3">
            {shown.map((user) => {
              const isFollowed = followed.has(user._id);
              return (
                <div
                  key={user._id}
                  className="rounded-xl border border-slate-200 p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 px-1 py-1">
                      <img
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.photo || DEFAULT_AVATAR}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFollow(user._id)}
                      disabled={pending.has(user._id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 ${
                        isFollowed
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-[#e7f3ff] text-[#1877f2] hover:bg-[#d8ebff]"
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <Check size={13} /> Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={13} /> Follow
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      {(user.followersCount ?? 0) + (isFollowed ? 1 : 0)}{" "}
                      followers
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > visible && (
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            View more
          </button>
        )}
      </div>
    </aside>
  );
}