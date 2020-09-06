import { graphConstants } from './constants';

export default {
  id: 1011,
  "links": [
    {
      id: 1,
      notes: "Met in 1st year res",
      source: 0,
      color: "#29B6F6", 
      width: 2,
      target: 3,
      type: 'link'
    },
    {
      id: 2,
      notes: "Met in 1st year res",
      source: 0,
      color: "#29B6F6", 
      width: 2,
      target: 4,
      type: "link"
    },
    {
      id: 3,
      notes: "Played varsity football together",
      source: 3,
      color: "#C492AC", 
      width: 2,
      target: 4,
      type: "link"
    },
    {
      id: 7,
      notes: "",
      source: 1,
      color: "#02D7C5", 
      width: 2,
      target: 8,
      type: "link"
    },
    {
      id: 8,
      notes: "",
      source: 6,
      color: "#29B6F6", 
      width: 2,
      target: 0,
      type: "link"
    },
    {
      id: 9,
      notes: "Met in 1st year English",
      source: 0,
      color: "#29B6F6", 
      width: 2,
      target: 7,
      type: "link"
    },
    {
      id: 10,
      notes: "",
      source: 10,
      color: "#33B579", 
      width: 2,
      target: 7,
      type: "link"
    },
    {
      id: 11,
      notes: "",
      source: 10,
      color: "#33B579", 
      width: 2,
      target: 11,
      type: "link"
    },
    {
      id: 12,
      notes: "",
      source: 10,
      color: "#33B579", 
      width: 2,
      target: 12,
      type: "link"
    },
    {
      id: 13,
      notes: "Met in 2nd year res",
      source: 13,
      color: "#F35C4E", 
      width: 2,
      target: 7,
      type: "link"
    },
    {
      id: 14,
      notes: "",
      source: 15, 
      color: "#584A8F", 
      width: 2,
      target: 17,
      type: "link"
    },
    {
      id: 15,
      notes: "",
      source: 1,
      color: "#02D7C5", 
      width: 2,
      target: 9,
      type: "link"
    },
    {
      id: 16,
      notes: "",
      source: 1,
      color: "#02D7C5", 
      width: 2,
      target: 14,
      type: "link"
    },
    {
      id: 17,
      notes: "",
      source: 16,
      color: "#A9A9A9", 
      width: 2,
      target: 18,
      type: "link"
    },
    {
      id: 18,
      notes: "",
      source: 6,
      color: "#29B6F6", 
      width: 2,
      target: 19,
      type: "link"
    },
    {
      id: 19,
      notes: "",
      source: 16,
      color: "#A9A9A9", 
      width: 2,
      target: 20,
      type: "link"
    },
    {
      id: 20,
      notes: "",
      source: 16,
      color: "#A9A9A9", 
      width: 2,
      target: 23,
      type: "link"
    },
    {
      id: 22,
      notes: "",
      source: 19,
      color: "#29B6F6", 
      width: 2,
      target: 24,
      type: "link"
    },
    {
      id: 23,
      notes: "",
      source: 15,
      color: "#584A8F", 
      width: 2,
      target: 26,
      type: "link"
    },
    {
      id: 24,
      notes: "",
      source: 15,
      color: "#584A8F", 
      width: 2,
      target: 28,
      type: "link"
    },
    {
      id: 25,
      notes: "",
      source: 15,
      color: "#584A8F", 
      width: 2,
      target: 27,
      type: "link"
    },
    {
      id: 26,
      notes: "",
      source: 12,
      color: "#33B579", 
      width: 2,
      target: 30,
      type: "link"
    },
    {
      id: 27,
      notes: "",
      source: 19,
      color: "#29B6F6", 
      width: 2,
      target: 26,
      type: "link"
    },
  ],
  "nodes": [
    // Groups
    {
      id: 0,
      val: 10,
      name: 'University',
      type: 'node',
      color: '#29B6F6',
      val: 8,
      fx: 7.72,
      fy: -36.8,
      groups: [6],
      notes: '',
      isGroup: true,
    },
    {
      id: 1,
      name: 'Work',
      type: 'node',
      color: '#4cc8b3',
      val: 8,
      fx: -237,
      fy: 30,
      groups: [],
      notes: '',
      isGroup: true,
    },
    {
      fx: -31.086248579329524,
      fy: -85.86072254314755,
      groups: [],
      id: 6,
      isGroup: true,
      name: "School",
      notes: "",
      color: "#29B6F6", 
      val: 10,
      type: "node"
    },
    // People
    {
      id: 3,
      name: "Roy",
      type: 'node',
      groups: [0],
      color: '#408ab8',
      val: 5,
      fx: 28.5,
      fy: -89,
      notes: 'Birthday: April 4\n\nMajor: Zoology\n\nLoves otters more than people',
      isGroup: false,
    },
    {
      id: 4,
      name: "Frank",
      type: 'node',
      groups: [0],
      color: graphConstants.DEFAULT_NODE_COLOR,
      val: graphConstants.DEFAULT_NODE_SIZE,
      notes: 'Birthday: Jan 2\n\nMajor: Biology\n\nSoundcloud rapper',
      isGroup: false,
    },
    {
      fx: 35.389488264503214,
      fy: 18.68936922237114,
      groups: [0, 10],
      id: 7,
      isGroup: false,
      name: "Ava",
      notes: "Birthday: Aug 14\n\nMajor: Theoretical physics\n\nOccupaton: TikToker",
      color: "#FE9998", 
      val: 5,
      type: "node"
    },
    {
      fx: -192.65914613593029,
      fy: 69.07720050505536,
      groups: [1],
      id: 8,
      isGroup: false,
      name: "Harold",
      notes: "Believes the Earth is flat.",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      fx: -265.1785406836182,
      fy: 80.52536467592789,
      groups: [1],
      id: 9,
      isGroup: false,
      name: "Vera",
      notes: "Vegetarian",
      color: "#FE9998", 
      val: 5,
      type: "node"
    },
    {
      fx: 49.454427540662984,
      fy: 58.64827694638886,
      groups: [],
      id: 10,
      isGroup: true,
      name: "Johnson Family",
      notes: "Originally from England",
      color: "#33B579", 
      val: 8,
      type: "node"
    },
    {
      fx: 85.49694351821532,
      fy: 90.09830455065064,
      groups: [10],
      id: 11,
      isGroup: false,
      name: "Carol",
      notes: "Ava's mom\n\nUltra marathoner, yoga teacher, vegan",
      color: "#FE9998", 
      val: 5,
      type: "node"
    },
    {
      fx: 23.633214897791433,
      fy: 99.95405432857024,
      groups: [10],
      id: 12,
      isGroup: false,
      name: "Stan",
      notes: "Ava's dad\n\nWorks in finance\n\nIs distantly related to Mariah Carey",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      fx: 66.44734433456978,
      fy: 8.51775277890066,
      groups: [],
      id: 13,
      isGroup: false,
      name: "Matt",
      notes: "Ava's boyfriend\n\nLost his front tooth after being jumped by a gang of 10-year olds. He was 25.",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      fx: -285.16726491027816,
      fy: 4.68476402839536,
      groups: ["1"],
      id: 14,
      isGroup: false,
      name: "Gord",
      notes: "Birthday: May 5\n\nLoves craft beer and tacos",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      fx: -216.05457376864402,
      fy: -118.29384078064074,
      groups: [],
      id: 15,
      isGroup: true,
      name: "Book club",
      notes: "",
      color: "#584A8F", 
      val: 10,
      type: "node"
    },
    {
      fx: -111.91854912013261,
      fy: 118.01478343646012,
      groups: [],
      id: 16,
      isGroup: true,
      name: "Gym",
      notes: "",
      color: "#727A8C", 
      val: 10,
      type: "node"
    },
    {
      groups: [15],
      id: 17,
      isGroup: false,
      name: "Dave",
      notes: "Still believes in Santa Claus",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      fx: -166.49367431824479,
      fy: 163.40953799955116,
      groups: [16],
      id: 18,
      isGroup: false,
      name: "Janelle",
      notes: "At the gym 24/7",
      color: "#FE9998", 
      val: 5,
      type: "node"
    },
    {
      fx: -54.9253091692777,
      fy: -149.49543392885118,
      groups: [6],
      id: 19,
      isGroup: true,
      name: "Highschool",
      notes: "",
      color: "#29B6F6", 
      val: 5,
      type: "node"
    },
    {
      fx: -101.65583035252143,
      fy: 183.7616435456369,
      groups: [16],
      id: 20,
      isGroup: false,
      name: "Ben",
      notes: "The guy who can't stop talking about CrossFit",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      groups: [16],
      id: 23,
      isGroup: false,
      name: "Gary",
      notes: "Parkour",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      fx: -97.21417718469053,
      fy: -187.05340008831627,
      groups: [19],
      id: 24,
      isGroup: false,
      name: "Dory",
      notes: "Super forgetful\n\nOwes me $5",
      color: "#FE9998", 
      val: 5,
      type: "node"
    },
    {
      groups: [15, 19],
      id: 26,
      isGroup: false,
      name: "Annabel",
      notes: "Birthday: July 16\n\nHas the best dad jokes",
      color: "#FE9998", 
      val: 5,
      type: "node"
    },
    {
      groups: [15],
      id: 27,
      isGroup: false,
      name: "Leanne",
      notes: "Has a Schnauzer named Dumbledore",
      color: "#FE9998", 
      val: 5,
      type: "node"
    },
    {
      groups: [15],
      id: 28,
      isGroup: false,
      name: "Anthony",
      notes: "Looks like Steve Carell\n\nHates Steve Carell",
      color: "#408ab8", 
      val: 5,
      type: "node"
    },
    {
      fx: -14.55123581410429,
      fy: 136.1284102875155,
      groups: [],
      id: 30,
      isGroup: false,
      name: "Mariah Carey",
      notes: "",
      color: "#FE9998", 
      val: 5,
      type: "node"
    }
  ],
  linkSequence: 28,
  nodeSequence: 31,
  settings: {
    defaultLinkColor: graphConstants.DEFAULT_LINK_COLOR,
    defaultLinkWidth: graphConstants.DEFAULT_LINK_WIDTH,
    defaultNodeColor: graphConstants.DEFAULT_NODE_COLOR,
    defaultNodeSize: graphConstants.DEFAULT_NODE_SIZE
  },
}
