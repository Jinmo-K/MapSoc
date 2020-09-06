import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { forceCollide } from 'd3';
import ForceGraph2D, { ForceGraphMethods, ForceGraphProps } from 'react-force-graph-2d';

import { addLink, addNode, deleteLink, deleteNode } from '../../../store/actions';

import { GraphNode, GraphLink } from '../../../types';
import { graphConstants } from '../../../constants';
import { RootState } from '../../../store/reducers';
import { ContextMenu } from '../../../components';
import Toolbar from './Toolbar';
import Details from './DetailsHOC';

import './Dashboard.css';

interface IDashboardProps extends PropsFromRedux {
}

interface IDashboardState {
  showContextMenu: boolean;
  nodeClicks: number;
  shouldPreventZoom: boolean;
  zoomAmount: number;
  currentTool: DashboardTool;
  currentNodeOrLink: GraphNode | GraphLink | null;
  hoveredObject: GraphNode | GraphLink | null;
  isAddingLink: boolean;
  hasClickBeenHandled: boolean;
  mouseX: number;
  mouseY: number;
  ctx: CanvasRenderingContext2D | null;
  selectedNodes: GraphNode[];
  isSelecting: boolean;
  selectionStartCoords: [number, number];
}

export type DashboardTool = 'Select' | 'Draw' | 'Erase' | 'Area select';

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  private graph = React.createRef() as React.MutableRefObject<ForceGraphMethods>;
  private contextMenu = React.createRef<HTMLDivElement>();
  private details = React.createRef<HTMLDivElement>();
  private selectionBox = React.createRef<HTMLDivElement>();
  readonly state: IDashboardState = {
    showContextMenu: false,
    nodeClicks: 0,
    shouldPreventZoom: false,
    zoomAmount: 0,
    currentTool: 'Select',
    currentNodeOrLink: null,
    hoveredObject: null,
    isAddingLink: false,
    hasClickBeenHandled: true,
    mouseX: 0,
    mouseY: 0,
    ctx: null,
    selectedNodes: [],
    isSelecting: false,
    selectionStartCoords: [0, 0],
  }

  componentDidMount() {
    // Configure force
    let graph = this.graph.current;
    graph.d3Force('center', () => null);
    graph.d3Force('collide', forceCollide());
    this.setState({ zoomAmount: graph.zoom() });
    document.onkeyup = this.handleKeyPress;
  }
  

/* ----------------------------- Event handlers ----------------------------- */

  handleKeyPress = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      // Esc
      case 27:
        // Pressing escape cancels adding a new link 
        if (this.state.isAddingLink) this.setState({ isAddingLink: false });
        break;
      // Del
      case 46:
        // Deletes the selected link/node(s)
        let currentObject = this.state.currentNodeOrLink;
        if (currentObject) {
          currentObject.type === 'node' ? this.deleteNode(currentObject) : this.deleteLink(currentObject as GraphLink);
        }
        else if (this.state.selectedNodes.length) {
          this.state.selectedNodes.forEach(node => this.deleteNode(node));
        }
      default:
        break;
    }
  }

  handlePencilClick = (e: MouseEvent) => {
    if (this.state.isAddingLink) {
      this.setState({ isAddingLink: false });
    }
    else {
      this.addNode(e.clientX, e.clientY);
    }
  }

  handleSelectionClick = (e: MouseEvent) => {
    if (this.state.isSelecting) {
      this.selectNodesInArea(this.state.selectionStartCoords[0], this.state.selectionStartCoords[1], e.clientX, e.clientY);
    }
    else {
      this.setState({ selectionStartCoords: [e.clientX, e.clientY] });
      let box = this.selectionBox.current!;
      box.style.left = e.clientX + 'px';
      box.style.top = e.clientY + 'px';
      box.style.width = '0px';
      box.style.height = '0px';
    }
    this.setState(state => ({ isSelecting: !state.isSelecting }));
  }

  /**
   * Called whenever the background of the force graph is clicked. 
   * 
   * @param e The click event
   */
  onBackgroundClick = (e: MouseEvent) => {
    if (!this.state.hasClickBeenHandled) {
      switch (this.state.currentTool) {
        case 'Select':
          if (this.state.currentNodeOrLink) {
            this.setState({ currentNodeOrLink: null });
          }
          break;
        case 'Draw':
          this.handlePencilClick(e);
          break;

        case 'Area select':
          this.handleSelectionClick(e);
          break;
      }
      this.setState({ hasClickBeenHandled: true });
    }
  };

  /**
   * Handles all left-click events
   * @param e The click event
   */
  onClick = (e: React.MouseEvent) => {
    this.setState({ hasClickBeenHandled: false });
    let isMenuClick = this.isContextMenuClick(e);
    // Close context menu if it's open and user clicks outside of it
    if (this.state.showContextMenu && !isMenuClick) {
      // Let all other click handlers know that no further action is required
      this.setState({ hasClickBeenHandled: true });
      this.closeContextMenu();
    }
  };

  onMouseMove = (e: React.MouseEvent) => {
    if (this.state.isSelecting) {
      this.drawSelectionBox(e.clientX, e.clientY);
    }

    let { x, y } = this.graph.current.screen2GraphCoords(e.clientX, e.clientY);
    this.setState({
      mouseX: x,
      mouseY: y
    });
  }

  onHover = (nodeOrLink: GraphNode | GraphLink | null) => {
    if (nodeOrLink !== this.state.hoveredObject) {
      this.setState({ hoveredObject: nodeOrLink });
    }
  }

  /**
   * Renders the context menu at the position of the mouse
   * 
   * @param {React.MouseEvent} e  Mouse right click event
   */
  onRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let y = e.clientY;
    let x = e.clientX;
    this.setState({ showContextMenu: true }, () => {
      let menu = this.contextMenu.current as HTMLDivElement;
      let width = menu.offsetWidth;
      let height = menu.offsetHeight;
      menu.style.left = x + 'px';
      menu.style.top = y + 'px';
    });
  }


/* ------------------------------ Context menu ----------------------------- */

  closeContextMenu = () => {
    this.setState({ showContextMenu: false });
  }

  createNodeFromMenu = () => {
    let contextMenu = this.contextMenu.current!;
    // Get original right click position of the menu
    let originX = parseInt(contextMenu.style.left);
    let originY = parseInt(contextMenu.style.top);
    this.addNode(originX, originY);
  }

  /**
   * Returns true if user clicked on the context menu
   * @param e The click event
   */
  isContextMenuClick = (e: React.MouseEvent): boolean => {
    if (!this.state.showContextMenu) return false;
    let menuPosition = this.contextMenu.current!.getBoundingClientRect();
    return (
      !(e.clientX < menuPosition.left ||
        e.clientX > menuPosition.right ||
        e.clientY < menuPosition.top ||
        e.clientY > menuPosition.bottom)
    );
  }


/* ---------------------------- Node interactions --------------------------- */

  addNode = (originX: number, originY: number) => {
    // Translate to node canvas position
    let { x: fx, y: fy } = this.graph.current.screen2GraphCoords(originX, originY)
    // Create new default node
    let newNode: GraphNode = {
      id: this.props.graph.data.nodeSequence,
      name: '',
      groups: [],
      isGroup: false,
      notes: '',
      color: this.props.graph.data.settings!.defaultNodeColor,
      val: this.props.graph.data.settings!.defaultNodeSize,
      type: 'node',
    };
    // Assign coordinates to the node
    Object.assign(newNode, { fx, fy });
    // Add it to the list of nodes
    this.props.addNode(this.props.graph.data.id!, newNode);
    this.setState({
      shouldPreventZoom: true,
      currentNodeOrLink: newNode,
    });
  }

  deleteNode = (toDeleteNode: GraphNode) => {
    this.props.deleteNode(this.props.graph.data.id!, toDeleteNode);
    this.setPostDeleteState(toDeleteNode);
  }

  handleNodePencilClick = (node: GraphNode) => {
    if (this.state.isAddingLink) {
      if (!this.props.graph.neighbours[node.id!].has(this.state.currentNodeOrLink as GraphNode) &&
        node !== this.state.currentNodeOrLink) {
        this.addLink(this.state.currentNodeOrLink!.id!, node.id!);
      }
      this.setState({ isAddingLink: false });
    }
    else {
      this.setState({
        currentNodeOrLink: node,
        isAddingLink: true,
        mouseX: node.x!,
        mouseY: node.y!
      });
    }
  }

  /**
   * Callback function for node left-button clicks. Sends the node details to the inspector 
   * and also tracks double-clicking for unsticking node positions.
   * 
   * @param node The node that was clicked
   */
  onNodeClick = (node: GraphNode) => {
    console.log(this.props.graph.data)
    if (!this.state.hasClickBeenHandled) {
      if (this.state.currentTool === 'Select') {
        this.setState({ currentNodeOrLink: node });
        this.trackNodeDblClick(node);
      }
      else if (this.state.currentTool === 'Erase') {
        this.deleteNode(node);
        this.setState({ isAddingLink: false });
      }
      else if (this.state.currentTool === 'Draw') {
        this.handleNodePencilClick(node);
      }
    }
    this.setState({ selectedNodes: [], hasClickBeenHandled: true });
  }

  onNodeDrag = (node: GraphNode) => {
    if (this.state.selectedNodes.length) {

    }
    else {

    }
    this.setState({ currentNodeOrLink: node });
  }

  onNodeDragEnd = (node: GraphNode) => {
    this.graph.current.d3ReheatSimulation();
    node.fx = node.x;
    node.fy = node.y;
  }

  selectNodesInArea = (x: number, y: number, x0: number, y0: number) => {
    let { x: x1, y: y1 } = this.graph.current.screen2GraphCoords(x, y);
    let { x: x2, y: y2 } = this.graph.current.screen2GraphCoords(x0, y0);
    let left = Math.min(x1, x2);
    let right = Math.max(x1, x2);
    let top = Math.min(y1, y2);
    let bottom = Math.max(y1, y2);
    let selectedNodes: GraphNode[] = [];

    for (let node of this.props.graph.data.nodes) {
      if (left <= node.x! && node.x! <= right && top <= node.y! && node.y! <= bottom) {
        selectedNodes.push(node);
      }
    }
    this.setState({ selectedNodes });
    this.setState({ currentNodeOrLink: (selectedNodes.length === 1) ? selectedNodes[0] : null });
  }

  trackNodeDblClick = (node: GraphNode) => {
    this.setState(prevState => {
      // Double click unsticks a node's position
      if (prevState.nodeClicks >= 1) {
        this.unstickNode(node);
      }
      // Reset number of clicks if another has not been detected within the interval
      setTimeout(() => {
        this.setState({ nodeClicks: 0 });
      }, 200);
      // Update the number of clicks
      return {
        ...prevState,
        nodeClicks: prevState.nodeClicks + 1
      }
    });
  }

  /**
   * Removes the fixed coordinates fx and fy of a node
   * 
   * @param node The node to unstick
   */
  unstickNode = (node: GraphNode) => {
    delete node.fx;
    delete node.fy;
    this.graph.current.d3ReheatSimulation();
  }


/* ---------------------------- Link interactions --------------------------- */

  addLink = (source: string | number, target: string | number) => {
    let newLink: GraphLink = {
      id: this.props.graph.data.linkSequence,
      source: this.props.graph.idToNode[source],
      target: this.props.graph.idToNode[target],
      color: this.props.graph.data.settings!.defaultLinkColor,
      width: this.props.graph.data.settings!.defaultLinkWidth,
      notes: '',
      type: 'link'
    };
    this.props.addLink(this.props.graph.data.id!, newLink);
    this.setState({ currentNodeOrLink: newLink });
  }

  deleteLink = (toDeleteLink: GraphLink) => {
    this.props.deleteLink(this.props.graph.data.id!, toDeleteLink);
    this.setPostDeleteState(toDeleteLink);
  }

  onLinkClick = (link: GraphLink) => {
    if (!this.state.hasClickBeenHandled) {
      if (this.state.currentTool === 'Select') {
        this.setState({ currentNodeOrLink: link });
      }
      else if (this.state.currentTool === 'Erase') {
        this.deleteLink(link);
      }
    }
    this.setState({ hasClickBeenHandled: true });
  }
  

/* ----------------------------- Canvas renders ----------------------------- */

  drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawLine = (ctx: CanvasRenderingContext2D, color: string, width: number, startX: number, startY: number, endX: number, endY: number) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
  }

  drawLink = (link: GraphLink, ctx: CanvasRenderingContext2D) => {
    if (!this.state.ctx) this.setState({ ctx });
    let source = link.source as GraphNode;
    let target = link.target as GraphNode;
    // Highlight the link if it is being hovered or selected
    if ([this.state.hoveredObject, this.state.currentNodeOrLink].includes(link)) {
      this.drawLine(ctx, graphConstants.HIGHLIGHT_COLOR, link.width! + 3, source.x!, source.y!, target.x!, target.y!);
    }
    this.drawLine(ctx, link.color!, link.width!, source.x!, source.y!, target.x!, target.y!);
  }

  drawNode = (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!this.state.ctx) this.setState({ ctx });

    // Draw the label
    const label = node.label || node.name || '';
    const fontSize = 12;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top'
    ctx.fillStyle = node.color!;
    ctx.fillText(label, node.x!, node.y! + node.val! + 5);

    // Highlight the node if it is being hovered or is selected
    let hoveredObject = this.state.hoveredObject;
    if ([hoveredObject, this.state.currentNodeOrLink, ...this.state.selectedNodes].includes(node)) {
      this.drawCircle(ctx, node.x!, node.y!, node.val! + 3, graphConstants.HIGHLIGHT_COLOR);
    }
    // Or light highlighting if it is a neighbour of the hovered node/link
    else if (
      hoveredObject &&
      (('isGroup' in hoveredObject && this.props.graph.neighbours[hoveredObject.id!].has(node)) ||
        ('source' in hoveredObject && [hoveredObject.source, hoveredObject.target].includes(node)))
    ) {
      this.drawCircle(ctx, node.x!, node.y!, node.val! + 3, graphConstants.HIGHLIGHT_NEIGHBOUR_COLOR);
    }
    // If a new link is being added, draw it based on coordinates of the selected node
    if (node === this.state.currentNodeOrLink && this.state.isAddingLink) {
      this.drawTempLink(ctx, node.x!, node.y!);
    }
    // Draw main node shape, either default circle or icon
    if (node.icon) {

    }
    else {
      this.drawCircle(ctx, node.x!, node.y!, node.val!, node.color!)
    }
  }

  drawSelectionBox = (x: number, y: number) => {
    let box = this.selectionBox.current!;
    let [startX, startY] = this.state.selectionStartCoords;
    let left = Math.min(startX, x);
    let top = Math.min(startY, y);
    let right = Math.max(startX, x);
    let bottom = Math.max(startY, y);
    box.style.left = left + 'px';
    box.style.top = top + 'px';
    box.style.width = (right - left) + 'px';
    box.style.height = (bottom - top) + 'px';
  }

  drawTempLink = (ctx: CanvasRenderingContext2D, originX: number, originY: number) => {
    this.drawLine(ctx, 'black', 1, originX, originY, this.state.mouseX, this.state.mouseY)
  }

  
/* ------------------------------ State setters ----------------------------- */

  selectTool = (tool: DashboardTool) => {
    this.setState({ currentTool: tool });
  }

  setPostDeleteState = (deletedObject: GraphLink | GraphNode) => {
    this.setState(prevState => {
      let currentNodeOrLink = prevState.currentNodeOrLink;
      return {
        currentNodeOrLink: currentNodeOrLink === deletedObject ? null : currentNodeOrLink,
        hoveredObject: null,
        shouldPreventZoom: true
      }
    });
  }

  render() {
    const contextMenuProps = {
      ref: this.contextMenu,
      closeContextMenu: this.closeContextMenu
    }
    const detailsProps = {
      ref: this.details,
      nodeOrLink: { ...this.state.currentNodeOrLink! }
    }
    const graphProps: ForceGraphProps = {
      graphData: this.props.graph.data,
      nodeAutoColorBy: "group",
      onBackgroundClick: this.onBackgroundClick,
      onNodeDrag: this.onNodeDrag,
      onNodeDragEnd: this.onNodeDragEnd,
      onNodeClick: this.onNodeClick,
      onNodeHover: this.onHover,
      nodeCanvasObject: this.drawNode,
      nodeCanvasObjectMode: () => 'replace',
      onLinkClick: this.onLinkClick,
      onLinkHover: this.onHover,
      linkCanvasObject: this.drawLink,
      d3VelocityDecay: 0.1,
      d3AlphaDecay: 0.1,
      // Zoom callbacks to prevent default zooming out/in on node creation/deletion
      onZoom: () => {
        if (this.state.shouldPreventZoom) {
          this.setState({ shouldPreventZoom: false }, () => this.graph.current?.zoom(this.state.zoomAmount))
        }
      },
      onZoomEnd: ({ k }) => {
        this.setState({ zoomAmount: k })
      },
    }

    return (
      <main id='dashboard' onClick={this.onClick}>
        {(this.props.auth.user && this.props.auth.user.id === 0)
          && <div className='demo-message'>DEMO (some features may not work)</div>
        }
        <div ref={this.selectionBox} className='selection-box' style={{ display: this.state.isSelecting ? 'block' : 'none' }} />
        {this.state.showContextMenu
          && <ContextMenu {...contextMenuProps} />
        }
        {this.state.currentNodeOrLink
          && <Details {...detailsProps} />
        }
        <Toolbar selectTool={this.selectTool} />
        <section
          className='graph'
          onContextMenu={this.onRightClick}
          onMouseMove={this.state.isAddingLink || this.state.isSelecting ? this.onMouseMove : undefined}
        >
          <ForceGraph2D ref={this.graph} {...graphProps} />
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  graph: state.graph,
});

const mapDispatchToProps = {
  addLink,
  addNode,
  deleteLink,
  deleteNode,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dashboard);
