/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TreeNode {
  id: string;
  val: number;
  leftId: string | null;
  rightId: string | null;
}

export type TreeDict = Record<string, TreeNode>;

export type NodeState = 'neutral' | 'active' | 'visited' | 'result' | 'burning' | 'burned';

export interface CallStackFrame {
  name: string;
  params: string;
  returnVal?: string;
  depth: number;
  id: string; // unique identifier for key rendering
}

export interface VisStep {
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<string, 'neutral' | 'active' | 'result'>;
  lineHighlight: number;
  callStack: CallStackFrame[];
  queue: string[]; // Node IDs
  visited: string[]; // Visited Node IDs / values
  description: string;
  metrics: {
    label: string;
    value: string | number;
  }[];
  threads?: Record<string, string>; // From ID -> To ID (For Morris Traversal visualization)
}

export type AlgorithmType =
  | 'preorder-rec'
  | 'preorder-iter'
  | 'inorder-rec'
  | 'inorder-iter'
  | 'postorder-rec'
  | 'postorder-iter'
  | 'level-order'
  | 'height'
  | 'diameter'
  | 'lca'
  | 'left-view'
  | 'right-view'
  | 'top-view'
  | 'bottom-view'
  | 'path-sum'
  | 'symmetric'
  | 'serialize-deserialize'
  | 'boundary-traversal'
  | 'morris-inorder'
  | 'burning-tree';

export interface CodeSnippet {
  language: string;
  code: string[];
}
