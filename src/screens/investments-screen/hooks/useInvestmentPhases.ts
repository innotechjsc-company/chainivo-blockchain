import { useState, useEffect } from "react";
import { ApiService } from "@/api/api";
import type { Phase } from "@/api/services/phase-service";

export const useInvestmentPhases = () => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getPhases();

        if (response.success && response.data && response.data.phases) {
          setPhases(response.data.phases);
          setError(null);
        } else {
          setError(response.error || response.message || "Khong lay duoc du lieu");
        }
      } catch (err) {
        setError("Loi ket noi den server");
        console.error("Error fetching phases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
  }, []);

  return { phases, loading, error };
};
