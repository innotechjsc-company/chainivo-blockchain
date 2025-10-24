import { StakingScreen } from "../../screens/staking-screen";

/**
 * Staking Page - Route wrapper cho StakingScreen
 *
 * Theo quy tắc AGENT.md:
 * - File /app/page.tsx nên là wrapper mỏng xung quanh screens
 * - Separation này giúp dễ test và có thể migrate framework
 */
export default function StakingPage() {
  return <StakingScreen />;
}
