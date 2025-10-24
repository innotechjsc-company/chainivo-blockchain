import { NewsScreen } from "@/screens/news-screen";

/**
 * News Page - Route wrapper cho NewsScreen
 *
 * Theo quy tắc AGENT.md:
 * - File /app/page.tsx nên là wrapper mỏng xung quanh screens
 * - Separation này giúp dễ test và có thể migrate framework
 */
export default function NewsPage() {
  return <NewsScreen />;
}
