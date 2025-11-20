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

        if (
          response.success &&
          response.data &&
          (response.data as any).phases
        ) {
          // Filter ra phase co phaseId khop voi id
          const foundPhase = (response.data as any).phases.find(
            (p: Phase) => p.phaseId === Number(id)
          );

          if (foundPhase) {
            setPhase(foundPhase);
            setError(null);
          } else {
            setError("Không tìm thấy phase id này ");
          }
        } else {
          setError(
            response.error || response.message || "Không lấy được dữ liệu "
          );
        }
      } catch (err) {
        setError("Loi ket noi den server");
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
