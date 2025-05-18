
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface YearRangeSliderProps {
  minYear: number;
  maxYear: number;
  onYearRangeChange: (minYear: number, maxYear: number) => void;
}

export const YearRangeSlider = ({
  minYear,
  maxYear,
  onYearRangeChange,
}: YearRangeSliderProps) => {
  const [range, setRange] = useState<[number, number]>([minYear, maxYear]);
  
  const handleChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    onYearRangeChange(newRange[0], newRange[1]);
  };
  
  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Proof Time Period</Label>
        <span className="text-sm">
          {formatYear(range[0])} - {formatYear(range[1])}
        </span>
      </div>
      <Slider 
        min={minYear} 
        max={maxYear} 
        step={100} 
        value={range}
        onValueChange={handleChange}
        className="py-2"
      />
    </div>
  );
};
