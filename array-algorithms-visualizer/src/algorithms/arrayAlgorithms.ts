/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlgorithmId, SimulationStep } from '../types';

/**
 * Generates an array of simulation snapshots for the selected algorithm.
 */
export function generateSteps(
  algorithmId: AlgorithmId,
  numsInput: number[],
  params: Record<string, any> = {}
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const logs: string[] = [];

  // Helper to add a step safely
  const addStep = (
    arr: number[],
    pointers: Record<string, number | null>,
    line: number,
    desc: string,
    extra: Partial<SimulationStep> = {}
  ) => {
    // Clone logs
    const currentLogs = [...logs];
    if (desc && (currentLogs.length === 0 || currentLogs[currentLogs.length - 1] !== desc)) {
      logs.push(desc);
    }
    
    steps.push({
      array: [...arr],
      pointers,
      line,
      description: desc,
      variables: {},
      logs: [...logs],
      ...extra,
    });
  };

  // Switch based on algorithm
  switch (algorithmId) {
    case 'reverse-array': {
      const arr = [...numsInput];
      let left = 0;
      let right = arr.length - 1;

      addStep(arr, { left, right }, 1, 'Initializing left pointer at 0 and right pointer at end.');

      while (left < right) {
        addStep(
          arr,
          { left, right },
          4,
          `Checking condition: left (${left}) < right (${right}). Elements to compare: ${arr[left]} and ${arr[right]}.`,
          { comparisons: [[left, right]], highlights: { [left]: 'scanning', [right]: 'scanning' } }
        );

        // Swap
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        addStep(
          arr,
          { left, right },
          5,
          `Swapping element ${arr[right]} at index ${left} with ${arr[left]} at index ${right}.`,
          { swaps: [[left, right]], highlights: { [left]: 'target', [right]: 'target' } }
        );

        left++;
        right--;

        addStep(
          arr,
          { left, right },
          6,
          `Incremented left to ${left}, decremented right to ${right}.`,
          { highlights: { [left - 1]: 'sorted', [right + 1]: 'sorted' } }
        );
      }

      // Final complete step
      // Mark all elements as sorted/completed
      const finalHighlights: Record<number, 'sorted'> = {};
      for (let i = 0; i < arr.length; i++) {
        finalHighlights[i] = 'sorted';
      }
      addStep(arr, { left: null, right: null }, 9, 'Array fully reversed.', {
        highlights: finalHighlights,
      });
      break;
    }

    case 'rotate-array': {
      const arr = [...numsInput];
      const n = arr.length;
      let k = params.k ?? 3;
      k = k % n;

      addStep(arr, { k, n }, 1, `Initializing parameters. k = ${k} (normalized), n = ${n}.`);

      if (k === 0) {
        addStep(arr, {}, 4, 'k is 0 after normalization. No rotation required.');
        break;
      }

      const reverseSub = (start: number, end: number, stepName: string, startLine: number) => {
        let l = start;
        let r = end;
        logs.push(`--- Reversing subsegment: indices [${start}..${end}] for ${stepName} ---`);

        while (l < r) {
          addStep(
            arr,
            { left: l, right: r, k },
            startLine,
            `[${stepName}] Comparing left (${l}) and right (${r}) values: ${arr[l]} and ${arr[r]}.`,
            {
              comparisons: [[l, r]],
              highlights: { [l]: 'scanning', [r]: 'scanning' },
              customState: { phase: stepName },
            }
          );

          const temp = arr[l];
          arr[l] = arr[r];
          arr[r] = temp;

          addStep(
            arr,
            { left: l, right: r, k },
            startLine + 1,
            `[${stepName}] Swapping indices ${l} and ${r}: (${arr[r]} ↔ ${arr[l]}).`,
            {
              swaps: [[l, r]],
              highlights: { [l]: 'target', [r]: 'target' },
              customState: { phase: stepName },
            }
          );

          l++;
          r--;
        }
      };

      // Step 1: Reverse entire array (line 8)
      reverseSub(0, n - 1, 'Step 1: Reverse All', 8);

      // Step 2: Reverse first k elements (line 11)
      reverseSub(0, k - 1, 'Step 2: Reverse First k', 11);

      // Step 3: Reverse remaining n-k elements (line 14)
      reverseSub(k, n - 1, 'Step 3: Reverse Remaining n-k', 14);

      // Final step
      const finalHighlights: Record<number, 'sorted'> = {};
      for (let i = 0; i < arr.length; i++) {
        finalHighlights[i] = 'sorted';
      }
      addStep(arr, {}, 15, `Rotation by ${k} steps completed successfully.`, {
        highlights: finalHighlights,
      });
      break;
    }

    case 'plus-one': {
      const arr = [...numsInput];
      let carry = 1;
      let i = arr.length - 1;

      addStep(arr, { i }, 2, 'Initializing plus-one digit addition traversal from rightmost digit.');

      let added = false;
      while (i >= 0) {
        addStep(
          arr,
          { i },
          4,
          `Checking digit at index ${i}: ${arr[i]}. Since it is ${arr[i] < 9 ? 'less than 9' : 'equal to 9'}.`,
          {
            highlights: { [i]: 'scanning' },
            customState: { carry },
          }
        );

        if (arr[i] < 9) {
          arr[i]++;
          carry = 0;
          addStep(
            arr,
            { i },
            5,
            `No overflow. Incrementing index ${i} to ${arr[i]}. Operation completes.`,
            {
              highlights: { [i]: 'sorted' },
              customState: { carry },
            }
          );
          added = true;
          break;
        } else {
          arr[i] = 0;
          addStep(
            arr,
            { i },
            8,
            `Overflow at index ${i} (was 9). Setting cell to 0 and carrying 1 backwards.`,
            {
              highlights: { [i]: 'target' },
              customState: { carry: 1 },
            }
          );
        }
        i--;
      }

      if (!added) {
        addStep(arr, {}, 10, 'All digits rolled over to 0. Inserting a new leading 1 digit.', {
          customState: { carry: 1 },
        });
        arr.unshift(1);
        addStep(arr, { i: 0 }, 11, 'Resized digit array to accommodate final carry propagation.', {
          highlights: { 0: 'sorted' },
          customState: { carry: 0 },
        });
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < arr.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(arr, {}, 12, 'Addition completed.', {
        highlights: finalHighlights,
        customState: { carry: 0 },
      });
      break;
    }

    case 'move-zeroes': {
      const arr = [...numsInput];
      let lastNonZero = 0;

      addStep(arr, { lastNonZero }, 2, 'Setting write pointer lastNonZero at 0.');

      for (let i = 0; i < arr.length; i++) {
        addStep(
          arr,
          { i, lastNonZero },
          3,
          `Scanning index i = ${i}. Element value: ${arr[i]}.`,
          {
            highlights: { [i]: 'scanning', [lastNonZero]: 'target' },
          }
        );

        if (arr[i] !== 0) {
          const wasZero = arr[lastNonZero] === 0;
          const temp = arr[lastNonZero];
          arr[lastNonZero] = arr[i];
          arr[i] = temp;

          addStep(
            arr,
            { i, lastNonZero },
            5,
            `Non-zero element ${arr[lastNonZero]} found at index ${i}. Swap with index lastNonZero (${lastNonZero}).`,
            {
              swaps: [[lastNonZero, i]],
              highlights: { [lastNonZero]: 'sorted', [i]: 'target' },
            }
          );
          lastNonZero++;
        }
      }

      const finalHighlights: Record<number, 'sorted' | 'normal'> = {};
      for (let idx = 0; idx < arr.length; idx++) {
        finalHighlights[idx] = idx < lastNonZero ? 'sorted' : 'normal';
      }
      addStep(arr, { lastNonZero }, 8, 'Zeroes moved to end. Partition complete.', {
        highlights: finalHighlights,
      });
      break;
    }

    case 'remove-duplicates': {
      const arr = [...numsInput];
      if (arr.length === 0) {
        addStep(arr, {}, 2, 'Array is empty. Return 0.');
        break;
      }

      let slow = 0;
      addStep(arr, { slow }, 3, 'Setting slow pointer at index 0.');

      for (let fast = 1; fast < arr.length; fast++) {
        addStep(
          arr,
          { slow, fast },
          4,
          `Comparing slow element nums[${slow}] (${arr[slow]}) with fast element nums[${fast}] (${arr[fast]}).`,
          {
            comparisons: [[slow, fast]],
            highlights: { [slow]: 'target', [fast]: 'scanning' },
          }
        );

        if (arr[fast] !== arr[slow]) {
          slow++;
          arr[slow] = arr[fast];
          addStep(
            arr,
            { slow, fast },
            6,
            `Unique element found! Incremented slow to ${slow} and copied value ${arr[fast]} there.`,
            {
              highlights: { [slow]: 'sorted', [fast]: 'scanning' },
            }
          );
        } else {
          addStep(
            arr,
            { slow, fast },
            4,
            `Duplicate element (${arr[fast]}) skipped. Slow remains at index ${slow}.`,
            {
              highlights: { [slow]: 'target', [fast]: 'normal' },
            }
          );
        }
      }

      const finalHighlights: Record<number, 'sorted' | 'normal'> = {};
      for (let idx = 0; idx < arr.length; idx++) {
        finalHighlights[idx] = idx <= slow ? 'sorted' : 'normal';
      }
      addStep(arr, { slow }, 9, `Duplicates removed. Number of unique elements: ${slow + 1}.`, {
        highlights: finalHighlights,
      });
      break;
    }

    case 'next-permutation': {
      const arr = [...numsInput];
      const n = arr.length;
      let i = n - 2;

      addStep(arr, { i }, 3, 'Scan right-to-left to find the first decrease (pivot/dip) nums[i] < nums[i+1].');

      while (i >= 0 && arr[i] >= arr[i + 1]) {
        addStep(
          arr,
          { i, next: i + 1 },
          6,
          `Scanning: nums[${i}] (${arr[i]}) >= nums[${i + 1}] (${arr[i + 1]}). No dip found. Moving left.`,
          {
            comparisons: [[i, i + 1]],
            highlights: { [i]: 'scanning', [i + 1]: 'scanning' },
          }
        );
        i--;
      }

      if (i >= 0) {
        addStep(
          arr,
          { i, next: i + 1 },
          6,
          `First decreasing element found at index ${i} (value: ${arr[i]} < ${arr[i + 1]}). This is the Pivot!`,
          {
            highlights: { [i]: 'pivot' },
          }
        );

        let j = n - 1;
        addStep(
          arr,
          { i, j },
          10,
          `Finding successor: scanning from the right to find the first element strictly larger than pivot (${arr[i]}).`,
          {
            highlights: { [i]: 'pivot', [j]: 'scanning' },
          }
        );

        while (arr[j] <= arr[i]) {
          addStep(
            arr,
            { i, j },
            12,
            `nums[${j}] (${arr[j]}) is not larger than pivot (${arr[i]}). Moving left.`,
            {
              comparisons: [[i, j]],
              highlights: { [i]: 'pivot', [j]: 'scanning' },
            }
          );
          j--;
        }

        addStep(
          arr,
          { i, j },
          12,
          `Successor found at index ${j} (value: ${arr[j]} > ${arr[i]}). Swapping successor and pivot.`,
          {
            comparisons: [[i, j]],
            highlights: { [i]: 'pivot', [j]: 'successor' },
          }
        );

        // Swap
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        addStep(
          arr,
          { i, j },
          15,
          `Swapped pivot index ${i} and successor index ${j} (${arr[j]} ↔ ${arr[i]}).`,
          {
            swaps: [[i, j]],
            highlights: { [i]: 'target', [j]: 'target' },
          }
        );
      } else {
        addStep(arr, {}, 8, 'Entire array is non-increasing. It is the last permutation. Reversing whole array.');
      }

      // Reverse suffix (line 18)
      let l = i + 1;
      let r = n - 1;
      logs.push(`--- Reversing suffix segment [${l}..${r}] to get lexicographically smallest layout ---`);

      while (l < r) {
        addStep(
          arr,
          { i, leftSuffix: l, rightSuffix: r },
          18,
          `Reversing suffix: comparing index ${l} (${arr[l]}) and ${r} (${arr[r]}).`,
          {
            comparisons: [[l, r]],
            highlights: { [l]: 'scanning', [r]: 'scanning' },
          }
        );

        const temp = arr[l];
        arr[l] = arr[r];
        arr[r] = temp;

        addStep(
          arr,
          { i, leftSuffix: l, rightSuffix: r },
          18,
          `Reversing suffix: swapping indices ${l} and ${r} (${arr[r]} ↔ ${arr[l]}).`,
          {
            swaps: [[l, r]],
            highlights: { [l]: 'target', [r]: 'target' },
          }
        );
        l++;
        r--;
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < arr.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(arr, {}, 19, 'Next Permutation layout constructed successfully.', {
        highlights: finalHighlights,
      });
      break;
    }

    case 'prev-permutation': {
      const arr = [...numsInput];
      const n = arr.length;
      let i = n - 2;

      addStep(arr, { i }, 3, 'Scan right-to-left to find the first rightmost dip nums[i] > nums[i+1].');

      while (i >= 0 && arr[i] <= arr[i + 1]) {
        addStep(
          arr,
          { i, next: i + 1 },
          5,
          `Scanning: nums[${i}] (${arr[i]}) <= nums[${i + 1}] (${arr[i + 1]}). No dip found.`,
          {
            comparisons: [[i, i + 1]],
            highlights: { [i]: 'scanning', [i + 1]: 'scanning' },
          }
        );
        i--;
      }

      if (i < 0) {
        addStep(arr, {}, 8, 'Array is sorted. No smaller permutation possible with one swap.');
        break;
      }

      addStep(
        arr,
        { i },
        8,
        `Rightmost dip found at index ${i} (value: ${arr[i]} > ${arr[i + 1]}). Searching for largest predecessor.`,
        {
          highlights: { [i]: 'pivot' },
        }
      );

      // Find largest nums[j] < nums[i] that is closest
      let j = n - 1;
      while (arr[j] >= arr[i] || (j > 0 && arr[j] === arr[j - 1])) {
        j--;
      }
      // Choose leftmost identical element for stability
      while (j > 0 && arr[j] === arr[j - 1]) {
        j--;
      }

      addStep(
        arr,
        { i, j },
        14,
        `Largest element smaller than ${arr[i]} is nums[${j}] (${arr[j]}). Swapping them.`,
        {
          comparisons: [[i, j]],
          highlights: { [i]: 'pivot', [j]: 'successor' },
        }
      );

      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;

      addStep(
        arr,
        { i, j },
        19,
        `Swapped pivot nums[${i}] and predecessor nums[${j}]. Swap completes the optimal previous permutation.`,
        {
          swaps: [[i, j]],
          highlights: { [i]: 'target', [j]: 'target' },
        }
      );

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < arr.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(arr, {}, 21, 'Previous permutation generated.', {
        highlights: finalHighlights,
      });
      break;
    }

    case 'wiggle-sort': {
      const arr = [...numsInput];

      addStep(arr, {}, 1, 'Starting single-pass wiggle sort simulation to form peaks and valleys.');

      for (let i = 0; i < arr.length - 1; i++) {
        const isEven = i % 2 === 0;
        const conditionText = isEven
          ? `nums[${i}] (${arr[i]}) > nums[${i + 1}] (${arr[i + 1]})`
          : `nums[${i}] (${arr[i]}) < nums[${i + 1}] (${arr[i + 1]})`;

        addStep(
          arr,
          { i },
          3,
          `Checking index i = ${i} (${isEven ? 'Even: Valley target' : 'Odd: Peak target'}). Comparing elements.`,
          {
            comparisons: [[i, i + 1]],
            highlights: { [i]: 'scanning', [i + 1]: 'scanning' },
          }
        );

        if (isEven) {
          if (arr[i] > arr[i + 1]) {
            const temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
            addStep(
              arr,
              { i },
              5,
              `Violation! Even index ${i} has larger value. Swapped index ${i} and ${i + 1}: (${arr[i + 1]} ↔ ${arr[i]}).`,
              {
                swaps: [[i, i + 1]],
                highlights: { [i]: 'target', [i + 1]: 'target' },
              }
            );
          }
        } else {
          if (arr[i] < arr[i + 1]) {
            const temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
            addStep(
              arr,
              { i },
              9,
              `Violation! Odd index ${i} has smaller value. Swapped index ${i} and ${i + 1}: (${arr[i + 1]} ↔ ${arr[i]}).`,
              {
                swaps: [[i, i + 1]],
                highlights: { [i]: 'target', [i + 1]: 'target' },
              }
            );
          }
        }
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < arr.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(arr, {}, 13, 'Wiggle Sort complete. Array matches alternating wave constraints.', {
        highlights: finalHighlights,
      });
      break;
    }

    case 'sort-colors': {
      const arr = [...numsInput];
      let low = 0;
      let mid = 0;
      let high = arr.length - 1;

      addStep(arr, { low, mid, high }, 2, 'Initializing pointers: low = 0, mid = 0, high = end.');

      while (mid <= high) {
        addStep(
          arr,
          { low, mid, high },
          3,
          `Checking mid element nums[mid] = ${arr[mid]} at index ${mid}.`,
          {
            highlights: { [mid]: 'scanning', [low]: 'target', [high]: 'pivot' },
          }
        );

        if (arr[mid] === 0) {
          addStep(
            arr,
            { low, mid, high },
            4,
            `nums[mid] is 0 (Red). Swap with low pointer nums[low] (${arr[low]}) and increment both.`,
            {
              comparisons: [[low, mid]],
              highlights: { [mid]: 'scanning', [low]: 'target' },
            }
          );

          const temp = arr[low];
          arr[low] = arr[mid];
          arr[mid] = temp;

          addStep(
            arr,
            { low, mid, high },
            5,
            `Swapped mid indices: Red color placed at index low (${low}).`,
            {
              swaps: [[low, mid]],
              highlights: { [low]: 'sorted', [mid]: 'target' },
            }
          );
          low++;
          mid++;
        } else if (arr[mid] === 1) {
          addStep(
            arr,
            { low, mid, high },
            8,
            `nums[mid] is 1 (White). Correct mid-range placement. Simply increment mid.`,
            {
              highlights: { [mid]: 'sorted' },
            }
          );
          mid++;
        } else {
          addStep(
            arr,
            { low, mid, high },
            10,
            `nums[mid] is 2 (Blue). Swap with high pointer nums[high] (${arr[high]}) and decrement high.`,
            {
              comparisons: [[mid, high]],
              highlights: { [mid]: 'scanning', [high]: 'pivot' },
            }
          );

          const temp = arr[high];
          arr[high] = arr[mid];
          arr[mid] = temp;

          addStep(
            arr,
            { low, mid, high },
            11,
            `Swapped mid and high: Blue color placed at index high (${high}).`,
            {
              swaps: [[mid, high]],
              highlights: { [high]: 'sorted', [mid]: 'target' },
            }
          );
          high--;
        }
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < arr.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(arr, {}, 15, 'Sort Colors (Dutch National Flag) partitioning completed.', {
        highlights: finalHighlights,
      });
      break;
    }

    case 'merge-sorted': {
      // nums1 has m active values and padding zeroes.
      // nums2 has n values.
      const nums1 = [...numsInput];
      const m = params.m ?? 3;
      const nums2 = params.nums2 ?? [2, 4, 6];
      const n = params.n ?? 3;

      let p1 = m - 1;
      let p2 = n - 1;
      let p = m + n - 1;

      addStep(
        nums1,
        { p1, p2, p },
        2,
        `Initializing 3 pointers: p1 = ${p1} (end of nums1), p2 = ${p2} (end of nums2), and target write pointer p = ${p}.`,
        {
          secondaryArray: nums2,
        }
      );

      while (p2 >= 0) {
        addStep(
          nums1,
          { p1, p2, p },
          7,
          p1 >= 0
            ? `Comparing nums1[p1] (${nums1[p1]}) with nums2[p2] (${nums2[p2]}).`
            : `p1 is exhausted. Directly placing remaining nums2 element (${nums2[p2]}).`,
          {
            secondaryArray: nums2,
            comparisons: p1 >= 0 ? [[p1, p]] : undefined,
            highlights: {
              ...(p1 >= 0 ? { [p1]: 'scanning' as const } : {}),
              [p]: 'target' as const,
            },
          }
        );

        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
          nums1[p] = nums1[p1];
          addStep(
            nums1,
            { p1, p2, p },
            8,
            `nums1[p1] (${nums1[p1]}) is larger. Writing it to target write index p (${p}).`,
            {
              secondaryArray: nums2,
              highlights: { [p1]: 'scanning', [p]: 'target' },
            }
          );
          p1--;
        } else {
          nums1[p] = nums2[p2];
          addStep(
            nums1,
            { p1, p2, p },
            11,
            `nums2[p2] (${nums2[p2]}) is larger (or p1 exhausted). Writing it to target write index p (${p}).`,
            {
              secondaryArray: nums2,
              highlights: { [p]: 'target' },
            }
          );
          p2--;
        }
        p--;
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < nums1.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(nums1, {}, 16, 'In-place backward merge of sorted arrays completed.', {
        secondaryArray: nums2,
        highlights: finalHighlights,
      });
      break;
    }

    case 'boyer-moore': {
      const arr = [...numsInput];
      let candidate: number | null = null;
      let count = 0;

      addStep(arr, {}, 2, 'Initializing candidate = NULL and count = 0.');

      for (let i = 0; i < arr.length; i++) {
        addStep(
          arr,
          { i },
          5,
          `Iterating at index ${i} (value: ${arr[i]}). Current Candidate: ${candidate ?? 'None'}, Count: ${count}.`,
          {
            highlights: { [i]: 'scanning' },
            customState: { candidate, count, phase: 'Phase 1: Find Candidate' },
          }
        );

        if (count === 0) {
          candidate = arr[i];
          addStep(
            arr,
            { i },
            6,
            `Count is 0. Assigning current element ${arr[i]} as new Candidate.`,
            {
              highlights: { [i]: 'pivot' },
              customState: { candidate, count, phase: 'Phase 1: Find Candidate' },
            }
          );
        }

        const isMatch = arr[i] === candidate;
        count += isMatch ? 1 : -1;

        addStep(
          arr,
          { i },
          8,
          isMatch
            ? `Value matches candidate ${candidate}. Incrementing count to ${count}.`
            : `Value mismatches candidate ${candidate}. Decrementing count to ${count}.`,
          {
            highlights: { [i]: isMatch ? 'sorted' : 'target' },
            customState: { candidate, count, phase: 'Phase 1: Find Candidate' },
          }
        );
      }

      addStep(arr, {}, 10, `Majority candidate resolved: ${candidate}.`, {
        customState: { candidate, count, phase: 'Phase 2: Complete' },
      });
      break;
    }

    case 'boyer-moore-ii': {
      const arr = [...numsInput];
      let cand1: number | null = null;
      let cand2: number | null = null;
      let count1 = 0;
      let count2 = 0;

      addStep(arr, {}, 2, 'Setting up 2 candidates and counters for elements appearing > n/3 times.');

      for (let i = 0; i < arr.length; i++) {
        const num = arr[i];
        addStep(
          arr,
          { i },
          3,
          `Scanning index ${i}: ${num}. Candidate 1: ${cand1 ?? 'None'} (Count: ${count1}), Candidate 2: ${cand2 ?? 'None'} (Count: ${count2}).`,
          {
            highlights: { [i]: 'scanning' },
            customState: { candidate: cand1, count: count1, candidate2: cand2, count2, phase: 'Iterating' },
          }
        );

        if (cand1 !== null && num === cand1) {
          count1++;
          addStep(arr, { i }, 4, `num matches Candidate 1 (${cand1}). Incremented count1 to ${count1}.`, {
            highlights: { [i]: 'sorted' },
            customState: { candidate: cand1, count: count1, candidate2: cand2, count2 },
          });
        } else if (cand2 !== null && num === cand2) {
          count2++;
          addStep(arr, { i }, 5, `num matches Candidate 2 (${cand2}). Incremented count2 to ${count2}.`, {
            highlights: { [i]: 'sorted' },
            customState: { candidate: cand1, count: count1, candidate2: cand2, count2 },
          });
        } else if (count1 === 0) {
          cand1 = num;
          count1 = 1;
          addStep(arr, { i }, 6, `count1 is 0. Assigned new Candidate 1: ${cand1}.`, {
            highlights: { [i]: 'pivot' },
            customState: { candidate: cand1, count: count1, candidate2: cand2, count2 },
          });
        } else if (count2 === 0) {
          cand2 = num;
          count2 = 1;
          addStep(arr, { i }, 7, `count2 is 0. Assigned new Candidate 2: ${cand2}.`, {
            highlights: { [i]: 'pivot' },
            customState: { candidate: cand1, count: count1, candidate2: cand2, count2 },
          });
        } else {
          count1--;
          count2--;
          addStep(arr, { i }, 8, `Mismatch with both candidates. Decremented both count1 (${count1}) and count2 (${count2}).`, {
            highlights: { [i]: 'target' },
            customState: { candidate: cand1, count: count1, candidate2: cand2, count2 },
          });
        }
      }

      // Final display
      addStep(arr, {}, 14, `Completed scanning. Candidates resolved: ${cand1} and ${cand2}.`, {
        customState: { candidate: cand1, count: count1, candidate2: cand2, count2 },
      });
      break;
    }

    case 'missing-number': {
      const arr = [...numsInput];
      const n = arr.length;
      const expectedSum = (n * (n + 1)) / 2;
      let actualSum = 0;

      addStep(arr, {}, 2, `Array size n = ${n}. Expected Gauss Sum expectedSum = n*(n+1)/2 = ${expectedSum}.`);

      for (let i = 0; i < arr.length; i++) {
        actualSum += arr[i];
        addStep(
          arr,
          { i },
          5,
          `Adding element at index ${i} (${arr[i]}) to actualSum. Running sum: ${actualSum}.`,
          {
            highlights: { [i]: 'scanning' },
            customState: { expectedSum, actualSum },
          }
        );
      }

      const diff = expectedSum - actualSum;
      addStep(arr, {}, 8, `Done adding elements. Missing Number = expectedSum (${expectedSum}) - actualSum (${actualSum}) = ${diff}.`, {
        customState: { expectedSum, actualSum },
      });
      break;
    }

    case 'disappeared-numbers': {
      const arr = [...numsInput];
      const n = arr.length;

      addStep(arr, {}, 1, 'Marking visited elements as negative at index (abs(num) - 1).');

      for (let i = 0; i < n; i++) {
        const val = Math.abs(arr[i]);
        const idx = val - 1;
        addStep(
          arr,
          { i, targetIndex: idx },
          3,
          `Scanning index ${i} (value: ${arr[i]}, magnitude: ${val}). Flipping value at target index ${idx}.`,
          {
            highlights: { [i]: 'scanning', [idx]: 'target' },
          }
        );

        if (arr[idx] > 0) {
          arr[idx] = -arr[idx];
          addStep(
            arr,
            { i, targetIndex: idx },
            5,
            `Element at index ${idx} was positive (${-arr[idx]}). Negated it to ${arr[idx]}.`,
            {
              highlights: { [i]: 'scanning', [idx]: 'target' },
            }
          );
        } else {
          addStep(
            arr,
            { i, targetIndex: idx },
            3,
            `Element at index ${idx} is already negative. No modification needed.`,
            {
              highlights: { [i]: 'scanning', [idx]: 'sorted' },
            }
          );
        }
      }

      const missing: number[] = [];
      const highlights: Record<number, 'sorted' | 'normal'> = {};
      for (let i = 0; i < n; i++) {
        if (arr[i] > 0) {
          missing.push(i + 1);
          highlights[i] = 'sorted';
        } else {
          highlights[i] = 'normal';
        }
      }

      addStep(arr, {}, 8, `Pass complete. Positive entries at indices indicate disappeared values: ${missing.join(', ')}.`, {
        highlights,
      });
      break;
    }

    case 'product-except-self': {
      const arr = [...numsInput];
      const n = arr.length;
      const answer = new Array(n).fill(1);
      
      addStep(arr, {}, 2, 'Initializing product arrays. Carrying out Prefix product pass.');

      let prefix = 1;
      const prefixProducts: number[] = [];
      for (let i = 0; i < n; i++) {
        answer[i] = prefix;
        prefixProducts.push(prefix);
        prefix *= arr[i];
        
        addStep(
          answer,
          { i },
          6,
          `Prefix pass (Index ${i}): Setting answer[${i}] to cumulative prefix product (${answer[i]}). Running prefix factor becomes ${prefix}.`,
          {
            highlights: { [i]: 'scanning' },
            customState: { prefixProducts: [...prefixProducts] },
          }
        );
      }

      let suffix = 1;
      const suffixProducts: number[] = new Array(n).fill(1);
      for (let i = n - 1; i >= 0; i--) {
        suffixProducts[i] = suffix;
        answer[i] *= suffix;
        suffix *= arr[i];

        addStep(
          answer,
          { i },
          13,
          `Suffix pass (Index ${i}): Multiplying with suffix factor (${suffixProducts[i]}). Value becomes ${answer[i]}. Running suffix factor becomes ${suffix}.`,
          {
            highlights: { [i]: 'target' },
            customState: { prefixProducts: [...prefixProducts], suffixProducts: [...suffixProducts] },
          }
        );
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < answer.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(answer, {}, 16, 'Full Product Except Self array constructed in O(1) auxiliary space.', {
        highlights: finalHighlights,
      });
      break;
    }

    case 'pascals-triangle': {
      // For Pascal's, we can show a nice pyramid layout!
      // numsInput will represent the current row sizes or content we want to simulate
      const numRows = 5;
      const triangle: number[][] = [];
      addStep([1], {}, 1, 'Initializing Pascal\'s Triangle row construction.');

      for (let i = 0; i < numRows; i++) {
        const row = new Array(i + 1).fill(1);
        for (let j = 1; j < j; j++) {} // empty loop for simple state
        
        triangle.push(row);
        
        // Populate inner cells
        for (let j = 1; j < i; j++) {
          row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
          addStep(
            row,
            { i, j },
            5,
            `Calculating cell row ${i}, col ${j}: Summing upper left (${triangle[i - 1][j - 1]}) and upper right (${triangle[i - 1][j]}) = ${row[j]}.`,
            {
              secondaryArray: triangle,
              highlights: { [j]: 'scanning' },
            }
          );
        }
        
        addStep(row, {}, 7, `Row ${i} fully constructed: [${row.join(', ')}].`, {
          secondaryArray: [...triangle],
        });
      }
      break;
    }

    case 'set-matrix-zeroes': {
      // 1D representations of a 3x3 matrix
      const matrix = [...numsInput];
      const rows = 3;
      const cols = 3;

      addStep(matrix, {}, 3, 'Analyzing first row and column for zeroes to record boundary states.', {
        secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
      });

      let firstRowZero = false;
      let firstColZero = false;

      for (let i = 0; i < rows; i++) {
        if (matrix[i * cols + 0] === 0) firstColZero = true;
      }
      for (let j = 0; j < cols; j++) {
        if (matrix[0 * cols + j] === 0) firstRowZero = true;
      }

      addStep(matrix, {}, 13, `Boundary check: firstRowZero = ${firstRowZero}, firstColZero = ${firstColZero}.`, {
        secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
        customState: { firstRowZero, firstColZero },
      });

      // Use first row & col as flags
      for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
          const idx = i * cols + j;
          if (matrix[idx] === 0) {
            matrix[i * cols + 0] = 0;
            matrix[0 * cols + j] = 0;
            addStep(matrix, { i, j }, 19, `Found zero at cell (${i}, ${j}). Setting header flags matrix[${i}][0] and matrix[0][${j}] to 0.`, {
              secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
              highlights: { [idx]: 'scanning', [i * cols]: 'target', [j]: 'target' },
              customState: { firstRowZero, firstColZero },
            });
          }
        }
      }

      // Nullify cells based on flags
      for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
          const idx = i * cols + j;
          if (matrix[i * cols + 0] === 0 || matrix[0 * cols + j] === 0) {
            matrix[idx] = 0;
          }
        }
      }

      addStep(matrix, {}, 27, 'Nullified inner cells based on row & col header flags.', {
        secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
        customState: { firstRowZero, firstColZero },
      });

      if (firstRowZero) {
        for (let j = 0; j < cols; j++) matrix[0 * cols + j] = 0;
      }
      if (firstColZero) {
        for (let i = 0; i < rows; i++) matrix[i * cols + 0] = 0;
      }

      addStep(matrix, {}, 35, 'In-place zeroing of matrix elements complete.', {
        secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
        customState: { firstRowZero, firstColZero },
      });
      break;
    }

    case 'rotate-image': {
      const n = 3;
      const matrix = [...numsInput];

      addStep(matrix, {}, 2, 'Initializing O(1) auxiliary space 90 degree clockwise rotation.');

      // Step 1: Transpose matrix[i][j] with matrix[j][i]
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const idx1 = i * n + j;
          const idx2 = j * n + i;

          addStep(
            matrix,
            { i, j },
            6,
            `[Transpose] Exchanging element at (${i},${j}) with element at (${j},${i}).`,
            {
              secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
              comparisons: [[idx1, idx2]],
              highlights: { [idx1]: 'scanning', [idx2]: 'scanning' },
            }
          );

          const temp = matrix[idx1];
          matrix[idx1] = matrix[idx2];
          matrix[idx2] = temp;

          addStep(
            matrix,
            { i, j },
            7,
            `[Transpose] Swapped values ${matrix[idx2]} and ${matrix[idx1]}.`,
            {
              secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
              swaps: [[idx1, idx2]],
              highlights: { [idx1]: 'target', [idx2]: 'target' },
            }
          );
        }
      }

      // Step 2: Reverse each row (horizontal mirror)
      addStep(matrix, {}, 11, 'Transpose complete. Reversing each row of the transposed matrix to finish rotation.');

      for (let i = 0; i < n; i++) {
        let left = 0;
        let right = n - 1;
        while (left < right) {
          const idx1 = i * n + left;
          const idx2 = i * n + right;

          addStep(
            matrix,
            { row: i, left, right },
            13,
            `[Reverse Row ${i}] Swapping row columns: index (${i}, ${left}) and (${i}, ${right}).`,
            {
              secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
              comparisons: [[idx1, idx2]],
              highlights: { [idx1]: 'scanning', [idx2]: 'scanning' },
            }
          );

          const temp = matrix[idx1];
          matrix[idx1] = matrix[idx2];
          matrix[idx2] = temp;

          addStep(
            matrix,
            { row: i, left, right },
            13,
            `[Reverse Row ${i}] Swapped values ${matrix[idx2]} ↔ ${matrix[idx1]}.`,
            {
              secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
              swaps: [[idx1, idx2]],
              highlights: { [idx1]: 'target', [idx2]: 'target' },
            }
          );

          left++;
          right--;
        }
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < matrix.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(matrix, {}, 16, '90° clockwise in-place matrix rotation completed successfully.', {
        secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
        highlights: finalHighlights,
      });
      break;
    }

    case 'spiral-matrix': {
      const rows = 3;
      const cols = 3;
      const matrix = [...numsInput];

      let top = 0;
      let bottom = rows - 1;
      let left = 0;
      let right = cols - 1;

      const spiralResult: number[] = [];
      const visitedIndexes = new Set<number>();

      addStep(matrix, { top, bottom, left, right }, 2, 'Initializing boundary pointers: top, bottom, left, right.');

      while (top <= bottom && left <= right) {
        // 1. Traverse Right
        for (let i = left; i <= right; i++) {
          const idx = top * cols + i;
          spiralResult.push(matrix[idx]);
          visitedIndexes.add(idx);

          const stepHighlights: Record<number, 'scanning' | 'sorted'> = {};
          visitedIndexes.forEach((vIdx) => {
            stepHighlights[vIdx] = vIdx === idx ? 'scanning' : 'sorted';
          });

          addStep(
            matrix,
            { top, bottom, left, right, currentIdx: idx },
            8,
            `[Traverse Right] Visiting matrix cell (${top}, ${i}) = ${matrix[idx]}. Path sequence: [${spiralResult.join(', ')}].`,
            {
              secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
              highlights: stepHighlights,
            }
          );
        }
        top++;

        // 2. Traverse Down
        if (top <= bottom && left <= right) {
          for (let i = top; i <= bottom; i++) {
            const idx = i * cols + right;
            spiralResult.push(matrix[idx]);
            visitedIndexes.add(idx);

            const stepHighlights: Record<number, 'scanning' | 'sorted'> = {};
            visitedIndexes.forEach((vIdx) => {
              stepHighlights[vIdx] = vIdx === idx ? 'scanning' : 'sorted';
            });

            addStep(
              matrix,
              { top, bottom, left, right, currentIdx: idx },
              13,
              `[Traverse Down] Visiting matrix cell (${i}, ${right}) = ${matrix[idx]}. Path sequence: [${spiralResult.join(', ')}].`,
              {
                secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
                highlights: stepHighlights,
              }
            );
          }
          right--;
        }

        // 3. Traverse Left
        if (top <= bottom && left <= right) {
          for (let i = right; i >= left; i--) {
            const idx = bottom * cols + i;
            spiralResult.push(matrix[idx]);
            visitedIndexes.add(idx);

            const stepHighlights: Record<number, 'scanning' | 'sorted'> = {};
            visitedIndexes.forEach((vIdx) => {
              stepHighlights[vIdx] = vIdx === idx ? 'scanning' : 'sorted';
            });

            addStep(
              matrix,
              { top, bottom, left, right, currentIdx: idx },
              19,
              `[Traverse Left] Visiting matrix cell (${bottom}, ${i}) = ${matrix[idx]}. Path sequence: [${spiralResult.join(', ')}].`,
              {
                secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
                highlights: stepHighlights,
              }
            );
          }
          bottom--;
        }

        // 4. Traverse Up
        if (top <= bottom && left <= right) {
          for (let i = bottom; i >= top; i--) {
            const idx = i * cols + left;
            spiralResult.push(matrix[idx]);
            visitedIndexes.add(idx);

            const stepHighlights: Record<number, 'scanning' | 'sorted'> = {};
            visitedIndexes.forEach((vIdx) => {
              stepHighlights[vIdx] = vIdx === idx ? 'scanning' : 'sorted';
            });

            addStep(
              matrix,
              { top, bottom, left, right, currentIdx: idx },
              25,
              `[Traverse Up] Visiting matrix cell (${i}, ${left}) = ${matrix[idx]}. Path sequence: [${spiralResult.join(', ')}].`,
              {
                secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
                highlights: stepHighlights,
              }
            );
          }
          left++;
        }
      }

      const finalHighlights: Record<number, 'sorted'> = {};
      for (let idx = 0; idx < matrix.length; idx++) {
        finalHighlights[idx] = 'sorted';
      }
      addStep(matrix, {}, 29, `Spiral path traversal complete. Visited nodes sequence: [${spiralResult.join(', ')}].`, {
        secondaryArray: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
        highlights: finalHighlights,
      });
      break;
    }
  }

  // Ensure every step has populated variables for the variables tracker panel
  return steps.map((step) => {
    const vars: Record<string, string | number | boolean | null> = {};
    Object.entries(step.pointers).forEach(([key, value]) => {
      vars[key] = value;
    });
    if (step.customState) {
      Object.entries(step.customState).forEach(([key, value]) => {
        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
          vars[key] = value;
        }
      });
    }
    return { ...step, variables: vars };
  });
}
