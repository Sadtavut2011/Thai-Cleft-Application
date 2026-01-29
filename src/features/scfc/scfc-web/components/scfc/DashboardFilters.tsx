import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { Button } from "../../../../../components/ui/button";

export function DashboardFilters() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ค้นหาข้อมูล..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 h-10 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>This Month</span>
        </Button>
        <Button variant="outline" className="gap-2 h-10 text-slate-600">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>
    </div>
  );
}
