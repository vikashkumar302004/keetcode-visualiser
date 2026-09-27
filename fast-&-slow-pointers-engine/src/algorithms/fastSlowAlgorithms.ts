/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationStep, VisualNode } from '../types';

// Helper to calculate sum of digit squares for Happy Number (LC #202)
export function getHappyNext(n: number): { value: number; explanation: string } {
  const digits = n.toString().split('');
  const sum = digits.reduce((acc, d) => acc + Math.pow(parseInt(d, 10), 2), 0);
  const explanation = digits.map(d => `${d}²`).join(' + ') + ` = ${sum}`;
  return { value: sum, explanation };
}

export function generateSimulationSteps(
  problemId: string,
  values: number[],
  cyclePos: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];

  // Define simple node structure builder
  const buildNodes = (vals: number[], loopPos: number): VisualNode[] => {
    return vals.map((val, idx) => ({
      id: idx,
      val,
      next: idx === vals.length - 1 ? (loopPos >= 0 ? loopPos : null) : idx + 1
    }));
  };

  if (problemId === 'lc876') {
    // 1. Middle of the Linked List
    // ListNode* middleNode(ListNode* head)
    const listNodes = buildNodes(values, -1);
    
    // Step 0: Initial State
    steps.push({
      stepIndex: 0,
      slowIndex: 0,
      fastIndex: 0,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Middle Finding',
      isCollision: false,
      collisionIndex: null,
      description: 'Initialize both slow and fast pointers at the head of the list.',
      cppLine: 2,
      metrics: { steps: 0, slowVal: listNodes[0].val, fastVal: listNodes[0].val },
      logMessage: 'Initialized slow and fast pointers at head node with value ' + listNodes[0].val
    });

    let slow = 0;
    let fast = 0;
    let currentStepNum = 0;

    while (fast !== null && fast < listNodes.length) {
      // Condition check step
      const hasNext = (fast + 1) < listNodes.length;
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Finding',
        isCollision: false,
        collisionIndex: null,
        description: `Check loop condition: fast is at Node ${fast + 1} (${listNodes[fast].val}), and fast->next is ${hasNext ? `Node ${fast + 2} (${listNodes[fast + 1].val})` : 'NULL'}.`,
        cppLine: 5,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: listNodes[fast].val },
        logMessage: `Loop invariant check: slow index = ${slow}, fast index = ${fast}.`
      });

      if (!hasNext || (fast + 1) >= listNodes.length) {
        break;
      }

      // Execution step
      currentStepNum++;
      slow = slow + 1;
      fast = fast + 2;

      const isFastEnd = fast >= listNodes.length;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: isFastEnd ? null : fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Finding',
        isCollision: false,
        collisionIndex: null,
        description: `Slow moves 1 step to value ${listNodes[slow].val}. Fast leaps 2 steps to ${isFastEnd ? 'NULL' : `value ${listNodes[fast].val}`}.`,
        cppLine: 6,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: isFastEnd ? 'NULL' : listNodes[fast].val },
        logMessage: `Step ${currentStepNum}: Slow advanced to ${listNodes[slow].val}. Fast leaped to ${isFastEnd ? 'NULL' : listNodes[fast].val}.`
      });
    }

    // Final result step
    steps.push({
      stepIndex: steps.length,
      slowIndex: slow,
      fastIndex: fast >= listNodes.length ? null : fast,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Completed',
      isCollision: false,
      collisionIndex: null,
      description: `Fast reached end of list (NULL). Slow resides precisely at the middle node with value ${listNodes[slow].val}!`,
      cppLine: 9,
      metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: fast >= listNodes.length ? 'NULL' : listNodes[fast].val },
      logMessage: `Algorithm completed. Middle node found at index ${slow} with value ${listNodes[slow].val}.`
    });
  } 
  else if (problemId === 'lc2095') {
    // 2. Delete the Middle Node of a Linked List
    if (values.length <= 1) {
      // Edge cases
      const listNodes = buildNodes(values, -1);
      steps.push({
        stepIndex: 0,
        slowIndex: null,
        fastIndex: null,
        nodes: [],
        phase: 'Completed',
        isCollision: false,
        collisionIndex: null,
        description: 'Single-node or empty list. The middle node is head itself, returned nullptr.',
        cppLine: 3,
        metrics: { steps: 0, slowVal: 'N/A', fastVal: 'N/A' },
        logMessage: 'List has <= 1 node. Immediately deleted head and returned nullptr.'
      });
      return steps;
    }

    const listNodes = buildNodes(values, -1);
    let slow = 0;
    let fast = 0;
    let prev = -1;
    let currentStepNum = 0;

    steps.push({
      stepIndex: 0,
      slowIndex: 0,
      fastIndex: 0,
      prevSlowIndex: null,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Middle Finding',
      isCollision: false,
      collisionIndex: null,
      description: 'Initialize slow, fast, and prev (null) pointers at the head of the list.',
      cppLine: 7,
      metrics: { steps: 0, slowVal: listNodes[0].val, fastVal: listNodes[0].val },
      logMessage: 'Initialized pointers: slow=head, fast=head, prev=nullptr.'
    });

    while (fast !== null && fast < listNodes.length && (fast + 1) < listNodes.length) {
      // Loop condition check
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        prevSlowIndex: prev >= 0 ? prev : null,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Finding',
        isCollision: false,
        collisionIndex: null,
        description: `Loop condition check: fast is at Node ${fast + 1}.`,
        cppLine: 9,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: listNodes[fast].val },
        logMessage: `Checking loop boundaries: fast=${fast}, slow=${slow}, prev=${prev}.`
      });

      // Update values
      prev = slow;
      slow = slow + 1;
      fast = fast + 2;
      currentStepNum++;

      const isFastEnd = fast >= listNodes.length;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: isFastEnd ? null : fast,
        prevSlowIndex: prev,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Finding',
        isCollision: false,
        collisionIndex: null,
        description: `prev tracks old slow (${listNodes[prev].val}). slow moves to ${listNodes[slow].val}. fast leaps to ${isFastEnd ? 'NULL' : listNodes[fast].val}.`,
        cppLine: 11,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: isFastEnd ? 'NULL' : listNodes[fast].val },
        logMessage: `Step ${currentStepNum}: prev=${listNodes[prev].val}, slow=${listNodes[slow].val}, fast=${isFastEnd ? 'NULL' : listNodes[fast].val}.`
      });
    }

    // Now, sever the node
    const finalNodes = JSON.parse(JSON.stringify(listNodes));
    // Point prev->next to slow->next
    const slowNode = finalNodes[slow];
    const prevNode = finalNodes[prev];
    prevNode.next = slowNode.next;
    slowNode.isDeleted = true;

    steps.push({
      stepIndex: steps.length,
      slowIndex: slow,
      fastIndex: fast >= listNodes.length ? null : fast,
      prevSlowIndex: prev,
      nodes: finalNodes,
      phase: 'Deletion',
      isCollision: false,
      collisionIndex: null,
      description: `Bypassing middle node: Point prev (${prevNode.val}) to slow->next (${slowNode.next !== null ? finalNodes[slowNode.next].val : 'NULL'}).`,
      cppLine: 14,
      metrics: { steps: currentStepNum, slowVal: `${slowNode.val} (Deleted)`, fastVal: fast >= listNodes.length ? 'NULL' : listNodes[fast].val },
      logMessage: `Severing link: Node ${slow} (${slowNode.val}) has been deleted. Node ${prev} (${prevNode.val}) now points to Node ${slowNode.next !== null ? slowNode.next : 'NULL'}.`
    });

    steps.push({
      stepIndex: steps.length,
      slowIndex: null,
      fastIndex: null,
      prevSlowIndex: prev,
      nodes: finalNodes,
      phase: 'Completed',
      isCollision: false,
      collisionIndex: null,
      description: `Middle node completely removed from the list topology. Return head.`,
      cppLine: 16,
      metrics: { steps: currentStepNum, slowVal: 'N/A', fastVal: 'N/A' },
      logMessage: 'Algorithm finished. Head list modified successfully.'
    });
  } 
  else if (problemId === 'lc234') {
    // 3. Palindrome Linked List
    // 3 phases: 1. Find middle, 2. Reverse second half, 3. Compare values
    const listNodes = buildNodes(values, -1);
    let slow = 0;
    let fast = 0;
    let currentStepNum = 0;

    // Step 0: Init
    steps.push({
      stepIndex: 0,
      slowIndex: 0,
      fastIndex: 0,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Middle Finding',
      isCollision: false,
      collisionIndex: null,
      description: 'Initialize slow and fast pointers at head to locate the split point.',
      cppLine: 2,
      metrics: { steps: 0, slowVal: listNodes[0].val, fastVal: listNodes[0].val },
      logMessage: 'Initialized slow and fast at head.'
    });

    // Phase 1: Find middle
    while (fast !== null && fast < listNodes.length && (fast + 1) < listNodes.length) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Finding',
        isCollision: false,
        collisionIndex: null,
        description: `Finding middle: slow is at index ${slow}, fast at ${fast}.`,
        cppLine: 4,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: listNodes[fast].val },
        logMessage: `Middle finder step: slow=${slow}, fast=${fast}.`
      });

      slow++;
      fast += 2;
      currentStepNum++;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast >= listNodes.length ? null : fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Finding',
        isCollision: false,
        collisionIndex: null,
        description: `Slow advanced to index ${slow}. Fast jumped to ${fast >= listNodes.length ? 'NULL' : `index ${fast}`}.`,
        cppLine: 5,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: fast >= listNodes.length ? 'NULL' : listNodes[fast].val },
        logMessage: `Slow is at ${listNodes[slow].val}, fast is at ${fast >= listNodes.length ? 'NULL' : listNodes[fast].val}.`
      });
    }

    // Phase 2: Reverse second half (starting at slow index)
    // C++ line 9: prev = nullptr; curr = slow;
    const workingNodes = JSON.parse(JSON.stringify(listNodes));
    let prev: number | null = null;
    let curr: number | null = slow;

    steps.push({
      stepIndex: steps.length,
      slowIndex: slow,
      fastIndex: null,
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      phase: 'Reversal',
      isCollision: false,
      collisionIndex: null,
      description: `Prepare to reverse second half. Set curr = slow (${listNodes[slow].val}) and prev = NULL.`,
      cppLine: 10,
      metrics: { steps: currentStepNum, slowVal: listNodes[slow].val },
      logMessage: `Reversal Phase Initiated. curr=${slow}, prev=NULL.`
    });

    while (curr !== null && curr < listNodes.length) {
      const nextTemp: number | null = curr + 1 < listNodes.length ? curr + 1 : null;
      
      // Perform reversing step in our simulated graph
      workingNodes[curr].next = prev;
      workingNodes[curr].isReversed = true;

      steps.push({
        stepIndex: steps.length,
        slowIndex: curr, // reuse slowIndex for current reversing node
        fastIndex: prev, // reuse fastIndex for prev node
        nodes: JSON.parse(JSON.stringify(workingNodes)),
        phase: 'Reversal',
        isCollision: false,
        collisionIndex: null,
        description: `Reverse link: Set Node ${curr} (${listNodes[curr].val}) ->next to point back to prev Node ${prev !== null ? listNodes[prev].val : 'NULL'}.`,
        cppLine: 13,
        metrics: { steps: currentStepNum, slowVal: listNodes[curr].val, fastVal: prev !== null ? listNodes[prev].val : 'NULL' },
        logMessage: `Inverted link: Node ${curr} points to ${prev !== null ? prev : 'NULL'}.`
      });

      prev = curr;
      curr = nextTemp;
      currentStepNum++;
    }

    // Phase 3: Compare first half and reversed second half
    // p1 starts at head (index 0). p2 starts at prev (which is the last node index, head of reversed list)
    let p1: number | null = 0;
    let p2: number | null = prev; // last index of the array
    let isPal = true;

    steps.push({
      stepIndex: steps.length,
      slowIndex: p1,
      fastIndex: p2,
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      phase: 'Comparison',
      isCollision: false,
      collisionIndex: null,
      description: `Comparison Phase: p1 starts at Head (${listNodes[0].val}). p2 starts at Reversed Head (${p2 !== null ? listNodes[p2].val : 'NULL'}).`,
      cppLine: 20,
      metrics: { steps: currentStepNum, slowVal: listNodes[p1].val, fastVal: p2 !== null ? listNodes[p2].val : 'NULL' },
      logMessage: `Initialized comparison: p1=${p1}, p2=${p2}.`
    });

    while (p2 !== null) {
      const val1 = listNodes[p1!].val;
      const val2 = listNodes[p2].val;
      const match = val1 === val2;

      steps.push({
        stepIndex: steps.length,
        slowIndex: p1,
        fastIndex: p2,
        nodes: JSON.parse(JSON.stringify(workingNodes)),
        phase: 'Comparison',
        isCollision: false,
        collisionIndex: null,
        description: `Compare: p1 (${val1}) vs p2 (${val2}). ${match ? 'Values match!' : 'Values MISMATCH! Not a palindrome.'}`,
        cppLine: 21,
        metrics: { steps: currentStepNum, slowVal: val1, fastVal: val2 },
        logMessage: `Comparing Node ${p1} (${val1}) and Node ${p2} (${val2}). Match: ${match}.`
      });

      if (!match) {
        isPal = false;
        break;
      }

      // Advance
      p1 = workingNodes[p1!].next;
      p2 = workingNodes[p2].next; // follow the reversed links
      currentStepNum++;

      if (p2 !== null) {
        steps.push({
          stepIndex: steps.length,
          slowIndex: p1,
          fastIndex: p2,
          nodes: JSON.parse(JSON.stringify(workingNodes)),
          phase: 'Comparison',
          isCollision: false,
          collisionIndex: null,
          description: `Advance p1 to ${p1 !== null ? listNodes[p1].val : 'NULL'} and p2 to ${listNodes[p2].val} along their respective paths.`,
          cppLine: 22,
          metrics: { steps: currentStepNum, slowVal: p1 !== null ? listNodes[p1].val : 'NULL', fastVal: listNodes[p2].val },
          logMessage: `Advanced comparison pointers: p1=${p1}, p2=${p2}.`
        });
      }
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: null,
      fastIndex: null,
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      phase: 'Completed',
      isCollision: false,
      collisionIndex: null,
      description: `Palindrome verification complete. Result: ${isPal ? 'TRUE' : 'FALSE'}.`,
      cppLine: 25,
      metrics: { steps: currentStepNum, slowVal: isPal ? 'True' : 'False' },
      logMessage: `Algorithm finished. Is Palindrome: ${isPal}.`
    });
  } 
  else if (problemId === 'lc143') {
    // 4. Reorder List
    // Find middle -> Reverse second half -> Weave
    const listNodes = buildNodes(values, -1);
    let slow = 0;
    let fast = 0;
    let currentStepNum = 0;

    // Step 0: Init
    steps.push({
      stepIndex: 0,
      slowIndex: 0,
      fastIndex: 0,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Middle Finding',
      isCollision: false,
      collisionIndex: null,
      description: 'Find middle node of the list using slow and fast pointers.',
      cppLine: 3,
      metrics: { steps: 0, slowVal: listNodes[0].val, fastVal: listNodes[0].val },
      logMessage: 'Initialized slow and fast at head.'
    });

    while (fast !== null && fast < listNodes.length && (fast + 1) < listNodes.length) {
      slow++;
      fast += 2;
      currentStepNum++;
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast >= listNodes.length ? null : fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Finding',
        isCollision: false,
        collisionIndex: null,
        description: `Slow advanced to index ${slow}. Fast jumped to ${fast >= listNodes.length ? 'NULL' : `index ${fast}`}.`,
        cppLine: 5,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: fast >= listNodes.length ? 'NULL' : listNodes[fast].val },
        logMessage: `Slow is at ${listNodes[slow].val}, fast is at ${fast >= listNodes.length ? 'NULL' : listNodes[fast].val}.`
      });
    }

    // Reverse second half
    const workingNodes = JSON.parse(JSON.stringify(listNodes));
    let prev: number | null = null;
    let curr: number | null = slow;

    steps.push({
      stepIndex: steps.length,
      slowIndex: slow,
      fastIndex: null,
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      phase: 'Reversal',
      isCollision: false,
      collisionIndex: null,
      description: `Reversing second half. Initializing curr = slow (${listNodes[slow].val}).`,
      cppLine: 10,
      metrics: { steps: currentStepNum, slowVal: listNodes[slow].val },
      logMessage: `Reversal Phase started at node ${slow}.`
    });

    while (curr !== null && curr < listNodes.length) {
      const nextTemp: number | null = curr + 1 < listNodes.length ? curr + 1 : null;
      workingNodes[curr].next = prev;
      workingNodes[curr].isReversed = true;

      steps.push({
        stepIndex: steps.length,
        slowIndex: curr,
        fastIndex: prev,
        nodes: JSON.parse(JSON.stringify(workingNodes)),
        phase: 'Reversal',
        isCollision: false,
        collisionIndex: null,
        description: `Set curr (${listNodes[curr].val}) ->next to prev (${prev !== null ? listNodes[prev].val : 'NULL'}).`,
        cppLine: 13,
        metrics: { steps: currentStepNum, slowVal: listNodes[curr].val, fastVal: prev !== null ? listNodes[prev].val : 'NULL' },
        logMessage: `Reversing: curr=${curr}, prev=${prev}.`
      });

      prev = curr;
      curr = nextTemp;
      currentStepNum++;
    }

    // Phase 3: Weave lists
    // first starts at 0. second starts at prev (reversed head)
    let first: number | null = 0;
    let second: number | null = prev;

    steps.push({
      stepIndex: steps.length,
      slowIndex: first,
      fastIndex: second,
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      phase: 'Weaving',
      isCollision: false,
      collisionIndex: null,
      description: `Weaving Phase: first starts at head (${listNodes[0].val}). second starts at reversed head (${second !== null ? listNodes[second].val : 'NULL'}).`,
      cppLine: 19,
      metrics: { steps: currentStepNum, slowVal: listNodes[first!].val, fastVal: second !== null ? listNodes[second].val : 'NULL' },
      logMessage: `Initialized weaving. first=${first}, second=${second}.`
    });

    while (first !== null && second !== null && first !== second && workingNodes[first].next !== second) {
      const tmp1: number | null = workingNodes[first].next;
      const tmp2: number | null = workingNodes[second].next;

      // weave: first->next = second
      workingNodes[first].next = second;
      // second->next = tmp1
      workingNodes[second].next = tmp1;

      steps.push({
        stepIndex: steps.length,
        slowIndex: first,
        fastIndex: second,
        nodes: JSON.parse(JSON.stringify(workingNodes)),
        phase: 'Weaving',
        isCollision: false,
        collisionIndex: null,
        description: `Weave step: Point ${listNodes[first].val} -> ${listNodes[second].val} -> ${tmp1 !== null ? listNodes[tmp1].val : 'NULL'}.`,
        cppLine: 24,
        metrics: { steps: currentStepNum, slowVal: listNodes[first].val, fastVal: listNodes[second].val },
        logMessage: `Weaving links: ${first} -> ${second} -> ${tmp1}.`
      });

      first = tmp1;
      second = tmp2;
      currentStepNum++;
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: null,
      fastIndex: null,
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      phase: 'Completed',
      isCollision: false,
      collisionIndex: null,
      description: 'Weaving complete. The list is fully reordered!',
      cppLine: 28,
      metrics: { steps: currentStepNum },
      logMessage: 'Reordering finished.'
    });
  } 
  else if (problemId === 'lc148') {
    // Sort List (Merge Sort Middle Split)
    const listNodes = buildNodes(values, -1);
    
    steps.push({
      stepIndex: 0,
      slowIndex: 0,
      fastIndex: 0,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Middle Split',
      isCollision: false,
      collisionIndex: null,
      description: 'Initialize slow and fast pointers at head to locate the split point.',
      cppLine: 2,
      metrics: { steps: 0, slowVal: listNodes[0].val, fastVal: listNodes[0].val },
      logMessage: 'Initialized slow and fast pointers at head.'
    });

    let slow = 0;
    let fast = 0;
    let currentStepNum = 0;

    while (fast !== null && (fast + 1) < listNodes.length && (fast + 2) < listNodes.length) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Split',
        isCollision: false,
        collisionIndex: null,
        description: `Verify conditions: fast is at index ${fast}, fast->next and fast->next->next are valid.`,
        cppLine: 5,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: listNodes[fast].val },
        logMessage: `Iteration check: slow=${slow}, fast=${fast}.`
      });

      slow = slow + 1;
      fast = fast + 2;
      currentStepNum++;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Middle Split',
        isCollision: false,
        collisionIndex: null,
        description: `Slow moves 1x to ${listNodes[slow].val}. Fast leaps 2x to ${fast < listNodes.length ? listNodes[fast].val : 'NULL'}.`,
        cppLine: 6,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: fast < listNodes.length ? listNodes[fast].val : 'NULL' },
        logMessage: `Step ${currentStepNum}: slow is at index ${slow}, fast is at index ${fast}.`
      });
    }

    const splitNodes = JSON.parse(JSON.stringify(listNodes));
    if (slow < splitNodes.length) {
      splitNodes[slow].next = null;
      for (let i = slow + 1; i < splitNodes.length; i++) {
        splitNodes[i].isReversed = true;
      }
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: slow,
      fastIndex: fast,
      nodes: splitNodes,
      phase: 'Split Complete',
      isCollision: false,
      collisionIndex: null,
      description: `Sever connection: Point slow (${listNodes[slow].val})->next to NULL. The list is now split into two independent halves!`,
      cppLine: 9,
      metrics: { steps: currentStepNum, slowVal: listNodes[slow].val, fastVal: fast < listNodes.length ? listNodes[fast].val : 'NULL' },
      logMessage: `Severed link at index ${slow}. Node ${slow} (${listNodes[slow].val}) now points to NULL.`
    });

    steps.push({
      stepIndex: steps.length,
      slowIndex: null,
      fastIndex: null,
      nodes: splitNodes,
      phase: 'Completed',
      isCollision: false,
      collisionIndex: null,
      description: `Split completed. Left Half: head to slow; Right Half: slow->next to end. Ready for recursive merge sorting!`,
      cppLine: 10,
      metrics: { steps: currentStepNum },
      logMessage: `Completed middle split. Mergesort subproblems ready.`
    });
  }
  else if (problemId === 'lc141') {
    // 5. Linked List Cycle I
    const listNodes = buildNodes(values, cyclePos);
    let slow: number | null = 0;
    let fast: number | null = 0;
    let currentStepNum = 0;

    steps.push({
      stepIndex: 0,
      slowIndex: 0,
      fastIndex: 0,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Phase 1: Cycle Detection',
      isCollision: false,
      collisionIndex: null,
      description: 'Initialize slow and fast pointers at head. Cycle starts at index ' + (cyclePos >= 0 ? cyclePos : 'N/A') + '.',
      cppLine: 3,
      metrics: { steps: 0, slowVal: listNodes[0].val, fastVal: listNodes[0].val },
      logMessage: 'Initialized slow and fast at head.'
    });

    let collided = false;

    while (fast !== null && listNodes[fast].next !== null) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: false,
        collisionIndex: null,
        description: `Check loop condition: fast is at index ${fast} (${listNodes[fast].val}), next is index ${listNodes[fast].next} (${listNodes[listNodes[fast].next!].val}).`,
        cppLine: 6,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow!].val, fastVal: listNodes[fast].val, distance: getRelativeDistance(slow!, fast, listNodes) },
        logMessage: `Checking boundaries. fast=${fast}, slow=${slow}.`
      });

      // Move slow by 1, fast by 2
      slow = listNodes[slow!].next;
      
      const midFast: number | null = listNodes[fast!].next;
      fast = midFast !== null ? listNodes[midFast].next : null;
      currentStepNum++;

      const isCollision = slow === fast && slow !== null;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: isCollision,
        collisionIndex: isCollision ? slow : null,
        description: isCollision 
          ? `Collision confirmed at index ${slow} (${listNodes[slow!].val})! Both slow and fast are at the same node.` 
          : `Slow moves to index ${slow} (${slow !== null ? listNodes[slow].val : 'NULL'}). Fast leaps to index ${fast} (${fast !== null ? listNodes[fast].val : 'NULL'}).`,
        cppLine: 8,
        metrics: { steps: currentStepNum, slowVal: slow !== null ? listNodes[slow].val : 'NULL', fastVal: fast !== null ? listNodes[fast].val : 'NULL', distance: isCollision ? 0 : getRelativeDistance(slow!, fast, listNodes) },
        logMessage: isCollision 
          ? `Collision! slow and fast met at index ${slow}.` 
          : `Step ${currentStepNum}: slow=${slow !== null ? listNodes[slow].val : 'NULL'}, fast=${fast !== null ? listNodes[fast].val : 'NULL'}.`
      });

      if (isCollision) {
        collided = true;
        break;
      }
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: slow,
      fastIndex: fast,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Completed',
      isCollision: collided,
      collisionIndex: collided ? slow : null,
      description: collided 
        ? 'Cycle detected successfully!' 
        : 'Fast reached NULL pointer. No cycle exists in this linked list.',
      cppLine: collided ? 10 : 13,
      metrics: { steps: currentStepNum, slowVal: slow !== null ? listNodes[slow].val : 'NULL', fastVal: fast !== null ? listNodes[fast].val : 'NULL' },
      logMessage: collided 
        ? 'Finished: Cycle detected.' 
        : 'Finished: No cycle found (nullptr hit).'
    });
  } 
  else if (problemId === 'lc142') {
    // 6. Linked List Cycle II (Detection + Finding Entry Node)
    const listNodes = buildNodes(values, cyclePos);
    let slow: number | null = 0;
    let fast: number | null = 0;
    let currentStepNum = 0;

    // Step 0: Init
    steps.push({
      stepIndex: 0,
      slowIndex: 0,
      fastIndex: 0,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Phase 1: Cycle Detection',
      isCollision: false,
      collisionIndex: null,
      description: 'Phase 1: Find collision point. Initialize slow and fast pointers at head.',
      cppLine: 3,
      metrics: { steps: 0, slowVal: listNodes[0].val, fastVal: listNodes[0].val },
      logMessage: 'Initialized Phase 1.'
    });

    let collided = false;

    while (fast !== null && listNodes[fast].next !== null) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: false,
        collisionIndex: null,
        description: 'Check loop condition: fast is not NULL and fast->next is not NULL.',
        cppLine: 6,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow!].val, fastVal: listNodes[fast].val, distance: getRelativeDistance(slow!, fast, listNodes) },
        logMessage: `Phase 1 checking condition. slow=${slow}, fast=${fast}.`
      });

      slow = listNodes[slow!].next;
      const midFast: number | null = listNodes[fast!].next;
      fast = midFast !== null ? listNodes[midFast].next : null;
      currentStepNum++;

      const isCollision = slow === fast && slow !== null;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: isCollision,
        collisionIndex: isCollision ? slow : null,
        description: isCollision 
          ? `Collision confirmed at index ${slow} (${listNodes[slow!].val})! Transitioning to Phase 2.` 
          : `Slow moves 1x to index ${slow} (${listNodes[slow!].val}). Fast leaps 2x to index ${fast !== null ? fast : 'NULL'} (${fast !== null ? listNodes[fast].val : 'NULL'}).`,
        cppLine: 9,
        metrics: { steps: currentStepNum, slowVal: listNodes[slow!].val, fastVal: fast !== null ? listNodes[fast].val : 'NULL', distance: isCollision ? 0 : getRelativeDistance(slow!, fast, listNodes) },
        logMessage: isCollision 
          ? `Collision! slow and fast met at index ${slow}.` 
          : `Phase 1 Step ${currentStepNum}: slow=${listNodes[slow!].val}, fast=${fast !== null ? listNodes[fast].val : 'NULL'}.`
      });

      if (isCollision) {
        collided = true;
        break;
      }
    }

    if (!collided) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Completed',
        isCollision: false,
        collisionIndex: null,
        description: 'No cycle exists. Returned nullptr.',
        cppLine: 14,
        metrics: { steps: currentStepNum },
        logMessage: 'Finished: No cycle found.'
      });
      return steps;
    }

    // Phase 2: Find Entry Node
    // Reset ptr1 to head. Keep ptr2 at collisionIndex (slow)
    let ptr1 = 0;
    let ptr2 = slow!;

    steps.push({
      stepIndex: steps.length,
      slowIndex: ptr1, // slow represents ptr1 in Phase 2
      fastIndex: ptr2, // fast represents ptr2 in Phase 2
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Phase 2: Find Entry',
      isCollision: false,
      collisionIndex: null,
      description: `Phase 2: Reset pointer 1 to Head (index 0). Keep pointer 2 at collision node (index ${ptr2}). Both now move at equal 1x speed.`,
      cppLine: 16,
      metrics: { steps: currentStepNum, slowVal: listNodes[ptr1].val, fastVal: listNodes[ptr2].val, cycleLength: calculateCycleLength(slow!, listNodes) },
      logMessage: `Phase 2 Initiated: ptr1 reset to head, ptr2 at collision index ${ptr2}.`
    });

    while (ptr1 !== ptr2) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: ptr1,
        fastIndex: ptr2,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 2: Find Entry',
        isCollision: false,
        collisionIndex: null,
        description: `Check convergence: ptr1 (${listNodes[ptr1].val}) vs ptr2 (${listNodes[ptr2].val}). Not equal, so move both by 1 node.`,
        cppLine: 18,
        metrics: { steps: currentStepNum, slowVal: listNodes[ptr1].val, fastVal: listNodes[ptr2].val, cycleLength: calculateCycleLength(slow!, listNodes) },
        logMessage: `Phase 2: ptr1=${ptr1} (${listNodes[ptr1].val}), ptr2=${ptr2} (${listNodes[ptr2].val}).`
      });

      ptr1 = listNodes[ptr1].next!;
      ptr2 = listNodes[ptr2].next!;
      currentStepNum++;

      steps.push({
        stepIndex: steps.length,
        slowIndex: ptr1,
        fastIndex: ptr2,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 2: Find Entry',
        isCollision: ptr1 === ptr2,
        collisionIndex: ptr1 === ptr2 ? ptr1 : null,
        description: ptr1 === ptr2 
          ? `Meeting point found! ptr1 and ptr2 converged at index ${ptr1} (value ${listNodes[ptr1].val}). This is the Cycle Entry Node!` 
          : `Moved both 1x: ptr1 is now at index ${ptr1} (${listNodes[ptr1].val}). ptr2 is at index ${ptr2} (${listNodes[ptr2].val}).`,
        cppLine: 19,
        metrics: { steps: currentStepNum, slowVal: listNodes[ptr1].val, fastVal: listNodes[ptr2].val, cycleLength: calculateCycleLength(slow!, listNodes) },
        logMessage: `Phase 2 Step: ptr1=${ptr1}, ptr2=${ptr2}.`
      });
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: ptr1,
      fastIndex: ptr2,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Completed',
      isCollision: true,
      collisionIndex: ptr1,
      description: `Algorithm complete. The cycle entry node is index ${ptr1} with value "${listNodes[ptr1].val}".`,
      cppLine: 22,
      metrics: { steps: currentStepNum, slowVal: listNodes[ptr1].val, fastVal: listNodes[ptr2].val },
      logMessage: `Successfully identified cycle entry node at index ${ptr1} (value: ${listNodes[ptr1].val}).`
    });
  } 
  else if (problemId === 'lc160') {
    // 7. Intersection of Two Linked Lists
    // Values: let's treat values as custom but construct list A and list B
    // By default, let's construct a split list system.
    // List A: 4 -> 1 -> 8 -> 4 -> 5
    // List B: 5 -> 0 -> 1 -> 8 -> 4 -> 5
    // Shared part starts at value 8.
    // We can map this custom topology visually.
    // In our nodes array, we can construct:
    // index 0: '4' -> 1
    // index 1: '1' -> 2
    // index 2: '8' -> 3
    // index 3: '4' -> 4
    // index 4: '5' -> null (shared part ends)
    // index 5: '5' -> 6
    // index 6: '0' -> 7
    // index 7: '1' -> 2 (B merges into A at index 2)
    const rawA = [4, 1, 8, 4, 5];
    const rawB = [5, 0, 1];
    
    // Nodes: A starts at 0, B starts at 5.
    // Node indexes:
    // 0: A1(4) -> next is 1
    // 1: A2(1) -> next is 2
    // 2: C1(8) -> next is 3 (shared)
    // 3: C2(4) -> next is 4 (shared)
    // 4: C3(5) -> next is null (shared)
    // 5: B1(5) -> next is 6
    // 6: B2(0) -> next is 7
    // 7: B3(1) -> next is 2 (shared)
    const listNodes: VisualNode[] = [
      { id: 0, val: '4 (A1)', next: 1 },
      { id: 1, val: '1 (A2)', next: 2 },
      { id: 2, val: '8 (C1)', next: 3 },
      { id: 3, val: '4 (C2)', next: 4 },
      { id: 4, val: '5 (C3)', next: null },
      { id: 5, val: '5 (B1)', next: 6 },
      { id: 6, val: '0 (B2)', next: 7 },
      { id: 7, val: '1 (B3)', next: 2 }
    ];

    let pA: number | null = 0;
    let pB: number | null = 5;
    let currentStepNum = 0;

    steps.push({
      stepIndex: 0,
      slowIndex: pA,
      fastIndex: pB,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Phase 1: Cycle Detection',
      isCollision: false,
      collisionIndex: null,
      description: 'Initialize pA at Head A (index 0, value 4) and pB at Head B (index 5, value 5).',
      cppLine: 3,
      metrics: { steps: 0, slowVal: '4 (A1)', fastVal: '5 (B1)' },
      logMessage: 'Initialized pointers: pA at Head A, pB at Head B.'
    });

    let limit = 20; // prevent infinite loops
    while (pA !== pB && limit-- > 0) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: pA,
        fastIndex: pB,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: false,
        collisionIndex: null,
        description: `Compare: pA (${pA !== null ? listNodes[pA].val : 'NULL'}) vs pB (${pB !== null ? listNodes[pB].val : 'NULL'}). Not equal.`,
        cppLine: 6,
        metrics: { steps: currentStepNum, slowVal: pA !== null ? listNodes[pA].val : 'NULL', fastVal: pB !== null ? listNodes[pB].val : 'NULL' },
        logMessage: `Comparing pA=${pA}, pB=${pB}.`
      });

      // Move PA
      let nextPA: number | null = null;
      let pADesc = '';
      if (pA === null) {
        nextPA = 5; // head B
        pADesc = 'pA reached end, redirected to Head B (5)';
      } else {
        nextPA = listNodes[pA].next;
        pADesc = `pA moves to ${nextPA !== null ? listNodes[nextPA].val : 'NULL'}`;
      }

      // Move PB
      let nextPB: number | null = null;
      let pBDesc = '';
      if (pB === null) {
        nextPB = 0; // head A
        pBDesc = 'pB reached end, redirected to Head A (4)';
      } else {
        nextPB = listNodes[pB].next;
        pBDesc = `pB moves to ${nextPB !== null ? listNodes[nextPB].val : 'NULL'}`;
      }

      pA = nextPA;
      pB = nextPB;
      currentStepNum++;

      const isCollision = pA === pB && pA !== null;

      steps.push({
        stepIndex: steps.length,
        slowIndex: pA,
        fastIndex: pB,
        nodes: JSON.parse(JSON.stringify(listNodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: isCollision,
        collisionIndex: isCollision ? pA : null,
        description: `${pADesc}. ${pBDesc}.`,
        cppLine: 7,
        metrics: { steps: currentStepNum, slowVal: pA !== null ? listNodes[pA].val : 'NULL', fastVal: pB !== null ? listNodes[pB].val : 'NULL' },
        logMessage: `Step ${currentStepNum}: pA becomes ${pA !== null ? listNodes[pA].val : 'NULL'}, pB becomes ${pB !== null ? listNodes[pB].val : 'NULL'}.`
      });
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: pA,
      fastIndex: pB,
      nodes: JSON.parse(JSON.stringify(listNodes)),
      phase: 'Completed',
      isCollision: pA !== null,
      collisionIndex: pA,
      description: pA !== null 
        ? `Pointers met at intersecting node index ${pA} (value "${listNodes[pA].val}")!` 
        : 'Pointers reached NULL without intersecting. Lists are parallel.',
      cppLine: 10,
      metrics: { steps: currentStepNum, slowVal: pA !== null ? listNodes[pA].val : 'NULL' },
      logMessage: pA !== null 
        ? `Intersection found at node with value ${listNodes[pA].val}` 
        : 'Finished: No intersection detected.'
    });
  } 
  else if (problemId === 'lc202') {
    // 8. Happy Number
    // Uses integer mapping
    const n = values[0] || 19;
    
    // Let's generate sequence values for both slow and fast
    let slow = n;
    let fast = getHappyNext(n).value;
    let currentStepNum = 0;

    // Create a virtual linked list structure representing the happy sequence dynamically
    const numberNodesMap = new Map<number, VisualNode>();
    let currentId = 0;

    const getOrCreateNode = (val: number): VisualNode => {
      let existing = Array.from(numberNodesMap.values()).find(node => node.val === val);
      if (existing) return existing;
      const node: VisualNode = { id: currentId++, val: val, next: null };
      numberNodesMap.set(node.id, node);
      return node;
    };

    // Build paths dynamically
    let sNode = getOrCreateNode(slow);
    let fNode = getOrCreateNode(fast);

    // Initial step
    steps.push({
      stepIndex: 0,
      slowIndex: sNode.id,
      fastIndex: fNode.id,
      nodes: Array.from(numberNodesMap.values()),
      phase: 'Happy Number Loop',
      isCollision: false,
      collisionIndex: null,
      description: `Initialize slow = ${slow}. fast = next(${slow}) = ${fast}.`,
      cppLine: 11,
      metrics: { steps: 0, slowVal: slow, fastVal: fast },
      logMessage: `Initialized happy number search with start value ${slow}.`,
      happyNumberState: {
        currentSlow: slow,
        currentFast: fast,
        slowSumSteps: `${slow}`,
        fastSumSteps: `${slow} -> ${fast}`
      }
    });

    let iterationLimit = 30;
    while (fast !== 1 && getHappyNext(fast).value !== 1 && iterationLimit-- > 0) {
      if (slow === fast) {
        break;
      }

      // Compute next states
      const sNext = getHappyNext(slow);
      const fNextMid = getHappyNext(fast);
      const fNextFull = getHappyNext(fNextMid.value);

      // Link current nodes
      const currSNode = getOrCreateNode(slow);
      const nextSNode = getOrCreateNode(sNext.value);
      currSNode.next = nextSNode.id;

      const currFNode = getOrCreateNode(fast);
      const midFNode = getOrCreateNode(fNextMid.value);
      currFNode.next = midFNode.id;
      midFNode.next = getOrCreateNode(fNextFull.value).id;

      steps.push({
        stepIndex: steps.length,
        slowIndex: currSNode.id,
        fastIndex: currFNode.id,
        nodes: Array.from(numberNodesMap.values()),
        phase: 'Happy Number Loop',
        isCollision: false,
        collisionIndex: null,
        description: `Check condition: fast (${fast}) is not 1 and next(fast) (${fNextMid.value}) is not 1. Compare slow vs fast.`,
        cppLine: 12,
        metrics: { steps: currentStepNum, slowVal: slow, fastVal: fast },
        logMessage: `Checking happy cycle: slow=${slow}, fast=${fast}.`,
        happyNumberState: {
          currentSlow: slow,
          currentFast: fast,
          slowSumSteps: sNext.explanation,
          fastSumSteps: `${fNextMid.explanation} | ${fNextFull.explanation}`
        }
      });

      // Advance
      slow = sNext.value;
      fast = fNextFull.value;
      currentStepNum++;

      const isCollision = slow === fast;

      steps.push({
        stepIndex: steps.length,
        slowIndex: getOrCreateNode(slow).id,
        fastIndex: getOrCreateNode(fast).id,
        nodes: Array.from(numberNodesMap.values()),
        phase: 'Happy Number Loop',
        isCollision: isCollision,
        collisionIndex: isCollision ? getOrCreateNode(slow).id : null,
        description: isCollision 
          ? `Cycle detected! slow and fast met at ${slow}. This number will loop infinitely and is NOT happy.` 
          : `Slow moves to next (${slow}). Fast leaps 2x to (${fast}).`,
        cppLine: 14,
        metrics: { steps: currentStepNum, slowVal: slow, fastVal: fast },
        logMessage: `Step ${currentStepNum}: slow is now ${slow}, fast is ${fast}.`,
        happyNumberState: {
          currentSlow: slow,
          currentFast: fast,
          slowSumSteps: sNext.explanation,
          fastSumSteps: fNextFull.explanation
        }
      });
    }

    const isHappyResult = fast === 1 || getHappyNext(fast).value === 1;

    // Build final node linkages to 1 if happy
    if (isHappyResult) {
      const oneNode = getOrCreateNode(1);
      if (fast !== 1) {
        const midNode = getOrCreateNode(fast);
        midNode.next = oneNode.id;
      }
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: getOrCreateNode(slow).id,
      fastIndex: getOrCreateNode(fast).id,
      nodes: Array.from(numberNodesMap.values()),
      phase: 'Completed',
      isCollision: !isHappyResult,
      collisionIndex: !isHappyResult ? getOrCreateNode(slow).id : null,
      description: isHappyResult 
        ? `Success! Fast reached 1. Therefore, initial value ${n} is a HAPPY NUMBER!` 
        : `Infinite cycle confirmed. Value ${n} is NOT a Happy Number.`,
      cppLine: 17,
      metrics: { steps: currentStepNum, slowVal: slow, fastVal: fast },
      logMessage: isHappyResult ? 'Finished: Happy number verified!' : 'Finished: Unhappy cycle detected.',
      happyNumberState: {
        currentSlow: slow,
        currentFast: fast,
        slowSumSteps: `Result: ${isHappyResult ? 'Happy' : 'Cycle'}`,
        fastSumSteps: `Result: ${isHappyResult ? '1' : 'Cycle'}`
      }
    });
  } 
  else if (problemId === 'lc287') {
    // 9. Find the Duplicate Number (LC #287)
    // Treats array index -> value mapping as a Linked List
    // Initial: slow = nums[0], fast = nums[nums[0]]
    // Phase 1: Detect collision
    // Phase 2: Find entry (duplicate)
    const nums = values.length > 0 ? values : [1, 3, 4, 2, 2];
    
    // Create visualization nodes for the indices:
    // we want nodes for indices 0 to N.
    const nodes: VisualNode[] = nums.map((val, idx) => ({
      id: idx,
      val: `Index ${idx}: [${val}]`,
      next: val // next index is the value at index!
    }));

    let slow = nums[0];
    let fast = nums[nums[0]];
    let currentStepNum = 0;

    // Step 0: Initial
    steps.push({
      stepIndex: 0,
      slowIndex: slow,
      fastIndex: fast,
      nodes: JSON.parse(JSON.stringify(nodes)),
      phase: 'Phase 1: Cycle Detection',
      isCollision: false,
      collisionIndex: null,
      description: `Initialize: slow = nums[0] = index ${slow} (${nums[slow]}). fast = nums[nums[0]] = index ${fast} (${nums[fast]}).`,
      cppLine: 3,
      metrics: { steps: 0, slowVal: nums[slow], fastVal: nums[fast] },
      logMessage: `Initialized array cycle mapping: slow starts at idx ${slow}, fast at idx ${fast}.`,
      arrayState: {
        nums,
        slowIndex: slow,
        fastIndex: fast,
        slowNextIndex: nums[slow],
        fastNextIndex: nums[nums[fast]]
      }
    });

    // Phase 1
    while (slow !== fast) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(nodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: false,
        collisionIndex: null,
        description: `Check loop: slow (idx ${slow}) != fast (idx ${fast}). Move slow 1 step, fast 2 steps.`,
        cppLine: 5,
        metrics: { steps: currentStepNum, slowVal: nums[slow], fastVal: nums[fast] },
        logMessage: `Phase 1 testing inequality. slow=${slow}, fast=${fast}.`,
        arrayState: {
          nums,
          slowIndex: slow,
          fastIndex: fast,
          slowNextIndex: nums[slow],
          fastNextIndex: nums[nums[fast]]
        }
      });

      slow = nums[slow];
      fast = nums[nums[fast]];
      currentStepNum++;

      const isCollision = slow === fast;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(nodes)),
        phase: 'Phase 1: Cycle Detection',
        isCollision: isCollision,
        collisionIndex: isCollision ? slow : null,
        description: isCollision 
          ? `Collision! slow and fast met at index ${slow}. Transitioning to Phase 2 to find duplicate.` 
          : `slow moves to index ${slow} (nums[slow]=${nums[slow]}). fast moves to index ${fast} (nums[fast]=${nums[fast]}).`,
        cppLine: 7,
        metrics: { steps: currentStepNum, slowVal: nums[slow], fastVal: nums[fast] },
        logMessage: `Phase 1 Step ${currentStepNum}: slow is now idx ${slow}, fast is idx ${fast}.`,
        arrayState: {
          nums,
          slowIndex: slow,
          fastIndex: fast,
          slowNextIndex: nums[slow],
          fastNextIndex: nums[nums[fast]]
        }
      });
    }

    // Phase 2: Finding the cycle entry node (the duplicate value)
    let ptr1 = 0;
    let ptr2 = slow;

    steps.push({
      stepIndex: steps.length,
      slowIndex: ptr1, // slow tracks ptr1 in Phase 2
      fastIndex: ptr2, // fast tracks ptr2 in Phase 2
      nodes: JSON.parse(JSON.stringify(nodes)),
      phase: 'Phase 2: Find Entry',
      isCollision: false,
      collisionIndex: null,
      description: 'Phase 2: Reset ptr1 to Index 0. Keep ptr2 at collision Index ' + ptr2 + '. Move both 1 step at a time.',
      cppLine: 11,
      metrics: { steps: currentStepNum, slowVal: nums[ptr1], fastVal: nums[ptr2] },
      logMessage: 'Phase 2 started. Reset ptr1 to 0, ptr2 remains at ' + ptr2,
      arrayState: {
        nums,
        slowIndex: ptr1,
        fastIndex: ptr2,
        slowNextIndex: nums[ptr1],
        fastNextIndex: nums[ptr2]
      }
    });

    while (ptr1 !== ptr2) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: ptr1,
        fastIndex: ptr2,
        nodes: JSON.parse(JSON.stringify(nodes)),
        phase: 'Phase 2: Find Entry',
        isCollision: false,
        collisionIndex: null,
        description: `Check convergence: ptr1 (${ptr1}) != ptr2 (${ptr2}). Advance both: ptr1 = nums[ptr1], ptr2 = nums[ptr2].`,
        cppLine: 12,
        metrics: { steps: currentStepNum, slowVal: nums[ptr1], fastVal: nums[ptr2] },
        logMessage: `Phase 2 checking equivalence. ptr1=${ptr1}, ptr2=${ptr2}.`,
        arrayState: {
          nums,
          slowIndex: ptr1,
          fastIndex: ptr2,
          slowNextIndex: nums[ptr1],
          fastNextIndex: nums[ptr2]
        }
      });

      ptr1 = nums[ptr1];
      ptr2 = nums[ptr2];
      currentStepNum++;

      const converged = ptr1 === ptr2;

      steps.push({
        stepIndex: steps.length,
        slowIndex: ptr1,
        fastIndex: ptr2,
        nodes: JSON.parse(JSON.stringify(nodes)),
        phase: 'Phase 2: Find Entry',
        isCollision: converged,
        collisionIndex: converged ? ptr1 : null,
        description: converged 
          ? `Convergence! ptr1 and ptr2 met at Index ${ptr1}. This value "${ptr1}" is the duplicate number!` 
          : `Moved both 1x: ptr1 is now at index ${ptr1} (${nums[ptr1]}). ptr2 is at index ${ptr2} (${nums[ptr2]}).`,
        cppLine: 14,
        metrics: { steps: currentStepNum, slowVal: nums[ptr1], fastVal: nums[ptr2] },
        logMessage: `Phase 2 step: ptr1 now index ${ptr1}, ptr2 now index ${ptr2}.`,
        arrayState: {
          nums,
          slowIndex: ptr1,
          fastIndex: ptr2,
          slowNextIndex: nums[ptr1],
          fastNextIndex: nums[ptr2]
        }
      });
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: ptr1,
      fastIndex: ptr2,
      nodes: JSON.parse(JSON.stringify(nodes)),
      phase: 'Completed',
      isCollision: true,
      collisionIndex: ptr1,
      description: `Algorithm complete. Found duplicate value: ${ptr1}!`,
      cppLine: 16,
      metrics: { steps: currentStepNum, slowVal: ptr1 },
      logMessage: `Success! Duplicate identified as ${ptr1}.`,
      arrayState: {
        nums,
        slowIndex: ptr1,
        fastIndex: ptr2,
        slowNextIndex: nums[ptr1],
        fastNextIndex: nums[ptr2]
      }
    });
  } 
  else if (problemId === 'lc457') {
    // 10. Circular Array Loop (LC #457)
    const nums = values.length > 0 ? values : [2, -1, 1, 2, 2];
    const n = nums.length;

    // Let's create visual nodes showing index and jump values:
    const nodes: VisualNode[] = nums.map((val, idx) => {
      let nextIdx = (idx + val) % n;
      if (nextIdx < 0) nextIdx += n;
      return {
        id: idx,
        val: `${val >= 0 ? '+' : ''}${val}`,
        next: nextIdx
      };
    });

    let currentStepNum = 0;
    
    // We will simulate for index 0 to show the process clearly.
    // Let's find an index that actually has a cycle or simulate starting at index 0.
    const startIdx = 0;
    let slow = startIdx;
    let fast = startIdx;
    const isForward = nums[startIdx] >= 0;

    steps.push({
      stepIndex: 0,
      slowIndex: slow,
      fastIndex: fast,
      nodes: JSON.parse(JSON.stringify(nodes)),
      phase: 'Array Cycle Detection',
      isCollision: false,
      collisionIndex: null,
      description: `Initialize search at index ${startIdx}. Path direction: ${isForward ? 'Forward (+)' : 'Backward (-)'}.`,
      cppLine: 12,
      metrics: { steps: 0, slowVal: nums[slow], fastVal: nums[fast] },
      logMessage: `Starting Circular Array search at index ${startIdx} with jump ${nums[startIdx]}.`
    });

    // Run circular list check for 1 index to illustrate the core visual pattern
    const getNextIndex = (curr: number, isForwardDir: boolean): number => {
      const direction = nums[curr] >= 0;
      if (direction !== isForwardDir) return -1; // direction mismatch
      let nextIdx = (curr + nums[curr]) % n;
      if (nextIdx < 0) nextIdx += n;
      if (nextIdx === curr) return -1; // self loop is invalid
      return nextIdx;
    };

    let limit = 15;
    let success = false;
    while (limit-- > 0) {
      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(nodes)),
        phase: 'Array Cycle Detection',
        isCollision: false,
        collisionIndex: null,
        description: `Check circular conditions. slow = ${slow}, fast = ${fast}.`,
        cppLine: 18,
        metrics: { steps: currentStepNum, slowVal: nums[slow], fastVal: nums[fast] },
        logMessage: `Loop verification. slow=${slow}, fast=${fast}.`
      });

      const nextSlow = getNextIndex(slow, isForward);
      const nextFast1 = getNextIndex(fast, isForward);
      const nextFast2 = nextFast1 !== -1 ? getNextIndex(nextFast1, isForward) : -1;

      if (nextSlow === -1 || nextFast1 === -1 || nextFast2 === -1) {
        steps.push({
          stepIndex: steps.length,
          slowIndex: slow,
          fastIndex: fast,
          nodes: JSON.parse(JSON.stringify(nodes)),
          phase: 'Failed',
          isCollision: false,
          collisionIndex: null,
          description: 'Cycle is invalid: hit direction mismatch or self-loop (length 1). Path aborted.',
          cppLine: 9,
          metrics: { steps: currentStepNum },
          logMessage: 'Cycle verification failed: Invalid loop constraint hit.'
        });
        break;
      }

      slow = nextSlow;
      fast = nextFast2;
      currentStepNum++;

      const collision = slow === fast;

      steps.push({
        stepIndex: steps.length,
        slowIndex: slow,
        fastIndex: fast,
        nodes: JSON.parse(JSON.stringify(nodes)),
        phase: 'Array Cycle Detection',
        isCollision: collision,
        collisionIndex: collision ? slow : null,
        description: collision 
          ? `Collision confirmed at index ${slow}! Valid unidirectional cycle detected.`
          : `Slow moves to index ${slow}. Fast jumps to index ${fast}.`,
        cppLine: 18,
        metrics: { steps: currentStepNum, slowVal: nums[slow], fastVal: nums[fast] },
        logMessage: `Step ${currentStepNum}: slow=${slow}, fast=${fast}.`
      });

      if (collision) {
        success = true;
        break;
      }
    }

    steps.push({
      stepIndex: steps.length,
      slowIndex: success ? slow : null,
      fastIndex: success ? fast : null,
      nodes: JSON.parse(JSON.stringify(nodes)),
      phase: 'Completed',
      isCollision: success,
      collisionIndex: success ? slow : null,
      description: success 
        ? `Circular Array loop found starting at index ${startIdx}! Successful verification.` 
        : 'Circular Array loop not found from index ' + startIdx + ' under strict unidirectional & size constraints.',
      cppLine: success ? 19 : 21,
      metrics: { steps: currentStepNum },
      logMessage: success ? 'Finished: Circular loop found.' : 'Finished: No valid loop from index 0.'
    });
  }

  return steps;
}

// Helpers for Cycle Metrics
function getRelativeDistance(slow: number, fast: number | null, nodes: VisualNode[]): number | string {
  if (fast === null) return 'N/A';
  if (slow === fast) return 0;

  // Let's count steps from slow to fast along the cycle path
  let curr = slow;
  let distance = 0;
  const visited = new Set<number>();

  while (curr !== null) {
    if (curr === fast) return distance;
    if (visited.has(curr)) break; // cycle loop safety
    visited.add(curr);
    curr = nodes[curr].next!;
    distance++;
  }
  return 'N/A';
}

function calculateCycleLength(collisionIdx: number, nodes: VisualNode[]): number {
  let curr = nodes[collisionIdx].next;
  let len = 1;
  while (curr !== null && curr !== collisionIdx) {
    curr = nodes[curr].next;
    len++;
  }
  return len;
}
