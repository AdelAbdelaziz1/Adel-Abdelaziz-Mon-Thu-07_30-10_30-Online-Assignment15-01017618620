import { FieldError, Input, TextField } from "@heroui/react";
import { useForm } from "react-hook-form";
import ToggelLoginRegister from "../../component/ToggelLoginRegister/ToggelLoginRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchema,
  type LoginSchemaType,
} from "../../lib/Schemas/Auth.schema";
import { loginUser } from "../../services/auth.services";
import { useNavigate } from "react-router";
import { TokenContext } from "../../component/context/TokenContext";
import { useContext } from "react";
import { isAxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useContext(TokenContext)!;
  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<LoginSchemaType>
({
    mode: "all",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  
async function submitData(values: LoginSchemaType) {
  try {
    const response = await loginUser(values);
    localStorage.setItem("userToken", response.data.data.token);
    setToken(response.data.data.token);
    navigate("/feed", { replace: true });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.error("Too many attempts, please wait a few minutes.");
      } else {
        console.error("Login failed:", error.response?.data?.message ?? error.message);
      }
    }
  }
}

  return (
    <section className="order-1 w-full max-w-[430px] lg:order-2">
      <div className="rounded-2xl bg-white p-4 sm:p-6">
        <div className="mb-4 text-center lg:hidden">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
            Route Posts
          </h1>
          <p className="mt-1 text-base font-medium leading-snug text-slate-700">
            Connect with friends and the world around you on Route Posts.
          </p>
        </div>
        <ToggelLoginRegister />
        <h2 className="text-2xl font-extrabold text-slate-900">
          Log in to Route Posts
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Log in and continue your social journey.
        </p>
        <form
          noValidate
          className="mt-5 space-y-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(submitData)(e);
          }}
        >
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx={12} cy={7} r={4} />
                </svg>
              </span>
              <TextField
                className="w-full"
                aria-label="Email"
                isInvalid={Boolean(errors.email)}
              >
                <Input
                  {...register("email")}
                  type="email"
                  aria-label="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                />
                <FieldError> {errors.email?.message}</FieldError>
              </TextField>
            </div>
          </div>
          <div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-key-round"
                  aria-hidden="true"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              </span>
              <TextField
                className="w-full"
                aria-label="Password"
                isInvalid={Boolean(errors.password)}
              >
                <Input
                  {...register("password")}
                  aria-label="password"
                  placeholder="Password"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="password"
                />
                <FieldError> {errors.password?.message}</FieldError>
              </TextField>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b]"
          >
            Log In
          </button>
          <button
            type="button"
            className="mx-auto block text-sm font-semibold text-[#00298d] transition hover:underline"
          >
            Forgot password?
          </button>
        </form>
      </div>
    </section>
  );
}
