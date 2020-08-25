import { AppThunk } from '../store';
import { GraphNode, Graph, GraphLink } from '../../types';
import { graphService } from '../../services';
import { graphConstants } from '../../constants';

import testdata from '../../test_data';

export {
  addLink,
  addNode,
  deleteLink,
  deleteNode,
  getGraph,
  loadTestGraph,
  saveLink,
  saveNode,
  updateGraph,
  updateLink,
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

interface IDeleteLinkAction {
  type: typeof graphConstants.DELETE_LINK;
  link: GraphLink;
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

interface ISaveLinkFailureAction {
  type: typeof graphConstants.SAVE_LINK_FAILURE;
  errors: Record<string, string>;
}

interface ISaveLinkSuccessAction {
  type: typeof graphConstants.SAVE_LINK_SUCCESS;
  link: GraphLink;
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

interface IUpdateLinkAction {
  type: typeof graphConstants.UPDATE_LINK;
  link: GraphLink;
}

interface IUpdateNodeAction {
  type: typeof graphConstants.UPDATE_NODE;
  node: GraphNode;
}


export type GraphAction = 
  IAddLinkAction |
  IAddNodeAction |
  IDeleteLinkAction | 
  IDeleteNodeAction | 
  IGetGraphBeginAction |
  IGetGraphFailureAction |
  IGetGraphSuccessAction |
  ISaveLinkFailureAction |
  ISaveLinkSuccessAction |
  ISaveNodeFailureAction | 
  ISaveNodeSuccessAction | 
  IUpdateGraphBeginAction |
  IUpdateGraphFailureAction |
  IUpdateGraphSuccessAction |
  IUpdateLinkAction |
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

const deleteLinkAction = (link: GraphLink): GraphAction => ({
  type: graphConstants.DELETE_LINK,
  link
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

const saveLinkFailure = (errors: Record<string, string>): GraphAction => ({
  type: graphConstants.SAVE_LINK_FAILURE,
  errors
});

const saveLinkSuccess = (link: GraphLink): GraphAction => ({
  type: graphConstants.SAVE_LINK_SUCCESS,
  link
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

const updateLinkAction = (link: GraphLink): GraphAction => ({
  type: graphConstants.UPDATE_LINK,
  link
});

const updateNodeAction = (node: GraphNode): GraphAction => ({
  type: graphConstants.UPDATE_NODE,
  node
});


/* --------------------------------- Thunks --------------------------------- */

const addLink = (graphId: number, link: GraphLink): AppThunk => (dispatch) => {
  dispatch(addLinkAction(link));
  graphService.addLink(graphId, link)
    .catch(console.log);
};

const addNode = (graphId: number, node: GraphNode): AppThunk => (dispatch) => {
  dispatch(addNodeAction(node));
  graphService.addNode(graphId, node)
    .catch(console.log);
};

const deleteLink = (graphId: number, link: GraphLink): AppThunk => (dispatch) => {
  dispatch(deleteLinkAction(link));
  graphService.deleteLink(graphId, link)
    .catch(console.log);
};

const deleteNode = (graphId: number, node: GraphNode): AppThunk => (dispatch) => {
  dispatch(deleteNodeAction(node));
  graphService.deleteNode(graphId, node)
    .catch(console.log);
};

const getGraph = (graphId: number): AppThunk => (dispatch) => {
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
  dispatch(getGraphSuccess(testdata as Graph))
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
 * Update the rendered link in state
 * @param link The link's updated values
 */
const updateLink = (link: GraphLink): AppThunk => (dispatch) => {
  dispatch(updateLinkAction(link));
}

/**
 * Update the rendered node in state
 * @param node  The node's updated values
 */
const updateNode = (node: GraphNode): AppThunk => (dispatch) => {
  dispatch(updateNodeAction(node));
}

const saveLink = (graphId: number, link: GraphLink): AppThunk => (dispatch) => {
  graphService.updateLink(graphId, link)
    .then(() => dispatch(saveLinkSuccess(link)))
    .catch(console.log);
}

/**
 * Update the node in the database
 * @param graphId The id of the graph
 * @param node    The node's updated values
 */
const saveNode = (graphId: number, node: GraphNode): AppThunk => (dispatch) => {
  // TODO: clean up node data
  graphService.updateNode(graphId, node)
    .then(() => dispatch(saveNodeSuccess(node)))
    .catch(console.log);
};