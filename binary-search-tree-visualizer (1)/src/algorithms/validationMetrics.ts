import { BSTNode, CallStackFrame, SimulationStep } from '../types';
import { cloneTree } from '../utils/treeUtils';

/**
 * Validate BST using propagating range boundaries (minVal, maxVal)
 */
export function generateValidateBSTSteps(root: BSTNode | null): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: 'Empty tree is trivially a valid BST.',
      activeCodeLine: 2,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_1', functionName: 'isValidBST', args: 'root=nullptr, min=-∞, max=+∞' }],
      log: 'Empty tree validated as true.',
      bounds: { min: '-∞', max: '+∞', isValid: true },
    });
    return steps;
  }

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  function validateHelper(
    node: BSTNode | null,
    minVal: number,
    maxVal: number,
    minStr: string,
    maxStr: string,
    stack: CallStackFrame[]
  ): boolean {
    if (!node) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Subtree is null. Returns TRUE (null subtrees satisfy BST property).`,
        activeCodeLine: 2,
        activeNodeId: null,
        highlightedNodeIds: {},
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Subtree is null → Valid.`,
        bounds: { min: minStr, max: maxStr, isValid: true },
      });
      return true;
    }

    const currentStack = [
      ...stack,
      {
        id: `frame_${stepIdx}`,
        functionName: 'isValidBST',
        args: `node=[${node.value}], (${minStr}, ${maxStr})`,
        isActive: true,
      },
    ];

    const isCurrentValid = node.value > minVal && node.value < maxVal;

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Testing node [${node.value}]: Must satisfy ${minStr} < ${node.value} < ${maxStr}.`,
      activeCodeLine: 3,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: isCurrentValid ? 'boundary_active' : 'pruned' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Testing constraint: ${minStr} < ${node.value} < ${maxStr} → ${isCurrentValid ? 'PASSED' : 'FAILED'}`,
      bounds: {
        min: minStr,
        max: maxStr,
        currentVal: node.value,
        isValid: isCurrentValid,
      },
    });

    if (!isCurrentValid) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `VIOLATION DETECTED: Node [${node.value}] violates boundary (${minStr}, ${maxStr}). This is NOT a valid BST!`,
        activeCodeLine: 4,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'pruned' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `Validation failed at node ${node.value}. Tree is invalid.`,
        bounds: {
          min: minStr,
          max: maxStr,
          currentVal: node.value,
          isValid: false,
        },
      });
      return false;
    }

    // Check left child
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Left subtree of [${node.value}] must be strictly bounded by (${minStr}, ${node.value}).`,
      activeCodeLine: 6,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'comparing' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Recursing left subtree with updated upper bound = ${node.value}.`,
      bounds: { min: minStr, max: `${node.value}`, isValid: true },
    });

    if (node.left) edgeHistory[`${node.id}-${node.left.id}`] = 'traversed';
    const leftValid = validateHelper(node.left, minVal, node.value, minStr, `${node.value}`, currentStack);
    if (!leftValid) return false;

    // Check right child
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Right subtree of [${node.value}] must be strictly bounded by (${node.value}, ${maxStr}).`,
      activeCodeLine: 7,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'comparing' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Recursing right subtree with updated lower bound = ${node.value}.`,
      bounds: { min: `${node.value}`, max: maxStr, isValid: true },
    });

    if (node.right) edgeHistory[`${node.id}-${node.right.id}`] = 'traversed';
    const rightValid = validateHelper(node.right, node.value, maxVal, `${node.value}`, maxStr, currentStack);
    if (!rightValid) return false;

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Subtree at [${node.value}] confirmed valid (Left and Right branches satisfied).`,
      activeCodeLine: 8,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'found' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Node (${node.value}) and its entire subtree validated.`,
      bounds: { min: minStr, max: maxStr, isValid: true },
    });

    return true;
  }

  const isValid = validateHelper(workingTree, -Infinity, Infinity, '-∞', '+∞', []);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: isValid
      ? 'VALIDATION SUCCESSFUL: All nodes strictly obey the BST ordering property.'
      : 'VALIDATION COMPLETED: Tree contains violations and is NOT a valid BST.',
    activeCodeLine: 8,
    activeNodeId: null,
    highlightedNodeIds: isValid
      ? { [workingTree.id]: 'found' }
      : {},
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [],
    log: isValid ? 'Binary Search Tree is VALID.' : 'Binary Search Tree is INVALID.',
    bounds: { min: '-∞', max: '+∞', isValid },
  });

  return steps;
}

/**
 * Find Min and Max elements in BST
 */
export function generateFindMinMaxSteps(root: BSTNode | null): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: 'Tree is empty. Cannot determine minimum or maximum.',
      activeCodeLine: 2,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [],
      log: 'Empty tree.',
    });
    return steps;
  }

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  // Phase 1: Find Minimum (Leftmost branch)
  let currMin: BSTNode = workingTree;
  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `PHASE 1 (FIND MINIMUM): In a BST, the minimum element is located at the leftmost node. Starting at root [${currMin.value}].`,
    activeCodeLine: 1,
    activeNodeId: currMin.id,
    highlightedNodeIds: { [currMin.id]: 'comparing' },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [{ id: 'frame_min', functionName: 'findMin', args: `root=[${currMin.value}]` }],
    log: 'Starting search for minimum element down leftmost path.',
    helperInfo: { label: 'Min Search', value: `Current node: ${currMin.value}`, badge: 'Phase 1' },
  });

  while (currMin.left !== null) {
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Node [${currMin.value}] has left child [${currMin.left.value}]. Moving left...`,
      activeCodeLine: 4,
      activeNodeId: currMin.id,
      highlightedNodeIds: { [currMin.id]: 'comparing' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: [{ id: 'frame_min', functionName: 'findMin', args: `curr=[${currMin.value}]` }],
      log: `Traversing left to ${currMin.left.value}.`,
    });

    edgeHistory[`${currMin.id}-${currMin.left.id}`] = 'traversed';
    currMin = currMin.left;
  }

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `MINIMUM FOUND! Node [${currMin.value}] has no left child. MINIMUM VALUE = ${currMin.value}.`,
    activeCodeLine: 6,
    activeNodeId: currMin.id,
    highlightedNodeIds: { [currMin.id]: 'found' },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [{ id: 'frame_min', functionName: 'findMin', args: `result=${currMin.value}` }],
    log: `Minimum value found: ${currMin.value}.`,
    helperInfo: { label: 'Minimum Element', value: `${currMin.value}`, badge: 'Min Found' },
  });

  // Phase 2: Find Maximum (Rightmost branch)
  let currMax: BSTNode = workingTree;
  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `PHASE 2 (FIND MAXIMUM): In a BST, the maximum element is located at the rightmost node. Starting at root [${currMax.value}].`,
    activeCodeLine: 9,
    activeNodeId: currMax.id,
    highlightedNodeIds: { [currMin.id]: 'found', [currMax.id]: 'comparing' },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [{ id: 'frame_max', functionName: 'findMax', args: `root=[${currMax.value}]` }],
    log: 'Starting search for maximum element down rightmost path.',
    helperInfo: { label: 'Max Search', value: `Current node: ${currMax.value}`, badge: 'Phase 2' },
  });

  while (currMax.right !== null) {
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Node [${currMax.value}] has right child [${currMax.right.value}]. Moving right...`,
      activeCodeLine: 12,
      activeNodeId: currMax.id,
      highlightedNodeIds: { [currMin.id]: 'found', [currMax.id]: 'comparing' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: [{ id: 'frame_max', functionName: 'findMax', args: `curr=[${currMax.value}]` }],
      log: `Traversing right to ${currMax.right.value}.`,
    });

    edgeHistory[`${currMax.id}-${currMax.right.id}`] = 'traversed';
    currMax = currMax.right;
  }

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `MAXIMUM FOUND! Node [${currMax.value}] has no right child. MAXIMUM VALUE = ${currMax.value}.`,
    activeCodeLine: 14,
    activeNodeId: currMax.id,
    highlightedNodeIds: { [currMin.id]: 'found', [currMax.id]: 'found' },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [],
    log: `Results summary: Min = ${currMin.value}, Max = ${currMax.value}.`,
    helperInfo: {
      label: 'BST Extremes',
      value: `Min: ${currMin.value} | Max: ${currMax.value}`,
      badge: 'Completed',
    },
  });

  return steps;
}

/**
 * K-th Smallest or Largest element via Inorder traversal
 */
export function generateKthElementSteps(
  root: BSTNode | null,
  k: number = 3,
  mode: 'smallest' | 'largest' = 'smallest'
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) return steps;

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};
  let counter = 0;
  let resultNode: BSTNode | null = null;
  const visitedIds: Record<string, any> = {};

  const directionDesc = mode === 'smallest'
    ? 'Inorder traversal (Left → Root → Right)'
    : 'Reverse Inorder traversal (Right → Root → Left)';

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Searching for K-th ${mode === 'smallest' ? 'Smallest' : 'Largest'} element (k = ${k}) using ${directionDesc}.`,
    activeCodeLine: 1,
    activeNodeId: workingTree.id,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'kthSmallest', args: `root, k=${k}` }],
    log: `Starting K-th element search (k=${k}, mode=${mode}).`,
    kthState: { k, count: 0, mode },
  });

  function traverse(node: BSTNode | null): boolean {
    if (!node || resultNode !== null) return false;

    // First branch
    const firstBranch = mode === 'smallest' ? node.left : node.right;
    const secondBranch = mode === 'smallest' ? node.right : node.left;

    if (firstBranch) {
      edgeHistory[`${node.id}-${firstBranch.id}`] = 'traversed';
      if (traverse(firstBranch)) return true;
    }

    // Process current node
    counter++;
    visitedIds[node.id] = counter === k ? 'found' : 'comparing';

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Visited node [${node.value}] (Rank #${counter} in ${mode} order). Target k = ${k}.`,
      activeCodeLine: 5,
      activeNodeId: node.id,
      highlightedNodeIds: { ...visitedIds, [node.id]: counter === k ? 'found' : 'comparing' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: [{ id: `frame_${stepIdx}`, functionName: 'kthSmallest', args: `node=[${node.value}], count=${counter}` }],
      log: `Visited rank #${counter}: node value ${node.value}.`,
      kthState: { k, count: counter, mode, currentVal: node.value, foundVal: counter === k ? node.value : undefined },
    });

    if (counter === k) {
      resultNode = node;
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `MATCH CONFIRMED! The ${k}-th ${mode} element is node [${node.value}].`,
        activeCodeLine: 6,
        activeNodeId: node.id,
        highlightedNodeIds: { ...visitedIds, [node.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [],
        log: `Found ${k}-th ${mode} element: ${node.value}.`,
        kthState: { k, count: counter, mode, foundVal: node.value },
        helperInfo: { label: `${k}-th ${mode === 'smallest' ? 'Smallest' : 'Largest'}`, value: `${node.value}`, badge: 'Target Found' },
      });
      return true;
    }

    if (secondBranch) {
      edgeHistory[`${node.id}-${secondBranch.id}`] = 'traversed';
      if (traverse(secondBranch)) return true;
    }

    return false;
  }

  traverse(workingTree);

  if (!resultNode) {
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Tree only contains ${counter} elements, which is less than k = ${k}.`,
      activeCodeLine: 8,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: [],
      log: `Tree size (${counter}) is less than k (${k}).`,
      kthState: { k, count: counter, mode },
    });
  }

  return steps;
}
