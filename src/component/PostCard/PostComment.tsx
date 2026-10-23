import { ImagePlus, Send, X } from "lucide-react";
import { useState } from "react";
import { createPostComment } from "../../services/comments.services";
import { toast } from "react-hot-toast/headless";

function PostComment({
  postId,
  getComments,
}: {
  postId: string | undefined;
  getComments: (postId: string) => void;
}) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postId) return;

    const text = content.trim();

    if (!text && !image) return;

    const formData = new FormData();
    if (text) formData.append("content", text);
    if (image) formData.append("image", image);

    try {
      const { data } = await createPostComment(postId, formData);
      toast.success(data.message || "Comment created successfully!");
      getComments(postId);
      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (error: any) {
      console.log("server says:", error.response?.data);
    }
  }

  const formData = new FormData();
  formData.append("content", content);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function clearPreview() {
    setImagePreview(null);
  }

  return (
    <>
      <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2.5">
          <img
            alt="Your profile"
            className="size-8 shrink-0 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&h=96&q=80"
          />
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-gray-100 pr-1.5 focus-within:ring-2 focus-within:ring-blue-200">
            <span className="sr-only">Write a comment</span>
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500"
              id="post-details-comment"
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
              <span className="sr-only">Add an image</span>
              <input
                accept="image/*"
                className="sr-only"
                type="file"
                onChange={handleImageChange}
              />
              <ImagePlus size={16} />
            </label>
            <button
              aria-label="Post comment"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
              type="submit"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>
      <div className="mt-4 flex flex-col gap-2.5">
        {imagePreview && (
          <>
            <div className="flex items-center gap-2.5 relative bg-amber-400/20 px-4 py-2.5 text-sm text-gray-900">
              <X
                className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 cursor-pointer"
                onClick={clearPreview}
              />
              <img
                alt="Your profile"
                className="size-8 shrink-0 rounded-full object-cover"
                src={imagePreview}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PostComment;
