/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TreeNode, TreeDict, VisStep, NodeState, CallStackFrame } from './types';

// Helper to copy states
function createBaseStep(
  treeDict: TreeDict,
  nodeStates: Record<string, NodeState>,
  lineHighlight: number,
  callStack: CallStackFrame[],
  queue: string[],
  visited: string[],
  description: string,
  metrics: { label: string; value: string | number }[] = []
): VisStep {
  return {
    nodeStates: { ...nodeStates },
    edgeStates: {},
    lineHighlight,
    callStack: [...callStack],
    queue: [...queue],
    visited: [...visited],
    description,
    metrics,
  };
}

function getHeightHelper(nodeId: string | null, treeDict: TreeDict): number {
  if (!nodeId || !treeDict[nodeId]) return 0;
  return 1 + Math.max(
    getHeightHelper(treeDict[nodeId].leftId, treeDict),
    getHeightHelper(treeDict[nodeId].rightId, treeDict)
  );
}

// 1. PREORDER RECURSIVE
export function generatePreorderRec(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  let frameIdCounter = 0;

  function traverse(nodeId: string | null, depth: number, stack: CallStackFrame[]) {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'preorder',
      params: `root = ${nodeValStr}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    // Line 0: function enter
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        visited,
        `preorder() entered with root = ${nodeValStr}`
      )
    );

    // Line 1: null check
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        visited,
        `Checking if root is nullptr: root = ${nodeValStr}`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      // Return step
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // pop
          [],
          visited,
          `Root is nullptr. Returning from preorder.`
        )
      );
      return;
    }

    const node = treeDict[nodeId];

    // Line 3: Print / Visit node
    nodeStates[nodeId] = 'visited';
    visited.push(`${node.val}`);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        visited,
        `Visited node ${node.val}. Added to result array.`
      )
    );

    // Line 4: recurse left
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        nextStack,
        [],
        visited,
        `Recursing left child of node ${node.val}`
      )
    );
    traverse(node.leftId, depth + 1, nextStack);

    // Line 5: recurse right
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        5,
        nextStack,
        [],
        visited,
        `Recursing right child of node ${node.val}`
      )
    );
    traverse(node.rightId, depth + 1, nextStack);

    // Line 6: return
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        stack, // pop
        [],
        visited,
        `Returning from preorder for node ${node.val}`
      )
    );
  }

  traverse(rootId, 0, []);
  return steps;
}

// 2. PREORDER ITERATIVE
export function generatePreorderIter(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  // Line 0: enter function
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      visited,
      `preorderIterative() started.`
    )
  );

  // Line 1: null check
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      1,
      [],
      [],
      visited,
      `Checking if root is nullptr.`
    )
  );

  if (!rootId || !treeDict[rootId]) {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        1,
        [],
        [],
        visited,
        `Root is nullptr. Returning.`
      )
    );
    return steps;
  }

  // Line 2,3,4: Initialize stack & push root
  const simStack: string[] = [rootId]; // Using stack contents simulation inside 'queue' or callStack representation
  // We can represent the C++ stack using the stack call panel, but for iterative algorithms,
  // we can map the C++ stack contents into the queue tracker (labeled as Stack).

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      3,
      [],
      simStack.map((id) => `${treeDict[id]?.val ?? id}`),
      visited,
      `Initialized stack and pushed root (${treeDict[rootId].val})`
    )
  );

  while (simStack.length > 0) {
    // Line 4: while(!s.empty())
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking if stack is empty. Stack size = ${simStack.length}`
      )
    );

    // Line 5: Node* curr = s.top(); s.pop();
    const currId = simStack.pop()!;
    const curr = treeDict[currId];
    nodeStates[currId] = 'active';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        5,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Popped top element: ${curr.val} from stack.`
      )
    );

    // Line 6: print(curr->val)
    nodeStates[currId] = 'visited';
    visited.push(`${curr.val}`);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Printed node value: ${curr.val}. Marked as visited.`
      )
    );

    // Line 7: if (curr->right) s.push(curr->right);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking if right child of ${curr.val} exists: ${curr.rightId ? treeDict[curr.rightId].val : 'nullptr'}`
      )
    );

    if (curr.rightId && treeDict[curr.rightId]) {
      simStack.push(curr.rightId);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          7,
          [],
          simStack.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Pushed right child (${treeDict[curr.rightId].val}) onto stack.`
        )
      );
    }

    // Line 8: if (curr->left) s.push(curr->left);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking if left child of ${curr.val} exists: ${curr.leftId ? treeDict[curr.leftId].val : 'nullptr'}`
      )
    );

    if (curr.leftId && treeDict[curr.leftId]) {
      simStack.push(curr.leftId);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          8,
          [],
          simStack.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Pushed left child (${treeDict[curr.leftId].val}) onto stack.`
        )
      );
    }
  }

  // Final complete step
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      10,
      [],
      [],
      visited,
      `Stack is empty. preorderIterative() complete!`
    )
  );

  return steps;
}

// 3. INORDER RECURSIVE
export function generateInorderRec(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  let frameIdCounter = 0;

  function traverse(nodeId: string | null, depth: number, stack: CallStackFrame[]) {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'inorder',
      params: `root = ${nodeValStr}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    // Line 0: enter
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        visited,
        `inorder() entered with root = ${nodeValStr}`
      )
    );

    // Line 1: null check
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        visited,
        `Checking if root is nullptr: root = ${nodeValStr}`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // pop
          [],
          visited,
          `Root is nullptr. Returning from inorder.`
        )
      );
      return;
    }

    const node = treeDict[nodeId];

    // Line 3: Recurse left
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        visited,
        `Recursing left child of node ${node.val}`
      )
    );
    traverse(node.leftId, depth + 1, nextStack);

    // Line 4: Print/Visit
    nodeStates[nodeId] = 'visited';
    visited.push(`${node.val}`);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        nextStack,
        [],
        visited,
        `Visited node ${node.val}. Added to result array.`
      )
    );

    // Line 5: Recurse right
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        5,
        nextStack,
        [],
        visited,
        `Recursing right child of node ${node.val}`
      )
    );
    traverse(node.rightId, depth + 1, nextStack);

    // Line 6: Return
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        stack, // pop
        [],
        visited,
        `Returning from inorder for node ${node.val}`
      )
    );
  }

  traverse(rootId, 0, []);
  return steps;
}

// 4. INORDER ITERATIVE
export function generateInorderIter(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      visited,
      `inorderIterative() started.`
    )
  );

  const simStack: string[] = [];
  let currId: string | null = rootId;

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      2,
      [],
      [],
      visited,
      `Initialized stack and set curr pointer to root (${rootId ? treeDict[rootId].val : 'nullptr'})`
    )
  );

  while (currId !== null || simStack.length > 0) {
    // Line 3: while (curr != nullptr || !s.empty())
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Loop condition check: curr = ${currId ? treeDict[currId].val : 'nullptr'}, Stack size = ${simStack.length}`
      )
    );

    // Line 4: while (curr != nullptr)
    while (currId !== null && treeDict[currId]) {
      const currNode = treeDict[currId];
      nodeStates[currId] = 'active';

      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          4,
          [],
          simStack.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Inner loop: curr is not nullptr (${currNode.val}). Pushing to stack.`
        )
      );

      // Line 5: s.push(curr)
      simStack.push(currId);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          5,
          [],
          simStack.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Pushed ${currNode.val} onto stack.`
        )
      );

      // Line 6: curr = curr->left
      currId = currNode.leftId;
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          6,
          [],
          simStack.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Moved curr to left child: ${currId ? treeDict[currId].val : 'nullptr'}`
        )
      );
    }

    // Line 8: curr = s.top(); s.pop();
    const poppedId = simStack.pop()!;
    const poppedNode = treeDict[poppedId];
    currId = poppedId;
    nodeStates[currId] = 'active';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Popped top element: ${poppedNode.val} from stack. Set curr to it.`
      )
    );

    // Line 9: print(curr->val)
    nodeStates[currId] = 'visited';
    visited.push(`${poppedNode.val}`);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        9,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Visited and printed node value: ${poppedNode.val}.`
      )
    );

    // Line 10: curr = curr->right
    currId = poppedNode.rightId;
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        10,
        [],
        simStack.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Moved curr to right child of ${poppedNode.val}: ${currId ? treeDict[currId].val : 'nullptr'}`
      )
    );
  }

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      12,
      [],
      [],
      visited,
      `All nodes processed. inorderIterative() finished!`
    )
  );

  return steps;
}

// 5. POSTORDER RECURSIVE
export function generatePostorderRec(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  let frameIdCounter = 0;

  function traverse(nodeId: string | null, depth: number, stack: CallStackFrame[]) {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'postorder',
      params: `root = ${nodeValStr}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    // Line 0: enter
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        visited,
        `postorder() entered with root = ${nodeValStr}`
      )
    );

    // Line 1: null check
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        visited,
        `Checking if root is nullptr: root = ${nodeValStr}`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // pop
          [],
          visited,
          `Root is nullptr. Returning from postorder.`
        )
      );
      return;
    }

    const node = treeDict[nodeId];

    // Line 3: Recurse left
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        visited,
        `Recursing left child of node ${node.val}`
      )
    );
    traverse(node.leftId, depth + 1, nextStack);

    // Line 4: Recurse right
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        nextStack,
        [],
        visited,
        `Recursing right child of node ${node.val}`
      )
    );
    traverse(node.rightId, depth + 1, nextStack);

    // Line 5: Print/Visit
    nodeStates[nodeId] = 'visited';
    visited.push(`${node.val}`);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        5,
        nextStack,
        [],
        visited,
        `Visited node ${node.val}. Added to result array.`
      )
    );

    // Line 6: Return
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        stack, // pop
        [],
        visited,
        `Returning from postorder for node ${node.val}`
      )
    );
  }

  traverse(rootId, 0, []);
  return steps;
}

// 6. POSTORDER ITERATIVE (Two Stacks)
export function generatePostorderIter(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      visited,
      `postorderIterative() started.`
    )
  );

  if (!rootId || !treeDict[rootId]) {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        1,
        [],
        [],
        visited,
        `Root is nullptr. Returning.`
      )
    );
    return steps;
  }

  const s1: string[] = [rootId];
  const s2: string[] = [];

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      3,
      [],
      [],
      visited,
      `Initialized stack s1 and pushed root (${treeDict[rootId].val}), s2 is empty.`
    )
  );

  while (s1.length > 0) {
    // Line 4: while(!s1.empty())
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        [],
        s1.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking if stack s1 is empty. s1 size = ${s1.length}, s2 size = ${s2.length}`
      )
    );

    // Line 5: Node* curr = s1.top(); s1.pop();
    const currId = s1.pop()!;
    const curr = treeDict[currId];
    nodeStates[currId] = 'active';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        5,
        [],
        s1.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Popped ${curr.val} from s1.`
      )
    );

    // Line 6: s2.push(curr);
    s2.push(currId);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        [],
        s1.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Pushed ${curr.val} onto s2. s2 contents: [${s2.map((id) => treeDict[id]?.val).join(', ')}]`
      )
    );

    // Line 7: if (curr->left) s1.push(curr->left);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        [],
        s1.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking left child of ${curr.val}: ${curr.leftId ? treeDict[curr.leftId].val : 'nullptr'}`
      )
    );

    if (curr.leftId && treeDict[curr.leftId]) {
      s1.push(curr.leftId);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          7,
          [],
          s1.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Pushed left child (${treeDict[curr.leftId].val}) to s1.`
        )
      );
    }

    // Line 8: if (curr->right) s1.push(curr->right);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        s1.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking right child of ${curr.val}: ${curr.rightId ? treeDict[curr.rightId].val : 'nullptr'}`
      )
    );

    if (curr.rightId && treeDict[curr.rightId]) {
      s1.push(curr.rightId);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          8,
          [],
          s1.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Pushed right child (${treeDict[curr.rightId].val}) to s1.`
        )
      );
    }
  }

  // Line 10: while(!s2.empty())
  while (s2.length > 0) {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        10,
        [],
        [],
        visited,
        `Second phase: popping from stack s2 to print postorder. s2 size = ${s2.length}`
      )
    );

    // Line 11: print(s2.top()->val); s2.pop();
    const poppedId = s2.pop()!;
    const poppedNode = treeDict[poppedId];
    nodeStates[poppedId] = 'visited';
    visited.push(`${poppedNode.val}`);

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        11,
        [],
        [],
        visited,
        `Popped ${poppedNode.val} from s2. Printed value and marked as visited.`
      )
    );
  }

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      13,
      [],
      [],
      visited,
      `postorderIterative() completed!`
    )
  );

  return steps;
}

// 7. BREADTH-FIRST / LEVEL ORDER
export function generateLevelOrder(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      visited,
      `levelOrder() started.`
    )
  );

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      1,
      [],
      [],
      visited,
      `Checking if root is nullptr.`
    )
  );

  if (!rootId || !treeDict[rootId]) {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        1,
        [],
        [],
        visited,
        `Root is nullptr. Returning.`
      )
    );
    return steps;
  }

  // Line 2-3: Queue setup
  const simQueue: string[] = [rootId];
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      3,
      [],
      simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
      visited,
      `Pushed root node ${treeDict[rootId].val} to queue.`
    )
  );

  while (simQueue.length > 0) {
    // Line 4: while(!q.empty())
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        [],
        simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Queue size = ${simQueue.length}. Continuing while loop.`
      )
    );

    // Line 5: Node* curr = q.front(); q.pop();
    const currId = simQueue.shift()!;
    const curr = treeDict[currId];
    nodeStates[currId] = 'active';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        5,
        [],
        simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Dequeued node ${curr.val} from front.`
      )
    );

    // Line 6: print(curr->val)
    nodeStates[currId] = 'visited';
    visited.push(`${curr.val}`);
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        [],
        simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Visited and printed node ${curr.val}.`
      )
    );

    // Line 7: if (curr->left) q.push(curr->left)
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        [],
        simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking left child of ${curr.val}: ${curr.leftId ? treeDict[curr.leftId].val : 'nullptr'}`
      )
    );

    if (curr.leftId && treeDict[curr.leftId]) {
      simQueue.push(curr.leftId);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          7,
          [],
          simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Enqueued left child (${treeDict[curr.leftId].val}) of node ${curr.val}.`
        )
      );
    }

    // Line 8: if (curr->right) q.push(curr->right)
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
        visited,
        `Checking right child of ${curr.val}: ${curr.rightId ? treeDict[curr.rightId].val : 'nullptr'}`
      )
    );

    if (curr.rightId && treeDict[curr.rightId]) {
      simQueue.push(curr.rightId);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          8,
          [],
          simQueue.map((id) => `${treeDict[id]?.val ?? id}`),
          visited,
          `Enqueued right child (${treeDict[curr.rightId].val}) of node ${curr.val}.`
        )
      );
    }
  }

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      9,
      [],
      [],
      visited,
      `Queue is empty. levelOrder() completed!`
    )
  );

  return steps;
}

// 8. HEIGHT OF BINARY TREE
export function generateHeight(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  let frameIdCounter = 0;

  function computeH(nodeId: string | null, depth: number, stack: CallStackFrame[]): number {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'getHeight',
      params: `root = ${nodeValStr}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    // Enter
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        [],
        `Entering getHeight() with root = ${nodeValStr}`
      )
    );

    // Null check
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        [],
        `Checking if root is nullptr: root = ${nodeValStr}`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Root is nullptr. Returning -1.`
        )
      );
      return -1;
    }

    const node = treeDict[nodeId];

    // Left child height
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        [],
        `Calculating left subtree height for node ${node.val}`
      )
    );
    const leftH = computeH(node.leftId, depth + 1, nextStack);

    // Right child height
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        nextStack,
        [],
        [],
        `Calculating right subtree height for node ${node.val}`
      )
    );
    const rightH = computeH(node.rightId, depth + 1, nextStack);

    // Calculate max + 1
    const totalH = Math.max(leftH, rightH) + 1;
    nodeStates[nodeId] = 'visited';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        nextStack.map((f) => (f.id === fId ? { ...f, returnVal: `${totalH}` } : f)),
        [],
        [],
        `Node ${node.val} height = max(${leftH}, ${rightH}) + 1 = ${totalH}`,
        [
          { label: `Node ${node.val} Left Height`, value: leftH },
          { label: `Node ${node.val} Right Height`, value: rightH },
          { label: `Node ${node.val} Calculated Height`, value: totalH },
        ]
      )
    );

    // Return
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        stack, // pop
        [],
        [],
        `Returning ${totalH} for node ${node.val}`
      )
    );

    return totalH;
  }

  computeH(rootId, 0, []);

  // Highlight root node at the end
  if (rootId) {
    nodeStates[rootId] = 'result';
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        [],
        [],
        [],
        `Completed height calculation. Tree height = ${getHeightHelper(rootId, treeDict) - 1}`,
        [{ label: 'Final Height (0-indexed)', value: getHeightHelper(rootId, treeDict) - 1 }]
      )
    );
  }

  return steps;
}

// Helper to calculate diameter and find the exact path
export function generateDiameter(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  let maxDiameter = 0;
  let bestLCAId: string | null = null;
  let bestLeftHNode: string | null = null;
  let bestRightHNode: string | null = null;

  // Let's compute height and diameter first to find which node generates the maximum diameter
  function getHAndD(nodeId: string | null): { height: number; diameter: number } {
    if (!nodeId || !treeDict[nodeId]) return { height: 0, diameter: 0 };
    const node = treeDict[nodeId];
    const leftRes = getHAndD(node.leftId);
    const rightRes = getHAndD(node.rightId);

    const diameterHere = leftRes.height + rightRes.height;
    if (diameterHere > maxDiameter) {
      maxDiameter = diameterHere;
      bestLCAId = nodeId;
    }

    return {
      height: Math.max(leftRes.height, rightRes.height) + 1,
      diameter: Math.max(diameterHere, Math.max(leftRes.diameter, rightRes.diameter)),
    };
  }
  getHAndD(rootId);

  // Now, simulate height calculation line-by-line while tracking maxDiameter in metrics
  let runningMaxDiameter = 0;
  let frameIdCounter = 0;

  function computeH(nodeId: string | null, depth: number, stack: CallStackFrame[]): number {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'calculateHeight',
      params: `root = ${nodeValStr}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    // Enter
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        [],
        `Entering calculateHeight() for node ${nodeValStr}`,
        [{ label: 'Running Max Diameter', value: runningMaxDiameter }]
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          2,
          stack, // Pop
          [],
          [],
          `Root is nullptr. Returning 0.`,
          [{ label: 'Running Max Diameter', value: runningMaxDiameter }]
        )
      );
      return 0;
    }

    const node = treeDict[nodeId];

    // Left height
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        [],
        `Calculating left subtree height for node ${node.val}`,
        [{ label: 'Running Max Diameter', value: runningMaxDiameter }]
      )
    );
    const leftH = computeH(node.leftId, depth + 1, nextStack);

    // Right height
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        nextStack,
        [],
        [],
        `Calculating right subtree height for node ${node.val}`,
        [{ label: 'Running Max Diameter', value: runningMaxDiameter }]
      )
    );
    const rightH = computeH(node.rightId, depth + 1, nextStack);

    // Update maxDiameter
    const localDiameter = leftH + rightH;
    const previousMax = runningMaxDiameter;
    if (localDiameter > runningMaxDiameter) {
      runningMaxDiameter = localDiameter;
    }

    nodeStates[nodeId] = 'visited';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        nextStack,
        [],
        [],
        `At node ${node.val}: leftHeight = ${leftH}, rightHeight = ${rightH}. Potential diameter = left + right = ${localDiameter}. Updating maxDiameter = max(${previousMax}, ${localDiameter}) = ${runningMaxDiameter}`,
        [{ label: 'Running Max Diameter', value: runningMaxDiameter }]
      )
    );

    // Return height
    const calculatedH = Math.max(leftH, rightH) + 1;
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        stack, // Pop
        [],
        [],
        `Returning height ${calculatedH} for node ${node.val}`,
        [{ label: 'Running Max Diameter', value: runningMaxDiameter }]
      )
    );

    return calculatedH;
  }

  computeH(rootId, 0, []);

  // Now highlight the actual diameter path nodes in green!
  // Let's find the path of nodes that yields the diameter
  const diameterPathNodeIds = new Set<string>();

  function findFurthestLeafPath(nodeId: string | null): string[] {
    if (!nodeId || !treeDict[nodeId]) return [];
    const node = treeDict[nodeId];
    const leftPath = findFurthestLeafPath(node.leftId);
    const rightPath = findFurthestLeafPath(node.rightId);
    if (leftPath.length >= rightPath.length) {
      return [nodeId, ...leftPath];
    } else {
      return [nodeId, ...rightPath];
    }
  }

  if (bestLCAId && treeDict[bestLCAId]) {
    const lcaNode = treeDict[bestLCAId];
    const leftSubPath = findFurthestLeafPath(lcaNode.leftId).reverse();
    const rightSubPath = findFurthestLeafPath(lcaNode.rightId);
    const fullPath = [...leftSubPath, bestLCAId, ...rightSubPath];

    for (const pId of fullPath) {
      nodeStates[pId] = 'result';
    }

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        [],
        [],
        `Diameter is ${maxDiameter} (edges count). Highlighted the longest root-to-leaf path through node ${lcaNode.val}.`,
        [{ label: 'Maximum Diameter', value: maxDiameter }]
      )
    );
  }

  return steps;
}

// 9. LOWEST COMMON ANCESTOR (LCA)
export function generateLCA(
  rootId: string | null,
  pId: string,
  qId: string,
  treeDict: TreeDict
): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  const pVal = treeDict[pId]?.val ?? 'P';
  const qVal = treeDict[qId]?.val ?? 'Q';

  let frameIdCounter = 0;

  function findLcaRec(nodeId: string | null, depth: number, stack: CallStackFrame[]): string | null {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'findLCA',
      params: `root = ${nodeValStr}, p = ${pVal}, q = ${qVal}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    // Enter
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        [],
        `Entering findLCA() for node = ${nodeValStr}`
      )
    );

    // Line 1: base case check
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        [],
        `LCA check: is root nullptr, or matching p (${pVal}) or q (${qVal})?`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Root is nullptr. Returning nullptr.`
        )
      );
      return null;
    }

    if (nodeId === pId || nodeId === qId) {
      nodeStates[nodeId] = 'result'; // Highlight as match
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Found node ${treeDict[nodeId].val} (one of the targets). Returning root.`
        )
      );
      return nodeId;
    }

    const node = treeDict[nodeId];

    // Recurse left
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        [],
        `Recursing left child of node ${node.val}`
      )
    );
    const leftRes = findLcaRec(node.leftId, depth + 1, nextStack);

    // Recurse right
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        nextStack,
        [],
        [],
        `Recursing right child of node ${node.val}`
      )
    );
    const rightRes = findLcaRec(node.rightId, depth + 1, nextStack);

    nodeStates[nodeId] = 'visited';

    // Evaluate
    // Line 6: if (leftLCA && rightLCA) return root;
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        nextStack,
        [],
        [],
        `Evaluating results for node ${node.val}: leftLCA = ${leftRes ? treeDict[leftRes].val : 'null'}, rightLCA = ${rightRes ? treeDict[rightRes].val : 'null'}`
      )
    );

    if (leftRes && rightRes) {
      nodeStates[nodeId] = 'result';
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          6,
          stack, // Pop
          [],
          [],
          `Both leftLCA and rightLCA are non-null! Node ${node.val} is the LCA. Returning ${node.val}.`
        )
      );
      return nodeId;
    }

    // Line 7: return leftLCA ? leftLCA : rightLCA;
    const finalRes = leftRes || rightRes;
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        stack, // Pop
        [],
        [],
        `Returning ${finalRes ? treeDict[finalRes].val : 'nullptr'} for node ${node.val}.`
      )
    );
    return finalRes;
  }

  const finalLcaId = findLcaRec(rootId, 0, []);

  // Highlight path from LCA to targets
  if (finalLcaId && treeDict[finalLcaId]) {
    nodeStates[finalLcaId] = 'result';

    // Find paths to highlight
    const findPath = (startId: string | null, targetId: string, currentPath: string[]): string[] | null => {
      if (!startId || !treeDict[startId]) return null;
      if (startId === targetId) return [...currentPath, startId];
      const leftPath = findPath(treeDict[startId].leftId, targetId, [...currentPath, startId]);
      if (leftPath) return leftPath;
      const rightPath = findPath(treeDict[startId].rightId, targetId, [...currentPath, startId]);
      return rightPath;
    };

    const pPath = findPath(finalLcaId, pId, []);
    const qPath = findPath(finalLcaId, qId, []);

    if (pPath) {
      for (const id of pPath) nodeStates[id] = 'result';
    }
    if (qPath) {
      for (const id of qPath) nodeStates[id] = 'result';
    }

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        [],
        [],
        `LCA is node ${treeDict[finalLcaId].val}. Path to targets ${pVal} and ${qVal} is highlighted.`,
        [{ label: 'LCA Node Value', value: treeDict[finalLcaId].val }]
      )
    );
  }

  return steps;
}

// 10. LEFT VIEW
export function generateLeftView(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  const viewNodes: string[] = [];
  let maxLevel = -1;

  let frameIdCounter = 0;

  function dfs(nodeId: string | null, level: number, stack: CallStackFrame[]) {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'leftViewUtil',
      params: `root = ${nodeValStr}, level = ${level}, maxLevel = ${maxLevel}`,
      depth: level,
    };
    const nextStack = [...stack, currentFrame];

    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        [],
        `Entering leftViewUtil for node = ${nodeValStr}, level = ${level}`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Root is nullptr. Returning.`
        )
      );
      return;
    }

    const node = treeDict[nodeId];

    // Check level > maxLevel
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        2,
        nextStack,
        [],
        [],
        `Checking if current level (${level}) is greater than maxLevel seen so far (${maxLevel})`
      )
    );

    if (level > maxLevel) {
      maxLevel = level;
      nodeStates[nodeId] = 'result';
      viewNodes.push(`${node.val}`);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          3,
          nextStack,
          [],
          [],
          `Level ${level} is greater than maxLevel. Node ${node.val} is visible in Left View! Updating maxLevel = ${maxLevel}.`,
          [{ label: 'Left View Output', value: viewNodes.join(', ') }]
        )
      );
    } else {
      nodeStates[nodeId] = 'visited';
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          2,
          nextStack,
          [],
          [],
          `Level ${level} is not greater than maxLevel (${maxLevel}). Node ${node.val} is hidden behind another node.`,
          [{ label: 'Left View Output', value: viewNodes.join(', ') }]
        )
      );
    }

    // Recurse left child
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        nextStack,
        [],
        [],
        `Recursing Left Child of node ${node.val} first (Left View prefers left subtrees)`
      )
    );
    dfs(node.leftId, level + 1, nextStack);

    // Recurse right child
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        nextStack,
        [],
        [],
        `Recursing Right Child of node ${node.val}`
      )
    );
    dfs(node.rightId, level + 1, nextStack);

    // Return
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        9,
        stack, // Pop
        [],
        [],
        `Returning from Left View check for node ${node.val}.`
      )
    );
  }

  dfs(rootId, 0, []);
  return steps;
}

// 11. RIGHT VIEW
export function generateRightView(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  const viewNodes: string[] = [];
  let maxLevel = -1;

  let frameIdCounter = 0;

  function dfs(nodeId: string | null, level: number, stack: CallStackFrame[]) {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'rightViewUtil',
      params: `root = ${nodeValStr}, level = ${level}, maxLevel = ${maxLevel}`,
      depth: level,
    };
    const nextStack = [...stack, currentFrame];

    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        [],
        `Entering rightViewUtil for node = ${nodeValStr}, level = ${level}`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Root is nullptr. Returning.`
        )
      );
      return;
    }

    const node = treeDict[nodeId];

    // Check level > maxLevel
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        2,
        nextStack,
        [],
        [],
        `Checking if current level (${level}) is greater than maxLevel seen so far (${maxLevel})`
      )
    );

    if (level > maxLevel) {
      maxLevel = level;
      nodeStates[nodeId] = 'result';
      viewNodes.push(`${node.val}`);
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          3,
          nextStack,
          [],
          [],
          `Level ${level} is greater than maxLevel. Node ${node.val} is visible in Right View! Updating maxLevel = ${maxLevel}.`,
          [{ label: 'Right View Output', value: viewNodes.join(', ') }]
        )
      );
    } else {
      nodeStates[nodeId] = 'visited';
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          2,
          nextStack,
          [],
          [],
          `Level ${level} is not greater than maxLevel (${maxLevel}). Node ${node.val} is hidden behind another node.`,
          [{ label: 'Right View Output', value: viewNodes.join(', ') }]
        )
      );
    }

    // Recurse right child FIRST
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        nextStack,
        [],
        [],
        `Recursing Right Child of node ${node.val} first (Right View prefers right subtrees)`
      )
    );
    dfs(node.rightId, level + 1, nextStack);

    // Recurse left child
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        nextStack,
        [],
        [],
        `Recursing Left Child of node ${node.val}`
      )
    );
    dfs(node.leftId, level + 1, nextStack);

    // Return
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        9,
        stack, // Pop
        [],
        [],
        `Returning from Right View check for node ${node.val}.`
      )
    );
  }

  dfs(rootId, 0, []);
  return steps;
}

// 12. TOP VIEW
export function generateTopView(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      [],
      `topView() started.`
    )
  );

  if (!rootId || !treeDict[rootId]) {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        1,
        [],
        [],
        [],
        `Root is nullptr. Returning.`
      )
    );
    return steps;
  }

  // Queue of pairs: node ID, hd
  const q: { id: string; hd: number }[] = [{ id: rootId, hd: 0 }];
  const m: Record<number, string> = {}; // hd -> nodeId

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      5,
      [],
      q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
      [],
      `Pushed root node ${treeDict[rootId].val} with horizontal distance hd = 0 to queue.`
    )
  );

  while (q.length > 0) {
    // Line 6: while(!q.empty())
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        [],
        q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
        [],
        `Queue size = ${q.length}. Continuing Level-Order Horizontal Traversal.`
      )
    );

    // Line 7, 8: auto p = q.front(); q.pop(); Node* curr = p.first; int hd = p.second;
    const { id: currId, hd } = q.shift()!;
    const curr = treeDict[currId];
    nodeStates[currId] = 'active';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
        [],
        `Dequeued node ${curr.val} at horizontal distance hd = ${hd}.`,
        [{ label: 'Top View Maps', value: Object.entries(m).map(([h, nId]) => `hd ${h}: ${treeDict[nId]?.val}`).join(' | ') }]
      )
    );

    // Line 9: if (m.find(hd) == m.end()) m[hd] = curr->val;
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        9,
        [],
        q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
        [],
        `Checking if horizontal distance ${hd} has been recorded in our map...`,
        [{ label: 'Top View Maps', value: Object.entries(m).map(([h, nId]) => `hd ${h}: ${treeDict[nId]?.val}`).join(' | ') }]
      )
    );

    if (m[hd] === undefined) {
      m[hd] = currId;
      nodeStates[currId] = 'result';
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          9,
          [],
          q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
          [],
          `hd = ${hd} is not in map! Adding node ${curr.val}. It is visible in the Top View!`,
          [{ label: 'Top View Maps', value: Object.entries(m).map(([h, nId]) => `hd ${h}: ${treeDict[nId]?.val}`).join(' | ') }]
        )
      );
    } else {
      nodeStates[currId] = 'visited';
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          9,
          [],
          q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
          [],
          `hd = ${hd} is already covered by node ${treeDict[m[hd]].val}. Node ${curr.val} is hidden in Top View.`,
          [{ label: 'Top View Maps', value: Object.entries(m).map(([h, nId]) => `hd ${h}: ${treeDict[nId]?.val}`).join(' | ') }]
        )
      );
    }

    // Line 10: if (curr->left) q.push({curr->left, hd - 1});
    if (curr.leftId && treeDict[curr.leftId]) {
      q.push({ id: curr.leftId, hd: hd - 1 });
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          10,
          [],
          q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
          [],
          `Enqueued left child (${treeDict[curr.leftId].val}) with hd = ${hd - 1}`
        )
      );
    }

    // Line 11: if (curr->right) q.push({curr->right, hd + 1});
    if (curr.rightId && treeDict[curr.rightId]) {
      q.push({ id: curr.rightId, hd: hd + 1 });
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          11,
          [],
          q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
          [],
          `Enqueued right child (${treeDict[curr.rightId].val}) with hd = ${hd + 1}`
        )
      );
    }
  }

  // Sort and display final top view result nodes
  const sortedHd = Object.keys(m)
    .map(Number)
    .sort((a, b) => a - b);
  const finalVals = sortedHd.map((h) => treeDict[m[h]].val);

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      13,
      [],
      [],
      [],
      `Top View calculation complete! Sorted by horizontal distance: [${finalVals.join(', ')}]`,
      [{ label: 'Top View Output', value: finalVals.join(', ') }]
    )
  );

  return steps;
}

// 13. BOTTOM VIEW
export function generateBottomView(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      [],
      `bottomView() started.`
    )
  );

  if (!rootId || !treeDict[rootId]) {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        1,
        [],
        [],
        [],
        `Root is nullptr. Returning.`
      )
    );
    return steps;
  }

  // Queue of pairs: node ID, hd
  const q: { id: string; hd: number }[] = [{ id: rootId, hd: 0 }];
  const m: Record<number, string> = {}; // hd -> nodeId

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      5,
      [],
      q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
      [],
      `Pushed root node ${treeDict[rootId].val} with hd = 0 to queue.`
    )
  );

  while (q.length > 0) {
    // Line 6: while(!q.empty())
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        [],
        q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
        [],
        `Queue size = ${q.length}. Continuing Level-Order Horizontal Traversal.`
      )
    );

    // Line 7, 8: auto p = q.front(); q.pop(); Node* curr = p.first; int hd = p.second;
    const { id: currId, hd } = q.shift()!;
    const curr = treeDict[currId];
    nodeStates[currId] = 'active';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        [],
        q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
        [],
        `Dequeued node ${curr.val} at hd = ${hd}.`,
        [{ label: 'Bottom View Maps', value: Object.entries(m).map(([h, nId]) => `hd ${h}: ${treeDict[nId]?.val}`).join(' | ') }]
      )
    );

    // Line 9: m[hd] = curr->val;
    const oldId = m[hd];
    m[hd] = currId;

    // Reset previous node at this HD back to visited, set new to result
    if (oldId && oldId !== currId) {
      nodeStates[oldId] = 'visited';
    }
    nodeStates[currId] = 'result';

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        9,
        [],
        q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
        [],
        `Updated map: hd = ${hd} is now set to ${curr.val} (overwriting previous ${oldId ? treeDict[oldId].val : 'none'}).`,
        [{ label: 'Bottom View Maps', value: Object.entries(m).map(([h, nId]) => `hd ${h}: ${treeDict[nId]?.val}`).join(' | ') }]
      )
    );

    // Line 10: if (curr->left) q.push({curr->left, hd - 1});
    if (curr.leftId && treeDict[curr.leftId]) {
      q.push({ id: curr.leftId, hd: hd - 1 });
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          10,
          [],
          q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
          [],
          `Enqueued left child (${treeDict[curr.leftId].val}) with hd = ${hd - 1}`
        )
      );
    }

    // Line 11: if (curr->right) q.push({curr->right, hd + 1});
    if (curr.rightId && treeDict[curr.rightId]) {
      q.push({ id: curr.rightId, hd: hd + 1 });
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          11,
          [],
          q.map((p) => `${treeDict[p.id].val}(hd:${p.hd})`),
          [],
          `Enqueued right child (${treeDict[curr.rightId].val}) with hd = ${hd + 1}`
        )
      );
    }
  }

  // Sort and display final bottom view result nodes
  const sortedHd = Object.keys(m)
    .map(Number)
    .sort((a, b) => a - b);
  const finalVals = sortedHd.map((h) => treeDict[m[h]].val);

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      13,
      [],
      [],
      [],
      `Bottom View calculation complete! Sorted by horizontal distance: [${finalVals.join(', ')}]`,
      [{ label: 'Bottom View Output', value: finalVals.join(', ') }]
    )
  );

  return steps;
}

// 14. PATH SUM (Root-to-Leaf target sum check)
export function generatePathSum(
  rootId: string | null,
  targetSum: number,
  treeDict: TreeDict
): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  let frameIdCounter = 0;
  let finalPathFound = false;
  const correctPathIds: string[] = [];

  function checkPath(
    nodeId: string | null,
    currentRem: number,
    depth: number,
    stack: CallStackFrame[],
    currentPath: string[]
  ): boolean {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'hasPathSum',
      params: `root = ${nodeValStr}, targetSum = ${currentRem}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        0,
        nextStack,
        [],
        [],
        `Entering hasPathSum() with root = ${nodeValStr}, targetSum = ${currentRem}`
      )
    );

    // Line 1: null check
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        [],
        `Checking if root is nullptr.`
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Root is nullptr. Returning false.`
        )
      );
      return false;
    }

    const node = treeDict[nodeId];
    nodeStates[nodeId] = 'visited';
    const pathNow = [...currentPath, nodeId];

    // Line 3: Check if leaf node
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        [],
        `Checking if node ${node.val} is a leaf node (no left or right child).`
      )
    );

    if (!node.leftId && !node.rightId) {
      const isLeafMatch = currentRem === node.val;
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          4,
          nextStack,
          [],
          [],
          `Leaf node ${node.val} evaluated: is remaining targetSum (${currentRem}) == node val (${node.val})? Result = ${isLeafMatch}`
        )
      );

      if (isLeafMatch) {
        finalPathFound = true;
        correctPathIds.push(...pathNow);
      }

      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          4,
          stack, // Pop
          [],
          [],
          `Returning ${isLeafMatch} from leaf node ${node.val}.`
        )
      );
      return isLeafMatch;
    }

    // Line 7: remaining = targetSum - root->val;
    const remainingVal = currentRem - node.val;
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        nextStack,
        [],
        [],
        `Node ${node.val} is internal. Subtracting node val: remaining sum = ${currentRem} - ${node.val} = ${remainingVal}`
      )
    );

    // Line 8: recurse left
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        8,
        nextStack,
        [],
        [],
        `Recursing on left subtree of node ${node.val} with targetSum = ${remainingVal}`
      )
    );
    const leftRes = checkPath(node.leftId, remainingVal, depth + 1, nextStack, pathNow);

    if (leftRes) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          8,
          stack, // Pop
          [],
          [],
          `Left subtree of ${node.val} returned true! Short-circuiting and returning true.`
        )
      );
      return true;
    }

    // Line 9: recurse right
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        9,
        nextStack,
        [],
        [],
        `Left subtree returned false. Recursing on right subtree of node ${node.val} with targetSum = ${remainingVal}`
      )
    );
    const rightRes = checkPath(node.rightId, remainingVal, depth + 1, nextStack, pathNow);

    const finalResult = leftRes || rightRes;
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        9,
        stack, // Pop
        [],
        [],
        `Left result = false, Right result = ${rightRes}. Returning ${finalResult} for node ${node.val}.`
      )
    );

    return finalResult;
  }

  const resultExists = checkPath(rootId, targetSum, 0, [], []);

  if (resultExists && correctPathIds.length > 0) {
    for (const id of correctPathIds) {
      nodeStates[id] = 'result';
    }
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        10,
        [],
        [],
        [],
        `Success! Found root-to-leaf path summing up to ${targetSum}: [${correctPathIds.map((id) => treeDict[id].val).join(' → ')}]`,
        [{ label: 'Target Sum Path', value: 'Found!' }]
      )
    );
  } else {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        10,
        [],
        [],
        [],
        `No root-to-leaf path sums up to ${targetSum}.`,
        [{ label: 'Target Sum Path', value: 'Not Found' }]
      )
    );
  }

  return steps;
}

// 15. SYMMETRIC / MIRROR TREE CHECK
export function generateSymmetric(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      [],
      `symmetricCheck() started.`
    )
  );

  if (!rootId || !treeDict[rootId]) {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        1,
        [],
        [],
        [],
        `Root is nullptr, empty tree is symmetric. Returning true.`
      )
    );
    return steps;
  }

  const rootNode = treeDict[rootId];
  let frameIdCounter = 0;

  function checkMirror(
    t1Id: string | null,
    t2Id: string | null,
    depth: number,
    stack: CallStackFrame[]
  ): boolean {
    const fId = `f_${frameIdCounter++}`;
    const t1ValStr = t1Id && treeDict[t1Id] ? `${treeDict[t1Id].val}` : 'nullptr';
    const t2ValStr = t2Id && treeDict[t2Id] ? `${treeDict[t2Id].val}` : 'nullptr';

    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'isMirror',
      params: `t1 = ${t1ValStr}, t2 = ${t2ValStr}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    // Highlight the two nodes under comparison
    const tempStates = { ...nodeStates };
    if (t1Id) tempStates[t1Id] = 'active';
    if (t2Id) tempStates[t2Id] = 'active';

    steps.push(
      createBaseStep(
        treeDict,
        tempStates,
        0,
        nextStack,
        [],
        [],
        `Entering isMirror() comparing Node ${t1ValStr} and Node ${t2ValStr}`
      )
    );

    // Line 1: if (t1 == nullptr && t2 == nullptr) return true;
    steps.push(
      createBaseStep(
        treeDict,
        tempStates,
        1,
        nextStack,
        [],
        [],
        `Checking if both nodes are nullptr.`
      )
    );

    if (!t1Id && !t2Id) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Both nodes are nullptr. Returning true.`
        )
      );
      return true;
    }

    // Line 2: if (t1 == nullptr || t2 == nullptr) return false;
    steps.push(
      createBaseStep(
        treeDict,
        tempStates,
        2,
        nextStack,
        [],
        [],
        `Checking if only one node is nullptr.`
      )
    );

    if (!t1Id || !t2Id) {
      if (t1Id) nodeStates[t1Id] = 'visited';
      if (t2Id) nodeStates[t2Id] = 'visited';
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          2,
          stack, // Pop
          [],
          [],
          `One of the nodes is nullptr while the other is not! Symmetry broken. Returning false.`
        )
      );
      return false;
    }

    const t1Node = treeDict[t1Id];
    const t2Node = treeDict[t2Id];

    // Line 4: values equality check
    const valsMatch = t1Node.val === t2Node.val;
    steps.push(
      createBaseStep(
        treeDict,
        tempStates,
        4,
        nextStack,
        [],
        [],
        `Checking if values are equal: t1 val (${t1Node.val}) == t2 val (${t2Node.val}) ? Result = ${valsMatch}`
      )
    );

    if (!valsMatch) {
      nodeStates[t1Id] = 'visited';
      nodeStates[t2Id] = 'visited';
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          4,
          stack, // Pop
          [],
          [],
          `Values do not match! Symmetry broken. Returning false.`
        )
      );
      return false;
    }

    // Mark as checked
    nodeStates[t1Id] = 'visited';
    nodeStates[t2Id] = 'visited';

    // Line 5: isMirror(t1->left, t2->right)
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        5,
        nextStack,
        [],
        [],
        `Values match! Now check mirror symmetry between: t1 left child (${t1Node.leftId ? treeDict[t1Node.leftId].val : 'nullptr'}) and t2 right child (${t2Node.rightId ? treeDict[t2Node.rightId].val : 'nullptr'})`
      )
    );
    const outerMirror = checkMirror(t1Node.leftId, t2Node.rightId, depth + 1, nextStack);

    if (!outerMirror) {
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          5,
          stack, // Pop
          [],
          [],
          `Outer subtrees are not symmetric. Returning false.`
        )
      );
      return false;
    }

    // Line 6: isMirror(t1->right, t2->left)
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        nextStack,
        [],
        [],
        `Outer subtrees are symmetric! Now check: t1 right child (${t1Node.rightId ? treeDict[t1Node.rightId].val : 'nullptr'}) and t2 left child (${t2Node.leftId ? treeDict[t2Node.leftId].val : 'nullptr'})`
      )
    );
    const innerMirror = checkMirror(t1Node.rightId, t2Node.leftId, depth + 1, nextStack);

    const isSymmetric = outerMirror && innerMirror;

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        6,
        stack, // Pop
        [],
        [],
        `Mirror check for [${t1Node.val}] and [${t2Node.val}] subtrees completed: outer = ${outerMirror}, inner = ${innerMirror}. Returning ${isSymmetric}`
      )
    );

    return isSymmetric;
  }

  // Call checkMirror with root's left and right children
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      4,
      [],
      [],
      [],
      `Initiating mirror check on left subtree and right subtree from the root.`
    )
  );

  const finalIsSymmetric = checkMirror(rootNode.leftId, rootNode.rightId, 0, []);

  // Highlight all nodes as result if fully symmetric, otherwise leave as visited
  if (finalIsSymmetric) {
    for (const id in treeDict) {
      nodeStates[id] = 'result';
    }
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        [],
        [],
        [],
        `Conclusion: The Binary Tree is symmetric/mirror!`,
        [{ label: 'Is Symmetric', value: 'Symmetric (True)' }]
      )
    );
  } else {
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        7,
        [],
        [],
        [],
        `Conclusion: The Binary Tree is NOT symmetric/mirror!`,
        [{ label: 'Is Symmetric', value: 'Asymmetric (False)' }]
      )
    );
  }

  return steps;
}

// 16. SERIALIZE AND DESERIALIZE
export function generateSerializeDeserialize(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      [],
      `serialize() initiated.`
    )
  );

  const serializedList: string[] = [];
  let frameIdCounter = 0;

  function serialize(nodeId: string | null, depth: number, stack: CallStackFrame[]): string {
    const fId = `f_${frameIdCounter++}`;
    const nodeValStr = nodeId && treeDict[nodeId] ? `${treeDict[nodeId].val}` : 'nullptr';
    const currentFrame: CallStackFrame = {
      id: fId,
      name: 'serialize',
      params: `root = ${nodeValStr}`,
      depth,
    };
    const nextStack = [...stack, currentFrame];

    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...(nodeId ? { [nodeId]: 'active' } : {}) },
        1,
        nextStack,
        [],
        [],
        `Serializing node = ${nodeValStr}`,
        [{ label: 'Serialized Stream', value: serializedList.join(',') || 'empty' }]
      )
    );

    if (!nodeId || !treeDict[nodeId]) {
      serializedList.push('#');
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          stack, // Pop
          [],
          [],
          `Root is nullptr. Appending '#' representing null.`,
          [{ label: 'Serialized Stream', value: serializedList.join(',') }]
        )
      );
      return '#';
    }

    const node = treeDict[nodeId];
    nodeStates[nodeId] = 'visited';
    serializedList.push(`${node.val}`);

    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        2,
        nextStack,
        [],
        [],
        `Appending value ${node.val} to stream. Now serializing its left child.`,
        [{ label: 'Serialized Stream', value: serializedList.join(',') }]
      )
    );

    // Left
    serialize(node.leftId, depth + 1, nextStack);

    // Right
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        3,
        nextStack,
        [],
        [],
        `Completed left serialization for ${node.val}. Now serializing its right child.`,
        [{ label: 'Serialized Stream', value: serializedList.join(',') }]
      )
    );
    serialize(node.rightId, depth + 1, nextStack);

    // Completed node
    steps.push(
      createBaseStep(
        treeDict,
        nodeStates,
        4,
        stack, // Pop
        [],
        [],
        `Completed serialization of subtree at ${node.val}`,
        [{ label: 'Serialized Stream', value: serializedList.join(',') }]
      )
    );

    return '';
  }

  serialize(rootId, 0, []);

  const finalStream = serializedList.join(',');

  for (const id in treeDict) {
    nodeStates[id] = 'result';
  }

  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      5,
      [],
      [],
      [],
      `Serialization finished! Final pre-order string: "${finalStream}"`,
      [{ label: 'Serialized Stream', value: finalStream }]
    )
  );

  return steps;
}

// 18. BOUNDARY TRAVERSAL
export function generateBoundaryTraversal(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  if (!rootId || !treeDict[rootId]) return steps;

  // Step 0: Initial state
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [],
      [],
      'Boundary Traversal begins at root node.'
    )
  );

  const rootNode = treeDict[rootId];
  const isLeaf = (id: string) => {
    const n = treeDict[id];
    return n && !n.leftId && !n.rightId;
  };

  // Step 1: Print Root
  visited.push(String(rootNode.val));
  nodeStates[rootId] = 'result';
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      1,
      [],
      [],
      visited,
      `Step 1: Visited root node: ${rootNode.val}.`
    )
  );

  // Helper to trace Left Boundary (excluding leaves)
  const leftBoundary: string[] = [];
  let currLeft = rootNode.leftId;
  while (currLeft && treeDict[currLeft]) {
    if (!isLeaf(currLeft)) {
      leftBoundary.push(currLeft);
    }
    currLeft = treeDict[currLeft].leftId ? treeDict[currLeft].leftId : treeDict[currLeft].rightId;
  }

  if (leftBoundary.length > 0) {
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...leftBoundary.reduce((acc, id) => ({ ...acc, [id]: 'active' }), {}) },
        2,
        [],
        [],
        visited,
        `Step 2: Tracking Left Boundary nodes (excluding leaves): ${leftBoundary.map(id => treeDict[id].val).join(', ')}`
      )
    );

    leftBoundary.forEach((id) => {
      nodeStates[id] = 'result';
      visited.push(String(treeDict[id].val));
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          2,
          [],
          [],
          visited,
          `Visited left boundary node: ${treeDict[id].val}`
        )
      );
    });
  }

  // Helper to trace Leaves using DFS (left subtree, then right subtree)
  const leaves: string[] = [];
  function collectLeaves(id: string | null) {
    if (!id || !treeDict[id]) return;
    if (isLeaf(id) && id !== rootId) {
      leaves.push(id);
      return;
    }
    collectLeaves(treeDict[id].leftId);
    collectLeaves(treeDict[id].rightId);
  }

  collectLeaves(rootId);

  if (leaves.length > 0) {
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...leaves.reduce((acc, id) => ({ ...acc, [id]: 'active' }), {}) },
        3,
        [],
        [],
        visited,
        `Step 3: Finding all leaf nodes from left-to-right: ${leaves.map(id => treeDict[id].val).join(', ')}`
      )
    );

    leaves.forEach((id) => {
      nodeStates[id] = 'result';
      visited.push(String(treeDict[id].val));
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          3,
          [],
          [],
          visited,
          `Visited leaf node: ${treeDict[id].val}`
        )
      );
    });
  }

  // Helper to trace Right Boundary (excluding leaves, in reverse)
  const rightBoundary: string[] = [];
  let currRight = rootNode.rightId;
  while (currRight && treeDict[currRight]) {
    if (!isLeaf(currRight)) {
      rightBoundary.push(currRight);
    }
    currRight = treeDict[currRight].rightId ? treeDict[currRight].rightId : treeDict[currRight].leftId;
  }

  if (rightBoundary.length > 0) {
    steps.push(
      createBaseStep(
        treeDict,
        { ...nodeStates, ...rightBoundary.reduce((acc, id) => ({ ...acc, [id]: 'active' }), {}) },
        4,
        [],
        [],
        visited,
        `Step 4: Tracking Right Boundary nodes bottom-up (reverse order): ${[...rightBoundary].reverse().map(id => treeDict[id].val).join(', ')}`
      )
    );

    // Reverse boundary for bottom-up insertion
    const reversedRight = [...rightBoundary].reverse();
    reversedRight.forEach((id) => {
      nodeStates[id] = 'result';
      visited.push(String(treeDict[id].val));
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          4,
          [],
          [],
          visited,
          `Visited right boundary node (reverse order): ${treeDict[id].val}`
        )
      );
    });
  }

  // Step 5: Finished
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      5,
      [],
      [],
      visited,
      `Boundary Traversal Completed! Outermost path: [${visited.join(', ')}]`
    )
  );

  return steps;
}

// 19. MORRIS INORDER TRAVERSAL
export function generateMorrisInorder(rootId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const visited: string[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  if (!rootId || !treeDict[rootId]) return steps;

  let currId: string | null = rootId;
  let threads: Record<string, string> = {};

  steps.push({
    nodeStates: { ...nodeStates },
    edgeStates: {},
    lineHighlight: 0,
    callStack: [],
    queue: [],
    visited: [],
    description: `Morris Inorder Traversal starts at root node: ${treeDict[rootId].val}. Using $O(1)$ extra space!`,
    metrics: [{ label: 'Curr Node', value: treeDict[rootId].val }],
    threads: { ...threads }
  });

  while (currId && treeDict[currId]) {
    const currNode: TreeNode = treeDict[currId];

    if (!currNode.leftId) {
      // Line 2 & 3: Left child is null, visit current, move right
      nodeStates[currId] = 'active';
      steps.push({
        nodeStates: { ...nodeStates },
        edgeStates: {},
        lineHighlight: 2,
        callStack: [],
        queue: [],
        visited: [...visited],
        description: `Left child of ${currNode.val} is NULL. Visiting current and moving right.`,
        metrics: [{ label: 'Curr Node', value: currNode.val }],
        threads: { ...threads }
      });

      visited.push(String(currNode.val));
      nodeStates[currId] = 'result';
      const nextId: string | null = currNode.rightId;

      steps.push({
        nodeStates: { ...nodeStates },
        edgeStates: {},
        lineHighlight: 3,
        callStack: [],
        queue: [],
        visited: [...visited],
        description: `Visited node ${currNode.val}. Moving to right child: ${nextId ? treeDict[nextId].val : 'NULL'}.`,
        metrics: [{ label: 'Curr Node', value: nextId ? treeDict[nextId].val : 'NULL' }],
        threads: { ...threads }
      });

      currId = nextId;
    } else {
      // Left child exists, find predecessor
      nodeStates[currId] = 'active';
      steps.push({
        nodeStates: { ...nodeStates },
        edgeStates: {},
        lineHighlight: 4,
        callStack: [],
        queue: [],
        visited: [...visited],
        description: `Left child of ${currNode.val} (${treeDict[currNode.leftId].val}) exists. Finding inorder predecessor.`,
        metrics: [{ label: 'Curr Node', value: currNode.val }],
        threads: { ...threads }
      });

      let prevId = currNode.leftId;
      while (
        treeDict[prevId] &&
        treeDict[prevId].rightId &&
        treeDict[prevId].rightId !== currId &&
        threads[prevId] !== currId
      ) {
        prevId = treeDict[prevId].rightId as string;
      }

      const prevNode = treeDict[prevId];

      if (!threads[prevId]) {
        // Line 6: Create thread
        threads[prevId] = currId;
        steps.push({
          nodeStates: { ...nodeStates, [prevId]: 'visited' },
          edgeStates: {},
          lineHighlight: 6,
          callStack: [],
          queue: [],
          visited: [...visited],
          description: `Predecessor of ${currNode.val} is ${prevNode.val}. Right child is NULL. Creating back-thread.`,
          metrics: [
            { label: 'Curr Node', value: currNode.val },
            { label: 'Predecessor', value: prevNode.val }
          ],
          threads: { ...threads }
        });

        const nextId: string | null = currNode.leftId;
        steps.push({
          nodeStates: { ...nodeStates, [prevId]: 'visited' },
          edgeStates: {},
          lineHighlight: 6,
          callStack: [],
          queue: [],
          visited: [...visited],
          description: `Back-thread created from ${prevNode.val} to ${currNode.val}. Moving to left child: ${treeDict[nextId as string].val}.`,
          metrics: [{ label: 'Curr Node', value: treeDict[nextId as string].val }],
          threads: { ...threads }
        });

        currId = nextId;
      } else {
        // Line 7: Break thread
        delete threads[prevId];
        steps.push({
          nodeStates: { ...nodeStates, [prevId]: 'visited' },
          edgeStates: {},
          lineHighlight: 7,
          callStack: [],
          queue: [],
          visited: [...visited],
          description: `Predecessor ${prevNode.val} already has back-thread pointing to current ${currNode.val}. Breaking thread.`,
          metrics: [
            { label: 'Curr Node', value: currNode.val },
            { label: 'Predecessor', value: prevNode.val }
          ],
          threads: { ...threads }
        });

        visited.push(String(currNode.val));
        nodeStates[currId] = 'result';
        const nextId: string | null = currNode.rightId;

        steps.push({
          nodeStates: { ...nodeStates },
          edgeStates: {},
          lineHighlight: 7,
          callStack: [],
          queue: [],
          visited: [...visited],
          description: `Visited current node ${currNode.val}. Moving to right child: ${nextId ? treeDict[nextId].val : 'NULL'}.`,
          metrics: [{ label: 'Curr Node', value: nextId ? treeDict[nextId].val : 'NULL' }],
          threads: { ...threads }
        });

        currId = nextId;
      }
    }
  }

  // Finish Step
  for (const id in treeDict) nodeStates[id] = 'result';
  steps.push({
    nodeStates: { ...nodeStates },
    edgeStates: {},
    lineHighlight: 1,
    callStack: [],
    queue: [],
    visited: [...visited],
    description: `Morris Inorder Traversal Completed successfully! Inorder Stream: [${visited.join(', ')}]`,
    metrics: [{ label: 'Status', value: 'Completed' }],
    threads: {}
  });

  return steps;
}

// 20. BURNING TREE (BFS from an arbitrary node spread)
export function generateBurningTree(rootId: string | null, startNodeId: string | null, treeDict: TreeDict): VisStep[] {
  const steps: VisStep[] = [];
  const nodeStates: Record<string, NodeState> = {};
  for (const id in treeDict) nodeStates[id] = 'neutral';

  if (!rootId || !treeDict[rootId]) return steps;

  // Compute parent mapping
  const parentMap: Record<string, string> = {};
  for (const id in treeDict) {
    const node = treeDict[id];
    if (node.leftId) parentMap[node.leftId] = id;
    if (node.rightId) parentMap[node.rightId] = id;
  }

  // Decide fire starter node
  let targetId = startNodeId;
  if (!targetId || !treeDict[targetId]) {
    // Default to root or first left leaf
    targetId = rootId;
  }

  const startVal = treeDict[targetId].val;

  // Step 0: Highlight target node where the fire starts
  nodeStates[targetId] = 'burning';
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      0,
      [],
      [targetId],
      [],
      `Step 0: Fire starts at target node: ${startVal}. Spreading to children and parent...`,
      [{ label: 'Burn Time', value: '0s' }]
    )
  );

  let activeBurnSet = new Set<string>([targetId]);
  const burnedSet = new Set<string>();
  let seconds = 0;

  while (activeBurnSet.size > 0) {
    const newlyInfected = new Set<string>();
    
    // Move currently burning nodes to fully burned state (embers)
    activeBurnSet.forEach((id) => {
      burnedSet.add(id);
      nodeStates[id] = 'burned';
    });

    // Fire spreads to adjacent unburned neighbors (left, right, parent)
    activeBurnSet.forEach((id) => {
      const node = treeDict[id];
      if (!node) return;

      // 1. Left Child
      if (node.leftId && treeDict[node.leftId] && !burnedSet.has(node.leftId) && !activeBurnSet.has(node.leftId)) {
        newlyInfected.add(node.leftId);
        nodeStates[node.leftId] = 'burning';
      }
      // 2. Right Child
      if (node.rightId && treeDict[node.rightId] && !burnedSet.has(node.rightId) && !activeBurnSet.has(node.rightId)) {
        newlyInfected.add(node.rightId);
        nodeStates[node.rightId] = 'burning';
      }
      // 3. Parent Node
      const parentId = parentMap[id];
      if (parentId && treeDict[parentId] && !burnedSet.has(parentId) && !activeBurnSet.has(parentId)) {
        newlyInfected.add(parentId);
        nodeStates[parentId] = 'burning';
      }
    });

    if (newlyInfected.size > 0) {
      seconds++;
      steps.push(
        createBaseStep(
          treeDict,
          nodeStates,
          1,
          [],
          Array.from(newlyInfected),
          Array.from(burnedSet),
          `Step ${seconds}: Fire spreads! Active flames: [${Array.from(newlyInfected).map(id => treeDict[id].val).join(', ')}]. Burned nodes: [${Array.from(burnedSet).map(id => treeDict[id].val).join(', ')}].`,
          [
            { label: 'Burn Time', value: `${seconds}s` },
            { label: 'Flames count', value: newlyInfected.size }
          ]
        )
      );
    }

    activeBurnSet = newlyInfected;
  }

  // Completed Step
  steps.push(
    createBaseStep(
      treeDict,
      nodeStates,
      2,
      [],
      [],
      Array.from(burnedSet),
      `The entire binary tree is completely burned! Total time required to burn the tree: ${seconds} seconds.`,
      [{ label: 'Total Burn Time', value: `${seconds}s` }]
    )
  );

  return steps;
}
