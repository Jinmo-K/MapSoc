import { AppThunk } from '../store';
import { GraphNode, Graph, GraphLink } from '../../types';
import { graphService } from '../../services';
import { graphConstants } from '../../constants';

import testdata from '../../test_data';

export {
  addLink,
  addNode,
  deleteNode,
  getGraph,
  loadTestGraph,
  saveNode,
  updateGraph,
  updateNode,
}

/* ------------------------------ Action Types ------------------------------ */

interface IAddLinkAction {
  type: typeof graphConstants.ADD_LINK;
  link: GraphLink;
}

interface IAddNodeAction {
  type: typeof graphConstants.ADD_NODE;
  node: GraphNode;
}

interface IDeleteNodeAction {
  type: typeof graphConstants.DELETE_NODE;
  node: GraphNode;
}

interface IGetGraphBeginAction {
  type: typeof graphConstants.GET_GRAPH_BEGIN;
}

interface IGetGraphFailureAction {
  type: typeof graphConstants.GET_GRAPH_FAILURE;
  errors: Record<string, string>;
}

interface IGetGraphSuccessAction {
  type: typeof graphConstants.GET_GRAPH_SUCCESS;
  graph: Graph;
}

interface ISaveNodeFailureAction {
  type: typeof graphConstants.SAVE_NODE_FAILURE;
  errors: Record<string, string>;
}

interface ISaveNodeSuccessAction {
  type: typeof graphConstants.SAVE_NODE_SUCCESS;
  node: GraphNode;
}

interface IUpdateGraphBeginAction {
  type: typeof graphConstants.UPDATE_GRAPH_BEGIN;
}

interface IUpdateGraphFailureAction {
  type: typeof graphConstants.UPDATE_GRAPH_FAILURE;
  errors: Record<string, string>;
}

interface IUpdateGraphSuccessAction {
  type: typeof graphConstants.UPDATE_GRAPH_SUCCESS;
  graph: Graph;
}

interface IUpdateNodeAction {
  type: typeof graphConstants.UPDATE_NODE;
  node: GraphNode;
}


export type GraphAction = 
  IAddLinkAction |
  IAddNodeAction | 
  IDeleteNodeAction | 
  IGetGraphBeginAction |
  IGetGraphFailureAction |
  IGetGraphSuccessAction |
  ISaveNodeFailureAction | 
  ISaveNodeSuccessAction | 
  IUpdateGraphBeginAction |
  IUpdateGraphFailureAction |
  IUpdateGraphSuccessAction |
  IUpdateNodeAction
;


/* --------------------------------- Actions -------------------------------- */

const addLinkAction = (link: GraphLink): GraphAction => ({
  type: graphConstants.ADD_LINK,
  link
});

const addNodeAction = (node: GraphNode): GraphAction => ({
  type: graphConstants.ADD_NODE,
  node
});

const deleteNodeAction = (node: GraphNode): GraphAction => ({
  type: graphConstants.DELETE_NODE,
  node
});

const getGraphBegin = (): GraphAction => ({
  type: graphConstants.GET_GRAPH_BEGIN
});

const getGraphFailure = (errors: Record<string, string>): GraphAction => ({
  type: graphConstants.GET_GRAPH_FAILURE,
  errors
});

const getGraphSuccess = (graph: Graph): GraphAction => ({
  type: graphConstants.GET_GRAPH_SUCCESS,
  graph
});

const saveNodeFailure = (errors: Record<string, string>): GraphAction => ({
  type: graphConstants.SAVE_NODE_FAILURE,
  errors
});

const saveNodeSuccess = (node: GraphNode): GraphAction => ({
  type: graphConstants.SAVE_NODE_SUCCESS,
  node
});

const updateGraphBegin = (): GraphAction => ({
  type: graphConstants.UPDATE_GRAPH_BEGIN
});

const updateGraphFailure = (errors: Record<string, string>): GraphAction => ({
  type: graphConstants.UPDATE_GRAPH_FAILURE,
  errors
});

const updateGraphSuccess = (graph: Graph): GraphAction => ({
  type: graphConstants.UPDATE_GRAPH_SUCCESS,
  graph
});

const updateNodeAction = (node: GraphNode): GraphAction => ({
  type: graphConstants.UPDATE_NODE,
  node
});


/* --------------------------------- Thunks --------------------------------- */

const addLink = (graphId: string, link: GraphLink): AppThunk => (dispatch) => {
  dispatch(addLinkAction(link));
  graphService.addLink(graphId, link)
    .catch(console.log);
};

const addNode = (graphId: string, node: GraphNode): AppThunk => (dispatch) => {
  dispatch(addNodeAction(node));
  graphService.addNode(graphId, node)
    .catch(console.log);
};

const deleteNode = (graphId: string, node: GraphNode): AppThunk => (dispatch) => {
  dispatch(deleteNodeAction(node));
  graphService.deleteNode(graphId, node)
    .catch(console.log);
};

const getGraph = (graphId: string): AppThunk => (dispatch) => {
  dispatch(getGraphBegin());
  graphService.getGraph(graphId)
    .then(res => {
      dispatch(getGraphSuccess(res.data));
    })
    .catch(console.log);
};

/**
 * For testing only. Loads the test data
 */
const loadTestGraph = (): AppThunk => (dispatch) => {
  dispatch(getGraphSuccess(testdata))
}

const updateGraph = (data: Graph): AppThunk => (dispatch) => {
  dispatch(updateGraphBegin());
  graphService.updateGraph(data)
    .then(() => {
      dispatch(updateGraphSuccess(data));
    })
    .catch(console.log);
};

/**
 * Update the rendered node in state
 * @param node  The node's updated values
 */
const updateNode = (node: GraphNode): AppThunk => (dispatch) => {
  dispatch(updateNodeAction(node));
}

/**
 * Update the node in the database
 * @param graphId The id of the graph
 * @param node    The node's updated values
 */
const saveNode = (graphId: string, node: GraphNode): AppThunk => (dispatch) => {
  // TODO: clean up node data
  graphService.updateNode(graphId, node)
    .then(() => {
      dispatch(saveNodeSuccess(node));
    })
    .catch(console.log);
};