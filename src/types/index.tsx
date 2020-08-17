import { NodeObject, LinkObject } from "react-force-graph-2d";

export interface IUser {
  id?: string | number;
  name?: string;
  email?: string;
  password?: string;
}

/* ---------------------------------- Nodes --------------------------------- */

export interface GraphNode extends NodeObject {
  groups?: string[];
  isGroup?: boolean;
  name?: string;
  label?: string;
  neighbours?: Set<string | number>;
  style?: GraphNodeStyle;
  notes?: string;
}

export interface GraphNodeStyle {
  color?: string;
  size?: number;
  icon?: undefined; // todo
}

/* ---------------------------------- Links --------------------------------- */

export interface GraphLink extends LinkObject {
  style?: GraphLinkStyle;
  notes?: string;  
}

export interface GraphLinkStyle {
  color?: string;
  width?: number;
  arrowToSource?: boolean;
  arrowToTarget?: boolean;
}