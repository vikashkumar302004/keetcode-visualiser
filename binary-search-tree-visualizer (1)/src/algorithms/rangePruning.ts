import { BSTNode, CallStackFrame, SimulationStep } from '../types';
import { cloneTree } from '../utils/treeUtils';

/**
 * Range Sum of BST in range [low, high]
 */
export function generateRangeSumSteps(
  root: BSTNode | null,
  low: number,
  high: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) return steps;

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};
  const includedValues: number[] = [];
  let currentSum = 0;
  const nodeStatus: Record<string, any> = {};

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Calculating Range Sum for interval [${low}, ${high}]. Exploits BST property to skip subtrees outside range.`,
    activeCodeLine: 1,
    activeNodeId: workingTree.id,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'rangeSumBST', args: `root, low=${low}, high=${high}` }],
    log: `Starting range sum accumulation for [${low}, ${high}].`,
    rangeSumState: { low, high, currentSum: 0, includedValues: [] },
  });

  function helper(node: BSTNode | null, stack: CallStackFrame[]) {
    if (!node) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Reached null node. Returning 0 to parent.`,
        activeCodeLine: 2,
        activeNodeId: null,
        highlightedNodeIds: { ...nodeStatus },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Null child returns 0.`,
        rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
      });
      return;
    }

    const currentStack = [
      ...stack,
      { id: `frame_${stepIdx}`, functionName: 'rangeSumBST', args: `node=[${node.value}]`, isActive: true },
    ];

    const inRange = node.value >= low && node.value <= high;
    nodeStatus[node.id] = inRange ? 'found' : 'comparing';

    if (inRange) {
      currentSum += node.value;
      includedValues.push(node.value);

      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Node [${node.value}] is IN RANGE [${low}, ${high}]. Added to cumulative sum (+${node.value}). Current Sum = ${currentSum}.`,
        activeCodeLine: 4,
        activeNodeId: node.id,
        highlightedNodeIds: { ...nodeStatus, [node.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `Value ${node.value} is within [${low}, ${high}] → Sum updated to ${currentSum}.`,
        rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
        helperInfo: { label: 'Range Accumulator', value: `Sum: ${currentSum}`, badge: `+${node.value}` },
      });
    } else {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Node [${node.value}] is OUT OF RANGE [${low}, ${high}]. Not added to sum.`,
        activeCodeLine: 3,
        activeNodeId: node.id,
        highlightedNodeIds: { ...nodeStatus, [node.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `Value ${node.value} falls outside [${low}, ${high}].`,
        rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
      });
    }

    // Check if left branch could contain valid values: only if node.value > low
    if (node.value > low) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Since node [${node.value}] > low (${low}), left subtree may contain values in [${low}, ${high}]. Exploring left...`,
        activeCodeLine: 7,
        activeNodeId: node.id,
        highlightedNodeIds: { ...nodeStatus },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `${node.value} > ${low} → Exploring left subtree.`,
        rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
      });

      if (node.left) edgeHistory[`${node.id}-${node.left.id}`] = 'traversed';
      helper(node.left, currentStack);
    } else {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `PRUNING BRANCH: Since node [${node.value}] <= low (${low}), all left descendants are strictly < ${low}. SKIPPING entire left subtree!`,
        activeCodeLine: 6,
        activeNodeId: node.id,
        highlightedNodeIds: { ...nodeStatus },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `Branch skipped: Left subtree of ${node.value} is guaranteed < ${low}.`,
        rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
      });
    }

    // Check if right branch could contain valid values: only if node.value < high
    if (node.value < high) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Since node [${node.value}] < high (${high}), right subtree may contain values in [${low}, ${high}]. Exploring right...`,
        activeCodeLine: 10,
        activeNodeId: node.id,
        highlightedNodeIds: { ...nodeStatus },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `${node.value} < ${high} → Exploring right subtree.`,
        rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
      });

      if (node.right) edgeHistory[`${node.id}-${node.right.id}`] = 'traversed';
      helper(node.right, currentStack);
    } else {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `PRUNING BRANCH: Since node [${node.value}] >= high (${high}), all right descendants are strictly > ${high}. SKIPPING entire right subtree!`,
        activeCodeLine: 9,
        activeNodeId: node.id,
        highlightedNodeIds: { ...nodeStatus },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `Branch skipped: Right subtree of ${node.value} is guaranteed > ${high}.`,
        rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
      });
    }
  }

  helper(workingTree, []);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `RANGE SUM COMPLETED: Total Sum in [${low}, ${high}] = ${currentSum}. Included nodes: [${includedValues.join(', ')}].`,
    activeCodeLine: 13,
    activeNodeId: null,
    highlightedNodeIds: { ...nodeStatus },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [],
    log: `Final Range Sum = ${currentSum}.`,
    rangeSumState: { low, high, currentSum, includedValues: [...includedValues] },
    helperInfo: { label: 'Final Result', value: `Total Sum = ${currentSum}`, badge: 'Complete' },
  });

  return steps;
}

/**
 * Prune BST so all remaining nodes lie within [low, high]
 */
export function generatePruneBSTSteps(
  root: BSTNode | null,
  low: number,
  high: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) return steps;

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Beginning BST Structural Pruning to range [${low}, ${high}]. All nodes < ${low} or > ${high} will be safely trimmed.`,
    activeCodeLine: 1,
    activeNodeId: workingTree.id,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'pruneBST', args: `root, [${low}, ${high}]` }],
    log: `Pruning tree outside [${low}, ${high}].`,
  });

  function pruneHelper(node: BSTNode | null, stack: CallStackFrame[]): BSTNode | null {
    if (!node) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Subtree is null. Returns nullptr.`,
        activeCodeLine: 2,
        activeNodeId: null,
        highlightedNodeIds: {},
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Subtree is null.`,
      });
      return null;
    }

    const currentStack = [
      ...stack,
      { id: `frame_${stepIdx}`, functionName: 'pruneBST', args: `node=[${node.value}]`, isActive: true },
    ];

    if (node.value < low) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `PRUNING OCCURRED: Node [${node.value}] < low (${low}). Node and its ENTIRE left subtree are outside range. Replacing with right child [${node.right?.value || 'null'}].`,
        activeCodeLine: 4,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'pruned', ...(node.right ? { [node.right.id]: 'found' } : {}) },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `Pruned node ${node.value} (< ${low}). Promoting right subtree.`,
        helperInfo: { label: 'Pruned Node', value: `Node ${node.value} < ${low}`, badge: 'Discard Left' },
      });

      return pruneHelper(node.right, currentStack);
    }

    if (node.value > high) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `PRUNING OCCURRED: Node [${node.value}] > high (${high}). Node and its ENTIRE right subtree are outside range. Replacing with left child [${node.left?.value || 'null'}].`,
        activeCodeLine: 7,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'pruned', ...(node.left ? { [node.left.id]: 'found' } : {}) },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: currentStack,
        log: `Pruned node ${node.value} (> ${high}). Promoting left subtree.`,
        helperInfo: { label: 'Pruned Node', value: `Node ${node.value} > ${high}`, badge: 'Discard Right' },
      });

      return pruneHelper(node.left, currentStack);
    }

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Node [${node.value}] is VALID within [${low}, ${high}]. Retaining node and pruning left & right subtrees recursively.`,
      activeCodeLine: 9,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'found' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: currentStack,
      log: `Node ${node.value} preserved. Recursively pruning children.`,
    });

    if (node.left) edgeHistory[`${node.id}-${node.left.id}`] = 'traversed';
    node.left = pruneHelper(node.left, currentStack);

    if (node.right) edgeHistory[`${node.id}-${node.right.id}`] = 'traversed';
    node.right = pruneHelper(node.right, currentStack);

    return node;
  }

  const prunedRoot = pruneHelper(workingTree, []);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(prunedRoot),
    description: `PRUNING COMPLETE: All retained nodes strictly satisfy ${low} <= node->val <= ${high}.`,
    activeCodeLine: 11,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [],
    log: `Pruning finished. Tree updated.`,
    helperInfo: { label: 'Pruning Result', value: `Preserved within [${low}, ${high}]`, badge: 'Finished' },
  });

  return steps;
}
