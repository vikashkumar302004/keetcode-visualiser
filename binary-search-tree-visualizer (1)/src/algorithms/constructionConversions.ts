import { BSTNode, CallStackFrame, SimulationStep } from '../types';
import { cloneTree, createBSTNode } from '../utils/treeUtils';

/**
 * Convert Sorted Array to Height-Balanced BST
 */
export function generateSortedArrayToBSTSteps(
  elements: number[] = [10, 20, 30, 40, 50, 60, 70]
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const sorted = [...elements].sort((a, b) => a - b);
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: null,
    description: `Given sorted array [${sorted.join(', ')}]. Constructing a height-balanced BST by recursively choosing middle element as subtree root.`,
    activeCodeLine: 1,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'sortedArrayToBST', args: `nums, left=0, right=${sorted.length - 1}` }],
    log: `Starting divide-and-conquer construction from sorted array.`,
    arrayVisualizer: {
      label: 'Sorted Array',
      elements: sorted,
      range: [0, sorted.length - 1],
    },
  });

  function buildTree(
    left: number,
    right: number,
    stack: CallStackFrame[],
    currentTreeSnapshot: BSTNode | null
  ): BSTNode | null {
    if (left > right) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(currentTreeSnapshot),
        description: `Base case reached: left index (${left}) > right index (${right}). Returns nullptr.`,
        activeCodeLine: 2,
        activeNodeId: null,
        highlightedNodeIds: {},
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Sub-array range [${left}, ${right}] is empty. Returns null.`,
        arrayVisualizer: {
          label: 'Sorted Array',
          elements: sorted,
          range: [left, right],
        },
      });
      return null;
    }

    const mid = Math.floor(left + (right - left) / 2);
    const midVal = sorted[mid];
    const node = createBSTNode(midVal);

    const currentStack = [
      ...stack,
      {
        id: `frame_${stepIdx}`,
        functionName: 'sortedArrayToBST',
        args: `nums, [${left}, ${right}], mid=${mid} (${midVal})`,
        isActive: true,
      },
    ];

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(currentTreeSnapshot),
      description: `In range [${left}, ${right}], middle index is ${mid} (value = ${midVal}). Creating root node [${midVal}].`,
      activeCodeLine: 4,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'found' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Selected middle element ${midVal} at index ${mid} as root.`,
      arrayVisualizer: {
        label: 'Sorted Array',
        elements: sorted,
        range: [left, right],
        midIndex: mid,
      },
      helperInfo: { label: 'Subtree Root', value: `Mid: ${midVal} (Index ${mid})`, badge: 'Divide & Conquer' },
    });

    // Build left child
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(currentTreeSnapshot),
      description: `Constructing LEFT subtree of [${midVal}] using elements from left sub-range [${left}, ${mid - 1}].`,
      activeCodeLine: 5,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'comparing' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Recursing on left sub-range [${left}, ${mid - 1}].`,
      arrayVisualizer: {
        label: 'Sorted Array',
        elements: sorted,
        range: [left, mid - 1],
      },
    });

    node.left = buildTree(left, mid - 1, currentStack, node);

    // Build right child
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(node),
      description: `Constructing RIGHT subtree of [${midVal}] using elements from right sub-range [${mid + 1}, ${right}].`,
      activeCodeLine: 6,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'comparing' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Recursing on right sub-range [${mid + 1}, ${right}].`,
      arrayVisualizer: {
        label: 'Sorted Array',
        elements: sorted,
        range: [mid + 1, right],
      },
    });

    node.right = buildTree(mid + 1, right, currentStack, node);

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(node),
      description: `Subtree rooted at [${midVal}] fully constructed and balanced.`,
      activeCodeLine: 7,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'found' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Subtree rooted at ${midVal} assembled.`,
      arrayVisualizer: {
        label: 'Sorted Array',
        elements: sorted,
        range: [left, right],
        midIndex: mid,
      },
    });

    return node;
  }

  const finalTree = buildTree(0, sorted.length - 1, [], null);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(finalTree),
    description: `BALANCED BST CONSTRUCTED: Resulting binary search tree has minimal height O(log n) with optimal balance factor.`,
    activeCodeLine: 7,
    activeNodeId: finalTree?.id || null,
    highlightedNodeIds: finalTree ? { [finalTree.id]: 'found' } : {},
    highlightedEdgeKeys: {},
    callStack: [],
    log: `Construction complete. Height balanced BST successfully formed.`,
  });

  return steps;
}

/**
 * Convert Binary Tree to BST (Collect -> Sort -> Refill)
 */
export function generateBinaryTreeToBSTSteps(root: BSTNode | null): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) return steps;

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;

  // Phase 1: Collect values via inorder
  const collected: number[] = [];
  function collect(node: BSTNode | null) {
    if (!node) return;
    collect(node.left);
    collected.push(node.value);
    collect(node.right);
  }
  collect(workingTree);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `PHASE 1: Traversed tree structure and collected all ${collected.length} node keys: [${collected.join(', ')}].`,
    activeCodeLine: 3,
    activeNodeId: workingTree.id,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'convertBinaryTreeToBST', args: 'root' }],
    log: `Inorder traversal extracted keys: [${collected.join(', ')}].`,
    arrayVisualizer: {
      label: 'Collected Keys',
      elements: [...collected],
    },
  });

  // Phase 2: Sort collected values
  const sorted = [...collected].sort((a, b) => a - b);
  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `PHASE 2: Sorted collected values in ascending order in O(n log n) time: [${sorted.join(', ')}].`,
    activeCodeLine: 4,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'convertBinaryTreeToBST', args: 'sort(values)' }],
    log: `Values sorted: [${sorted.join(', ')}].`,
    arrayVisualizer: {
      label: 'Sorted Keys',
      elements: sorted,
    },
  });

  // Phase 3: Inorder fill
  let fillIdx = 0;
  function refill(node: BSTNode | null) {
    if (!node) return;
    refill(node.left);

    const oldVal = node.value;
    const newVal = sorted[fillIdx];
    node.value = newVal;

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `PHASE 3: Refilling node in inorder sequence. Replaced old value [${oldVal}] with sorted value [${newVal}] (index ${fillIdx}).`,
      activeCodeLine: 6,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'found' },
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_fill', functionName: 'inorderFill', args: `node, val=${newVal}` }],
      log: `Refilled node with sorted key ${newVal}.`,
      arrayVisualizer: {
        label: 'Refilling from Sorted Array',
        elements: sorted,
        activeIndex: fillIdx,
      },
    });

    fillIdx++;
    refill(node.right);
  }

  refill(workingTree);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `CONVERSION COMPLETE: All nodes now adhere strictly to the BST ordering property while preserving original tree topology.`,
    activeCodeLine: 7,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [],
    log: `Binary tree successfully converted into a valid BST.`,
  });

  return steps;
}

/**
 * BST from Preorder sequence
 */
export function generateBSTFromPreorderSteps(
  preorder: number[] = [8, 5, 1, 7, 10, 12]
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let stepIdx = 1;
  let idx = 0;

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: null,
    description: `Given Preorder sequence [${preorder.join(', ')}]. Reconstructing unique BST in O(n) time using recursive upper-bound pruning.`,
    activeCodeLine: 1,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'bstFromPreorder', args: `preorder, idx=0, bound=+∞` }],
    log: `Starting preorder BST reconstruction.`,
    arrayVisualizer: {
      label: 'Preorder Stream',
      elements: preorder,
      activeIndex: 0,
    },
  });

  function buildWithBound(bound: number, boundStr: string, stack: CallStackFrame[]): BSTNode | null {
    if (idx === preorder.length || preorder[idx] > bound) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: null,
        description: idx === preorder.length
          ? 'Stream exhausted. Returns nullptr.'
          : `Current key ${preorder[idx]} exceeds bound ${boundStr}. Returns nullptr.`,
        activeCodeLine: 2,
        activeNodeId: null,
        highlightedNodeIds: {},
        highlightedEdgeKeys: {},
        callStack: [...stack],
        log: `Bound check failed: ${idx === preorder.length ? 'End of stream' : `${preorder[idx]} > ${boundStr}`}.`,
      });
      return null;
    }

    const val = preorder[idx++];
    const node = createBSTNode(val);

    const currentStack = [
      ...stack,
      { id: `frame_${stepIdx}`, functionName: 'bstFromPreorder', args: `val=${val}, bound=${boundStr}`, isActive: true },
    ];

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(node),
      description: `Consumed element [${val}] from preorder stream (satisfies < ${boundStr}). Created node [${val}].`,
      activeCodeLine: 5,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'found' },
      highlightedEdgeKeys: {},
      callStack: currentStack,
      log: `Created node ${val}. Next assigning left child with upper bound = ${val}.`,
      arrayVisualizer: {
        label: 'Preorder Stream',
        elements: preorder,
        activeIndex: idx < preorder.length ? idx : undefined,
      },
    });

    node.left = buildWithBound(val, `${val}`, currentStack);
    node.right = buildWithBound(bound, boundStr, currentStack);

    return node;
  }

  const reconstructed = buildWithBound(Infinity, '+∞', []);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(reconstructed),
    description: `RECONSTRUCTION COMPLETE: Entire preorder stream parsed into valid BST representation.`,
    activeCodeLine: 8,
    activeNodeId: reconstructed?.id || null,
    highlightedNodeIds: reconstructed ? { [reconstructed.id]: 'found' } : {},
    highlightedEdgeKeys: {},
    callStack: [],
    log: `BST reconstructed successfully from preorder.`,
  });

  return steps;
}
