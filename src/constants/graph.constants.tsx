import { gray } from "d3";

const graphUrl = '/api/graphs/';

export const graphConstants = {
  DEFAULT_LINK_COLOR: '#A9A9A9',
  DEFAULT_LINK_WIDTH: 2,
  DEFAULT_NODE_COLOR: '#408ab8',
  DEFAULT_NODE_SIZE: 5,
  HIGHLIGHT_COLOR: 'rgba(255, 188, 71, 0.7)',
  HIGHLIGHT_NEIGHBOUR_COLOR: 'rgba(255, 188, 71, 0.3)',

  // API
  GRAPHS_ENDPOINT: graphUrl,

  // ACTIONS
  ADD_LINK: 'ADD_LINK',
  ADD_NODE: 'ADD_NODE',
  DELETE_LINK: 'DELETE_LINK',
  DELETE_NODE: 'DELETE_NODE',
  GET_GRAPH_BEGIN: 'GET_GRAPH_BEGIN',
  GET_GRAPH_FAILURE: 'GET_GRAPH_FAILURE',
  GET_GRAPH_SUCCESS: 'GET_GRAPH_SUCCESS',
  HANDLE_KEYBOARD_SHORTCUT: 'HANDLE_KEYBOARD_SHORTCUT',
  SAVE_LINK_FAILURE: 'SAVE_LINK_FAILURE',
  SAVE_LINK_SUCCESS: 'SAVE_LINK_SUCCESS',
  SAVE_NODE_FAILURE: 'SAVE_NODE_FAILURE',
  SAVE_NODE_SUCCESS: 'SAVE_NODE_SUCCESS',
  UPDATE_GRAPH_BEGIN: 'UPDATE_GRAPH_BEGIN',
  UPDATE_GRAPH_FAILURE: 'UPDATE_GRAPH_FAILURE',
  UPDATE_GRAPH_SUCCESS: 'UPDATE_GRAPH_SUCCESS',
  UPDATE_GRAPH_SETTINGS_FAILURE: 'UPDATE_GRAPH_SETTINGS_FAILURE',
  UPDATE_GRAPH_SETTINGS_SUCCESS: 'UPDATE_GRAPH_SETTINGS_SUCCESS',
  UPDATE_LINK: 'UPDATE_LINK',
  UPDATE_NODE: 'UPDATE_NODE',
} as const;