import { useMemo } from "react";
import { FlameGraph } from "react-flame-graph";

// const data = {
//   name: "root",
//   value: 5,
//   children: [
//     {
//       name: "custom tooltip",
//       value: 1,

//       // Each node can specify a "tooltip" to be shown on hover.
//       // By default, the node's "name" will be used for this.
//       tooltip: "Custom tooltip shown on hover",
//     },
//     {
//       name: "custom colors",

//       // Each node can also provide a custom "backgroundColor" or text "color".
//       backgroundColor: "#35f",
//       color: "#fff",

//       value: 3,
//       children: [
//         {
//           name: "leaf",
//           value: 2,
//         },
//       ],
//     },
//   ],
// };

const formatNode = (node) => {
  if (!node) {
    return null;
  }
  return {
    name: node.name || "Unknown",
    value: node.samples || 0,
    children: node?.children?.map(formatNode),
    tooltip: node.name || "Unknown",
  };
};

const CustomFlameGraph = ({ graphData }) => {
  const formattedData = useMemo(() => {
    return formatNode(graphData);
  }, [graphData]);

  if (!formattedData) {
    return null;
  }
  return (
    <FlameGraph
      data={formattedData}
      height={1000}
      width={600}
      onChange={(node) => {
        console.log(`"${node.name}" focused`);
      }}
    />
  );
};

export default CustomFlameGraph;
