"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  label: string;
  subtitle: string;
  type: string;
  position: { x: number; y: number };
  style: { size: number; color: string };
  description: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated: boolean;
  style?: { strokeDasharray?: string; opacity?: number };
}

interface MechanismGraphProps {
  nodes: Node[];
  edges: Edge[];
  learningPath: string[];
  mode: "learning" | "explore";
  onNodeClick: (node: Node) => void;
  selectedNodeId?: string;
}

export function MechanismGraph({
  nodes,
  edges,
  learningPath,
  mode,
  onNodeClick,
  selectedNodeId,
}: MechanismGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const visibleNodes = mode === "learning"
    ? nodes.filter((n) => learningPath.slice(0, currentStep + 1).includes(n.id))
    : nodes;

  const visibleEdges = mode === "learning"
    ? edges.filter((e) =>
        learningPath.slice(0, currentStep + 1).includes(e.source) &&
        learningPath.slice(0, currentStep + 1).includes(e.target)
      )
    : edges;

  const handleNext = useCallback(() => {
    if (currentStep < learningPath.length - 1) setCurrentStep((s) => s + 1);
  }, [currentStep, learningPath.length]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  useEffect(() => {
    if (mode === "explore") setCurrentStep(learningPath.length - 1);
    else setCurrentStep(0);
  }, [mode, learningPath.length]);

  const getNodePosition = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node?.position || { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-full">
      {mode === "learning" && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            上一步
          </button>
          <span className="px-3 py-1 bg-white border rounded">
            {currentStep + 1} / {learningPath.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentStep === learningPath.length - 1}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            下一步
          </button>
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 1200 600"
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>
        {visibleEdges.map((edge) => {
          const source = getNodePosition(edge.source);
          const target = getNodePosition(edge.target);
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          const sr = (sourceNode?.style.size || 50) / 2;
          const tr = (targetNode?.style.size || 50) / 2;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const sx = source.x + (dx / dist) * sr;
          const sy = source.y + (dy / dist) * sr;
          const tx = target.x - (dx / dist) * (tr + 10);
          const ty = target.y - (dy / dist) * (tr + 10);
          return (
            <g key={edge.id}>
              <line
                x1={sx}
                y1={sy}
                x2={tx}
                y2={ty}
                stroke="#64748b"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                strokeDasharray={edge.style?.strokeDasharray}
                opacity={edge.style?.opacity || 1}
              />
              <text
                x={(sx + tx) / 2}
                y={(sy + ty) / 2 - 8}
                textAnchor="middle"
                fontSize="12"
                fill="#64748b"
              >
                {edge.label}
              </text>
            </g>
          );
        })}
        {visibleNodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.position.x}, ${node.position.y})`}
            onClick={() => onNodeClick(node)}
            className="cursor-pointer"
          >
            <circle
              r={node.style.size / 2}
              fill={node.style.color}
              stroke={selectedNodeId === node.id ? "#000" : "transparent"}
              strokeWidth="3"
              className="transition-all hover:opacity-80"
            />
            <text
              textAnchor="middle"
              dy="-0.1em"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              {node.label}
            </text>
            <text
              textAnchor="middle"
              dy="1.2em"
              fill="white"
              fontSize="9"
              opacity="0.9"
            >
              {node.subtitle.length > 10 ? node.subtitle.slice(0, 10) + "..." : node.subtitle}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
