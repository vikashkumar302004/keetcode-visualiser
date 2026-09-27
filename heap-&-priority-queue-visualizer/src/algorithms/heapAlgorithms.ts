import { SimulationStep, HeapType, NodeState, DualHeapState } from '../types';

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 1. Insert & Percolate Up / Sift-Up
export function simulateInsert(initialHeap: number[], insertVal: number, heapType: HeapType = 'max'): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const heap = [...initialHeap];
  let stepCount = 0;

  // Initial step
  steps.push({
    stepNumber: ++stepCount,
    description: `Ready to insert value ${insertVal} into the ${heapType.toUpperCase()}-Heap.`,
    cppLineNumber: 1,
    heap: [...heap],
    heapType,
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: heap.map((_, i) => i),
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: -1,
        parentIndex: -1,
        leftIndex: -1,
        rightIndex: -1,
        candidateIndex: -1,
        formula: 'Heap size = ' + heap.length
      }
    },
    callStack: [`push(${insertVal})`],
    logEntry: `Starting push(${insertVal})`
  });

  // Step: Append to end of complete binary tree
  heap.push(insertVal);
  let i = heap.length - 1;

  steps.push({
    stepNumber: ++stepCount,
    description: `Appended ${insertVal} at index ${i} (next leaf position in complete binary tree).`,
    cppLineNumber: 2,
    heap: [...heap],
    heapType,
    nodeStates: { [i]: 'active' },
    comparingIndices: [i],
    swappingIndices: [],
    satisfiedIndices: heap.slice(0, i).map((_, idx) => idx),
    arrayHighlight: { indices: [i], type: 'active', label: `Appended ${insertVal}` },
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: i,
        parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
        leftIndex: 2 * i + 1,
        rightIndex: 2 * i + 2,
        candidateIndex: i,
        formula: `i = ${i}, parent = floor((${i}-1)/2) = ${i > 0 ? Math.floor((i - 1) / 2) : 'none'}`
      }
    },
    callStack: [`push(${insertVal})`, `siftUp(index: ${i})`],
    logEntry: `Appended ${insertVal} at index ${i}`
  });

  // Sift up loop
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    const parentVal = heap[parent];
    const currVal = heap[i];

    // Comparing with parent
    steps.push({
      stepNumber: ++stepCount,
      description: `Comparing child node [${i}]=${currVal} with parent node [${parent}]=${parentVal}.`,
      cppLineNumber: 7,
      heap: [...heap],
      heapType,
      nodeStates: { [i]: 'comparing', [parent]: 'comparing' },
      comparingIndices: [i, parent],
      swappingIndices: [],
      satisfiedIndices: [],
      arrayHighlight: { indices: [i, parent], type: 'compare', label: `Compare [${i}] with parent [${parent}]` },
      inspectorState: {
        type: 'heapify',
        heapify: {
          currentIndex: i,
          parentIndex: parent,
          leftIndex: 2 * i + 1,
          rightIndex: 2 * i + 2,
          candidateIndex: i,
          formula: heapType === 'max' ? `${currVal} > ${parentVal} ?` : `${currVal} < ${parentVal} ?`
        }
      },
      callStack: [`push(${insertVal})`, `siftUp(i: ${i}, parent: ${parent})`],
      logEntry: `Check: ${currVal} vs parent ${parentVal}`
    });

    const isViolation = heapType === 'max' ? currVal > parentVal : currVal < parentVal;

    if (isViolation) {
      // Swapping
      steps.push({
        stepNumber: ++stepCount,
        description: `Invariant violated (${currVal} ${heapType === 'max' ? '>' : '<'} parent ${parentVal}). Swapping node [${i}] with parent [${parent}].`,
        cppLineNumber: 9,
        heap: [...heap],
        heapType,
        nodeStates: { [i]: 'swapping', [parent]: 'swapping' },
        comparingIndices: [],
        swappingIndices: [i, parent],
        satisfiedIndices: [],
        arrayHighlight: { indices: [i, parent], type: 'swap', label: `Swap [${i}] ↔ [${parent}]` },
        inspectorState: {
          type: 'heapify',
          heapify: {
            currentIndex: i,
            parentIndex: parent,
            leftIndex: 2 * i + 1,
            rightIndex: 2 * i + 2,
            candidateIndex: i,
            formula: `SWAP: heap[${i}] ↔ heap[${parent}]`
          }
        },
        callStack: [`push(${insertVal})`, `swap(${i}, ${parent})`],
        logEntry: `Swapped indices ${i} and ${parent}`
      });

      // Perform swap
      const temp = heap[i];
      heap[i] = heap[parent];
      heap[parent] = temp;
      i = parent;

      steps.push({
        stepNumber: ++stepCount,
        description: `Swap complete. Node is now at index ${i}. Checking new parent next.`,
        cppLineNumber: 10,
        heap: [...heap],
        heapType,
        nodeStates: { [i]: 'active' },
        comparingIndices: [i],
        swappingIndices: [],
        satisfiedIndices: [],
        arrayHighlight: { indices: [i], type: 'active', label: `Current position: ${i}` },
        inspectorState: {
          type: 'heapify',
          heapify: {
            currentIndex: i,
            parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
            leftIndex: 2 * i + 1,
            rightIndex: 2 * i + 2,
            candidateIndex: i,
            formula: `New i = ${i}`
          }
        },
        callStack: [`push(${insertVal})`, `siftUp(i: ${i})`],
        logEntry: `Node moved to index ${i}`
      });
    } else {
      steps.push({
        stepNumber: ++stepCount,
        description: `Heap property satisfied: child [${i}]=${currVal} ${heapType === 'max' ? '<=' : '>='} parent [${parent}]=${parentVal}. Sift-up terminates.`,
        cppLineNumber: 12,
        heap: [...heap],
        heapType,
        nodeStates: { [i]: 'satisfied', [parent]: 'satisfied' },
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: heap.map((_, idx) => idx),
        arrayHighlight: { indices: [i, parent], type: 'sorted', label: 'Heap property holds' },
        inspectorState: {
          type: 'heapify',
          heapify: {
            currentIndex: i,
            parentIndex: parent,
            leftIndex: 2 * i + 1,
            rightIndex: 2 * i + 2,
            candidateIndex: i,
            formula: 'Break: heap order satisfied'
          }
        },
        callStack: [`push(${insertVal})`, 'Terminated'],
        logEntry: `Sift-up finished at index ${i}`
      });
      break;
    }
  }

  // Final step
  steps.push({
    stepNumber: ++stepCount,
    description: `Insertion of ${insertVal} complete. Valid ${heapType.toUpperCase()}-Heap with ${heap.length} elements.`,
    cppLineNumber: 14,
    heap: [...heap],
    heapType,
    nodeStates: Object.fromEntries(heap.map((_, idx) => [idx, 'satisfied' as NodeState])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: heap.map((_, idx) => idx),
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: 'Heap Valid'
      }
    },
    callStack: ['Ready'],
    logEntry: `Finished push(${insertVal}) successfully`
  });

  return steps;
}

// 2. Extract Min/Max & Percolate Down / Sift-Down
export function simulateExtract(initialHeap: number[], heapType: HeapType = 'max'): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const heap = [...initialHeap];
  let stepCount = 0;

  if (heap.length === 0) return steps;

  const rootVal = heap[0];

  // Initial step
  steps.push({
    stepNumber: ++stepCount,
    description: `Ready to extract ${heapType === 'max' ? 'maximum' : 'minimum'} root element [0] = ${rootVal}.`,
    cppLineNumber: 1,
    heap: [...heap],
    heapType,
    nodeStates: { 0: 'comparing' },
    comparingIndices: [0],
    swappingIndices: [],
    satisfiedIndices: [],
    arrayHighlight: { indices: [0], type: 'active', label: `Root to extract: ${rootVal}` },
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: `root = heap[0] = ${rootVal}`
      }
    },
    callStack: [`pop()`],
    logEntry: `Extract root ${rootVal}`
  });

  if (heap.length === 1) {
    heap.pop();
    steps.push({
      stepNumber: ++stepCount,
      description: `Popped the only element ${rootVal}. Heap is now empty.`,
      cppLineNumber: 5,
      heap: [],
      heapType,
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: [],
      inspectorState: {
        type: 'heapify',
        heapify: {
          currentIndex: -1,
          parentIndex: -1,
          leftIndex: -1,
          rightIndex: -1,
          candidateIndex: -1,
          formula: 'Heap is empty'
        }
      },
      callStack: ['pop() finished'],
      logEntry: `Popped ${rootVal}`
    });
    return steps;
  }

  const lastVal = heap[heap.length - 1];
  const lastIdx = heap.length - 1;

  // Step: Move last element to root
  steps.push({
    stepNumber: ++stepCount,
    description: `Overwriting root [0]=${rootVal} with last leaf element [${lastIdx}]=${lastVal}, then popping last slot.`,
    cppLineNumber: 4,
    heap: [...heap],
    heapType,
    nodeStates: { 0: 'violation', [lastIdx]: 'swapping' },
    comparingIndices: [],
    swappingIndices: [0, lastIdx],
    satisfiedIndices: [],
    arrayHighlight: { indices: [0, lastIdx], type: 'swap', label: `Move [${lastIdx}] to [0]` },
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: `heap[0] = heap.back() (${lastVal})`
      }
    },
    callStack: [`pop()`, `heap[0] = ${lastVal}`],
    logEntry: `Replaced root with ${lastVal}`
  });

  heap[0] = heap.pop()!;

  steps.push({
    stepNumber: ++stepCount,
    description: `Last leaf removed. Root is now ${heap[0]}. Calling heapifyDown(0) to restore invariant.`,
    cppLineNumber: 7,
    heap: [...heap],
    heapType,
    nodeStates: { 0: 'active' },
    comparingIndices: [0],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: 'heapifyDown(0)'
      }
    },
    callStack: [`pop()`, `heapifyDown(0)`],
    logEntry: `Initiating sift-down at index 0`
  });

  // Heapify down loop
  let i = 0;
  const n = heap.length;

  while (i < n) {
    let candidate = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    const checkingIndices = [i];
    if (left < n) checkingIndices.push(left);
    if (right < n) checkingIndices.push(right);

    steps.push({
      stepNumber: ++stepCount,
      description: `At index ${i} (${heap[i]}): inspecting left child ${left < n ? `[${left}]=${heap[left]}` : 'none'} and right child ${right < n ? `[${right}]=${heap[right]}` : 'none'}.`,
      cppLineNumber: 13,
      heap: [...heap],
      heapType,
      nodeStates: Object.fromEntries(checkingIndices.map(idx => [idx, 'comparing'])),
      comparingIndices: checkingIndices,
      swappingIndices: [],
      satisfiedIndices: [],
      arrayHighlight: { indices: checkingIndices, type: 'compare', label: `Inspect node ${i} and children` },
      inspectorState: {
        type: 'heapify',
        heapify: {
          currentIndex: i,
          parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
          leftIndex: left < n ? left : -1,
          rightIndex: right < n ? right : -1,
          candidateIndex: candidate,
          formula: `left: ${left < n ? heap[left] : 'N/A'}, right: ${right < n ? heap[right] : 'N/A'}`
        }
      },
      callStack: [`pop()`, `heapifyDown(${i})`],
      logEntry: `Checking children of ${i}`
    });

    if (heapType === 'max') {
      if (left < n && heap[left] > heap[candidate]) candidate = left;
      if (right < n && heap[right] > heap[candidate]) candidate = right;
    } else {
      if (left < n && heap[left] < heap[candidate]) candidate = left;
      if (right < n && heap[right] < heap[candidate]) candidate = right;
    }

    if (candidate !== i) {
      steps.push({
        stepNumber: ++stepCount,
        description: `Candidate for swap is ${heapType === 'max' ? 'larger' : 'smaller'} child [${candidate}]=${heap[candidate]}. Swapping with parent [${i}]=${heap[i]}.`,
        cppLineNumber: 20,
        heap: [...heap],
        heapType,
        nodeStates: { [i]: 'swapping', [candidate]: 'swapping' },
        comparingIndices: [],
        swappingIndices: [i, candidate],
        satisfiedIndices: [],
        arrayHighlight: { indices: [i, candidate], type: 'swap', label: `Swap [${i}] ↔ [${candidate}]` },
        inspectorState: {
          type: 'heapify',
          heapify: {
            currentIndex: i,
            parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
            leftIndex: left < n ? left : -1,
            rightIndex: right < n ? right : -1,
            candidateIndex: candidate,
            formula: `swap(heap[${i}], heap[${candidate}])`
          }
        },
        callStack: [`pop()`, `heapifyDown(${i})`, `swap(${i}, ${candidate})`],
        logEntry: `Swapping ${i} with ${candidate}`
      });

      const tmp = heap[i];
      heap[i] = heap[candidate];
      heap[candidate] = tmp;
      i = candidate;
    } else {
      steps.push({
        stepNumber: ++stepCount,
        description: `Node [${i}]=${heap[i]} is properly positioned relative to both children. Sift-down complete!`,
        cppLineNumber: 22,
        heap: [...heap],
        heapType,
        nodeStates: Object.fromEntries(heap.map((_, idx) => [idx, 'satisfied'])),
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: heap.map((_, idx) => idx),
        arrayHighlight: { indices: [i], type: 'sorted', label: 'Satisfied' },
        inspectorState: {
          type: 'heapify',
          heapify: {
            currentIndex: i,
            parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
            leftIndex: left < n ? left : -1,
            rightIndex: right < n ? right : -1,
            candidateIndex: i,
            formula: 'candidate == i -> break'
          }
        },
        callStack: [`pop()`, 'Done'],
        logEntry: `Sift-down terminated at ${i}`
      });
      break;
    }
  }

  // Final step
  steps.push({
    stepNumber: ++stepCount,
    description: `Extract completed! Extracted root value was ${rootVal}. Heap restored in O(log N).`,
    cppLineNumber: 7,
    heap: [...heap],
    heapType,
    nodeStates: Object.fromEntries(heap.map((_, idx) => [idx, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: heap.map((_, idx) => idx),
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: `Returned: ${rootVal}`
      }
    },
    callStack: ['Complete'],
    logEntry: `Extracted ${rootVal} successfully`
  });

  return steps;
}

// 3. Build Heap from Unsorted Array (Floyd's Algorithm - O(N))
export function simulateBuildHeap(rawArr: number[], heapType: HeapType = 'max'): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const arr = [...rawArr];
  const n = arr.length;
  let stepCount = 0;

  const lastNonLeaf = Math.floor(n / 2) - 1;

  steps.push({
    stepNumber: ++stepCount,
    description: `Starting Floyd's Bottom-Up Build Heap on ${n} elements. Last non-leaf index is floor(${n}/2) - 1 = ${lastNonLeaf}.`,
    cppLineNumber: 2,
    heap: [...arr],
    heapType,
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: Array.from({ length: n - (lastNonLeaf + 1) }, (_, k) => lastNonLeaf + 1 + k),
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: lastNonLeaf,
        parentIndex: -1,
        leftIndex: 2 * lastNonLeaf + 1,
        rightIndex: 2 * lastNonLeaf + 2,
        candidateIndex: lastNonLeaf,
        formula: `lastNonLeaf = (${n}/2) - 1 = ${lastNonLeaf}`
      }
    },
    callStack: ['buildHeap()'],
    logEntry: `Floyd build heap initialized`
  });

  for (let startIdx = lastNonLeaf; startIdx >= 0; --startIdx) {
    steps.push({
      stepNumber: ++stepCount,
      description: `Targeting subtree at non-leaf index ${startIdx} (value: ${arr[startIdx]}). Initiating heapifyDown(${startIdx}).`,
      cppLineNumber: 6,
      heap: [...arr],
      heapType,
      nodeStates: { [startIdx]: 'active' },
      comparingIndices: [startIdx],
      swappingIndices: [],
      satisfiedIndices: [],
      arrayHighlight: { indices: [startIdx], type: 'active', label: `Heapify subtree at ${startIdx}` },
      inspectorState: {
        type: 'heapify',
        heapify: {
          currentIndex: startIdx,
          parentIndex: startIdx > 0 ? Math.floor((startIdx - 1) / 2) : -1,
          leftIndex: 2 * startIdx + 1,
          rightIndex: 2 * startIdx + 2,
          candidateIndex: startIdx,
          formula: `heapifyDown(arr, ${n}, ${startIdx})`
        }
      },
      callStack: ['buildHeap()', `heapifyDown(${startIdx})`],
      logEntry: `Subtree at index ${startIdx}`
    });

    let i = startIdx;
    while (i < n) {
      let candidate = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      const checking = [i];
      if (left < n) checking.push(left);
      if (right < n) checking.push(right);

      steps.push({
        stepNumber: ++stepCount,
        description: `Comparing parent [${i}]=${arr[i]} with left [${left < n ? left : '-'}] and right [${right < n ? right : '-'}].`,
        cppLineNumber: 13,
        heap: [...arr],
        heapType,
        nodeStates: Object.fromEntries(checking.map(idx => [idx, 'comparing'])),
        comparingIndices: checking,
        swappingIndices: [],
        satisfiedIndices: [],
        arrayHighlight: { indices: checking, type: 'compare' },
        inspectorState: {
          type: 'heapify',
          heapify: {
            currentIndex: i,
            parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
            leftIndex: left < n ? left : -1,
            rightIndex: right < n ? right : -1,
            candidateIndex: candidate,
            formula: `Check left & right bounds`
          }
        },
        callStack: ['buildHeap()', `heapifyDown(${i})`],
        logEntry: `Evaluating node ${i}`
      });

      if (heapType === 'max') {
        if (left < n && arr[left] > arr[candidate]) candidate = left;
        if (right < n && arr[right] > arr[candidate]) candidate = right;
      } else {
        if (left < n && arr[left] < arr[candidate]) candidate = left;
        if (right < n && arr[right] < arr[candidate]) candidate = right;
      }

      if (candidate !== i) {
        steps.push({
          stepNumber: ++stepCount,
          description: `Child [${candidate}]=${arr[candidate]} violates heap property with parent [${i}]=${arr[i]}. Swapping.`,
          cppLineNumber: 18,
          heap: [...arr],
          heapType,
          nodeStates: { [i]: 'swapping', [candidate]: 'swapping' },
          comparingIndices: [],
          swappingIndices: [i, candidate],
          satisfiedIndices: [],
          arrayHighlight: { indices: [i, candidate], type: 'swap', label: `Swap [${i}] ↔ [${candidate}]` },
          inspectorState: {
            type: 'heapify',
            heapify: {
              currentIndex: i,
              parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
              leftIndex: left < n ? left : -1,
              rightIndex: right < n ? right : -1,
              candidateIndex: candidate,
              formula: `swap(arr[${i}], arr[${candidate}])`
            }
          },
          callStack: ['buildHeap()', `heapifyDown(${i})`, `swap(${i}, ${candidate})`],
          logEntry: `Swapped ${i} with ${candidate}`
        });

        const tmp = arr[i];
        arr[i] = arr[candidate];
        arr[candidate] = tmp;
        i = candidate;
      } else {
        break;
      }
    }
  }

  // Final step
  steps.push({
    stepNumber: ++stepCount,
    description: `Floyd's algorithm completed in O(N) linear time! The array is now a valid ${heapType.toUpperCase()}-Heap.`,
    cppLineNumber: 7,
    heap: [...arr],
    heapType,
    nodeStates: Object.fromEntries(arr.map((_, idx) => [idx, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: arr.map((_, idx) => idx),
    inspectorState: {
      type: 'heapify',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: 'O(N) Build Complete'
      }
    },
    callStack: ['Finished'],
    logEntry: `Build heap complete`
  });

  return steps;
}

// 4. In-Place Heap Sort (O(N log N))
export function simulateHeapSort(rawArr: number[]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const arr = [...rawArr];
  const n = arr.length;
  let stepCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Starting In-Place Heap Sort on array of size ${n}. Phase 1: Build Max-Heap in O(N).`,
    cppLineNumber: 2,
    heap: [...arr],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'heapsort',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: 'Phase 1: Build Max-Heap'
      }
    },
    callStack: ['heapSort()'],
    logEntry: `Phase 1: Build Max-Heap`
  });

  // Build max-heap
  const lastNonLeaf = Math.floor(n / 2) - 1;
  for (let startIdx = lastNonLeaf; startIdx >= 0; --startIdx) {
    let i = startIdx;
    while (i < n) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && arr[left] > arr[largest]) largest = left;
      if (right < n && arr[right] > arr[largest]) largest = right;
      if (largest !== i) {
        const tmp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = tmp;
        i = largest;
      } else {
        break;
      }
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Phase 1 complete: Initial Max-Heap formed. Phase 2: Repeatedly swap max root [0] with current end [i] and sift-down.`,
    cppLineNumber: 7,
    heap: [...arr],
    heapType: 'max',
    nodeStates: Object.fromEntries(arr.map((_, idx) => [idx, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: arr.map((_, idx) => idx),
    inspectorState: {
      type: 'heapsort',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: 1,
        rightIndex: 2,
        candidateIndex: 0,
        formula: 'Max-heap ready; begin extractions'
      }
    },
    callStack: ['heapSort()', 'Phase 2: Extract & Sift-Down'],
    logEntry: `Max-heap formed`
  });

  // Phase 2: extract to tail
  const extractedIndices: number[] = [];
  for (let endIdx = n - 1; endIdx > 0; --endIdx) {
    // Swap root with endIdx
    steps.push({
      stepNumber: ++stepCount,
      description: `Swap maximum element [0]=${arr[0]} to sorted tail position [${endIdx}]. Active heap size becomes ${endIdx}.`,
      cppLineNumber: 9,
      heap: [...arr],
      heapType: 'max',
      nodeStates: { 0: 'swapping', [endIdx]: 'swapping', ...Object.fromEntries(extractedIndices.map(idx => [idx, 'extracted'])) },
      comparingIndices: [],
      swappingIndices: [0, endIdx],
      satisfiedIndices: [],
      extractedIndices: [...extractedIndices],
      arrayHighlight: { indices: [0, endIdx], type: 'swap', label: `Swap root ↔ [${endIdx}]` },
      inspectorState: {
        type: 'heapsort',
        heapify: {
          currentIndex: 0,
          parentIndex: -1,
          leftIndex: 1,
          rightIndex: 2,
          candidateIndex: 0,
          formula: `swap(arr[0], arr[${endIdx}])`
        }
      },
      callStack: ['heapSort()', `swap(0, ${endIdx})`],
      logEntry: `Swapped max ${arr[0]} to tail [${endIdx}]`
    });

    const tmp = arr[0];
    arr[0] = arr[endIdx];
    arr[endIdx] = tmp;
    extractedIndices.push(endIdx);

    // Sift down in remaining [0..endIdx-1]
    let i = 0;
    const currentSize = endIdx;

    while (i < currentSize) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < currentSize && arr[left] > arr[largest]) largest = left;
      if (right < currentSize && arr[right] > arr[largest]) largest = right;

      if (largest !== i) {
        const swapVal = arr[largest];
        steps.push({
          stepNumber: ++stepCount,
          description: `Sifting down in active heap [0..${currentSize - 1}]: Swapping parent [${i}]=${arr[i]} with larger child [${largest}]=${swapVal}.`,
          cppLineNumber: 10,
          heap: [...arr],
          heapType: 'max',
          nodeStates: { [i]: 'swapping', [largest]: 'swapping', ...Object.fromEntries(extractedIndices.map(idx => [idx, 'extracted'])) },
          comparingIndices: [],
          swappingIndices: [i, largest],
          satisfiedIndices: [],
          extractedIndices: [...extractedIndices],
          arrayHighlight: { indices: [i, largest], type: 'swap' },
          inspectorState: {
            type: 'heapsort',
            heapify: {
              currentIndex: i,
              parentIndex: i > 0 ? Math.floor((i - 1) / 2) : -1,
              leftIndex: left < currentSize ? left : -1,
              rightIndex: right < currentSize ? right : -1,
              candidateIndex: largest,
              formula: `heapifyDown(arr, ${currentSize}, ${i})`
            }
          },
          callStack: ['heapSort()', `heapifyDown(size: ${currentSize}, i: ${i})`],
          logEntry: `Sifting down at index ${i}`
        });

        const temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        i = largest;
      } else {
        break;
      }
    }
  }

  extractedIndices.push(0);

  // Final sorted step
  steps.push({
    stepNumber: ++stepCount,
    description: `Heap Sort complete! Array is fully sorted in ascending order in O(N log N) time and O(1) auxiliary space.`,
    cppLineNumber: 12,
    heap: [...arr],
    heapType: 'max',
    nodeStates: Object.fromEntries(arr.map((_, idx) => [idx, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: arr.map((_, idx) => idx),
    extractedIndices: arr.map((_, idx) => idx),
    arrayHighlight: { indices: arr.map((_, idx) => idx), type: 'sorted', label: 'Sorted Array' },
    inspectorState: {
      type: 'heapsort',
      heapify: {
        currentIndex: 0,
        parentIndex: -1,
        leftIndex: -1,
        rightIndex: -1,
        candidateIndex: 0,
        formula: 'Fully Sorted Ascending'
      }
    },
    callStack: ['Complete'],
    logEntry: `Heap sort finished successfully`
  });

  return steps;
}

// 5. Kth Largest Element in an Array (LC #215)
export function simulateKthLargest(nums: number[], k: number): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const minHeap: number[] = [];
  let stepCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Initializing Min-Heap of capacity K=${k} to find the ${k}th largest element among ${nums.length} numbers.`,
    cppLineNumber: 3,
    heap: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        incomingVal: '-',
        currentTop: '-',
        comparisonResult: 'Ready',
        currentHeapCount: 0
      }
    },
    callStack: [`findKthLargest(nums, ${k})`],
    logEntry: `Min-heap initialized (capacity K=${k})`
  });

  for (let idx = 0; idx < nums.length; idx++) {
    const num = nums[idx];

    // Push into min-heap
    minHeap.push(num);
    // Sift up
    let ci = minHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (minHeap[ci] < minHeap[p]) {
        const tmp = minHeap[ci];
        minHeap[ci] = minHeap[p];
        minHeap[p] = tmp;
        ci = p;
      } else {
        break;
      }
    }

    steps.push({
      stepNumber: ++stepCount,
      description: `Pushed incoming element nums[${idx}] = ${num} into Min-Heap. Current size = ${minHeap.length}.`,
      cppLineNumber: 6,
      heap: [...minHeap],
      heapType: 'min',
      nodeStates: { [minHeap.indexOf(num)]: 'active' },
      comparingIndices: [minHeap.indexOf(num)],
      swappingIndices: [],
      satisfiedIndices: [],
      inspectorState: {
        type: 'topk',
        topK: {
          k,
          incomingVal: num,
          currentTop: minHeap[0],
          comparisonResult: minHeap.length > k ? `Size ${minHeap.length} > ${k}: Must pop min root` : `Size ${minHeap.length} <= ${k}: Retain`,
          currentHeapCount: minHeap.length
        }
      },
      callStack: [`findKthLargest()`, `minHeap.push(${num})`],
      logEntry: `Pushed ${num} to heap`
    });

    if (minHeap.length > k) {
      const popped = minHeap[0];
      // Pop root
      const last = minHeap.pop()!;
      if (minHeap.length > 0) {
        minHeap[0] = last;
        // sift down
        let i = 0;
        const n = minHeap.length;
        while (i < n) {
          let smallest = i;
          const left = 2 * i + 1;
          const right = 2 * i + 2;
          if (left < n && minHeap[left] < minHeap[smallest]) smallest = left;
          if (right < n && minHeap[right] < minHeap[smallest]) smallest = right;
          if (smallest !== i) {
            const tmp = minHeap[i];
            minHeap[i] = minHeap[smallest];
            minHeap[smallest] = tmp;
            i = smallest;
          } else {
            break;
          }
        }
      }

      steps.push({
        stepNumber: ++stepCount,
        description: `Heap capacity exceeded (${minHeap.length + 1} > ${k}). Evicted smallest element ${popped}. Min-Heap root is now ${minHeap[0]}.`,
        cppLineNumber: 8,
        heap: [...minHeap],
        heapType: 'min',
        nodeStates: { 0: 'satisfied' },
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: minHeap.map((_, i) => i),
        inspectorState: {
          type: 'topk',
          topK: {
            k,
            incomingVal: num,
            currentTop: minHeap[0],
            comparisonResult: `Evicted ${popped}; current top ${minHeap[0]} is candidate Kth largest`,
            currentHeapCount: minHeap.length
          }
        },
        callStack: [`findKthLargest()`, `minHeap.pop() -> ${popped}`],
        logEntry: `Evicted ${popped}, current size restored to ${k}`
      });
    }
  }

  // Final step
  steps.push({
    stepNumber: ++stepCount,
    description: `All elements processed! The root of the Min-Heap contains the ${k}th largest element: ${minHeap[0]}.`,
    cppLineNumber: 11,
    heap: [...minHeap],
    heapType: 'min',
    nodeStates: { 0: 'active' },
    comparingIndices: [0],
    swappingIndices: [],
    satisfiedIndices: minHeap.map((_, i) => i),
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        incomingVal: 'Done',
        currentTop: minHeap[0],
        comparisonResult: `Result: ${minHeap[0]}`,
        currentHeapCount: minHeap.length
      }
    },
    callStack: [`return minHeap.top() = ${minHeap[0]}`],
    logEntry: `Answer: ${minHeap[0]}`
  });

  return steps;
}

// 6. Top K Frequent Elements (LC #347)
export function simulateTopKFrequent(nums: number[], k: number): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const freqMap: Record<number, number> = {};
  for (const n of nums) freqMap[n] = (freqMap[n] || 0) + 1;

  const entries = Object.entries(freqMap).map(([val, freq]) => ({ val: Number(val), freq }));
  let stepCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Computed frequency map for nums. Found ${entries.length} unique elements. Initializing Min-Heap of size K=${k}.`,
    cppLineNumber: 3,
    heap: [],
    heapLabels: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        incomingVal: '-',
        currentTop: '-',
        comparisonResult: 'Frequencies ready',
        currentHeapCount: 0,
        frequencyMap: Object.fromEntries(entries.map(e => [`val ${e.val}`, e.freq]))
      }
    },
    callStack: [`topKFrequent(nums, ${k})`],
    logEntry: `Frequency counts computed`
  });

  // Min-heap ordered by freq
  const minHeap: { val: number; freq: number }[] = [];

  for (const item of entries) {
    minHeap.push(item);
    // sift up based on freq
    let ci = minHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (minHeap[ci].freq < minHeap[p].freq) {
        const tmp = minHeap[ci];
        minHeap[ci] = minHeap[p];
        minHeap[p] = tmp;
        ci = p;
      } else {
        break;
      }
    }

    steps.push({
      stepNumber: ++stepCount,
      description: `Pushed (freq: ${item.freq}, val: ${item.val}) into Min-Heap.`,
      cppLineNumber: 9,
      heap: minHeap.map(x => x.freq),
      heapLabels: minHeap.map(x => `${x.val} (f:${x.freq})`),
      heapType: 'min',
      nodeStates: { [minHeap.findIndex(x => x.val === item.val)]: 'active' },
      comparingIndices: [minHeap.findIndex(x => x.val === item.val)],
      swappingIndices: [],
      satisfiedIndices: [],
      inspectorState: {
        type: 'topk',
        topK: {
          k,
          incomingVal: `${item.val} (freq ${item.freq})`,
          currentTop: `${minHeap[0].val} (freq ${minHeap[0].freq})`,
          comparisonResult: minHeap.length > k ? 'Exceeds K: pop lowest frequency' : 'Within capacity K',
          currentHeapCount: minHeap.length,
          frequencyMap: Object.fromEntries(entries.map(e => [`val ${e.val}`, e.freq]))
        }
      },
      callStack: [`minHeap.push({${item.freq}, ${item.val}})`],
      logEntry: `Pushed val ${item.val} with freq ${item.freq}`
    });

    if (minHeap.length > k) {
      const popped = minHeap[0];
      const last = minHeap.pop()!;
      if (minHeap.length > 0) {
        minHeap[0] = last;
        let i = 0;
        const n = minHeap.length;
        while (i < n) {
          let sm = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < n && minHeap[l].freq < minHeap[sm].freq) sm = l;
          if (r < n && minHeap[r].freq < minHeap[sm].freq) sm = r;
          if (sm !== i) {
            const tmp = minHeap[i];
            minHeap[i] = minHeap[sm];
            minHeap[sm] = tmp;
            i = sm;
          } else break;
        }
      }

      steps.push({
        stepNumber: ++stepCount,
        description: `Evicted lowest frequency element val=${popped.val} (freq=${popped.freq}). Min-Heap retains highest frequencies.`,
        cppLineNumber: 10,
        heap: minHeap.map(x => x.freq),
        heapLabels: minHeap.map(x => `${x.val} (f:${x.freq})`),
        heapType: 'min',
        nodeStates: { 0: 'satisfied' },
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: minHeap.map((_, idx) => idx),
        inspectorState: {
          type: 'topk',
          topK: {
            k,
            incomingVal: '-',
            currentTop: `${minHeap[0].val} (freq ${minHeap[0].freq})`,
            comparisonResult: `Evicted val ${popped.val}`,
            currentHeapCount: minHeap.length,
            frequencyMap: Object.fromEntries(entries.map(e => [`val ${e.val}`, e.freq]))
          }
        },
        callStack: [`minHeap.pop()`],
        logEntry: `Evicted val ${popped.val}`
      });
    }
  }

  const result = minHeap.map(x => x.val);

  steps.push({
    stepNumber: ++stepCount,
    description: `Top ${k} frequent elements found: [${result.join(', ')}].`,
    cppLineNumber: 15,
    heap: minHeap.map(x => x.freq),
    heapLabels: minHeap.map(x => `${x.val} (f:${x.freq})`),
    heapType: 'min',
    nodeStates: Object.fromEntries(minHeap.map((_, idx) => [idx, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: minHeap.map((_, idx) => idx),
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        incomingVal: 'Done',
        currentTop: `${minHeap[0].val} (freq ${minHeap[0].freq})`,
        comparisonResult: `Output: [${result.join(', ')}]`,
        currentHeapCount: minHeap.length,
        frequencyMap: Object.fromEntries(entries.map(e => [`val ${e.val}`, e.freq]))
      }
    },
    callStack: [`return [${result.join(', ')}]`],
    logEntry: `Top K elements: ${result.join(', ')}`
  });

  return steps;
}

// 7. K Closest Points to Origin (LC #973)
export function simulateKClosestPoints(points: number[][], k: number): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let stepCount = 0;

  const distSq = (p: number[]) => p[0] * p[0] + p[1] * p[1];

  steps.push({
    stepNumber: ++stepCount,
    description: `Initializing Max-Heap of capacity K=${k} using squared distance d^2 = x^2 + y^2.`,
    cppLineNumber: 4,
    heap: [],
    heapLabels: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        incomingVal: '-',
        currentTop: '-',
        comparisonResult: 'Ready',
        currentHeapCount: 0
      }
    },
    callStack: [`kClosest(points, ${k})`],
    logEntry: `Max-heap of size K=${k} initialized`
  });

  const maxHeap: { point: number[]; d2: number }[] = [];

  for (const pt of points) {
    const d2 = distSq(pt);
    maxHeap.push({ point: pt, d2 });

    // Sift up in max heap
    let ci = maxHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (maxHeap[ci].d2 > maxHeap[p].d2) {
        const tmp = maxHeap[ci];
        maxHeap[ci] = maxHeap[p];
        maxHeap[p] = tmp;
        ci = p;
      } else break;
    }

    steps.push({
      stepNumber: ++stepCount,
      description: `Processed point (${pt[0]}, ${pt[1]}) with d^2 = ${d2}. Pushed into Max-Heap.`,
      cppLineNumber: 9,
      heap: maxHeap.map(x => x.d2),
      heapLabels: maxHeap.map(x => `(${x.point[0]},${x.point[1]}): ${x.d2}`),
      heapType: 'max',
      nodeStates: { [maxHeap.findIndex(x => x.point === pt)]: 'active' },
      comparingIndices: [maxHeap.findIndex(x => x.point === pt)],
      swappingIndices: [],
      satisfiedIndices: [],
      inspectorState: {
        type: 'topk',
        topK: {
          k,
          incomingVal: `(${pt[0]},${pt[1]}) d²=${d2}`,
          currentTop: `(${maxHeap[0].point[0]},${maxHeap[0].point[1]}) d²=${maxHeap[0].d2}`,
          comparisonResult: maxHeap.length > k ? 'Size > K: Evict farthest point' : 'Within capacity K',
          currentHeapCount: maxHeap.length
        }
      },
      callStack: [`maxHeap.push(pt)`],
      logEntry: `Inserted (${pt[0]}, ${pt[1]})`
    });

    if (maxHeap.length > k) {
      const popped = maxHeap[0];
      const last = maxHeap.pop()!;
      if (maxHeap.length > 0) {
        maxHeap[0] = last;
        let i = 0;
        const n = maxHeap.length;
        while (i < n) {
          let lg = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < n && maxHeap[l].d2 > maxHeap[lg].d2) lg = l;
          if (r < n && maxHeap[r].d2 > maxHeap[lg].d2) lg = r;
          if (lg !== i) {
            const tmp = maxHeap[i];
            maxHeap[i] = maxHeap[lg];
            maxHeap[lg] = tmp;
            i = lg;
          } else break;
        }
      }

      steps.push({
        stepNumber: ++stepCount,
        description: `Evicted farthest point (${popped.point[0]}, ${popped.point[1]}) with d^2 = ${popped.d2}.`,
        cppLineNumber: 10,
        heap: maxHeap.map(x => x.d2),
        heapLabels: maxHeap.map(x => `(${x.point[0]},${x.point[1]}): ${x.d2}`),
        heapType: 'max',
        nodeStates: { 0: 'satisfied' },
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: maxHeap.map((_, i) => i),
        inspectorState: {
          type: 'topk',
          topK: {
            k,
            incomingVal: '-',
            currentTop: `(${maxHeap[0].point[0]},${maxHeap[0].point[1]}) d²=${maxHeap[0].d2}`,
            comparisonResult: `Evicted farthest point (${popped.point[0]}, ${popped.point[1]})`,
            currentHeapCount: maxHeap.length
          }
        },
        callStack: [`maxHeap.pop()`],
        logEntry: `Evicted farthest point`
      });
    }
  }

  const finalPts = maxHeap.map(x => `[${x.point[0]}, ${x.point[1]}]`).join(', ');

  steps.push({
    stepNumber: ++stepCount,
    description: `Found ${k} closest points to origin: ${finalPts}.`,
    cppLineNumber: 15,
    heap: maxHeap.map(x => x.d2),
    heapLabels: maxHeap.map(x => `(${x.point[0]},${x.point[1]}): ${x.d2}`),
    heapType: 'max',
    nodeStates: Object.fromEntries(maxHeap.map((_, idx) => [idx, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: maxHeap.map((_, idx) => idx),
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        incomingVal: 'Done',
        currentTop: `(${maxHeap[0].point[0]},${maxHeap[0].point[1]})`,
        comparisonResult: `Result: ${finalPts}`,
        currentHeapCount: maxHeap.length
      }
    },
    callStack: ['Finished'],
    logEntry: `K closest points identified`
  });

  return steps;
}

// 8. Sort Characters By Frequency (LC #451)
export function simulateSortCharsFreq(s: string): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const freq: Record<string, number> = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;

  const entries = Object.entries(freq).map(([char, count]) => ({ char, count }));
  let stepCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Counted occurrences of all characters in "${s}". Initializing Max-Heap ordered by frequency.`,
    cppLineNumber: 3,
    heap: [],
    heapLabels: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'topk',
      topK: {
        k: entries.length,
        incomingVal: '-',
        currentTop: '-',
        comparisonResult: 'Frequencies calculated',
        currentHeapCount: 0,
        frequencyMap: freq
      }
    },
    callStack: [`frequencySort("${s}")`],
    logEntry: `Characters counted`
  });

  const maxHeap: { char: string; count: number }[] = [];
  for (const item of entries) {
    maxHeap.push(item);
    let ci = maxHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (maxHeap[ci].count > maxHeap[p].count) {
        const tmp = maxHeap[ci];
        maxHeap[ci] = maxHeap[p];
        maxHeap[p] = tmp;
        ci = p;
      } else break;
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `All character frequencies loaded into Max-Heap. Root is highest frequency char '${maxHeap[0].char}' (${maxHeap[0].count}x).`,
    cppLineNumber: 7,
    heap: maxHeap.map(x => x.count),
    heapLabels: maxHeap.map(x => `'${x.char}': ${x.count}`),
    heapType: 'max',
    nodeStates: Object.fromEntries(maxHeap.map((_, i) => [i, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: maxHeap.map((_, i) => i),
    inspectorState: {
      type: 'topk',
      topK: {
        k: maxHeap.length,
        incomingVal: 'Heap built',
        currentTop: `'${maxHeap[0].char}' (count ${maxHeap[0].count})`,
        comparisonResult: 'Begin extraction',
        currentHeapCount: maxHeap.length,
        frequencyMap: freq
      }
    },
    callStack: [`frequencySort()`, 'Max-Heap populated'],
    logEntry: `Max-heap populated`
  });

  let resultStr = '';
  while (maxHeap.length > 0) {
    const top = maxHeap[0];
    const last = maxHeap.pop()!;
    if (maxHeap.length > 0) {
      maxHeap[0] = last;
      let i = 0;
      const n = maxHeap.length;
      while (i < n) {
        let lg = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && maxHeap[l].count > maxHeap[lg].count) lg = l;
        if (r < n && maxHeap[r].count > maxHeap[lg].count) lg = r;
        if (lg !== i) {
          const tmp = maxHeap[i];
          maxHeap[i] = maxHeap[lg];
          maxHeap[lg] = tmp;
          i = lg;
        } else break;
      }
    }

    resultStr += top.char.repeat(top.count);

    steps.push({
      stepNumber: ++stepCount,
      description: `Popped '${top.char}' (count ${top.count}). Appended to result: "${resultStr}".`,
      cppLineNumber: 13,
      heap: maxHeap.map(x => x.count),
      heapLabels: maxHeap.map(x => `'${x.char}': ${x.count}`),
      heapType: 'max',
      nodeStates: maxHeap.length > 0 ? { 0: 'active' } : {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: maxHeap.map((_, idx) => idx),
      inspectorState: {
        type: 'topk',
        topK: {
          k: entries.length,
          incomingVal: `'${top.char}'`,
          currentTop: maxHeap.length > 0 ? `'${maxHeap[0].char}' (${maxHeap[0].count})` : 'Empty',
          comparisonResult: `Result so far: "${resultStr}"`,
          currentHeapCount: maxHeap.length,
          frequencyMap: freq
        }
      },
      callStack: [`result.append(${top.count}, '${top.char}')`],
      logEntry: `Extracted '${top.char}' (${top.count} times)`
    });
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Finished sorting characters by frequency! Final string: "${resultStr}".`,
    cppLineNumber: 16,
    heap: [],
    heapLabels: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'topk',
      topK: {
        k: entries.length,
        incomingVal: 'Complete',
        currentTop: 'Empty',
        comparisonResult: `Final: "${resultStr}"`,
        currentHeapCount: 0,
        frequencyMap: freq
      }
    },
    callStack: ['Complete'],
    logEntry: `Sorting complete: ${resultStr}`
  });

  return steps;
}

// 9. Find Median from Data Stream (LC #295 - Dual Heaps)
export function simulateMedianStream(stream: number[]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const maxHeap: number[] = []; // lower half
  const minHeap: number[] = []; // upper half
  let stepCount = 0;

  const pushMax = (val: number) => {
    maxHeap.push(val);
    let ci = maxHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (maxHeap[ci] > maxHeap[p]) {
        const tmp = maxHeap[ci];
        maxHeap[ci] = maxHeap[p];
        maxHeap[p] = tmp;
        ci = p;
      } else break;
    }
  };

  const popMax = (): number => {
    const root = maxHeap[0];
    const last = maxHeap.pop()!;
    if (maxHeap.length > 0) {
      maxHeap[0] = last;
      let i = 0;
      const n = maxHeap.length;
      while (i < n) {
        let lg = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && maxHeap[l] > maxHeap[lg]) lg = l;
        if (r < n && maxHeap[r] > maxHeap[lg]) lg = r;
        if (lg !== i) {
          const tmp = maxHeap[i];
          maxHeap[i] = maxHeap[lg];
          maxHeap[lg] = tmp;
          i = lg;
        } else break;
      }
    }
    return root;
  };

  const pushMin = (val: number) => {
    minHeap.push(val);
    let ci = minHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (minHeap[ci] < minHeap[p]) {
        const tmp = minHeap[ci];
        minHeap[ci] = minHeap[p];
        minHeap[p] = tmp;
        ci = p;
      } else break;
    }
  };

  const popMin = (): number => {
    const root = minHeap[0];
    const last = minHeap.pop()!;
    if (minHeap.length > 0) {
      minHeap[0] = last;
      let i = 0;
      const n = minHeap.length;
      while (i < n) {
        let sm = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && minHeap[l] < minHeap[sm]) sm = l;
        if (r < n && minHeap[r] < minHeap[sm]) sm = r;
        if (sm !== i) {
          const tmp = minHeap[i];
          minHeap[i] = minHeap[sm];
          minHeap[sm] = tmp;
          i = sm;
        } else break;
      }
    }
    return root;
  };

  const getMedian = (): number => {
    if (maxHeap.length > minHeap.length) return maxHeap[0];
    return (maxHeap[0] + minHeap[0]) / 2.0;
  };

  steps.push({
    stepNumber: ++stepCount,
    description: 'Initializing Dual Heaps: Max-Heap (stores smaller half) and Min-Heap (stores larger half). Invariant: maxHeap.size() == minHeap.size() or maxHeap.size() == minHeap.size() + 1.',
    cppLineNumber: 3,
    heap: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    dualHeap: {
      isDual: true,
      maxHeap: [],
      minHeap: [],
      currentMedian: null,
      balanceStatus: 'balanced'
    },
    inspectorState: {
      type: 'twoheap',
      twoHeap: {
        maxHeapSize: 0,
        minHeapSize: 0,
        median: 'None',
        invariantSatisfied: true,
        balanceDiff: 0
      }
    },
    callStack: ['MedianFinder()'],
    logEntry: 'Dual heaps ready'
  });

  for (let idx = 0; idx < stream.length; idx++) {
    const num = stream[idx];

    // Step 1: add to max-heap
    pushMax(num);

    steps.push({
      stepNumber: ++stepCount,
      description: `Stream element #${idx + 1}: Received ${num}. Inserted into Max-Heap.`,
      cppLineNumber: 6,
      heap: [...maxHeap],
      heapType: 'max',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: [],
      dualHeap: {
        isDual: true,
        maxHeap: [...maxHeap],
        minHeap: [...minHeap],
        incomingElement: num,
        currentMedian: getMedian(),
        balanceStatus: 'inserting'
      },
      inspectorState: {
        type: 'twoheap',
        twoHeap: {
          maxHeapSize: maxHeap.length,
          minHeapSize: minHeap.length,
          median: getMedian(),
          invariantSatisfied: maxHeap.length - minHeap.length <= 1 && maxHeap.length >= minHeap.length,
          balanceDiff: maxHeap.length - minHeap.length
        }
      },
      callStack: [`addNum(${num})`, `maxHeap.push(${num})`],
      logEntry: `Received ${num} -> maxHeap`
    });

    // Step 2: balance via minHeap
    const maxTop = popMax();
    pushMin(maxTop);

    steps.push({
      stepNumber: ++stepCount,
      description: `Filtered through: moved maxHeap.top() (${maxTop}) to Min-Heap to guarantee all elements in Min-Heap >= Max-Heap elements.`,
      cppLineNumber: 7,
      heap: [...maxHeap],
      heapType: 'max',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: [],
      dualHeap: {
        isDual: true,
        maxHeap: [...maxHeap],
        minHeap: [...minHeap],
        currentMedian: null,
        balanceStatus: 'rebalancing'
      },
      inspectorState: {
        type: 'twoheap',
        twoHeap: {
          maxHeapSize: maxHeap.length,
          minHeapSize: minHeap.length,
          median: 'Balancing',
          invariantSatisfied: false,
          balanceDiff: maxHeap.length - minHeap.length
        }
      },
      callStack: [`addNum()`, `minHeap.push(maxHeap.pop())`],
      logEntry: `Shifted ${maxTop} to minHeap`
    });

    // Step 3: if minHeap has more elements than maxHeap, rebalance back
    if (maxHeap.length < minHeap.length) {
      const minTop = popMin();
      pushMax(minTop);

      steps.push({
        stepNumber: ++stepCount,
        description: `Size invariant restoration: Min-Heap had more elements (${minHeap.length + 1} > ${maxHeap.length - 1}). Transferred root ${minTop} back to Max-Heap.`,
        cppLineNumber: 11,
        heap: [...maxHeap],
        heapType: 'max',
        nodeStates: {},
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: [],
        dualHeap: {
          isDual: true,
          maxHeap: [...maxHeap],
          minHeap: [...minHeap],
          currentMedian: getMedian(),
          balanceStatus: 'balanced'
        },
        inspectorState: {
          type: 'twoheap',
          twoHeap: {
            maxHeapSize: maxHeap.length,
            minHeapSize: minHeap.length,
            median: getMedian(),
            invariantSatisfied: true,
            balanceDiff: maxHeap.length - minHeap.length
          }
        },
        callStack: [`addNum()`, `maxHeap.push(minHeap.pop())`],
        logEntry: `Transferred ${minTop} to maxHeap`
      });
    }

    const currentMedian = getMedian();

    steps.push({
      stepNumber: ++stepCount,
      description: `findMedian(): Total size = ${maxHeap.length + minHeap.length} (${(maxHeap.length + minHeap.length) % 2 === 1 ? 'Odd' : 'Even'}). Current Running Median = ${currentMedian}.`,
      cppLineNumber: 18,
      heap: [...maxHeap],
      heapType: 'max',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: [],
      dualHeap: {
        isDual: true,
        maxHeap: [...maxHeap],
        minHeap: [...minHeap],
        currentMedian,
        balanceStatus: 'balanced'
      },
      inspectorState: {
        type: 'twoheap',
        twoHeap: {
          maxHeapSize: maxHeap.length,
          minHeapSize: minHeap.length,
          median: currentMedian,
          invariantSatisfied: true,
          balanceDiff: maxHeap.length - minHeap.length
        }
      },
      callStack: [`findMedian() -> ${currentMedian}`],
      logEntry: `Current Median = ${currentMedian}`
    });
  }

  return steps;
}

// 10. Sliding Window Median (LC #480)
export function simulateSlidingWindowMedian(nums: number[], k: number): SimulationStep[] {
  // Using direct window extraction with dual heaps concept for crisp step progression
  const steps: SimulationStep[] = [];
  let stepCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Initializing Sliding Window Median for window size K=${k} across array of length ${nums.length}.`,
    cppLineNumber: 2,
    heap: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    dualHeap: {
      isDual: true,
      maxHeap: [],
      minHeap: [],
      currentMedian: null,
      balanceStatus: 'balanced'
    },
    inspectorState: {
      type: 'twoheap',
      twoHeap: {
        maxHeapSize: 0,
        minHeapSize: 0,
        median: 'Ready',
        invariantSatisfied: true,
        balanceDiff: 0
      }
    },
    callStack: [`medianSlidingWindow(nums, ${k})`],
    logEntry: `Sliding window initialized`
  });

  const medians: number[] = [];

  for (let i = 0; i <= nums.length - k; i++) {
    const window = nums.slice(i, i + k);
    const sorted = [...window].sort((a, b) => a - b);
    const mid = Math.floor(k / 2);
    const median = k % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2.0;
    medians.push(median);

    // Split sorted window into lower half and upper half
    const lowerHalf = sorted.slice(0, k % 2 === 1 ? mid + 1 : mid).reverse();
    const upperHalf = sorted.slice(k % 2 === 1 ? mid + 1 : mid);

    steps.push({
      stepNumber: ++stepCount,
      description: `Window [${i}..${i + k - 1}] = [${window.join(', ')}]. Lower half max = ${lowerHalf[0]}, Upper half min = ${upperHalf[0] || 'none'}. Median = ${median}.`,
      cppLineNumber: 15,
      heap: lowerHalf,
      heapType: 'max',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: [],
      dualHeap: {
        isDual: true,
        maxHeap: lowerHalf,
        minHeap: upperHalf,
        currentMedian: median,
        balanceStatus: 'balanced'
      },
      inspectorState: {
        type: 'twoheap',
        twoHeap: {
          maxHeapSize: lowerHalf.length,
          minHeapSize: upperHalf.length,
          median,
          invariantSatisfied: true,
          balanceDiff: lowerHalf.length - upperHalf.length
        }
      },
      callStack: [`Window [${i}..${i + k - 1}]`, `Median: ${median}`],
      logEntry: `Window ${i}: median = ${median}`
    });
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Sliding window complete! Medians: [${medians.join(', ')}].`,
    cppLineNumber: 17,
    heap: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'twoheap',
      twoHeap: {
        maxHeapSize: 0,
        minHeapSize: 0,
        median: `[${medians.join(', ')}]`,
        invariantSatisfied: true,
        balanceDiff: 0
      }
    },
    callStack: ['Finished'],
    logEntry: `Result: ${medians.join(', ')}`
  });

  return steps;
}

// 11. Merge K Sorted Lists (LC #23)
export function simulateMergeKSorted(lists: number[][]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let stepCount = 0;

  // Track pointers for each list
  const pointers = lists.map((list, idx) => ({
    listId: idx,
    index: 0,
    value: list[0] ?? Infinity,
    totalItems: list.length
  }));

  const minHeap: { val: number; listIdx: number; elemIdx: number }[] = [];

  steps.push({
    stepNumber: ++stepCount,
    description: `Initializing Min-Heap with the head of each of the ${lists.length} sorted lists.`,
    cppLineNumber: 4,
    heap: [],
    heapLabels: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'kway',
      kWay: {
        listPointers: deepClone(pointers),
        mergedOutput: [],
        currentMinPopped: undefined
      }
    },
    callStack: [`mergeKSorted(lists)`],
    logEntry: `Min-heap initialized for K=${lists.length} lists`
  });

  // Push heads
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].length > 0) {
      const val = lists[i][0];
      minHeap.push({ val, listIdx: i, elemIdx: 0 });
      let ci = minHeap.length - 1;
      while (ci > 0) {
        const p = Math.floor((ci - 1) / 2);
        if (minHeap[ci].val < minHeap[p].val) {
          const tmp = minHeap[ci];
          minHeap[ci] = minHeap[p];
          minHeap[p] = tmp;
          ci = p;
        } else break;
      }
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Loaded head elements into Min-Heap. Root is current minimum head: ${minHeap[0].val} (from List #${minHeap[0].listIdx + 1}).`,
    cppLineNumber: 8,
    heap: minHeap.map(x => x.val),
    heapLabels: minHeap.map(x => `L${x.listIdx + 1}[${x.elemIdx}]: ${x.val}`),
    heapType: 'min',
    nodeStates: Object.fromEntries(minHeap.map((_, i) => [i, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: minHeap.map((_, i) => i),
    inspectorState: {
      type: 'kway',
      kWay: {
        listPointers: deepClone(pointers),
        mergedOutput: [],
        currentMinPopped: undefined
      }
    },
    callStack: ['minHeap populated with list heads'],
    logEntry: `Heads loaded`
  });

  const mergedOutput: number[] = [];

  while (minHeap.length > 0) {
    const top = minHeap[0];
    const last = minHeap.pop()!;
    if (minHeap.length > 0) {
      minHeap[0] = last;
      let i = 0;
      const n = minHeap.length;
      while (i < n) {
        let sm = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && minHeap[l].val < minHeap[sm].val) sm = l;
        if (r < n && minHeap[r].val < minHeap[sm].val) sm = r;
        if (sm !== i) {
          const tmp = minHeap[i];
          minHeap[i] = minHeap[sm];
          minHeap[sm] = tmp;
          i = sm;
        } else break;
      }
    }

    mergedOutput.push(top.val);
    pointers[top.listIdx].index = top.elemIdx + 1;
    pointers[top.listIdx].value = lists[top.listIdx][top.elemIdx + 1] ?? Infinity;

    steps.push({
      stepNumber: ++stepCount,
      description: `Popped smallest head ${top.val} from List #${top.listIdx + 1} and appended to merged sequence.`,
      cppLineNumber: 13,
      heap: minHeap.map(x => x.val),
      heapLabels: minHeap.map(x => `L${x.listIdx + 1}[${x.elemIdx}]: ${x.val}`),
      heapType: 'min',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: minHeap.map((_, i) => i),
      inspectorState: {
        type: 'kway',
        kWay: {
          listPointers: deepClone(pointers),
          mergedOutput: [...mergedOutput],
          currentMinPopped: top.val
        }
      },
      callStack: [`minHeap.top() -> ${top.val}`, `merged.push(${top.val})`],
      logEntry: `Popped ${top.val} from List ${top.listIdx + 1}`
    });

    // Advance in the same list
    const nextElemIdx = top.elemIdx + 1;
    if (nextElemIdx < lists[top.listIdx].length) {
      const nextVal = lists[top.listIdx][nextElemIdx];
      minHeap.push({ val: nextVal, listIdx: top.listIdx, elemIdx: nextElemIdx });
      let ci = minHeap.length - 1;
      while (ci > 0) {
        const p = Math.floor((ci - 1) / 2);
        if (minHeap[ci].val < minHeap[p].val) {
          const tmp = minHeap[ci];
          minHeap[ci] = minHeap[p];
          minHeap[p] = tmp;
          ci = p;
        } else break;
      }

      steps.push({
        stepNumber: ++stepCount,
        description: `Advanced in List #${top.listIdx + 1}: Pushed next element ${nextVal} into Min-Heap.`,
        cppLineNumber: 18,
        heap: minHeap.map(x => x.val),
        heapLabels: minHeap.map(x => `L${x.listIdx + 1}[${x.elemIdx}]: ${x.val}`),
        heapType: 'min',
        nodeStates: { [minHeap.findIndex(x => x.val === nextVal && x.listIdx === top.listIdx)]: 'active' },
        comparingIndices: [minHeap.findIndex(x => x.val === nextVal && x.listIdx === top.listIdx)],
        swappingIndices: [],
        satisfiedIndices: [],
        inspectorState: {
          type: 'kway',
          kWay: {
            listPointers: deepClone(pointers),
            mergedOutput: [...mergedOutput],
            currentMinPopped: top.val
          }
        },
        callStack: [`minHeap.push(${nextVal})`],
        logEntry: `Pushed ${nextVal} from List ${top.listIdx + 1}`
      });
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `All K lists completely merged! Sorted output: [${mergedOutput.join(', ')}].`,
    cppLineNumber: 21,
    heap: [],
    heapLabels: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'kway',
      kWay: {
        listPointers: deepClone(pointers),
        mergedOutput: [...mergedOutput],
        currentMinPopped: undefined
      }
    },
    callStack: ['Finished'],
    logEntry: `Merge complete: [${mergedOutput.join(', ')}]`
  });

  return steps;
}

// 12. Reorganize String (LC #767)
export function simulateReorganizeString(s: string): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const freq: Record<string, number> = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;

  let stepCount = 0;
  const maxHeap: { char: string; count: number }[] = [];

  for (const [char, count] of Object.entries(freq)) {
    maxHeap.push({ char, count });
    let ci = maxHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (maxHeap[ci].count > maxHeap[p].count) {
        const tmp = maxHeap[ci];
        maxHeap[ci] = maxHeap[p];
        maxHeap[p] = tmp;
        ci = p;
      } else break;
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Initialized Max-Heap with character frequencies. Cooldown buffer holds previous character for 1 turn.`,
    cppLineNumber: 4,
    heap: maxHeap.map(x => x.count),
    heapLabels: maxHeap.map(x => `'${x.char}': ${x.count}`),
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: maxHeap.map((_, i) => i),
    inspectorState: {
      type: 'greedy',
      greedy: {
        scheduleOutput: [],
        currentPairsPopped: []
      }
    },
    callStack: [`reorganizeString("${s}")`],
    logEntry: `Max-heap populated`
  });

  let result = '';
  let prev: { char: string; count: number } | null = null;

  while (maxHeap.length > 0) {
    const top = maxHeap[0];
    const last = maxHeap.pop()!;
    if (maxHeap.length > 0) {
      maxHeap[0] = last;
      let i = 0;
      const n = maxHeap.length;
      while (i < n) {
        let lg = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && maxHeap[l].count > maxHeap[lg].count) lg = l;
        if (r < n && maxHeap[r].count > maxHeap[lg].count) lg = r;
        if (lg !== i) {
          const tmp = maxHeap[i];
          maxHeap[i] = maxHeap[lg];
          maxHeap[lg] = tmp;
          i = lg;
        } else break;
      }
    }

    result += top.char;

    steps.push({
      stepNumber: ++stepCount,
      description: `Selected highest remaining character '${top.char}' (count ${top.count} -> ${top.count - 1}). Current string: "${result}".`,
      cppLineNumber: 13,
      heap: maxHeap.map(x => x.count),
      heapLabels: maxHeap.map(x => `'${x.char}': ${x.count}`),
      heapType: 'max',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: maxHeap.map((_, i) => i),
      inspectorState: {
        type: 'greedy',
        greedy: {
          scheduleOutput: result.split(''),
          currentPairsPopped: [top.count]
        }
      },
      callStack: [`result += '${top.char}'`],
      logEntry: `Appended '${top.char}'`
    });

    if (prev && prev.count > 0) {
      maxHeap.push(prev);
      let ci = maxHeap.length - 1;
      while (ci > 0) {
        const p = Math.floor((ci - 1) / 2);
        if (maxHeap[ci].count > maxHeap[p].count) {
          const tmp = maxHeap[ci];
          maxHeap[ci] = maxHeap[p];
          maxHeap[p] = tmp;
          ci = p;
        } else break;
      }
    }

    prev = { char: top.char, count: top.count - 1 };
  }

  const valid = result.length === s.length;

  steps.push({
    stepNumber: ++stepCount,
    description: valid ? `Reorganization successful! Final string: "${result}". No adjacent characters are equal.` : `Impossible to reorganize: highest frequency exceeds ceil(N/2).`,
    cppLineNumber: 19,
    heap: [],
    heapLabels: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'greedy',
      greedy: {
        scheduleOutput: result.split(''),
        currentPairsPopped: []
      }
    },
    callStack: ['Complete'],
    logEntry: valid ? `Success: ${result}` : `Failed: Impossible`
  });

  return steps;
}

// 13. Task Scheduler (LC #621)
export function simulateTaskScheduler(tasks: string[], n: number): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const counts: Record<string, number> = {};
  for (const t of tasks) counts[t] = (counts[t] || 0) + 1;

  let stepCount = 0;
  const maxHeap: { task: string; count: number }[] = [];

  for (const [task, count] of Object.entries(counts)) {
    maxHeap.push({ task, count });
    let ci = maxHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (maxHeap[ci].count > maxHeap[p].count) {
        const tmp = maxHeap[ci];
        maxHeap[ci] = maxHeap[p];
        maxHeap[p] = tmp;
        ci = p;
      } else break;
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Task Scheduler initialized with cooldown n=${n}. Max-Heap tracks tasks by remaining frequency count.`,
    cppLineNumber: 5,
    heap: maxHeap.map(x => x.count),
    heapLabels: maxHeap.map(x => `${x.task}: ${x.count}`),
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: maxHeap.map((_, i) => i),
    inspectorState: {
      type: 'greedy',
      greedy: {
        queueState: [],
        currentUnit: 0,
        scheduleOutput: []
      }
    },
    callStack: [`leastInterval(tasks, ${n})`],
    logEntry: `Max-heap populated with task frequencies`
  });

  const waitQueue: { task: string; count: number; readyTime: number }[] = [];
  let time = 0;
  const schedule: string[] = [];

  while (maxHeap.length > 0 || waitQueue.length > 0) {
    time++;

    let executedTask: string | null = null;
    if (maxHeap.length > 0) {
      const top = maxHeap[0];
      const last = maxHeap.pop()!;
      if (maxHeap.length > 0) {
        maxHeap[0] = last;
        let i = 0;
        const len = maxHeap.length;
        while (i < len) {
          let lg = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < len && maxHeap[l].count > maxHeap[lg].count) lg = l;
          if (r < len && maxHeap[r].count > maxHeap[lg].count) lg = r;
          if (lg !== i) {
            const tmp = maxHeap[i];
            maxHeap[i] = maxHeap[lg];
            maxHeap[lg] = tmp;
            i = lg;
          } else break;
        }
      }

      executedTask = top.task;
      schedule.push(top.task);

      if (top.count - 1 > 0) {
        waitQueue.push({ task: top.task, count: top.count - 1, readyTime: time + n });
      }
    } else {
      schedule.push('IDLE');
    }

    // Check wait queue
    if (waitQueue.length > 0 && waitQueue[0].readyTime === time) {
      const ready = waitQueue.shift()!;
      maxHeap.push({ task: ready.task, count: ready.count });
      let ci = maxHeap.length - 1;
      while (ci > 0) {
        const p = Math.floor((ci - 1) / 2);
        if (maxHeap[ci].count > maxHeap[p].count) {
          const tmp = maxHeap[ci];
          maxHeap[ci] = maxHeap[p];
          maxHeap[p] = tmp;
          ci = p;
        } else break;
      }
    }

    steps.push({
      stepNumber: ++stepCount,
      description: `Time unit ${time}: ${executedTask ? `Executed Task '${executedTask}'` : 'CPU is IDLE'}. Cool queue size = ${waitQueue.length}.`,
      cppLineNumber: 13,
      heap: maxHeap.map(x => x.count),
      heapLabels: maxHeap.map(x => `${x.task}: ${x.count}`),
      heapType: 'max',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: maxHeap.map((_, i) => i),
      inspectorState: {
        type: 'greedy',
        greedy: {
          queueState: waitQueue.map(w => ({ item: w.task, readyAt: w.readyTime })),
          currentUnit: time,
          scheduleOutput: [...schedule]
        }
      },
      callStack: [`Time: ${time}`, executedTask ? `Task ${executedTask}` : 'IDLE'],
      logEntry: `t=${time}: ${executedTask || 'IDLE'}`
    });
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `All tasks finished! Minimum execution units required: ${time}. Schedule: [${schedule.join(' -> ')}].`,
    cppLineNumber: 23,
    heap: [],
    heapLabels: [],
    heapType: 'max',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'greedy',
      greedy: {
        queueState: [],
        currentUnit: time,
        scheduleOutput: [...schedule]
      }
    },
    callStack: [`return ${time}`],
    logEntry: `Completed in ${time} intervals`
  });

  return steps;
}

// 14. Minimum Cost to Connect Sticks (LC #1167 / Huffman)
export function simulateConnectSticks(rawSticks: number[]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const minHeap: number[] = [...rawSticks];
  let stepCount = 0;

  // Build min-heap
  const n = minHeap.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; --i) {
    let curr = i;
    while (curr < n) {
      let sm = curr;
      const l = 2 * curr + 1;
      const r = 2 * curr + 2;
      if (l < n && minHeap[l] < minHeap[sm]) sm = l;
      if (r < n && minHeap[r] < minHeap[sm]) sm = r;
      if (sm !== curr) {
        const tmp = minHeap[curr];
        minHeap[curr] = minHeap[sm];
        minHeap[sm] = tmp;
        curr = sm;
      } else break;
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Constructed Min-Heap from stick lengths [${rawSticks.join(', ')}]. Greedy Huffman strategy: merge the 2 shortest sticks repeatedly.`,
    cppLineNumber: 3,
    heap: [...minHeap],
    heapType: 'min',
    nodeStates: Object.fromEntries(minHeap.map((_, i) => [i, 'satisfied'])),
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: minHeap.map((_, i) => i),
    inspectorState: {
      type: 'greedy',
      greedy: {
        totalCost: 0,
        lastMergedPair: undefined
      }
    },
    callStack: ['connectSticks()'],
    logEntry: `Min-heap initialized with ${n} sticks`
  });

  let totalCost = 0;

  const popMin = (): number => {
    const root = minHeap[0];
    const last = minHeap.pop()!;
    if (minHeap.length > 0) {
      minHeap[0] = last;
      let i = 0;
      const len = minHeap.length;
      while (i < len) {
        let sm = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < len && minHeap[l] < minHeap[sm]) sm = l;
        if (r < len && minHeap[r] < minHeap[sm]) sm = r;
        if (sm !== i) {
          const tmp = minHeap[i];
          minHeap[i] = minHeap[sm];
          minHeap[sm] = tmp;
          i = sm;
        } else break;
      }
    }
    return root;
  };

  const pushMin = (val: number) => {
    minHeap.push(val);
    let ci = minHeap.length - 1;
    while (ci > 0) {
      const p = Math.floor((ci - 1) / 2);
      if (minHeap[ci] < minHeap[p]) {
        const tmp = minHeap[ci];
        minHeap[ci] = minHeap[p];
        minHeap[p] = tmp;
        ci = p;
      } else break;
    }
  };

  while (minHeap.length > 1) {
    const first = popMin();
    const second = popMin();
    const combined = first + second;
    totalCost += combined;

    steps.push({
      stepNumber: ++stepCount,
      description: `Popped two shortest sticks: ${first} and ${second}. Combined cost = ${combined}. Total accumulated cost = ${totalCost}.`,
      cppLineNumber: 9,
      heap: [...minHeap],
      heapType: 'min',
      nodeStates: {},
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: minHeap.map((_, i) => i),
      inspectorState: {
        type: 'greedy',
        greedy: {
          totalCost,
          lastMergedPair: [first, second],
          currentPairsPopped: [first, second]
        }
      },
      callStack: [`connectSticks()`, `merge(${first}, ${second}) -> ${combined}`],
      logEntry: `Merged ${first} + ${second} = ${combined} (Cost: ${totalCost})`
    });

    pushMin(combined);

    steps.push({
      stepNumber: ++stepCount,
      description: `Pushed combined stick of length ${combined} back into the Min-Heap.`,
      cppLineNumber: 12,
      heap: [...minHeap],
      heapType: 'min',
      nodeStates: { [minHeap.indexOf(combined)]: 'active' },
      comparingIndices: [minHeap.indexOf(combined)],
      swappingIndices: [],
      satisfiedIndices: [],
      inspectorState: {
        type: 'greedy',
        greedy: {
          totalCost,
          lastMergedPair: [first, second],
          currentPairsPopped: [first, second]
        }
      },
      callStack: [`minHeap.push(${combined})`],
      logEntry: `Pushed combined stick ${combined}`
    });
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Only 1 stick remaining of length ${minHeap[0]}. All sticks connected with minimum total cost = ${totalCost}.`,
    cppLineNumber: 14,
    heap: [...minHeap],
    heapType: 'min',
    nodeStates: { 0: 'satisfied' },
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [0],
    inspectorState: {
      type: 'greedy',
      greedy: {
        totalCost,
        lastMergedPair: undefined
      }
    },
    callStack: [`return ${totalCost}`],
    logEntry: `Minimum total cost = ${totalCost}`,
    resultOutput: {
      label: 'Minimum Cost to Connect Sticks',
      value: totalCost,
      isFinal: true,
      details: `Greedy Huffman strategy achieved optimal total connection cost of ${totalCost}.`
    }
  });

  return steps;
}

// 15. LC #373: Find K Pairs with Smallest Sums (Heap on Pairs Pattern)
export function simulateKPairsSmallestSums(
  nums1: number[],
  nums2: number[],
  k: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let stepCount = 0;

  // Min-Heap elements: { sum: number, i: number, j: number, label: string }
  interface PairItem {
    sum: number;
    i: number;
    j: number;
  }

  let heap: PairItem[] = [];
  const result: [number, number][] = [];

  const getHeapValues = () => heap.map(item => item.sum);
  const getHeapLabels = () => heap.map(item => `[${nums1[item.i]},${nums2[item.j]}]`);

  const siftUp = () => {
    let curr = heap.length - 1;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (heap[curr].sum < heap[parent].sum) {
        const temp = heap[curr];
        heap[curr] = heap[parent];
        heap[parent] = temp;
        curr = parent;
      } else {
        break;
      }
    }
  };

  const siftDown = () => {
    let curr = 0;
    while (curr * 2 + 1 < heap.length) {
      let smallest = curr;
      const left = curr * 2 + 1;
      const right = curr * 2 + 2;

      if (left < heap.length && heap[left].sum < heap[smallest].sum) {
        smallest = left;
      }
      if (right < heap.length && heap[right].sum < heap[smallest].sum) {
        smallest = right;
      }

      if (smallest !== curr) {
        const temp = heap[curr];
        heap[curr] = heap[smallest];
        heap[smallest] = temp;
        curr = smallest;
      } else {
        break;
      }
    }
  };

  // Step 1: Initial state
  steps.push({
    stepNumber: ++stepCount,
    description: `Initialize Min-Heap on Pairs for nums1=${JSON.stringify(nums1)}, nums2=${JSON.stringify(nums2)}, target K=${k}.`,
    cppLineNumber: 2,
    heap: [],
    heapLabels: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'pairs',
      pairs: {
        pairsInHeap: [],
        resultPairs: [],
        details: 'Initial pairs will pair each element of nums1 with nums2[0].'
      }
    },
    callStack: [`kSmallestPairs(k=${k})`],
    logEntry: `Target K=${k} pairs with smallest sums`,
    resultOutput: {
      label: 'K Pairs with Smallest Sums',
      value: [],
      isFinal: false,
      details: 'Min-Heap initialized. Preparing seed pairs...'
    }
  });

  // Step 2: Push initial pairs (nums1[i], nums2[0])
  const initialCount = Math.min(nums1.length, k);
  for (let i = 0; i < initialCount; i++) {
    const pair: PairItem = { sum: nums1[i] + nums2[0], i, j: 0 };
    heap.push(pair);
    siftUp();

    steps.push({
      stepNumber: ++stepCount,
      description: `Pushed pair (${nums1[i]}, ${nums2[0]}) with sum=${pair.sum} at indices (i=${i}, j=0).`,
      cppLineNumber: 9,
      heap: getHeapValues(),
      heapLabels: getHeapLabels(),
      heapType: 'min',
      nodeStates: { 0: 'active' },
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: heap.map((_, idx) => idx),
      inspectorState: {
        type: 'pairs',
        pairs: {
          pairsInHeap: heap.map(h => ({ pair: [nums1[h.i], nums2[h.j]], metric: h.sum, label: `sum=${h.sum}` })),
          resultPairs: [...result],
          details: `Seed pair (${nums1[i]}, ${nums2[0]}) added.`
        }
      },
      callStack: [`push({${pair.sum}, ${i}, 0})`],
      logEntry: `Heap size: ${heap.length}, top sum: ${heap[0]?.sum}`,
      resultOutput: {
        label: 'Collected Pairs so far',
        value: [...result],
        isFinal: false,
        details: `Seed pairs added to Min-Heap: ${heap.length}/${initialCount}`
      }
    });
  }

  // Step 3: Extract K pairs
  while (heap.length > 0 && result.length < k) {
    const top = heap[0];
    const extractedPair: [number, number] = [nums1[top.i], nums2[top.j]];
    result.push(extractedPair);

    // Swap root with back and pop
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown();
    }

    steps.push({
      stepNumber: ++stepCount,
      description: `Popped pair (${extractedPair[0]}, ${extractedPair[1]}) with min sum ${top.sum}. Added to result (${result.length}/${k}).`,
      cppLineNumber: 15,
      heap: getHeapValues(),
      heapLabels: getHeapLabels(),
      heapType: 'min',
      nodeStates: { 0: 'satisfied' },
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: heap.map((_, idx) => idx),
      inspectorState: {
        type: 'pairs',
        pairs: {
          pairsInHeap: heap.map(h => ({ pair: [nums1[h.i], nums2[h.j]], metric: h.sum, label: `sum=${h.sum}` })),
          resultPairs: [...result],
          currentExtracted: extractedPair,
          details: `Pair (${extractedPair.join(', ')}) committed. Next candidate column j+1 checked.`
        }
      },
      callStack: [`pop() -> [${extractedPair.join(',')}]`],
      logEntry: `Collected pair [${extractedPair.join(',')}] with sum ${top.sum}`,
      resultOutput: {
        label: `Pairs Collected (${result.length}/${k})`,
        value: [...result],
        isFinal: result.length === k,
        details: `Extracted pair [${extractedPair.join(',')}] (sum=${top.sum})`
      }
    });

    // Push next element in row i if available (nums1[i], nums2[j+1])
    if (top.j + 1 < nums2.length) {
      const nextPair: PairItem = {
        sum: nums1[top.i] + nums2[top.j + 1],
        i: top.i,
        j: top.j + 1
      };
      heap.push(nextPair);
      siftUp();

      steps.push({
        stepNumber: ++stepCount,
        description: `Pushed next pair from row ${top.i}: (${nums1[top.i]}, ${nums2[top.j + 1]}) with sum ${nextPair.sum}.`,
        cppLineNumber: 20,
        heap: getHeapValues(),
        heapLabels: getHeapLabels(),
        heapType: 'min',
        nodeStates: { 0: 'active' },
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: heap.map((_, idx) => idx),
        inspectorState: {
          type: 'pairs',
          pairs: {
            pairsInHeap: heap.map(h => ({ pair: [nums1[h.i], nums2[h.j]], metric: h.sum, label: `sum=${h.sum}` })),
            resultPairs: [...result],
            details: `Advanced column j: ${top.j} -> ${top.j + 1} for row ${top.i}.`
          }
        },
        callStack: [`push({${nextPair.sum}, ${top.i}, ${top.j + 1}})`],
        logEntry: `Pushed [${nums1[top.i]}, ${nums2[top.j + 1]}] sum=${nextPair.sum}`,
        resultOutput: {
          label: `Pairs Collected (${result.length}/${k})`,
          value: [...result],
          isFinal: false,
          details: `Active candidate heap size: ${heap.length}`
        }
      });
    }
  }

  // Final conclusion step
  steps.push({
    stepNumber: ++stepCount,
    description: `Successfully found all K=${k} pairs with smallest sums: ${JSON.stringify(result)}.`,
    cppLineNumber: 24,
    heap: getHeapValues(),
    heapLabels: getHeapLabels(),
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: heap.map((_, idx) => idx),
    inspectorState: {
      type: 'pairs',
      pairs: {
        pairsInHeap: heap.map(h => ({ pair: [nums1[h.i], nums2[h.j]], metric: h.sum })),
        resultPairs: [...result],
        details: `Final output generated with ${result.length} pairs.`
      }
    },
    callStack: [`return result`],
    logEntry: `Completed with ${result.length} pairs`,
    resultOutput: {
      label: 'Final K Pairs with Smallest Sums',
      value: [...result],
      isFinal: true,
      details: `Optimal K pairs identified using Min-Heap on Pairs in O(K log K) time.`
    }
  });

  return steps;
}

// 16. LC #253: Meeting Rooms II (Min Conference Rooms)
export function simulateMeetingRoomsII(rawIntervals: number[][]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let stepCount = 0;

  // Deep copy and sort intervals by start time
  const intervals = rawIntervals.map(inv => [...inv]).sort((a, b) => a[0] - b[0]);

  // Min-Heap of end times of currently active rooms
  let minHeap: number[] = [];

  const siftUp = () => {
    let curr = minHeap.length - 1;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (minHeap[curr] < minHeap[parent]) {
        const temp = minHeap[curr];
        minHeap[curr] = minHeap[parent];
        minHeap[parent] = temp;
        curr = parent;
      } else break;
    }
  };

  const siftDown = () => {
    let curr = 0;
    while (curr * 2 + 1 < minHeap.length) {
      let smallest = curr;
      const left = curr * 2 + 1;
      const right = curr * 2 + 2;
      if (left < minHeap.length && minHeap[left] < minHeap[smallest]) smallest = left;
      if (right < minHeap.length && minHeap[right] < minHeap[smallest]) smallest = right;
      if (smallest !== curr) {
        const temp = minHeap[curr];
        minHeap[curr] = minHeap[smallest];
        minHeap[smallest] = temp;
        curr = smallest;
      } else break;
    }
  };

  // Step 1: Initial state
  steps.push({
    stepNumber: ++stepCount,
    description: `Sorted ${intervals.length} meeting intervals by start time: ${intervals.map(i => `[${i[0]},${i[1]}]`).join(', ')}.`,
    cppLineNumber: 3,
    heap: [],
    heapLabels: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'pairs',
      pairs: {
        pairsInHeap: [],
        resultPairs: intervals.map(i => `[${i[0]},${i[1]}]`),
        details: 'Min-Heap will track end-times of rooms in use.'
      }
    },
    callStack: ['minMeetingRooms()'],
    logEntry: 'Intervals sorted by start time',
    resultOutput: {
      label: 'Minimum Conference Rooms Required',
      value: 0,
      isFinal: false,
      details: 'Prepared intervals. Initializing room allocation...'
    }
  });

  let maxRooms = 0;

  for (let i = 0; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    let reused = false;

    // Check if earliest ending meeting is finished
    if (minHeap.length > 0 && start >= minHeap[0]) {
      const freedEndTime = minHeap[0];
      const last = minHeap.pop()!;
      if (minHeap.length > 0) {
        minHeap[0] = last;
        siftDown();
      }
      reused = true;

      steps.push({
        stepNumber: ++stepCount,
        description: `Room freed! Earliest meeting ended at t=${freedEndTime} <= current meeting start t=${start}. Room can be reused.`,
        cppLineNumber: 11,
        heap: [...minHeap],
        heapLabels: minHeap.map(t => `ends @ ${t}`),
        heapType: 'min',
        nodeStates: { 0: 'comparing' },
        comparingIndices: [0],
        swappingIndices: [],
        satisfiedIndices: minHeap.map((_, idx) => idx),
        inspectorState: {
          type: 'pairs',
          pairs: {
            pairsInHeap: minHeap.map(t => ({ pair: [0, t], metric: t, label: `Room free @ ${t}` })),
            resultPairs: [`Current: [${start}, ${end}]`, `Reused room freed at ${freedEndTime}`],
            details: `Meeting [${start}, ${end}] starts after room freed at ${freedEndTime}.`
          }
        },
        callStack: [`pop(freed @ ${freedEndTime})`],
        logEntry: `Reused room. Current active rooms: ${minHeap.length}`,
        resultOutput: {
          label: 'Active Rooms in Use',
          value: minHeap.length,
          isFinal: false,
          details: `Room freed at t=${freedEndTime}; reused for meeting [${start}, ${end}]`
        }
      });
    }

    // Allocate room for current meeting
    minHeap.push(end);
    siftUp();
    maxRooms = Math.max(maxRooms, minHeap.length);

    steps.push({
      stepNumber: ++stepCount,
      description: `${reused ? 'Reassigned' : 'Allocated new'} room for meeting [${start}, ${end}]. Room will be occupied until t=${end}. Active rooms: ${minHeap.length}.`,
      cppLineNumber: 13,
      heap: [...minHeap],
      heapLabels: minHeap.map(t => `ends @ ${t}`),
      heapType: 'min',
      nodeStates: { 0: 'active' },
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: minHeap.map((_, idx) => idx),
      inspectorState: {
        type: 'pairs',
        pairs: {
          pairsInHeap: minHeap.map(t => ({ pair: [0, t], metric: t, label: `Room ends @ ${t}` })),
          resultPairs: [`Meeting [${start}, ${end}] scheduled`],
          details: `Active rooms in parallel: ${minHeap.length} (Max so far: ${maxRooms})`
        }
      },
      callStack: [`push(end: ${end})`],
      logEntry: `Allocated room: active count = ${minHeap.length}`,
      resultOutput: {
        label: 'Current Peak Rooms Needed',
        value: maxRooms,
        isFinal: false,
        details: `Meeting [${start}, ${end}] booked. Active rooms: ${minHeap.length} | Peak: ${maxRooms}`
      }
    });
  }

  // Final conclusion step
  steps.push({
    stepNumber: ++stepCount,
    description: `All meetings processed. Peak simultaneous meetings = ${maxRooms}. Minimum conference rooms required = ${maxRooms}.`,
    cppLineNumber: 15,
    heap: [...minHeap],
    heapLabels: minHeap.map(t => `ends @ ${t}`),
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: minHeap.map((_, idx) => idx),
    inspectorState: {
      type: 'pairs',
      pairs: {
        pairsInHeap: minHeap.map(t => ({ pair: [0, t], metric: t })),
        resultPairs: [`Final answer: ${maxRooms} rooms`],
        details: `Peak conference rooms needed: ${maxRooms}`
      }
    },
    callStack: [`return ${maxRooms}`],
    logEntry: `Minimum rooms = ${maxRooms}`,
    resultOutput: {
      label: 'Minimum Conference Rooms Required',
      value: maxRooms,
      isFinal: true,
      details: `Successfully scheduled all meetings with minimum ${maxRooms} rooms using Min-Heap.`
    }
  });

  return steps;
}

// 17. LC #378: Kth Smallest Element in a Sorted Matrix
export function simulateKthSmallestMatrix(
  matrix: number[][],
  k: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let stepCount = 0;
  const n = matrix.length;

  interface MatrixCell {
    val: number;
    r: number;
    c: number;
  }

  let heap: MatrixCell[] = [];

  const getHeapValues = () => heap.map(cell => cell.val);
  const getHeapLabels = () => heap.map(cell => `(${cell.r},${cell.c})`);

  const siftUp = () => {
    let curr = heap.length - 1;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (heap[curr].val < heap[parent].val) {
        const temp = heap[curr];
        heap[curr] = heap[parent];
        heap[parent] = temp;
        curr = parent;
      } else break;
    }
  };

  const siftDown = () => {
    let curr = 0;
    while (curr * 2 + 1 < heap.length) {
      let smallest = curr;
      const left = curr * 2 + 1;
      const right = curr * 2 + 2;
      if (left < heap.length && heap[left].val < heap[smallest].val) smallest = left;
      if (right < heap.length && heap[right].val < heap[smallest].val) smallest = right;
      if (smallest !== curr) {
        const temp = heap[curr];
        heap[curr] = heap[smallest];
        heap[smallest] = temp;
        curr = smallest;
      } else break;
    }
  };

  // Step 1: Initial state
  steps.push({
    stepNumber: ++stepCount,
    description: `Initialize Min-Heap for ${n}x${n} sorted matrix to find K=${k}-th smallest element.`,
    cppLineNumber: 2,
    heap: [],
    heapLabels: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        currentTop: '—',
        incomingVal: '—',
        comparisonResult: 'Starting matrix search',
        currentHeapCount: 0
      }
    },
    callStack: [`kthSmallest(k=${k})`],
    logEntry: `Searching Kth smallest in ${n}x${n} matrix`,
    resultOutput: {
      label: 'Kth Smallest Element',
      value: 'Pending...',
      isFinal: false,
      details: `Initialized search for K=${k} in sorted matrix.`
    }
  });

  // Step 2: Push first column of each row
  const rowsToPush = Math.min(n, k);
  for (let r = 0; r < rowsToPush; r++) {
    heap.push({ val: matrix[r][0], r, c: 0 });
    siftUp();

    steps.push({
      stepNumber: ++stepCount,
      description: `Pushed first element of row ${r}: matrix[${r}][0]=${matrix[r][0]} into Min-Heap.`,
      cppLineNumber: 8,
      heap: getHeapValues(),
      heapLabels: getHeapLabels(),
      heapType: 'min',
      nodeStates: { 0: 'active' },
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: heap.map((_, idx) => idx),
      inspectorState: {
        type: 'topk',
        topK: {
          k,
          currentTop: heap[0]?.val ?? '—',
          incomingVal: matrix[r][0],
          comparisonResult: `Seeded row ${r}`,
          currentHeapCount: heap.length
        }
      },
      callStack: [`push({${matrix[r][0]}, ${r}, 0})`],
      logEntry: `Seeded matrix[${r}][0]=${matrix[r][0]}`,
      resultOutput: {
        label: 'Current Min in Heap',
        value: heap[0]?.val,
        isFinal: false,
        details: `Seeding initial row elements (${r + 1}/${rowsToPush})`
      }
    });
  }

  // Step 3: Pop K times
  let kthVal = 0;
  const extractedOrder: number[] = [];

  for (let count = 1; count <= k; count++) {
    const top = heap[0];
    kthVal = top.val;
    extractedOrder.push(kthVal);

    // Pop root
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown();
    }

    steps.push({
      stepNumber: ++stepCount,
      description: `Extracted #${count} smallest element: matrix[${top.r}][${top.c}] = ${top.val}.`,
      cppLineNumber: 13,
      heap: getHeapValues(),
      heapLabels: getHeapLabels(),
      heapType: 'min',
      nodeStates: { 0: 'satisfied' },
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: heap.map((_, idx) => idx),
      inspectorState: {
        type: 'topk',
        topK: {
          k,
          currentTop: kthVal,
          incomingVal: top.val,
          comparisonResult: count === k ? `Target Kth reached: ${kthVal}` : `Extracted #${count}`,
          currentHeapCount: heap.length
        }
      },
      callStack: [`pop() -> ${kthVal}`],
      logEntry: `Extracted #${count}: ${kthVal}`,
      resultOutput: {
        label: count === k ? 'Target Kth Smallest Element' : `Current #${count} Smallest`,
        value: kthVal,
        isFinal: count === k,
        details: `Extracted order so far: [${extractedOrder.join(', ')}]`
      }
    });

    if (count === k) break;

    // Push next column element from same row
    if (top.c + 1 < n) {
      const nextCell = { val: matrix[top.r][top.c + 1], r: top.r, c: top.c + 1 };
      heap.push(nextCell);
      siftUp();

      steps.push({
        stepNumber: ++stepCount,
        description: `Pushed next cell in row ${top.r}: matrix[${top.r}][${top.c + 1}] = ${nextCell.val}.`,
        cppLineNumber: 17,
        heap: getHeapValues(),
        heapLabels: getHeapLabels(),
        heapType: 'min',
        nodeStates: { 0: 'active' },
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: heap.map((_, idx) => idx),
        inspectorState: {
          type: 'topk',
          topK: {
            k,
            currentTop: heap[0]?.val ?? '—',
            incomingVal: nextCell.val,
            comparisonResult: `Pushed col ${top.c + 1}`,
            currentHeapCount: heap.length
          }
        },
        callStack: [`push({${nextCell.val}, ${top.r}, ${top.c + 1}})`],
        logEntry: `Pushed col neighbor ${nextCell.val}`,
        resultOutput: {
          label: `Extracted ${count} of K=${k}`,
          value: kthVal,
          isFinal: false,
          details: `Pushed neighbor matrix[${top.r}][${top.c + 1}] = ${nextCell.val}`
        }
      });
    }
  }

  // Final step
  steps.push({
    stepNumber: ++stepCount,
    description: `Successfully determined K=${k}-th smallest element: ${kthVal}.`,
    cppLineNumber: 20,
    heap: getHeapValues(),
    heapLabels: getHeapLabels(),
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: heap.map((_, idx) => idx),
    inspectorState: {
      type: 'topk',
      topK: {
        k,
        currentTop: kthVal,
        incomingVal: '—',
        comparisonResult: 'Completed',
        currentHeapCount: heap.length
      }
    },
    callStack: [`return ${kthVal}`],
    logEntry: `Kth smallest = ${kthVal}`,
    resultOutput: {
      label: 'Kth Smallest Element in Matrix',
      value: kthVal,
      isFinal: true,
      details: `Found K=${k}-th smallest element: ${kthVal} in O(K log N) time.`
    }
  });

  return steps;
}

// 18. LC #1642: Furthest Building You Can Reach (Min-Heap on Climbs)
export function simulateFurthestBuilding(
  heights: number[],
  initialBricks: number,
  initialLadders: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let stepCount = 0;

  let bricks = initialBricks;
  const ladders = initialLadders;
  let minHeap: number[] = [];

  const siftUp = () => {
    let curr = minHeap.length - 1;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (minHeap[curr] < minHeap[parent]) {
        const temp = minHeap[curr];
        minHeap[curr] = minHeap[parent];
        minHeap[parent] = temp;
        curr = parent;
      } else break;
    }
  };

  const siftDown = () => {
    let curr = 0;
    while (curr * 2 + 1 < minHeap.length) {
      let smallest = curr;
      const left = curr * 2 + 1;
      const right = curr * 2 + 2;
      if (left < minHeap.length && minHeap[left] < minHeap[smallest]) smallest = left;
      if (right < minHeap.length && minHeap[right] < minHeap[smallest]) smallest = right;
      if (smallest !== curr) {
        const temp = minHeap[curr];
        minHeap[curr] = minHeap[smallest];
        minHeap[smallest] = temp;
        curr = smallest;
      } else break;
    }
  };

  // Step 1: Initial state
  steps.push({
    stepNumber: ++stepCount,
    description: `Start at building 0. Heights: [${heights.join(', ')}]. Inventory: ${bricks} bricks, ${ladders} ladders.`,
    cppLineNumber: 2,
    heap: [],
    heapLabels: [],
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: [],
    inspectorState: {
      type: 'greedy',
      greedy: {
        totalCost: bricks,
        lastMergedPair: [0, heights[0]]
      }
    },
    callStack: ['furthestBuilding()'],
    logEntry: `Starting with ${bricks} bricks, ${ladders} ladders`,
    resultOutput: {
      label: 'Furthest Building Index Reached',
      value: 0,
      isFinal: false,
      details: `Starting at building 0. Remaining Bricks: ${bricks} | Ladders: ${ladders}`
    }
  });

  let furthest = 0;

  for (let i = 0; i < heights.length - 1; i++) {
    const climb = heights[i + 1] - heights[i];

    if (climb <= 0) {
      furthest = i + 1;
      steps.push({
        stepNumber: ++stepCount,
        description: `Building ${i} -> ${i + 1}: Downhill/flat jump (${heights[i]} -> ${heights[i + 1]}). No bricks or ladders needed!`,
        cppLineNumber: 7,
        heap: [...minHeap],
        heapLabels: minHeap.map(c => `climb +${c}`),
        heapType: 'min',
        nodeStates: {},
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: minHeap.map((_, idx) => idx),
        inspectorState: {
          type: 'greedy',
          greedy: {
            totalCost: bricks,
            lastMergedPair: [heights[i], heights[i + 1]]
          }
        },
        callStack: [`jump(${i} -> ${i + 1})`],
        logEntry: `Free jump to building ${i + 1}`,
        resultOutput: {
          label: 'Furthest Building Index',
          value: furthest,
          isFinal: false,
          details: `Free jump down to building ${i + 1} (${heights[i + 1]}m). Bricks: ${bricks}`
        }
      });
      continue;
    }

    // Climb required: push into ladder min-heap
    minHeap.push(climb);
    siftUp();

    steps.push({
      stepNumber: ++stepCount,
      description: `Building ${i} -> ${i + 1}: Uphill climb of +${climb}m (${heights[i]}m -> ${heights[i + 1]}m). Tentatively allocated ladder.`,
      cppLineNumber: 8,
      heap: [...minHeap],
      heapLabels: minHeap.map(c => `climb +${c}`),
      heapType: 'min',
      nodeStates: { 0: 'active' },
      comparingIndices: [],
      swappingIndices: [],
      satisfiedIndices: minHeap.map((_, idx) => idx),
      inspectorState: {
        type: 'greedy',
        greedy: {
          totalCost: bricks,
          lastMergedPair: [heights[i], heights[i + 1]]
        }
      },
      callStack: [`climb(+${climb}m)`],
      logEntry: `Climb +${climb}m: ladder heap size = ${minHeap.length}`,
      resultOutput: {
        label: 'Climb Allocated to Ladder',
        value: `+${climb}m`,
        isFinal: false,
        details: `Ladders tracked in heap: ${minHeap.length}/${ladders}`
      }
    });

    // If climbs exceed ladders, pay smallest climb with bricks
    if (minHeap.length > ladders) {
      const smallestClimb = minHeap[0];
      const last = minHeap.pop()!;
      if (minHeap.length > 0) {
        minHeap[0] = last;
        siftDown();
      }

      bricks -= smallestClimb;

      if (bricks < 0) {
        steps.push({
          stepNumber: ++stepCount,
          description: `Cannot reach building ${i + 1}! Required ${smallestClimb} bricks for smallest climb, but only had ${bricks + smallestClimb} remaining. Furthest reachable building is ${i}.`,
          cppLineNumber: 13,
          heap: [...minHeap],
          heapLabels: minHeap.map(c => `climb +${c}`),
          heapType: 'min',
          nodeStates: {},
          comparingIndices: [],
          swappingIndices: [],
          satisfiedIndices: minHeap.map((_, idx) => idx),
          inspectorState: {
            type: 'greedy',
            greedy: {
              totalCost: 0,
              lastMergedPair: [heights[i], heights[i + 1]]
            }
          },
          callStack: [`insufficient bricks -> return ${i}`],
          logEntry: `Bricks exhausted at building ${i}`,
          resultOutput: {
            label: 'Furthest Building Reached (Final)',
            value: i,
            isFinal: true,
            details: `Out of bricks and ladders. Furthest reachable building index is ${i}.`
          }
        });
        return steps;
      }

      steps.push({
        stepNumber: ++stepCount,
        description: `Exceeded ${ladders} ladders. Paid smallest climb (+${smallestClimb}m) using bricks. Remaining bricks: ${bricks}.`,
        cppLineNumber: 12,
        heap: [...minHeap],
        heapLabels: minHeap.map(c => `climb +${c}`),
        heapType: 'min',
        nodeStates: { 0: 'satisfied' },
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: minHeap.map((_, idx) => idx),
        inspectorState: {
          type: 'greedy',
          greedy: {
            totalCost: bricks,
            lastMergedPair: [heights[i], heights[i + 1]]
          }
        },
        callStack: [`payBricks(${smallestClimb})`],
        logEntry: `Paid ${smallestClimb} bricks; remaining: ${bricks}`,
        resultOutput: {
          label: 'Paid Smallest Climb with Bricks',
          value: `-${smallestClimb} bricks`,
          isFinal: false,
          details: `Remaining Bricks: ${bricks} | Ladder Climbs: [${minHeap.join(', ')}]`
        }
      });
    }

    furthest = i + 1;
  }

  // Reached last building
  steps.push({
    stepNumber: ++stepCount,
    description: `Successfully reached the final building ${heights.length - 1}! Remaining bricks: ${bricks}.`,
    cppLineNumber: 16,
    heap: [...minHeap],
    heapLabels: minHeap.map(c => `climb +${c}`),
    heapType: 'min',
    nodeStates: {},
    comparingIndices: [],
    swappingIndices: [],
    satisfiedIndices: minHeap.map((_, idx) => idx),
    inspectorState: {
      type: 'greedy',
      greedy: {
        totalCost: bricks,
        lastMergedPair: undefined
      }
    },
    callStack: [`return ${heights.length - 1}`],
    logEntry: `Reached end of building strip at index ${heights.length - 1}`,
    resultOutput: {
      label: 'Furthest Building Index Reached',
      value: heights.length - 1,
      isFinal: true,
      details: `Reached final building ${heights.length - 1} with ${bricks} bricks remaining.`
    }
  });

  return steps;
}

