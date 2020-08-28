import React, { useState } from 'react';
import { Graph, IGraphSettings } from '../../types';

import { useInput } from '../../helpers/useInput';
import { ColorPicker } from '../../components';

import './Settings.css';

export interface ISettingsProps {
  graph: Graph;
  updateGraphSettings: (id: number, values: IGraphSettings) => void;
}

export const Settings: React.FC<ISettingsProps> = ({ graph, updateGraphSettings }) => {
  const [defaultNodeColor, setDefaultNodeColor] = useState(graph.settings!.defaultNodeColor);
  const {value: defaultNodeSize, bindProps: bindDefaultNodeSize} = useInput(graph.settings!.defaultNodeSize.toString());
  const [defaultLinkColor, setDefaultLinkColor] = useState(graph.settings!.defaultLinkColor);
  const {value: defaultLinkWidth, bindProps: bindDefaultLinkWidth} = useInput(graph.settings!.defaultLinkWidth.toString());

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

  return (
    <section className='settings'>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Settings</h1>

        {/* Node settings */}
        <section id='node-settings'>
          <h2>Nodes</h2>
          {/* Default node color */}
          <div className='form-group form-col-wrapper'>
            <label htmlFor='defaultNodeColor'>Default node color</label>
            <ColorPicker value={defaultNodeColor} onColorChange={(color: string) => setDefaultNodeColor(color)} />
          </div>
          {/* Default node size */}
          <div className='form-group form-col-wrapper'>
            <label htmlFor='defaultNodeColor'>Default node size</label>
            <input  
              type='number'
              id='defaultNodeSize'
              {...bindDefaultNodeSize}
            />
          </div>
        </section>

        {/* Link settings */}
        <section id='link-settings'>
          <h2>Links</h2>
          {/* Default link color */}
          <div className='form-group form-col-wrapper'>
            <label htmlFor='defaultLinkColor'>Default link color</label>
            <ColorPicker value={defaultLinkColor} onColorChange={(color: string) => setDefaultLinkColor(color)} />
          </div>
          {/* Default link size */}
          <div className='form-group form-col-wrapper'>
            <label htmlFor='defaultLinkWidth'>Default link width</label>
            <input  
              type='number'
              id='defaultLinkWidth'
              {...bindDefaultLinkWidth}
            />
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
