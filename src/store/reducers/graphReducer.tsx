import { Graph, GraphLink, GraphNode } from '../../types';
import { GraphAction } from '../actions';
import { graphConstants } from '../../constants';


interface GraphState {
  data: Graph;
  idToLink: Record<string, GraphLink>;
  idToNode: Record<string, GraphNode>;
  isLoading: boolean;
  isUpdating: boolean;
  neighbours: Record<string, Set<GraphNode>>;
}

const initialState: GraphState = {
  data: {
    nodes: [],
    links: [],
    linkSequence: 0,
    nodeSequence: 0,
  },
  idToLink: {},
  idToNode: {},
  isLoading: false,
  isUpdating: false,
  neighbours: {},
};

// *Some state must be mutated (eg. nodes and links), which is a consequence of using d3
export default (state = initialState, action: GraphAction): GraphState => {
  let nextState = {...state, data: {...state.data}};

  switch(action.type) {

    case graphConstants.ADD_LINK:
      nextState.data = {
        ...state.data,
        links: [...state.data.links, action.link]
      }
      // Add each node to the other's neighbours list
      let [nodeA, nodeB] = nextState.data.nodes.filter(node => node.id === action.link.source || node.id === action.link.target);
      nextState.neighbours![nodeA.id!].add(nodeB);
      nextState.neighbours![nodeB.id!].add(nodeA);
      // If they are both group nodes, only update the target as it is the sub-group
      if (nodeA.isGroup && nodeB.isGroup) {
        let targetNode = nodeA.id === action.link.target ? nodeA : nodeB;
        targetNode.groups!.push(nodeA.id === action.link.source ? nodeA.id as string: nodeB.id as string);
      }
      else {
        if (nodeA.isGroup) nodeB.groups!.push(nodeA.id as string);
        else if (nodeB.isGroup) nodeA.groups!.push(nodeB.id as string);
      }
      // Add the new link to the index
      nextState.idToLink[action.link.id!] = action.link;
      nextState.data.linkSequence!++;
      return nextState;

    case graphConstants.ADD_NODE:
      return {
        ...state,
        data: {
          ...state.data,
          nodes: [...state.data.nodes, action.node],
          nodeSequence: state.data.nodeSequence! + 1,
        },
        idToNode: {...state.idToNode, [action.node.id!]: action.node},
        neighbours: {...state.neighbours, [action.node.id!]: new Set<GraphNode>()}
      };

    case graphConstants.DELETE_LINK:
      let toDeleteLink = action.link;
      let source = toDeleteLink.source as GraphNode;
      let target = toDeleteLink.target as GraphNode;
      // Remove the link
      nextState.data.links = state.data.links.filter(l => l !== toDeleteLink);
      // Remove each node from the other's groups 
      source.groups = source.groups!.filter(id => id !== target.id);
      target.groups = target.groups!.filter(id => id !== source.id);
      // Update the adjacency list
      nextState.neighbours[target.id!].delete(source);
      nextState.neighbours[source.id!].delete(target);
      return nextState;
      

    case graphConstants.DELETE_NODE:
      let toDeleteNode = action.node;
      // Delete the node from the nodes list
      nextState.data.nodes = state.data.nodes.filter(n => n !== toDeleteNode);
      // Go through its neighbours, removing it from their groups and neighbours list
      let neighbours = state.neighbours![toDeleteNode.id!];
      neighbours.forEach(neighbour => {
        nextState.neighbours![neighbour.id!].delete(toDeleteNode);
        neighbour.groups = neighbour.groups!.filter(groupId => groupId !== toDeleteNode.id);
      });
      // Delete all links involving the node
      nextState.data.links = state.data.links.filter(link => link.source !== toDeleteNode && link.target !== toDeleteNode);
      // Delete its index
      delete nextState.idToNode[toDeleteNode.id!];
      return nextState;

    case graphConstants.GET_GRAPH_BEGIN:
      return {
        ...state,
        isLoading: true
      };
    
    case graphConstants.GET_GRAPH_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    
    case graphConstants.GET_GRAPH_SUCCESS:
      nextState.data = {...action.graph}
      // Create the node index and initialize adjacency list
      for (let node of nextState.data.nodes) {
        nextState.idToNode[node.id!] = node;
        nextState.neighbours[node.id!] = new Set<GraphNode>();
      }
      // Create the link index and adjacency list (currently all undirected links)
      for (let link of nextState.data.links) {
        nextState.idToLink[link.id!] = link;
        nextState.neighbours[link.source as string].add(nextState.idToNode[link.target as string]);  
        nextState.neighbours[link.target as string].add(nextState.idToNode[link.source as string]);
      }
      return {
        ...nextState,
        isLoading: true,
      };

    case graphConstants.UPDATE_GRAPH_BEGIN:
      return {
        ...state,
        isUpdating: true
      };

    case graphConstants.UPDATE_GRAPH_FAILURE:
      return {
        ...state,
        isUpdating: false
      };

    case graphConstants.UPDATE_GRAPH_SUCCESS:
      return {
        ...state,
        data: action.graph,
        isUpdating: false,
      };

    case graphConstants.UPDATE_LINK:
        // Find the link
        let toUpdateLink = nextState.data.links.find(l => l.source === action.link.source && l.target === action.link.target);
        Object.assign(toUpdateLink, action.link);
        return nextState;

    case graphConstants.UPDATE_NODE:
      let toUpdateNode = nextState.idToNode[action.node.id as string];
      // If isGroup changes, need to update neighbours 
      if (toUpdateNode.isGroup !== action.node.isGroup) {
        nextState.neighbours[toUpdateNode.id as string].forEach(neighbour => {
          // Node is now a group node, so add it to every non-group neighbour's group list
          if (action.node.isGroup && !neighbour.isGroup) {
            neighbour.groups!.push(action.node.id as string);
          }
          else { 
            neighbour.groups = neighbour.groups!.filter(id => id !== action.node.id);
          }
        });
      }
      // Update the node's values
      Object.assign(toUpdateNode, action.node);
      return nextState;

    default:
      return state;
  }
};
