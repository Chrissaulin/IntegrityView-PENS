import { createContext, useContext } from 'react';

export const FilterContext = createContext(null);

export function useReportFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('ReportFilterProvider tidak tersedia');
  return context;
}
