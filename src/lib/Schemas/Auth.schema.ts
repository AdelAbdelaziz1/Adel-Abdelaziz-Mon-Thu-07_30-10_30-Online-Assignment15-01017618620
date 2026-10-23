import * as z from "zod";

export const registerSchema = z.object({

  name: z.string().nonempty("Name is required").min(3, "Name must be at least 3 charas"),
  username: z.string().nonempty("Username is required").min(3, "Username must be at least 3 charas"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),

  dateOfBirth: z.string().nonempty("Date of birth is required").refine((value) => {
    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 18;
  }, {
    message: "You must be Older than 18 years old",
  }),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),

  password: z.string().min(8, "Password must be at least 8 characters"),
  rePassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});


export const LoginSchema = z.object({

  email: z.string().email("Invalid email address").nonempty("Email is required"),



  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export type LoginSchemaType = z.infer<typeof LoginSchema>;