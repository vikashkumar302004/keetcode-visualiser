import { BSTNode, CallStackFrame, SimulationStep } from '../types';
import { cloneTree, inorderValues } from '../utils/treeUtils';

/**
 * 1. Two Sum IV - Input is a BST (LeetCode #653)
 * Uses In-order Traversal to extract sorted array, then Two-Pointer technique
 */
export function generateTwoSumBSTSteps(root: BSTNode | null, target: number = 75): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: 'Tree is empty. Cannot find any pair matching target.',
      activeCodeLine: 8,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_1', functionName: 'findTarget', args: `root=nullptr, k=${target}` }],
      log: 'Empty tree → false.',
    });
    return steps;
  }

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;

  // Step 1: Collect inorder elements
  const nodesInOrder: BSTNode[] = [];
  function getNodes(n: BSTNode | null) {
    if (!n) return;
    getNodes(n.left);
    nodesInOrder.push(n);
    getNodes(n.right);
  }
  getNodes(workingTree);

  const nums = nodesInOrder.map((n) => n.value);

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Initiate Two Sum IV for target k = ${target}. First, perform In-Order traversal to generate a sorted array.`,
    activeCodeLine: 8,
    activeNodeId: workingTree.id,
    highlightedNodeIds: { [workingTree.id]: 'comparing' },
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_main', functionName: 'findTarget', args: `root=[${workingTree.value}], k=${target}` }],
    log: `Starting Two Sum IV on BST for k=${target}.`,
    twoSumState: { target, found: false },
    arrayVisualizer: { label: 'Sorted BST Inorder Array', elements: nums },
  });

  // Highlight all nodes in sorted order
  const nodeStatusMap: Record<string, 'found' | 'highlight'> = {};
  nodesInOrder.forEach((n) => {
    nodeStatusMap[n.id] = 'highlight';
  });

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `BST In-Order traversal yielded sorted sequence: [${nums.join(', ')}]. Now initialize two pointers at both ends.`,
    activeCodeLine: 9,
    activeNodeId: null,
    highlightedNodeIds: { ...nodeStatusMap },
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_main', functionName: 'findTarget', args: `nums.size()=${nums.length}, k=${target}` }],
    log: `In-Order sorted array: [${nums.join(', ')}]. Pointers: left=0, right=${nums.length - 1}.`,
    twoSumState: {
      target,
      leftVal: nums[0],
      rightVal: nums[nums.length - 1],
      currentSum: nums[0] + nums[nums.length - 1],
      found: false,
    },
    arrayVisualizer: {
      label: 'Two-Pointer Search: left at 0, right at ' + (nums.length - 1),
      elements: nums,
      range: [0, nums.length - 1],
    },
  });

  let left = 0;
  let right = nums.length - 1;
  let pairFound = false;

  while (left < right) {
    const leftVal = nums[left];
    const rightVal = nums[right];
    const leftNode = nodesInOrder[left];
    const rightNode = nodesInOrder[right];
    const currentSum = leftVal + rightVal;

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Evaluate sum: nums[${left}] (${leftVal}) + nums[${right}] (${rightVal}) = ${currentSum} (Target = ${target}).`,
      activeCodeLine: 11,
      activeNodeId: null,
      highlightedNodeIds: {
        [leftNode.id]: 'comparing',
        [rightNode.id]: 'comparing',
      },
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_main', functionName: 'findTarget', args: `left=${left}(${leftVal}), right=${right}(${rightVal})` }],
      log: `Comparing sum: ${leftVal} + ${rightVal} = ${currentSum} vs target ${target}.`,
      twoSumState: {
        target,
        leftVal,
        rightVal,
        currentSum,
        found: false,
      },
      arrayVisualizer: {
        label: `Current Sum: ${leftVal} + ${rightVal} = ${currentSum}`,
        elements: nums,
        range: [left, right],
      },
    });

    if (currentSum === target) {
      pairFound = true;
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `MATCH FOUND! Node [${leftVal}] and Node [${rightVal}] sum exactly to target ${target}. Returns TRUE.`,
        activeCodeLine: 12,
        activeNodeId: null,
        highlightedNodeIds: {
          [leftNode.id]: 'found',
          [rightNode.id]: 'found',
        },
        highlightedEdgeKeys: {},
        callStack: [{ id: 'frame_main', functionName: 'findTarget', args: `return true` }],
        log: `Success: Found valid pair [${leftVal}, ${rightVal}] summing to ${target}.`,
        twoSumState: {
          target,
          leftVal,
          rightVal,
          currentSum,
          found: true,
          pair: [leftVal, rightVal],
        },
        arrayVisualizer: {
          label: `Pair Found: ${leftVal} + ${rightVal} = ${target}`,
          elements: nums,
          range: [left, right],
        },
      });
      break;
    } else if (currentSum < target) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Sum ${currentSum} < ${target}. To increase the sum, increment left pointer (${left} → ${left + 1}).`,
        activeCodeLine: 13,
        activeNodeId: null,
        highlightedNodeIds: {
          [leftNode.id]: 'swapping',
          [rightNode.id]: 'comparing',
        },
        highlightedEdgeKeys: {},
        callStack: [{ id: 'frame_main', functionName: 'findTarget', args: `left++ → ${left + 1}` }],
        log: `Sum ${currentSum} < ${target} → increment left to ${left + 1}.`,
        twoSumState: {
          target,
          leftVal,
          rightVal,
          currentSum,
          found: false,
        },
        arrayVisualizer: {
          label: `Sum ${currentSum} < ${target} → advance left`,
          elements: nums,
          range: [left + 1, right],
        },
      });
      left++;
    } else {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Sum ${currentSum} > ${target}. To decrease the sum, decrement right pointer (${right} → ${right - 1}).`,
        activeCodeLine: 14,
        activeNodeId: null,
        highlightedNodeIds: {
          [leftNode.id]: 'comparing',
          [rightNode.id]: 'swapping',
        },
        highlightedEdgeKeys: {},
        callStack: [{ id: 'frame_main', functionName: 'findTarget', args: `right-- → ${right - 1}` }],
        log: `Sum ${currentSum} > ${target} → decrement right to ${right - 1}.`,
        twoSumState: {
          target,
          leftVal,
          rightVal,
          currentSum,
          found: false,
        },
        arrayVisualizer: {
          label: `Sum ${currentSum} > ${target} → decrement right`,
          elements: nums,
          range: [left, right - 1],
        },
      });
      right--;
    }
  }

  if (!pairFound) {
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Pointers met (left >= right). No two distinct nodes sum to ${target}. Returns FALSE.`,
      activeCodeLine: 16,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_main', functionName: 'findTarget', args: `return false` }],
      log: `Search exhausted: No pair found summing to ${target}.`,
      twoSumState: {
        target,
        found: false,
      },
      arrayVisualizer: {
        label: `No pair found for target ${target}`,
        elements: nums,
      },
    });
  }

  return steps;
}

/**
 * 2. Convert BST to Greater Tree / Greater Sum Tree (LeetCode #538 & #1038)
 * Traversal Pattern: Reverse In-Order (Right -> Root -> Left) with Running Accumulator
 */
export function generateGreaterSumTreeSteps(root: BSTNode | null): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: 'Tree is empty. Nothing to convert.',
      activeCodeLine: 3,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_1', functionName: 'convertBST', args: 'root=nullptr' }],
      log: 'Empty tree converted.',
      greaterSumState: { runningSum: 0 },
    });
    return steps;
  }

  const workingTree = cloneTree(root)!;
  let stepIdx = 1;
  let runningSum = 0;
  const edgeHistory: Record<string, 'active' | 'traversed'> = {};

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Begin BST to Greater Sum Tree conversion. We traverse in REVERSE IN-ORDER (Right → Root → Left), accumulating node keys.`,
    activeCodeLine: 2,
    activeNodeId: workingTree.id,
    highlightedNodeIds: { [workingTree.id]: 'comparing' },
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'convertBST', args: `root=[${workingTree.value}]` }],
    log: `Starting Reverse In-Order traversal at root [${workingTree.value}], accumulator sum = 0.`,
    greaterSumState: { runningSum: 0 },
  });

  function reverseInorder(node: BSTNode | null, stack: CallStackFrame[]) {
    if (!node) {
      return;
    }

    const currentFrame: CallStackFrame = {
      id: `frame_${stepIdx}`,
      functionName: 'convertBST',
      args: `node=[${node.value}]`,
      isActive: true,
    };
    const nextStack = [...stack, currentFrame];

    // 1. Recurse right subtree first
    if (node.right) {
      edgeHistory[`${node.id}->${node.right.id}`] = 'active';
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Recurse right from [${node.value}] to greater nodes at [${node.right.value}].`,
        activeCodeLine: 4,
        activeNodeId: node.right.id,
        highlightedNodeIds: { [node.id]: 'highlight', [node.right.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: nextStack,
        log: `Visiting right child [${node.right.value}] of node [${node.value}].`,
        greaterSumState: { runningSum },
      });
      edgeHistory[`${node.id}->${node.right.id}`] = 'traversed';
    }

    reverseInorder(node.right, nextStack);

    // 2. Process current node
    const prevNodeVal = node.value;
    runningSum += node.value;
    node.value = runningSum;

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `Visit node: Add original value ${prevNodeVal} to sum (Sum: ${runningSum - prevNodeVal} + ${prevNodeVal} = ${runningSum}). Update node to ${runningSum}.`,
      activeCodeLine: 6,
      activeNodeId: node.id,
      highlightedNodeIds: { [node.id]: 'found' },
      highlightedEdgeKeys: { ...edgeHistory },
      callStack: nextStack,
      log: `Node updated: [${prevNodeVal}] → [${runningSum}]. Running sum is now ${runningSum}.`,
      greaterSumState: {
        runningSum,
        currentNodeVal: prevNodeVal,
        newCumulativeVal: runningSum,
      },
    });

    // 3. Recurse left subtree
    if (node.left) {
      edgeHistory[`${node.id}->${node.left.id}`] = 'active';
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Recurse left from [${runningSum}] to smaller nodes at [${node.left.value}].`,
        activeCodeLine: 7,
        activeNodeId: node.left.id,
        highlightedNodeIds: { [node.id]: 'highlight', [node.left.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: nextStack,
        log: `Visiting left child [${node.left.value}] of node [${runningSum}].`,
        greaterSumState: { runningSum },
      });
      edgeHistory[`${node.id}->${node.left.id}`] = 'traversed';
    }

    reverseInorder(node.left, nextStack);
  }

  reverseInorder(workingTree, []);

  // Completion step
  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Conversion complete! Every node has been replaced with the sum of itself plus all greater keys.`,
    activeCodeLine: 8,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [{ id: 'frame_done', functionName: 'convertBST', args: 'return root' }],
    log: `Greater Sum Tree transformation finished. Final total sum = ${runningSum}.`,
    greaterSumState: { runningSum },
  });

  return steps;
}

/**
 * 3. Recover Binary Search Tree (LeetCode #99)
 * Traversal Pattern: In-Order Inversion Detection & Node Swapping
 */
export function generateRecoverBSTSteps(root: BSTNode | null): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: 'Tree is empty. Cannot recover.',
      activeCodeLine: 12,
      activeNodeId: null,
      highlightedNodeIds: {},
      highlightedEdgeKeys: {},
      callStack: [],
      log: 'Empty tree.',
    });
    return steps;
  }

  // To simulate LeetCode #99 reliably, we intentionally swap two nodes in a copy of the tree if it's already a valid BST
  const workingTree = cloneTree(root)!;
  const nodesInOrder: BSTNode[] = [];
  function collect(n: BSTNode | null) {
    if (!n) return;
    collect(n.left);
    nodesInOrder.push(n);
    collect(n.right);
  }
  collect(workingTree);

  // If tree has at least 4 nodes, swap two nodes (e.g. index 1 and index 4 or 5) to create an explicit violation
  let swappedA: BSTNode | null = null;
  let swappedB: BSTNode | null = null;
  if (nodesInOrder.length >= 4) {
    swappedA = nodesInOrder[1]; // e.g. 25
    swappedB = nodesInOrder[nodesInOrder.length - 2]; // e.g. 75 or 62
    const temp = swappedA.value;
    swappedA.value = swappedB.value;
    swappedB.value = temp;
  }

  let stepIdx = 1;

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Begin Recover BST. Two nodes in this tree were swapped by mistake (${swappedA?.value} and ${swappedB?.value}). We use In-Order traversal to identify inversion violations where prev->val > curr->val.`,
    activeCodeLine: 12,
    activeNodeId: workingTree.id,
    highlightedNodeIds: {
      ...(swappedA ? { [swappedA.id]: 'comparing' } : {}),
      ...(swappedB ? { [swappedB.id]: 'comparing' } : {}),
    },
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'recoverTree', args: `root=[${workingTree.value}]` }],
    log: `Starting Recover BST traversal. Tracking prev, first, and second pointers.`,
    recoverBSTState: { phase: 'detecting' },
  });

  let first: BSTNode | null = null;
  let second: BSTNode | null = null;
  let prev: BSTNode | null = null;

  function inorder(n: BSTNode | null) {
    if (!n) return;

    inorder(n.left);

    // Check violation
    if (prev && prev.value > n.value) {
      if (!first) {
        first = prev;
        second = n;
        steps.push({
          stepIndex: stepIdx++,
          treeSnapshot: cloneTree(workingTree),
          description: `INVERSION DETECTED: prev [${prev.value}] > curr [${n.value}]. Set first = [${prev.value}], candidate second = [${n.value}].`,
          activeCodeLine: 6,
          activeNodeId: n.id,
          highlightedNodeIds: {
            [prev.id]: 'swapping',
            [n.id]: 'comparing',
          },
          highlightedEdgeKeys: {},
          callStack: [{ id: 'frame_inorder', functionName: 'inorder', args: `violation detected: ${prev.value} > ${n.value}` }],
          log: `First violation found: prev [${prev.value}] > curr [${n.value}]. first=[${prev.value}].`,
          recoverBSTState: {
            firstVal: first.value,
            secondVal: second.value,
            prevVal: prev.value,
            phase: 'detecting',
          },
        });
      } else {
        second = n;
        steps.push({
          stepIndex: stepIdx++,
          treeSnapshot: cloneTree(workingTree),
          description: `SECOND INVERSION DETECTED: prev [${prev.value}] > curr [${n.value}]. Update second = [${n.value}].`,
          activeCodeLine: 7,
          activeNodeId: n.id,
          highlightedNodeIds: {
            [first.id]: 'swapping',
            [n.id]: 'swapping',
          },
          highlightedEdgeKeys: {},
          callStack: [{ id: 'frame_inorder', functionName: 'inorder', args: `second violation: curr=[${n.value}]` }],
          log: `Second violation found: Updating second to [${n.value}].`,
          recoverBSTState: {
            firstVal: first.value,
            secondVal: second.value,
            prevVal: prev.value,
            phase: 'detecting',
          },
        });
      }
    } else {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Inorder visit node [${n.value}]. ${prev ? `Sorted order check (${prev.value} <= ${n.value}) holds.` : 'First node.'}`,
        activeCodeLine: 9,
        activeNodeId: n.id,
        highlightedNodeIds: { [n.id]: 'highlight' },
        highlightedEdgeKeys: {},
        callStack: [{ id: 'frame_inorder', functionName: 'inorder', args: `curr=[${n.value}]` }],
        log: `Inorder visit [${n.value}], prev=[${prev?.value ?? 'null'}].`,
        recoverBSTState: {
          firstVal: first ? (first as BSTNode).value : undefined,
          secondVal: second ? (second as BSTNode).value : undefined,
          prevVal: n.value,
          phase: 'detecting',
        },
      });
    }

    prev = n;
    inorder(n.right);
  }

  inorder(workingTree);

  // Perform Swap if violations found
  if (first && second) {
    const fNode = first as BSTNode;
    const sNode = second as BSTNode;
    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `In-order traversal completed. Both swapped nodes isolated: Node [${fNode.value}] and Node [${sNode.value}]. Now perform swap(first->val, second->val).`,
      activeCodeLine: 14,
      activeNodeId: null,
      highlightedNodeIds: {
        [fNode.id]: 'swapping',
        [sNode.id]: 'swapping',
      },
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_swap', functionName: 'swap', args: `first->val (${fNode.value}), second->val (${sNode.value})` }],
      log: `Swapping values back: ${fNode.value} <-> ${sNode.value}.`,
      recoverBSTState: {
        firstVal: fNode.value,
        secondVal: sNode.value,
        phase: 'swapping',
      },
    });

    const tempVal = fNode.value;
    fNode.value = sNode.value;
    sNode.value = tempVal;

    steps.push({
      stepIndex: stepIdx++,
      treeSnapshot: cloneTree(workingTree),
      description: `SUCCESS! Swapped [${tempVal}] and [${fNode.value}]. The tree is now fully recovered and satisfies all BST invariants!`,
      activeCodeLine: 15,
      activeNodeId: null,
      highlightedNodeIds: {
        [fNode.id]: 'found',
        [sNode.id]: 'found',
      },
      highlightedEdgeKeys: {},
      callStack: [{ id: 'frame_done', functionName: 'recoverTree', args: 'done' }],
      log: `Tree recovered! Nodes restored to correct BST positions.`,
      recoverBSTState: {
        firstVal: fNode.value,
        secondVal: sNode.value,
        phase: 'done',
      },
    });
  }

  return steps;
}

/**
 * 4. Closest Binary Search Tree Value (LeetCode #270)
 * Traversal Pattern: Min-Difference Binary Search Path
 */
export function generateClosestValueSteps(root: BSTNode | null, target: number = 34): SimulationStep[] {
  const steps: SimulationStep[] = [];
  if (!root) {
    steps.push({
      stepIndex: 1,
      treeSnapshot: null,
      description: 'Tree is empty.',
      activeCodeLine: 1,
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
  let closest = workingTree.value;
  let curr: BSTNode | null = workingTree;
  const edgeHistory: Record<string, 'active' | 'traversed'> = {};

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Find value closest to target = ${target}. Initialize closest = root.val (${workingTree.value}) with initial difference |${workingTree.value} - ${target}| = ${Math.abs(workingTree.value - target)}.`,
    activeCodeLine: 2,
    activeNodeId: workingTree.id,
    highlightedNodeIds: { [workingTree.id]: 'comparing' },
    highlightedEdgeKeys: {},
    callStack: [{ id: 'frame_1', functionName: 'closestValue', args: `root=[${workingTree.value}], target=${target}` }],
    log: `Starting search for closest value to ${target}. Initial closest = ${closest}.`,
    closestValueState: {
      target,
      closestVal: closest,
      minDiff: Math.abs(closest - target),
      currentDiff: Math.abs(closest - target),
    },
  });

  while (curr !== null) {
    const currentDiff = Math.abs(curr.value - target);
    const minDiff = Math.abs(closest - target);

    if (currentDiff < minDiff) {
      closest = curr.value;
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Node [${curr.value}] has smaller difference |${curr.value} - ${target}| = ${currentDiff} < ${minDiff}. Update closest = ${curr.value}!`,
        activeCodeLine: 6,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [{ id: 'frame_update', functionName: 'closestValue', args: `closest = ${closest}` }],
        log: `Updated closest to [${closest}] (difference = ${currentDiff}).`,
        closestValueState: {
          target,
          closestVal: closest,
          minDiff: currentDiff,
          currentDiff,
        },
      });
    } else {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Inspecting Node [${curr.value}]: difference = |${curr.value} - ${target}| = ${currentDiff}. Current best is still [${closest}] (diff = ${minDiff}).`,
        activeCodeLine: 5,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'comparing' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [{ id: 'frame_inspect', functionName: 'closestValue', args: `curr=[${curr.value}]` }],
        log: `Node [${curr.value}] diff = ${currentDiff} >= current best ${minDiff}.`,
        closestValueState: {
          target,
          closestVal: closest,
          minDiff,
          currentDiff,
        },
      });
    }

    if (target === curr.value) {
      steps.push({
        stepIndex: stepIdx++,
        treeSnapshot: cloneTree(workingTree),
        description: `Exact match found! Target ${target} == Node [${curr.value}]. Difference is 0.`,
        activeCodeLine: 12,
        activeNodeId: curr.id,
        highlightedNodeIds: { [curr.id]: 'found' },
        highlightedEdgeKeys: { ...edgeHistory },
        callStack: [{ id: 'frame_exact', functionName: 'closestValue', args: `return ${curr.value}` }],
        log: `Exact target match: ${curr.value}.`,
        closestValueState: {
          target,
          closestVal: curr.value,
          minDiff: 0,
          currentDiff: 0,
        },
      });
      break;
    }

    if (target < curr.value) {
      if (curr.left) {
        edgeHistory[`${curr.id}->${curr.left.id}`] = 'active';
        steps.push({
          stepIndex: stepIdx++,
          treeSnapshot: cloneTree(workingTree),
          description: `Target (${target}) < Node [${curr.value}]. Move LEFT to [${curr.left.value}] where smaller candidates lie.`,
          activeCodeLine: 8,
          activeNodeId: curr.left.id,
          highlightedNodeIds: { [curr.id]: 'highlight', [curr.left.id]: 'comparing' },
          highlightedEdgeKeys: { ...edgeHistory },
          callStack: [{ id: 'frame_branch', functionName: 'closestValue', args: `curr = curr->left` }],
          log: `Navigating left from [${curr.value}] to [${curr.left.value}].`,
          closestValueState: {
            target,
            closestVal: closest,
            minDiff: Math.abs(closest - target),
          },
        });
        edgeHistory[`${curr.id}->${curr.left.id}`] = 'traversed';
      }
      curr = curr.left;
    } else {
      if (curr.right) {
        edgeHistory[`${curr.id}->${curr.right.id}`] = 'active';
        steps.push({
          stepIndex: stepIdx++,
          treeSnapshot: cloneTree(workingTree),
          description: `Target (${target}) > Node [${curr.value}]. Move RIGHT to [${curr.right.value}] where larger candidates lie.`,
          activeCodeLine: 10,
          activeNodeId: curr.right.id,
          highlightedNodeIds: { [curr.id]: 'highlight', [curr.right.id]: 'comparing' },
          highlightedEdgeKeys: { ...edgeHistory },
          callStack: [{ id: 'frame_branch', functionName: 'closestValue', args: `curr = curr->right` }],
          log: `Navigating right from [${curr.value}] to [${curr.right.value}].`,
          closestValueState: {
            target,
            closestVal: closest,
            minDiff: Math.abs(closest - target),
          },
        });
        edgeHistory[`${curr.id}->${curr.right.id}`] = 'traversed';
      }
      curr = curr.right;
    }
  }

  steps.push({
    stepIndex: stepIdx++,
    treeSnapshot: cloneTree(workingTree),
    description: `Reached end of BST search path. Return closest value = Node [${closest}] with minimum difference ${Math.abs(closest - target)}.`,
    activeCodeLine: 12,
    activeNodeId: null,
    highlightedNodeIds: {},
    highlightedEdgeKeys: { ...edgeHistory },
    callStack: [{ id: 'frame_return', functionName: 'closestValue', args: `return ${closest}` }],
    log: `Search complete. Closest BST value to ${target} is ${closest}.`,
    closestValueState: {
      target,
      closestVal: closest,
      minDiff: Math.abs(closest - target),
    },
  });

  return steps;
}
