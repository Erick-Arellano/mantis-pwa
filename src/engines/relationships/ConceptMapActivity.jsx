import React, { useState, useEffect, useRef } from 'react';
import './Relationships.css';

export default function ConceptMapActivity({ data }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [activeNode, setActiveNode] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (data && data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleNodeClick = (node) => {
        setActiveNode(node.id === activeNode ? null : node.id);
        // Optional: Play a sound here or reveal hidden text
    };

    if (!data) return <div>No map data available</div>;

    return (
        <div className="relationships-activity concept-map">
            <h2 className="activity-title">{data.title}</h2>
            <p className="instruction">{data.instruction}</p>

            <div className="map-container" ref={containerRef}>
                {/* SVG Layer for Drawing Connection Edges */}
                <svg className="edges-layer">
                    {edges.map((edge, idx) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);

                        if (!fromNode || !toNode) return null;

                        // Calculate if this edge involves the currently active node
                        const isActive = edge.from === activeNode || edge.to === activeNode;

                        return (
                            <line
                                key={idx}
                                x1={`${fromNode.x}%`}
                                y1={`${fromNode.y}%`}
                                x2={`${toNode.x}%`}
                                y2={`${toNode.y}%`}
                                className={`map-edge ${isActive ? 'edge-active' : ''}`}
                            />
                        );
                    })}
                </svg>

                {/* HTML Layer for Draggable/Clickable Nodes */}
                <div className="nodes-layer">
                    {nodes.map((node) => {
                        const isActive = node.id === activeNode;
                        return (
                            <div
                                key={node.id}
                                className={`map-node type-${node.type} ${isActive ? 'node-active' : ''}`}
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                onClick={() => handleNodeClick(node)}
                            >
                                <span className="node-label">{node.label}</span>
                                {/* Animated ripple effect for active nodes */}
                                {isActive && <div className="node-ripple"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Optional Sidebar or Context Panel */}
            {activeNode && (
                <div className="node-details">
                    <p>Details for: <strong>{nodes.find(n => n.id === activeNode)?.label}</strong></p>
                    <p><em>(In a full implementation, this panel can show vocabulary definitions, audio players, or images related to the specific node clicked.)</em></p>
                </div>
            )}
        </div>
    );
}
