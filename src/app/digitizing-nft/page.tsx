import { DigitizingNftScreen } from "@/screens/digitizing-nft-screen";

/**
 * Digitizing NFT Page - Route wrapper cho DigitizingNftScreen
 *
 * Theo quy tắc AGENT.md:
 * - File /app/page.tsx nên là wrapper mỏng xung quanh screens
 * - Separation này giúp dễ test và có thể migrate framework
 */
const DigitizingNftPage = () => {
  return <DigitizingNftScreen />;
};

export default DigitizingNftPage;
