import { useEffect, useState } from "react";
import { PhaseService, type Phase } from "@/api/services/phase-service";

export const useInvestmentPhases = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const res = await PhaseService.getPhases();
      if (!isMounted) return;
      const phasesData = (res as any)?.data?.phases as Phase[];
      if (res.success && Array.isArray(phasesData)) {
        // sort phases by startDate
        setPhases(phasesData.sort((a: Phase, b: Phase) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
      } else {
        setError(res.error || "Failed to load phases");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { phases, isLoading, error };
};
