import React from "react";
import { Outlet } from "react-router";
import AuthIntro from "../component/AuthIntro/AuthIntro";

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        <AuthIntro />
        <Outlet />
      </div>
    </div>
  );
}
