import axios from 'axios';
import { graphConstants } from '../constants';
import { Graph, GraphNode, GraphLink } from '../types';

export const graphService = {
  addNode,
  deleteNode,
  updateNode,
  addLink,
  deleteLink,
  updateLink,
  deleteGraph,
  getGraph,
  updateGraph
};

/* ---------------------------------- Nodes --------------------------------- */

const getGraphNodesEndpoint = (graphId: string) => graphConstants.GRAPHS_ENDPOINT + graphId + '/nodes/';

/**
 * Add a single node to a graph
 * @param graphId   The id of the graph
 * @param nodeData  The values of the node being added
 */
function addNode(graphId: string, nodeData: GraphNode) {
  return axios.post(getGraphNodesEndpoint(graphId), nodeData);
}

/**
 * Delete a single node from a graph
 * @param graphId The id of the graph 
 * @param node  The node being removed
 */
function deleteNode(graphId: string, node: GraphNode) {
  return axios.delete(getGraphNodesEndpoint(graphId) + node.id);
}

/**
 * Update the values of a single node of a graph
 * @param graphId   The id of the graph  
 * @param nodeData  The updated values of the node
 */
function updateNode(graphId: string, nodeData: GraphNode) {
  return axios.put(getGraphNodesEndpoint(graphId) + nodeData.id, nodeData);
}


/* ---------------------------------- Links --------------------------------- */

const getGraphLinksEndpoint = (graphId: string) => graphConstants.GRAPHS_ENDPOINT + graphId + '/links/';

function addLink(graphId: string, link: GraphLink) {
  return axios.post(getGraphLinksEndpoint(graphId), link);
}

function deleteLink(graphId: string, link: GraphLink) {
  return axios.delete(getGraphLinksEndpoint(graphId) + link.id);
}

function updateLink(graphId: string, linkData: GraphLink) {
  return axios.put(getGraphLinksEndpoint(graphId), linkData);
}


/* ---------------------------------- Graph --------------------------------- */

/**
 * Delete a user's graph
 * @param id The id of the graph
 */
function deleteGraph(id: string) {
  return axios.delete(graphConstants.GRAPHS_ENDPOINT + id);  
}

/**
 * Retrieves a user's graph
 * @param id The id of the graph
 */
function getGraph(id: string) {
  return axios.get(graphConstants.GRAPHS_ENDPOINT + id);
}

/**
 * Update the values of a graph
 * @param data  The updated data 
 */
function updateGraph(data: Graph) {
  return axios.put(graphConstants.GRAPHS_ENDPOINT + data.id, data);
}


