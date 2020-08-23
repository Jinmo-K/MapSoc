import { graphConstants } from './constants';

export default {
  id: 1011,
  "links": [
    // Work
    {
      id: 0,
      notes: '',
      type: 'link',
      source: "0",
      target: "2",
      style: {
        color: graphConstants.DEFAULT_LINK_COLOR,
        width: graphConstants.DEFAULT_LINK_WIDTH
      }
    },
    {
      id: 1,
      notes: '',
      type: 'link',
      source: "0",
      target: "3",
      style: {
        color: graphConstants.DEFAULT_LINK_COLOR,
        width: graphConstants.DEFAULT_LINK_WIDTH
      }
    },
    {
      id: 2,
      notes: '',
      type: 'link',
      source: "0",
      target: "4",
      style: {
        color: graphConstants.DEFAULT_LINK_COLOR,
        width: graphConstants.DEFAULT_LINK_WIDTH
      }
    },
    {
      id: 3,
      notes: '',
      type: 'link',
      source: "3",
      target: "4",
      style: {
        color: graphConstants.DEFAULT_LINK_COLOR,
        width: graphConstants.DEFAULT_LINK_WIDTH
      }
    },
    // School
    {
      id: 4,
      notes: '',
      type: 'link',
      source: '1',
      target: '2',
      style: {
        color: graphConstants.DEFAULT_LINK_COLOR,
        width: graphConstants.DEFAULT_LINK_WIDTH
      }
    },
    {
      id: 5,
      notes: '',
      type: 'link',
      source: '1',
      target: '5',
      style: {
        color: graphConstants.DEFAULT_LINK_COLOR,
        width: graphConstants.DEFAULT_LINK_WIDTH
      }
    }
  ],
  "nodes": [
    // Hubs
    {
      id: '0',
      name: 'School',
      type: 'node',
      style: {
        color: '#7ac77d',
        size: 7
      },
      fx: 0,
      fy: 0,
      groups: [],
      neighbours: new Set(['2', '3', '4']),
      notes: '',
      isGroup: true,
    },
    {
      id: '1',
      name: 'Work',
      type: 'node',
      style: {
        color: '#4cc8b3',
        size: 7
      },
      fx: -35,
      fy: 60,
      groups: [],
      neighbours: new Set(['2', '5']),
      notes: '',
      isGroup: true,
    },
    // People
    {
      id: "2",
      name: "Mary",
      type: 'node',
      groups: ['1', '0'],  // TODO
      style: {
        color: graphConstants.DEFAULT_NODE_COLOR,
        size: 2
      },
      neighbours: new Set(['1', '0']),
      notes: '',
      isGroup: false,
    },
    {
      id: "3",
      name: "Roy",
      type: 'node',
      groups: ['0'],
      style: {
        color: graphConstants.DEFAULT_NODE_COLOR,
        size: graphConstants.DEFAULT_NODE_SIZE
      },
      neighbours: new Set(['0', '4']),
      notes: '',
      isGroup: false,
    },
    {
      id: "4",
      name: "Frank",
      type: 'node',
      groups: ['0'],
      style: {
        color: graphConstants.DEFAULT_NODE_COLOR,
        size: graphConstants.DEFAULT_NODE_SIZE
      },
      neighbours: new Set(['0', '3']),
      notes: '',
      isGroup: false,
    },
    {
      id: "5",
      name: "Melanie",
      type: 'node',
      groups: ['1'],
      style: {
        color: graphConstants.DEFAULT_NODE_COLOR,
        size: graphConstants.DEFAULT_NODE_SIZE
      },
      neighbours: new Set(['1']),
      notes: '',
      isGroup: false,
    }
  ],
  linkSequence: 6,
  nodeSequence: 6,
}
