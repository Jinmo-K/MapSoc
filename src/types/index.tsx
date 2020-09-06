import { NodeObject, LinkObject, GraphData } from "react-force-graph-2d";

export interface IUser {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
}

export interface Graph extends GraphData {
  id?: number;
  nodeSequence?: number;
  nodes: GraphNode[];
  links: GraphLink[];
  linkSequence?: number;
  settings?: IGraphSettings;
}

export interface IGraphSettings {
  defaultLinkColor: string;
  defaultLinkWidth: number;
  defaultNodeColor: string;
  defaultNodeSize: number;
}

/* ---------------------------------- Nodes --------------------------------- */

export interface GraphNode extends NodeObject {
  groups?: string[];
  isGroup?: boolean;
  name?: string;
  label?: string;
  neighbours?: Set<string | number>;
  color?: string;
  val?: number;
  type?: 'node';
  notes?: string;
  icon?: undefined;
}

/* ---------------------------------- Links --------------------------------- */

export interface GraphLink extends LinkObject {
  id?: number;
  width?: number;
  color?: string;
  type?: 'link';
  notes?: string;  
  arrowToSource?: boolean;
  arrowToTarget?: boolean;
}
