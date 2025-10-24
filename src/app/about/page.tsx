import { AboutUsScreen } from "@/screens/about-screen";

/**
 * About Page - Route wrapper cho AboutUsScreen
 *
 * Theo quy tắc AGENT.md:
 * - File /app/page.tsx nên là wrapper mỏng xung quanh screens
 * - Separation này giúp dễ test và có thể migrate framework
 */
export default function AboutPage() {
  return <AboutUsScreen />;
}
