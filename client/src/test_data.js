export default {
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
          color: 'lightgreen',
          size: 500,
          fx: 0,
          fy: 0
      },
      {
          id: '1',
          name: 'Work',
          color: 'aqua',
          size: 500,
          fx: -35,
          fy: 60
      },
      // People
      {
          id: "2",
          name: "Mary",
          gender: "female",
          size: 300
      },
      {
          id: "3",
          name: "Roy",
          gender: "male"
      },
      {
          id: "4",
          name: "Frank",
          gender: "male"
      },
      {
          id: "5",
          name: "Melanie",
          gender: "female"
      }
  ]
}
