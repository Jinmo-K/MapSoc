import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods, GraphData, NodeObject, LinkObject } from 'react-force-graph-2d';

interface IGraphBgProps {
  width: number,
  height: number
}

export const GraphBg: React.FC<IGraphBgProps> = ({ width, height }) => {
  const ref = useRef<ForceGraphMethods>();
  const [data, setData] = useState({ nodes: [], links: [] } as GraphData);
  const MAX_NODES = 10;

  /**
   * Adds a node and its links randomly and returns the resulting state
   * @param nodes The current nodes state
   * @param links The current links state
   * @returns The next state
   */
  const addRandomNode = (nodes: NodeObject[], links: LinkObject[]): GraphData => {
    let nextNodes = [...nodes];
    let nextLinks = [...links];
    const id = nextNodes.length ? nextNodes[nextNodes.length - 1].id as string + 1 : 0;
    const {x, y} = getRandomCoordinates();
    // Add the node and decide randomly if it should have a fixed or non-fixed position
    if (Math.random() > 0.3) {
      nextNodes.push({id, fx: x, fy: y});
    }
    else {
      nextNodes.push({id, x, y})
    }
    // If there are too many nodes, delete the first node and its links
    if (nextNodes.length > MAX_NODES) {
      let deleteNode = nextNodes[0];
      nextNodes.shift();
      nextLinks = nextLinks.filter(l => l.source !== deleteNode && l.target !== deleteNode);
    }
    // Randomly add links for the node
    for (let i = 0; i < 4; i++) {
      let target = nextNodes[Math.round(Math.random() * nextNodes.length - 1)]
      if (target && target.id !== id) {
        nextLinks.push({ source: id, target: target.id })
      }
    }
    return {
      nodes: nextNodes,
      links: nextLinks
    };
  }

  /**
   * Returns random graph coordinates based on size of the browser window
   */
  const getRandomCoordinates = (): {x: number, y: number} => {
    return ref.current!.screen2GraphCoords(Math.round(Math.random() * width), Math.round(Math.random() * height));
  }

  /**
   * Adds MAX_NODES random connected nodes to the data state
   */
  const seedData = () => {
    let nextState: GraphData = {nodes: [], links: []};
    for (let i = 0; i < MAX_NODES; i++) {
      Object.assign(nextState, addRandomNode(nextState.nodes, nextState.links));
    }
    setData(nextState);
  }

  useEffect(() => {
    seedData();
    let int = setInterval(() => {
      // Add a new connected node every second
      setData(({ nodes, links }) => addRandomNode(nodes, links));
    }, 1000);

    return () => clearInterval(int);
  }, []);


  return (
    <div id='home-bg'>
      <ForceGraph2D ref={ref} graphData={data} d3VelocityDecay={1} d3AlphaDecay={1} linkWidth={2} nodeRelSize={5}/>
    </div>
  );
}
