import { SimulationResult, SimulationStep } from '../types';

// Helper to parse input array from comma/space separated string
export function parseNumberArray(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !isNaN(Number(s)))
    .map(Number);
}

// Helper to sanitize string input
export function parseStringInput(input: string): string {
  return input.trim();
}

export function runSimulation(
  problemId: string,
  rawInput: string,
  paramK: number = 3,
  paramTarget: string = ''
): SimulationResult {
  switch (problemId) {
    case 'max-sum-subarray-k':
      return simulateMaxSumSubarrayK(parseNumberArray(rawInput), paramK);
    case 'first-negative-integer-k':
      return simulateFirstNegativeIntegerK(parseNumberArray(rawInput), paramK);
    case 'subarrays-k-avg-threshold':
      return simulateSubarraysKAvgThreshold(parseNumberArray(rawInput), paramK, Number(paramTarget) || 4);
    case 'max-vowels-in-substring':
      return simulateMaxVowels(parseStringInput(rawInput), paramK);
    case 'sliding-window-maximum':
      return simulateSlidingWindowMax(parseNumberArray(rawInput), paramK);
    case 'min-size-subarray-sum':
      return simulateMinSizeSubarraySum(parseNumberArray(rawInput), paramK); // paramK acts as Target S
    case 'longest-substring-no-repeat':
      return simulateLongestSubstringNoRepeat(parseStringInput(rawInput));
    case 'longest-substring-k-distinct':
      return simulateLongestSubstringKDistinct(parseStringInput(rawInput), paramK);
    case 'fruit-into-baskets':
      return simulateFruitIntoBaskets(parseNumberArray(rawInput));
    case 'max-consecutive-ones-iii':
      return simulateMaxConsecutiveOnes(parseNumberArray(rawInput), paramK);
    case 'longest-repeating-char-replacement':
      return simulateCharacterReplacement(parseStringInput(rawInput), paramK);
    case 'permutation-in-string':
      return simulatePermutationInString(paramTarget || 'ab', parseStringInput(rawInput));
    case 'minimum-window-substring':
      return simulateMinWindowSubstring(parseStringInput(rawInput), paramTarget || 'ABC');
    case 'substring-concatenation-words':
      return simulateSubstringConcatWords(parseStringInput(rawInput), paramTarget || 'foo,bar');
    case 'subarrays-k-different-integers':
      return simulateSubarraysKDistinct(parseNumberArray(rawInput), paramK);
    case 'binary-subarrays-with-sum':
      return simulateBinarySubarraysWithSum(parseNumberArray(rawInput), paramK);
    default:
      return simulateMaxSumSubarrayK(parseNumberArray(rawInput), paramK);
  }
}

// 1. Max Sum Subarray of Size K
function simulateMaxSumSubarrayK(nums: number[], k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;
  if (n === 0 || k <= 0 || k > n) {
    return {
      steps: [{
        stepIndex: 0,
        totalSteps: 1,
        left: null,
        right: null,
        action: 'init',
        actionDescription: 'Invalid input or window size k larger than array length.',
        codeLine: 5,
        isValidWindow: false,
        currentMetricLabel: 'Window Sum',
        currentMetricValue: 0,
        targetLabel: 'Window Size (k)',
        targetValue: k,
        bestResultLabel: 'Max Sum',
        bestResultValue: 0,
        variables: { n, k },
        logMessage: 'Initialization: invalid array or k.'
      }],
      finalOutput: 0
    };
  }

  let windowSum = 0;
  let maxSum = -Infinity;
  let bestRange: [number, number] | null = null;

  // Initial step
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize fixed sliding window of size k = ${k}. Array size = ${n}.`,
    codeLine: 6,
    isValidWindow: false,
    currentMetricLabel: 'Window Sum',
    currentMetricValue: 0,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Max Sum',
    bestResultValue: 'N/A',
    variables: { windowSum: 0, k, n },
    logMessage: `Start: Building first window of size ${k}.`
  });

  // Build first window
  for (let i = 0; i < k; ++i) {
    windowSum += nums[i];
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: 0,
      right: i,
      action: 'expand',
      actionDescription: `Initial fill: Add nums[${i}] = ${nums[i]} into initial window. Running sum = ${windowSum}.`,
      codeLine: 8,
      isValidWindow: i === k - 1,
      currentMetricLabel: 'Window Sum',
      currentMetricValue: windowSum,
      targetLabel: 'Window Size (k)',
      targetValue: k,
      bestResultLabel: 'Max Sum',
      bestResultValue: 'Building...',
      variables: { i, 'nums[i]': nums[i], windowSum, k },
      logMessage: `Add index ${i} (${nums[i]}) -> window sum is now ${windowSum}.`
    });
  }

  maxSum = windowSum;
  bestRange = [0, k - 1];

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: 0,
    right: k - 1,
    action: 'record',
    actionDescription: `Initial window [0...${k - 1}] completed with sum = ${windowSum}. Record as initial maxSum = ${maxSum}.`,
    codeLine: 10,
    isValidWindow: true,
    currentMetricLabel: 'Window Sum',
    currentMetricValue: windowSum,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Max Sum',
    bestResultValue: maxSum,
    bestWindowRange: bestRange,
    variables: { L: 0, R: k - 1, windowSum, maxSum },
    logMessage: `First window evaluated: initial max sum = ${maxSum} on range [0...${k - 1}].`
  });

  let L = 0;
  for (let R = k; R < n; ++R) {
    const prevSum = windowSum;
    windowSum += nums[R] - nums[L];
    const updated = windowSum > maxSum;
    if (updated) {
      maxSum = windowSum;
      bestRange = [L + 1, R];
    }

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L + 1,
      right: R,
      action: updated ? 'record' : 'slide',
      actionDescription: `Slide window to [${L + 1}...${R}]: subtract nums[${L}] (${nums[L]}), add nums[${R}] (${nums[R]}). Sum: ${prevSum} -> ${windowSum}.${updated ? ` New Max Sum: ${maxSum}!` : ''}`,
      codeLine: 14,
      isValidWindow: true,
      currentMetricLabel: 'Window Sum',
      currentMetricValue: windowSum,
      targetLabel: 'Window Size (k)',
      targetValue: k,
      bestResultLabel: 'Max Sum',
      bestResultValue: maxSum,
      bestWindowRange: bestRange,
      variables: { L: L + 1, R, 'nums[R]': nums[R], 'nums[L]': nums[L], windowSum, maxSum },
      logMessage: `Slide to [${L + 1}...${R}]: sum = ${windowSum} (${updated ? 'NEW MAX' : 'not higher'}).`
    });

    L++;
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Scan complete. Maximum sum subarray of size ${k} is ${maxSum}.`,
    codeLine: 18,
    isValidWindow: true,
    currentMetricLabel: 'Window Sum',
    currentMetricValue: windowSum,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Max Sum',
    bestResultValue: maxSum,
    bestWindowRange: bestRange,
    variables: { maxSum, bestL: bestRange?.[0] ?? 0, bestR: bestRange?.[1] ?? 0 },
    logMessage: `Finished: optimal subarray sum is ${maxSum} at indices [${bestRange?.[0]}...${bestRange?.[1]}].`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: maxSum };
}

// 2. First Negative Integer in Every Window of Size K
function simulateFirstNegativeIntegerK(nums: number[], k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;
  const result: number[] = [];
  const queue: { index: number; value: number }[] = [];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize queue for tracking negative numbers in windows of size k = ${k}.`,
    codeLine: 6,
    isValidWindow: false,
    currentMetricLabel: 'Negatives in Queue',
    currentMetricValue: 0,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Results Collected',
    bestResultValue: '[]',
    variables: { queueSize: 0, k, n },
    auxiliaryQueue: [],
    logMessage: 'Initialized queue for negative indices.'
  });

  let L = 0;
  for (let R = 0; R < n; ++R) {
    if (nums[R] < 0) {
      queue.push({ index: R, value: nums[R] });
    }

    const windowSize = R - L + 1;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: 'expand',
      actionDescription: `Expand R to ${R} (val = ${nums[R]}). ${nums[R] < 0 ? `Negative! Pushed index ${R} to queue.` : 'Non-negative.'} Window length: ${windowSize}/${k}.`,
      codeLine: 9,
      isValidWindow: windowSize === k,
      currentMetricLabel: 'Negatives in Queue',
      currentMetricValue: queue.length,
      targetLabel: 'Window Size (k)',
      targetValue: k,
      bestResultLabel: 'Results Collected',
      bestResultValue: `[${result.join(', ')}]`,
      auxiliaryQueue: [...queue],
      variables: { L, R, 'nums[R]': nums[R], queueFront: queue[0]?.value ?? 'None' },
      logMessage: `R = ${R}: nums[${R}] = ${nums[R]}. Queue: [${queue.map(q => q.value).join(', ')}].`
    });

    if (windowSize === k) {
      // Pop expired negatives
      while (queue.length > 0 && queue[0].index < L) {
        queue.shift();
      }

      const firstNeg = queue.length > 0 ? queue[0].value : 0;
      result.push(firstNeg);

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Window [${L}...${R}] reached size ${k}. First negative is ${firstNeg === 0 ? '0 (none)' : firstNeg}. Recorded in output.`,
        codeLine: 14,
        isValidWindow: true,
        currentMetricLabel: 'First Negative',
        currentMetricValue: firstNeg,
        targetLabel: 'Window Size (k)',
        targetValue: k,
        bestResultLabel: 'Results Collected',
        bestResultValue: `[${result.join(', ')}]`,
        bestWindowRange: [L, R],
        auxiliaryQueue: [...queue],
        variables: { L, R, firstNegative: firstNeg },
        logMessage: `Window [${L}...${R}] -> First negative: ${firstNeg}.`
      });

      L++;
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: L - 1,
    right: n - 1,
    action: 'done',
    actionDescription: `Completed scan. First negative in all windows: [${result.join(', ')}].`,
    codeLine: 18,
    isValidWindow: true,
    currentMetricLabel: 'Total Windows',
    currentMetricValue: result.length,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Results Collected',
    bestResultValue: `[${result.join(', ')}]`,
    variables: { totalResults: result.length },
    auxiliaryQueue: [...queue],
    logMessage: `Done. Final result: [${result.join(', ')}].`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: result };
}

// 3. Sub-arrays of Size K and Average >= Threshold (LC #1343)
function simulateSubarraysKAvgThreshold(nums: number[], k: number, threshold: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;
  const targetSum = k * threshold;
  let windowSum = 0;
  let count = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Target threshold average = ${threshold} for window size k = ${k}. Equivalent target sum = k * threshold = ${targetSum}.`,
    codeLine: 5,
    isValidWindow: false,
    currentMetricLabel: 'Window Sum',
    currentMetricValue: 0,
    targetLabel: 'Target Sum (k * threshold)',
    targetValue: targetSum,
    bestResultLabel: 'Valid Subarrays',
    bestResultValue: 0,
    variables: { threshold, targetSum, k, n },
    logMessage: `Start: Target sum = ${targetSum} (avg >= ${threshold}).`
  });

  for (let i = 0; i < k && i < n; ++i) {
    windowSum += nums[i];
  }

  if (windowSum >= targetSum) count++;

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: 0,
    right: k - 1,
    action: windowSum >= targetSum ? 'record' : 'check',
    actionDescription: `Initial window [0...${k - 1}] sum = ${windowSum} (avg = ${(windowSum / k).toFixed(2)}). ${windowSum >= targetSum ? `Valid! (sum >= ${targetSum}). Count = 1.` : `Below threshold (sum < ${targetSum}).`}`,
    codeLine: 10,
    isValidWindow: windowSum >= targetSum,
    currentMetricLabel: 'Window Sum',
    currentMetricValue: windowSum,
    targetLabel: 'Target Sum',
    targetValue: targetSum,
    bestResultLabel: 'Valid Subarrays',
    bestResultValue: count,
    bestWindowRange: windowSum >= targetSum ? [0, k - 1] : null,
    variables: { L: 0, R: k - 1, windowSum, targetSum, count },
    logMessage: `First window [0...${k - 1}] sum ${windowSum} ${windowSum >= targetSum ? '>= target' : '< target'}. Count: ${count}.`
  });

  let L = 0;
  for (let R = k; R < n; ++R) {
    const prevSum = windowSum;
    windowSum += nums[R] - nums[L];
    const valid = windowSum >= targetSum;
    if (valid) count++;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L + 1,
      right: R,
      action: valid ? 'record' : 'slide',
      actionDescription: `Slide to [${L + 1}...${R}]: -nums[${L}] (${nums[L]}), +nums[${R}] (${nums[R]}). Sum: ${prevSum} -> ${windowSum} (avg = ${(windowSum / k).toFixed(2)}). ${valid ? `Valid! Count incremented to ${count}.` : 'Below target.'}`,
      codeLine: 14,
      isValidWindow: valid,
      currentMetricLabel: 'Window Sum',
      currentMetricValue: windowSum,
      targetLabel: 'Target Sum',
      targetValue: targetSum,
      bestResultLabel: 'Valid Subarrays',
      bestResultValue: count,
      bestWindowRange: valid ? [L + 1, R] : null,
      variables: { L: L + 1, R, windowSum, targetSum, count },
      logMessage: `Window [${L + 1}...${R}] sum = ${windowSum}, avg = ${(windowSum / k).toFixed(2)}. Total valid: ${count}.`
    });

    L++;
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: L,
    right: n - 1,
    action: 'done',
    actionDescription: `Finished scanning all windows. Total subarrays with average >= ${threshold}: ${count}.`,
    codeLine: 18,
    isValidWindow: true,
    currentMetricLabel: 'Final Count',
    currentMetricValue: count,
    targetLabel: 'Target Sum',
    targetValue: targetSum,
    bestResultLabel: 'Valid Subarrays',
    bestResultValue: count,
    variables: { totalCount: count },
    logMessage: `Completed: ${count} subarrays meet criteria.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: count };
}

// 4. Maximum Number of Vowels in a Substring (LC #1456)
function simulateMaxVowels(s: string, k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
  const n = s.length;

  let vowelCount = 0;
  for (let i = 0; i < k && i < n; ++i) {
    if (vowels.has(s[i])) vowelCount++;
  }

  let maxV = vowelCount;
  let bestRange: [number, number] | null = [0, k - 1];

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: 0,
    right: k - 1,
    action: 'record',
    actionDescription: `Initial window [0...${k - 1}] "${s.substring(0, k)}" has ${vowelCount} vowels. Initial max = ${maxV}.`,
    codeLine: 13,
    isValidWindow: true,
    currentMetricLabel: 'Vowel Count',
    currentMetricValue: vowelCount,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Max Vowels',
    bestResultValue: maxV,
    bestWindowRange: bestRange,
    variables: { L: 0, R: k - 1, vowelCount, maxV },
    logMessage: `Initial window [0...${k - 1}] has ${vowelCount} vowels.`
  });

  let L = 0;
  for (let R = k; R < n; ++R) {
    const isRVowel = vowels.has(s[R]);
    const isLVowel = vowels.has(s[L]);
    if (isRVowel) vowelCount++;
    if (isLVowel) vowelCount--;

    const updated = vowelCount > maxV;
    if (updated) {
      maxV = vowelCount;
      bestRange = [L + 1, R];
    }

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L + 1,
      right: R,
      action: updated ? 'record' : 'slide',
      actionDescription: `Slide to [${L + 1}...${R}] "${s.substring(L + 1, R + 1)}": removed '${s[L]}' (${isLVowel ? 'vowel -1' : 'consonant'}), added '${s[R]}' (${isRVowel ? 'vowel +1' : 'consonant'}). Current vowels: ${vowelCount}.${updated ? ` New Max: ${maxV}!` : ''}`,
      codeLine: 18,
      isValidWindow: true,
      currentMetricLabel: 'Vowel Count',
      currentMetricValue: vowelCount,
      targetLabel: 'Window Size (k)',
      targetValue: k,
      bestResultLabel: 'Max Vowels',
      bestResultValue: maxV,
      bestWindowRange: bestRange,
      variables: { L: L + 1, R, 's[L]': s[L], 's[R]': s[R], vowelCount, maxV },
      logMessage: `Window [${L + 1}...${R}] vowels: ${vowelCount} (Max: ${maxV}).`
    });

    L++;
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Search finished. Maximum vowels in any length-${k} substring is ${maxV}.`,
    codeLine: 23,
    isValidWindow: true,
    currentMetricLabel: 'Vowel Count',
    currentMetricValue: vowelCount,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Max Vowels',
    bestResultValue: maxV,
    bestWindowRange: bestRange,
    variables: { maxV },
    logMessage: `Completed: Maximum vowels = ${maxV}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: maxV };
}

// 5. Sliding Window Maximum (LC #239) - Monotonic Decreasing Deque
function simulateSlidingWindowMax(nums: number[], k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;
  const result: number[] = [];
  const dq: number[] = []; // store indices

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize Monotonic Decreasing Deque for window size k = ${k}. Deque will store indices in descending value order.`,
    codeLine: 4,
    isValidWindow: false,
    currentMetricLabel: 'Deque Size',
    currentMetricValue: 0,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Window Maxes',
    bestResultValue: '[]',
    monotonicDeque: [],
    variables: { k, n },
    logMessage: 'Initialized monotonic deque.'
  });

  let L = 0;
  for (let R = 0; R < n; ++R) {
    // Monotonic maintenance: pop smaller elements from back
    while (dq.length > 0 && nums[dq[dq.length - 1]] <= nums[R]) {
      const poppedIdx = dq.pop()!;
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'check',
        actionDescription: `Monotonic invariant: nums[${poppedIdx}] (${nums[poppedIdx]}) <= nums[${R}] (${nums[R]}). Popped ${poppedIdx} from back of deque.`,
        codeLine: 8,
        isValidWindow: R - L + 1 === k,
        currentMetricLabel: 'Popped Back Element',
        currentMetricValue: nums[poppedIdx],
        targetLabel: 'Window Size (k)',
        targetValue: k,
        bestResultLabel: 'Window Maxes',
        bestResultValue: `[${result.join(', ')}]`,
        monotonicDeque: dq.map((idx, i) => ({ index: idx, value: nums[idx], isFront: i === 0 })),
        variables: { L, R, poppedIndex: poppedIdx, 'nums[R]': nums[R] },
        logMessage: `Popped index ${poppedIdx} (value ${nums[poppedIdx]}) because ${nums[R]} is greater or equal.`
      });
    }

    dq.push(R);

    // Evict indices outside [L...R]
    if (dq.length > 0 && dq[0] < L) {
      const expired = dq.shift()!;
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'check',
        actionDescription: `Deque front index ${expired} is outside current window [${L}...${R}]. Popped from front.`,
        codeLine: 12,
        isValidWindow: false,
        currentMetricLabel: 'Expired Index',
        currentMetricValue: expired,
        targetLabel: 'Window Size (k)',
        targetValue: k,
        bestResultLabel: 'Window Maxes',
        bestResultValue: `[${result.join(', ')}]`,
        monotonicDeque: dq.map((idx, i) => ({ index: idx, value: nums[idx], isFront: i === 0 })),
        variables: { L, R, expiredIndex: expired },
        logMessage: `Popped expired index ${expired} from deque front.`
      });
    }

    const windowSize = R - L + 1;

    if (windowSize === k) {
      const windowMax = nums[dq[0]];
      result.push(windowMax);

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Window [${L}...${R}] of size ${k} complete. Deque front index is ${dq[0]} -> Maximum is ${windowMax}. Recorded in output!`,
        codeLine: 14,
        isValidWindow: true,
        currentMetricLabel: 'Window Maximum',
        currentMetricValue: windowMax,
        targetLabel: 'Window Size (k)',
        targetValue: k,
        bestResultLabel: 'Window Maxes',
        bestResultValue: `[${result.join(', ')}]`,
        bestWindowRange: [L, R],
        monotonicDeque: dq.map((idx, i) => ({ index: idx, value: nums[idx], isFront: i === 0 })),
        variables: { L, R, maxVal: windowMax, maxIdx: dq[0] },
        logMessage: `Window [${L}...${R}] -> Max element is ${windowMax} (index ${dq[0]}).`
      });

      L++;
    } else {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'expand',
        actionDescription: `Pushed index ${R} (${nums[R]}) to deque. Building window (${windowSize}/${k}).`,
        codeLine: 11,
        isValidWindow: false,
        currentMetricLabel: 'Deque Front (Current Max)',
        currentMetricValue: nums[dq[0]],
        targetLabel: 'Window Size (k)',
        targetValue: k,
        bestResultLabel: 'Window Maxes',
        bestResultValue: `[${result.join(', ')}]`,
        monotonicDeque: dq.map((idx, i) => ({ index: idx, value: nums[idx], isFront: i === 0 })),
        variables: { L, R, 'nums[R]': nums[R] },
        logMessage: `Expanded R to ${R} (${nums[R]}). Deque front is ${nums[dq[0]]}.`
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: L - 1,
    right: n - 1,
    action: 'done',
    actionDescription: `Finished sliding window maximum. Results: [${result.join(', ')}].`,
    codeLine: 18,
    isValidWindow: true,
    currentMetricLabel: 'Total Maxes',
    currentMetricValue: result.length,
    targetLabel: 'Window Size (k)',
    targetValue: k,
    bestResultLabel: 'Window Maxes',
    bestResultValue: `[${result.join(', ')}]`,
    monotonicDeque: dq.map((idx, i) => ({ index: idx, value: nums[idx], isFront: i === 0 })),
    variables: { totalMaxes: result.length },
    logMessage: `Completed: all window maximums collected.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: result };
}

// 6. Minimum Size Subarray Sum (LC #209)
function simulateMinSizeSubarraySum(nums: number[], target: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;
  let minLen = Infinity;
  let windowSum = 0;
  let L = 0;
  let bestRange: [number, number] | null = null;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize dynamic sliding window. Target Sum = ${target}. Expand R until sum >= ${target}, then shrink L.`,
    codeLine: 6,
    isValidWindow: false,
    currentMetricLabel: 'Window Sum',
    currentMetricValue: 0,
    targetLabel: 'Target Sum (S)',
    targetValue: target,
    bestResultLabel: 'Min Length',
    bestResultValue: 'Infinity',
    variables: { target, minLen: 'Infinity', windowSum: 0, L: 0 },
    logMessage: `Target sum is ${target}. Starting with empty window.`
  });

  for (let R = 0; R < n; ++R) {
    windowSum += nums[R];

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: 'expand',
      actionDescription: `Expand R to ${R}: add nums[${R}] = ${nums[R]}. Window Sum = ${windowSum}. Condition (${windowSum} >= ${target}) is ${windowSum >= target ? 'SATISFIED' : 'NOT MET'}.`,
      codeLine: 9,
      isValidWindow: windowSum >= target,
      currentMetricLabel: 'Window Sum',
      currentMetricValue: windowSum,
      targetLabel: 'Target Sum (S)',
      targetValue: target,
      bestResultLabel: 'Min Length',
      bestResultValue: minLen === Infinity ? 'None' : minLen,
      bestWindowRange: bestRange,
      variables: { L, R, 'nums[R]': nums[R], windowSum, target, minLen: minLen === Infinity ? 'None' : minLen },
      logMessage: `Expanded R to ${R} (${nums[R]}). Sum = ${windowSum} vs target ${target}.`
    });

    while (windowSum >= target) {
      const currentLen = R - L + 1;
      const updated = currentLen < minLen;
      if (updated) {
        minLen = currentLen;
        bestRange = [L, R];
      }

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Valid window [${L}...${R}]! Sum = ${windowSum} >= ${target}. Current length = ${currentLen}.${updated ? ` NEW MIN LENGTH: ${minLen}!` : ''}`,
        codeLine: 11,
        isValidWindow: true,
        currentMetricLabel: 'Window Sum',
        currentMetricValue: windowSum,
        targetLabel: 'Target Sum (S)',
        targetValue: target,
        bestResultLabel: 'Min Length',
        bestResultValue: minLen,
        bestWindowRange: bestRange,
        variables: { L, R, currentLen, minLen, windowSum },
        logMessage: `Valid sum ${windowSum} >= ${target} on [${L}...${R}]. Length = ${currentLen} (Min: ${minLen}).`
      });

      // Shrink step
      const removedVal = nums[L];
      windowSum -= removedVal;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1 <= R ? L + 1 : L,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink window from left: subtract nums[${L}] (${removedVal}). New sum = ${windowSum}. Increment L to ${L + 1}.`,
        codeLine: 13,
        isValidWindow: windowSum >= target,
        currentMetricLabel: 'Window Sum',
        currentMetricValue: windowSum,
        targetLabel: 'Target Sum (S)',
        targetValue: target,
        bestResultLabel: 'Min Length',
        bestResultValue: minLen,
        bestWindowRange: bestRange,
        variables: { L: L + 1, R, subtracted: removedVal, windowSum },
        logMessage: `Shrunk L: removed ${removedVal}, sum is now ${windowSum}.`
      });

      L++;
    }
  }

  const finalRes = minLen === Infinity ? 0 : minLen;

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Completed scan. Minimum subarray length with sum >= ${target} is ${finalRes}${bestRange ? ` at subarray [${bestRange[0]}...${bestRange[1]}]` : ' (no subarray found)'}.`,
    codeLine: 17,
    isValidWindow: finalRes > 0,
    currentMetricLabel: 'Final Result',
    currentMetricValue: finalRes,
    targetLabel: 'Target Sum (S)',
    targetValue: target,
    bestResultLabel: 'Min Length',
    bestResultValue: finalRes,
    bestWindowRange: bestRange,
    variables: { minLen: finalRes },
    logMessage: `Completed: Minimal length is ${finalRes}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: finalRes };
}

// 7. Longest Substring Without Repeating Characters (LC #3)
function simulateLongestSubstringNoRepeat(s: string): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = s.length;
  const freq: Record<string, number> = {};
  let maxLen = 0;
  let bestRange: [number, number] | null = null;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize dynamic window. Expand R and maintain char frequencies. If frequency > 1, shrink L until distinct.`,
    codeLine: 5,
    isValidWindow: true,
    currentMetricLabel: 'Window Length',
    currentMetricValue: 0,
    targetLabel: 'Condition',
    targetValue: 'No duplicates',
    bestResultLabel: 'Max Length',
    bestResultValue: 0,
    frequencyMap: {},
    variables: { L: 0, maxLen: 0 },
    logMessage: 'Initialized frequency map.'
  });

  for (let R = 0; R < n; ++R) {
    const char = s[R];
    freq[char] = (freq[char] || 0) + 1;

    const isDuplicate = freq[char] > 1;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: isDuplicate ? 'check' : 'expand',
      actionDescription: `Expand R to ${R} ('${char}'). Count of '${char}' in window is ${freq[char]}.${isDuplicate ? ` Duplicate found! Triggering shrink.` : ' Window distinct.'}`,
      codeLine: 8,
      isValidWindow: !isDuplicate,
      currentMetricLabel: 'Distinct Chars',
      currentMetricValue: Object.keys(freq).filter(k => freq[k] > 0).length,
      targetLabel: 'Condition',
      targetValue: isDuplicate ? `Duplicate '${char}'` : 'All Unique',
      bestResultLabel: 'Max Length',
      bestResultValue: maxLen,
      bestWindowRange: bestRange,
      frequencyMap: { ...freq },
      variables: { L, R, 's[R]': char, count: freq[char] },
      logMessage: `Added '${char}' at index ${R}. Freq = ${freq[char]}.`
    });

    while (freq[char] > 1) {
      const leftChar = s[L];
      freq[leftChar]--;
      if (freq[leftChar] === 0) delete freq[leftChar];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink L past duplicate: removed '${leftChar}' at index ${L}. Freq of '${char}' is now ${freq[char] || 0}. Increment L to ${L + 1}.`,
        codeLine: 10,
        isValidWindow: (freq[char] || 0) <= 1,
        currentMetricLabel: 'Window Length',
        currentMetricValue: R - (L + 1) + 1,
        targetLabel: 'Condition',
        targetValue: (freq[char] || 0) <= 1 ? 'Restored Unique' : 'Still Duplicate',
        bestResultLabel: 'Max Length',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        frequencyMap: { ...freq },
        variables: { L: L + 1, R, removedChar: leftChar },
        logMessage: `Shrunk L to ${L + 1}: removed '${leftChar}'.`
      });

      L++;
    }

    const currentLen = R - L + 1;
    if (currentLen > maxLen) {
      maxLen = currentLen;
      bestRange = [L, R];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Valid unique window [${L}...${R}] "${s.substring(L, R + 1)}"! New Max Length: ${maxLen}.`,
        codeLine: 13,
        isValidWindow: true,
        currentMetricLabel: 'Window Length',
        currentMetricValue: currentLen,
        targetLabel: 'Condition',
        targetValue: 'All Unique',
        bestResultLabel: 'Max Length',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        frequencyMap: { ...freq },
        variables: { L, R, maxLen, window: s.substring(L, R + 1) },
        logMessage: `Recorded new max length ${maxLen} for "${s.substring(L, R + 1)}".`
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Finished scan. Longest substring without repeating characters is "${bestRange ? s.substring(bestRange[0], bestRange[1] + 1) : ''}" with length ${maxLen}.`,
    codeLine: 15,
    isValidWindow: true,
    currentMetricLabel: 'Max Length',
    currentMetricValue: maxLen,
    targetLabel: 'Condition',
    targetValue: 'Completed',
    bestResultLabel: 'Max Length',
    bestResultValue: maxLen,
    bestWindowRange: bestRange,
    frequencyMap: { ...freq },
    variables: { maxLen, bestSubstring: bestRange ? s.substring(bestRange[0], bestRange[1] + 1) : '' },
    logMessage: `Completed: max length = ${maxLen}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: maxLen };
}

// 8. Longest Substring with At Most K Distinct Characters (LC #340)
function simulateLongestSubstringKDistinct(s: string, k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = s.length;
  const count: Record<string, number> = {};
  let maxLen = 0;
  let bestRange: [number, number] | null = null;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize dynamic window. Condition: count of distinct characters <= ${k}.`,
    codeLine: 5,
    isValidWindow: true,
    currentMetricLabel: 'Distinct Characters',
    currentMetricValue: 0,
    targetLabel: 'Max Distinct (k)',
    targetValue: k,
    bestResultLabel: 'Max Length',
    bestResultValue: 0,
    frequencyMap: {},
    variables: { k, L: 0, maxLen: 0 },
    logMessage: `Initialized: at most ${k} distinct characters allowed.`
  });

  for (let R = 0; R < n; ++R) {
    const char = s[R];
    count[char] = (count[char] || 0) + 1;
    const distinctCount = Object.keys(count).length;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: distinctCount > k ? 'check' : 'expand',
      actionDescription: `Expand R to ${R} ('${char}'). Distinct characters in window: ${distinctCount} (limit: ${k}). ${distinctCount > k ? 'Limit exceeded! Must shrink.' : 'Condition valid.'}`,
      codeLine: 7,
      isValidWindow: distinctCount <= k,
      currentMetricLabel: 'Distinct Characters',
      currentMetricValue: distinctCount,
      targetLabel: 'Max Distinct (k)',
      targetValue: k,
      bestResultLabel: 'Max Length',
      bestResultValue: maxLen,
      bestWindowRange: bestRange,
      frequencyMap: { ...count },
      variables: { L, R, distinctCount, k },
      logMessage: `R = ${R} ('${char}'): ${distinctCount} distinct chars.`
    });

    while (Object.keys(count).length > k) {
      const leftChar = s[L];
      count[leftChar]--;
      if (count[leftChar] === 0) delete count[leftChar];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink window from left: removed '${leftChar}' at index ${L}. Distinct chars now: ${Object.keys(count).length}. Increment L to ${L + 1}.`,
        codeLine: 9,
        isValidWindow: Object.keys(count).length <= k,
        currentMetricLabel: 'Distinct Characters',
        currentMetricValue: Object.keys(count).length,
        targetLabel: 'Max Distinct (k)',
        targetValue: k,
        bestResultLabel: 'Max Length',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        frequencyMap: { ...count },
        variables: { L: L + 1, R, distinctCount: Object.keys(count).length },
        logMessage: `Shrunk L to ${L + 1}: distinct chars = ${Object.keys(count).length}.`
      });

      L++;
    }

    const currentLen = R - L + 1;
    if (currentLen > maxLen) {
      maxLen = currentLen;
      bestRange = [L, R];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Valid window [${L}...${R}] with ${Object.keys(count).length} distinct chars. New Max Length: ${maxLen}!`,
        codeLine: 13,
        isValidWindow: true,
        currentMetricLabel: 'Window Length',
        currentMetricValue: currentLen,
        targetLabel: 'Max Distinct (k)',
        targetValue: k,
        bestResultLabel: 'Max Length',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        frequencyMap: { ...count },
        variables: { L, R, maxLen, distinctCount: Object.keys(count).length },
        logMessage: `New max length ${maxLen} on [${L}...${R}].`
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Scan complete. Longest substring with at most ${k} distinct characters has length ${maxLen}.`,
    codeLine: 15,
    isValidWindow: true,
    currentMetricLabel: 'Max Length',
    currentMetricValue: maxLen,
    targetLabel: 'Max Distinct (k)',
    targetValue: k,
    bestResultLabel: 'Max Length',
    bestResultValue: maxLen,
    bestWindowRange: bestRange,
    frequencyMap: { ...count },
    variables: { maxLen },
    logMessage: `Finished: max length = ${maxLen}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: maxLen };
}

// 9. Fruit Into Baskets (LC #904)
function simulateFruitIntoBaskets(fruits: number[]): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = fruits.length;
  const basket: Record<string, number> = {};
  let maxFruits = 0;
  let bestRange: [number, number] | null = null;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize two baskets. Window must contain at most 2 distinct fruit types.`,
    codeLine: 5,
    isValidWindow: true,
    currentMetricLabel: 'Fruit Types in Baskets',
    currentMetricValue: 0,
    targetLabel: 'Max Baskets',
    targetValue: 2,
    bestResultLabel: 'Max Fruits',
    bestResultValue: 0,
    frequencyMap: {},
    variables: { maxFruits: 0, L: 0 },
    logMessage: 'Initialized 2 baskets.'
  });

  for (let R = 0; R < n; ++R) {
    const fruit = fruits[R].toString();
    basket[fruit] = (basket[fruit] || 0) + 1;
    const typeCount = Object.keys(basket).length;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: typeCount > 2 ? 'check' : 'expand',
      actionDescription: `Pick fruit at index ${R} (type ${fruit}). Fruit types currently collected: ${typeCount}/2. ${typeCount > 2 ? 'Need 3rd basket! Shrinking L.' : 'Fits in 2 baskets.'}`,
      codeLine: 7,
      isValidWindow: typeCount <= 2,
      currentMetricLabel: 'Fruit Types',
      currentMetricValue: typeCount,
      targetLabel: 'Max Baskets',
      targetValue: 2,
      bestResultLabel: 'Max Fruits',
      bestResultValue: maxFruits,
      bestWindowRange: bestRange,
      frequencyMap: { ...basket },
      variables: { L, R, fruitType: fruit, typeCount },
      logMessage: `Picked fruit type ${fruit}. Types: ${typeCount}.`
    });

    while (Object.keys(basket).length > 2) {
      const leftFruit = fruits[L].toString();
      basket[leftFruit]--;
      if (basket[leftFruit] === 0) delete basket[leftFruit];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Drop fruit from left: removed type ${leftFruit} at index ${L}. Types remaining: ${Object.keys(basket).length}. Increment L to ${L + 1}.`,
        codeLine: 9,
        isValidWindow: Object.keys(basket).length <= 2,
        currentMetricLabel: 'Fruit Types',
        currentMetricValue: Object.keys(basket).length,
        targetLabel: 'Max Baskets',
        targetValue: 2,
        bestResultLabel: 'Max Fruits',
        bestResultValue: maxFruits,
        bestWindowRange: bestRange,
        frequencyMap: { ...basket },
        variables: { L: L + 1, R, remainingTypes: Object.keys(basket).length },
        logMessage: `Dropped fruit ${leftFruit}. Basket types: ${Object.keys(basket).length}.`
      });

      L++;
    }

    const currentFruits = R - L + 1;
    if (currentFruits > maxFruits) {
      maxFruits = currentFruits;
      bestRange = [L, R];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Valid collection [${L}...${R}]! Total fruits = ${currentFruits}. New Max Fruits: ${maxFruits}!`,
        codeLine: 13,
        isValidWindow: true,
        currentMetricLabel: 'Total Fruits in Window',
        currentMetricValue: currentFruits,
        targetLabel: 'Max Baskets',
        targetValue: 2,
        bestResultLabel: 'Max Fruits',
        bestResultValue: maxFruits,
        bestWindowRange: bestRange,
        frequencyMap: { ...basket },
        variables: { L, R, maxFruits },
        logMessage: `New record: ${maxFruits} fruits on [${L}...${R}].`
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Completed fruit picking. Maximum harvest is ${maxFruits} fruits.`,
    codeLine: 15,
    isValidWindow: true,
    currentMetricLabel: 'Max Fruits',
    currentMetricValue: maxFruits,
    targetLabel: 'Max Baskets',
    targetValue: 2,
    bestResultLabel: 'Max Fruits',
    bestResultValue: maxFruits,
    bestWindowRange: bestRange,
    frequencyMap: { ...basket },
    variables: { maxFruits },
    logMessage: `Finished: max fruits = ${maxFruits}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: maxFruits };
}

// 10. Max Consecutive Ones III (LC #1004)
function simulateMaxConsecutiveOnes(nums: number[], k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;
  let zeroCount = 0;
  let maxLen = 0;
  let bestRange: [number, number] | null = null;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize dynamic window. Allowed zero flips k = ${k}. Invariant: zeroCount <= ${k}.`,
    codeLine: 5,
    isValidWindow: true,
    currentMetricLabel: 'Zero Count in Window',
    currentMetricValue: 0,
    targetLabel: 'Max Flips (k)',
    targetValue: k,
    bestResultLabel: 'Max Consecutive 1s',
    bestResultValue: 0,
    variables: { zeroCount: 0, k, L: 0 },
    logMessage: `Initialized: flip budget k = ${k}.`
  });

  for (let R = 0; R < n; ++R) {
    if (nums[R] === 0) zeroCount++;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: zeroCount > k ? 'check' : 'expand',
      actionDescription: `Expand R to ${R} (value ${nums[R]}). Total zeros in window: ${zeroCount} (limit: ${k}). ${zeroCount > k ? 'Budget exceeded! Shrinking L.' : 'Budget OK.'}`,
      codeLine: 8,
      isValidWindow: zeroCount <= k,
      currentMetricLabel: 'Zeros in Window',
      currentMetricValue: zeroCount,
      targetLabel: 'Max Flips (k)',
      targetValue: k,
      bestResultLabel: 'Max Consecutive 1s',
      bestResultValue: maxLen,
      bestWindowRange: bestRange,
      variables: { L, R, 'nums[R]': nums[R], zeroCount, k },
      logMessage: `R = ${R} (${nums[R]}): zero count = ${zeroCount}.`
    });

    while (zeroCount > k) {
      if (nums[L] === 0) zeroCount--;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink window from left: nums[${L}] = ${nums[L]} removed. Zeros in window now: ${zeroCount}. Increment L to ${L + 1}.`,
        codeLine: 10,
        isValidWindow: zeroCount <= k,
        currentMetricLabel: 'Zeros in Window',
        currentMetricValue: zeroCount,
        targetLabel: 'Max Flips (k)',
        targetValue: k,
        bestResultLabel: 'Max Consecutive 1s',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        variables: { L: L + 1, R, zeroCount },
        logMessage: `Shrunk L to ${L + 1}: zero count = ${zeroCount}.`
      });

      L++;
    }

    const currentLen = R - L + 1;
    if (currentLen > maxLen) {
      maxLen = currentLen;
      bestRange = [L, R];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Valid window [${L}...${R}] with ${zeroCount} zeros flipped! Length = ${currentLen}. New Max: ${maxLen}!`,
        codeLine: 13,
        isValidWindow: true,
        currentMetricLabel: 'Window Length',
        currentMetricValue: currentLen,
        targetLabel: 'Max Flips (k)',
        targetValue: k,
        bestResultLabel: 'Max Consecutive 1s',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        variables: { L, R, maxLen, zeroCount },
        logMessage: `New max consecutive 1s: ${maxLen} on [${L}...${R}].`
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Completed scan. Maximum consecutive 1s achievable with ${k} flips is ${maxLen}.`,
    codeLine: 15,
    isValidWindow: true,
    currentMetricLabel: 'Max Consecutive 1s',
    currentMetricValue: maxLen,
    targetLabel: 'Max Flips (k)',
    targetValue: k,
    bestResultLabel: 'Max Consecutive 1s',
    bestResultValue: maxLen,
    bestWindowRange: bestRange,
    variables: { maxLen },
    logMessage: `Completed: max length = ${maxLen}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: maxLen };
}

// 11. Longest Repeating Character Replacement (LC #424)
function simulateCharacterReplacement(s: string, k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = s.length;
  const count: Record<string, number> = {};
  let maxFreq = 0;
  let maxLen = 0;
  let bestRange: [number, number] | null = null;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize window. Condition: (windowLength - maxFreq) <= k. Allowed replacements k = ${k}.`,
    codeLine: 5,
    isValidWindow: true,
    currentMetricLabel: 'Replacements Needed',
    currentMetricValue: 0,
    targetLabel: 'Max Replacements (k)',
    targetValue: k,
    bestResultLabel: 'Max Length',
    bestResultValue: 0,
    frequencyMap: {},
    variables: { k, L: 0, maxFreq: 0, maxLen: 0 },
    logMessage: `Initialized: replacement limit k = ${k}.`
  });

  for (let R = 0; R < n; ++R) {
    const char = s[R];
    count[char] = (count[char] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[char]);

    let windowLen = R - L + 1;
    let replacementsNeeded = windowLen - maxFreq;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: replacementsNeeded > k ? 'check' : 'expand',
      actionDescription: `Expand R to ${R} ('${char}'). Max freq in window: ${maxFreq}. Replacements needed: ${windowLen} - ${maxFreq} = ${replacementsNeeded} (limit: ${k}). ${replacementsNeeded > k ? 'Exceeds budget! Must shrink.' : 'Valid.'}`,
      codeLine: 9,
      isValidWindow: replacementsNeeded <= k,
      currentMetricLabel: 'Replacements Needed',
      currentMetricValue: replacementsNeeded,
      targetLabel: 'Max Replacements (k)',
      targetValue: k,
      bestResultLabel: 'Max Length',
      bestResultValue: maxLen,
      bestWindowRange: bestRange,
      frequencyMap: { ...count },
      variables: { L, R, windowLen, maxFreq, replacementsNeeded },
      logMessage: `R = ${R} ('${char}'): needed = ${replacementsNeeded}, budget = ${k}.`
    });

    while ((R - L + 1) - maxFreq > k) {
      const leftChar = s[L];
      count[leftChar]--;
      if (count[leftChar] === 0) delete count[leftChar];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink window: removed '${leftChar}' at index ${L}. Increment L to ${L + 1}.`,
        codeLine: 12,
        isValidWindow: ((R - (L + 1) + 1) - maxFreq) <= k,
        currentMetricLabel: 'Window Length',
        currentMetricValue: R - (L + 1) + 1,
        targetLabel: 'Max Replacements (k)',
        targetValue: k,
        bestResultLabel: 'Max Length',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        frequencyMap: { ...count },
        variables: { L: L + 1, R },
        logMessage: `Shrunk L to ${L + 1}.`
      });

      L++;
    }

    windowLen = R - L + 1;
    if (windowLen > maxLen) {
      maxLen = windowLen;
      bestRange = [L, R];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Valid window [${L}...${R}]! New Max Length: ${maxLen}!`,
        codeLine: 14,
        isValidWindow: true,
        currentMetricLabel: 'Window Length',
        currentMetricValue: windowLen,
        targetLabel: 'Max Replacements (k)',
        targetValue: k,
        bestResultLabel: 'Max Length',
        bestResultValue: maxLen,
        bestWindowRange: bestRange,
        frequencyMap: { ...count },
        variables: { L, R, maxLen },
        logMessage: `Recorded new max length ${maxLen} on [${L}...${R}].`
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : n - 1,
    action: 'done',
    actionDescription: `Scan complete. Longest repeating substring obtainable is ${maxLen}.`,
    codeLine: 16,
    isValidWindow: true,
    currentMetricLabel: 'Max Length',
    currentMetricValue: maxLen,
    targetLabel: 'Max Replacements (k)',
    targetValue: k,
    bestResultLabel: 'Max Length',
    bestResultValue: maxLen,
    bestWindowRange: bestRange,
    frequencyMap: { ...count },
    variables: { maxLen },
    logMessage: `Finished: max length = ${maxLen}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: maxLen };
}

// 12. Permutation in String / Find All Anagrams (LC #567)
function simulatePermutationInString(s1: string, s2: string): SimulationResult {
  const steps: SimulationStep[] = [];
  const k = s1.length;
  const n = s2.length;
  const targetMap: Record<string, number> = {};
  const windowMap: Record<string, number> = {};

  for (const c of s1) {
    targetMap[c] = (targetMap[c] || 0) + 1;
  }

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Target pattern s1 = "${s1}" (length ${k}). Target frequencies: ${JSON.stringify(targetMap)}. Search in s2 = "${s2}".`,
    codeLine: 5,
    isValidWindow: false,
    currentMetricLabel: 'Window Frequencies',
    currentMetricValue: 0,
    targetLabel: 'Pattern s1',
    targetValue: s1,
    bestResultLabel: 'Permutation Found',
    bestResultValue: 'false',
    requiredFrequencyMap: { ...targetMap },
    frequencyMap: {},
    variables: { k, s1, s2Length: n },
    logMessage: `Target pattern "${s1}" setup.`
  });

  let found = false;
  let matchRange: [number, number] | null = null;
  let L = 0;

  for (let R = 0; R < n; ++R) {
    const char = s2[R];
    windowMap[char] = (windowMap[char] || 0) + 1;

    // Shrink if window size exceeds k
    if (R - L + 1 > k) {
      const leftChar = s2[L];
      windowMap[leftChar]--;
      if (windowMap[leftChar] === 0) delete windowMap[leftChar];
      L++;
    }

    const isFullSize = R - L + 1 === k;
    let isMatch = false;

    if (isFullSize) {
      isMatch = true;
      for (const key of Object.keys(targetMap)) {
        if (windowMap[key] !== targetMap[key]) {
          isMatch = false;
          break;
        }
      }
      for (const key of Object.keys(windowMap)) {
        if (windowMap[key] !== targetMap[key]) {
          isMatch = false;
          break;
        }
      }
    }

    if (isMatch) {
      found = true;
      matchRange = [L, R];
    }

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: isMatch ? 'record' : 'expand',
      actionDescription: isMatch 
        ? `MATCH FOUND! Substring "${s2.substring(L, R + 1)}" on [${L}...${R}] is a valid permutation of "${s1}"!`
        : `Window [${L}...${R}] "${s2.substring(L, R + 1)}": ${isFullSize ? 'frequencies do not match target.' : `building window (${R - L + 1}/${k}).`}`,
      codeLine: isMatch ? 15 : 9,
      isValidWindow: isMatch,
      currentMetricLabel: 'Window Size',
      currentMetricValue: `${R - L + 1}/${k}`,
      targetLabel: 'Pattern s1',
      targetValue: s1,
      bestResultLabel: 'Permutation Found',
      bestResultValue: found ? 'TRUE' : 'false',
      bestWindowRange: matchRange,
      requiredFrequencyMap: { ...targetMap },
      frequencyMap: { ...windowMap },
      variables: { L, R, windowSubstr: s2.substring(L, R + 1), isMatch },
      logMessage: `[${L}...${R}] "${s2.substring(L, R + 1)}": ${isMatch ? 'MATCH!' : 'no match'}.`
    });

    if (isMatch) break;
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: matchRange ? matchRange[0] : 0,
    right: matchRange ? matchRange[1] : n - 1,
    action: 'done',
    actionDescription: found 
      ? `Completed: Permutation of "${s1}" found at index range [${matchRange?.[0]}...${matchRange?.[1]}]!`
      : `Completed: No permutation of "${s1}" exists in "${s2}".`,
    codeLine: 18,
    isValidWindow: found,
    currentMetricLabel: 'Result',
    currentMetricValue: found ? 'MATCH FOUND' : 'NOT FOUND',
    targetLabel: 'Pattern s1',
    targetValue: s1,
    bestResultLabel: 'Permutation Found',
    bestResultValue: found ? 'TRUE' : 'FALSE',
    bestWindowRange: matchRange,
    requiredFrequencyMap: { ...targetMap },
    frequencyMap: { ...windowMap },
    variables: { found },
    logMessage: `Finished search: result is ${found}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: found };
}

// 13. Minimum Window Substring (LC #76)
function simulateMinWindowSubstring(s: string, t: string): SimulationResult {
  const steps: SimulationStep[] = [];
  const targetFreq: Record<string, number> = {};
  const windowFreq: Record<string, number> = {};

  for (const c of t) {
    targetFreq[c] = (targetFreq[c] || 0) + 1;
  }

  const required = Object.keys(targetFreq).length;
  let matched = 0;
  let minLen = Infinity;
  let bestL = 0;
  let bestRange: [number, number] | null = null;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize Minimum Window Substring. Target t = "${t}" requires ${required} unique character frequencies. Expand R to satisfy all, then shrink L.`,
    codeLine: 5,
    isValidWindow: false,
    currentMetricLabel: 'Matched Characters',
    currentMetricValue: `0 / ${required}`,
    targetLabel: 'Required Chars',
    targetValue: required,
    bestResultLabel: 'Min Window',
    bestResultValue: '""',
    matchedCount: 0,
    requiredCount: required,
    requiredFrequencyMap: { ...targetFreq },
    frequencyMap: {},
    variables: { required, matched: 0, minLen: 'Infinity' },
    logMessage: `Target "${t}" requires ${required} distinct character counts.`
  });

  for (let R = 0; R < s.length; ++R) {
    const c = s[R];
    windowFreq[c] = (windowFreq[c] || 0) + 1;

    if (targetFreq[c] !== undefined && windowFreq[c] === targetFreq[c]) {
      matched++;
    }

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: 'expand',
      actionDescription: `Expand R to ${R} ('${c}'). Matched: ${matched}/${required} characters.${matched === required ? ' All required counts fulfilled! Window is valid.' : ''}`,
      codeLine: 12,
      isValidWindow: matched === required,
      currentMetricLabel: 'Matched Characters',
      currentMetricValue: `${matched} / ${required}`,
      targetLabel: 'Required Chars',
      targetValue: required,
      bestResultLabel: 'Min Window',
      bestResultValue: minLen === Infinity ? '""' : `"${s.substring(bestL, bestL + minLen)}"`,
      bestWindowRange: bestRange,
      matchedCount: matched,
      requiredCount: required,
      requiredFrequencyMap: { ...targetFreq },
      frequencyMap: { ...windowFreq },
      variables: { L, R, 's[R]': c, matched, required },
      logMessage: `R = ${R} ('${c}'): matched ${matched}/${required}.`
    });

    while (matched === required) {
      const windowLen = R - L + 1;
      const updated = windowLen < minLen;
      if (updated) {
        minLen = windowLen;
        bestL = L;
        bestRange = [L, R];
      }

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L,
        right: R,
        action: 'record',
        actionDescription: `Valid window [${L}...${R}] "${s.substring(L, R + 1)}" contains all chars of "${t}"! Length = ${windowLen}.${updated ? ` NEW MIN LENGTH: ${minLen}!` : ''}`,
        codeLine: 17,
        isValidWindow: true,
        currentMetricLabel: 'Matched Characters',
        currentMetricValue: `${matched} / ${required}`,
        targetLabel: 'Required Chars',
        targetValue: required,
        bestResultLabel: 'Min Window',
        bestResultValue: `"${s.substring(bestL, bestL + minLen)}" (len ${minLen})`,
        bestWindowRange: bestRange,
        matchedCount: matched,
        requiredCount: required,
        requiredFrequencyMap: { ...targetFreq },
        frequencyMap: { ...windowFreq },
        variables: { L, R, minLen, bestSubstr: s.substring(bestL, bestL + minLen) },
        logMessage: `Valid window "${s.substring(L, R + 1)}" (len ${windowLen}). Min = ${minLen}.`
      });

      // Shrink from left
      const leftChar = s[L];
      windowFreq[leftChar]--;
      if (targetFreq[leftChar] !== undefined && windowFreq[leftChar] < targetFreq[leftChar]) {
        matched--;
      }

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink window from left: removed '${leftChar}' at index ${L}. Matched is now ${matched}/${required}. Increment L to ${L + 1}.`,
        codeLine: 23,
        isValidWindow: matched === required,
        currentMetricLabel: 'Matched Characters',
        currentMetricValue: `${matched} / ${required}`,
        targetLabel: 'Required Chars',
        targetValue: required,
        bestResultLabel: 'Min Window',
        bestResultValue: `"${s.substring(bestL, bestL + minLen)}"`,
        bestWindowRange: bestRange,
        matchedCount: matched,
        requiredCount: required,
        requiredFrequencyMap: { ...targetFreq },
        frequencyMap: { ...windowFreq },
        variables: { L: L + 1, R, leftChar, matched },
        logMessage: `Shrunk L to ${L + 1}: removed '${leftChar}', matched = ${matched}.`
      });

      L++;
    }
  }

  const finalStr = minLen === Infinity ? '' : s.substring(bestL, bestL + minLen);

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: bestRange ? bestRange[0] : 0,
    right: bestRange ? bestRange[1] : s.length - 1,
    action: 'done',
    actionDescription: `Search finished. Minimal window substring is "${finalStr}"${bestRange ? ` (length ${minLen}) at indices [${bestRange[0]}...${bestRange[1]}]` : ' (none exists)'}.`,
    codeLine: 27,
    isValidWindow: finalStr.length > 0,
    currentMetricLabel: 'Final Result',
    currentMetricValue: finalStr.length > 0 ? `Length ${finalStr.length}` : 'Empty',
    targetLabel: 'Required Chars',
    targetValue: required,
    bestResultLabel: 'Min Window',
    bestResultValue: `"${finalStr}"`,
    bestWindowRange: bestRange,
    matchedCount: matched,
    requiredCount: required,
    requiredFrequencyMap: { ...targetFreq },
    frequencyMap: { ...windowFreq },
    variables: { finalResult: finalStr },
    logMessage: `Finished: optimal window is "${finalStr}".`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: finalStr };
}

// 14. Substring with Concatenation of All Words (LC #30)
function simulateSubstringConcatWords(s: string, wordsRaw: string): SimulationResult {
  const steps: SimulationStep[] = [];
  const words = wordsRaw.split(/[\s,]+/).map(w => w.trim()).filter(w => w.length > 0);
  const result: number[] = [];

  if (words.length === 0 || s.length === 0) {
    return {
      steps: [{
        stepIndex: 0,
        totalSteps: 1,
        left: null,
        right: null,
        action: 'done',
        actionDescription: 'No words provided.',
        codeLine: 4,
        isValidWindow: false,
        currentMetricLabel: 'Result',
        currentMetricValue: '[]',
        bestResultLabel: 'Matches',
        bestResultValue: '[]',
        variables: {},
        logMessage: 'Empty input.'
      }],
      finalOutput: []
    };
  }

  const wordLen = words[0].length;
  const numWords = words.length;
  const totalLen = wordLen * numWords;

  const wordCount: Record<string, number> = {};
  for (const w of words) wordCount[w] = (wordCount[w] || 0) + 1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Initialize chunked sliding window. Words = [${words.join(', ')}]. Word length = ${wordLen}, Total words = ${numWords}, Full window size = ${totalLen}.`,
    codeLine: 8,
    isValidWindow: false,
    currentMetricLabel: 'Words Matched',
    currentMetricValue: `0 / ${numWords}`,
    targetLabel: 'Total Window Length',
    targetValue: totalLen,
    bestResultLabel: 'Indices Found',
    bestResultValue: '[]',
    requiredFrequencyMap: { ...wordCount },
    variables: { wordLen, numWords, totalLen },
    logMessage: `Chunked window: stride ${wordLen}, total ${totalLen}.`
  });

  // Check offsets
  for (let offset = 0; offset < wordLen && offset + totalLen <= s.length; ++offset) {
    let L = offset;
    let seen: Record<string, number> = {};
    let count = 0;

    for (let R = offset; R + wordLen <= s.length; R += wordLen) {
      const word = s.substring(R, R + wordLen);

      if (wordCount[word] !== undefined) {
        seen[word] = (seen[word] || 0) + 1;
        count++;

        while (seen[word] > wordCount[word]) {
          const leftWord = s.substring(L, L + wordLen);
          seen[leftWord]--;
          count--;
          L += wordLen;
        }

        const isMatch = count === numWords;
        if (isMatch) {
          result.push(L);
        }

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          left: L,
          right: R + wordLen - 1,
          action: isMatch ? 'record' : 'expand',
          actionDescription: isMatch
            ? `CONCATENATION FOUND! Substring "${s.substring(L, L + totalLen)}" starting at index ${L} matches all words!`
            : `Word chunk "${word}" at index ${R}. Valid words in chunk: ${count}/${numWords}.`,
          codeLine: isMatch ? 27 : 17,
          isValidWindow: isMatch,
          currentMetricLabel: 'Words Matched',
          currentMetricValue: `${count} / ${numWords}`,
          targetLabel: 'Total Length',
          targetValue: totalLen,
          bestResultLabel: 'Indices Found',
          bestResultValue: `[${result.join(', ')}]`,
          bestWindowRange: isMatch ? [L, L + totalLen - 1] : null,
          frequencyMap: { ...seen },
          requiredFrequencyMap: { ...wordCount },
          variables: { L, R, word, count, numWords },
          logMessage: `Chunk [${L}...${R + wordLen - 1}] "${word}": ${count}/${numWords} matched.`
        });
      } else {
        seen = {};
        count = 0;
        L = R + wordLen;

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          left: L,
          right: R + wordLen - 1,
          action: 'slide',
          actionDescription: `Word "${word}" is not in dictionary. Reset window to start at ${L}.`,
          codeLine: 31,
          isValidWindow: false,
          currentMetricLabel: 'Words Matched',
          currentMetricValue: `0 / ${numWords}`,
          targetLabel: 'Total Length',
          targetValue: totalLen,
          bestResultLabel: 'Indices Found',
          bestResultValue: `[${result.join(', ')}]`,
          frequencyMap: {},
          requiredFrequencyMap: { ...wordCount },
          variables: { L, R, invalidWord: word },
          logMessage: `Invalid word "${word}" -> reset window to ${L}.`
        });
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: result.length > 0 ? result[0] : 0,
    right: result.length > 0 ? result[0] + totalLen - 1 : s.length - 1,
    action: 'done',
    actionDescription: `Scan complete. Starting indices with valid concatenation: [${result.join(', ')}].`,
    codeLine: 35,
    isValidWindow: result.length > 0,
    currentMetricLabel: 'Total Matches',
    currentMetricValue: result.length,
    targetLabel: 'Total Length',
    targetValue: totalLen,
    bestResultLabel: 'Indices Found',
    bestResultValue: `[${result.join(', ')}]`,
    variables: { totalMatches: result.length },
    logMessage: `Finished. Matches: [${result.join(', ')}].`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: result };
}

// 15. Subarrays with K Different Integers (LC #992) - Exact K Pattern
function simulateSubarraysKDistinct(nums: number[], k: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;

  // Simulate atMost(k)
  const count: Record<string, number> = {};
  let totalAtMostK = 0;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Exact-K Principle: exact(K) = atMost(K) - atMost(K - 1). Simulating window for atMost(K = ${k}).`,
    codeLine: 4,
    isValidWindow: true,
    currentMetricLabel: 'Distinct in Window',
    currentMetricValue: 0,
    targetLabel: 'Max Distinct (k)',
    targetValue: k,
    bestResultLabel: 'Subarrays Count (atMost)',
    bestResultValue: 0,
    frequencyMap: {},
    variables: { k, L: 0, total: 0 },
    logMessage: `Simulating atMost(${k}): each window [L...R] adds (R - L + 1) valid subarrays.`
  });

  for (let R = 0; R < n; ++R) {
    const val = nums[R].toString();
    count[val] = (count[val] || 0) + 1;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: Object.keys(count).length > k ? 'check' : 'expand',
      actionDescription: `Expand R to ${R} (nums[${R}] = ${nums[R]}). Distinct elements: ${Object.keys(count).length}/${k}. ${Object.keys(count).length > k ? 'Exceeds k! Shrinking.' : 'Valid.'}`,
      codeLine: 7,
      isValidWindow: Object.keys(count).length <= k,
      currentMetricLabel: 'Distinct in Window',
      currentMetricValue: Object.keys(count).length,
      targetLabel: 'Max Distinct (k)',
      targetValue: k,
      bestResultLabel: 'Subarrays Count',
      bestResultValue: totalAtMostK,
      frequencyMap: { ...count },
      variables: { L, R, distinct: Object.keys(count).length, k },
      logMessage: `R = ${R}: ${Object.keys(count).length} distinct.`
    });

    while (Object.keys(count).length > k) {
      const leftVal = nums[L].toString();
      count[leftVal]--;
      if (count[leftVal] === 0) delete count[leftVal];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink window from left: removed nums[${L}] (${leftVal}). Distinct count: ${Object.keys(count).length}. Increment L to ${L + 1}.`,
        codeLine: 9,
        isValidWindow: Object.keys(count).length <= k,
        currentMetricLabel: 'Distinct in Window',
        currentMetricValue: Object.keys(count).length,
        targetLabel: 'Max Distinct (k)',
        targetValue: k,
        bestResultLabel: 'Subarrays Count',
        bestResultValue: totalAtMostK,
        frequencyMap: { ...count },
        variables: { L: L + 1, R, distinct: Object.keys(count).length },
        logMessage: `Shrunk L to ${L + 1}: distinct = ${Object.keys(count).length}.`
      });

      L++;
    }

    const added = R - L + 1;
    totalAtMostK += added;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: 'record',
      actionDescription: `Window [${L}...${R}] has <= ${k} distinct. Contributes (R - L + 1) = ${added} subarrays ending at R. Running total = ${totalAtMostK}.`,
      codeLine: 13,
      isValidWindow: true,
      currentMetricLabel: 'Subarrays Ending at R',
      currentMetricValue: added,
      targetLabel: 'Max Distinct (k)',
      targetValue: k,
      bestResultLabel: 'Subarrays Count',
      bestResultValue: totalAtMostK,
      bestWindowRange: [L, R],
      frequencyMap: { ...count },
      variables: { L, R, added, totalAtMostK },
      logMessage: `Added ${added} subarrays on [${L}...${R}]. Total = ${totalAtMostK}.`
    });
  }

  // Calculate atMost(k-1) to get the exact answer
  function calcAtMost(kVal: number): number {
    if (kVal <= 0) return 0;
    const c: Record<string, number> = {};
    let tot = 0, l = 0;
    for (let r = 0; r < n; ++r) {
      const v = nums[r].toString();
      c[v] = (c[v] || 0) + 1;
      while (Object.keys(c).length > kVal) {
        const lv = nums[l].toString();
        c[lv]--;
        if (c[lv] === 0) delete c[lv];
        l++;
      }
      tot += (r - l + 1);
    }
    return tot;
  }

  const atMostKMinus1 = calcAtMost(k - 1);
  const exactK = totalAtMostK - atMostKMinus1;

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: 0,
    right: n - 1,
    action: 'done',
    actionDescription: `Calculation: atMost(${k}) = ${totalAtMostK}, atMost(${k - 1}) = ${atMostKMinus1}. Exactly ${k} distinct subarrays = ${totalAtMostK} - ${atMostKMinus1} = ${exactK}!`,
    codeLine: 17,
    isValidWindow: true,
    currentMetricLabel: 'Exact Result',
    currentMetricValue: exactK,
    targetLabel: 'Formula',
    targetValue: `atMost(${k}) - atMost(${k - 1})`,
    bestResultLabel: 'Exact K Subarrays',
    bestResultValue: exactK,
    variables: { atMostK: totalAtMostK, atMostKMinus1, exactK },
    logMessage: `Finished: exact(${k}) = ${exactK}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: exactK };
}

// 16. Binary Subarrays With Sum (LC #930) - Exact K Pattern
function simulateBinarySubarraysWithSum(nums: number[], goal: number): SimulationResult {
  const steps: SimulationStep[] = [];
  const n = nums.length;

  let sum = 0;
  let countAtMostGoal = 0;
  let L = 0;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    left: null,
    right: null,
    action: 'init',
    actionDescription: `Exact-K Principle for sum: count(goal) = atMost(goal) - atMost(goal - 1). Simulating atMost(goal = ${goal}).`,
    codeLine: 4,
    isValidWindow: true,
    currentMetricLabel: 'Window Sum',
    currentMetricValue: 0,
    targetLabel: 'Goal Sum',
    targetValue: goal,
    bestResultLabel: 'Subarrays Count',
    bestResultValue: 0,
    variables: { goal, sum: 0, L: 0 },
    logMessage: `Simulating atMost(${goal}).`
  });

  for (let R = 0; R < n; ++R) {
    sum += nums[R];

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: sum > goal ? 'check' : 'expand',
      actionDescription: `Expand R to ${R} (nums[${R}] = ${nums[R]}). Window sum = ${sum} (goal = ${goal}). ${sum > goal ? 'Exceeds goal! Shrinking.' : 'Valid.'}`,
      codeLine: 7,
      isValidWindow: sum <= goal,
      currentMetricLabel: 'Window Sum',
      currentMetricValue: sum,
      targetLabel: 'Goal Sum',
      targetValue: goal,
      bestResultLabel: 'Subarrays Count',
      bestResultValue: countAtMostGoal,
      variables: { L, R, 'nums[R]': nums[R], sum, goal },
      logMessage: `R = ${R} (${nums[R]}): sum = ${sum}.`
    });

    while (sum > goal && L <= R) {
      sum -= nums[L];

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        left: L + 1,
        right: R,
        action: 'shrink',
        actionDescription: `Shrink window from left: subtracted nums[${L}] (${nums[L]}). New sum = ${sum}. Increment L to ${L + 1}.`,
        codeLine: 9,
        isValidWindow: sum <= goal,
        currentMetricLabel: 'Window Sum',
        currentMetricValue: sum,
        targetLabel: 'Goal Sum',
        targetValue: goal,
        bestResultLabel: 'Subarrays Count',
        bestResultValue: countAtMostGoal,
        variables: { L: L + 1, R, sum },
        logMessage: `Shrunk L to ${L + 1}: sum = ${sum}.`
      });

      L++;
    }

    const added = R - L + 1;
    countAtMostGoal += added;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      left: L,
      right: R,
      action: 'record',
      actionDescription: `Window [${L}...${R}] has sum <= ${goal}. Adds (R - L + 1) = ${added} subarrays. Running total: ${countAtMostGoal}.`,
      codeLine: 12,
      isValidWindow: true,
      currentMetricLabel: 'Subarrays Ending at R',
      currentMetricValue: added,
      targetLabel: 'Goal Sum',
      targetValue: goal,
      bestResultLabel: 'Subarrays Count',
      bestResultValue: countAtMostGoal,
      bestWindowRange: [L, R],
      variables: { L, R, added, countAtMostGoal },
      logMessage: `Added ${added} subarrays on [${L}...${R}]. Total = ${countAtMostGoal}.`
    });
  }

  function calcAtMostSum(g: number): number {
    if (g < 0) return 0;
    let s = 0, c = 0, l = 0;
    for (let r = 0; r < n; ++r) {
      s += nums[r];
      while (s > g && l <= r) {
        s -= nums[l];
        l++;
      }
      c += (r - l + 1);
    }
    return c;
  }

  const atMostGoalMinus1 = calcAtMostSum(goal - 1);
  const exactCount = countAtMostGoal - atMostGoalMinus1;

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    left: 0,
    right: n - 1,
    action: 'done',
    actionDescription: `Calculation: atMost(${goal}) = ${countAtMostGoal}, atMost(${goal - 1}) = ${atMostGoalMinus1}. Subarrays with exact sum ${goal} = ${countAtMostGoal} - ${atMostGoalMinus1} = ${exactCount}!`,
    codeLine: 16,
    isValidWindow: true,
    currentMetricLabel: 'Exact Result',
    currentMetricValue: exactCount,
    targetLabel: 'Formula',
    targetValue: `atMost(${goal}) - atMost(${goal - 1})`,
    bestResultLabel: 'Exact Sum Subarrays',
    bestResultValue: exactCount,
    variables: { atMostGoal: countAtMostGoal, atMostGoalMinus1, exactCount },
    logMessage: `Finished: exact count with sum ${goal} = ${exactCount}.`
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return { steps, finalOutput: exactCount };
}
