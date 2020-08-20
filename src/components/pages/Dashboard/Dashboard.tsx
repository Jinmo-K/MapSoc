import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { forceCollide } from 'd3';
import ForceGraph2D, { ForceGraphMethods, GraphData, NodeObject, ForceGraphProps, LinkObject } from 'react-force-graph-2d';

import { addLink, addNode, deleteNode } from '../../../store/actions';

import { GraphNode, Graph } from '../../../types';
import { graphConstants } from '../../../constants';
import { RootState } from '../../../store/reducers';
import { ContextMenu } from '../../../components';
import Toolbar from './Toolbar';
import Details from './Details';

import './Dashboard.css';
import testdata from '../../../test_data';

interface IDashboardProps extends PropsFromRedux{
}
// TODO: adding hoveredObject, inspectedObject..
interface IDashboardState {
  showContextMenu: boolean;
  nodeClicks: number;
  shouldPreventZoom: boolean;
  zoomAmount: number;
  currentTool: string;
  currentNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  isAddingLink: boolean;
  hasClickBeenHandled: boolean;
  mouseX: number;
  mouseY: number;
  ctx: CanvasRenderingContext2D | null;
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  private graph = React.createRef() as React.MutableRefObject<ForceGraphMethods>;
  private contextMenu = React.createRef<HTMLDivElement>();
  private details = React.createRef<HTMLDivElement>();
  readonly state: IDashboardState = {
    showContextMenu: false,
    nodeClicks: 0,
    shouldPreventZoom: false,
    zoomAmount: 0,
    currentTool: 'pointer',
    currentNode: null,
    hoveredNode: null,
    isAddingLink: false,
    hasClickBeenHandled: true,
    mouseX: 0,
    mouseY: 0,
    ctx: null,
  }

  componentDidMount() {
    // Configure force
    let graph = this.graph.current; 
    graph.d3Force('center', () => null);
    graph.d3Force('collide', forceCollide());
    this.setState({ zoomAmount: graph.zoom() });
  }

  closeContextMenu = () => {
    this.setState({ showContextMenu: false });
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

  /**
   * Called whenever the background of the force graph is clicked. 
   * 
   * @param e The click event
   */
  onBackgroundClick = (e: MouseEvent) => {
    if (!this.state.hasClickBeenHandled) {
      switch (this.state.currentTool) {
        case 'pointer':
          if (this.state.currentNode) {
            this.setState({ currentNode: null });
          }
          break;
        case 'pencil':
          this.handlePencilClick(e);
          break;
      }
      this.setState({ hasClickBeenHandled: true });
    }
  };

  handlePencilClick = (e: MouseEvent) => {
    if (this.state.isAddingLink) {
      this.setState({ isAddingLink: false });
    }
    else {
      this.addNode(e.clientX, e.clientY);
    }
  }

  /**
   * Renders the context menu at the position of the mouse
   * 
   * @param {React.MouseEvent} e  Mouse right click event
   */
  onRightClick = (e: React.MouseEvent) => {
    console.log(this.state.currentNode)
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

  onMouseMove = (e: React.MouseEvent) => {
    let {x, y} = this.graph.current.screen2GraphCoords(e.clientX, e.clientY);
    this.setState({
      mouseX: x,
      mouseY: y
    })
  }

  /**
   * Callback function for node left-button clicks. Sends the node details to the inspector 
   * and also tracks double-clicking for unsticking node positions.
   * 
   * @param node The node that was clicked
   */
  onNodeClick = (node: GraphNode) => {
    if (!this.state.hasClickBeenHandled) {
      if (this.state.currentTool === 'pointer') {
        this.setState({ currentNode: node });
        this.trackNodeDblClick(node);
      } 
      else if (this.state.currentTool === 'eraser') {
        this.deleteNode(node);
        this.setState({ isAddingLink: false });
      }
      else if (this.state.currentTool === 'pencil') {
        this.handleNodePencilClick(node);
      }
    }
    this.setState({ hasClickBeenHandled: true });
  }

  handleNodePencilClick = (node: GraphNode) => {
    if (this.state.isAddingLink) {
      if (!node.neighbours?.has(this.state.currentNode!.id!) && node !== this.state.currentNode) {
        this.addLink(this.state.currentNode!.id!, node.id!);
        this.setState({ currentNode: null })
      }
      this.setState({ isAddingLink: false });
    }
    else {
      this.setState({ 
        currentNode: node,
        isAddingLink: true,
        mouseX: node.x!,
        mouseY: node.y!
      });
      // Register 'esc' key events to cancel adding new link
      document.onkeyup = (e) => {
        if (e.keyCode === 27) {
          this.setState({ isAddingLink: false });
          document.onkeyup = null;
        }
      }
    }
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

  onNodeHover = (node: GraphNode | null) => {
    if (node !== this.state.hoveredNode) {
      this.setState({ hoveredNode: node });
    }
  }

  onNodeDrag = (node: GraphNode) => {
    this.setState({ currentNode: node });
  }

  onNodeDragEnd = (node: GraphNode) => {
    this.graph.current.d3ReheatSimulation();
    node.fx = node.x;
    node.fy = node.y;
  }

  createNodeFromMenu = () => {
    let contextMenu = this.contextMenu.current!;
    // Get original right click position of the menu
    let originX = parseInt(contextMenu.style.left);
    let originY = parseInt(contextMenu.style.top);
    this.addNode(originX, originY);
  }

  addNode = (originX: number, originY: number) => {
    // Translate to node canvas position
    let {x: fx, y: fy} = this.graph.current.screen2GraphCoords(originX, originY)
    // Create new default node
    let newNode: GraphNode = {
      id: this.props.graph.data.nodeSequence,
      name: "",
      neighbours: new Set<string | number>(),
      groups: [],
      isGroup: false,
      notes: '',
      style: {
        color: graphConstants.DEFAULT_NODE_COLOR,
        size: graphConstants.DEFAULT_NODE_SIZE
      }
    };
    // Assign coordinates to the node
    Object.assign(newNode, { fx, fy });
    // Add it to the list of nodes
    this.props.addNode(this.props.graph.data.id as string, newNode);
    this.setState({
      shouldPreventZoom: true,
      currentNode: newNode,
    });
  }

  pushNode = (node: GraphNode) => {
    this.setState(prevState => ({
      // data: {
      //   ...prevState.data,
      //   nodes: [...prevState.data.nodes, node],
      //   nodeSequence: prevState.data.nodeSequence! + 1
      // },
      shouldPreventZoom: true,
      currentNode: node,
    }));
  }

  deleteNode = (toDeleteNode: GraphNode) => {
    this.props.deleteNode(this.props.graph.data.id as string, toDeleteNode);
    this.setState(prevState => {
      let currentNode = prevState.currentNode;
      return {
          currentNode: currentNode === toDeleteNode ? null : currentNode,
          hoveredNode: null,
          shouldPreventZoom: true
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

  drawNode = (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!this.state.ctx) this.setState({ ctx });
    const nodeStyle = node.style || {};
    
    // Draw the label
    const label = node.label || node.name || '';
    const fontSize = 12;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top'
    ctx.fillStyle = nodeStyle.color!;
    ctx.fillText(label, node.x!, node.y! + 5);
  
    // Highlight the node if it is being hovered
    if ([this.state.hoveredNode?.id, this.state.currentNode?.id].includes(node.id)) {
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, nodeStyle.size! + 3, 0, 2 * Math.PI, false);
      ctx.fillStyle = graphConstants.HIGHLIGHT_NODE_COLOR;
      ctx.fill();
    }
    // Light highlighting of neighbours of hovered node
    else if (this.state.hoveredNode?.neighbours?.has(node.id!)) {
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, nodeStyle.size! + 3, 0, 2 * Math.PI, false);
      ctx.fillStyle = graphConstants.HIGHLIGHT_NEIGHBOUR_COLOR;
      ctx.fill();
    }

    // If a new link is being added, draw it based on coordinates of the selected node
    if (node === this.state.currentNode && this.state.isAddingLink) {
      this.drawNewLink(ctx, node.x!, node.y!);
    }

    // Draw main node shape, either default circle or icon
    if (nodeStyle.icon) {

    }
    else {
      this.drawCircle(ctx, node.x!, node.y!, nodeStyle.size!, nodeStyle.color!)
    }
  }

  drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  addLink = (source: string | number, target: string | number) => {
    let newLink = {
      source, 
      target
    };
    this.props.addLink(this.props.graph.data.id as string, newLink)
  }

  pushLink = (link: LinkObject) => {
    // Add each node to the other's set of neighbours
    // let nextNodes = [...this.state.data.nodes];
    // let [nodeA, nodeB] = nextNodes.filter(node => node.id === link.source || node.id === link.target);
    // nodeA.neighbours!.add(nodeA.id === link.source ? link.target as string : link.source as string);
    // nodeB.neighbours!.add(nodeB.id === link.source ? link.target as string : link.source as string)

    // this.setState(prevState => ({
    //   data: {
    //     ...prevState.data,
    //     links: [...prevState.data.links, link],
    //     nodes: nextNodes
    //   }
    // }));
  }

  drawNewLink = (ctx: CanvasRenderingContext2D, originX: number, originY: number) => {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.moveTo(originX, originY);
    ctx.lineTo(this.state.mouseX, this.state.mouseY);
    ctx.stroke();
    ctx.closePath();
  }

  selectTool = (tool: string) => {
    this.setState({ currentTool: tool });
  }

  render() {
    const contextMenuProps = {
      ref: this.contextMenu,
      closeContextMenu: this.closeContextMenu
    }
    const detailsProps = {
      ref: this.details,
      node: {...this.state.currentNode!}
    }
    const graphProps: ForceGraphProps = { 
      graphData: this.props.graph.data,
      nodeAutoColorBy: "group",
      onBackgroundClick: this.onBackgroundClick,
      onNodeDrag: this.onNodeDrag,
      onNodeDragEnd: this.onNodeDragEnd,
      onNodeClick: this.onNodeClick,
      onNodeHover: this.onNodeHover,
      nodeCanvasObject: this.drawNode,
      nodeCanvasObjectMode: () => 'replace',
      linkWidth: 4,
      // onLinkHover: this.onLinkHover,
      // onLinkClick: this.onLinkClick,
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
        {this.state.showContextMenu 
          &&  <ContextMenu {...contextMenuProps} /> 
        }
        {this.state.currentNode 
          &&  <Details {...detailsProps} /> 
        }
        <Toolbar selectTool={this.selectTool} />
        <section 
          className='graph' 
          onContextMenu={this.onRightClick} 
          onMouseMove={this.state.isAddingLink ? this.onMouseMove : undefined}
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
  deleteNode,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dashboard);