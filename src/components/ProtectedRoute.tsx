import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  userRole: string | null | undefined;
  allowedRoles: string[];
  children: ReactNode;
};

export default function ProtectedRoute({
  userRole,
  allowedRoles,
  children,
}: Props) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
