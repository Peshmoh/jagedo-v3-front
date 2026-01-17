import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "hardware", label: "Hardware" },
  { id: "custom", label: "Custom Products" },
  { id: "equipment", label: "Hire Equipments & Machinery" },
  { id: "designs", label: "Designs" },
];

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className={cn(
      "flex flex-col w-full space-y-1 p-1 mt-2 rounded-lg bg-gray-100",
      "md:flex-row md:w-auto md:space-y-0 md:space-x-1"
    )}>
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "w-full justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
              isActive
                ? "bg-[#00007A] text-white shadow-sm"
                : "bg-transparent text-blue-600 hover:bg-blue-50",
              "md:w-auto md:flex-1"
            )}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;