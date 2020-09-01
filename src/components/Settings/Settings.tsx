import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Graph, IGraphSettings } from '../../types';

import { ColorPicker, RangeSlider } from '../../components';

import './Settings.css';

export interface ISettingsProps {
  graph: Graph;
  updateGraphSettings: (id: number, values: IGraphSettings) => void;
}

export const Settings: React.FC<ISettingsProps> = ({ graph, updateGraphSettings }) => {
  const [defaultNodeColor, setDefaultNodeColor] = useState(graph.settings!.defaultNodeColor);
  const [defaultNodeSize, setDefaultNodeSize] = useState(graph.settings!.defaultNodeSize.toString());
  const [defaultLinkColor, setDefaultLinkColor] = useState(graph.settings!.defaultLinkColor);
  const [defaultLinkWidth, setDefaultLinkWidth] = useState(graph.settings!.defaultLinkWidth.toString());
  const [windowSize, setWindowSize] = useState([0, 0]);
  const nodeCanvasRef = useRef<HTMLCanvasElement>(null);
  const linkCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let updatedValues: IGraphSettings = {
      defaultNodeColor,
      defaultNodeSize: parseInt(defaultNodeSize),
      defaultLinkColor,
      defaultLinkWidth: parseInt(defaultLinkWidth)
    };
    updateGraphSettings(graph.id!, updatedValues);
  };

  const hasNewValues = (): boolean => {
    let settings = graph.settings!;
    return (
      defaultNodeColor !== settings.defaultNodeColor ||
      parseInt(defaultNodeSize) !== settings.defaultNodeSize ||
      defaultLinkColor !== settings.defaultLinkColor ||
      parseInt(defaultLinkWidth) !== settings.defaultLinkWidth
    );
  };

  /**
   * Draws default node preview
   */
  useEffect(() => {
    if (nodeCanvasRef.current) {
      let cvs = nodeCanvasRef.current;
      cvs.width = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
      let ctx = cvs.getContext('2d')!;
      ctx.scale(2.2, 2.2);
      let x = cvs.width / 4.4;
      let y = cvs.height / 4.4;
       
      ctx.beginPath();
      ctx.arc(x, y, parseInt(defaultNodeSize), 0, 2 * Math.PI, false);
      ctx.fillStyle = defaultNodeColor;
      ctx.fill();
    }
  }, [defaultNodeColor, defaultNodeSize, nodeCanvasRef, windowSize]);

  /**
   * Draws default link preview
   */
  useEffect(() => {
    if (linkCanvasRef.current) {
      let cvs = linkCanvasRef.current;
      cvs.width = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
      let ctx = cvs.getContext('2d')!;
      ctx.scale(2.2, 2.2);
       
      ctx.beginPath();
      ctx.strokeStyle = defaultLinkColor;
      ctx.lineWidth = parseInt(defaultLinkWidth);
      ctx.moveTo(10, cvs.height / 2.2 - 10);
      ctx.lineTo(cvs.width / 2.2 - 10, 10);
      ctx.stroke();
      ctx.closePath();
    }
  }, [defaultLinkColor, defaultLinkWidth, linkCanvasRef, windowSize]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <section className='settings'>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Settings</h1>

        {/* Node settings */}
        <section id='node-settings'>
          <h2>Nodes</h2>
          <div className='form-col-wrapper'>
            <div className='icon-wrapper'>
              <canvas ref={nodeCanvasRef} id='node-icon-cvs' style={{width: '100%', height: '100%'}} />
            </div>
            <div className='node-settings-controls'>
              {/* Default node color */}
              <div className='form-group'>
                <div className='settings-label'>Default node color</div>
                <ColorPicker 
                  value={defaultNodeColor} 
                  onColorChange={(color: string) => setDefaultNodeColor(color)}
                  width='100%'
                  height='30px' 
                />
              </div>
              {/* Default node size */}
              <div className='form-group'>
                <div className='settings-label'>
                  <span>Default node size</span><span>{defaultNodeSize}</span>
                </div>
                <RangeSlider 
                  color={defaultNodeColor} 
                  id='defaultNodeSize' 
                  label='Default node size'
                  min={1} 
                  max={10}
                  onChange={(e) => setDefaultNodeSize(e.currentTarget.value.toString())}
                  value={defaultNodeSize} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Link settings */}
        <section id='link-settings'>
          <h2>Links</h2>
          <div className='form-col-wrapper'>
            <div className='icon-wrapper'>
              <canvas ref={linkCanvasRef} id='link-icon-cvs' style={{width: '100%', height: '100%'}} />
            </div>
            <div className='link-settings-controls'>
              {/* Default link color */}
              <div className='form-group'>
                <div className='settings-label'>Default link color</div>
                <ColorPicker 
                  value={defaultLinkColor} 
                  onColorChange={(color: string) => setDefaultLinkColor(color)} 
                  width='100%'
                  height='30px'
                />
              </div>
              {/* Default link size */}
              <div className='form-group'>
                <div className='settings-label'>
                  <span>Default link width</span><span>{defaultLinkWidth}</span>
                </div>
                <RangeSlider 
                  color={defaultLinkColor} 
                  id='defaultLinkWidth' 
                  label='Default link width'
                  min={1} 
                  max={10}
                  onChange={(e) => setDefaultLinkWidth(e.currentTarget.value.toString())}
                  value={defaultLinkWidth} 
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className='form-group form-group-submit'>
            <button 
              type='submit' 
              className='form-submit' 
              disabled={!hasNewValues()}
            >
              Update
            </button>
          </div>
        </section>
      </form>
    </section>
  );
};
