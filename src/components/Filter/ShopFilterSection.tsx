"use client";

import * as React from "react";
import { Minus, Plus, SlidersHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import type { Category } from "@/Data/categories";

interface ShopFilterProps {
  categories: Category[];
  defaultExpanded?: string[];
  className?: string;

  selectedCategories: string[];
  selectedSubcategories: string[];

  onCategoryChange: (ids: string[]) => void;
  onSubcategoryChange: (ids: string[]) => void;
}

export function ShopFilter({
  categories,
  defaultExpanded,
  className,
  selectedCategories,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoryChange,
}: ShopFilterProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () =>
      new Set(
        defaultExpanded ?? categories.map((category) => category.id)
      )
  );

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const toggleCategory = (id: string) => {
    const next = selectedCategories.includes(id)
      ? selectedCategories.filter((categoryId) => categoryId !== id)
      : [...selectedCategories, id];

    onCategoryChange(next);
  };

  const toggleSubcategory = (id: string) => {
    const next = selectedSubcategories.includes(id)
      ? selectedSubcategories.filter(
          (subcategoryId) => subcategoryId !== id
        )
      : [...selectedSubcategories, id];

    onSubcategoryChange(next);
  };

  const handleReset = () => {
    onCategoryChange([]);
    onSubcategoryChange([]);
  };

  const isExpanded = (id: string) => expanded.has(id);

  const isCategorySelected = (id: string) =>
    selectedCategories.includes(id);

  const isSubcategorySelected = (id: string) =>
    selectedSubcategories.includes(id);

  const totalSelected =
    selectedCategories.length + selectedSubcategories.length;

  const filterPanel = (
    <div
      className={cn(
        "border border-gray-300 bg-gray-100",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 px-5 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-700">
          Filters
        </span>

        <button
          type="button"
          onClick={handleReset}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-70"
        >
          Reset
        </button>
      </div>

      {/* Category title */}
      <div className="border-b border-gray-300 px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Category
        </p>
      </div>

      {/* Categories */}
      <div className="divide-y divide-gray-300">
        {categories.map((category) => (
          <Collapsible
            key={category.id}
            open={isExpanded(category.id)}
            onOpenChange={() => toggleExpanded(category.id)}
          >
            <div className="px-5 py-4">
              {/* Main category */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor={category.id}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <Checkbox
                    id={category.id}
                    checked={isCategorySelected(category.id)}
                    onCheckedChange={() =>
                      toggleCategory(category.id)
                    }
                    className="border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                  />

                  <span className="text-sm font-medium tracking-wide text-foreground">
                    {category.name}
                  </span>
                </label>

                <CollapsibleTrigger
                  className="flex h-6 w-6 items-center justify-center border border-gray-300 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  aria-label={
                    isExpanded(category.id)
                      ? "Collapse"
                      : "Expand"
                  }
                >
                  {isExpanded(category.id) ? (
                    <Minus className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </CollapsibleTrigger>
              </div>

              {/* Subcategories */}
              <CollapsibleContent className="mt-3 space-y-2.5 overflow-hidden pl-7">
                {category.subcategories.map((subcategory) => (
                  <label
                    key={subcategory.id}
                    htmlFor={subcategory.id}
                    className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Checkbox
                      id={subcategory.id}
                      checked={isSubcategorySelected(
                        subcategory.id
                      )}
                      onCheckedChange={() =>
                        toggleSubcategory(subcategory.id)
                      }
                      className="border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                    />

                    <span className="select-none">
                      {subcategory.name}
                    </span>
                  </label>
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Desktop */}
      <aside className="hidden lg:block lg:w-80">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">
          {filterPanel}
        </div>
      </aside>

      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:border-primary/50 hover:text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />

            Filters

            {totalSelected > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] text-primary-foreground">
                {totalSelected}
              </span>
            )}
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[86%] max-w-[340px] bg-background p-0"
          >
            <div className="max-h-[calc(100vh-2rem)] overflow-y-auto py-4 pl-4 pr-2">
              {filterPanel}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}