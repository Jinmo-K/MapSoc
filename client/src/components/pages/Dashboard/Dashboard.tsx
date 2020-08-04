import React from 'react';
import ReactDomServer from 'react-dom/server';
import { connect } from 'react-redux';
import forceLink from 'react-force-graph-2d'
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
  isEditingNewNode: boolean;
  hoveredNode: GraphNode | null;
  isAddingLink: boolean;
  hasClickBeenHandled: boolean;
  mouseX: number;
  mouseY: number;
  ctx: CanvasRenderingContext2D | null;
}

interface Data extends GraphData {
  nodeSequence: number;
  nodes: GraphNode[];
}

export type GraphNode = NodeObject & {
  name?: string;
  color?: string;
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
    isEditingNewNode: false,
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
    let newNode = {
      id: this.state.data.nodeSequence,
      name: ""
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
      isEditingNewNode: true
    }));
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

  handleNewNodeNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    let nodes = [...this.state.data.nodes];
    nodes[this.state.data.nodes.length - 1].name = e.currentTarget.value;
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        nodes
      }
    }));
  }

  drawNode = (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!this.state.ctx) this.setState({ ctx })
    const label = node.name as string;
    const fontSize = 12;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2, ...bckgDimensions as [number, number]);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color!;
    ctx.fillText(label, node.x!, node.y!);

    // If a new link is being added, draw it based on coordinates of the selected node
    if (node === this.state.currentNode && this.state.isAddingLink) {
      this.drawNewLink(ctx, node.x!, node.y!);
    }
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
      node: {...this.state.currentNode}
    }
    const graphProps: ForceGraphProps = { 
      graphData: this.state.data,
      nodeAutoColorBy: "group",
      onBackgroundClick: this.onBackgroundClick,
      onNodeDrag: this.onNodeDrag,
      onNodeDragEnd: this.onNodeDragEnd,
      onNodeClick: this.onNodeClick,
      onNodeHover: this.onNodeHover,
      nodeCanvasObject: this.drawNode,
      nodeCanvasObjectMode: () => 'before',
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

    return (
      <main id='dashboard' onClick={this.onClick}>
        {this.state.showContextMenu 
          &&  <ContextMenu {...contextMenuProps} /> 
        }
        {this.state.currentNode 
          &&  <Details {...detailsProps} /> 
        }
        {this.state.isEditingNewNode 
          &&  <input 
                id='new-node-name-input'
                autoFocus
                type='text' 
                onChange={this.handleNewNodeNameChange}
                onBlur={() => this.setState({ isEditingNewNode: false })}
                onKeyUp={(e) => {
                  if (e.keyCode == 13) {
                    this.setState({ isEditingNewNode: false })
                  }
                }}
                style={{position: 'absolute', opacity: 0}}
                autoComplete='off'
              />
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
