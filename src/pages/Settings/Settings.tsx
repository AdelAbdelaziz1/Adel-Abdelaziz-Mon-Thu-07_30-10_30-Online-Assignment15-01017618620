import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { KeyRound } from "lucide-react";
import { changePassword } from "../../services/settings.services";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

type FormKey = keyof typeof initialForm;

const inputClass =
  "w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white";

export default function Settings() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  }

  function validate() {
    const next: Partial<Record<FormKey, string>> = {};

    if (!form.currentPassword) {
      next.currentPassword = "Current password is required.";
    }

    if (!form.newPassword) {
      next.newPassword = "New password is required.";
    } else if (!PASSWORD_REGEX.test(form.newPassword)) {
      next.newPassword =
        "Must be 8+ characters with uppercase, lowercase, number, and special character.";
    } else if (form.newPassword === form.currentPassword) {
      next.newPassword = "New password must be different from the current one.";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your new password.";
    } else if (form.confirmPassword !== form.newPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await changePassword({
        password: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(res.data?.message ?? "Password updated successfully");
      setForm(initialForm);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ??
          error.response?.data?.error ??
          "Something went wrong. Please try again.")
        : "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEmpty =
    !form.currentPassword || !form.newPassword || !form.confirmPassword;

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <div className="mx-auto max-w-2xl">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                <KeyRound size={18} aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  Change Password
                </h1>
                <p className="text-sm text-slate-500">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Current password
                </span>
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    errors.currentPassword
                      ? "border-rose-300"
                      : "border-slate-200"
                  }`}
                />
                {errors.currentPassword && (
                  <span className="mt-1 block text-xs font-semibold text-rose-600">
                    {errors.currentPassword}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  New password
                </span>
                <input
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    errors.newPassword ? "border-rose-300" : "border-slate-200"
                  }`}
                />
                {errors.newPassword ? (
                  <span className="mt-1 block text-xs font-semibold text-rose-600">
                    {errors.newPassword}
                  </span>
                ) : (
                  <span className="mt-1 block text-xs text-slate-500">
                    At least 8 characters with uppercase, lowercase, number, and
                    special character.
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Confirm new password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    errors.confirmPassword
                      ? "border-rose-300"
                      : "border-slate-200"
                  }`}
                />
                {errors.confirmPassword && (
                  <span className="mt-1 block text-xs font-semibold text-rose-600">
                    {errors.confirmPassword}
                  </span>
                )}
              </label>

              {serverError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isEmpty}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
