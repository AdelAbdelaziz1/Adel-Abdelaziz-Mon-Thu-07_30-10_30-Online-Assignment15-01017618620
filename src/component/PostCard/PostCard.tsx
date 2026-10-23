import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Bookmark,
  ChevronDown,
  Earth,
  Ellipsis,
  MessageCircle,
  Pencil,
  Repeat2,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import type { PostCardI, TopComment } from "../../types/postCard.types";
import { Link } from "react-router";
import { getPostComments } from "../../services/comments.services";
import PostComment from "./PostComment";
import { UserContext, type UserContextType } from "../context/UserContext";
import EditPost from "./EditPost";
import { AlertDialog, Button } from "@heroui/react";
import { deletePost } from "../../services/post.service";
import toast from "react-hot-toast";
import { toggleBookmark } from "../../services/profile.services";

const DEFAULT_AVATAR =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

const INITIAL_VISIBLE_COMMENTS = 2;

export default function PostCard({
  post,
  getPosts,
  defaultSaved,
  onSaveChange,
}: {
  post: PostCardI;
  getPosts: () => void;
  defaultSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [allComments, setAllComments] = useState<TopComment[]>([]);
  const [visibleComments, setVisibleComments] = useState(
    INITIAL_VISIBLE_COMMENTS,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState<string | null>(
    null,
  );
  const [showEditPost, setShowEditPost] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(
    defaultSaved ?? !!((post as any).bookmarked ?? (post as any).isBookmarked),
  );
  const [isSaving, setIsSaving] = useState(false);

  const { userDetails }: UserContextType = useContext(UserContext);

  const postMenuRef = useRef<HTMLDivElement>(null);
  const commentMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        postMenuRef.current &&
        !postMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }

      if (openCommentMenuId) {
        const activeCommentMenu = commentMenuRefs.current[openCommentMenuId];
        if (
          activeCommentMenu &&
          !activeCommentMenu.contains(event.target as Node)
        ) {
          setOpenCommentMenuId(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCommentMenuId]);

  const getComments = useCallback(async (postId: string) => {
    try {
      const { data } = await getPostComments(postId);
      setAllComments(data.data.comments ?? []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (post._id) {
      getComments(post._id);
    }
  }, [post._id, getComments]);

  const user = post.user ?? {};

  const isPostOwner = !!userDetails?._id && post.user?._id === userDetails._id;

  const baseLikes: number =
    (post as any).likesCount ?? (post as any).likes?.length ?? 0;
  const likesCount = baseLikes + (liked ? 1 : 0);

  const commentsCount = allComments.length;
  const hasMoreComments = commentsCount > visibleComments;
  const isExpanded = visibleComments > INITIAL_VISIBLE_COMMENTS;

  async function deleteMyPost() {
    try {
      setIsDeleting(true);
      const res = await deletePost(post._id);
      toast.success(res?.message ?? "Post deleted");
      setShowDelete(false);
      getPosts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  }
  async function handleSave() {
    if (isSaving) return;
    const next = !saved;
    setSaved(next);
    setMenuOpen(false);
    setIsSaving(true);
    try {
      const res = await toggleBookmark(post._id);
      toast.success(
        res.data?.message ?? (next ? "Post saved" : "Post removed from saved"),
      );
      onSaveChange?.(next);
    } catch (error) {
      console.log(error);
      setSaved(!next);
      toast.error("Failed to update saved posts");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <a className="shrink-0" href={`#/profile/${user._id}`}>
            <img
              alt={user.name || "User avatar"}
              className="h-11 w-11 rounded-full object-cover"
              src={user.photo || DEFAULT_AVATAR}
            />
          </a>
          <div className="min-w-0 flex-1">
            <a
              className="truncate text-sm font-bold hover:underline"
              href={`#/profile/${user._id}`}
            >
              {user.name}
            </a>
            <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
              @{user.username} ·
              <span className="font-semibold">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : ""}
              </span>
              <span className="mx-1">·</span>
              <span className="inline-flex items-center gap-1">
                <Earth size={11} /> Public
              </span>
            </div>
          </div>

          {/* Post menu */}
          <div className="relative" ref={postMenuRef}>
            <button
              type="button"
              aria-label="المزيد"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((p) => !p)}
              className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Ellipsis size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Unsave post" : "Save post"}
                </button>

                {isPostOwner && (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowEditPost(true);
                      }}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit post
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowDelete(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={15} />
                      Delete post
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {showEditPost ? (
          <div className="mt-3">
            <EditPost
              postId={post._id}
              setShowEditPost={setShowEditPost}
              getPosts={getPosts}
            />
          </div>
        ) : (
          post.body && (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-start">
              {post.body}
            </p>
          )
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="max-h-[620px] overflow-hidden border-y border-slate-200">
          <img alt="post" className="w-full object-cover" src={post.image} />
        </div>
      )}

      {/* Counters */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-2 pt-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
            <ThumbsUp size={12} />
          </span>
          <span className="font-semibold">{likesCount} likes</span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1">
            <Repeat2 size={13} /> {post.sharesCount ?? 0} shares
          </span>
          <span>{commentsCount} comments</span>
        </div>
      </div>

      <div className="mx-4 border-t border-slate-200" />

      {/* Actions */}
      <div className="grid grid-cols-4 items-center gap-1 p-1">
        <button
          type="button"
          onClick={() => setLiked((p) => !p)}
          className={`flex items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold transition-colors hover:bg-slate-100 ${
            liked ? "text-[#1877f2]" : "text-slate-600"
          }`}
        >
          <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} />
          {liked ? "Liked" : "Like"}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((p) => !p)}
          className="flex items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          <MessageCircle size={18} /> Comment
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          <Share2 size={18} /> Share
        </button>
        <Link
          to={`/postDetails/${post._id}`}
          className="flex items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          View Details
        </Link>
      </div>

      {/* Comments */}
      {showComments && (
        <>
          {commentsCount > 0 && (
            <>
              {allComments.slice(0, visibleComments).map((comment) => {
                const isCommentOwner =
                  !!userDetails?._id &&
                  comment.commentCreator?._id === userDetails._id;

                const canOpenMenu = isCommentOwner || isPostOwner;

                return (
                  <div
                    key={comment._id}
                    className="space-y-3 border-t border-slate-200 px-4 py-3"
                  >
                    <div className="flex items-start gap-2">
                      <img
                        alt={comment.commentCreator?.name || "User"}
                        src={comment.commentCreator?.photo || DEFAULT_AVATAR}
                        className="h-8 w-8 rounded-full object-cover"
                      />

                      <div className="relative flex items-start gap-1">
                        <div className="rounded-2xl bg-slate-100 px-3 py-2">
                          <p className="text-xs font-bold">
                            {comment.commentCreator?.name || "User"}
                          </p>
                          <p className="text-sm text-slate-700">
                            {comment.content ?? (comment as any).text}
                          </p>
                          {comment.image && (
                            <img
                              alt="comment image"
                              src={comment.image}
                              className="mt-2 max-h-48 rounded-lg object-cover"
                            />
                          )}
                        </div>

                        {/* Comment menu */}
                        {canOpenMenu && (
                          <div
                            className="relative"
                            ref={(el) => {
                              commentMenuRefs.current[comment._id] = el;
                            }}
                          >
                            <button
                              type="button"
                              aria-label="المزيد"
                              aria-expanded={openCommentMenuId === comment._id}
                              onClick={() =>
                                setOpenCommentMenuId((id) =>
                                  id === comment._id ? null : comment._id,
                                )
                              }
                              className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Ellipsis size={16} />
                            </button>

                            {openCommentMenuId === comment._id && (
                              <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                {isCommentOwner && (
                                  <button
                                    type="button"
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                  >
                                    <Pencil size={13} />
                                    Edit
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setOpenCommentMenuId(null)}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 size={13} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {(hasMoreComments || isExpanded) && (
                <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-3">
                  {hasMoreComments && (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleComments((v) => v + INITIAL_VISIBLE_COMMENTS)
                      }
                      className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                      Show more comments
                      <ChevronDown size={16} />
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleComments(INITIAL_VISIBLE_COMMENTS)
                      }
                      className="text-xs font-bold text-slate-500 hover:underline"
                    >
                      Hide comments
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          <div className="px-4 py-3">
            <PostComment postId={post._id} getComments={getComments} />
          </div>
        </>
      )}

      <AlertDialog>
        <AlertDialog.Backdrop isOpen={showDelete} onOpenChange={setShowDelete}>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>
                  Delete post permanently?
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  This will permanently delete this post. This action cannot be
                  undone.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  slot="close"
                  variant="tertiary"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  isDisabled={isDeleting}
                  onClick={deleteMyPost}
                >
                  {isDeleting ? "Deleting..." : "Delete Post"}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </article>
  );
}
