import { graphConstants } from './constants';

export default {
  id: 1011,
  "links": [
    // Work
    {
      source: "0",
      target: "2"
    },
    {
      source: "0",
      target: "3"
    },
    {
      source: "0",
      target: "4"
    },
    {
      source: "3",
      target: "4"
    },
    // School
    {
      source: '1',
      target: '2'
    },
    {
      source: '1',
      target: '5'
    }
  ],
  "nodes": [
    // Hubs
    {
      id: '0',
      name: 'School',
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
      groups: ['0'],
      style: {
        color: graphConstants.DEFAULT_NODE_COLOR,
        size: graphConstants.DEFAULT_NODE_SIZE
      },
      neighbours: new Set(['0', '4']),
      isGroup: false,
    },
    {
      id: "4",
      name: "Frank",
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
  nodeSequence: 6,
}
