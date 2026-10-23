import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Check, CheckCheck, Dot, Heart, MessageCircle, Repeat2, UserPlus } from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notification.services";

const iconByType: Record<string, { Icon: any; color: string; label: string }> = {
  like: { Icon: Heart, color: "text-rose-500", label: "liked your post" },
  comment: { Icon: MessageCircle, color: "text-[#1877f2]", label: "commented on your post" },
  share: { Icon: Repeat2, color: "text-emerald-500", label: "shared your post" },
  follow: { Icon: UserPlus, color: "text-violet-500", label: "started following you" },
};

function timeAgo(date?: string) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${Math.max(diff, 1)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function Notification() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await getNotifications(1, 50);
        console.log("notifications response:", res);
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.notifications ?? [];
        setNotifications(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const isRead = (n: any) => n.isRead ?? n.read ?? false;

  const unreadCount = notifications.filter((n) => !isRead(n)).length;
  const visible =
    filter === "unread" ? notifications.filter((n) => !isRead(n)) : notifications;

  async function markAsRead(id: string) {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function markAllAsRead() {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read: true }))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
          {/* Header */}
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                  Notifications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Realtime updates for likes, comments, shares, and follows.
                </p>
              </div>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <CheckCheck size={15} />
                Mark all as read
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  filter === "all"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  filter === "unread"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Unread
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#1877f2]">
                  {unreadCount}
                </span>
              </button>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 p-3 sm:p-4">
            {loading && (
              <p className="py-6 text-center text-sm text-slate-400">
                Loading...
              </p>
            )}

            {!loading && visible.length === 0 && (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                {filter === "unread"
                  ? "No unread notifications."
                  : "No notifications yet."}
              </p>
            )}

            {visible.map((n) => {
              const actor = n.actor ?? n.sender ?? n.from ?? n.user ?? {};
              const read = isRead(n);
              const { Icon, color, label } =
                iconByType[n.type] ?? iconByType.like;
              const text =
                n.text ?? n.message ?? n.entity?.body ?? n.entity?.content;

              return (
                <article
                  key={n._id}
                  className={`group relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 ${
                    read
                      ? "border-slate-200 bg-white"
                      : "border-[#dbeafe] bg-[#edf4ff]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="block cursor-pointer"
                    >
                      <img
                        alt={actor.name}
                        src={actor.photo}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    </button>
                    <span
                      className={`absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white ${color}`}
                    >
                      <Icon size={15} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
                      <p className="text-sm leading-6 text-slate-800">
                        <button
                          type="button"
                          onClick={() => navigate("/profile")}
                          className="font-extrabold hover:text-[#1877f2] hover:underline"
                        >
                          {actor.name}
                        </button>{" "}
                        {label}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {timeAgo(n.createdAt)}
                        </span>
                        {!read && <Dot size={20} className="text-[#1877f2]" />}
                      </div>
                    </div>

                    {text && (
                      <p className="mt-0.5 text-sm text-slate-600">{text}</p>
                    )}

                    {!read && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => markAsRead(n._id)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#1877f2] ring-1 ring-[#dbeafe] transition hover:bg-[#e7f3ff]"
                        >
                          <Check size={13} />
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Notification;