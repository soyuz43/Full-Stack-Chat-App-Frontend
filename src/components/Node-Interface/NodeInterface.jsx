// src/components/Node-Interface/NodeInterface.jsx
import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  useRef,
} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { Link } from "react-router-dom";
import CustomNode from "./CustomNode"; // Import the custom node component
import "reactflow/dist/style.css";
import "./NodeInterface.css";
import { AuthContext } from "../../context/AuthContextBase"; // Import AuthContext
import { saveWorkflow as apiSaveWorkflow, loadWorkflow as apiLoadWorkflow } from "../../api/workflowApi"; // Import API functions

// Define default nodes and edges outside the component
const DEFAULT_NODES = [
  {
    id: "input",
    type: "custom",
    data: { label: "Input", removable: false },
    position: { x: 0, y: 200 },
  },
  {
    id: "model",
    type: "custom",
    data: { label: "Model (OpenAI)", removable: false },
    position: { x: 250, y: 200 },
  },
  {
    id: "output",
    type: "custom",
    data: { label: "Output", removable: false },
    position: { x: 500, y: 200 },
  },
];

const DEFAULT_EDGES = [
  { id: "e1-2", source: "input", target: "model", animated: true },
  { id: "e2-3", source: "model", target: "output", animated: true },
];

const NodeInterface = () => {
  const { userToken, selectedSessionId } = useContext(AuthContext); // Destructure userToken and selectedSessionId from AuthContext

  const [lastNodeId, setLastNodeId] = useState("model"); // Keep track of the last node ID
  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_NODES); // Initialize with default nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState(DEFAULT_EDGES); // Initialize with default edges
  const [nodeId, setNodeId] = useState(4); // Start from 4 to avoid conflicts

  // Create a ref to hold the latest edges
  const edgesRef = useRef(edges);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Defines a callback function to handle new connections between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Function to remove a node and its associated edges after user confirmation
  const removeNode = useCallback(
    (nodeIdToRemove) => {
      if (window.confirm("Are you sure you want to delete this node?")) {
        setNodes((nds) => nds.filter((node) => node.id !== nodeIdToRemove));
        setEdges((eds) =>
          eds.filter(
            (edge) =>
              edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove
          )
        );

        // Update lastNodeId if necessary
        setLastNodeId((currentLastNodeId) => {
          if (nodeIdToRemove === currentLastNodeId) {
            // Find the previous node connected to 'currentLastNodeId'
            const connectedEdge = edgesRef.current.find(
              (edge) => edge.target === nodeIdToRemove
            );
            if (connectedEdge) {
              return connectedEdge.source;
            } else {
              return "model"; // Default to 'model' if no connected edge found
            }
          }
          return currentLastNodeId;
        });
      }
    },
    [setNodes, setEdges]
  );

  // Memoize nodeTypes to prevent recreation on every render
  const nodeTypes = useMemo(
    () => ({
      custom: (nodeProps) => (
        <CustomNode {...nodeProps} removeNode={removeNode} />
      ),
    }),
    [removeNode]
  );

  // Define the addNode function
  const addNode = () => {
    const newNodeId = `${nodeId}`; // Get the new node's ID

    const newNode = {
      id: newNodeId,
      type: "custom",
      data: { label: `Node ${nodeId}`, removable: true },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };

    setNodes((nds) => nds.concat(newNode));

    setEdges((eds) => {
      // Remove the edge from the last node to 'output'
      const filteredEdges = eds.filter(
        (edge) => !(edge.source === lastNodeId && edge.target === "output")
      );

      // Add new edges: from last node to new node, and from new node to 'output'
      return filteredEdges.concat([
        {
          id: `e${lastNodeId}-${newNodeId}`,
          source: lastNodeId,
          target: newNodeId,
        },
        { id: `e${newNodeId}-output`, source: newNodeId, target: "output" },
      ]);
    });

    setLastNodeId(newNodeId); // Update lastNodeId to the new node
    setNodeId((id) => id + 1); // Increment nodeId for the next node
  };

  // Function to save the current workflow
  const saveWorkflow = async () => {
    if (!userToken || !selectedSessionId) {
      console.error("User token or session ID is missing.");
      return;
    }

    const workflow = { nodes, edges };
    try {
      await apiSaveWorkflow(userToken, selectedSessionId, workflow);
    } catch (error) {
      console.error("Error saving workflow:", error);
      // Optionally, you can display an error message to the user here
    }
  };

  // Function to load the workflow from the backend
  const loadWorkflow = async () => {
    if (!userToken || !selectedSessionId) {
      console.error("User token or session ID is missing.");
      return;
    }

    try {
      const data = await apiLoadWorkflow(userToken, selectedSessionId);

      if (
        data.workflow &&
        data.workflow.nodes &&
        data.workflow.nodes.length > 0
      ) {
        // Ensure instructions exist for custom nodes
        const processedNodes = data.workflow.nodes.map((node) => {
          if (node.type === "custom") {
            return {
              ...node,
              data: {
                ...node.data,
                instructions: node.data.instructions || "", // Ensure instructions key exists
              },
            };
          }
          return node; // Return non-custom nodes as is
        });

        setNodes(processedNodes);
        setEdges(data.workflow.edges || []);

        // Determine the last node ID based on the loaded workflow
        const removableNodes = processedNodes.filter(
          (node) => node.data.removable
        );
        if (removableNodes.length > 0) {
          const lastNode = removableNodes[removableNodes.length - 1];
          setLastNodeId(lastNode.id);
          setNodeId(parseInt(lastNode.id, 10) + 1);
        } else {
          setLastNodeId("model");
          setNodeId(4);
        }

        console.log("Workflow loaded successfully");
      } else {
        // If the workflow is empty or improperly structured, reset to default nodes and edges
        console.warn(
          "Empty or invalid workflow received. Resetting to default nodes."
        );
        setNodes(DEFAULT_NODES);
        setEdges(DEFAULT_EDGES);
        setLastNodeId("model");
        setNodeId(4);
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      // Reset to default nodes and edges in case of any errors
      setNodes(DEFAULT_NODES);
      setEdges(DEFAULT_EDGES);
      setLastNodeId("model");
      setNodeId(4);
    }
  };

  // Load workflow when the component mounts or when selectedSessionId changes
  useEffect(() => {
    if (selectedSessionId) {
      loadWorkflow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionId]); // Only re-run when selectedSessionId changes

  return (
    <div className="node-interface-container">
      <Link to="/" className="back-link">
        &larr; Back to Chat Interface
      </Link>
      {selectedSessionId && (
        <div className="session-info">
          <h3 className="add-node-btn">
            Selected Session ID: {selectedSessionId}
          </h3>
        </div>
      )}
      <button onClick={addNode} className="add-node-btn">
        Add Node
      </button>
      <button onClick={saveWorkflow} className="save-workflow-btn">
        Save Workflow
      </button>
      <div style={{ width: "100%", height: "calc(100% - 60px)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default NodeInterface;
