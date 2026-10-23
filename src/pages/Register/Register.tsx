import {
  FieldError,
  Input,
  ListBox,
  Select,
  Spinner,
  TextField,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import ToggelLoginRegister from "../../component/ToggelLoginRegister/ToggelLoginRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../../lib/Schemas/Auth.schema";
import { registerUser } from "../../services/auth.services";
import { useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: undefined,
      password: "",
      rePassword: "",
    },
  });

  async function submitData(values: RegisterSchemaType) {
    console.log(values);

    try {
      const response = await registerUser(values);
      console.log(response);
      navigate("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error registering user:", error.message);
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
          Create a new account
        </h2>
        <p className="mt-1 text-sm text-slate-500">It is quick and easy.</p>
        <form className="mt-5 space-y-3.5" onSubmit={handleSubmit(submitData)}>
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
                aria-label="Full name"
                isInvalid={Boolean(errors.name)}
              >
                <Input
                  {...register("name")}
                  aria-label="Full name"
                  placeholder="Full name"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                />
                <FieldError>{errors.name?.message}</FieldError>
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
                  className="lucide lucide-at-sign"
                  aria-hidden="true"
                >
                  <circle cx={12} cy={12} r={4} />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                </svg>
              </span>
              <TextField
                className="w-full"
                aria-label="Username"
                isInvalid={Boolean(errors.username)}
              >
                <Input
                  {...register("username")}
                  aria-label="Username"
                  placeholder="Username (optional)"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                />
                <FieldError>{errors.username?.message}</FieldError>
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
                  className="lucide lucide-at-sign"
                  aria-hidden="true"
                >
                  <circle cx={12} cy={12} r={4} />
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
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
                className="lucide lucide-users pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <circle cx={9} cy={7} r={4} />
              </svg>
              <TextField
                className="w-full"
                aria-label="Gender"
                isInvalid={Boolean(errors.gender)}
              >
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="relative w-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                          aria-hidden="true"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>

                        <Select
                          {...field}
                          aria-label="Gender"
                          placeholder="Select Gender"
                          className="w-full"
                        >
                          <Select.Trigger className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]">
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>

                          <Select.Popover className="rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                            <ListBox className="outline-none">
                              <ListBox.Item
                                id="male"
                                textValue="male"
                                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 focus:bg-slate-100"
                              >
                                Male
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item
                                id="female"
                                textValue="female"
                                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 focus:bg-slate-100"
                              >
                                Female
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    );
                  }}
                />
                <FieldError> {errors.gender?.message}</FieldError>
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
                  className="lucide lucide-calendar"
                  aria-hidden="true"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width={18} height={18} x={3} y={4} rx={2} />
                  <path d="M3 10h18" />
                </svg>
              </span>
              <TextField
                className="w-full"
                aria-label="Date of birth"
                isInvalid={Boolean(errors.dateOfBirth)}
              >
                <Input
                  {...register("dateOfBirth")}
                  aria-label="date"
                  placeholder="Date of birth"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="date"
                />
                <FieldError> {errors.dateOfBirth?.message}</FieldError>
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
                aria-label="Confirm Password"
                isInvalid={Boolean(errors.rePassword)}
              >
                <Input
                  {...register("rePassword")}
                  aria-label="Confirm Password"
                  placeholder="Confirm password"
                  className="w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white border-slate-200 focus:border-[#00298d]"
                  type="password"
                />
                <FieldError> {errors.rePassword?.message}</FieldError>
              </TextField>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b]"
          >
            {isSubmitting ? (
              <div className="flex gap-2">
                <Spinner className="text-white" />
                <p>Loadingg</p>
              </div>
            ) : (
              "Create New Account"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
