import { useEffect, useState } from 'react';
import { DEFAULT_FILTER, normalisasiFilter } from './reportData';
import { FilterContext } from './useReportFilters';

function dariUrl() {
  if (typeof window === 'undefined') return DEFAULT_FILTER;
  const params = new URLSearchParams(window.location.search);
  return normalisasiFilter(Object.fromEntries(Object.keys(DEFAULT_FILTER).map((key) => [key, params.get(key)])));
}

export function ReportFilterProvider({ children }) {
  const [filter, setFilter] = useState(dariUrl);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(filter).forEach(([key, value]) => params.set(key, value));
    window.history.replaceState(null, '', `${window.location.pathname}?${params}${window.location.hash}`);
  }, [filter]);
  useEffect(() => {
    const sync = () => setFilter(dariUrl());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return <FilterContext.Provider value={{ filter, setFilter }}>{children}</FilterContext.Provider>;
}
