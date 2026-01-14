"use client";

import { useState } from "react";
import { MechanismGraph } from "@/components/mechanism/MechanismGraph";
import { data } from "@/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const nodeTypeLabels: Record<string, { label: string; color: string }> = {
  pathogen: { label: "病原体", color: "#ef4444" },
  molecule: { label: "分子", color: "#f97316" },
  cell: { label: "细胞", color: "#3b82f6" },
  signaling: { label: "信号通路", color: "#8b5cf6" },
  cytokine: { label: "细胞因子", color: "#10b981" },
  receptor: { label: "受体", color: "#a855f7" },
  effect: { label: "效应", color: "#64748b" },
  outcome: { label: "结局", color: "#dc2626" },
};

interface Node {
  id: string;
  label: string;
  subtitle: string;
  type: string;
  position: { x: number; y: number };
  style: { size: number; color: string };
  description: string;
}

export default function MechanismPage() {
  const [mode, setMode] = useState<"learning" | "explore">("learning");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{data.mechanism.name}</h1>
          <p className="text-muted-foreground text-sm">{data.mechanism.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === "learning" ? "default" : "outline"}
            onClick={() => setMode("learning")}
          >
            学习路径模式
          </Button>
          <Button
            variant={mode === "explore" ? "default" : "outline"}
            onClick={() => setMode("explore")}
          >
            自由探索模式
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardContent className="h-full p-0">
              <MechanismGraph
                nodes={data.mechanism.nodes as Node[]}
                edges={data.mechanism.edges}
                learningPath={data.mechanism.learningPath}
                mode={mode}
                onNodeClick={setSelectedNode}
                selectedNodeId={selectedNode?.id}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedNode ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedNode.style.color }}
                  />
                  <CardTitle>{selectedNode.label}</CardTitle>
                </div>
                <Badge variant="outline">
                  {nodeTypeLabels[selectedNode.type]?.label || selectedNode.type}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">{selectedNode.subtitle}</p>
                <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  点击节点查看详细信息
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">图例说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(nodeTypeLabels).map(([type, { label, color }]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
