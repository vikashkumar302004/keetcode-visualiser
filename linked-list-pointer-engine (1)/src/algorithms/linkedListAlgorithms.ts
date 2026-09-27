/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlgorithmId, ListNodeState, PointerState, BrokenLinkState, SimulationStep } from '../types';

// Helper to parse input string "1 -> 2 -> 3" into standard Node structures
export function parseList(input: string, trackIndex: number = 0, addressOffset: number = 1): ListNodeState[] {
  const cleanInput = input.replace(/\s+/g, '');
  if (!cleanInput) return [];
  const parts = cleanInput.split('->').map(s => s.trim()).filter(s => s.length > 0);
  
  return parts.map((valStr, idx) => {
    const isNum = !isNaN(Number(valStr));
    const val = isNum ? Number(valStr) : valStr;
    const hexAddr = `0x${(addressOffset + idx).toString(16).toUpperCase().padStart(2, '0')}`;
    return {
      id: `node-${idx}-${trackIndex}`,
      val,
      nextId: idx < parts.length - 1 ? `node-${idx + 1}-${trackIndex}` : null,
      address: hexAddr,
      originalTrack: trackIndex,
    };
  });
}

// Generate deterministic memory address
function makeAddress(offset: number): string {
  return `0x${offset.toString(16).toUpperCase().padStart(2, '0')}`;
}

export function generateSimulationSteps(
  algorithmId: AlgorithmId,
  list1Input: string,
  list2Input: string = '2 -> 4 -> 6',
  list3Input: string = '7 -> 8 -> 9',
  params: Record<string, number> = {}
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const logs: string[] = [];
  
  const addLog = (msg: string) => {
    logs.push(msg);
  };

  const createStep = (
    stepIndex: number,
    description: string,
    lineHighlight: number,
    nodes: ListNodeState[],
    tracks: { title: string; nodeIds: string[]; childTrackNodeIds?: string[] }[],
    pointers: PointerState,
    brokenLinks: BrokenLinkState[] = [],
    extra: Partial<SimulationStep> = {}
  ): SimulationStep => {
    return {
      stepIndex,
      description,
      lineHighlight,
      nodes: nodes.map(n => ({ ...n })),
      tracks: tracks.map(t => ({ ...t, nodeIds: [...t.nodeIds], childTrackNodeIds: t.childTrackNodeIds ? [...t.childTrackNodeIds] : undefined })),
      pointers: { ...pointers },
      brokenLinks: brokenLinks.map(b => ({ ...b })),
      logs: [...logs],
      ...extra,
    };
  };

  switch (algorithmId) {
    case 'reverse-list': {
      const nodes = parseList(list1Input, 0, 1);
      if (nodes.length === 0) {
        addLog('Input list is empty.');
        steps.push(createStep(0, 'Empty list provided.', 1, [], [{ title: 'Main List', nodeIds: [] }], {}));
        return steps;
      }
      const initialNodeIds = nodes.map(n => n.id);
      
      addLog('Initialized reverseList process.');
      steps.push(createStep(0, 'Starting pointer-based iterative list reversal.', 1, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id }));

      addLog('Set prev = nullptr.');
      steps.push(createStep(1, 'Initialize prev pointer to nullptr (the boundary of our reversed segment).', 2, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: null }));

      addLog(`Set curr = head (val: ${nodes[0].val}).`);
      steps.push(createStep(2, `Initialize curr pointer to head node (val: ${nodes[0].val}).`, 3, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: null, curr: nodes[0].id }));

      let prevId: string | null = null;
      let currId: string | null = nodes[0].id;

      while (currId !== null) {
        const currNodeIndex = nodes.findIndex(n => n.id === currId);
        const currNode = nodes[currNodeIndex];
        const nextId: string | null = currNode.nextId;

        // Condition Check
        addLog(`Loop condition check: curr is not null (val: ${currNode.val}).`);
        steps.push(createStep(3, `Loop condition check: curr points to node with value ${currNode.val}.`, 4, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: prevId, curr: currId }));

        // 1. Cache next
        addLog(`Cached nextNode = curr->next (val: ${nextId ? nodes.find(n => n.id === nextId)?.val : 'NULL'}).`);
        steps.push(createStep(4, `Cache nextNode = curr->next (${nextId ? 'val: ' + nodes.find(n => n.id === nextId)?.val : 'nullptr'}) to keep track of remaining nodes.`, 5, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: prevId, curr: currId, next: nextId }));

        // 2. Rewire next pointer
        // Create broken link visual
        const brokenLink: BrokenLinkState = { fromNodeId: currId, toNodeId: nextId, isRewiredBackward: false };
        const rewireLink: BrokenLinkState = { fromNodeId: currId, toNodeId: prevId, isRewiredBackward: true };
        
        nodes[currNodeIndex].nextId = prevId; // Mutate in-place
        
        addLog(`Broken forward link from val: ${currNode.val}. Rewired curr->next to point back to prev (val: ${prevId ? nodes.find(n => n.id === prevId)?.val : 'nullptr'}).`);
        steps.push(createStep(5, `Sever forward connection and rewire ${currNode.val} -> ${prevId ? nodes.find(n => n.id === prevId)?.val : 'nullptr'}.`, 6, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: prevId, curr: currId, next: nextId }, [brokenLink, rewireLink]));

        // 3. Shift prev
        prevId = currId;
        addLog(`Advanced prev pointer forward to curr (val: ${currNode.val}).`);
        steps.push(createStep(6, `Advance prev pointer forward to point to ${currNode.val}.`, 7, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: prevId, curr: currId, next: nextId }));

        // 4. Shift curr
        currId = nextId;
        addLog(`Advanced curr pointer forward to nextNode.`);
        steps.push(createStep(7, `Advance curr pointer forward to cached nextNode (${currId ? 'val: ' + nodes.find(n => n.id === currId)?.val : 'nullptr'}).`, 8, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: prevId, curr: currId, next: null }));
      }

      // Loop exit condition check
      addLog('Loop condition check: curr is nullptr. Loop terminated.');
      steps.push(createStep(8, 'Loop terminated because curr is nullptr.', 4, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, prev: prevId, curr: null }));

      addLog(`Returned prev (val: ${prevId ? nodes.find(n => n.id === prevId)?.val : 'nullptr'}) as the new head.`);
      steps.push(createStep(9, 'Function complete. Return prev as the new head of the reversed list.', 10, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: prevId, prev: prevId }));
      
      break;
    }

    case 'reverse-list-ii': {
      const left = params.left || 2;
      const right = params.right || 4;
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);

      if (nodes.length === 0 || left < 1 || right > nodes.length || left >= right) {
        addLog(`Invalid left/right bounds or empty list. left: ${left}, right: ${right}`);
        steps.push(createStep(0, 'Sublist bounds invalid or empty list.', 1, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], {}));
        return steps;
      }

      // Dummy setup
      const dummyNode: ListNodeState = { id: 'dummy-node', val: -1, nextId: nodes[0].id, address: '0x00', isDummy: true };
      const allNodes = [dummyNode, ...nodes];
      const trackNodeIds = [dummyNode.id, ...initialNodeIds];

      addLog(`Started Reverse Linked List II. Boundaries: [${left}, ${right}]`);
      steps.push(createStep(0, `Reverse sublist from index ${left} to ${right}.`, 1, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { head: nodes[0].id }));

      addLog('Create dummy sentinel pointing to head.');
      steps.push(createStep(1, 'Instantiate dummy sentinel pointing to head to handle boundary head shifts safely.', 2, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: nodes[0].id }));

      let prevId = dummyNode.id;
      addLog('Initialize prev pointer to &dummy.');
      steps.push(createStep(2, 'Set prev pointer to dummy address.', 3, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId }));

      // Find left position
      for (let i = 1; i < left; ++i) {
        const prevNode = allNodes.find(n => n.id === prevId)!;
        prevId = prevNode.nextId!;
        addLog(`Advance prev pointer (index ${i} / ${left - 1}).`);
        steps.push(createStep(3, `Advance prev pointer forward to find position right before left.`, 4, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId }));
      }

      const prevNode = allNodes.find(n => n.id === prevId)!;
      let currId = prevNode.nextId!;
      addLog(`Set curr pointer to prev->next (val: ${allNodes.find(n => n.id === currId)?.val}).`);
      steps.push(createStep(4, `Set curr pointing to the first sublist node to reverse (val: ${allNodes.find(n => n.id === currId)?.val}).`, 5, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId }));

      // Loop through reversal
      const numSteps = right - left;
      addLog(`Reversal loop starts. Performing ${numSteps} pairwise bubble inserts.`);
      steps.push(createStep(5, `Reversal loop starts. Performing ${numSteps} relative shift-steps.`, 6, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId }));

      for (let i = 0; i < numSteps; ++i) {
        const currNodeIndex = allNodes.findIndex(n => n.id === currId);
        const currNodeObj = allNodes[currNodeIndex];
        const nextId = currNodeObj.nextId!;
        const nextNodeIndex = allNodes.findIndex(n => n.id === nextId);
        const nextNodeObj = allNodes[nextNodeIndex];
        
        // 1. Cache nextNode
        addLog(`Cached nextNode = curr->next (val: ${nextNodeObj.val}).`);
        steps.push(createStep(6, `Cache nextNode = curr->next (${nextNodeObj.val}) to bubble it forward to prev->next.`, 7, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId, next: nextId }));

        // 2. curr->next = nextNode->next
        const broken1: BrokenLinkState = { fromNodeId: currId, toNodeId: nextId, isRewiredBackward: false };
        allNodes[currNodeIndex].nextId = nextNodeObj.nextId;
        addLog(`Severed ${currNodeObj.val} -> ${nextNodeObj.val}. Rewired ${currNodeObj.val} to point past it to ${nextNodeObj.nextId ? allNodes.find(n => n.id === nextNodeObj.nextId)?.val : 'nullptr'}.`);
        steps.push(createStep(7, `Bypass nextNode by linking curr->next directly to nextNode->next.`, 8, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId, next: nextId }, [broken1]));

        // 3. nextNode->next = prev->next
        const prevNodeObj = allNodes.find(n => n.id === prevId)!;
        const oldPrevNextId = prevNodeObj.nextId;
        const broken2: BrokenLinkState = { fromNodeId: nextId, toNodeId: nextNodeObj.nextId, isRewiredBackward: false };
        const rewire2: BrokenLinkState = { fromNodeId: nextId, toNodeId: oldPrevNextId, isRewiredBackward: true };
        allNodes[nextNodeIndex].nextId = oldPrevNextId;
        addLog(`Rewired nextNode->next to point to old sublist head (val: ${oldPrevNextId ? allNodes.find(n => n.id === oldPrevNextId)?.val : 'nullptr'}).`);
        steps.push(createStep(8, `Stitch nextNode->next to current front of reversed segment (${oldPrevNextId ? allNodes.find(n => n.id === oldPrevNextId)?.val : 'nullptr'}).`, 9, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId, next: nextId }, [broken2, rewire2]));

        // 4. prev->next = nextNode
        const broken3: BrokenLinkState = { fromNodeId: prevId, toNodeId: oldPrevNextId, isRewiredBackward: false };
        const rewire3: BrokenLinkState = { fromNodeId: prevId, toNodeId: nextId, isRewiredBackward: false };
        
        // Mutate prev node next link
        const prevNodeIndex = allNodes.findIndex(n => n.id === prevId);
        allNodes[prevNodeIndex].nextId = nextId;
        addLog(`Rewired prev->next to point to nextNode (val: ${nextNodeObj.val}).`);
        steps.push(createStep(9, `Connect prev->next to the new bubbled-up node ${nextNodeObj.val}.`, 10, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId, next: nextId }, [broken3, rewire3]));
        
        // End of loop cycle step
        addLog(`Completed bubble cycle ${i+1}.`);
        steps.push(createStep(10, `Completed in-place insertion step ${i+1}. List is partially reversed.`, 11, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId }));
      }

      addLog(`Returned dummy.next (val: ${allNodes.find(n => n.id === dummyNode.id)?.nextId ? allNodes.find(n => n.id === allNodes.find(n => n.id === dummyNode.id)!.nextId!)?.val : 'nullptr'}).`);
      steps.push(createStep(11, 'Finished full sublist reversal! Return dummy.next.', 12, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: dummyNode.nextId }));
      
      break;
    }

    case 'swap-pairs': {
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'List is empty.', 1, [], [], {}));
        return steps;
      }

      const dummyNode: ListNodeState = { id: 'dummy-node', val: -1, nextId: nodes[0].id, address: '0x00', isDummy: true };
      const allNodes = [dummyNode, ...nodes];
      const trackNodeIds = [dummyNode.id, ...initialNodeIds];

      addLog('Started Swap Nodes in Pairs process.');
      steps.push(createStep(0, 'Initialize pairwise swaps.', 1, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { head: nodes[0].id }));

      addLog('Create dummy sentinel pointing to head.');
      steps.push(createStep(1, 'Create dummy node pointing to head.', 2, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: nodes[0].id }));

      let prevId = dummyNode.id;
      addLog('Set prev pointer to &dummy.');
      steps.push(createStep(2, 'Initialize prev pointer to dummy node.', 3, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId }));

      while (true) {
        const prevNode = allNodes.find(n => n.id === prevId)!;
        const firstId = prevNode.nextId;
        if (!firstId) break;
        const firstNode = allNodes.find(n => n.id === firstId)!;
        const secondId = firstNode.nextId;
        if (!secondId) break;
        const secondNode = allNodes.find(n => n.id === secondId)!;

        addLog(`Pair swap condition check: at least two nodes exist after prev (${firstNode.val} and ${secondNode.val}).`);
        steps.push(createStep(3, `Loop condition check: pair exists after prev (${firstNode.val} & ${secondNode.val}).`, 4, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, p1: firstId, p2: secondId }));

        addLog(`Set first = prev->next (val: ${firstNode.val}).`);
        steps.push(createStep(4, `Label the first node of current pair (val: ${firstNode.val}).`, 5, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, p1: firstId, p2: secondId }));

        addLog(`Set second = first->next (val: ${secondNode.val}).`);
        steps.push(createStep(5, `Label the second node of current pair (val: ${secondNode.val}).`, 6, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, p1: firstId, p2: secondId }));

        // 1. first->next = second->next
        const broken1: BrokenLinkState = { fromNodeId: firstId, toNodeId: secondId, isRewiredBackward: false };
        const firstIndex = allNodes.findIndex(n => n.id === firstId);
        allNodes[firstIndex].nextId = secondNode.nextId;
        addLog(`Rewired first->next to second->next (val: ${secondNode.nextId ? allNodes.find(n => n.id === secondNode.nextId)?.val : 'nullptr'}).`);
        steps.push(createStep(6, `Bypass second node: wire first->next directly to second->next.`, 7, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, p1: firstId, p2: secondId }, [broken1]));

        // 2. second->next = first
        const broken2: BrokenLinkState = { fromNodeId: secondId, toNodeId: secondNode.nextId, isRewiredBackward: false };
        const rewire2: BrokenLinkState = { fromNodeId: secondId, toNodeId: firstId, isRewiredBackward: true };
        const secondIndex = allNodes.findIndex(n => n.id === secondId);
        allNodes[secondIndex].nextId = firstId;
        addLog(`Rewired second->next backwards to first (val: ${firstNode.val}).`);
        steps.push(createStep(7, `Connect second->next to first node in-place.`, 8, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, p1: firstId, p2: secondId }, [broken2, rewire2]));

        // 3. prev->next = second
        const broken3: BrokenLinkState = { fromNodeId: prevId, toNodeId: firstId, isRewiredBackward: false };
        const rewire3: BrokenLinkState = { fromNodeId: prevId, toNodeId: secondId, isRewiredBackward: false };
        const prevIndex = allNodes.findIndex(n => n.id === prevId);
        allNodes[prevIndex].nextId = secondId;
        addLog(`Rewired prev->next to point to second (val: ${secondNode.val}). Pair swap complete.`);
        steps.push(createStep(8, `Stitch prev->next to point to second node (completing local pair swap).`, 9, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, p1: firstId, p2: secondId }, [broken3, rewire3]));

        // 4. prev = first
        prevId = firstId;
        addLog(`Shifted prev pointer forward to first (val: ${firstNode.val}).`);
        steps.push(createStep(9, `Shift prev pointer forward by two steps to first node (now at tail of swapped pair).`, 10, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId }));
      }

      addLog('No further pairs remain to swap. Loop terminated.');
      steps.push(createStep(10, 'No more pairs remain to swap. Loop terminated.', 4, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId }));

      addLog(`Returned dummy.next (val: ${allNodes.find(n => n.id === dummyNode.id)!.nextId ? allNodes.find(n => n.id === allNodes.find(n => n.id === dummyNode.id)!.nextId!)!.val : 'nullptr'}).`);
      steps.push(createStep(11, 'Swapping completed! Return dummy.next.', 12, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: dummyNode.nextId }));
      
      break;
    }

    case 'reverse-k-group': {
      const k = params.k || 3;
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0 || k < 1) {
        addLog('Empty input or invalid K parameter.');
        steps.push(createStep(0, 'Empty input or invalid parameter.', 1, nodes, [], {}));
        return steps;
      }

      const dummyNode: ListNodeState = { id: 'dummy-node', val: -1, nextId: nodes[0].id, address: '0x00', isDummy: true };
      const allNodes = [dummyNode, ...nodes];
      const trackNodeIds = [dummyNode.id, ...initialNodeIds];

      addLog(`Started Reverse Nodes in K-Group. k = ${k}`);
      steps.push(createStep(0, `Reverse list nodes in segments of size ${k}.`, 1, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { head: nodes[0].id }));

      addLog('Create dummy sentinel pointing to head.');
      steps.push(createStep(1, 'Initialize dummy sentinel node pointing to head.', 2, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: nodes[0].id }));

      let groupPrevId = dummyNode.id;
      addLog('Initialize groupPrev to &dummy.');
      steps.push(createStep(2, 'Set groupPrev pointer to dummy.', 3, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId }));

      while (true) {
        // Find K-th node
        let kthId: string | null = groupPrevId;
        for (let i = 0; i < k; ++i) {
          const ktNode = allNodes.find(n => n.id === kthId);
          if (ktNode) {
            kthId = ktNode.nextId;
          } else {
            kthId = null;
            break;
          }
        }

        const kthNodeName = kthId ? allNodes.find(n => n.id === kthId)?.val : 'nullptr';
        addLog(`Looking for ${k}-th node starting from groupPrev. Found: val: ${kthNodeName}.`);
        steps.push(createStep(4, `Find the ${k}-th node in current group. Found: ${kthNodeName}.`, 5, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId, groupEnd: kthId }));

        if (!kthId) {
          addLog('Remaining list nodes size is less than k. Ending process.');
          steps.push(createStep(5, 'Fewer than k nodes remain. Terminate and leave them unchanged.', 6, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId }));
          break;
        }

        const kthNode = allNodes.find(n => n.id === kthId)!;
        const groupNextId = kthNode.nextId;
        addLog(`Cached groupNext = kth->next (val: ${groupNextId ? allNodes.find(n => n.id === groupNextId)?.val : 'nullptr'}).`);
        steps.push(createStep(6, `Cache groupNext = kth->next (${groupNextId ? 'val: ' + allNodes.find(n => n.id === groupNextId)?.val : 'nullptr'}) to reconnect later.`, 7, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId, groupEnd: kthId, groupNext: groupNextId }));

        // Reverse the segment in-place
        let prevId = groupNextId;
        const groupStartId = allNodes.find(n => n.id === groupPrevId)!.nextId!;
        let currId = groupStartId;

        addLog('Initialize pointers for local reversal of this k-group.');
        steps.push(createStep(7, `Initialize local pointers: prev = groupNext, curr = groupPrev->next.`, 8, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId, groupEnd: kthId, groupNext: groupNextId, prev: prevId, curr: currId, groupStart: groupStartId }, [], {
          kGroupBracket: { startId: groupStartId, endId: kthId, k }
        }));

        // Loop reverse inside group
        while (currId !== groupNextId) {
          const currNodeIndex = allNodes.findIndex(n => n.id === currId);
          const currNodeObj = allNodes[currNodeIndex];
          const nextId = currNodeObj.nextId;

          addLog(`Cached nextNode = curr->next (val: ${nextId ? allNodes.find(n => n.id === nextId)?.val : 'nullptr'}).`);
          steps.push(createStep(10, `Cache nextNode = curr->next.`, 11, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId, groupEnd: kthId, groupNext: groupNextId, prev: prevId, curr: currId, next: nextId, groupStart: groupStartId }, [], {
            kGroupBracket: { startId: groupStartId, endId: kthId, k }
          }));

          const brokenLink: BrokenLinkState = { fromNodeId: currId, toNodeId: nextId, isRewiredBackward: false };
          const rewireLink: BrokenLinkState = { fromNodeId: currId, toNodeId: prevId, isRewiredBackward: true };
          allNodes[currNodeIndex].nextId = prevId;

          addLog(`In k-group: broke forward link of ${currNodeObj.val}. Pointed next back to prev (val: ${prevId ? allNodes.find(n => n.id === prevId)?.val : 'nullptr'}).`);
          steps.push(createStep(11, `Set curr->next = prev to reverse pointer direction inside k-group.`, 12, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId, groupEnd: kthId, groupNext: groupNextId, prev: prevId, curr: currId, next: nextId, groupStart: groupStartId }, [brokenLink, rewireLink], {
            kGroupBracket: { startId: groupStartId, endId: kthId, k }
          }));

          prevId = currId;
          currId = nextId!;

          addLog(`Shifted prev = curr (val: ${allNodes.find(n => n.id === prevId)?.val}).`);
          steps.push(createStep(12, `Shift prev pointer forward to curr.`, 13, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId, groupEnd: kthId, groupNext: groupNextId, prev: prevId, curr: currId, groupStart: groupStartId }, [], {
            kGroupBracket: { startId: groupStartId, endId: kthId, k }
          }));
        }

        addLog(`Finished reversal of group. groupPrev->next points to kth (val: ${kthNode.val}).`);
        const groupPrevNodeIndex = allNodes.findIndex(n => n.id === groupPrevId);
        const oldGroupStartId = allNodes[groupPrevNodeIndex].nextId!;
        
        const brokenS1: BrokenLinkState = { fromNodeId: groupPrevId, toNodeId: oldGroupStartId, isRewiredBackward: false };
        const rewireS1: BrokenLinkState = { fromNodeId: groupPrevId, toNodeId: kthId, isRewiredBackward: false };
        allNodes[groupPrevNodeIndex].nextId = kthId;

        steps.push(createStep(15, `Stitch groupPrev->next to point to kth (${kthNode.val}), the new head of reversed group.`, 17, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId, groupEnd: kthId, groupNext: groupNextId, prev: prevId, groupStart: groupStartId }, [brokenS1, rewireS1]));

        // groupPrev = temp (the old group start)
        groupPrevId = oldGroupStartId;
        addLog(`Moved groupPrev forward to the group tail (val: ${allNodes.find(n => n.id === groupPrevId)?.val}).`);
        steps.push(createStep(17, `Move groupPrev forward to the tail of the newly reversed group (old start).`, 18, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, groupPrev: groupPrevId }));
      }

      addLog(`Returned dummy.next (val: ${allNodes.find(n => n.id === dummyNode.id)!.nextId ? allNodes.find(n => n.id === allNodes.find(n => n.id === dummyNode.id)!.nextId!)!.val : 'nullptr'}).`);
      steps.push(createStep(19, 'K-Group reversal complete! Return dummy.next.', 20, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: dummyNode.nextId }));
      
      break;
    }

    case 'merge-two': {
      const l1 = parseList(list1Input, 0, 1);
      const l2 = parseList(list2Input, 1, 10);
      const initialL1Ids = l1.map(n => n.id);
      const initialL2Ids = l2.map(n => n.id);

      const dummyNode: ListNodeState = { id: 'dummy-node', val: -1, nextId: null, address: '0x00', isDummy: true };
      const allNodes = [dummyNode, ...l1, ...l2];

      addLog('Started Merge Two Sorted Lists process.');
      steps.push(createStep(0, 'Initialize merge process of two sorted lists.', 1, allNodes, [
        { title: 'List 1 (l1)', nodeIds: initialL1Ids },
        { title: 'List 2 (l2)', nodeIds: initialL2Ids },
        { title: 'Merged List (dummy)', nodeIds: [dummyNode.id] },
      ], { p1: l1[0]?.id || null, p2: l2[0]?.id || null }));

      addLog('Create dummy sentinel node.');
      steps.push(createStep(1, 'Instantiate dummy head to anchor merged results.', 2, allNodes, [
        { title: 'List 1 (l1)', nodeIds: initialL1Ids },
        { title: 'List 2 (l2)', nodeIds: initialL2Ids },
        { title: 'Merged List (dummy)', nodeIds: [dummyNode.id] },
      ], { dummy: dummyNode.id, p1: l1[0]?.id || null, p2: l2[0]?.id || null }));

      let tailId = dummyNode.id;
      addLog('Set tail pointing to dummy.');
      steps.push(createStep(2, 'Initialize tail pointer to point to dummy.', 3, allNodes, [
        { title: 'List 1 (l1)', nodeIds: initialL1Ids },
        { title: 'List 2 (l2)', nodeIds: initialL2Ids },
        { title: 'Merged List (dummy)', nodeIds: [dummyNode.id] },
      ], { dummy: dummyNode.id, tail: tailId, p1: l1[0]?.id || null, p2: l2[0]?.id || null }));

      let p1Id: string | null = l1[0]?.id || null;
      let p2Id: string | null = l2[0]?.id || null;
      const mergedIds = [dummyNode.id];

      while (p1Id && p2Id) {
        const node1 = allNodes.find(n => n.id === p1Id)!;
        const node2 = allNodes.find(n => n.id === p2Id)!;

        addLog(`Compare l1 (val: ${node1.val}) vs l2 (val: ${node2.val}).`);
        steps.push(createStep(3, `Loop condition check: compare l1 (${node1.val}) vs l2 (${node2.val}).`, 4, allNodes, [
          { title: 'List 1 (l1)', nodeIds: l1.filter(n => n.id !== p1Id && !mergedIds.includes(n.id)).map(n => n.id) },
          { title: 'List 2 (l2)', nodeIds: l2.filter(n => n.id !== p2Id && !mergedIds.includes(n.id)).map(n => n.id) },
          { title: 'Merged List (dummy)', nodeIds: mergedIds },
        ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }));

        const tailNodeIndex = allNodes.findIndex(n => n.id === tailId);

        if (Number(node1.val) <= Number(node2.val)) {
          addLog(`l1 (${node1.val}) <= l2 (${node2.val}). Append l1 to tail.`);
          const broken = { fromNodeId: tailId, toNodeId: allNodes[tailNodeIndex].nextId, isRewiredBackward: false };
          allNodes[tailNodeIndex].nextId = p1Id;
          mergedIds.push(p1Id);
          steps.push(createStep(5, `Stitch tail->next to l1 node (${node1.val}) as it is smaller.`, 6, allNodes, [
            { title: 'List 1 (l1)', nodeIds: l1.filter(n => n.id !== p1Id && !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'List 2 (l2)', nodeIds: l2.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'Merged List (dummy)', nodeIds: mergedIds },
          ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }, [broken]));

          // Advance p1
          p1Id = node1.nextId;
          addLog(`Shifted l1 pointer forward to ${p1Id ? allNodes.find(n => n.id === p1Id)?.val : 'nullptr'}.`);
          steps.push(createStep(6, `Advance l1 pointer forward to point to next sorted node.`, 7, allNodes, [
            { title: 'List 1 (l1)', nodeIds: l1.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'List 2 (l2)', nodeIds: l2.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'Merged List (dummy)', nodeIds: mergedIds },
          ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }));

        } else {
          addLog(`l2 (${node2.val}) < l1 (${node1.val}). Append l2 to tail.`);
          const broken = { fromNodeId: tailId, toNodeId: allNodes[tailNodeIndex].nextId, isRewiredBackward: false };
          allNodes[tailNodeIndex].nextId = p2Id;
          mergedIds.push(p2Id);
          steps.push(createStep(7, `Stitch tail->next to l2 node (${node2.val}) as it is smaller.`, 8, allNodes, [
            { title: 'List 1 (l1)', nodeIds: l1.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'List 2 (l2)', nodeIds: l2.filter(n => n.id !== p2Id && !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'Merged List (dummy)', nodeIds: mergedIds },
          ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }, [broken]));

          // Advance p2
          p2Id = node2.nextId;
          addLog(`Shifted l2 pointer forward to ${p2Id ? allNodes.find(n => n.id === p2Id)?.val : 'nullptr'}.`);
          steps.push(createStep(8, `Advance l2 pointer forward to point to next sorted node.`, 9, allNodes, [
            { title: 'List 1 (l1)', nodeIds: l1.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'List 2 (l2)', nodeIds: l2.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
            { title: 'Merged List (dummy)', nodeIds: mergedIds },
          ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }));
        }

        // Advance tail
        tailId = allNodes[tailNodeIndex].nextId!;
        addLog(`Advanced tail pointer forward.`);
        steps.push(createStep(11, `Advance the tail pointer to the newly appended node.`, 12, allNodes, [
          { title: 'List 1 (l1)', nodeIds: l1.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
          { title: 'List 2 (l2)', nodeIds: l2.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
          { title: 'Merged List (dummy)', nodeIds: mergedIds },
        ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }));
      }

      addLog('One list has reached NULL. Exiting compare loop.');
      steps.push(createStep(12, 'Exited merge loop since at least one list became empty.', 4, allNodes, [
        { title: 'List 1 (l1)', nodeIds: l1.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
        { title: 'List 2 (l2)', nodeIds: l2.filter(n => !mergedIds.includes(n.id)).map(n => n.id) },
        { title: 'Merged List (dummy)', nodeIds: mergedIds },
      ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }));

      // Append remainder
      const remainderId = p1Id || p2Id;
      const tailIndex = allNodes.findIndex(n => n.id === tailId);
      allNodes[tailIndex].nextId = remainderId;

      if (remainderId) {
        addLog(`Appended remaining nodes from ${p1Id ? 'l1' : 'l2'} starting at val: ${allNodes.find(n => n.id === remainderId)?.val}.`);
        let remCursor: string | null = remainderId;
        while (remCursor) {
          mergedIds.push(remCursor);
          remCursor = allNodes.find(n => n.id === remCursor)?.nextId || null;
        }
      }

      steps.push(createStep(13, `Stitch any remaining nodes from ${p1Id ? 'l1' : 'l2'} directly to tail->next.`, 14, allNodes, [
        { title: 'List 1 (l1)', nodeIds: [] },
        { title: 'List 2 (l2)', nodeIds: [] },
        { title: 'Merged List (dummy)', nodeIds: mergedIds },
      ], { dummy: dummyNode.id, tail: tailId, p1: p1Id, p2: p2Id }));

      addLog('Merged finished. Returned dummy.next.');
      steps.push(createStep(14, 'Merging complete! Return dummy.next.', 15, allNodes, [
        { title: 'List 1 (l1)', nodeIds: [] },
        { title: 'List 2 (l2)', nodeIds: [] },
        { title: 'Merged List (dummy)', nodeIds: mergedIds },
      ], { dummy: dummyNode.id, head: dummyNode.nextId }));

      break;
    }

    case 'add-two': {
      const l1 = parseList(list1Input, 0, 1);
      const l2 = parseList(list2Input, 1, 10);
      let p1Id: string | null = l1[0]?.id || null;
      let p2Id: string | null = l2[0]?.id || null;

      const dummyNode: ListNodeState = { id: 'dummy-node', val: -1, nextId: null, address: '0x00', isDummy: true };
      const allNodes = [dummyNode, ...l1, ...l2];

      addLog('Started Add Two Numbers digits representation.');
      steps.push(createStep(0, 'Initialize adding two linked lists column-by-column.', 1, allNodes, [
        { title: 'Number 1 (l1)', nodeIds: l1.map(n => n.id) },
        { title: 'Number 2 (l2)', nodeIds: l2.map(n => n.id) },
        { title: 'Sum Output', nodeIds: [dummyNode.id] },
      ], { p1: p1Id, p2: p2Id }));

      addLog('Create dummy sentinel node.');
      steps.push(createStep(1, 'Instantiate dummy node to anchor addition output.', 2, allNodes, [
        { title: 'Number 1 (l1)', nodeIds: l1.map(n => n.id) },
        { title: 'Number 2 (l2)', nodeIds: l2.map(n => n.id) },
        { title: 'Sum Output', nodeIds: [dummyNode.id] },
      ], { dummy: dummyNode.id, p1: p1Id, p2: p2Id }));

      let currId = dummyNode.id;
      addLog('Initialize curr pointer to dummy node.');
      steps.push(createStep(2, 'Initialize curr pointer to dummy.', 3, allNodes, [
        { title: 'Number 1 (l1)', nodeIds: l1.map(n => n.id) },
        { title: 'Number 2 (l2)', nodeIds: l2.map(n => n.id) },
        { title: 'Sum Output', nodeIds: [dummyNode.id] },
      ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }));

      let carry = 0;
      addLog('Set carry = 0.');
      steps.push(createStep(3, 'Set carry state initially to 0.', 4, allNodes, [
        { title: 'Number 1 (l1)', nodeIds: l1.map(n => n.id) },
        { title: 'Number 2 (l2)', nodeIds: l2.map(n => n.id) },
        { title: 'Sum Output', nodeIds: [dummyNode.id] },
      ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], { carry }));

      const outputIds = [dummyNode.id];
      let sumNodeOffset = 20;

      while (p1Id || p2Id || carry > 0) {
        addLog(`Column addition loop check: adding digits (carry: ${carry}).`);
        steps.push(createStep(4, 'Loop iteration check: nodes remaining or positive carry exists.', 5, allNodes, [
          { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Sum Output', nodeIds: outputIds },
        ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], { carry }));

        const val1 = p1Id ? Number(allNodes.find(n => n.id === p1Id)!.val) : 0;
        const val2 = p2Id ? Number(allNodes.find(n => n.id === p2Id)!.val) : 0;

        addLog(`Extracted values: val1 = ${val1}, val2 = ${val2}.`);
        steps.push(createStep(5, `Extract digits. val1 = ${p1Id ? val1 : '0 (null)'}, val2 = ${p2Id ? val2 : '0 (null)'}.`, 6, allNodes, [
          { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Sum Output', nodeIds: outputIds },
        ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], { carry }));

        const sum = val1 + val2 + carry;
        addLog(`Sum = val1 + val2 + carry = ${val1} + ${val2} + ${carry} = ${sum}`);
        steps.push(createStep(7, `Calculate sum = val1 + val2 + carry = ${sum}.`, 8, allNodes, [
          { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Sum Output', nodeIds: outputIds },
        ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], {
          carry,
          mathState: { val1, val2, sum, carry }
        }));

        carry = Math.floor(sum / 10);
        addLog(`New carry = sum / 10 = ${carry}`);
        steps.push(createStep(8, `Determine carry to propagate = ${carry}.`, 9, allNodes, [
          { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Sum Output', nodeIds: outputIds },
        ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], {
          carry,
          mathState: { val1, val2, sum, carry }
        }));

        const digitNodeId = `node-sum-${sumNodeOffset}`;
        const newDigitVal = sum % 10;
        const newDigitNode: ListNodeState = {
          id: digitNodeId,
          val: newDigitVal,
          nextId: null,
          address: makeAddress(sumNodeOffset),
          originalTrack: 2
        };
        allNodes.push(newDigitNode);
        sumNodeOffset++;

        const currIndex = allNodes.findIndex(n => n.id === currId);
        allNodes[currIndex].nextId = digitNodeId;
        outputIds.push(digitNodeId);

        addLog(`Created sum node (val: ${newDigitVal}) and connected to curr->next.`);
        steps.push(createStep(9, `Create node ${newDigitVal} (sum % 10) and link to curr->next.`, 10, allNodes, [
          { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Sum Output', nodeIds: outputIds },
        ], { dummy: dummyNode.id, curr: currId, next: digitNodeId, p1: p1Id, p2: p2Id }, [], {
          carry,
          mathState: { val1, val2, sum, carry, newDigit: newDigitVal }
        }));

        currId = digitNodeId;
        addLog('Advanced curr forward.');
        steps.push(createStep(10, `Advance curr pointer to newly created digit node.`, 11, allNodes, [
          { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
          { title: 'Sum Output', nodeIds: outputIds },
        ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], { carry }));

        // Shift lists
        if (p1Id) {
          p1Id = allNodes.find(n => n.id === p1Id)!.nextId;
          addLog(`Shifted l1 list head forward.`);
          steps.push(createStep(11, `Shift l1 list pointer forward.`, 12, allNodes, [
            { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
            { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
            { title: 'Sum Output', nodeIds: outputIds },
          ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], { carry }));
        }

        if (p2Id) {
          p2Id = allNodes.find(n => n.id === p2Id)!.nextId;
          addLog(`Shifted l2 list head forward.`);
          steps.push(createStep(12, `Shift l2 list pointer forward.`, 13, allNodes, [
            { title: 'Number 1 (l1)', nodeIds: l1.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
            { title: 'Number 2 (l2)', nodeIds: l2.filter(n => !outputIds.includes(n.id)).map(n => n.id) },
            { title: 'Sum Output', nodeIds: outputIds },
          ], { dummy: dummyNode.id, curr: currId, p1: p1Id, p2: p2Id }, [], { carry }));
        }
      }

      addLog('All digits added. Output complete.');
      steps.push(createStep(13, 'Reached addition end (no nodes remaining and carry is zero).', 5, allNodes, [
        { title: 'Number 1 (l1)', nodeIds: [] },
        { title: 'Number 2 (l2)', nodeIds: [] },
        { title: 'Sum Output', nodeIds: outputIds },
      ], { dummy: dummyNode.id, curr: currId }, [], { carry }));

      addLog('Returned dummy.next.');
      steps.push(createStep(14, 'Function complete! Return dummy.next as the final sum linked list.', 15, allNodes, [
        { title: 'Number 1 (l1)', nodeIds: [] },
        { title: 'Number 2 (l2)', nodeIds: [] },
        { title: 'Sum Output', nodeIds: outputIds },
      ], { dummy: dummyNode.id, head: dummyNode.nextId }));

      break;
    }

    case 'merge-k': {
      // Simulate Merge K Sorted Lists (3 lists)
      const l1 = parseList(list1Input, 0, 1);
      const l2 = parseList(list2Input, 1, 10);
      const l3 = parseList(list3Input, 2, 20);

      const allNodes = [...l1, ...l2, ...l3];
      addLog('Started Merge K Sorted Lists Divide-and-Conquer process.');
      steps.push(createStep(0, 'Initialize Divide & Conquer pairwise merging of K sorted lists.', 1, allNodes, [
        { title: 'List 1', nodeIds: l1.map(n => n.id) },
        { title: 'List 2', nodeIds: l2.map(n => n.id) },
        { title: 'List 3', nodeIds: l3.map(n => n.id) },
      ], {}));

      // Simulate step 1: Merge List 1 and List 2
      addLog('Merging List 1 and List 2...');
      const dummy1: ListNodeState = { id: 'dummy-m1', val: -1, nextId: null, address: '0x91', isDummy: true };
      allNodes.push(dummy1);
      
      // Let's create sorted nodes based on elements of l1 & l2
      const sortedL1L2 = [...l1, ...l2].sort((a,b) => Number(a.val) - Number(b.val));
      const sortedIds1: string[] = [];
      let lastId: string = dummy1.id;
      
      sortedL1L2.forEach((n, index) => {
        const nodeIdx = allNodes.findIndex(node => node.id === n.id);
        allNodes[nodeIdx].nextId = null; // isolate
        const prevNodeIdx = allNodes.findIndex(node => node.id === lastId);
        allNodes[prevNodeIdx].nextId = n.id;
        sortedIds1.push(n.id);
        lastId = n.id;
      });

      steps.push(createStep(4, 'Merge List 1 and List 2 together in sorted order.', 5, allNodes, [
        { title: 'Merged (L1 + L2)', nodeIds: [dummy1.id, ...sortedIds1] },
        { title: 'List 3', nodeIds: l3.map(n => n.id) },
      ], { dummy: dummy1.id, head: dummy1.nextId }));

      // Simulate step 2: Merge the result with List 3
      addLog('Merging (List 1 + List 2) with List 3...');
      const dummy2: ListNodeState = { id: 'dummy-m2', val: -1, nextId: null, address: '0x92', isDummy: true };
      allNodes.push(dummy2);

      const finalSorted = [...l1, ...l2, ...l3].sort((a,b) => Number(a.val) - Number(b.val));
      const finalIds: string[] = [];
      let finalLastId: string = dummy2.id;

      finalSorted.forEach((n) => {
        const nodeIdx = allNodes.findIndex(node => node.id === n.id);
        allNodes[nodeIdx].nextId = null;
        const prevNodeIdx = allNodes.findIndex(node => node.id === finalLastId);
        allNodes[prevNodeIdx].nextId = n.id;
        finalIds.push(n.id);
        finalLastId = n.id;
      });

      steps.push(createStep(6, 'Merge the composite list with List 3 to form the final sorted chain.', 7, allNodes, [
        { title: 'Final Sorted List', nodeIds: [dummy2.id, ...finalIds] },
      ], { dummy: dummy2.id, head: dummy2.nextId }));

      addLog('Successfully merged all lists.');
      steps.push(createStep(8, 'Divide and conquer completed! Only one fully merged sorted list remains.', 9, allNodes, [
        { title: 'Final Output', nodeIds: finalIds },
      ], { head: dummy2.nextId }));

      break;
    }

    case 'partition-list': {
      const x = params.x || 3;
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);

      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      const lessHeadNode: ListNodeState = { id: 'less-head', val: -1, nextId: null, address: '0x00', isDummy: true };
      const greaterHeadNode: ListNodeState = { id: 'greater-head', val: -1, nextId: null, address: '0x99', isDummy: true };
      const allNodes = [lessHeadNode, greaterHeadNode, ...nodes];

      addLog(`Started Partition List around pivot x = ${x}.`);
      steps.push(createStep(0, `Partition nodes so that values < ${x} appear before values >= ${x}.`, 1, allNodes, [
        { title: 'Original List', nodeIds: initialNodeIds },
        { title: 'Less List (< x)', nodeIds: [lessHeadNode.id] },
        { title: 'Greater List (>= x)', nodeIds: [greaterHeadNode.id] },
      ], { head: nodes[0].id }));

      addLog('Create two dummy nodes: lessHead and greaterHead.');
      steps.push(createStep(1, 'Initialize two dummy head sentinel nodes to anchor divided sublists.', 2, allNodes, [
        { title: 'Original List', nodeIds: initialNodeIds },
        { title: 'Less List (< x)', nodeIds: [lessHeadNode.id] },
        { title: 'Greater List (>= x)', nodeIds: [greaterHeadNode.id] },
      ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id }));

      let lessTailId = lessHeadNode.id;
      let greaterTailId = greaterHeadNode.id;

      addLog('Initialize lessTail and greaterTail pointers to respective dummies.');
      steps.push(createStep(2, 'Initialize tail tracking pointers lessTail and greaterTail.', 3, allNodes, [
        { title: 'Original List', nodeIds: initialNodeIds },
        { title: 'Less List (< x)', nodeIds: [lessHeadNode.id] },
        { title: 'Greater List (>= x)', nodeIds: [greaterHeadNode.id] },
      ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId }));

      let currId: string | null = nodes[0].id;
      addLog(`Set curr = head (val: ${nodes[0].val}).`);
      steps.push(createStep(4, `Initialize curr pointing to head node (val: ${nodes[0].val}).`, 5, allNodes, [
        { title: 'Original List', nodeIds: initialNodeIds },
        { title: 'Less List (< x)', nodeIds: [lessHeadNode.id] },
        { title: 'Greater List (>= x)', nodeIds: [greaterHeadNode.id] },
      ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId, curr: currId }));

      const lessIds = [lessHeadNode.id];
      const greaterIds = [greaterHeadNode.id];

      while (currId) {
        const currNodeIndex = allNodes.findIndex(n => n.id === currId);
        const currNodeObj = allNodes[currNodeIndex];
        const nextId = currNodeObj.nextId;

        addLog(`Evaluating node val: ${currNodeObj.val}. Compare with pivot ${x}.`);
        steps.push(createStep(5, `Loop condition: check value of node ${currNodeObj.val} against partition ${x}.`, 6, allNodes, [
          { title: 'Unprocessed', nodeIds: initialNodeIds.filter(id => id !== currId && !lessIds.includes(id) && !greaterIds.includes(id)) },
          { title: 'Less List (< x)', nodeIds: lessIds },
          { title: 'Greater List (>= x)', nodeIds: greaterIds },
        ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId, curr: currId }, [], {
          partitionState: { lessIds, greaterIds }
        }));

        if (Number(currNodeObj.val) < x) {
          addLog(`val ${currNodeObj.val} < ${x}. Stitching node to less list.`);
          const lessTailIndex = allNodes.findIndex(n => n.id === lessTailId);
          const brokenLink = { fromNodeId: lessTailId, toNodeId: allNodes[lessTailIndex].nextId, isRewiredBackward: false };
          allNodes[lessTailIndex].nextId = currId;
          lessIds.push(currId);

          steps.push(createStep(7, `Connect lessTail->next to curr node (${currNodeObj.val}).`, 8, allNodes, [
            { title: 'Unprocessed', nodeIds: initialNodeIds.filter(id => id !== currId && !lessIds.includes(id) && !greaterIds.includes(id)) },
            { title: 'Less List (< x)', nodeIds: lessIds },
            { title: 'Greater List (>= x)', nodeIds: greaterIds },
          ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId, curr: currId }, [brokenLink], {
            partitionState: { lessIds, greaterIds }
          }));

          lessTailId = currId;
          addLog('Advanced lessTail forward.');
          steps.push(createStep(8, `Advance lessTail pointer forward.`, 9, allNodes, [
            { title: 'Unprocessed', nodeIds: initialNodeIds.filter(id => !lessIds.includes(id) && !greaterIds.includes(id)) },
            { title: 'Less List (< x)', nodeIds: lessIds },
            { title: 'Greater List (>= x)', nodeIds: greaterIds },
          ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId, curr: currId }, [], {
            partitionState: { lessIds, greaterIds }
          }));

        } else {
          addLog(`val ${currNodeObj.val} >= ${x}. Stitching node to greater list.`);
          const greaterTailIndex = allNodes.findIndex(n => n.id === greaterTailId);
          const brokenLink = { fromNodeId: greaterTailId, toNodeId: allNodes[greaterTailIndex].nextId, isRewiredBackward: false };
          allNodes[greaterTailIndex].nextId = currId;
          greaterIds.push(currId);

          steps.push(createStep(9, `Connect greaterTail->next to curr node (${currNodeObj.val}).`, 10, allNodes, [
            { title: 'Unprocessed', nodeIds: initialNodeIds.filter(id => id !== currId && !lessIds.includes(id) && !greaterIds.includes(id)) },
            { title: 'Less List (< x)', nodeIds: lessIds },
            { title: 'Greater List (>= x)', nodeIds: greaterIds },
          ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId, curr: currId }, [brokenLink], {
            partitionState: { lessIds, greaterIds }
          }));

          greaterTailId = currId;
          addLog('Advanced greaterTail forward.');
          steps.push(createStep(10, `Advance greaterTail pointer forward.`, 11, allNodes, [
            { title: 'Unprocessed', nodeIds: initialNodeIds.filter(id => !lessIds.includes(id) && !greaterIds.includes(id)) },
            { title: 'Less List (< x)', nodeIds: lessIds },
            { title: 'Greater List (>= x)', nodeIds: greaterIds },
          ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId, curr: currId }, [], {
            partitionState: { lessIds, greaterIds }
          }));
        }

        currId = nextId;
        addLog(`Advanced curr pointer to next.`);
        steps.push(createStep(13, `Advance curr pointer to next node (${currId ? 'val: ' + allNodes.find(n => n.id === currId)?.val : 'nullptr'}).`, 15, allNodes, [
          { title: 'Unprocessed', nodeIds: initialNodeIds.filter(id => !lessIds.includes(id) && !greaterIds.includes(id)) },
          { title: 'Less List (< x)', nodeIds: lessIds },
          { title: 'Greater List (>= x)', nodeIds: greaterIds },
        ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId, curr: currId }, [], {
          partitionState: { lessIds, greaterIds }
        }));
      }

      addLog('Exited partition loop. Severing greaterTail->next to prevent cycles.');
      const greaterTailIndex = allNodes.findIndex(n => n.id === greaterTailId);
      const brokenFinal = { fromNodeId: greaterTailId, toNodeId: allNodes[greaterTailIndex].nextId, isRewiredBackward: false };
      allNodes[greaterTailIndex].nextId = null;

      steps.push(createStep(15, 'Set greaterTail->next = nullptr to prevent cycles in rewired lists.', 17, allNodes, [
        { title: 'Less List (< x)', nodeIds: lessIds },
        { title: 'Greater List (>= x)', nodeIds: greaterIds },
      ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId }, [brokenFinal]));

      addLog('Stitching lessTail->next to greaterHead.next.');
      const lessTailIndex = allNodes.findIndex(n => n.id === lessTailId);
      const stitchLink = { fromNodeId: lessTailId, toNodeId: greaterHeadNode.nextId, isRewiredBackward: false };
      allNodes[lessTailIndex].nextId = greaterHeadNode.nextId;

      steps.push(createStep(16, `Stitch less sublist end (lessTail->next) to greater sublist start (${greaterHeadNode.nextId ? allNodes.find(n => n.id === greaterHeadNode.nextId)?.val : 'nullptr'}).`, 18, allNodes, [
        { title: 'Final Partitioned List', nodeIds: [...lessIds, ...greaterIds.filter(id => id !== greaterHeadNode.id)] },
      ], { lessHead: lessHeadNode.id, greaterHead: greaterHeadNode.id, lessTail: lessTailId, greaterTail: greaterTailId }, [stitchLink]));

      addLog('Partition completed. Returned lessHead.next.');
      steps.push(createStep(17, 'Partition complete! Return lessHead.next.', 19, allNodes, [
        { title: 'Final Output', nodeIds: [...lessIds, ...greaterIds.filter(id => id !== greaterHeadNode.id)] },
      ], { head: lessHeadNode.nextId }));

      break;
    }

    case 'remove-duplicates': {
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      addLog('Started Remove Duplicates from Sorted List I.');
      steps.push(createStep(0, 'Initialize duplicates removal in sorted list.', 1, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id }));

      let currId: string | null = nodes[0].id;
      addLog(`Set curr = head (val: ${nodes[0].val}).`);
      steps.push(createStep(1, `Set curr pointer to head node (val: ${nodes[0].val}).`, 2, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: currId }));

      while (currId) {
        const currNodeIndex = nodes.findIndex(n => n.id === currId);
        const currNode = nodes[currNodeIndex];
        const nextId = currNode.nextId;

        if (!nextId) break;
        const nextNode = nodes.find(n => n.id === nextId)!;

        addLog(`Loop check: curr (${currNode.val}) vs next (${nextNode.val}).`);
        steps.push(createStep(2, `Check if curr (${currNode.val}) value matches next (${nextNode.val}) value.`, 3, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: currId, next: nextId }));

        if (currNode.val === nextNode.val) {
          addLog(`Duplicate detected! Bypass duplicate node (val: ${nextNode.val}).`);
          const broken = { fromNodeId: currId, toNodeId: nextId, isRewiredBackward: false };
          nodes[currNodeIndex].nextId = nextNode.nextId;
          
          // Mark bypassed for visualization strike-out
          const dupIndex = nodes.findIndex(n => n.id === nextId);
          nodes[dupIndex].isBypassed = true;

          steps.push(createStep(4, `Bypass identical neighbor node ${nextNode.val} by updating curr->next.`, 6, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: currId, next: nextId, temp: nextId }, [broken]));
          
          addLog(`Freed duplicate node memory (val: ${nextNode.val}).`);
          steps.push(createStep(5, `Free bypassed duplicate node (${nextNode.val}) memory.`, 7, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: currId }));
        } else {
          addLog('Adjacent values differ. Advance curr pointer.');
          currId = nextId;
          steps.push(createStep(7, `Values differ, so advance curr pointer forward to next node.`, 9, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: currId }));
        }
      }

      addLog('No further duplicates remaining. Finished process.');
      steps.push(createStep(10, 'Finished parsing list. All duplicate instances removed.', 11, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: null }));

      addLog('Returned head.');
      steps.push(createStep(11, 'Return head of the updated list.', 12, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0]?.id || null }));

      break;
    }

    case 'remove-duplicates-ii': {
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      const dummyNode: ListNodeState = { id: 'dummy-node', val: -1, nextId: nodes[0].id, address: '0x00', isDummy: true };
      const allNodes = [dummyNode, ...nodes];
      const trackNodeIds = [dummyNode.id, ...initialNodeIds];

      addLog('Started Remove Duplicates II (remove all occurrences of duplicates).');
      steps.push(createStep(0, 'Initialize complete duplicates removal.', 1, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { head: nodes[0].id }));

      addLog('Create dummy sentinel pointing to head.');
      steps.push(createStep(1, 'Instantiate dummy sentinel node pointing to head.', 2, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: nodes[0].id }));

      let prevId = dummyNode.id;
      addLog('Set prev pointer to &dummy.');
      steps.push(createStep(2, 'Set prev pointer to dummy node.', 3, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId }));

      while (true) {
        const prevNodeObj = allNodes.find(n => n.id === prevId)!;
        const currId = prevNodeObj.nextId;
        if (!currId) break;

        addLog(`Loop condition check: node after prev is val: ${allNodes.find(n => n.id === currId)?.val}.`);
        steps.push(createStep(3, `Loop condition: check if node exists after prev.`, 4, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId }));

        const currNodeObj = allNodes.find(n => n.id === currId)!;
        const nextId = currNodeObj.nextId;

        if (nextId && currNodeObj.val === allNodes.find(n => n.id === nextId)!.val) {
          addLog(`Duplicate sequence identified starting at val: ${currNodeObj.val}. Finding end of the duplicates sequence...`);
          steps.push(createStep(5, `Duplicate run found starting at val ${currNodeObj.val}. Moving forward to find sequence end.`, 6, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: currId, next: nextId }));

          let runId: string | null = currId;
          const duplicateVal = currNodeObj.val;

          while (runId) {
            const runNode = allNodes.find(n => n.id === runId)!;
            if (runNode.val === duplicateVal) {
              const runNodeIndex = allNodes.findIndex(n => n.id === runId);
              allNodes[runNodeIndex].isBypassed = true; // flag to fade out
              runId = runNode.nextId;
            } else {
              break;
            }
          }

          const afterRunId = runId;
          addLog(`Found duplicates run end. Node after duplicates run: val: ${afterRunId ? allNodes.find(n => n.id === afterRunId)?.val : 'nullptr'}.`);
          
          const broken = { fromNodeId: prevId, toNodeId: currId, isRewiredBackward: false };
          const prevIndex = allNodes.findIndex(n => n.id === prevId);
          allNodes[prevIndex].nextId = afterRunId;

          steps.push(createStep(7, `Bypass all duplicates of val ${duplicateVal} by rewiring prev->next to point past run tail.`, 10, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId, curr: afterRunId }, [broken]));

        } else {
          addLog(`Distinct value node detected (val: ${currNodeObj.val}). Advance prev forward.`);
          prevId = currId;
          steps.push(createStep(9, `No duplicates at curr. Safe to advance prev to point to curr.`, 11, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, prev: prevId }));
        }
      }

      addLog('Parsing complete. Return dummy.next.');
      steps.push(createStep(12, 'Removal finished. Return dummy.next.', 14, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: dummyNode.nextId }));

      break;
    }

    case 'odd-even': {
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      addLog('Started Odd Even Linked List indexing partition.');
      steps.push(createStep(0, 'Group all odd-indexed nodes followed by even-indexed nodes in-place.', 1, nodes, [
        { title: 'Original List', nodeIds: initialNodeIds },
      ], { head: nodes[0].id }));

      let oddId = nodes[0].id;
      let evenId = nodes[0].nextId;
      const evenHeadId = evenId;

      addLog(`Initialize odd pointer to index 1 (val: ${nodes[0].val}).`);
      steps.push(createStep(1, `Set odd pointer to head (val: ${nodes[0].val}).`, 3, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { odd: oddId }));

      addLog(`Initialize even pointer to index 2 (val: ${evenId ? nodes.find(n => n.id === evenId)?.val : 'nullptr'}).`);
      steps.push(createStep(2, `Set even pointer to second node.`, 4, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { odd: oddId, even: evenId, evenHead: evenHeadId }));

      const oddIds = [oddId];
      const evenIds = evenId ? [evenId] : [];

      while (evenId && nodes.find(n => n.id === evenId)!.nextId) {
        const oddNodeIndex = nodes.findIndex(n => n.id === oddId);
        const oddNode = nodes[oddNodeIndex];
        const evenNodeIndex = nodes.findIndex(n => n.id === evenId);
        const evenNode = nodes[evenNodeIndex];

        addLog(`Loop condition check: even node exists.`);
        steps.push(createStep(4, 'Loop iteration: process next pair of indices.', 6, nodes, [
          { title: 'Odd Nodes Chain', nodeIds: oddIds },
          { title: 'Even Nodes Chain', nodeIds: evenIds },
        ], { odd: oddId, even: evenId, evenHead: evenHeadId }));

        // 1. odd->next = even->next
        const nextOddId = evenNode.nextId!;
        const broken1 = { fromNodeId: oddId, toNodeId: oddNode.nextId, isRewiredBackward: false };
        nodes[oddNodeIndex].nextId = nextOddId;
        oddIds.push(nextOddId);

        addLog(`Rewire odd->next to skip even node (wire to val: ${nodes.find(n => n.id === nextOddId)?.val}).`);
        steps.push(createStep(5, `Sew odd->next to even->next to bypass even node.`, 7, nodes, [
          { title: 'Odd Nodes Chain', nodeIds: oddIds },
          { title: 'Even Nodes Chain', nodeIds: evenIds },
        ], { odd: oddId, even: evenId, evenHead: evenHeadId, next: nextOddId }, [broken1]));

        // 2. odd = odd->next
        oddId = nextOddId;
        addLog(`Advance odd pointer to next node.`);
        steps.push(createStep(6, `Advance odd pointer forward to the new odd node.`, 8, nodes, [
          { title: 'Odd Nodes Chain', nodeIds: oddIds },
          { title: 'Even Nodes Chain', nodeIds: evenIds },
        ], { odd: oddId, even: evenId, evenHead: evenHeadId }));

        // 3. even->next = odd->next
        const nextEvenId = nodes.find(n => n.id === oddId)!.nextId;
        const broken2 = { fromNodeId: evenId, toNodeId: evenNode.nextId, isRewiredBackward: false };
        nodes[evenNodeIndex].nextId = nextEvenId;
        if (nextEvenId) evenIds.push(nextEvenId);

        addLog(`Rewire even->next to skip odd node (wire to val: ${nextEvenId ? nodes.find(n => n.id === nextEvenId)?.val : 'nullptr'}).`);
        steps.push(createStep(7, `Sew even->next to odd->next to bypass odd node.`, 9, nodes, [
          { title: 'Odd Nodes Chain', nodeIds: oddIds },
          { title: 'Even Nodes Chain', nodeIds: evenIds },
        ], { odd: oddId, even: evenId, evenHead: evenHeadId, next: nextEvenId }, [broken2]));

        // 4. even = even->next
        evenId = nextEvenId;
        addLog('Advance even pointer to next node.');
        steps.push(createStep(8, `Advance even pointer forward to the new even node.`, 10, nodes, [
          { title: 'Odd Nodes Chain', nodeIds: oddIds },
          { title: 'Even Nodes Chain', nodeIds: evenIds },
        ], { odd: oddId, even: evenId, evenHead: evenHeadId }));
      }

      addLog('Loop complete. Stitching odd list end to evenHead.');
      const oddNodeIndex = nodes.findIndex(n => n.id === oddId);
      const brokenFinal = { fromNodeId: oddId, toNodeId: nodes[oddNodeIndex].nextId, isRewiredBackward: false };
      const rewireFinal = { fromNodeId: oddId, toNodeId: evenHeadId, isRewiredBackward: false };
      nodes[oddNodeIndex].nextId = evenHeadId;

      steps.push(createStep(9, 'Stitch odd->next to the cached evenHead, merging the two chains.', 12, nodes, [
        { title: 'Merged Odd-Even List', nodeIds: [...oddIds, ...evenIds] },
      ], { odd: oddId, evenHead: evenHeadId }, [brokenFinal, rewireFinal]));

      addLog('Returned head.');
      steps.push(createStep(10, 'Finished grouping! Return head of list.', 13, nodes, [
        { title: 'Final List', nodeIds: [...oddIds, ...evenIds] },
      ], { head: nodes[0].id }));

      break;
    }

    case 'rotate-list': {
      let k = params.k || 2;
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0 || k < 1) {
        addLog('Empty input or zero rotation.');
        steps.push(createStep(0, 'Invalid parameters or empty list.', 1, nodes, [], {}));
        return steps;
      }

      addLog(`Started Rotate List Right by k = ${k}.`);
      steps.push(createStep(0, `Rotate list right by ${k} positions in-place.`, 1, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id }));

      const len = nodes.length;
      addLog(`Calculated length: ${len}. Finding tail node...`);
      let tailId = nodes[len - 1].id;
      steps.push(createStep(4, `Traverse to find tail. List length: ${len}.`, 5, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, tail: tailId }));

      // Form a circular ring
      addLog('Connecting tail->next to head to form a circular ring.');
      const tailNodeIndex = nodes.findIndex(n => n.id === tailId);
      const ringLink = { fromNodeId: tailId, toNodeId: nodes[0].id, isRewiredBackward: false };
      nodes[tailNodeIndex].nextId = nodes[0].id;

      steps.push(createStep(5, `Close the loop by pointing tail->next to head. List is now circular.`, 6, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, tail: tailId }, [ringLink]));

      k = k % len;
      const stepsToSplit = len - k;
      addLog(`Modulo rotation steps: k = ${k}. Walk steps to split: len - k = ${stepsToSplit}.`);
      steps.push(createStep(6, `Compute split offset steps = ${stepsToSplit} (k = k % len).`, 8, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, tail: tailId }));

      // Find split node
      let splitCursorId = tailId;
      for (let i = 0; i < stepsToSplit; ++i) {
        const cursorNodeObj = nodes.find(n => n.id === splitCursorId)!;
        splitCursorId = cursorNodeObj.nextId!;
        addLog(`Advance split cursor (step ${i + 1} / ${stepsToSplit}).`);
        steps.push(createStep(8, `Traverse circular list to find split position (step ${i + 1}).`, 9, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, tail: splitCursorId }));
      }

      const splitNodeObj = nodes.find(n => n.id === splitCursorId)!;
      const newHeadId = splitNodeObj.nextId!;
      addLog(`Identified split location. newHead is val: ${nodes.find(n => n.id === newHeadId)?.val}.`);
      steps.push(createStep(9, `Label next node (${nodes.find(n => n.id === newHeadId)?.val}) as the new list head.`, 10, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id, tail: splitCursorId, next: newHeadId }));

      // Break circle
      addLog('Severing circular ring link.');
      const splitNodeIndex = nodes.findIndex(n => n.id === splitCursorId);
      const brokenCircle = { fromNodeId: splitCursorId, toNodeId: newHeadId, isRewiredBackward: false };
      nodes[splitNodeIndex].nextId = null;

      // Rearrange ids for rendering track
      const rearrangedIds: string[] = [];
      let rCursor: string | null = newHeadId;
      while (rCursor) {
        rearrangedIds.push(rCursor);
        rCursor = nodes.find(n => n.id === rCursor)?.nextId || null;
      }

      steps.push(createStep(10, `Sever tail->next to break the circle and complete rotation.`, 11, nodes, [{ title: 'Main List', nodeIds: rearrangedIds }], { head: newHeadId, tail: splitCursorId }, [brokenCircle]));

      addLog('Returned new head node.');
      steps.push(createStep(11, 'Finished rotation! Return newHead.', 12, nodes, [{ title: 'Main List', nodeIds: rearrangedIds }], { head: newHeadId }));

      break;
    }

    case 'delete-node': {
      // LeetCode #237: Given access only to the node to be deleted (we don't have head)
      const valToDelete = params.valToDelete || 5;
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);

      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      addLog(`Started Delete Node in a Linked List (val to delete: ${valToDelete}).`);
      steps.push(createStep(0, `Delete node in-place without head access. Target value: ${valToDelete}.`, 1, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { head: nodes[0].id }));

      const targetId = nodes.find(n => n.val === valToDelete)?.id || nodes[1]?.id;
      if (!targetId) {
        addLog('Target node not found.');
        return steps;
      }

      const targetNodeIndex = nodes.findIndex(n => n.id === targetId);
      const targetNode = nodes[targetNodeIndex];
      const nextId = targetNode.nextId!;
      const nextNode = nodes.find(n => n.id === nextId)!;

      addLog(`Set pointer nextNode = node->next (val: ${nextNode.val}).`);
      steps.push(createStep(1, `Cache nextNode = node->next (${nextNode.val}) which we will copy and skip.`, 2, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: targetId, next: nextId }));

      // Copy value
      const oldVal = targetNode.val;
      nodes[targetNodeIndex].val = nextNode.val;
      addLog(`Overwrote value: targetNode->val = nextNode->val. Updated val from ${oldVal} to ${nextNode.val}.`);
      steps.push(createStep(2, `Copy successor node value (${nextNode.val}) into target node, overwriting its old value.`, 3, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: targetId, next: nextId }));

      // Bypass nextNode
      const broken = { fromNodeId: targetId, toNodeId: nextId, isRewiredBackward: false };
      nodes[targetNodeIndex].nextId = nextNode.nextId;
      
      const nextIndex = nodes.findIndex(n => n.id === nextId);
      nodes[nextIndex].isBypassed = true; // flag to show strikeout

      addLog(`Bypassed successor node.`);
      steps.push(createStep(3, `Rewire node->next directly past cached successor to node->next->next.`, 4, nodes, [{ title: 'Main List', nodeIds: initialNodeIds }], { curr: targetId, next: nextId }, [broken]));

      addLog('Freed cached successor memory.');
      const cleanedIds = nodes.filter(n => !n.isBypassed).map(n => n.id);
      steps.push(createStep(4, 'Complete deletion by deallocating bypassed successor.', 5, nodes.filter(n => !n.isBypassed), [{ title: 'Main List', nodeIds: cleanedIds }], {}));

      break;
    }

    case 'remove-nth': {
      const n = params.n || 2;
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);

      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      const dummyNode: ListNodeState = { id: 'dummy-node', val: -1, nextId: nodes[0].id, address: '0x00', isDummy: true };
      const allNodes = [dummyNode, ...nodes];
      const trackNodeIds = [dummyNode.id, ...initialNodeIds];

      addLog(`Started Remove N-th Node from End (n = ${n}).`);
      steps.push(createStep(0, `Remove the ${n}-th node from the end of the list.`, 1, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { head: nodes[0].id }));

      addLog('Create dummy sentinel pointing to head.');
      steps.push(createStep(1, 'Instantiate dummy sentinel node pointing to head.', 2, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, head: nodes[0].id }));

      let fastId = dummyNode.id;
      let slowId = dummyNode.id;

      addLog('Initialize fast and slow pointers to dummy.');
      steps.push(createStep(2, 'Set fast and slow pointers to dummy.', 3, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, fast: fastId, slow: slowId }));

      // Move fast n + 1 steps
      for (let i = 0; i <= n; ++i) {
        const fastNode = allNodes.find(n => n.id === fastId);
        if (fastNode) {
          fastId = fastNode.nextId!;
          addLog(`Advance fast pointer to create gap (step ${i + 1} / ${n + 1}).`);
          steps.push(createStep(4, `Advance fast pointer to establish a spacing gap of size ${n}.`, 5, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, fast: fastId, slow: slowId }));
        }
      }

      // Move fast and slow in lockstep
      while (fastId !== null) {
        addLog('Advancing fast and slow pointers together in lockstep.');
        steps.push(createStep(5, 'Loop check: fast pointer is not null.', 6, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, fast: fastId, slow: slowId }));

        const fastNode = allNodes.find(n => n.id === fastId)!;
        fastId = fastNode.nextId!;
        const slowNode = allNodes.find(n => n.id === slowId)!;
        slowId = slowNode.nextId!;

        steps.push(createStep(7, 'Advance both fast and slow pointers one step forward.', 8, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, fast: fastId, slow: slowId }));
      }

      addLog('fast pointer reached NULL. slow pointer points to node preceding target.');
      steps.push(createStep(8, 'Loop terminated because fast is null. slow now points to predecessor of target.', 9, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, slow: slowId }));

      const slowNodeObj = allNodes.find(n => n.id === slowId)!;
      const targetId = slowNodeObj.nextId!;
      const targetNodeObj = allNodes.find(n => n.id === targetId)!;

      addLog(`Label target = slow->next (val: ${targetNodeObj.val}).`);
      steps.push(createStep(9, `Label the target node to delete as slow->next (val: ${targetNodeObj.val}).`, 10, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, slow: slowId, temp: targetId }));

      // Bypass
      const broken = { fromNodeId: slowId, toNodeId: targetId, isRewiredBackward: false };
      const slowIndex = allNodes.findIndex(n => n.id === slowId);
      allNodes[slowIndex].nextId = targetNodeObj.nextId;

      const targetIndex = allNodes.findIndex(n => n.id === targetId);
      allNodes[targetIndex].isBypassed = true;

      addLog(`Bypassed target node (val: ${targetNodeObj.val}).`);
      steps.push(createStep(10, `Rewire slow->next past target directly to target->next.`, 11, allNodes, [{ title: 'Main List', nodeIds: trackNodeIds }], { dummy: dummyNode.id, slow: slowId, temp: targetId }, [broken]));

      addLog('Deallocated target node memory.');
      const finalCleanedIds = allNodes.filter(n => !n.isBypassed).map(n => n.id);
      steps.push(createStep(11, 'Free target node memory.', 12, allNodes.filter(n => !n.isBypassed), [{ title: 'Main List', nodeIds: finalCleanedIds }], { dummy: dummyNode.id }));

      addLog('Returned dummy.next.');
      steps.push(createStep(12, 'Function complete! Return dummy.next.', 13, allNodes.filter(n => !n.isBypassed), [{ title: 'Main List', nodeIds: finalCleanedIds.filter(id => id !== dummyNode.id) }], { head: dummyNode.nextId }));

      break;
    }

    case 'flatten-multilevel': {
      // Simulate Flattening a Multilevel Doubly Linked List
      const mainNodes = parseList('1 -> 2 -> 3 -> 4', 0, 1);
      const childNodes = parseList('7 -> 8 -> 9', 1, 7);

      // Create doubly links
      mainNodes[0].originalTrack = 0;
      mainNodes[1].originalTrack = 0;
      mainNodes[2].originalTrack = 0;
      mainNodes[3].originalTrack = 0;

      childNodes[0].originalTrack = 1;
      childNodes[1].originalTrack = 1;
      childNodes[2].originalTrack = 1;

      // Setup child link on node 3 (id: node-2-0)
      const allNodes = [...mainNodes, ...childNodes];
      const targetNodeIndex = allNodes.findIndex(n => n.id === 'node-2-0');
      allNodes[targetNodeIndex].childId = 'node-0-1'; // Node 3 points to child node 7

      const mainIds = mainNodes.map(n => n.id);
      const childIds = childNodes.map(n => n.id);

      addLog('Started Flatten Multilevel Doubly List process.');
      steps.push(createStep(0, 'Initialize flattening of multilevel doubly linked list.', 1, allNodes, [
        { title: 'Main Line Track', nodeIds: mainIds, childTrackNodeIds: childIds },
      ], { head: mainNodes[0].id }));

      let currId: string | null = mainNodes[0].id;
      addLog('Initialize curr pointer to head.');
      steps.push(createStep(1, 'Set curr pointer to start of main list.', 2, allNodes, [
        { title: 'Main Line Track', nodeIds: mainIds, childTrackNodeIds: childIds },
      ], { head: mainNodes[0].id, curr: currId }));

      // Skip 1 and 2
      currId = 'node-1-0';
      addLog('Advance curr pointer to Node 2.');
      steps.push(createStep(2, 'Advance curr pointer (no child nodes detected).', 15, allNodes, [
        { title: 'Main Line Track', nodeIds: mainIds, childTrackNodeIds: childIds },
      ], { curr: currId }));

      currId = 'node-2-0'; // Node 3
      addLog('Advance curr pointer to Node 3. Child pointer detected!');
      steps.push(createStep(3, 'Advance curr pointer. Node 3 contains a child branch pointer.', 3, allNodes, [
        { title: 'Main Line Track', nodeIds: mainIds, childTrackNodeIds: childIds },
      ], { curr: currId, childHead: 'node-0-1' }));

      // Cache nextNode
      const nextNodeId = 'node-3-0'; // Node 4
      addLog('Cached nextNode = curr->next (Node 4).');
      steps.push(createStep(4, 'Cache nextNode = curr->next (Node 4) to stitch back after flattening child chain.', 5, allNodes, [
        { title: 'Main Line Track', nodeIds: mainIds, childTrackNodeIds: childIds },
      ], { curr: currId, next: nextNodeId, childHead: 'node-0-1' }));

      // Splice child start
      addLog('Stitching Node 3 -> Node 7.');
      const n3Idx = allNodes.findIndex(n => n.id === 'node-2-0');
      allNodes[n3Idx].nextId = 'node-0-1'; // node 3 points to 7
      allNodes[n3Idx].childId = null; // clear child relation

      const broken = { fromNodeId: 'node-2-0', toNodeId: nextNodeId, isRewiredBackward: false };
      const rewire = { fromNodeId: 'node-2-0', toNodeId: 'node-0-1', isRewiredBackward: false };

      steps.push(createStep(6, 'Splice child list head: link curr->next directly to childHead (Node 7).', 7, allNodes, [
        { title: 'Flattening... Track', nodeIds: ['node-0-0', 'node-1-0', 'node-2-0', 'node-0-1', 'node-1-1', 'node-2-1'], childTrackNodeIds: [] },
      ], { curr: currId, next: nextNodeId, temp: 'node-0-1' }, [broken, rewire]));

      // Clear child pointer is already simulated
      addLog('Cleared child pointer from Node 3.');
      steps.push(createStep(8, 'Disconnect the child relationship pointer, converting the link to in-line next.', 9, allNodes, [
        { title: 'Flattening... Track', nodeIds: ['node-0-0', 'node-1-0', 'node-2-0', 'node-0-1', 'node-1-1', 'node-2-1'] },
      ], { curr: currId, next: nextNodeId }));

      // Traverse child list to find tail
      let tailCursorId = 'node-0-1'; // Node 7
      addLog('Traversing child list to find tail (Node 9)...');
      steps.push(createStep(10, 'Find the tail of child list to connect it to the cached nextNode.', 11, allNodes, [
        { title: 'Flattening... Track', nodeIds: ['node-0-0', 'node-1-0', 'node-2-0', 'node-0-1', 'node-1-1', 'node-2-1'] },
      ], { curr: currId, next: nextNodeId, tail: tailCursorId }));

      tailCursorId = 'node-2-1'; // Node 9
      addLog('Found child tail (Node 9). Connecting Node 9 -> Node 4.');
      const n9Idx = allNodes.findIndex(n => n.id === 'node-2-1');
      allNodes[n9Idx].nextId = nextNodeId; // node 9 points to 4

      const reconnectLink = { fromNodeId: 'node-2-1', toNodeId: nextNodeId, isRewiredBackward: false };
      const compositeIds = ['node-0-0', 'node-1-0', 'node-2-0', 'node-0-1', 'node-1-1', 'node-2-1', 'node-3-0'];

      steps.push(createStep(11, 'Stitch child tail->next to cached nextNode (Node 4).', 12, allNodes, [
        { title: 'Flattened Track', nodeIds: compositeIds },
      ], { curr: currId, next: nextNodeId, tail: tailCursorId }, [reconnectLink]));

      addLog('Returned head.');
      steps.push(createStep(16, 'Flattening complete! Return head node.', 17, allNodes, [
        { title: 'Final List', nodeIds: compositeIds },
      ], { head: mainNodes[0].id }));

      break;
    }

    case 'reorder-list': {
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0) {
        addLog('Empty input list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      addLog('Started Reorder List process.');
      steps.push(createStep(0, 'Initialize reordering list L0 → Ln → L1 → Ln-1 → ...', 1, nodes, [
        { title: 'Main Line', nodeIds: initialNodeIds }
      ], { head: nodes[0].id }));

      // 1. Find middle node using slow/fast
      let slowId = nodes[0].id;
      let fastId = nodes[0].id;
      addLog('Initialize slow and fast pointers to head.');
      steps.push(createStep(2, 'Initialize slow & fast pointers at head to locate the list middle.', 4, nodes, [
        { title: 'Main Line', nodeIds: initialNodeIds }
      ], { head: nodes[0].id, slow: slowId, fast: fastId }));

      // Simulate middle search
      while (fastId) {
        const fNode = nodes.find(n => n.id === fastId);
        if (!fNode || !fNode.nextId) break;
        
        slowId = nodes.find(n => n.id === slowId)!.nextId!;
        fastId = nodes.find(n => n.id === fNode.nextId)!.nextId!;

        addLog(`Advance slow to ${nodes.find(n => n.id === slowId)?.val}, fast to ${fastId ? nodes.find(n => n.id === fastId)?.val : 'nullptr'}.`);
        steps.push(createStep(4, 'Advance slow by 1 node and fast by 2 nodes.', 5, nodes, [
          { title: 'Main Line', nodeIds: initialNodeIds }
        ], { head: nodes[0].id, slow: slowId, fast: fastId }));
      }

      addLog(`Middle search completed. slow is at middle (val: ${nodes.find(n => n.id === slowId)?.val}).`);
      steps.push(createStep(7, `Middle found. slow points to node ${nodes.find(n => n.id === slowId)?.val}.`, 8, nodes, [
        { title: 'Main Line', nodeIds: initialNodeIds }
      ], { head: nodes[0].id, slow: slowId }));

      // 2. Reverse second half starting at slow
      addLog('Begin reversing the second half of the list.');
      let prevId: string | null = null;
      let currId: string | null = slowId;

      while (currId !== null) {
        const currNodeIndex = nodes.findIndex(n => n.id === currId);
        const currNode = nodes[currNodeIndex];
        const nextId: string | null = currNode.nextId;

        // 1. Cache next
        steps.push(createStep(11, `Cache nextNode = curr->next (${nextId ? 'val: ' + nodes.find(n => n.id === nextId)?.val : 'nullptr'}) to prevent list detachment.`, 12, nodes, [
          { title: 'Main Line', nodeIds: initialNodeIds }
        ], { head: nodes[0].id, prev: prevId, curr: currId, next: nextId, slow: slowId }));

        // 2. Rewire next pointer
        const brokenLink: BrokenLinkState = { fromNodeId: currId, toNodeId: nextId, isRewiredBackward: false };
        const rewireLink: BrokenLinkState = { fromNodeId: currId, toNodeId: prevId, isRewiredBackward: true };
        nodes[currNodeIndex].nextId = prevId; // mutate next in-place

        addLog(`Second half reversal: rewired node ${currNode.val} -> ${prevId ? nodes.find(n => n.id === prevId)?.val : 'nullptr'}.`);
        steps.push(createStep(12, `Rewire curr->next to point back to prev.`, 13, nodes, [
          { title: 'Main Line', nodeIds: initialNodeIds }
        ], { head: nodes[0].id, prev: prevId, curr: currId, next: nextId, slow: slowId }, [brokenLink, rewireLink]));

        // 3. Shift prev & curr
        prevId = currId;
        currId = nextId;

        steps.push(createStep(13, `Shift prev & curr forward.`, 14, nodes, [
          { title: 'Main Line', nodeIds: initialNodeIds }
        ], { head: nodes[0].id, prev: prevId, curr: currId, slow: slowId }));
      }

      addLog('Finished reversing second half.');
      steps.push(createStep(15, 'Second half reversed in-place.', 16, nodes, [
        { title: 'First Half', nodeIds: nodes.filter(n => n.originalTrack === 0 && !initialNodeIds.slice(initialNodeIds.indexOf(slowId)).includes(n.id)).map(n => n.id) },
        { title: 'Reversed Second Half', nodeIds: [prevId!] } // simplify display
      ], { head: nodes[0].id, prev: prevId }));

      // 3. Interleave
      addLog('Start interleaving the two halves.');
      let firstId: string | null = nodes[0].id;
      let secondId: string | null = prevId;

      // Simplify steps for alternate merging
      const mergedTrackNodes: string[] = [];
      let lastId: string | null = null;

      while (firstId && secondId) {
        if (lastId) {
          const lIdx = nodes.findIndex(n => n.id === lastId);
          nodes[lIdx].nextId = secondId;
        }
        mergedTrackNodes.push(firstId);
        
        const fNode = nodes.find(n => n.id === firstId)!;
        const tmp1 = fNode.nextId;
        
        fNode.nextId = secondId;
        mergedTrackNodes.push(secondId);

        const sNode = nodes.find(n => n.id === secondId)!;
        const tmp2 = sNode.nextId;

        addLog(`Interleave: link node ${fNode.val} -> node ${sNode.val}.`);
        steps.push(createStep(18, `Link ${fNode.val} to ${sNode.val}.`, 22, nodes, [
          { title: 'Interleaving...', nodeIds: [...mergedTrackNodes] }
        ], { head: nodes[0].id, p1: firstId, p2: secondId }));

        if (tmp1) {
          sNode.nextId = tmp1;
          addLog(`Interleave: link node ${sNode.val} -> node ${nodes.find(n => n.id === tmp1)?.val}.`);
          steps.push(createStep(21, `Link ${sNode.val} to ${nodes.find(n => n.id === tmp1)?.val}.`, 23, nodes, [
            { title: 'Interleaving...', nodeIds: [...mergedTrackNodes, tmp1] }
          ], { head: nodes[0].id, p1: firstId, p2: secondId }));
        }

        lastId = secondId;
        firstId = tmp1;
        secondId = tmp2;
      }

      addLog('Reorder completed.');
      steps.push(createStep(25, 'Reordering complete!', 27, nodes, [
        { title: 'Reordered Output List', nodeIds: nodes.map(n => n.id) }
      ], { head: nodes[0].id }));

      break;
    }

    case 'palindrome-list': {
      const nodes = parseList(list1Input, 0, 1);
      const initialNodeIds = nodes.map(n => n.id);
      if (nodes.length === 0) {
        addLog('Empty list.');
        steps.push(createStep(0, 'Empty list.', 1, [], [], {}));
        return steps;
      }

      addLog('Started Palindrome check.');
      steps.push(createStep(0, 'Initialize Palindrome verification checking.', 1, nodes, [
        { title: 'Input List', nodeIds: initialNodeIds }
      ], { head: nodes[0].id }));

      // Find middle
      let slowId = nodes[0].id;
      let fastId = nodes[0].id;
      while (fastId) {
        const fNode = nodes.find(n => n.id === fastId);
        if (!fNode || !fNode.nextId) break;
        slowId = nodes.find(n => n.id === slowId)!.nextId!;
        fastId = nodes.find(n => n.id === fNode.nextId)!.nextId!;
      }

      addLog(`Middle located at node ${nodes.find(n => n.id === slowId)?.val}.`);
      steps.push(createStep(6, `Middle located. Begin second-half reversal.`, 7, nodes, [
        { title: 'Input List', nodeIds: initialNodeIds }
      ], { head: nodes[0].id, slow: slowId }));

      // Reverse second half
      let prevId: string | null = null;
      let currId: string | null = slowId;
      while (currId) {
        const currNodeIndex = nodes.findIndex(n => n.id === currId);
        const currNode = nodes[currNodeIndex];
        const nextId = currNode.nextId;
        nodes[currNodeIndex].nextId = prevId;
        prevId = currId;
        currId = nextId;
      }

      addLog('Reversed second half. Start pairwise match check.');
      steps.push(createStep(14, 'Start step-by-step equivalence testing.', 15, nodes, [
        { title: 'First Half Track', nodeIds: nodes.filter(n => n.id !== prevId).map(n => n.id) },
        { title: 'Reversed Half Track', nodeIds: [prevId!] }
      ], { p1: nodes[0].id, p2: prevId }));

      // Compare
      let p1Id: string | null = nodes[0].id;
      let p2Id: string | null = prevId;
      let isPalin = true;

      while (p2Id) {
        const node1 = nodes.find(n => n.id === p1Id)!;
        const node2 = nodes.find(n => n.id === p2Id)!;

        addLog(`Comparing val1: ${node1.val} vs val2: ${node2.val}.`);
        if (node1.val !== node2.val) {
          isPalin = false;
          steps.push(createStep(16, `Mismatch found: ${node1.val} != ${node2.val}. Return false.`, 17, nodes, [
            { title: 'First Half', nodeIds: [p1Id!] },
            { title: 'Reversed Second Half', nodeIds: [p2Id!] }
          ], { p1: p1Id, p2: p2Id }));
          break;
        } else {
          steps.push(createStep(16, `Values match: ${node1.val} == ${node2.val}. Advance pointers.`, 17, nodes, [
            { title: 'First Half', nodeIds: [p1Id!] },
            { title: 'Reversed Second Half', nodeIds: [p2Id!] }
          ], { p1: p1Id, p2: p2Id }));
        }

        p1Id = node1.nextId;
        p2Id = node2.nextId;
      }

      if (isPalin) {
        addLog('Comparison complete. Entire list is a valid palindrome.');
        steps.push(createStep(20, 'All characters match successfully! Return true.', 21, nodes, [
          { title: 'Success Palindrome', nodeIds: initialNodeIds }
        ], {}));
      }

      break;
    }

    case 'intersection-list': {
      const l1 = parseList(list1Input, 0, 1);
      const l2 = parseList(list2Input, 1, 10);
      
      // Let's create an intersection node '9' at address '0x99'
      const intersectNode: ListNodeState = { id: 'node-intersect', val: 9, nextId: null, address: '0x99' };
      const allNodes = [...l1, ...l2, intersectNode];
      
      // Connect both tails to intersection
      if (l1.length > 0) allNodes[allNodes.findIndex(n => n.id === l1[l1.length - 1].id)].nextId = 'node-intersect';
      if (l2.length > 0) allNodes[allNodes.findIndex(n => n.id === l2[l2.length - 1].id)].nextId = 'node-intersect';

      const track1Ids = [...l1.map(n => n.id), 'node-intersect'];
      const track2Ids = [...l2.map(n => n.id), 'node-intersect'];

      addLog('Started Intersection of Two Lists search.');
      steps.push(createStep(0, 'Initialize search for intersecting node.', 1, allNodes, [
        { title: 'List A', nodeIds: track1Ids },
        { title: 'List B', nodeIds: track2Ids }
      ], { p1: l1[0]?.id || 'node-intersect', p2: l2[0]?.id || 'node-intersect' }));

      // Simple lockstep simulation
      let pAId: string | null = l1[0]?.id;
      let pBId: string | null = l2[0]?.id;

      for (let cycle = 1; cycle <= 5; ++cycle) {
        if (pAId === 'node-intersect' && pBId === 'node-intersect') {
          break;
        }

        const nodeA: ListNodeState | null = pAId ? (allNodes.find(n => n.id === pAId) || null) : null;
        const nodeB: ListNodeState | null = pBId ? (allNodes.find(n => n.id === pBId) || null) : null;

        addLog(`Pointers state: pA is at ${nodeA ? nodeA.val : 'nullptr'}, pB is at ${nodeB ? nodeB.val : 'nullptr'}.`);
        steps.push(createStep(3, `Cycle ${cycle}: compare pointers address.`, 4, allNodes, [
          { title: 'List A (pA traversing)', nodeIds: track1Ids },
          { title: 'List B (pB traversing)', nodeIds: track2Ids }
        ], { p1: pAId, p2: pBId }));

        pAId = nodeA ? nodeA.nextId : l2[0]?.id || 'node-intersect';
        pBId = nodeB ? nodeB.nextId : l1[0]?.id || 'node-intersect';
      }

      // Final match step at intersection node
      addLog('Both pointers match addresses at intersection node (Address: 0x99, Value: 9).');
      steps.push(createStep(6, 'Pointers met at intersection address! Return Node 9.', 8, allNodes, [
        { title: 'Intersection Point Met', nodeIds: ['node-intersect'] }
      ], { p1: 'node-intersect', p2: 'node-intersect' }));

      break;
    }
  }

  return steps;
}

