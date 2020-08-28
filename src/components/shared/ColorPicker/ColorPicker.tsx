import React, { useState, useEffect, useCallback, useRef } from 'react';

import './ColorPicker.css';

const paletteColumns = [
  // Grays
  ['#D4DAE4', '#B0B8CD', '#949DB1', '#727A8C', '#5E6677', '#3F4757', '#1D2534'],
  // Reds
  ['#FFCDD2', '#FE9998', '#F35C4E', '#E94633', '#D73C2D', '#CA3626', '#BB2B1A'],
  // Yellows
  ['#F9E6AD', '#F4D679', '#EDB90F', '#EAA100', '#EA8F00', '#EA7E00', '#EA5D00'],
  // Greens
  ['#BCE4CE', '#90D2AF', '#33B579', '#36955F', '#247346', '#1D5B38', '#17492D'],
  ['#BDF0E9', '#92E7DC', '#02D7C5', '#11B3A5', '#018B80', '#026B60', '#024F43'],
  // Blues
  ['#B3E5FC', '#81D4FA', '#29B6F6', '#039BE5', '#0288D1', '#0277BD', '#01579B'],
  ['#AEC1FF', '#88A3F9', '#5874CD', '#2349AE', '#163FA2', '#083596', '#002381'],
  // Purples
  ['#C5C0DA', '#9F97C1', '#7E6BAD', '#584A8F', '#4F4083', '#473776', '#3A265F'],
  ['#D6BDCC', '#C492AC', '#A9537C', '#963A64', '#81355A', '#6E3051', '#4C2640'],
  // Browns
  ['#D2C5C1', '#B4A09A', '#826358', '#624339', '#5D4037', '#4E342E', '#3E2723'],
];
const paletteRow = ['#FFFFFF', '#F2F2F2', '#E6E6E6', '#CCCCCC', '#B3B3B3', '#999999', '#808080', '#666666', '#4C4C4C', '#000000'];

interface IColorPickerProps {
  value: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker: React.FC<IColorPickerProps> = ({ value, onColorChange }) => {
  const [currentColor, setCurrentColor] = useState(value);
  const [showPalette, setShowPalette] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  const handleCellClick = (color: string) => {
    onColorChange(color);
    setShowPalette(false);
  }

  const renderCells = (colors: string[]) => {
    return colors.map(color => (
      <div 
        className={currentColor === color ? 'color-picker-palette-cell color-picker-palette-cell-selected' : 'color-picker-palette-cell'} 
        style={{background: color}} 
        onClick={() => handleCellClick(color)}
        key={color}
      />
    ));
  };

  /**
   * Closes the color picker if user clicks outside of it
   */
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!(e.target as HTMLElement).className.includes('color-picker-')) {
      setShowPalette(false);
    }
  }, []);

  const togglePalette = () => {
    setShowPalette(!showPalette);
  };

  useEffect(() => {
    showPalette ? document.addEventListener('click', handleClickOutside) : document.removeEventListener('click', handleClickOutside);
  }, [showPalette, handleClickOutside]);

  useEffect(() => {
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    setCurrentColor(value);
  }, [value]);

  return (
    <div className='color-picker'>
      <div className='color-picker-selector' onClick={togglePalette}>
        <div className='color-picker-selector-current' style={{background: currentColor}} />
      </div>
      {
        (showPalette) 
        &&  <div ref={paletteRef} className='color-picker-palette'>
              <div className='color-picker-default-palette'>
                {
                  paletteColumns.map(column => (
                    <div key={column[0]} className='color-picker-palette-col'>
                      { renderCells(column) }
                    </div>
                  ))
                }
                <div className='color-picker-palette-row'>
                  { renderCells(paletteRow) }
                </div>
              </div>
            </div>
      }
    </div>
  )
};
