/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SimulationStep,
  SingleNumberState,
  HammingWeightState,
  PowerOfTwoState,
  Interval,
  MergeIntervalsState,
  InsertIntervalState,
  EraseOverlapState,
  MeetingRoomsState,
  MeetingRoomsIIState
} from './types';

// Helper to convert to binary string representation
export function toBinaryString(val: number, bits: number = 8): string {
  const positiveVal = val >>> 0;
  return positiveVal.toString(2).padStart(bits, '0');
}

/**
 * TRACK A: Bit Manipulation
 */

// 1. Single Number Step Generator
export function generateSingleNumberSteps(nums: number[]): SimulationStep<SingleNumberState>[] {
  const steps: SimulationStep<SingleNumberState>[] = [];

  // Step 0: Start
  steps.push({
    line: 1,
    description: 'Enter singleNumber function. We are given an array of elements where every element appears twice except for one.',
    variables: { nums: [...nums], xor_sum: null, num: null },
    dataState: {
      nums: [...nums],
      currentIndex: -1,
      accumulator: 0,
      completedIndices: []
    }
  });

  // Step 1: Initialize xor_sum
  let currentXor = 0;
  steps.push({
    line: 2,
    description: 'Initialize the XOR accumulator `xor_sum = 0`. Recall that any number XORed with 0 remains unchanged (X ^ 0 = X).',
    variables: { nums: [...nums], xor_sum: 0, num: null },
    dataState: {
      nums: [...nums],
      currentIndex: -1,
      accumulator: 0,
      completedIndices: []
    }
  });

  const completed: number[] = [];
  // Loop through numbers
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Substep A: Loop Iteration start
    steps.push({
      line: 3,
      description: `Iterating loop: Read current element at index ${i}, which is num = ${num} (binary: ${toBinaryString(num)}).`,
      variables: { nums: [...nums], xor_sum: currentXor, num: num, i },
      dataState: {
        nums: [...nums],
        currentIndex: i,
        accumulator: currentXor,
        completedIndices: [...completed]
      }
    });

    const previousXor = currentXor;
    currentXor ^= num;
    completed.push(i);

    // Substep B: Execute XOR Sum
    steps.push({
      line: 4,
      description: `Perform XOR operation: xor_sum = xor_sum ^ num. We compute ${previousXor} ^ ${num} = ${currentXor}. In binary: ${toBinaryString(previousXor)} ^ ${toBinaryString(num)} = ${toBinaryString(currentXor)}. Notice how duplicate bits cancel each other out!`,
      variables: { nums: [...nums], xor_sum: currentXor, num: num, i },
      dataState: {
        nums: [...nums],
        currentIndex: i,
        accumulator: currentXor,
        completedIndices: [...completed]
      }
    });
  }

  // Final Step: Return
  steps.push({
    line: 6,
    description: `All elements processed. The remaining value in xor_sum is ${currentXor}. All duplicate elements canceled each other out to 0 (A ^ A = 0), leaving only the unique element!`,
    variables: { nums: [...nums], xor_sum: currentXor, num: null },
    dataState: {
      nums: [...nums],
      currentIndex: -1,
      accumulator: currentXor,
      completedIndices: [...completed]
    }
  });

  return steps;
}

// 2. Hamming Weight Step Generator
export function generateHammingWeightSteps(n: number): SimulationStep<HammingWeightState>[] {
  const steps: SimulationStep<HammingWeightState>[] = [];
  const originalN = n;

  // Step 0: Start
  steps.push({
    line: 1,
    description: `Enter hammingWeight function with n = ${n} (binary: ${toBinaryString(n, 16)}). We want to count the number of set bits (1s).`,
    variables: { n, count: null },
    dataState: {
      n,
      originalN,
      count: 0,
      binaryRepresentation: toBinaryString(n, 32),
      operationType: 'start'
    }
  });

  // Step 1: Initialize count
  let count = 0;
  steps.push({
    line: 2,
    description: 'Initialize set bit counter `count = 0`. This variable tracks the number of times we clear the lowest set bit.',
    variables: { n, count: 0 },
    dataState: {
      n,
      originalN,
      count: 0,
      binaryRepresentation: toBinaryString(n, 32),
      operationType: 'start'
    }
  });

  let currentN = n;

  // While loop
  while (currentN > 0) {
    // Step: Check while condition
    steps.push({
      line: 3,
      description: `Evaluate condition: Is n > 0? Current n is ${currentN} (${currentN > 0 ? 'True' : 'False'}). Let's process the next set bit.`,
      variables: { n: currentN, count },
      dataState: {
        n: currentN,
        originalN,
        count,
        binaryRepresentation: toBinaryString(currentN, 32),
        operationType: 'check'
      }
    });

    const previousN = currentN;
    const nMinusOne = currentN - 1;
    currentN = currentN & nMinusOne;

    // Step: Clear lowest set bit
    steps.push({
      line: 4,
      description: `Execute Brian Kernighan's bit-clearing step: n = n & (n - 1). Computing ${previousN} & ${nMinusOne}. In binary: ${toBinaryString(previousN, 16)} & ${toBinaryString(nMinusOne, 16)} = ${toBinaryString(currentN, 16)}. This operation guaranteed-clears the lowest set bit!`,
      variables: { n: currentN, count, 'n - 1': nMinusOne },
      dataState: {
        n: currentN,
        originalN,
        count,
        binaryRepresentation: toBinaryString(currentN, 32),
        maskRepresentation: toBinaryString(nMinusOne, 32),
        operationType: 'apply'
      }
    });

    count++;

    // Step: Increment count
    steps.push({
      line: 5,
      description: `Increment set bit counter: count = count + 1. Total set bits found so far: ${count}.`,
      variables: { n: currentN, count },
      dataState: {
        n: currentN,
        originalN,
        count,
        binaryRepresentation: toBinaryString(currentN, 32),
        operationType: 'increment'
      }
    });
  }

  // Exit loop check
  steps.push({
    line: 3,
    description: `Evaluate condition: Is n > 0? Current n is ${currentN}. Loop condition is False. We exit the while loop.`,
    variables: { n: currentN, count },
    dataState: {
      n: currentN,
      originalN,
      count,
      binaryRepresentation: toBinaryString(currentN, 32),
      operationType: 'check'
    }
  });

  // Return count
  steps.push({
    line: 7,
    description: `Return final count: ${count}. There are exactly ${count} set bits in the binary representation of ${originalN}.`,
    variables: { n: currentN, count },
    dataState: {
      n: currentN,
      originalN,
      count,
      binaryRepresentation: toBinaryString(currentN, 32),
      operationType: 'done'
    }
  });

  return steps;
}

// 3. Power of Two Step Generator
export function generatePowerOfTwoSteps(n: number): SimulationStep<PowerOfTwoState>[] {
  const steps: SimulationStep<PowerOfTwoState>[] = [];
  const originalN = n;

  // Step 0: Start
  steps.push({
    line: 1,
    description: `Enter isPowerOfTwo function with n = ${n}. A number is a power of two if it has exactly one set bit in binary representation (e.g. 1, 2, 4, 8, 16).`,
    variables: { n, result: null },
    dataState: {
      n,
      originalN,
      isPowerOfTwo: false,
      nBinary: toBinaryString(n, 16),
      nMinusOneBinary: toBinaryString(Math.max(0, n - 1), 16),
      andResultBinary: '',
      operationType: 'start'
    }
  });

  // Step 1: Check n <= 0
  steps.push({
    line: 2,
    description: `Check guard condition: Is n <= 0? Current n is ${n}. (${n <= 0 ? 'True' : 'False'}). Powers of two must be strictly positive.`,
    variables: { n },
    dataState: {
      n,
      originalN,
      isPowerOfTwo: false,
      nBinary: toBinaryString(n, 16),
      nMinusOneBinary: toBinaryString(Math.max(0, n - 1), 16),
      andResultBinary: '',
      operationType: 'check-zero'
    }
  });

  if (n <= 0) {
    steps.push({
      line: 3,
      description: 'Since n <= 0, it cannot be a power of two. Return false.',
      variables: { n, result: false },
      dataState: {
        n,
        originalN,
        isPowerOfTwo: false,
        nBinary: toBinaryString(n, 16),
        nMinusOneBinary: 'N/A',
        andResultBinary: 'N/A',
        operationType: 'done'
      }
    });
    return steps;
  }

  // Step 2: Compute and return (n & (n - 1)) == 0
  const nMinusOne = n - 1;
  const andVal = n & nMinusOne;
  const isPower = andVal === 0;

  steps.push({
    line: 5,
    description: `Compute bitwise AND of n and n - 1: n & (n - 1). We check if ${n} & ${nMinusOne} equals 0.
    In binary:
    n     : ${toBinaryString(n, 8)} (${n})
    n - 1 : ${toBinaryString(nMinusOne, 8)} (${nMinusOne})
    ----------------------------
    AND   : ${toBinaryString(andVal, 8)} (${andVal})
    Since the result is ${andVal} (${isPower ? 'which is EQUAL to 0' : 'which is NOT equal to 0'}), ${n} ${isPower ? 'IS' : 'IS NOT'} a power of two!`,
    variables: { n, 'n - 1': nMinusOne, 'n & (n - 1)': andVal, result: isPower },
    dataState: {
      n,
      originalN,
      isPowerOfTwo: isPower,
      nBinary: toBinaryString(n, 16),
      nMinusOneBinary: toBinaryString(nMinusOne, 16),
      andResultBinary: toBinaryString(andVal, 16),
      operationType: 'and-operation'
    }
  });

  return steps;
}


/**
 * TRACK B: Interval Algorithms
 */

// Helper to sort intervals
function sortIntervals(intervals: Interval[]): Interval[] {
  return [...intervals].sort((a, b) => a.start - b.start);
}

// 1. Merge Intervals Step Generator
export function generateMergeIntervalsSteps(intervals: Interval[]): SimulationStep<MergeIntervalsState>[] {
  const steps: SimulationStep<MergeIntervalsState>[] = [];
  const orig = [...intervals];

  // Step 0: Start function
  steps.push({
    line: 1,
    description: 'Enter merge function. Our goal is to merge all overlapping intervals.',
    variables: { intervals: orig, merged: null },
    dataState: {
      originalIntervals: orig,
      intervals: orig,
      currentIndex: -1,
      stack: [],
      comparing: false,
      overlapping: false
    }
  });

  // Step 1: Check empty
  steps.push({
    line: 2,
    description: 'Check if intervals list is empty. If it is, return empty array immediately.',
    variables: { intervals: orig },
    dataState: {
      originalIntervals: orig,
      intervals: orig,
      currentIndex: -1,
      stack: [],
      comparing: false,
      overlapping: false
    }
  });

  if (orig.length === 0) {
    return steps;
  }

  // Step 2: Sort
  const sorted = sortIntervals(orig).map((interval, idx) => ({
    ...interval,
    color: `hsl(${(idx * 60) % 360}, 75%, 45%)` // Beautiful dynamic colors
  }));

  steps.push({
    line: 3,
    description: 'Sort intervals by their start times. This grouping ensures that overlapping intervals are adjacent to each other.',
    variables: { intervals: sorted },
    dataState: {
      originalIntervals: orig,
      intervals: sorted,
      currentIndex: -1,
      stack: [],
      comparing: false,
      overlapping: false
    }
  });

  // Step 3: Initialize merged
  const merged: Interval[] = [];
  steps.push({
    line: 4,
    description: 'Initialize an empty container `merged` to store our merged intervals.',
    variables: { intervals: sorted, merged: [] },
    dataState: {
      originalIntervals: orig,
      intervals: sorted,
      currentIndex: -1,
      stack: [],
      comparing: false,
      overlapping: false
    }
  });

  // Step 4: Push first element
  const first = { ...sorted[0] };
  merged.push(first);
  steps.push({
    line: 5,
    description: `Push the first sorted interval [${first.start}, ${first.end}] into \`merged\`. This serves as our starting baseline for comparisons.`,
    variables: { intervals: sorted, merged: [{ start: first.start, end: first.end }] },
    dataState: {
      originalIntervals: orig,
      intervals: sorted,
      currentIndex: 0,
      stack: [{ ...first }],
      comparing: false,
      overlapping: false
    }
  });

  // Step 5: Loop through rest
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];

    // Substep: Loop header
    steps.push({
      line: 6,
      description: `Loop iteration i = ${i}: Examining next interval [${current.start}, ${current.end}].`,
      variables: { intervals: sorted, i, current: [current.start, current.end], last: [merged[merged.length - 1].start, merged[merged.length - 1].end] },
      dataState: {
        originalIntervals: orig,
        intervals: sorted,
        currentIndex: i,
        stack: merged.map(item => ({ ...item })),
        comparing: true,
        overlapping: false
      }
    });

    // Substep: last = merged.back()
    const lastIdx = merged.length - 1;
    const last = merged[lastIdx];

    steps.push({
      line: 7,
      description: `Retrieve the last interval in our merged list: last = [${last.start}, ${last.end}].`,
      variables: { intervals: sorted, i, last: [last.start, last.end], current: [current.start, current.end] },
      dataState: {
        originalIntervals: orig,
        intervals: sorted,
        currentIndex: i,
        stack: merged.map(item => ({ ...item })),
        comparing: true,
        overlapping: false
      }
    });

    // Substep: Check overlap condition
    const isOverlapping = current.start <= last.end;
    steps.push({
      line: 8,
      description: `Check if current interval [${current.start}, ${current.end}] overlaps with last merged [${last.start}, ${last.end}].
      Condition: current.start (${current.start}) <= last.end (${last.end})? -> ${isOverlapping ? 'YES, they overlap!' : 'NO, no overlap.'}`,
      variables: { intervals: sorted, i, last: [last.start, last.end], current: [current.start, current.end], isOverlapping },
      dataState: {
        originalIntervals: orig,
        intervals: sorted,
        currentIndex: i,
        stack: merged.map(item => ({ ...item })),
        comparing: true,
        overlapping: isOverlapping
      }
    });

    if (isOverlapping) {
      // Substep: Merge
      const previousEnd = last.end;
      last.end = Math.max(last.end, current.end);

      steps.push({
        line: 9,
        description: `Since they overlap, merge them by updating last's end to the maximum of both: last.end = max(${previousEnd}, ${current.end}) = ${last.end}. The interval is expanded to [${last.start}, ${last.end}].`,
        variables: { intervals: sorted, i, last: [last.start, last.end], current: [current.start, current.end] },
        dataState: {
          originalIntervals: orig,
          intervals: sorted,
          currentIndex: i,
          stack: merged.map(item => ({ ...item })),
          comparing: false,
          overlapping: true
        }
      });
    } else {
      // Substep: Push non-overlapping
      merged.push({ ...current });

      steps.push({
        line: 11,
        description: `Since they do not overlap, push the current interval [${current.start}, ${current.end}] directly to the merged result container as a new entry.`,
        variables: { intervals: sorted, i, merged_count: merged.length },
        dataState: {
          originalIntervals: orig,
          intervals: sorted,
          currentIndex: i,
          stack: merged.map(item => ({ ...item })),
          comparing: false,
          overlapping: false
        }
      });
    }
  }

  // Final Step: Return
  steps.push({
    line: 14,
    description: `All intervals processed successfully! Return the final merged intervals set containing ${merged.length} non-overlapping ranges.`,
    variables: { result: merged.map(item => [item.start, item.end]) },
    dataState: {
      originalIntervals: orig,
      intervals: sorted,
      currentIndex: -1,
      stack: merged.map(item => ({ ...item })),
      comparing: false,
      overlapping: false
    }
  });

  return steps;
}

// 2. Insert Interval Step Generator
export function generateInsertIntervalSteps(
  intervals: Interval[],
  newInterval: Interval
): SimulationStep<InsertIntervalState>[] {
  const steps: SimulationStep<InsertIntervalState>[] = [];
  const n = intervals.length;
  const activeNewInterval = { ...newInterval, color: '#4f46e5' }; // Indigo highlight for new

  // Step 0: Start
  steps.push({
    line: 1,
    description: `Enter insert function. We want to insert newInterval [${newInterval.start}, ${newInterval.end}] into the sorted list while keeping it sorted and merged.`,
    variables: { intervals, newInterval: [newInterval.start, newInterval.end] },
    dataState: {
      intervals,
      newInterval: activeNewInterval,
      currentIndex: -1,
      result: [],
      phase: 'left'
    }
  });

  // Step 1: Initialize results & index
  let i = 0;
  const result: Interval[] = [];

  steps.push({
    line: 2,
    description: 'Initialize empty vector `result` to store the output. Also track size parameter `n` of the array.',
    variables: { i, n, result: [] },
    dataState: {
      intervals,
      newInterval: activeNewInterval,
      currentIndex: -1,
      result: [],
      phase: 'left'
    }
  });

  // Left phase while loop check
  while (i < n && intervals[i].end < activeNewInterval.start) {
    const current = intervals[i];
    steps.push({
      line: 4,
      description: `Check if current interval [${current.start}, ${current.end}] is fully to the left of newInterval [${activeNewInterval.start}, ${activeNewInterval.end}].
      Condition: intervals[${i}].end (${current.end}) < newInterval.start (${activeNewInterval.start})? -> YES! No overlap possible.`,
      variables: { i, current: [current.start, current.end], newInterval: [activeNewInterval.start, activeNewInterval.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i,
        result: result.map(item => ({ ...item })),
        phase: 'left'
      }
    });

    result.push({ ...current });
    i++;

    steps.push({
      line: 5,
      description: `Push interval [${current.start}, ${current.end}] directly to result stack since it ends before the new interval. Increment i to ${i}.`,
      variables: { i, result: result.map(item => [item.start, item.end]) },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i - 1,
        result: result.map(item => ({ ...item })),
        phase: 'left'
      }
    });
  }

  // Check condition for index which failed left phase
  if (i < n) {
    const current = intervals[i];
    steps.push({
      line: 4,
      description: `Check if current interval [${current.start}, ${current.end}] is fully to the left of newInterval [${activeNewInterval.start}, ${activeNewInterval.end}].
      Condition: intervals[${i}].end (${current.end}) < newInterval.start (${activeNewInterval.start})? -> NO. We move to the merging phase.`,
      variables: { i, current: [current.start, current.end], newInterval: [activeNewInterval.start, activeNewInterval.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i,
        result: result.map(item => ({ ...item })),
        phase: 'left'
      }
    });
  }

  // Merging phase while loop
  while (i < n && intervals[i].start <= activeNewInterval.end) {
    const current = intervals[i];
    steps.push({
      line: 7,
      description: `Check if current interval [${current.start}, ${current.end}] overlaps with newInterval [${activeNewInterval.start}, ${activeNewInterval.end}].
      Condition: intervals[${i}].start (${current.start}) <= newInterval.end (${activeNewInterval.end})? -> YES! Overlap detected. We must merge them.`,
      variables: { i, current: [current.start, current.end], newInterval: [activeNewInterval.start, activeNewInterval.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i,
        result: result.map(item => ({ ...item })),
        phase: 'merge',
        tempNewInterval: { ...activeNewInterval }
      }
    });

    const oldStart = activeNewInterval.start;
    const oldEnd = activeNewInterval.end;
    activeNewInterval.start = Math.min(activeNewInterval.start, current.start);
    activeNewInterval.end = Math.max(activeNewInterval.end, current.end);

    steps.push({
      line: 8,
      description: `Update newInterval start to the minimum: min(newInterval.start, intervals[i].start) = min(${oldStart}, ${current.start}) = ${activeNewInterval.start}.`,
      variables: { i, current: [current.start, current.end], newInterval: [activeNewInterval.start, activeNewInterval.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i,
        result: result.map(item => ({ ...item })),
        phase: 'merge',
        tempNewInterval: { ...activeNewInterval }
      }
    });

    steps.push({
      line: 9,
      description: `Update newInterval end to the maximum: max(newInterval.end, intervals[i].end) = max(${oldEnd}, ${current.end}) = ${activeNewInterval.end}.`,
      variables: { i, current: [current.start, current.end], newInterval: [activeNewInterval.start, activeNewInterval.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i,
        result: result.map(item => ({ ...item })),
        phase: 'merge',
        tempNewInterval: { ...activeNewInterval }
      }
    });

    i++;

    steps.push({
      line: 10,
      description: `Increment i to ${i} to advance to the next interval.`,
      variables: { i, newInterval: [activeNewInterval.start, activeNewInterval.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i - 1,
        result: result.map(item => ({ ...item })),
        phase: 'merge',
        tempNewInterval: { ...activeNewInterval }
      }
    });
  }

  // Check loop condition that failed merging phase
  if (i < n) {
    const current = intervals[i];
    steps.push({
      line: 7,
      description: `Check if current interval [${current.start}, ${current.end}] overlaps with newInterval [${activeNewInterval.start}, ${activeNewInterval.end}].
      Condition: intervals[${i}].start (${current.start}) <= newInterval.end (${activeNewInterval.end})? -> NO. No more overlapping intervals.`,
      variables: { i, current: [current.start, current.end], newInterval: [activeNewInterval.start, activeNewInterval.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i,
        result: result.map(item => ({ ...item })),
        phase: 'merge'
      }
    });
  }

  // Step 11: Push newInterval
  result.push({ ...activeNewInterval });
  steps.push({
    line: 11,
    description: `All overlapping parts have been merged. Push the final expanded newInterval [${activeNewInterval.start}, ${activeNewInterval.end}] onto the result vector.`,
    variables: { result: result.map(item => [item.start, item.end]) },
    dataState: {
      intervals,
      newInterval: { ...activeNewInterval },
      currentIndex: -1,
      result: result.map(item => ({ ...item })),
      phase: 'right'
    }
  });

  // Right phase while loop
  while (i < n) {
    const current = intervals[i];
    steps.push({
      line: 12,
      description: `Loop through remaining intervals to the right: i = ${i}. Since they are already sorted and start after our merged interval, no comparison is needed.`,
      variables: { i, current: [current.start, current.end] },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i,
        result: result.map(item => ({ ...item })),
        phase: 'right'
      }
    });

    result.push({ ...current });
    i++;

    steps.push({
      line: 13,
      description: `Push interval [${current.start}, ${current.end}] directly to the result. Increment i to ${i}.`,
      variables: { i, result: result.map(item => [item.start, item.end]) },
      dataState: {
        intervals,
        newInterval: { ...activeNewInterval },
        currentIndex: i - 1,
        result: result.map(item => ({ ...item })),
        phase: 'right'
      }
    });
  }

  // Final Step: Return
  steps.push({
    line: 15,
    description: `Return the fully inserted and merged intervals list. It contains ${result.length} sorted, non-overlapping intervals.`,
    variables: { result: result.map(item => [item.start, item.end]) },
    dataState: {
      intervals,
      newInterval: { ...activeNewInterval },
      currentIndex: -1,
      result: result.map(item => ({ ...item })),
      phase: 'done'
    }
  });

  return steps;
}

// 3. Erase Overlap Intervals Step Generator (Greedy Scheduling)
export function generateEraseOverlapSteps(intervals: Interval[]): SimulationStep<EraseOverlapState>[] {
  const steps: SimulationStep<EraseOverlapState>[] = [];
  const orig = [...intervals];

  // Step 0: Start
  steps.push({
    line: 1,
    description: 'Enter eraseOverlapIntervals function. We want to find the minimum number of intervals to remove to make the rest non-overlapping. This is equivalent to finding the maximum number of non-overlapping intervals (Interval Scheduling Problem).',
    variables: { intervals: orig, count: null },
    dataState: {
      intervals: orig,
      currentIndex: -1,
      prevEnd: null,
      removedIndices: [],
      selectedIndices: [],
      count: 0
    }
  });

  // Step 1: Check empty
  steps.push({
    line: 2,
    description: 'Check if intervals vector is empty. If so, return 0.',
    variables: { intervals: orig },
    dataState: {
      intervals: orig,
      currentIndex: -1,
      prevEnd: null,
      removedIndices: [],
      selectedIndices: [],
      count: 0
    }
  });

  if (orig.length === 0) {
    return steps;
  }

  // Step 2: Sort by end point!
  const sorted = [...orig].sort((a, b) => a.end - b.end).map((item, idx) => ({
    ...item,
    id: idx + 1 // assign standard ID for sorting visualization
  }));

  steps.push({
    line: 3,
    description: 'Greedy approach: Sort intervals by their END times. By picking the interval that ends earliest, we maximize the space left for subsequent intervals!',
    variables: { intervals: sorted.map(item => [item.start, item.end]) },
    dataState: {
      intervals: sorted,
      currentIndex: -1,
      prevEnd: null,
      removedIndices: [],
      selectedIndices: [],
      count: 0
    }
  });

  // Step 3: Initialize variables
  let count = 0;
  steps.push({
    line: 6,
    description: 'Initialize removal counter `count = 0`.',
    variables: { intervals: sorted, count: 0 },
    dataState: {
      intervals: sorted,
      currentIndex: -1,
      prevEnd: null,
      removedIndices: [],
      selectedIndices: [],
      count: 0
    }
  });

  // Step 4: Set prev_end to first interval's end point
  const first = sorted[0];
  let prevEnd = first.end;
  const selected: number[] = [0];
  const removed: number[] = [];

  steps.push({
    line: 7,
    description: `Set pointer \`prev_end = intervals[0].end\` to ${prevEnd}. We greedily select the first sorted interval [${first.start}, ${first.end}] as it finishes earliest.`,
    variables: { prev_end: prevEnd },
    dataState: {
      intervals: sorted,
      currentIndex: 0,
      prevEnd: prevEnd,
      removedIndices: [],
      selectedIndices: [0],
      count: 0
    }
  });

  // Loop through rest of intervals
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];

    // Loop check
    steps.push({
      line: 8,
      description: `Loop iteration i = ${i}: Examining interval [${current.start}, ${current.end}] against our boundary prev_end = ${prevEnd}.`,
      variables: { i, current: [current.start, current.end], prev_end: prevEnd, count },
      dataState: {
        intervals: sorted,
        currentIndex: i,
        prevEnd: prevEnd,
        removedIndices: [...removed],
        selectedIndices: [...selected],
        count
      }
    });

    // Overlap comparison
    const isOverlapping = current.start < prevEnd;
    steps.push({
      line: 9,
      description: `Check if current interval [${current.start}, ${current.end}] starts before the previous selection ends.
      Condition: current.start (${current.start}) < prev_end (${prevEnd})? -> ${isOverlapping ? 'YES! There is an overlap.' : 'NO! No overlap.'}`,
      variables: { i, current: [current.start, current.end], prev_end: prevEnd, isOverlapping },
      dataState: {
        intervals: sorted,
        currentIndex: i,
        prevEnd: prevEnd,
        removedIndices: [...removed],
        selectedIndices: [...selected],
        count
      }
    });

    if (isOverlapping) {
      count++;
      removed.push(i);

      steps.push({
        line: 10,
        description: `Since there is an overlap, we must REMOVE this interval to avoid conflict. We keep the previous interval since it ended earlier, leaving more room. Increment count to ${count}.`,
        variables: { count },
        dataState: {
          intervals: sorted,
          currentIndex: i,
          prevEnd: prevEnd,
          removedIndices: [...removed],
          selectedIndices: [...selected],
          count
        }
      });
    } else {
      prevEnd = current.end;
      selected.push(i);

      steps.push({
        line: 12,
        description: `No overlap! We accept this interval and update our boundary: prev_end = ${prevEnd}.`,
        variables: { prev_end: prevEnd },
        dataState: {
          intervals: sorted,
          currentIndex: i,
          prevEnd: prevEnd,
          removedIndices: [...removed],
          selectedIndices: [...selected],
          count
        }
      });
    }
  }

  // Final Return
  steps.push({
    line: 15,
    description: `All intervals processed. Return final removal count: ${count}. We removed exactly ${count} overlapping range(s) to leave a set of non-overlapping intervals!`,
    variables: { result: count },
    dataState: {
      intervals: sorted,
      currentIndex: -1,
      prevEnd: prevEnd,
      removedIndices: [...removed],
      selectedIndices: [...selected],
      count
    }
  });

  return steps;
}

// 4. Meeting Rooms Step Generator
export function generateMeetingRoomsSteps(orig: Interval[]): SimulationStep<MeetingRoomsState>[] {
  const steps: SimulationStep<MeetingRoomsState>[] = [];

  // Step 1: Enter function
  steps.push({
    line: 1,
    description: 'Enter canAttendMeetings. We want to determine if a single person can attend all meetings (i.e. no two meetings overlap).',
    variables: { intervals: orig.map(it => [it.start, it.end]), hasConflict: false, conflictPairs: [] },
    dataState: {
      intervals: [...orig],
      currentIndex: -1,
      hasConflict: false,
      conflictPairs: []
    }
  });

  if (orig.length === 0) {
    steps.push({
      line: 2,
      description: 'The intervals list is empty. Trivially returning true.',
      variables: { result: true },
      dataState: {
        intervals: [],
        currentIndex: -1,
        hasConflict: false,
        conflictPairs: []
      }
    });
    return steps;
  }

  // Step 2: Sort intervals
  const sorted = [...orig].sort((a, b) => a.start - b.start).map((it, idx) => ({ ...it, id: idx + 1 }));
  steps.push({
    line: 3,
    description: 'Sort the intervals by their START times so we can sweep through them in chronological order.',
    variables: { sorted: sorted.map(it => [it.start, it.end]) },
    dataState: {
      intervals: sorted,
      currentIndex: -1,
      hasConflict: false,
      conflictPairs: []
    }
  });

  // Step 3: Loop and compare
  let conflictFound = false;
  let conflictIdx1 = -1;
  let conflictIdx2 = -1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    // Iteration start step
    steps.push({
      line: 4,
      description: `Iterating i = ${i}: Compare current meeting [${curr.start}, ${curr.end}] with previous meeting [${prev.start}, ${prev.end}].`,
      variables: { i, prev: [prev.start, prev.end], curr: [curr.start, curr.end] },
      dataState: {
        intervals: sorted,
        currentIndex: i,
        hasConflict: false,
        conflictPairs: []
      }
    });

    const isOverlap = curr.start < prev.end;
    steps.push({
      line: 5,
      description: `Check overlap condition: does current.start (${curr.start}) < previous.end (${prev.end})? -> ${isOverlap ? 'YES! Conflict detected.' : 'NO! Safe.'}`,
      variables: { i, prev_end: prev.end, curr_start: curr.start, isOverlap },
      dataState: {
        intervals: sorted,
        currentIndex: i,
        hasConflict: isOverlap,
        conflictPairs: isOverlap ? [i - 1, i] : []
      }
    });

    if (isOverlap) {
      conflictFound = true;
      conflictIdx1 = i - 1;
      conflictIdx2 = i;

      steps.push({
        line: 6,
        description: `Overlap detected between meeting ${i-1} [${prev.start}, ${prev.end}] and meeting ${i} [${curr.start}, ${curr.end}]. A person cannot attend both simultaneously! Return false.`,
        variables: { result: false },
        dataState: {
          intervals: sorted,
          currentIndex: i,
          hasConflict: true,
          conflictPairs: [conflictIdx1, conflictIdx2]
        }
      });
      break;
    }
  }

  if (!conflictFound) {
    steps.push({
      line: 9,
      description: 'All adjacent intervals successfully verified with no overlaps. Return true. A single person can attend all meetings!',
      variables: { result: true },
      dataState: {
        intervals: sorted,
        currentIndex: -1,
        hasConflict: false,
        conflictPairs: []
      }
    });
  }

  return steps;
}

// 5. Meeting Rooms II Step Generator
export function generateMeetingRoomsIISteps(orig: Interval[]): SimulationStep<MeetingRoomsIIState>[] {
  const steps: SimulationStep<MeetingRoomsIIState>[] = [];

  // Step 1: Enter function
  steps.push({
    line: 1,
    description: 'Enter minMeetingRooms. We want to find the minimum number of separate rooms required to host all scheduled meetings.',
    variables: { intervals: orig.map(it => [it.start, it.end]), starts: [], ends: [], rooms: 0, maxRooms: 0 },
    dataState: {
      intervals: [...orig],
      starts: [],
      ends: [],
      startIndex: -1,
      endIndex: -1,
      activeRooms: 0,
      maxRooms: 0
    }
  });

  if (orig.length === 0) {
    steps.push({
      line: 2,
      description: 'Empty schedule requires exactly 0 meeting rooms.',
      variables: { rooms: 0 },
      dataState: {
        intervals: [],
        starts: [],
        ends: [],
        startIndex: -1,
        endIndex: -1,
        activeRooms: 0,
        maxRooms: 0
      }
    });
    return steps;
  }

  // Step 2: Separate starts and ends
  const startsList = [...orig].map(it => it.start);
  const endsList = [...orig].map(it => it.end);

  steps.push({
    line: 3,
    description: 'Create two separate arrays: one for start times of meetings, and one for end times of meetings. Each start represents a "Room requested" event, and each end represents a "Room released" event.',
    variables: { starts: startsList, ends: endsList },
    dataState: {
      intervals: [...orig],
      starts: startsList,
      ends: endsList,
      startIndex: -1,
      endIndex: -1,
      activeRooms: 0,
      maxRooms: 0
    }
  });

  // Step 3: Sort arrays
  const startsSorted = [...startsList].sort((a, b) => a - b);
  const endsSorted = [...endsList].sort((a, b) => a - b);

  steps.push({
    line: 8,
    description: 'Sort both start times and end times arrays independently. This lets us process start events and end events chronologically.',
    variables: { sorted_starts: startsSorted, sorted_ends: endsSorted },
    dataState: {
      intervals: [...orig],
      starts: startsSorted,
      ends: endsSorted,
      startIndex: -1,
      endIndex: -1,
      activeRooms: 0,
      maxRooms: 0
    }
  });

  // Step 4: Loop setup
  let rooms = 0;
  let maxRooms = 0;
  let endIdx = 0;

  steps.push({
    line: 10,
    description: 'Initialize meeting rooms counters: current active rooms = 0, and end array pointer `endIdx = 0`.',
    variables: { rooms: 0, endIdx: 0 },
    dataState: {
      intervals: [...orig],
      starts: startsSorted,
      ends: endsSorted,
      startIndex: -1,
      endIndex: 0,
      activeRooms: 0,
      maxRooms: 0
    }
  });

  // Step 5: Loop starts
  for (let i = 0; i < startsSorted.length; i++) {
    const curStart = startsSorted[i];
    const curEnd = endsSorted[endIdx];

    steps.push({
      line: 11,
      description: `Examining start time index i = ${i} (value: ${curStart}) against end time index endIdx = ${endIdx} (value: ${curEnd}).`,
      variables: { i, endIdx, current_start: curStart, current_end: curEnd, rooms, maxRooms },
      dataState: {
        intervals: [...orig],
        starts: startsSorted,
        ends: endsSorted,
        startIndex: i,
        endIndex: endIdx,
        activeRooms: rooms,
        maxRooms: maxRooms
      }
    });

    const needNewRoom = curStart < curEnd;
    steps.push({
      line: 12,
      description: `Check comparison: starts[i] (${curStart}) < ends[endIdx] (${curEnd})? -> ${needNewRoom ? 'YES! A meeting starts before any active meeting ends. We need a new room.' : 'NO! A meeting has finished. We can reuse its room.'}`,
      variables: { i, endIdx, needNewRoom },
      dataState: {
        intervals: [...orig],
        starts: startsSorted,
        ends: endsSorted,
        startIndex: i,
        endIndex: endIdx,
        activeRooms: rooms,
        maxRooms: maxRooms
      }
    });

    if (needNewRoom) {
      rooms++;
      maxRooms = Math.max(maxRooms, rooms);
      steps.push({
        line: 13,
        description: `We allocate a new room. Active rooms incremented to ${rooms}. Overall peak maximum rooms used is now ${maxRooms}.`,
        variables: { rooms, maxRooms },
        dataState: {
          intervals: [...orig],
          starts: startsSorted,
          ends: endsSorted,
          startIndex: i,
          endIndex: endIdx,
          activeRooms: rooms,
          maxRooms: maxRooms
        }
      });
    } else {
      endIdx++;
      // Since it wasn't less, curStart >= curEnd, which means a meeting ended.
      // In the room logic: rooms remains unchanged overall because one ended, one starts.
      // So starts[i] replaces that room.
      steps.push({
        line: 15,
        description: `Release a room by moving the end pointer: endIdx incremented to ${endIdx}. Since a meeting ended, we reuse an existing room (active count stays at ${rooms}).`,
        variables: { endIdx, active_rooms: rooms },
        dataState: {
          intervals: [...orig],
          starts: startsSorted,
          ends: endsSorted,
          startIndex: i,
          endIndex: endIdx,
          activeRooms: rooms,
          maxRooms: maxRooms
        }
      });
    }
  }

  // Step 6: Return
  steps.push({
    line: 18,
    description: `All start events processed. The maximum concurrent rooms required at any peak moment is ${maxRooms}. Return ${maxRooms}.`,
    variables: { result: maxRooms },
    dataState: {
      intervals: [...orig],
      starts: startsSorted,
      ends: endsSorted,
      startIndex: -1,
      endIndex: endIdx,
      activeRooms: rooms,
      maxRooms: maxRooms
    }
  });

  return steps;
}
