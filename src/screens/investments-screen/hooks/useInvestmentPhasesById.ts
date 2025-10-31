import { useState, useEffect } from "react";
import { ApiService } from "@/api/api";
import type { Phase } from "@/api/services/phase-service";

export const useInvestmentPhasesById = (id: string) => {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        setLoading(true);

        // Tam thoi dung getPhases() vi getPhaseById() dang tra ve sai format
        // TODO: Chuyen sang getPhaseById() khi backend da fix
        const response = await ApiService.getPhases();

        if (response.success && response.data && response.data.phases) {
          // Filter ra phase co phaseId khop voi id
          const foundPhase = response.data.phases.find(
            (p: Phase) => p.phaseId === Number(id)
          );

          if (foundPhase) {
            setPhase(foundPhase);
            setError(null);
          } else {
            setError("Khong tim thay phase voi ID nay");
          }
        } else {
          setError(response.error || response.message || "Khong lay duoc du lieu");
        }
      } catch (err) {
        setError("Loi ket noi den server");
        console.error("Error fetching phase by id:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPhase();
    }
  }, [id]);

  return { phase, loading, error };
};
