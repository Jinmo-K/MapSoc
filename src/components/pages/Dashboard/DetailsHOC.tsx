import React from 'react'
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../store/reducers';
import { handleKeyboardShortcut, saveLink, saveNode, updateLink, updateNode } from '../../../store/actions';
import { GraphNode, GraphLink } from '../../../types';
import NodeDetails from './NodeDetails';
import LinkDetails from './LinkDetails';

import './Details.css';

interface IDetailsProps extends PropsFromRedux {
  nodeOrLink: GraphNode | GraphLink;
}

const DetailsHOC: React.ForwardRefRenderFunction<HTMLDivElement, IDetailsProps> = 
  ({ graphId, linkIndex, nodeIndex, nodeOrLink, saveLink, saveNode, handleKeyboardShortcut, updateLink, updateNode }, ref) => {
    
  return (
    <div ref={ref} className='details'>
      {
        (nodeOrLink.type === 'node')
          ? <NodeDetails 
              {...{
                graphId: graphId!,
                node: nodeOrLink as GraphNode,
                nodeIndex,
                saveNode,
                handleKeyboardShortcut,
                updateNode,
              }}
            />
          : <LinkDetails 
              {...{
                graphId: graphId!,
                link: nodeOrLink as GraphLink,
                linkIndex,
                saveLink,
                handleKeyboardShortcut,
                updateLink
              }}
            />
      }
    </div>
  )
};

const mapDispatchToProps = {
  handleKeyboardShortcut,
  saveLink,
  saveNode,
  updateLink,
  updateNode,
};

const mapStateToProps = (state: RootState) => ({
  graphId: state.graph.data.id,
  linkIndex: state.graph.idToLink,
  nodeIndex: state.graph.idToNode,
});

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true}
);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(React.forwardRef(DetailsHOC));
