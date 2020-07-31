import React from 'react';
import { connect } from 'react-redux';
import { forceCollide } from 'd3';

import testdata from '../../test_data';
import testdata5 from '../../test_data';

import ForceGraph2D, { ForceGraphMethods, GraphData, NodeObject, ForceGraphProps } from 'react-force-graph-2d';

import { ContextMenu } from '../../components';

import './Dashboard.css';

interface IDashboardProps {
}

interface IDashboardState {
  showContextMenu: boolean;
  data: GraphData;
  nodeClicks: number;
}

export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  private graph = React.createRef() as React.MutableRefObject<ForceGraphMethods>;
  private contextMenu = React.createRef<HTMLDivElement>();
  readonly state: IDashboardState = {
    showContextMenu: false,
    data: {
      nodes: testdata.nodes,
      links: testdata.links
    },
    nodeClicks: 0
  }
  constructor(props: IDashboardProps) {
    super(props)
  }

  componentDidMount() {
    // Configure force
    let graph = this.graph.current; 
    graph.d3Force('center', () => null);
    graph.d3Force('collide', forceCollide())
  }

  closeContextMenu = () => {
    this.setState({ showContextMenu: false });
  }

  onClick = (e: React.MouseEvent) => {
    // Close context menu if it's open and user clicks outside of it
    if (this.state.showContextMenu && this.contextMenu && this.contextMenu.current) {  
      let menu = this.contextMenu.current.getBoundingClientRect();
      if ((e.clientX < menu.left || 
          e.clientX > menu.right || 
          e.clientY < menu.top || 
          e.clientY > menu.bottom)) 
      {
        let newNode = {
          id: 100,
          name: "Test",
          gender: "male"
        }
        this.addNode(newNode);
        this.closeContextMenu();
      }
    }
  };

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

  addNode = (newNode: NodeObject) => {
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        nodes: [...prevState.data.nodes, newNode]
      }
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

  render() {
    const contextMenuProps = {
      ref: this.contextMenu,
      closeContextMenu: this.closeContextMenu
    }
    const graph = this.graph
    const graphProps: ForceGraphProps = { 
      graphData: this.state.data,
      nodeAutoColorBy: "group",
      onNodeDragEnd: (node: NodeObject) => {
        graph.current.d3ReheatSimulation()
        node.fx = node.x;
        node.fy = node.y;
      },
      onNodeClick: this.onNodeClick,
      d3VelocityDecay: 0.1,
      d3AlphaDecay: 0.1
    }

    return (
      <main id='dashboard' onContextMenu={this.onRightClick} onClick={this.onClick}>
        {this.state.showContextMenu 
          &&  <ContextMenu {...contextMenuProps} /> 
        }
        <ForceGraph2D ref={graph} {...graphProps} />
      </main>
    );
  }
}
