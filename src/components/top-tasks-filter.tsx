'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';

export function TopTasksFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const top = searchParams.get('top') || 'all';

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('top');
    } else {
      params.set('top', value);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="top-filter" className="text-sm font-medium">
        Show:
      </Label>
      <Select value={top} onValueChange={handleValueChange}>
        <SelectTrigger id="top-filter" className="w-[120px]">
          <SelectValue placeholder="Filter tasks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="5">Top 5</SelectItem>
          <SelectItem value="10">Top 10</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
