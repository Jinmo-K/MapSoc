import React from 'react';
import { connect } from 'react-redux';
import { forceCollide } from 'd3';
import ForceGraph2D, { ForceGraphMethods, GraphData, NodeObject, ForceGraphProps, LinkObject } from 'react-force-graph-2d';

import { ContextMenu } from '../../../components';
import Toolbar from './Toolbar';

import './Dashboard.css';
import testdata from '../../../test_data';

interface IDashboardProps {
}

interface IDashboardState {
  showContextMenu: boolean;
  data: Data;
  nodeClicks: number;
  nodeAdded: boolean;
  zoomAmount: number;
  currentTool: string;
  hoveredNode: NodeObject | null;
}

interface Data extends GraphData {
  nodeSequence: number;
}

export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  private graph = React.createRef() as React.MutableRefObject<ForceGraphMethods>;
  private contextMenu = React.createRef<HTMLDivElement>();
  readonly state: IDashboardState = {
    showContextMenu: false,
    data: {
      nodes: testdata.nodes,
      links: testdata.links,
      nodeSequence: testdata.nodeSequence
    },
    nodeClicks: 0,
    nodeAdded: false,
    zoomAmount: 0,
    currentTool: 'pointer',
    hoveredNode: null,
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
    let isMenuClick = this.isContextMenuClick(e);
    // Close context menu if it's open and user clicks outside of it
    if (this.state.showContextMenu && !isMenuClick) {
      this.closeContextMenu();
    }
  };

  /**
   * Called whenever the background of the force graph is clicked. 
   * 
   * @param e The click event
   */
  onBackgroundClick = (e: MouseEvent) => {
    if (this.state.currentTool === 'pencil') {
      this.handlePencilClick(e);
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
  onNodeClick = (node: NodeObject) => {
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

  onNodeHover = (node: NodeObject | null) => {
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
      nodeAdded: true
    }));
  }

  /**
   * Removes the fixed coordinates fx and fy of a node
   * 
   * @param node The node to unstick
   */
  unstickNode = (node: NodeObject) => {
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
    const graphProps: ForceGraphProps = { 
      graphData: this.state.data,
      nodeAutoColorBy: "group",
      onBackgroundClick: this.onBackgroundClick,
      onNodeDragEnd: (node) => {
        this.graph.current.d3ReheatSimulation()
        node.fx = node.x;
        node.fy = node.y;
      },
      onNodeClick: this.onNodeClick,
      onNodeHover: this.onNodeHover,
      d3VelocityDecay: 0.1,
      d3AlphaDecay: 0.1,
      // Zoom callbacks to prevent default zooming out on node creation
      onZoom: () => {
        if (this.state.nodeAdded) {
          this.setState({ nodeAdded: false }, () => this.graph.current?.zoom(this.state.zoomAmount))
        }
      },
      onZoomEnd: ({ k }) => {
        this.setState({ zoomAmount: k })
      }
    }

    return (
      <main id='dashboard' onClick={this.onClick}>
        {this.state.showContextMenu 
          &&  <ContextMenu {...contextMenuProps} /> 
        }
        <Toolbar selectTool={this.selectTool} />
        <section className='graph' onContextMenu={this.onRightClick}>
          <ForceGraph2D ref={this.graph} {...graphProps} />
        </section>
      </main>
    );
  }
}
