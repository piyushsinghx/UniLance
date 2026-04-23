import { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatDate';

const PriceSlider = ({ min = 0, max = 50000, initialMin = 0, initialMax = 50000, onChange }) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  useEffect(() => {
    setMinValue(initialMin);
    setMaxValue(initialMax);
  }, [initialMin, initialMax]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 100);
    setMinValue(value);
    onChange({ min: value, max: maxValue });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 100);
    setMaxValue(value);
    onChange({ min: minValue, max: value });
  };

  // Calculate percentages for track fill
  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="w-full px-2 pt-4 pb-2">
      <div className="relative h-1.5 bg-bg-card rounded-full mb-6">
        <div 
          className="absolute h-full bg-primary rounded-full pointer-events-none"
          style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
        ></div>
        
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={minValue} 
          onChange={handleMinChange}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer z-10"
        />
        
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={maxValue} 
          onChange={handleMaxChange}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer z-20"
        />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="px-3 py-1.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary text-center min-w-[80px]">
          {formatPrice(minValue)}
        </div>
        <span className="text-text-muted">-</span>
        <div className="px-3 py-1.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary text-center min-w-[80px]">
          {formatPrice(maxValue)}
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
