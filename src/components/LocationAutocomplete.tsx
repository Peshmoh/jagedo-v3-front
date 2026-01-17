// src/components/LocationAutocomplete.tsx

import * as React from "react"; // Make sure to import the full React object
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { kenyanLocations } from "@/data/kenyaLocations";

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
}

export function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback((currentValue: string) => {
    const formattedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);
    onChange(formattedValue.toLowerCase() === value.toLowerCase() ? "" : formattedValue);
    setOpen(false);
  }, [value, onChange]); // Dependencies: it recreates only if value or onChange changes.

  const locationItems = React.useMemo(() => {
    return kenyanLocations.map((location) => (
      <CommandGroup 
        key={location.county} 
        heading={location.county}
        className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500"
      >
        <CommandItem
          key={location.county}
          value={location.county}
          onSelect={handleSelect}
        >
          <Check
            className={cn("mr-2 h-4 w-4", value.toLowerCase() === location.county.toLowerCase() ? "opacity-100" : "opacity-0")}
          />
          {location.county}
        </CommandItem>
        {location.sub_counties.map((subCounty) => {
          const fullLocationName = `${subCounty}, ${location.county}`;
          return (
            <CommandItem
              key={fullLocationName}
              value={fullLocationName}
              onSelect={handleSelect}
            >
              <Check
                className={cn("mr-2 h-4 w-4", value.toLowerCase() === fullLocationName.toLowerCase() ? "opacity-100" : "opacity-0")}
              />
              {fullLocationName}
            </CommandItem>
          );
        })}
      </CommandGroup>
    ));
  }, [value, handleSelect]); // Dependencies: The list only re-renders when these change.

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-gray-200 text-gray-700 font-normal hover:bg-white"
        >
          {value ? value : "Select a location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-gray-50">
        <Command>
          <CommandInput placeholder="Search county or sub-county..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            {locationItems}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}