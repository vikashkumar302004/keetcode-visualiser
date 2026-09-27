import { BSTNode, CallStackFrame, NodeHighlightStatus, SimulationStep } from '../types';
import { cloneTree, createBSTNode, findNodeById } from '../utils/treeUtils';

/**
 * Generate step-by-step frames for BST Insertion
 */
export function generateInsertSteps(
  root: BSTNode | null,
  val: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const workingTree = cloneTree(root);
  const callStack: CallStackFrame[] = [
    { id: 'frame_1', functionName: 'insert', args: `root, val=${val}`, isActive: true },
  ];

  // If tree is empty
  if (!workingTree) {
    const newRoot = createBSTNode(val);
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: `Tree is empty (root == nullptr). Creating new root node with value ${val}.`,
      activeCodeLine: 2,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [...callStack],
      log: `Tree is empty. Created root node (${val}).`,
    });

    steps.push({
      stepIndex: 2,
      treeSnapshot: newRoot,
      description: `Root node created with value ${val}. Insertion complete.`,
      activeCodeLine: 3,
      activeNodeId: newRoot.id,
      highlightedNodeIds: { [newRoot.id]: 'found' },
      highlightedEdgeKeys: {},
      callStack: [...callStack],
      log: `Successfully inserted node ${val} as tree root.`,
    });
    return steps;
  }

  // Traverse tree to find placement
  let curr: BSTNode | null = workingTree;
  let parent: BSTNode | null = null;
  let direction: 'left' | 'right' | null = null;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Begin insertion of value ${val}. Starting traversal at root (${curr.value}).`,
    activeCodeLine: 1,
    activeNodeId: curr.id,
    highlightedNodeIds: { [curr.id]: 'comparing' },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [...callStack],
    log: `Starting at root node (${curr.value}) looking to insert ${val}.`,
  });

  while (curr !== null) {
    parent = curr;
    if (val === curr.value) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Value ${val} is already present in BST at node [${curr.value}]. Duplicate values are skipped.`,
        activeCodeLine: 10,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `Duplicate value ${val} detected. Insertion aborted.`,
      });
      return steps;
    }

    if (val < curr.value) {
      callStack.push({
        id: `frame_${stepIdx}`,
        functionName: 'insert',
        args: `root->left, val=${val}`,
        isActive: true,
      });

      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Comparing: ${val} < ${curr.value}. According to BST property, branch LEFT.`,
        activeCodeLine: 5,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `${val} < ${curr.value} → Navigating to left subtree.`,
      });

      if (curr.left) {
        edgeHistory[`${curr.id}-${curr.left.id}`] = 'traversed';
        curr = curr.left;
        direction = 'left';
      } else {
        direction = 'left';
        curr = null;
      }
    } else {
      callStack.push({
        id: `frame_${stepIdx}`,
        functionName: 'insert',
        args: `root->right, val=${val}`,
        isActive: true,
      });

      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Comparing: ${val} > ${curr.value}. According to BST property, branch RIGHT.`,
        activeCodeLine: 7,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `${val} > ${curr.value} → Navigating to right subtree.`,
      });

      if (curr.right) {
        edgeHistory[`${curr.id}-${curr.right.id}`] = 'traversed';
        curr = curr.right;
        direction = 'right';
      } else {
        direction = 'right';
        curr = null;
      }
    }
  }

  // Found placement slot
  const newNode = createBSTNode(val);
  if (parent && direction === 'left') {
    parent.left = newNode;
    edgeHistory[`${parent.id}-${newNode.id}`] = 'active';
  } else if (parent && direction === 'right') {
    parent.right = newNode;
    edgeHistory[`${parent.id}-${newNode.id}`] = 'active';
  }

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Reached empty leaf slot (root == nullptr). Creating new node [${val}] as ${direction} child of parent [${parent?.value}].`,
    activeCodeLine: 3,
    activeNodeId: newNode.id,
    highlightedNodeIds: { [newNode.id]: 'found', ...(parent ? { [parent.id]: 'idle' } : {}) },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [...callStack],
    log: `Allocated new TreeNode(${val}) attached to parent (${parent?.value}) on the ${direction}.`,
  });

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Node [${val}] successfully placed and connected. Tree integrity maintained.`,
    activeCodeLine: 10,
    activeNodeId: newNode.id,
    highlightedNodeIds: { [newNode.id]: 'found' },
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [callStack[0]],
    log: `Insertion of ${val} completed successfully.`,
  });

  return steps;
}

/**
 * Generate step-by-step frames for BST Search
 */
export function generateSearchSteps(
  root: BSTNode | null,
  targetVal: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: `Tree is empty. Target value ${targetVal} cannot be found.`,
      activeCodeLine: 2,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_1', functionName: 'searchBST', args: `root=nullptr, val=${targetVal}` }],
      log: `Tree is empty. Search terminated immediately.`,
    });
    return steps;
  }

  const workingTree = cloneTree(root);
  let curr: BSTNode | null = workingTree;
  let stepIdx = 1;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};
  const callStack: CallStackFrame[] = [
    { id: 'frame_1', functionName: 'searchBST', args: `root, val=${targetVal}`, isActive: true },
  ];

  while (curr !== null) {
    if (curr.value === targetVal) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `MATCH FOUND! Node [${curr.value}] matches target search value ${targetVal}.`,
        activeCodeLine: 3,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `Target node (${targetVal}) located successfully in O(h) steps.`,
        helperInfo: { label: 'Search Status', value: `Found node ${targetVal}`, badge: 'Success' },
      });
      return steps;
    }

    if (targetVal < curr.value) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Comparing at node [${curr.value}]: Target ${targetVal} < ${curr.value}. Branching LEFT.`,
        activeCodeLine: 5,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `${targetVal} < ${curr.value} → Navigating left child.`,
        helperInfo: { label: 'Comparison', value: `${targetVal} < ${curr.value}`, badge: 'Branch Left' },
      });

      if (curr.left) {
        edgeHistory[`${curr.id}-${curr.left.id}`] = 'traversed';
        callStack.push({
          id: `frame_${stepIdx}`,
          functionName: 'searchBST',
          args: `root->left, val=${targetVal}`,
          isActive: true,
        });
        curr = curr.left;
      } else {
        curr = null;
      }
    } else {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Comparing at node [${curr.value}]: Target ${targetVal} > ${curr.value}. Branching RIGHT.`,
        activeCodeLine: 7,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...callStack],
        log: `${targetVal} > ${curr.value} → Navigating right child.`,
        helperInfo: { label: 'Comparison', value: `${targetVal} > ${curr.value}`, badge: 'Branch Right' },
      });

      if (curr.right) {
        edgeHistory[`${curr.id}-${curr.right.id}`] = 'traversed';
        callStack.push({
          id: `frame_${stepIdx}`,
          functionName: 'searchBST',
          args: `root->right, val=${targetVal}`,
          isActive: true,
        });
        curr = curr.right;
      } else {
        curr = null;
      }
    }
  }

  // Not found
  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Reached nullptr. Target value ${targetVal} does NOT exist in the tree.`,
    activeCodeLine: 2,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [...callStack],
    log: `Target ${targetVal} not found in binary search tree.`,
    helperInfo: { label: 'Search Status', value: `Key ${targetVal} absent`, badge: 'Not Found' },
  });

  return steps;
}

/**
 * Generate step-by-step frames for BST Deletion demonstrating all 3 cases:
 * Case 1: Leaf node (direct disconnect)
 * Case 2: Single child (bypass)
 * Case 3: Two children (inorder successor find, value copy, recursive deletion)
 */
export function generateDeleteSteps(
  root: BSTNode | null,
  key: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: `Tree is empty. Cannot delete key ${key}.`,
      activeCodeLine: 2,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_1', functionName: 'deleteNode', args: `root=nullptr, key=${key}` }],
      log: `Tree is empty. Deletion cannot proceed.`,
    });
    return steps;
  }

  let stepIdx = 1;
  const workingTree = cloneTree(root)!;
  const edgeHistory: Record<string, 'active' | 'traversed' | 'pruned'> = {};

  function deleteHelper(
    node: BSTNode | null,
    parent: BSTNode | null,
    targetKey: number,
    stack: CallStackFrame[]
  ): BSTNode | null {
    if (!node) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Key ${targetKey} not found in BST. Nothing to delete.`,
        activeCodeLine: 2,
        activeNodeId: null,
        highlightedNodeIds: {},
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Key ${targetKey} not found in tree.`,
      });
      return null;
    }

    // Comparing
    if (targetKey < node.value) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Key ${targetKey} < [${node.value}]. Navigating left to find target node.`,
        activeCodeLine: 3,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `${targetKey} < ${node.value} → Navigating left.`,
      });

      if (node.left) edgeHistory[`${node.id}-${node.left.id}`] = 'traversed';
      const newStack = [
        ...stack,
        { id: `frame_${stepIdx}`, functionName: 'deleteNode', args: `node->left, ${targetKey}`, isActive: true },
      ];
      node.left = deleteHelper(node.left, node, targetKey, newStack);
      return node;
    } else if (targetKey > node.value) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Key ${targetKey} > [${node.value}]. Navigating right to find target node.`,
        activeCodeLine: 5,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `${targetKey} > ${node.value} → Navigating right.`,
      });

      if (node.right) edgeHistory[`${node.id}-${node.right.id}`] = 'traversed';
      const newStack = [
        ...stack,
        { id: `frame_${stepIdx}`, functionName: 'deleteNode', args: `node->right, ${targetKey}`, isActive: true },
      ];
      node.right = deleteHelper(node.right, node, targetKey, newStack);
      return node;
    } else {
      // TARGET FOUND!
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `TARGET FOUND: Node [${node.value}] identified for deletion. Inspecting child count...`,
        activeCodeLine: 8,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Identified target node (${node.value}) for removal.`,
      });

      // CASE 1: Leaf Node
      if (!node.left && !node.right) {
        steps.push({
          stepIndex: stepIdx++,
          treeSnapshot: cloneTree(workingTree),
          description: `CASE 1 (LEAF NODE): Node [${node.value}] has NO children. Directly disconnecting and freeing memory.`,
          activeCodeLine: 10,
          activeNodeId: node.id,
          highlightedNodeIds: { [node.id]: 'pruned' },
          highlightedEdgeKeys: { ...edgeHistory },
          callStack: [...stack],
          log: `Case 1: Node (${node.value}) is a leaf. Disconnecting from parent.`,
          helperInfo: { label: 'Deletion Case', value: 'Case 1: Leaf Node', badge: 'Direct Disconnect' },
        });

        return null;
      }

      // CASE 2: Single Child (Only right child)
      if (!node.left) {
        const temp = node.right;
        steps.push({
          stepIndex: stepIdx++,
          treeSnapshot: cloneTree(workingTree),
          description: `CASE 2 (SINGLE CHILD): Node [${node.value}] has only a RIGHT child [${temp?.value}]. Bypassing node link directly to child.`,
          activeCodeLine: 16,
          activeNodeId: node.id,
          highlightedNodeIds: { [node.id]: 'pruned', ...(temp ? { [temp.id]: 'found' } : {}) },
          highlightedEdgeKeys: { ...edgeHistory },
          callStack: [...stack],
          log: `Case 2: Node (${node.value}) has only right child (${temp?.value}). Promoting right child.`,
          helperInfo: { label: 'Deletion Case', value: 'Case 2: Single Child (Right)', badge: 'Parent Link Bypass' },
        });

        return temp;
      }

      // CASE 2: Single Child (Only left child)
      if (!node.right) {
        const temp = node.left;
        steps.push({
          stepIndex: stepIdx++,
          treeSnapshot: cloneTree(workingTree),
          description: `CASE 2 (SINGLE CHILD): Node [${node.value}] has only a LEFT child [${temp?.value}]. Bypassing node link directly to child.`,
          activeCodeLine: 20,
          activeNodeId: node.id,
          highlightedNodeIds: { [node.id]: 'pruned', ...(temp ? { [temp.id]: 'found' } : {}) },
          highlightedEdgeKeys: { ...edgeHistory },
          callStack: [...stack],
          log: `Case 2: Node (${node.value}) has only left child (${temp?.value}). Promoting left child.`,
          helperInfo: { label: 'Deletion Case', value: 'Case 2: Single Child (Left)', badge: 'Parent Link Bypass' },
        });

        return temp;
      }

      // CASE 3: Two Children (Inorder Successor)
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `CASE 3 (TWO CHILDREN): Node [${node.value}] has both left & right subtrees. Finding Inorder Successor (smallest node in right subtree)...`,
        activeCodeLine: 24,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Case 3: Node (${node.value}) has 2 children. Initiating Inorder Successor search in right subtree.`,
        inorderSuccessorTrace: {
          targetVal: node.value,
          phase: 'finding_successor',
          details: `Searching leftmost node in right subtree rooted at (${node.right.value}).`,
        },
      });

      // Find Inorder Successor: leftmost node in right subtree
      let succ: BSTNode = node.right;
      while (succ.left !== null) {
        succ = succ.left;
      }

      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `INORDER SUCCESSOR IDENTIFIED: Node [${succ.value}] is the smallest key in right subtree (strictly next in sorted order).`,
        activeCodeLine: 24,
        activeNodeId: succ.id,
        highlightedNodeIds: { [node.id]: 'comparing', [succ.id]: 'swapping' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Found Inorder Successor: (${succ.value}). Next step is copying value to target node.`,
        inorderSuccessorTrace: {
          targetVal: node.value,
          successorVal: succ.value,
          phase: 'swapping',
          details: `Inorder successor is (${succ.value}). Value will overwrite (${node.value}).`,
        },
      });

      // Copy successor value into node
      const oldVal = node.value;
      node.value = succ.value;

      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `VALUE REPLACEMENT: Overwrote target node value ${oldVal} with successor value ${succ.value}. Now recursively deleting duplicate successor node from right subtree.`,
        activeCodeLine: 25,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'found', [succ.id]: 'swapping' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Overwrote node value with ${succ.value}. Recursively deleting ${succ.value} from right subtree.`,
        inorderSuccessorTrace: {
          targetVal: oldVal,
          successorVal: succ.value,
          phase: 'deleting_leaf',
          details: `Recursively deleting node (${succ.value}) from right branch.`,
        },
      });

      const succStack = [
        ...stack,
        { id: `frame_${stepIdx}`, functionName: 'deleteNode', args: `node->right, key=${succ.value}`, isActive: true },
      ];
      node.right = deleteHelper(node.right, node, succ.value, succStack);

      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `CASE 3 RESOLVED: Successor duplicate deleted. BST property fully preserved with new value [${node.value}] at target position.`,
        activeCodeLine: 26,
        activeNodeId: node.id,
        highlightedNodeIds: { [node.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [...stack],
        log: `Deletion of ${targetKey} completed successfully via Case 3.`,
        inorderSuccessorTrace: {
          targetVal: oldVal,
          successorVal: succ.value,
          phase: 'done',
          details: `Case 3 completed.`,
        },
      });

      return node;
    }
  }

  const initialStack: CallStackFrame[] = [
    { id: 'frame_1', functionName: 'deleteNode', args: `root, key=${key}`, isActive: true },
  ];

  const updatedRoot = deleteHelper(workingTree, null, key, initialStack);

  // Final cleanup step
  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(updatedRoot),
    description: `Deletion operation complete. Binary Search Tree structure is valid and balanced.`,
    activeCodeLine: 27,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: {},
    callStack: [],
    log: `Tree updated and stabilized.`,
  });

  return steps;
}
