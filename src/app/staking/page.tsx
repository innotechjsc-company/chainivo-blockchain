"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/stores";
import { toast } from "sonner";
import { StakingScreen } from "../../screens/staking-screen";
import router from "next/router";

/**
 * Staking Page - Route wrapper cho StakingScreen
 *
 * Theo quy tắc AGENT.md:
 * - File /app/page.tsx nên là wrapper mỏng xung quanh screens
 * - Separation này giúp dễ test và có thể migrate framework
 */
export default function StakingPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return <StakingScreen />;
}
