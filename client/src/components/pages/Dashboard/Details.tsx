import React from 'react';
import { NodeObject } from 'react-force-graph-2d';
import { GraphNode } from './Dashboard';

import './Details.css';

interface DetailsProps {
  node: GraphNode | null,
}

const Details: React.ForwardRefRenderFunction<HTMLDivElement, DetailsProps> = ({ node }, ref) => {
  return (
    <article ref={ref} className='details'>
      <p>{node!.name}</p>
    </article>
  )
}


export default React.memo(
  React.forwardRef(Details), 
  (prevProps, nextProps) => { 
    let prevNode = prevProps.node as GraphNode;
    let nextNode = nextProps.node as GraphNode;
    return (
      prevNode.name === nextNode.name
    )
  }
);