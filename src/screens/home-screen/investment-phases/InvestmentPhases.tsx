"use client";

import { useInvestmentPhases } from "@/screens/investments-screen/hooks";
import { InvestmentPhasesCard } from "@/screens/investments-screen/components/InvestmentPhasesCard";

export const InvestmentPhases = () => {
  const { phases, error } = useInvestmentPhases();

  return (
    <InvestmentPhasesCard
      phases={phases}
      isLoading={false}
      error={error}
      gridColsClass="md:grid-cols-2 lg:grid-cols-4"
      showDetailsButton={false}
      activeButtonClassName="bg-gradient-to-r from-primary to-secondary text-foreground hover:opacity-90 shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
    />
  );
};
