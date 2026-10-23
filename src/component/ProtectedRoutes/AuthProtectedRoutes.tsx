import React, { useContext } from "react";
import { Navigate } from "react-router";
import { TokenContext } from "../context/TokenContext";

export default function AuthProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useContext(TokenContext)!;

  return token ? <Navigate to="/feed" replace /> : <>{children}</>;
}