import { BSTNode, CallStackFrame, SimulationStep } from '../types';
import { cloneTree } from '../utils/treeUtils';

/**
 * Lowest Common Ancestor (LCA) in BST
 */
export function generateLCASteps(
  root: BSTNode | null,
  pVal: number,
  qVal: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) return steps;

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  // Standardize so p <= q
  const minTarget = Math.min(pVal, qVal);
  const maxTarget = Math.max(pVal, qVal);

  let curr: BSTNode | null = workingTree;
  const callStack: CallStackFrame[] = [
    { id: 'frame_1', functionName: 'lowestCommonAncestor', args: `root, p=${minTarget}, q=${maxTarget}`, isActive: true },
  ];

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Finding Lowest Common Ancestor (LCA) of nodes [${minTarget}] and [${maxTarget}]. Starting at root [${curr.value}].`,
    activeCodeLine: 1,
    activeNodeId: curr.id,
    highlightedNodeIds: { [curr.id]: 'comparing' },
    highlightedEdgeKeys: {},
    callStack: [...callStack],
    log: `Starting LCA search for p=${minTarget}, q=${maxTarget} at root (${curr.value}).`,
    lcaState: { p: minTarget, q: maxTarget, currentVal: curr.value },
  });

  while (curr !== null) {
    if (minTarget < curr.value && maxTarget < curr.value) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Both targets (${minTarget}, ${maxTarget}) are LESS than [${curr.value}]. According to BST property, LCA MUST reside in LEFT subtree.`,
        activeCodeLine: 3,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `Both p and q < ${curr.value} → Navigating left.`,
        lcaState: { p: minTarget, q: maxTarget, currentVal: curr.value },
      });

      if (curr.left) {
        edgeHistory[`${curr.id}-${curr.left.id}`] = 'traversed';
        callStack.push({
          id: `frame_${stepIdx}`,
          functionName: 'lowestCommonAncestor',
          args: `root->left, p=${minTarget}, q=${maxTarget}`,
          isActive: true,
        });
        curr = curr.left;
      } else {
        break;
      }
    } else if (minTarget > curr.value && maxTarget > curr.value) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Both targets (${minTarget}, ${maxTarget}) are GREATER than [${curr.value}]. According to BST property, LCA MUST reside in RIGHT subtree.`,
        activeCodeLine: 6,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `Both p and q > ${curr.value} → Navigating right.`,
        lcaState: { p: minTarget, q: maxTarget, currentVal: curr.value },
      });

      if (curr.right) {
        edgeHistory[`${curr.id}-${curr.right.id}`] = 'traversed';
        callStack.push({
          id: `frame_${stepIdx}`,
          functionName: 'lowestCommonAncestor',
          args: `root->right, p=${minTarget}, q=${maxTarget}`,
          isActive: true,
        });
        curr = curr.right;
      } else {
        break;
      }
    } else {
      // SPLIT POINT REACHED
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `SPLIT POINT IDENTIFIED! At node [${curr.value}], targets diverge (one is on the left or equal, and the other is on the right or equal). Node [${curr.value}] is the LOWEST COMMON ANCESTOR!`,
        activeCodeLine: 9,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `LCA identified: Node (${curr.value}) is the split ancestor for ${minTarget} and ${maxTarget}.`,
        lcaState: { p: minTarget, q: maxTarget, currentVal: curr.value, splitFound: true, result: curr.value },
        helperInfo: { label: 'LCA Result', value: `LCA(${minTarget}, ${maxTarget}) = ${curr.value}`, badge: 'Split Found' },
      });
      return steps;
    }
  }

  return steps;
}

/**
 * Inorder Successor & Predecessor
 */
export function generateSuccessorPredecessorSteps(
  root: BSTNode | null,
  key: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) return steps;

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  let pre: BSTNode | null = null;
  let suc: BSTNode | null = null;
  let curr: BSTNode | null = workingTree;

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Searching for Inorder Predecessor (largest node < ${key}) and Inorder Successor (smallest node > ${key}) for key = ${key}.`,
    activeCodeLine: 1,
    activeNodeId: workingTree.id,
    highlightedNodeIds: { [workingTree.id]: 'comparing' },
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'findPreSuc', args: `root, key=${key}` }],
    log: `Starting Predecessor & Successor search for key = ${key}.`,
  });

  while (curr !== null) {
    if (curr.value === key) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Found node with matching key [${curr.value}]. Now inspecting its subtrees for predecessor and successor.`,
        activeCodeLine: 3,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [{ id: 'frame_match', functionName: 'findPreSuc', args: `curr=[${curr.value}]` }],
        log: `Key match found at ${curr.value}.`,
      });

      // Predecessor: rightmost in left subtree
      if (curr.left) {
        let temp: BSTNode = curr.left;
        while (temp.right !== null) {
          temp = temp.right;
        }
        pre = temp;
      }

      // Successor: leftmost in right subtree
      if (curr.right) {
        let temp: BSTNode = curr.right;
        while (temp.left !== null) {
          temp = temp.left;
        }
        suc = temp;
      }

      break;
    } else if (key < curr.value) {
      // Current node is a candidate successor
      suc = curr;
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Key ${key} < [${curr.value}]. Node [${curr.value}] is greater than target, so it becomes candidate SUCCESSOR. Moving left...`,
        activeCodeLine: 16,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'swapping' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [{ id: `frame_${stepIdx}`, functionName: 'findPreSuc', args: `curr=[${curr.value}] (suc candidate)` }],
        log: `Candidate Successor updated to ${curr.value}. Moving left.`,
        helperInfo: { label: 'Candidate Successor', value: `${curr.value}`, badge: 'Successor' },
      });

      if (curr.left) {
        edgeHistory[`${curr.id}-${curr.left.id}`] = 'traversed';
        curr = curr.left;
      } else {
        break;
      }
    } else {
      // Current node is a candidate predecessor
      pre = curr;
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Key ${key} > [${curr.value}]. Node [${curr.value}] is smaller than target, so it becomes candidate PREDECESSOR. Moving right...`,
        activeCodeLine: 19,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [{ id: `frame_${stepIdx}`, functionName: 'findPreSuc', args: `curr=[${curr.value}] (pre candidate)` }],
        log: `Candidate Predecessor updated to ${curr.value}. Moving right.`,
        helperInfo: { label: 'Candidate Predecessor', value: `${curr.value}`, badge: 'Predecessor' },
      });

      if (curr.right) {
        edgeHistory[`${curr.id}-${curr.right.id}`] = 'traversed';
        curr = curr.right;
      } else {
        break;
      }
    }
  }

  const highlightMap: Record<string, any> = {};
  if (pre) highlightMap[pre.id] = 'boundary_active';
  if (suc) highlightMap[suc.id] = 'found';

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `SEARCH FINISHED: Predecessor = [${pre ? pre.value : 'None'}], Successor = [${suc ? suc.value : 'None'}].`,
    activeCodeLine: 20,
    activeNodeId: null,
    highlightedNodeIds: highlightMap,
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [],
    log: `Results: Predecessor: ${pre ? pre.value : 'None'}, Successor: ${suc ? suc.value : 'None'}.`,
    helperInfo: {
      label: `Key: ${key}`,
      value: `Pre: ${pre ? pre.value : 'None'} | Suc: ${suc ? suc.value : 'None'}`,
      badge: 'Completed',
    },
  });

  return steps;
}
