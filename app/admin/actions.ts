"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ALLOWED_EMAILS = ["ogededora1@gmail.com", "heylelyaka@gmail.com"];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { message: "Please enter both email and password." };
  }

  if (!ALLOWED_EMAILS.includes(email)) {
    return { message: "Access denied: Email not authorized." };
  }

  if (password !== ADMIN_PASSWORD) {
    return { message: "Invalid password." };
  }

  // Set cookie
  cookies().set("admin_token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  redirect("/admin");
}

export async function logout() {
  cookies().delete("admin_token");
  redirect("/admin/login");
}
