import React, { useRef, useEffect, useState, useCallback } from 'react';

import './RangeSlider.css';

interface IRangeSliderProps {
  color?: string;
  id: string;
  label: string;
  min: number;
  max: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  value: string;
}

export const RangeSlider: React.FC<IRangeSliderProps> = ({ color='white', id, label, max, min, onChange, onMouseUp=()=>{}, value }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [knobX, setKnobX] = useState(0);

  useEffect(() => {
    let step = (inputRef.current!.getBoundingClientRect().width - 15) / (max - min);
    let x = step * parseInt(value) - step + 2.5;
    setKnobX(x);
  }, [value]);

  return (
    <div className='range-slider'>
      <div className='custom-slider-wrapper'>
        <div className='custom-slider-range' />
        <div 
          className='custom-slider-knob' 
          style={{
            background: color, 
            left: knobX, 
            opacity: inputRef.current ? '100%' : '0', 
            transform: inputRef.current ? 'scale(1)' : 'scale(0)'
          }} 
        />
      </div>
      <label className='sr-only' htmlFor={id} style={{textTransform: 'uppercase'}}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        className='input-slider'
        type='range'
        min={min}
        max={max}
        onChange={onChange}
        onMouseUp={onMouseUp}
        value={value}
      />
    </div>
  )
};
