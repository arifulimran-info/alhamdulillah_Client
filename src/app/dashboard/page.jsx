"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { PageSkeleton } from "@/components/Skeletons";

export default function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => { if (user) router.replace(user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"); }, [user, router]);
  return <PageSkeleton />;
}
