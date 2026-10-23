import React, { useContext } from "react";
import { Navigate } from "react-router";
import { TokenContext } from "../context/TokenContext";

export default function AppProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useContext(TokenContext);

  return token ? <>{children}</> : <Navigate to="/auth/login" replace />;
}