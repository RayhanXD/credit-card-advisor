"use client";

import { useEffect, useState } from "react";
import { ensureCatalog, isCatalogReady, subscribeCatalog } from "@/lib/catalog";

export function useCatalogReady() {
  const [ready, setReady] = useState(isCatalogReady);

  useEffect(() => subscribeCatalog(() => setReady(isCatalogReady())), []);

  useEffect(() => {
    void ensureCatalog();
  }, []);

  return ready;
}
