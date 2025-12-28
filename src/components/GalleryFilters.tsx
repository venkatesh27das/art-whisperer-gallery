import { CATEGORIES, SortOption, SORT_OPTIONS } from "@/types/painting";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface GalleryFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  showAvailableOnly: boolean;
  onAvailabilityChange: (show: boolean) => void;
  totalCount: number;
  filteredCount: number;
}

const GalleryFilters = ({
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
  showAvailableOnly,
  onAvailabilityChange,
  totalCount,
  filteredCount,
}: GalleryFiltersProps) => {
  const hasActiveFilters = selectedCategory || showAvailableOnly;

  const clearFilters = () => {
    onCategoryChange(null);
    onAvailabilityChange(false);
  };

  return (
    <div className="space-y-4">
      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-body text-sm text-muted-foreground">
            Showing {filteredCount} of {totalCount} paintings
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <Select value={sortOption} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-[180px] font-body">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-body">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Available Only Toggle */}
          <Button
            variant={showAvailableOnly ? "default" : "outline"}
            size="sm"
            onClick={() => onAvailabilityChange(!showAvailableOnly)}
            className="font-body"
          >
            Available Only
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="font-body text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="font-body rounded-full"
        >
          All
        </Button>
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="font-body rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GalleryFilters;
