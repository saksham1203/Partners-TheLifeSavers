import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchPricingPackages,
  fetchPricingTests,
  LabType,
  PricingItem,
} from "../services/pricingService";

type ItemType = "test" | "package";
type CacheKey = `${LabType}_${ItemType}`;

export function usePartnerPricing(lab: LabType) {
  const [type, setType] = useState<ItemType>("test");
  const [items, setItems] = useState<PricingItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ memory cache
  const cacheRef = useRef<Partial<Record<CacheKey, PricingItem[]>>>({});

  const loadPricing = useCallback(
    async (force = false) => {
      const key = `${lab}_${type}` as CacheKey;

      // ✅ serve cached data
      if (!force && cacheRef.current[key]) {
        setItems(cacheRef.current[key]!);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data =
          type === "test"
            ? await fetchPricingTests(lab)
            : await fetchPricingPackages(lab);

        // ✅ keep backend order exactly
        cacheRef.current[key] = data;
        setItems(data);
      } catch {
        setError("Failed to load pricing");
      } finally {
        setLoading(false);
      }
    },
    [lab, type]
  );

  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  /**
   * ✅ FILTER ONLY (NO SORTING)
   * preserves API order
   */
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    return items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  return {
    type,
    setType,
    items: filteredItems,
    loading,
    error,
    search,
    setSearch,
    reload: () => loadPricing(true),
  };
}