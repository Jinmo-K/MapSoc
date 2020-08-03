import React from 'react';
import { connect } from 'react-redux';
import { forceCollide } from 'd3';
import ForceGraph2D, { ForceGraphMethods, GraphData, NodeObject, ForceGraphProps, LinkObject } from 'react-force-graph-2d';

import { ContextMenu } from '../../../components';
import Toolbar from './Toolbar';
import Details from './Details';

import './Dashboard.css';
import testdata from '../../../test_data';

interface IDashboardProps {
}

interface IDashboardState {
  showContextMenu: boolean;
  data: Data;
  nodeClicks: number;
  shouldPreventZoom: boolean;
  zoomAmount: number;
  currentTool: string;
  currentNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  hasClickBeenHandled: boolean;
}

interface Data extends GraphData {
  nodeSequence: number;
}

export type GraphNode = NodeObject & {
  name?: string;
}

export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  private graph = React.createRef() as React.MutableRefObject<ForceGraphMethods>;
  private contextMenu = React.createRef<HTMLDivElement>();
  private details = React.createRef<HTMLDivElement>();
  readonly state: IDashboardState = {
    showContextMenu: false,
    data: {
      nodes: testdata.nodes,
      links: testdata.links,
      nodeSequence: testdata.nodeSequence
    },
    nodeClicks: 0,
    shouldPreventZoom: false,
    zoomAmount: 0,
    currentTool: 'pointer',
    currentNode: null,
    hoveredNode: null,
    hasClickBeenHandled: true,
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
    this.addNode(e.clientX, e.clientY);
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
      } else if (this.state.currentTool === 'eraser') {
        this.deleteNode(node);
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
    let newNode = {
      id: this.state.data.nodeSequence,
      name: "New Node"
    }
    // Assign coordinates to the node
    Object.assign(newNode, { fx, fy });
    // Add it to the list of nodes
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        nodes: [...prevState.data.nodes, newNode],
        nodeSequence: prevState.data.nodeSequence + 1
      },
      shouldPreventZoom: true,
      currentNode: newNode,
    }), () => console.log(this.state));
  }

  deleteNode = (node: GraphNode) => {
    this.setState(prevState => {
      let nextNodes = prevState.data.nodes.filter(n => n !== node);
      let nextLinks = prevState.data.links.filter(link => link.source !== node && link.target !== node);
      return {
          data: {
            ...prevState.data,
            nodes: nextNodes,
            links: nextLinks
          },
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
      node: this.state.currentNode
    }
    const graphProps: ForceGraphProps = { 
      graphData: this.state.data,
      nodeAutoColorBy: "group",
      onBackgroundClick: this.onBackgroundClick,
      onNodeDrag: (node) => this.setState({ currentNode: node }),
      onNodeDragEnd: (node) => {
        this.graph.current.d3ReheatSimulation()
        node.fx = node.x;
        node.fy = node.y;
      },
      onNodeClick: this.onNodeClick,
      onNodeHover: this.onNodeHover,
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
      }
    }

    console.log('render', this.state)

    return (
      <main id='dashboard' onClick={this.onClick}>
        {this.state.showContextMenu 
          &&  <ContextMenu {...contextMenuProps} /> 
        }
        {this.state.currentNode 
          &&  <Details {...detailsProps} /> 
        }
        <Toolbar selectTool={this.selectTool} />
        <section className='graph' onContextMenu={this.onRightClick}>
          <ForceGraph2D ref={this.graph} {...graphProps} />
        </section>
      </main>
    );
  }
}
