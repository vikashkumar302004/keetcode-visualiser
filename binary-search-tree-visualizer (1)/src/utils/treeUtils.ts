import { BSTNode } from '../types';

let nextNodeId = 1;
export function generateNodeId(): string {
  return `node_${nextNodeId++}_${Math.random().toString(36).substring(2, 7)}`;
}

export function createBSTNode(value: number, id?: string): BSTNode {
  return {
    id: id || generateNodeId(),
    value,
    left: null,
    right: null,
  };
}

export function cloneTree(root: BSTNode | null): BSTNode | null {
  if (!root) return null;
  return {
    id: root.id,
    value: root.value,
    x: root.x,
    y: root.y,
    level: root.level,
    label: root.label,
    isVirtualNull: root.isVirtualNull,
    left: cloneTree(root.left),
    right: cloneTree(root.right),
  };
}

export function findNodeById(root: BSTNode | null, id: string): BSTNode | null {
  if (!root) return null;
  if (root.id === id) return root;
  return findNodeById(root.left, id) || findNodeById(root.right, id);
}

export function findNodeByValue(root: BSTNode | null, val: number): BSTNode | null {
  if (!root) return null;
  if (root.value === val) return root;
  if (val < root.value) return findNodeByValue(root.left, val);
  return findNodeByValue(root.right, val);
}

/**
 * Standard pure BST insertion
 */
export function insertBST(root: BSTNode | null, value: number): BSTNode {
  if (!root) return createBSTNode(value);
  if (value < root.value) {
    root.left = insertBST(root.left, value);
  } else if (value > root.value) {
    root.right = insertBST(root.right, value);
  }
  return root;
}

/**
 * Build BST from an array of numbers
 */
export function buildBSTFromValues(values: number[]): BSTNode | null {
  let root: BSTNode | null = null;
  for (const v of values) {
    root = insertBST(root, v);
  }
  return root;
}

/**
 * Inorder traversal to collect values
 */
export function inorderValues(root: BSTNode | null): number[] {
  const result: number[] = [];
  function traverse(node: BSTNode | null) {
    if (!node) return;
    traverse(node.left);
    result.push(node.value);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

/**
 * Tree height
 */
export function getTreeHeight(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeHeight(root.left), getTreeHeight(root.right));
}

/**
 * Count nodes
 */
export function countNodes(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

/**
 * Calculate aesthetic 2D coordinates for rendering the tree.
 * Uses a dynamic hierarchical spacing algorithm so nodes don't overlap.
 */
export interface LayoutDimensions {
  width: number;
  height: number;
  minX: number;
  maxX: number;
}

export function computeTreeLayout(
  root: BSTNode | null,
  canvasWidth: number = 800,
  verticalSpacing: number = 76,
  nodeRadius: number = 24
): { root: BSTNode | null; dimensions: LayoutDimensions } {
  if (!root) {
    return {
      root: null,
      dimensions: { width: canvasWidth, height: 300, minX: 0, maxX: canvasWidth },
    };
  }

  const cloned = cloneTree(root)!;
  const height = getTreeHeight(cloned);

  // Assign levels
  function assignLevels(node: BSTNode | null, level: number) {
    if (!node) return;
    node.level = level;
    assignLevels(node.left, level + 1);
    assignLevels(node.right, level + 1);
  }
  assignLevels(cloned, 0);

  // Inorder index for x coordinate spacing
  let inorderIndex = 0;
  function assignInorderX(node: BSTNode | null) {
    if (!node) return;
    assignInorderX(node.left);
    // Assign position based on inorder column
    (node as any)._inorderCol = inorderIndex++;
    assignInorderX(node.right);
  }
  assignInorderX(cloned);

  const totalCols = Math.max(inorderIndex, 1);
  // Column width adapted to total elements
  const colSpacing = Math.max(54, Math.min(84, (canvasWidth - 120) / totalCols));
  const startX = Math.max(60, (canvasWidth - totalCols * colSpacing) / 2 + colSpacing / 2);

  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;

  function finalizePositions(node: BSTNode | null) {
    if (!node) return;
    const col = (node as any)._inorderCol ?? 0;
    const computedX = startX + col * colSpacing;
    const computedY = 56 + (node.level || 0) * verticalSpacing;

    node.x = computedX;
    node.y = computedY;

    if (computedX < minX) minX = computedX;
    if (computedX > maxX) maxX = computedX;
    if (computedY > maxY) maxY = computedY;

    delete (node as any)._inorderCol;

    finalizePositions(node.left);
    finalizePositions(node.right);
  }

  finalizePositions(cloned);

  const finalWidth = Math.max(canvasWidth, maxX + 80);
  const finalHeight = Math.max(380, maxY + 90);

  return {
    root: cloned,
    dimensions: {
      width: finalWidth,
      height: finalHeight,
      minX: Math.min(minX, 40),
      maxX: Math.max(maxX, finalWidth - 40),
    },
  };
}

/**
 * Collect all edges for rendering
 */
export interface TreeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  direction: 'left' | 'right';
}

export function collectTreeEdges(root: BSTNode | null): TreeEdge[] {
  const edges: TreeEdge[] = [];
  if (!root) return edges;

  function traverse(node: BSTNode | null) {
    if (!node || node.x === undefined || node.y === undefined) return;

    if (node.left && node.left.x !== undefined && node.left.y !== undefined) {
      edges.push({
        id: `${node.id}-${node.left.id}`,
        sourceId: node.id,
        targetId: node.left.id,
        sourceX: node.x,
        sourceY: node.y,
        targetX: node.left.x,
        targetY: node.left.y,
        direction: 'left',
      });
      traverse(node.left);
    }

    if (node.right && node.right.x !== undefined && node.right.y !== undefined) {
      edges.push({
        id: `${node.id}-${node.right.id}`,
        sourceId: node.id,
        targetId: node.right.id,
        sourceX: node.x,
        sourceY: node.y,
        targetX: node.right.x,
        targetY: node.right.y,
        direction: 'right',
      });
      traverse(node.right);
    }
  }

  traverse(root);
  return edges;
}

/**
 * Pre-defined Tree Presets
 */
export const TREE_PRESETS = [
  {
    id: 'balanced_classic',
    name: 'Balanced BST (11 Nodes)',
    description: 'A well-proportioned height-balanced BST ideal for CRUD and LCA operations.',
    values: [50, 25, 75, 12, 37, 62, 87, 6, 18, 30, 80],
  },
  {
    id: 'perfect_7',
    name: 'Compact 7-Node BST',
    description: 'Perfect depth-3 binary search tree for quick visual inspections.',
    values: [40, 20, 60, 10, 30, 50, 70],
  },
  {
    id: 'skewed_left',
    name: 'Left-Leaning Skewed Tree',
    description: 'Degenerate O(n) worst-case search tree descending only to the left.',
    values: [60, 50, 40, 30, 20, 10],
  },
  {
    id: 'skewed_right',
    name: 'Right-Leaning Skewed Tree',
    description: 'Degenerate O(n) worst-case search tree ascending only to the right.',
    values: [10, 20, 30, 40, 50, 60],
  },
  {
    id: 'perfect_15',
    name: 'Full Height-Balanced (15 Nodes)',
    description: 'Fully saturated 4-level BST illustrating logarithmic divide-and-conquer.',
    values: [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 44, 56, 68, 81, 95],
  },
];
