import { SimulationStep, SimulationData } from '../types';

export function generateSimulation(problemId: string, input: Record<string, any>): SimulationData {
  const steps: SimulationStep[] = [];
  let expectedOutput = '';

  switch (problemId) {
    case 'lc303': {
      // Input: nums (array), L (number), R (number)
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      }
      const nums = Array.isArray(rawNums) ? rawNums : [3, -2, 5, -3, 8, -4];
      const L = typeof input.L !== 'undefined' ? parseInt(input.L, 10) : 2;
      const R = typeof input.R !== 'undefined' ? parseInt(input.R, 10) : 4;

      const n = nums.length;
      const prefix: number[] = new Array(n + 1).fill(0);

      // Step 1: Initializing
      steps.push({
        line: 1,
        description: `Starting range sum visualizer constructor. Input array: [${nums.join(', ')}].`,
        array: [...nums],
        prefixArray: [...prefix],
        variables: { n, i: 0, left: L, right: R, phase: 'constructor' },
        logEntry: `Initialized NumArray visualizer. Input array size N = ${n}.`
      });

      steps.push({
        line: 2,
        description: `Determined array size N = ${n}.`,
        array: [...nums],
        prefixArray: [...prefix],
        variables: { n, i: 0, left: L, right: R, phase: 'constructor' },
        logEntry: `Array size N is ${n}.`
      });

      steps.push({
        line: 3,
        description: `Resized prefix sum array to size N + 1 = ${n + 1}, initialized with sentinel prefix[0] = 0.`,
        array: [...nums],
        prefixArray: [...prefix],
        variables: { n, i: 0, left: L, right: R, phase: 'constructor' },
        logEntry: `Created prefix array of size ${n + 1} with sentinel index 0.`
      });

      // Construction loop
      for (let i = 0; i < n; i++) {
        steps.push({
          line: 4,
          description: `Loop checking index i = ${i} < ${n}. We will compute prefix[${i + 1}] using prefix[${i}] and nums[${i}].`,
          array: [...nums],
          prefixArray: [...prefix],
          activeIndex: i,
          variables: { n, i, left: L, right: R, phase: 'constructor' },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Constructor loop: checking i = ${i}.`
        });

        prefix[i + 1] = prefix[i] + nums[i];

        steps.push({
          line: 5,
          description: `Calculated prefix[${i + 1}] = prefix[${i}] + nums[${i}] => ${prefix[i]} + ${nums[i]} = ${prefix[i + 1]}.`,
          array: [...nums],
          prefixArray: [...prefix],
          activeIndex: i,
          variables: { n, i, left: L, right: R, phase: 'constructor' },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `prefix[${i + 1}] populated with value ${prefix[i + 1]}.`
        });
      }

      // Query Phase
      steps.push({
        line: 9,
        description: `Now querying sum of range [L = ${L}, R = ${R}].`,
        array: [...nums],
        prefixArray: [...prefix],
        leftRightRange: [L, R],
        variables: { n, left: L, right: R, phase: 'query' },
        logEntry: `Initiated O(1) sumRange query for interval [${L}, ${R}].`
      });

      const ans = prefix[R + 1] - prefix[L];

      steps.push({
        line: 10,
        description: `O(1) formula result: prefix[R + 1] - prefix[L] => prefix[${R + 1}] - prefix[${L}] => ${prefix[R + 1]} - ${prefix[L]} = ${ans}.`,
        array: [...nums],
        prefixArray: [...prefix],
        leftRightRange: [L, R],
        variables: { n, left: L, right: R, result: ans, phase: 'query' },
        logEntry: `Computed SumRange(${L}, ${R}) = ${prefix[R + 1]} - ${prefix[L]} = ${ans}.`
      });

      expectedOutput = `${ans}`;
      break;
    }

    case 'lc1480': {
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      }
      const nums = Array.isArray(rawNums) ? [...rawNums] : [1, 2, 3, 4];
      const n = nums.length;

      steps.push({
        line: 1,
        description: `Starting runningSum transformation of array: [${nums.join(', ')}].`,
        array: [...nums],
        variables: { n, i: 1 },
        logEntry: `Initialized in-place cumulative sum calculation.`
      });

      steps.push({
        line: 2,
        description: `Find array size N = ${n}.`,
        array: [...nums],
        variables: { n, i: 1 },
        logEntry: `Array size is ${n}.`
      });

      for (let i = 1; i < n; i++) {
        steps.push({
          line: 3,
          description: `Loop checking index i = ${i} < ${n}. Preparing to add cumulative sum from left.`,
          array: [...nums],
          activeIndex: i,
          variables: { n, i },
          highlightedIndices: { [i]: 'primary', [i - 1]: 'secondary' },
          logEntry: `Loop iteration: index i = ${i}.`
        });

        const prev = nums[i - 1];
        const curr = nums[i];
        nums[i] = prev + curr;

        steps.push({
          line: 4,
          description: `nums[${i}] updated: nums[${i - 1}] + nums[${i}] => ${prev} + ${curr} = ${nums[i]}.`,
          array: [...nums],
          activeIndex: i,
          variables: { n, i },
          highlightedIndices: { [i]: 'emerald', [i - 1]: 'secondary' },
          logEntry: `In-place accumulation: cell nums[${i}] is now ${nums[i]}.`
        });
      }

      steps.push({
        line: 6,
        description: `Completed in-place running sums! Final array: [${nums.join(', ')}].`,
        array: [...nums],
        variables: { n, i: n },
        logEntry: `Transformation completed successfully.`
      });

      expectedOutput = `[${nums.join(', ')}]`;
      break;
    }

    case 'lc724': {
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      }
      const nums = Array.isArray(rawNums) ? [...rawNums] : [1, 7, 3, 6, 5, 6];
      const n = nums.length;

      steps.push({
        line: 1,
        description: `Searching for the equilibrium pivot index. Input: [${nums.join(', ')}].`,
        array: [...nums],
        variables: { totalSum: 0, leftSum: 0, i: 0 },
        logEntry: `Initiated pivot search sequence.`
      });

      let totalSum = 0;
      steps.push({
        line: 2,
        description: `Initialize totalSum variable to 0.`,
        array: [...nums],
        variables: { totalSum, leftSum: 0, i: 0 },
        logEntry: `Initialized totalSum variable.`
      });

      for (const x of nums) {
        totalSum += x;
      }

      steps.push({
        line: 3,
        description: `Precomputed total sum of the entire array: ${totalSum}.`,
        array: [...nums],
        variables: { totalSum, leftSum: 0, i: 0 },
        logEntry: `O(N) initial scan completed. Total sum = ${totalSum}.`
      });

      let leftSum = 0;
      steps.push({
        line: 5,
        description: `Initialize leftSum tracker to 0.`,
        array: [...nums],
        variables: { totalSum, leftSum, i: 0 },
        logEntry: `Initialized leftSum to 0.`
      });

      let pivotIdx = -1;
      for (let i = 0; i < n; i++) {
        const rightSum = totalSum - leftSum - nums[i];
        steps.push({
          line: 6,
          description: `Loop checking index i = ${i} < ${n}. Comparing left sum and right sum.`,
          array: [...nums],
          activeIndex: i,
          variables: { totalSum, leftSum, rightSum, i },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Checking pivot index i = ${i}.`
        });

        const isMatch = leftSum === rightSum;
        steps.push({
          line: 7,
          description: `Compare leftSum (${leftSum}) and rightSum (${rightSum}) for element nums[${i}] = ${nums[i]}. Match? ${isMatch ? 'YES' : 'NO'}.`,
          array: [...nums],
          activeIndex: i,
          variables: { totalSum, leftSum, rightSum, i, isMatch },
          highlightedIndices: { [i]: isMatch ? 'emerald' : 'rose' },
          logEntry: `Checking invariant leftSum == rightSum => ${leftSum} == ${rightSum} (${isMatch ? 'MATCH' : 'MISMATCH'}).`
        });

        if (isMatch) {
          pivotIdx = i;
          steps.push({
            line: 8,
            description: `Match confirmed at index i = ${i}! Returning ${i} as the equilibrium pivot point.`,
            array: [...nums],
            activeIndex: i,
            variables: { totalSum, leftSum, rightSum, i, isMatch, result: i },
            highlightedIndices: { [i]: 'emerald' },
            logEntry: `Found pivot index at i = ${i}.`
          });
          break;
        }

        const oldLeft = leftSum;
        leftSum += nums[i];
        steps.push({
          line: 10,
          description: `Updating leftSum: leftSum + nums[${i}] => ${oldLeft} + ${nums[i]} = ${leftSum}.`,
          array: [...nums],
          activeIndex: i,
          variables: { totalSum, leftSum, rightSum, i },
          highlightedIndices: { [i]: 'slate' },
          logEntry: `Accumulated leftSum to ${leftSum}.`
        });
      }

      if (pivotIdx === -1) {
        steps.push({
          line: 12,
          description: `Exhausted array search without matching the equilibrium condition. Returning -1.`,
          array: [...nums],
          variables: { totalSum, leftSum, result: -1 },
          logEntry: `No pivot index exists. Returning -1.`
        });
      }

      expectedOutput = `${pivotIdx}`;
      break;
    }

    case 'lc238': {
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      }
      const nums = Array.isArray(rawNums) ? [...rawNums] : [1, 2, 3, 4];
      const n = nums.length;
      const res: number[] = new Array(n).fill(1);

      steps.push({
        line: 1,
        description: `Starting productExceptSelf calculation. Original: [${nums.join(', ')}].`,
        array: [...nums],
        prefixArray: [...res],
        variables: { n, i: 0, rightProduct: 1, phase: 'init' },
        logEntry: `Initialized product except self process.`
      });

      steps.push({
        line: 2,
        description: `Find size N = ${n}.`,
        array: [...nums],
        prefixArray: [...res],
        variables: { n, i: 0, rightProduct: 1, phase: 'init' },
        logEntry: `N = ${n}.`
      });

      steps.push({
        line: 3,
        description: `Initialize answer array 'res' filled with 1s: [${res.join(', ')}].`,
        array: [...nums],
        prefixArray: [...res],
        variables: { n, i: 0, rightProduct: 1, phase: 'init' },
        logEntry: `Initialized output vector with 1s.`
      });

      // Pass 1: Prefix products
      steps.push({
        line: 6,
        description: `Beginning PASS 1 (left-to-right sweep) to populate prefix products in res array.`,
        array: [...nums],
        prefixArray: [...res],
        variables: { n, i: 1, phase: 'pass1' },
        logEntry: `Starting prefix pass.`
      });

      for (let i = 1; i < n; i++) {
        res[i] = res[i - 1] * nums[i - 1];
        steps.push({
          line: 7,
          description: `Pass 1, index i = ${i}: res[${i}] = res[${i-1}] * nums[${i-1}] => ${res[i - 1]} * ${nums[i - 1]} = ${res[i]}.`,
          array: [...nums],
          prefixArray: [...res],
          activeIndex: i,
          variables: { n, i, phase: 'pass1' },
          highlightedIndices: { [i]: 'primary', [i - 1]: 'secondary' },
          logEntry: `res[${i}] now holds prefix product value ${res[i]}.`
        });
      }

      // Pass 2: Suffix products
      let rightProduct = 1;
      steps.push({
        line: 11,
        description: `Beginning PASS 2 (right-to-left sweep). Initialized running suffix tracker rightProduct = 1.`,
        array: [...nums],
        prefixArray: [...res],
        variables: { n, i: n - 1, rightProduct, phase: 'pass2' },
        logEntry: `Starting suffix pass with running product = 1.`
      });

      for (let i = n - 1; i >= 0; i--) {
        steps.push({
          line: 12,
          description: `Pass 2, checking index i = ${i} >= 0.`,
          array: [...nums],
          prefixArray: [...res],
          activeIndex: i,
          variables: { n, i, rightProduct, phase: 'pass2' },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Reverse loop checking index ${i}.`
        });

        const oldRes = res[i];
        res[i] = res[i] * rightProduct;

        steps.push({
          line: 13,
          description: `Multiply prefix sum res[${i}] (${oldRes}) with current running suffix product (${rightProduct}) => ${res[i]}.`,
          array: [...nums],
          prefixArray: [...res],
          activeIndex: i,
          variables: { n, i, rightProduct, phase: 'pass2' },
          highlightedIndices: { [i]: 'emerald' },
          logEntry: `Combined prefix and suffix products for res[${i}] => ${res[i]}.`
        });

        const oldRight = rightProduct;
        rightProduct *= nums[i];

        steps.push({
          line: 14,
          description: `Update running suffix product with nums[${i}] (${nums[i]}): rightProduct = ${oldRight} * ${nums[i]} = ${rightProduct}.`,
          array: [...nums],
          prefixArray: [...res],
          activeIndex: i,
          variables: { n, i, rightProduct, phase: 'pass2' },
          highlightedIndices: { [i]: 'slate' },
          logEntry: `Updated running suffix product to ${rightProduct}.`
        });
      }

      steps.push({
        line: 16,
        description: `Finished both sweeps. Reconstructed division-free products array: [${res.join(', ')}].`,
        array: [...nums],
        prefixArray: [...res],
        variables: { n, rightProduct, phase: 'done' },
        logEntry: `Calculated division-free suffix-prefix product except self.`
      });

      expectedOutput = `[${res.join(', ')}]`;
      break;
    }

    case 'lc42': {
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map((x: string) => parseInt(x.trim(), 10)).filter((x: number) => !isNaN(x));
      }
      const heights = Array.isArray(rawNums) ? [...rawNums] : [3, 0, 1, 3, 0, 2];
      const n = heights.length;

      const leftMax: number[] = new Array(n).fill(0);
      const rightMax: number[] = new Array(n).fill(0);
      const water: number[] = new Array(n).fill(0);

      steps.push({
        line: 1,
        description: `Initializing Trapping Rain Water simulation for elevation profile: [${heights.join(', ')}].`,
        array: [...heights],
        variables: { n, phase: 'init', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water] },
        logEntry: `Initialized elevation profile of size ${n}.`
      });

      // Compute LeftMax
      leftMax[0] = heights[0];
      steps.push({
        line: 4,
        description: `Set initial leftMax[0] = heights[0] = ${heights[0]}.`,
        array: [...heights],
        variables: { n, phase: 'leftMax', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water], i: 0 },
        logEntry: `Set initial left boundary leftMax[0] = ${leftMax[0]}.`
      });

      for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
        steps.push({
          line: 5,
          description: `Compute leftMax[${i}] = max(leftMax[${i - 1}], heights[${i}]) => max(${leftMax[i - 1]}, ${heights[i]}) = ${leftMax[i]}.`,
          array: [...heights],
          activeIndex: i,
          variables: { n, phase: 'leftMax', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water], i },
          highlightedIndices: { [i]: 'primary', [i-1]: 'secondary' },
          logEntry: `Accumulated leftMax[${i}] = ${leftMax[i]}.`
        });
      }

      // Compute RightMax
      rightMax[n - 1] = heights[n - 1];
      steps.push({
        line: 9,
        description: `Set initial rightMax[n-1] = heights[${n-1}] = ${heights[n - 1]}.`,
        array: [...heights],
        variables: { n, phase: 'rightMax', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water], i: n - 1 },
        logEntry: `Set initial right boundary rightMax[${n - 1}] = ${rightMax[n - 1]}.`
      });

      for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
        steps.push({
          line: 10,
          description: `Compute rightMax[${i}] = max(rightMax[${i + 1}], heights[${i}]) => max(${rightMax[i + 1]}, ${heights[i]}) = ${rightMax[i]}.`,
          array: [...heights],
          activeIndex: i,
          variables: { n, phase: 'rightMax', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water], i },
          highlightedIndices: { [i]: 'primary', [i + 1]: 'secondary' },
          logEntry: `Accumulated rightMax[${i}] = ${rightMax[i]}.`
        });
      }

      // Compute Trapped Water
      let totalWater = 0;
      steps.push({
        line: 14,
        description: `Begin scanning each column to calculate trapped rain water volumes.`,
        array: [...heights],
        variables: { n, phase: 'water', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water], totalWater },
        logEntry: `Initiating water column integration pass.`
      });

      for (let i = 0; i < n; i++) {
        const bound = Math.min(leftMax[i], rightMax[i]);
        const trapped = bound - heights[i];
        water[i] = trapped;
        totalWater += trapped;

        steps.push({
          line: 15,
          description: `At index ${i}: water[${i}] = min(leftMax[${i}], rightMax[${i}]) - heights[${i}] => min(${leftMax[i]}, ${rightMax[i]}) - ${heights[i]} = ${trapped} units of rain water trapped.`,
          array: [...heights],
          activeIndex: i,
          variables: { n, phase: 'water', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water], totalWater, i, currentTrapped: trapped },
          highlightedIndices: { [i]: 'emerald' },
          logEntry: `Column ${i}: Trapped min(${leftMax[i]}, ${rightMax[i]}) - ${heights[i]} = ${trapped} units. Total Water = ${totalWater}.`
        });
      }

      steps.push({
        line: 18,
        description: `Rain water trapping complete! Total accumulated volume is ${totalWater} cubic units.`,
        array: [...heights],
        variables: { n, phase: 'done', leftMax: [...leftMax], rightMax: [...rightMax], water: [...water], totalWater },
        logEntry: `Water summation complete. Trapped total volume = ${totalWater}.`
      });

      expectedOutput = `${totalWater}`;
      break;
    }

    case 'lc560': {
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      }
      const nums = Array.isArray(rawNums) ? [...rawNums] : [3, 4, 7, 2, -3, 1, 4, 2];
      const k = typeof input.k !== 'undefined' ? parseInt(input.k, 10) : 7;

      let count = 0;
      let currSum = 0;
      const prefixFreq: Record<string, number> = {};

      steps.push({
        line: 1,
        description: `Starting subarraySum calculation for target k = ${k}. Array: [${nums.join(', ')}].`,
        array: [...nums],
        variables: { count, currSum, k, i: 0 },
        hashMap: { ...prefixFreq },
        logEntry: `Initialized lookup visualizer for Target k = ${k}.`
      });

      steps.push({
        line: 2,
        description: `Initialize count = 0, currSum = 0.`,
        array: [...nums],
        variables: { count, currSum, k, i: 0 },
        hashMap: { ...prefixFreq },
        logEntry: `Initialized running count and current sum.`
      });

      steps.push({
        line: 3,
        description: `Declare Hash Map 'prefixFreq' to track seen running prefix sums.`,
        array: [...nums],
        variables: { count, currSum, k, i: 0 },
        hashMap: { ...prefixFreq },
        logEntry: `Declared prefix frequency dictionary.`
      });

      prefixFreq['0'] = 1;
      steps.push({
        line: 4,
        description: `Set prefixFreq[0] = 1 as sentinel. This enables detection of valid subarrays beginning at index 0.`,
        array: [...nums],
        variables: { count, currSum, k, i: 0 },
        hashMap: { ...prefixFreq },
        logEntry: `Registered sentinel sum 0 inside the frequency map.`
      });

      for (let i = 0; i < nums.length; i++) {
        steps.push({
          line: 6,
          description: `Loop checking index i = ${i} < N (${nums.length}).`,
          array: [...nums],
          activeIndex: i,
          variables: { count, currSum, k, i },
          hashMap: { ...prefixFreq },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Checking element index i = ${i}.`
        });

        currSum += nums[i];
        const targetSearch = currSum - k;
        const exists = typeof prefixFreq[targetSearch.toString()] !== 'undefined';

        steps.push({
          line: 7,
          description: `Add nums[${i}] (${nums[i]}) to running prefix sum currSum => ${currSum}. Seeking gap targetSum - k => ${currSum} - ${k} = ${targetSearch}.`,
          array: [...nums],
          activeIndex: i,
          variables: { count, currSum, targetSearch, k, i, exists },
          hashMap: { ...prefixFreq },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `currSum = ${currSum}. Looking up (currSum - k) = ${targetSearch} in hash map.`
        });

        steps.push({
          line: 8,
          description: `Check if map has key (currSum - k) => prefixFreq[${targetSearch}]? ${exists ? 'YES (' + prefixFreq[targetSearch] + ' times)' : 'NO'}.`,
          array: [...nums],
          activeIndex: i,
          variables: { count, currSum, targetSearch, k, i, exists },
          hashMap: { ...prefixFreq },
          highlightedIndices: { [i]: exists ? 'emerald' : 'slate' },
          logEntry: `Lookup of key ${targetSearch} inside map: ${exists ? 'FOUND' : 'NOT FOUND'}.`
        });

        if (exists) {
          const matchCount = prefixFreq[targetSearch];
          count += matchCount;
          steps.push({
            line: 9,
            description: `Hit! Added frequency of ${targetSearch} (${matchCount}) to count => total subarrays count is now ${count}.`,
            array: [...nums],
            activeIndex: i,
            variables: { count, currSum, targetSearch, k, i, exists },
            hashMap: { ...prefixFreq },
            highlightedIndices: { [i]: 'emerald' },
            logEntry: `MATCH FOUND! Subarray count increased by ${matchCount} to ${count}.`
          });
        }

        const oldFreq = prefixFreq[currSum.toString()] || 0;
        prefixFreq[currSum.toString()] = oldFreq + 1;

        steps.push({
          line: 11,
          description: `Record current prefix sum currSum = ${currSum} into frequency map: count is incremented from ${oldFreq} to ${prefixFreq[currSum]}.`,
          array: [...nums],
          activeIndex: i,
          variables: { count, currSum, targetSearch, k, i },
          hashMap: { ...prefixFreq },
          highlightedIndices: { [i]: 'slate' },
          logEntry: `Registered prefix sum ${currSum} into frequency map.`
        });
      }

      steps.push({
        line: 13,
        description: `Array traversal complete. Total contiguous subarrays with sum ${k} is ${count}.`,
        array: [...nums],
        variables: { count, currSum, k },
        hashMap: { ...prefixFreq },
        logEntry: `Completed simulation. Found ${count} valid intervals.`
      });

      expectedOutput = `${count}`;
      break;
    }

    case 'lc523': {
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      }
      const nums = Array.isArray(rawNums) ? [...rawNums] : [23, 2, 4, 6, 7];
      const k = typeof input.k !== 'undefined' ? parseInt(input.k, 10) : 6;

      const remMap: Record<string, number> = {};
      let currSum = 0;
      let resultBool = false;

      steps.push({
        line: 1,
        description: `Starting continuousSubarraySum search for k = ${k}. Input array: [${nums.join(', ')}].`,
        array: [...nums],
        variables: { currSum, k, i: 0, result: false },
        hashMap: { ...remMap },
        logEntry: `Initialized remainder modulo k = ${k} tracker.`
      });

      steps.push({
        line: 2,
        description: `Declare Hash Map 'remMap' to store the first-seen index of each mod remainder.`,
        array: [...nums],
        variables: { currSum, k, i: 0 },
        hashMap: { ...remMap },
        logEntry: `Created remainder lookup table.`
      });

      remMap['0'] = -1;
      steps.push({
        line: 3,
        description: `Set remMap[0] = -1 as sentinel index. Allows validation of multiples starting directly at index 0.`,
        array: [...nums],
        variables: { currSum, k, i: 0 },
        hashMap: { ...remMap },
        logEntry: `Added sentinel mod-0 remainder mapping to index -1.`
      });

      for (let i = 0; i < nums.length; i++) {
        steps.push({
          line: 6,
          description: `Loop checking index i = ${i} < N (${nums.length}).`,
          array: [...nums],
          activeIndex: i,
          variables: { currSum, k, i },
          hashMap: { ...remMap },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Iterating index i = ${i}.`
        });

        currSum += nums[i];
        const rem = currSum % k;
        const exists = typeof remMap[rem.toString()] !== 'undefined';

        steps.push({
          line: 7,
          description: `Accumulate running sum: currSum = ${currSum}.`,
          array: [...nums],
          activeIndex: i,
          variables: { currSum, k, i },
          hashMap: { ...remMap },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Updated prefix sum to ${currSum}.`
        });

        steps.push({
          line: 8,
          description: `Compute remainder of running sum modulo divisor k: ${currSum} % ${k} = ${rem}.`,
          array: [...nums],
          activeIndex: i,
          variables: { currSum, rem, k, i, exists },
          hashMap: { ...remMap },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Calculated remainder ${rem} for current step.`
        });

        steps.push({
          line: 9,
          description: `Verify if remainder ${rem} is already recorded in map? ${exists ? 'YES (earliest at index ' + remMap[rem] + ')' : 'NO'}.`,
          array: [...nums],
          activeIndex: i,
          variables: { currSum, rem, k, i, exists },
          hashMap: { ...remMap },
          highlightedIndices: { [i]: exists ? 'amber' : 'slate' },
          logEntry: `Remainder ${rem} check in lookup table: ${exists ? 'FOUND' : 'MISSING'}.`
        });

        if (exists) {
          const prevIdx = remMap[rem];
          const diffLen = i - prevIdx;
          const isValid = diffLen >= 2;

          steps.push({
            line: 10,
            description: `Check if length (i - firstSeenIndex) >= 2. Index difference: ${i} - (${prevIdx}) = ${diffLen}. Length valid? ${isValid ? 'YES (returns true)' : 'NO'}`,
            array: [...nums],
            activeIndex: i,
            variables: { currSum, rem, k, i, exists, prevIdx, diffLen, isValid },
            hashMap: { ...remMap },
            highlightedIndices: { [i]: isValid ? 'emerald' : 'rose' },
            logEntry: `Checking subsegment length: i - prevIndex => ${i} - ${prevIdx} = ${diffLen} (${isValid ? 'VALID' : 'INVALID'}).`
          });

          if (isValid) {
            resultBool = true;
            break;
          }
        } else {
          remMap[rem.toString()] = i;
          steps.push({
            line: 12,
            description: `Remainder ${rem} seen for the first time. Store remMap[${rem}] = index ${i}.`,
            array: [...nums],
            activeIndex: i,
            variables: { currSum, rem, k, i, exists },
            hashMap: { ...remMap },
            highlightedIndices: { [i]: 'slate' },
            logEntry: `Stored first seen index of remainder ${rem} at index ${i}.`
          });
        }
      }

      if (!resultBool) {
        steps.push({
          line: 15,
          description: `No valid continuous subarray of size >= 2 found with sum divisible by ${k}. Returning false.`,
          array: [...nums],
          variables: { currSum, k, result: false },
          hashMap: { ...remMap },
          logEntry: `Finished simulation without finding a valid subarray. Output = false.`
        });
      }

      expectedOutput = resultBool ? 'true' : 'false';
      break;
    }

    case 'lc525': {
      let rawNums = input.nums;
      if (typeof rawNums === 'string') {
        rawNums = (rawNums as string).split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x));
      }
      const nums = Array.isArray(rawNums) ? [...rawNums] : [0, 1, 0, 1, 1, 0, 0];
      const n = nums.length;

      const sumIndexMap: Record<string, number> = {};
      let maxLen = 0;
      let currSum = 0;

      steps.push({
        line: 1,
        description: `Starting contiguousArray search. Binary array: [${nums.join(', ')}].`,
        array: [...nums],
        variables: { maxLen, currSum, i: 0 },
        hashMap: { ...sumIndexMap },
        logEntry: `Initialized zero-balance search.`
      });

      steps.push({
        line: 2,
        description: `Declare Hash Map 'sumIndexMap' to map prefix sums to their earliest seen index.`,
        array: [...nums],
        variables: { maxLen, currSum, i: 0 },
        hashMap: { ...sumIndexMap },
        logEntry: `Declared balance tracker index map.`
      });

      sumIndexMap['0'] = -1;
      steps.push({
        line: 3,
        description: `Set sumIndexMap[0] = -1 as sentinel to represent prefix sum before start of array.`,
        array: [...nums],
        variables: { maxLen, currSum, i: 0 },
        hashMap: { ...sumIndexMap },
        logEntry: `Saved balance 0 at offset index -1.`
      });

      for (let i = 0; i < n; i++) {
        steps.push({
          line: 6,
          description: `Loop checking index i = ${i} < ${n}.`,
          array: [...nums],
          activeIndex: i,
          variables: { maxLen, currSum, i },
          hashMap: { ...sumIndexMap },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Evaluating index i = ${i}.`
        });

        const val = nums[i] === 1 ? 1 : -1;
        currSum += val;
        const exists = typeof sumIndexMap[currSum.toString()] !== 'undefined';

        steps.push({
          line: 7,
          description: `Translate nums[${i}] (${nums[i]}): treat 1 as +1 and 0 as -1. Added ${val} to currSum => ${currSum}.`,
          array: [...nums],
          activeIndex: i,
          variables: { maxLen, currSum, i, val, exists },
          hashMap: { ...sumIndexMap },
          highlightedIndices: { [i]: 'primary' },
          logEntry: `Applied 0/1 weight. Balance currSum is now ${currSum}.`
        });

        if (exists) {
          const firstSeen = sumIndexMap[currSum.toString()];
          const oldMax = maxLen;
          maxLen = Math.max(maxLen, i - firstSeen);
          steps.push({
            line: 8,
            description: `Balance ${currSum} was seen at index ${firstSeen}. Candidate subarray is from index ${firstSeen + 1} to ${i}.`,
            array: [...nums],
            activeIndex: i,
            variables: { maxLen, currSum, i, firstSeen, length: i - firstSeen },
            hashMap: { ...sumIndexMap },
            highlightedIndices: { [i]: 'emerald' },
            logEntry: `Duplicate balance found. Subarray range [${firstSeen+1}, ${i}] size: ${i - firstSeen}.`
          });

          steps.push({
            line: 9,
            description: `Updating maxLen = max(${oldMax}, ${i - firstSeen}) => ${maxLen}.`,
            array: [...nums],
            activeIndex: i,
            variables: { maxLen, currSum, i, firstSeen, length: i - firstSeen },
            hashMap: { ...sumIndexMap },
            highlightedIndices: { [i]: 'emerald' },
            logEntry: `Max balance subsegment length is now ${maxLen}.`
          });
        } else {
          sumIndexMap[currSum.toString()] = i;
          steps.push({
            line: 11,
            description: `Balance ${currSum} encountered for first time. Store sumIndexMap[${currSum}] = index ${i}.`,
            array: [...nums],
            activeIndex: i,
            variables: { maxLen, currSum, i },
            hashMap: { ...sumIndexMap },
            highlightedIndices: { [i]: 'slate' },
            logEntry: `First occurrence of balance ${currSum} recorded at index ${i}.`
          });
        }
      }

      steps.push({
        line: 14,
        description: `Scan complete! Longest contiguous subarray with equal 0 and 1 has length of ${maxLen}.`,
        array: [...nums],
        variables: { maxLen, currSum },
        hashMap: { ...sumIndexMap },
        logEntry: `Completed simulation. Max balance range found: ${maxLen}.`
      });

      expectedOutput = `${maxLen}`;
      break;
    }

    case 'lc370': {
      const length = typeof input.size !== 'undefined' ? parseInt(input.size, 10) : 6;
      const updatesStr = input.updates || '1,3,2; 2,4,3; 0,2,-2';
      
      // Parse updatesStr: "1,3,2; 2,4,3" => [[1,3,2], [2,4,3]]
      const updates: [number, number, number][] = [];
      const parts = updatesStr.split(';');
      for (const p of parts) {
        if (!p.trim()) continue;
        const triple = p.split(',').map((x: string) => parseInt(x.trim(), 10));
        if (triple.length === 3 && triple.every((x: number) => !isNaN(x))) {
          updates.push([triple[0], triple[1], triple[2]]);
        }
      }

      const diff: number[] = new Array(length).fill(0);

      steps.push({
        line: 1,
        description: `Starting difference array demonstration. Size: ${length}. Updates: ${JSON.stringify(updates)}.`,
        diffArray: [...diff],
        variables: { length, updatesCount: updates.length, phase: 'init' },
        logEntry: `Initialized O(1) range query difference array with size ${length}.`
      });

      steps.push({
        line: 2,
        description: `Created difference array 'diff' of size ${length} initialized with 0s.`,
        diffArray: [...diff],
        variables: { length, updatesCount: updates.length, phase: 'init' },
        logEntry: `Array initialized with 0s.`
      });

      // Loop updates
      steps.push({
        line: 3,
        description: `Loop through each range addition update query.`,
        diffArray: [...diff],
        variables: { length, updatesCount: updates.length, phase: 'updates' },
        logEntry: `Starting update queries loop.`
      });

      for (let u = 0; u < updates.length; u++) {
        const [start, end, val] = updates[u];
        steps.push({
          line: 4,
          description: `Query #${u+1}: Adding value ${val} on range [${start}, ${end}].`,
          diffArray: [...diff],
          variables: { length, start, end, val, updateIndex: u, phase: 'updates' },
          highlightedIndices: { [start]: 'primary', [end]: 'secondary' },
          logEntry: `Processing query: range [${start}, ${end}] val = ${val}.`
        });

        const oldStart = diff[start];
        diff[start] += val;
        steps.push({
          line: 5,
          description: `Add val (${val}) to boundary diff[L = ${start}]: diff[${start}] was ${oldStart}, now ${diff[start]}.`,
          diffArray: [...diff],
          variables: { length, start, end, val, updateIndex: u, phase: 'updates' },
          highlightedIndices: { [start]: 'emerald' },
          logEntry: `Updated diff[${start}] to ${diff[start]} (increment).`
        });

        const nextEnd = end + 1;
        const isEndInBounds = nextEnd < length;
        
        steps.push({
          line: 6,
          description: `Check if boundary R+1 = ${nextEnd} falls inside array bounds. In bounds? ${isEndInBounds ? 'YES' : 'NO'}.`,
          diffArray: [...diff],
          variables: { length, start, end, val, updateIndex: u, nextEnd, isEndInBounds, phase: 'updates' },
          highlightedIndices: { [nextEnd]: isEndInBounds ? 'primary' : 'slate' },
          logEntry: `Checking end boundary bounds of ${nextEnd}.`
        });

        if (isEndInBounds) {
          const oldEndVal = diff[nextEnd];
          diff[nextEnd] -= val;
          steps.push({
            line: 7,
            description: `Subtract val (${val}) from diff[R + 1 = ${nextEnd}]: was ${oldEndVal}, now ${diff[nextEnd]}. This cancels the range addition offset!`,
            diffArray: [...diff],
            variables: { length, start, end, val, updateIndex: u, nextEnd, phase: 'updates' },
            highlightedIndices: { [nextEnd]: 'rose' },
            logEntry: `Subtracted from diff[${nextEnd}], now ${diff[nextEnd]}.`
          });
        }
      }

      // Prefix Sum Reconstruction Sweep
      steps.push({
        line: 11,
        description: `Finished processing updates! Now reconstructing the final modified array via prefix sum sweep.`,
        diffArray: [...diff],
        variables: { length, phase: 'prefix-sweep', i: 1 },
        logEntry: `Initiating sequential prefix sum sweep to resolve increments.`
      });

      for (let i = 1; i < length; i++) {
        steps.push({
          line: 11,
          description: `Prefix sweep: index i = ${i} < ${length}.`,
          diffArray: [...diff],
          activeIndex: i,
          variables: { length, phase: 'prefix-sweep', i },
          highlightedIndices: { [i]: 'primary', [i-1]: 'secondary' },
          logEntry: `Sweep iteration: checking index ${i}.`
        });

        const oldVal = diff[i];
        diff[i] += diff[i - 1];

        steps.push({
          line: 12,
          description: `Accumulate: diff[${i}] = diff[${i}] + diff[${i - 1}] => ${oldVal} + ${diff[i - 1]} = ${diff[i]}.`,
          diffArray: [...diff],
          activeIndex: i,
          variables: { length, phase: 'prefix-sweep', i },
          highlightedIndices: { [i]: 'emerald', [i - 1]: 'secondary' },
          logEntry: `Accumulated cell diff[${i}] to ${diff[i]}.`
        });
      }

      steps.push({
        line: 14,
        description: `Prefix sum sweep completed! Final reconstructed array: [${diff.join(', ')}].`,
        diffArray: [...diff],
        variables: { length, phase: 'done' },
        logEntry: `Reconstruction complete.`
      });

      expectedOutput = `[${diff.join(', ')}]`;
      break;
    }

    case 'gcd': {
      let a = typeof input.a !== 'undefined' ? parseInt(input.a, 10) : 54;
      let b = typeof input.b !== 'undefined' ? parseInt(input.b, 10) : 24;
      if (isNaN(a)) a = 54;
      if (isNaN(b)) b = 24;

      const origA = a;
      const origB = b;

      steps.push({
        line: 1,
        description: `Starting Euclidean Algorithm for GCD of (${a}, ${b}).`,
        variables: { a, b, originalA: origA, originalB: origB },
        logEntry: `Initialized Euclidean GCD for (${a}, ${b}).`
      });

      let iteration = 0;
      while (b !== 0) {
        iteration++;
        steps.push({
          line: 2,
          description: `Check loop condition: divisor b = ${b} !== 0. (True, continuing reduction).`,
          variables: { a, b, originalA: origA, originalB: origB, iteration },
          logEntry: `Iteration ${iteration}: b is ${b}. Continuing remainder division.`
        });

        const temp = b;
        steps.push({
          line: 3,
          description: `Store current divisor b (${b}) in a temporary variable 'temp'.`,
          variables: { a, b, temp, originalA: origA, originalB: origB, iteration },
          logEntry: `Saved temp = ${temp}.`
        });

        const rem = a % b;
        b = rem;

        steps.push({
          line: 4,
          description: `Calculate remainder: b = a % b => ${a} % ${temp} = ${rem}.`,
          variables: { a, b: rem, temp, remainder: rem, originalA: origA, originalB: origB, iteration },
          logEntry: `Remainder ${a} % ${temp} = ${rem}. Divisor b is now updated to ${rem}.`
        });

        a = temp;

        steps.push({
          line: 5,
          description: `Set dividend a to previous divisor: a = temp => ${temp}.`,
          variables: { a, b, temp, originalA: origA, originalB: origB, iteration },
          logEntry: `Set dividend a to ${temp}.`
        });
      }

      steps.push({
        line: 2,
        description: `Check loop condition: divisor b = ${b} !== 0. (False, loop ends).`,
        variables: { a, b, originalA: origA, originalB: origB },
        logEntry: `Divisor b is 0. Euclidean division finishes.`
      });

      steps.push({
        line: 7,
        description: `Returning dividend a = ${a} as the Greatest Common Divisor of (${origA}, ${origB}).`,
        variables: { a, b, originalA: origA, originalB: origB, result: a },
        logEntry: `Completed simulation. GCD(${origA}, ${origB}) = ${a}.`
      });

      expectedOutput = `${a}`;
      break;
    }

    case 'lc204': {
      let n = typeof input.n !== 'undefined' ? parseInt(input.n, 10) : 30;
      if (isNaN(n)) n = 30;

      const isPrime: boolean[] = new Array(n).fill(true);

      steps.push({
        line: 1,
        description: `Starting Sieve of Eratosthenes to count primes strictly less than ${n}.`,
        variables: { n, count: 0, phase: 'init', isPrime: [...isPrime] },
        logEntry: `Initialized Sieve calculation for N = ${n}.`
      });

      if (n <= 2) {
        steps.push({
          line: 2,
          description: `Check if n <= 2: ${n} <= 2. (True, returning 0 immediately as there are no primes < 2).`,
          variables: { n, result: 0, isPrime: [...isPrime] },
          logEntry: `N is <= 2. No primes to count. Returning 0.`
        });
        expectedOutput = '0';
        break;
      }

      steps.push({
        line: 3,
        description: `Initialize boolean Sieve array 'isPrime' of size ${n} with all entries set to 'true'.`,
        variables: { n, phase: 'sieve-init', isPrime: [...isPrime] },
        logEntry: `Allocated sieve array of size ${n}.`
      });

      isPrime[0] = isPrime[1] = false;
      steps.push({
        line: 4,
        description: `Mark isPrime[0] and isPrime[1] as false, since 0 and 1 are non-prime mathematically.`,
        variables: { n, phase: 'sieve-init', isPrime: [...isPrime] },
        logEntry: `Flagged indices 0 and 1 as composite.`
      });

      // Loop candidates
      const sqrtN = Math.sqrt(n);
      for (let p = 2; p * p < n; p++) {
        const isPrimeCandidate = isPrime[p];
        steps.push({
          line: 6,
          description: `Check outer loop: candidate p = ${p}. Condition p*p < n => ${p*p} < ${n} holds. isPrime[${p}] is ${isPrimeCandidate ? 'TRUE' : 'FALSE'}.`,
          activeP: p,
          variables: { n, p, sqrtN, isPrimeCandidate, phase: 'candidate-scan', isPrime: [...isPrime] },
          logEntry: `Outer sieve: checking candidate prime p = ${p}.`
        });

        if (isPrimeCandidate) {
          steps.push({
            line: 7,
            description: `Candidate p = ${p} is prime. Proceeding to mark its multiples starting from p*p = ${p * p}.`,
            activeP: p,
            variables: { n, p, sqrtN, phase: 'multiples-elimination', isPrime: [...isPrime] },
            logEntry: `Prime confirmed: p = ${p}. Eliminating composites.`
          });

          for (let i = p * p; i < n; i += p) {
            steps.push({
              line: 8,
              description: `Multiple scan: current index i = ${i} < ${n}. Marking isPrime[${i}] as false.`,
              activeP: p,
              activeMultiple: i,
              variables: { n, p, i, phase: 'multiples-elimination', isPrime: [...isPrime] },
              logEntry: `Striking off multiple index i = ${i}.`
            });

            isPrime[i] = false;

            steps.push({
              line: 9,
              description: `Marked isPrime[${i}] = false. Moving to next multiple by adding p = ${p}.`,
              activeP: p,
              activeMultiple: i,
              variables: { n, p, i, phase: 'multiples-elimination', isPrime: [...isPrime] },
              logEntry: `Completed strike-off of multiple ${i}.`
            });
          }
        }
      }

      steps.push({
        line: 14,
        description: `Finished sieve elimination sweeps up to sqrt(N) = ${sqrtN.toFixed(2)}. Now preparing to count primes.`,
        variables: { n, count: 0, phase: 'counting', isPrime: [...isPrime] },
        logEntry: `Sieve filtering sweeps ended. Initiating census sweep.`
      });

      let count = 0;
      for (let i = 2; i < n; i++) {
        const checkPrime = isPrime[i];
        steps.push({
          line: 15,
          description: `Checking index i = ${i}: isPrime[${i}] is ${checkPrime ? 'TRUE' : 'FALSE'}.`,
          activeIndex: i,
          variables: { n, i, count, checkPrime, phase: 'counting', isPrime: [...isPrime] },
          logEntry: `Census sweep at ${i}: ${checkPrime ? 'PRIME' : 'COMPOSITE'}.`
        });

        if (checkPrime) {
          count++;
          steps.push({
            line: 15, // line mapping to if (isPrime[i]) count++;
            description: `Hit! Index i = ${i} is prime. Incrementing prime counter to ${count}.`,
            activeIndex: i,
            variables: { n, i, count, checkPrime, phase: 'counting', isPrime: [...isPrime] },
            logEntry: `Found prime ${i}. Prime count is now ${count}.`
          });
        }
      }

      steps.push({
        line: 17,
        description: `All sweeps complete. Found a total of ${count} prime numbers strictly less than ${n}.`,
        variables: { n, count, result: count, phase: 'done', isPrime: [...isPrime] },
        logEntry: `Sieve finished. Total primes found: ${count}.`
      });

      expectedOutput = `${count}`;
      break;
    }

    case 'lc50': {
      let base = typeof input.base !== 'undefined' ? parseInt(input.base, 10) : 3;
      let exp = typeof input.exp !== 'undefined' ? parseInt(input.exp, 10) : 13;
      let mod = typeof input.mod !== 'undefined' ? parseInt(input.mod, 10) : 1000;
      if (isNaN(base)) base = 3;
      if (isNaN(exp)) exp = 13;
      if (isNaN(mod)) mod = 1000;

      const origBase = base;
      const origExp = exp;

      steps.push({
        line: 1,
        description: `Starting modular exponentiation of (${base}^${exp}) % ${mod}.`,
        variables: { base, exp, mod, ans: 1, originalBase: origBase, originalExp: origExp },
        logEntry: `Initialized modular exponentiation for base ${base}, exponent ${exp}, modulo ${mod}.`
      });

      let ans = 1;
      steps.push({
        line: 2,
        description: `Initialize accumulator answer ans = 1.`,
        variables: { base, exp, mod, ans, originalBase: origBase, originalExp: origExp },
        logEntry: `Initialized accumulator answer to 1.`
      });

      const reducedBase = base % mod;
      base = reducedBase;
      steps.push({
        line: 3,
        description: `Pre-reduce base by modulo: base = base % mod => ${origBase} % ${mod} = ${reducedBase}.`,
        variables: { base: reducedBase, exp, mod, ans, originalBase: origBase, originalExp: origExp },
        logEntry: `Reduced base to ${reducedBase} under modulo ${mod}.`
      });

      while (exp > 0) {
        steps.push({
          line: 4,
          description: `Check loop condition: exponent exp = ${exp} > 0. (True, processing binary bits).`,
          variables: { base, exp, mod, ans, originalBase: origBase, originalExp: origExp },
          logEntry: `Processing bit: exponent is ${exp} (binary: ${exp.toString(2)}).`
        });

        const lsb = exp & 1;
        const isOdd = lsb === 1;

        steps.push({
          line: 5,
          description: `Check if exponent is odd (Lowest Significant Bit is 1): exp & 1 => ${exp} & 1 = ${lsb} (${isOdd ? 'ODD' : 'EVEN'}).`,
          variables: { base, exp, mod, ans, lsb, isOdd, originalBase: origBase, originalExp: origExp },
          logEntry: `Checking LSB of ${exp}: ${lsb} (Is Odd? ${isOdd}).`
        });

        if (isOdd) {
          const oldAns = ans;
          ans = (ans * base) % mod;
          steps.push({
            line: 6,
            description: `LSB is 1! Multiply ans with base under modulo: ans = (ans * base) % mod => (${oldAns} * ${base}) % ${mod} = ${ans}.`,
            variables: { base, exp, mod, ans, lsb, isOdd, originalBase: origBase, originalExp: origExp },
            logEntry: `LSB is active. Multiplied running power. ans is now ${ans}.`
          });
        }

        const oldBase = base;
        base = (base * base) % mod;

        steps.push({
          line: 8,
          description: `Square the base under modulo for next binary position: base = (base * base) % mod => (${oldBase} * ${oldBase}) % ${mod} = ${base}.`,
          variables: { base, exp, mod, ans, originalBase: origBase, originalExp: origExp },
          logEntry: `Squared current power base from ${oldBase} to ${base}.`
        });

        const oldExp = exp;
        exp = exp >> 1;

        steps.push({
          line: 9,
          description: `Right-shift exponent by 1 bit: exp = exp >> 1 => ${oldExp} >> 1 = ${exp}.`,
          variables: { base, exp, mod, ans, originalBase: origBase, originalExp: origExp },
          logEntry: `Shifted exponent right: ${oldExp} becomes ${exp}.`
        });
      }

      steps.push({
        line: 4,
        description: `Check loop condition: exponent exp = ${exp} > 0. (False, exponent fully processed).`,
        variables: { base, exp, mod, ans, originalBase: origBase, originalExp: origExp },
        logEntry: `All exponent bits processed.`
      });

      steps.push({
        line: 11,
        description: `Returning final modular power answer: ${ans}.`,
        variables: { base, exp, mod, ans, originalBase: origBase, originalExp: origExp, result: ans },
        logEntry: `Modular exponentiation finished. (${origBase}^${origExp}) % ${mod} = ${ans}.`
      });

      expectedOutput = `${ans}`;
      break;
    }

    case 'lc9': {
      let x = typeof input.x !== 'undefined' ? parseInt(input.x, 10) : 1221;
      if (isNaN(x)) x = 1221;

      const origX = x;

      steps.push({
        line: 1,
        description: `Starting palindrome validation of integer ${x} without string conversion.`,
        variables: { x, reversedNum: 0, originalX: origX },
        logEntry: `Initialized integer palindrome check for x = ${x}.`
      });

      const isNegative = x < 0;
      const endsWithZero = (x % 10 === 0 && x !== 0);
      const isQuickFail = isNegative || endsWithZero;

      steps.push({
        line: 2,
        description: `Check quick-rejection criteria: negative (${isNegative}) or ends with 0 but is not 0 (${endsWithZero}). Reject? ${isQuickFail ? 'YES (return false)' : 'NO'}.`,
        variables: { x, reversedNum: 0, originalX: origX, isNegative, endsWithZero, isQuickFail },
        logEntry: `Evaluated boundary checks: ${isQuickFail ? 'Rejected' : 'Passed boundary check'}.`
      });

      if (isQuickFail) {
        expectedOutput = 'false';
        break;
      }

      let reversedNum = 0;
      steps.push({
        line: 4,
        description: `Initialize reversedNum tracker = 0. We will accumulate digits here.`,
        variables: { x, reversedNum, originalX: origX },
        logEntry: `Initialized reversedNum accumulator.`
      });

      let stepsCount = 0;
      while (x > reversedNum) {
        stepsCount++;
        steps.push({
          line: 5,
          description: `Compare: is remaining first half (x = ${x}) > reversed second half (reversedNum = ${reversedNum})? Yes, keep extracting digits.`,
          variables: { x, reversedNum, originalX: origX, stepsCount },
          logEntry: `Reduction iteration ${stepsCount}: x is ${x}, reversedNum is ${reversedNum}.`
        });

        const pop = x % 10;
        const oldRev = reversedNum;
        reversedNum = reversedNum * 10 + pop;

        steps.push({
          line: 6,
          description: `Extract last digit of x (${pop}) and shift reversedNum left: reversedNum = reversedNum * 10 + digit => ${oldRev} * 10 + ${pop} = ${reversedNum}.`,
          variables: { x, reversedNum, digit: pop, originalX: origX, stepsCount },
          logEntry: `Extracted digit ${pop}. Appended to reversedNum => ${reversedNum}.`
        });

        const oldXVal = x;
        x = Math.floor(x / 10);

        steps.push({
          line: 7,
          description: `Chop last digit of x: x = x / 10 => floor(${oldXVal} / 10) = ${x}.`,
          variables: { x, reversedNum, originalX: origX, stepsCount },
          logEntry: `Truncated x: ${oldXVal} becomes ${x}.`
        });
      }

      steps.push({
        line: 5,
        description: `Compare: is remaining first half (x = ${x}) > reversed second half (reversedNum = ${reversedNum})? False, we have reached or crossed the middle point of digits.`,
        variables: { x, reversedNum, originalX: origX },
        logEntry: `Reached middle segment: x = ${x}, reversedNum = ${reversedNum}.`
      });

      const isEvenMatch = x === reversedNum;
      const isOddMatch = x === Math.floor(reversedNum / 10);
      const isFinalMatch = isEvenMatch || isOddMatch;

      steps.push({
        line: 9,
        description: `Check equality: even digit match (x == reversedNum => ${x} == ${reversedNum}) OR odd digit match (x == reversedNum / 10 => ${x} == floor(${reversedNum}/10) => ${x} == ${Math.floor(reversedNum/10)}). Palindrome? ${isFinalMatch ? 'YES' : 'NO'}.`,
        variables: { x, reversedNum, originalX: origX, isEvenMatch, isOddMatch, isFinalMatch, result: isFinalMatch },
        logEntry: `Finished comparison. Palindrome condition: ${isFinalMatch ? 'TRUE' : 'FALSE'}.`
      });

      expectedOutput = isFinalMatch ? 'true' : 'false';
      break;
    }

    case 'lc7': {
      let x = typeof input.x !== 'undefined' ? parseInt(input.x, 10) : 12345678;
      if (isNaN(x)) x = 12345678;

      const INT_MAX = 2147483647;
      const INT_MIN = -2147483648;
      const origX = x;

      steps.push({
        line: 1,
        description: `Starting integer reversing for x = ${x}. Limits: [${INT_MIN}, ${INT_MAX}].`,
        variables: { x, rev: 0, originalX: origX, INT_MAX, INT_MIN },
        logEntry: `Initialized reversing algorithm for x = ${x}.`
      });

      let rev = 0;
      steps.push({
        line: 2,
        description: `Initialize reversed accumulator rev = 0.`,
        variables: { x, rev, originalX: origX, INT_MAX, INT_MIN },
        logEntry: `Initialized accumulator to 0.`
      });

      let stepNum = 0;
      let overflown = false;

      while (x !== 0) {
        stepNum++;
        steps.push({
          line: 3,
          description: `Check loop condition: x = ${x} !== 0. (True, continuing digit extraction).`,
          variables: { x, rev, originalX: origX, stepNum, INT_MAX, INT_MIN },
          logEntry: `Digit extraction iteration ${stepNum}: current x is ${x}.`
        });

        const pop = x % 10;
        steps.push({
          line: 4,
          description: `Extract last digit (pop = x % 10): ${x} % 10 = ${pop}.`,
          variables: { x, rev, pop, originalX: origX, stepNum, INT_MAX, INT_MIN },
          logEntry: `Popped digit ${pop}.`
        });

        const nextXVal = x > 0 ? Math.floor(x / 10) : Math.ceil(x / 10);
        x = nextXVal;
        steps.push({
          line: 5,
          description: `Reduce x: x = x / 10 => ${x}.`,
          variables: { x, rev, pop, originalX: origX, stepNum, INT_MAX, INT_MIN },
          logEntry: `Truncated x to ${x}.`
        });

        // Overflow checks
        const checkMax = rev > Math.floor(INT_MAX / 10) || (rev === Math.floor(INT_MAX / 10) && pop > 7);
        steps.push({
          line: 6,
          description: `Check if multiplying 'rev' by 10 will exceed Positive Max: (rev > INT_MAX/10 OR (rev == INT_MAX/10 AND pop > 7))? (${rev} > 214748364 OR (${rev} == 214748364 AND ${pop} > 7)) => ${checkMax ? 'OVERFLOW' : 'SAFE'}.`,
          variables: { x, rev, pop, checkMax, originalX: origX, stepNum, INT_MAX, INT_MIN },
          logEntry: `Positive overflow bound check: ${checkMax ? 'TRIGGERED' : 'SAFE'}.`
        });

        if (checkMax) {
          overflown = true;
          steps.push({
            line: 6,
            description: `Overflow detected! Exceeds INT_MAX. Returning 0.`,
            variables: { x: 0, rev: 0, originalX: origX, result: 0 },
            logEntry: `Terminated with overflow result: 0.`
          });
          break;
        }

        const checkMin = rev < Math.ceil(INT_MIN / 10) || (rev === Math.ceil(INT_MIN / 10) && pop < -8);
        steps.push({
          line: 7,
          description: `Check if multiplying 'rev' by 10 will exceed Negative Min: (rev < INT_MIN/10 OR (rev == INT_MIN/10 AND pop < -8))? (${rev} < -214748364 OR (${rev} == -214748364 AND ${pop} < -8)) => ${checkMin ? 'OVERFLOW' : 'SAFE'}.`,
          variables: { x, rev, pop, checkMin, originalX: origX, stepNum, INT_MAX, INT_MIN },
          logEntry: `Negative overflow bound check: ${checkMin ? 'TRIGGERED' : 'SAFE'}.`
        });

        if (checkMin) {
          overflown = true;
          steps.push({
            line: 7,
            description: `Overflow detected! Exceeds INT_MIN. Returning 0.`,
            variables: { x: 0, rev: 0, originalX: origX, result: 0 },
            logEntry: `Terminated with overflow result: 0.`
          });
          break;
        }

        const oldRev = rev;
        rev = rev * 10 + pop;

        steps.push({
          line: 8,
          description: `Accumulate digits safely: rev = rev * 10 + pop => ${oldRev} * 10 + ${pop} = ${rev}.`,
          variables: { x, rev, pop, originalX: origX, stepNum, INT_MAX, INT_MIN },
          logEntry: `Accumulated rev is now ${rev}.`
        });
      }

      if (!overflown) {
        steps.push({
          line: 3,
          description: `Check loop condition: x = ${x} !== 0. (False, digits exhausted).`,
          variables: { x, rev, originalX: origX, INT_MAX, INT_MIN },
          logEntry: `Loop ended safely.`
        });

        steps.push({
          line: 10,
          description: `Reversing process finished safely. Returning final reversed value: ${rev}.`,
          variables: { x, rev, originalX: origX, result: rev, INT_MAX, INT_MIN },
          logEntry: `Completed simulation. Reversed value of ${origX} is ${rev}.`
        });
        expectedOutput = `${rev}`;
      } else {
        expectedOutput = '0';
      }
      break;
    }

    case 'lc172': {
      let n = typeof input.n !== 'undefined' ? parseInt(input.n, 10) : 100;
      if (isNaN(n)) n = 100;

      const origN = n;
      let count = 0;

      steps.push({
        line: 1,
        description: `Starting Legendre's formula calculation to find trailing zeroes in ${n}!.`,
        variables: { n, count, originalN: origN },
        logEntry: `Initialized trailing zero calculation for N! = ${n}!.`
      });

      steps.push({
        line: 2,
        description: `Initialize total trailing zeroes count variable to 0.`,
        variables: { n, count, originalN: origN },
        logEntry: `Initialized factor-5 counter to 0.`
      });

      let power = 5;
      while (n >= 5) {
        const addedZeros = Math.floor(n / 5);
        steps.push({
          line: 3,
          description: `Check condition: current division source value n = ${n} >= 5. (True, continuing quotient counts).`,
          variables: { n, count, power5: power, addedZeros, originalN: origN },
          logEntry: `Checking division block: N is ${n}.`
        });

        const oldZeros = count;
        count += addedZeros;

        steps.push({
          line: 4,
          description: `Divide N by 5 and add count: count = count + floor(n / 5) => ${oldZeros} + floor(${n}/5) => ${oldZeros} + ${addedZeros} = ${count}.`,
          variables: { n, count, power5: power, addedZeros, originalN: origN },
          logEntry: `Calculated factors of ${power} in range: found ${addedZeros} multiples. Total zeros count is now ${count}.`
        });

        const oldN = n;
        n = Math.floor(n / 5);
        power *= 5;

        steps.push({
          line: 5,
          description: `Chop n for the next power of 5: n = n / 5 => floor(${oldN} / 5) = ${n}. Next multiples step size is ${power}.`,
          variables: { n, count, power5: power, originalN: origN },
          logEntry: `Shifted division source from ${oldN} to ${n} (representing power scale of ${power}).`
        });
      }

      steps.push({
        line: 3,
        description: `Check condition: current division source value n = ${n} >= 5. (False, loop ends).`,
        variables: { n, count, originalN: origN },
        logEntry: `N is ${n} (< 5). All multiples of prime factor 5 are counted.`
      });

      steps.push({
        line: 7,
        description: `Calculation finished. Trailing zeroes in ${origN}! is ${count}.`,
        variables: { n, count, result: count, originalN: origN },
        logEntry: `Completed simulation. Zeroes in ${origN}! is ${count}.`
      });

      expectedOutput = `${count}`;
      break;
    }

    case 'lc171_168': {
      // Handles bidirectional bijective conversion!
      let columnTitle = input.columnTitle || 'FXSH';
      let numInput = NaN;
      if (typeof columnTitle === 'string' && !isNaN(Number(columnTitle))) {
        numInput = parseInt(columnTitle, 10);
      }

      const isTitleToNum = isNaN(numInput);

      if (isTitleToNum) {
        columnTitle = columnTitle.toUpperCase().replace(/[^A-Z]/g, '') || 'FXSH';
        const s = columnTitle;
        let result = 0;

        steps.push({
          line: 1,
          description: `Starting excel column title to number conversion for Title: "${s}".`,
          variables: { s, result, charIndex: 0, phase: 'init' },
          logEntry: `Initialized Excel column index calculation.`
        });

        steps.push({
          line: 2,
          description: `Initialize result accumulator = 0.`,
          variables: { s, result, charIndex: 0, phase: 'init' },
          logEntry: `Initialized result accumulator.`
        });

        steps.push({
          line: 3,
          description: `Loop through each character from left to right in string "${s}".`,
          variables: { s, result, charIndex: 0, phase: 'loop' },
          logEntry: `Starting string characters traversal.`
        });

        for (let i = 0; i < s.length; i++) {
          const char = s[i];
          const val = char.charCodeAt(0) - 65 + 1; // 'A' is 65
          const oldRes = result;
          result = result * 26 + val;

          steps.push({
            line: 4,
            description: `Character at index ${i} is '${char}'. Compute alphabetical code: '${char}' - 'A' + 1 => ${val}.`,
            variables: { s, result: oldRes, char, charVal: val, charIndex: i, phase: 'loop' },
            logEntry: `Character '${char}' maps to digit ${val} in bijective base-26.`
          });

          steps.push({
            line: 5,
            description: `Update positional value: result = result * 26 + charVal => ${oldRes} * 26 + ${val} = ${result}.`,
            variables: { s, result, char, charVal: val, charIndex: i, phase: 'loop' },
            logEntry: `Position shift: result is updated to ${result}.`
          });
        }

        steps.push({
          line: 7,
          description: `Conversion complete! Excel sheet column Title "${s}" corresponds to Column Number ${result}.`,
          variables: { s, result, phase: 'done' },
          logEntry: `Excel conversion finished: "${s}" -> ${result}.`
        });

        expectedOutput = `${result}`;
      } else {
        // Bijective base-26 conversion backwards (Num to Title)
        let num = numInput;
        const origNum = num;
        let titleResult = '';

        steps.push({
          line: 1,
          description: `Starting excel column number to title conversion for Index: ${num}.`,
          variables: { originalNumber: origNum, currentNumber: num, titleResult, phase: 'init' },
          logEntry: `Initialized Number-to-Title bijective conversion for column = ${num}.`
        });

        while (num > 0) {
          steps.push({
            line: 3,
            description: `Loop iteration: current index value num = ${num} > 0.`,
            variables: { originalNumber: origNum, currentNumber: num, titleResult, phase: 'loop' },
            logEntry: `Reducing number ${num}.`
          });

          const adjustedNum = num - 1;
          const rem = adjustedNum % 26;
          const charCode = 65 + rem; // 65 is 'A'
          const char = String.fromCharCode(charCode);
          const oldTitle = titleResult;
          titleResult = char + titleResult;

          steps.push({
            line: 4,
            description: `Adjust for bijective offsetting: subtract 1 from num (${num} - 1 = ${adjustedNum}). Take modulo 26 to extract remainder: ${adjustedNum} % 26 = ${rem}.`,
            variables: { originalNumber: origNum, currentNumber: num, adjustedNumber: adjustedNum, rem, char, titleResult: oldTitle, phase: 'loop' },
            logEntry: `Bijective adjustment: (${num}-1) % 26 = remainder ${rem}. Maps to letter '${char}'.`
          });

          steps.push({
            line: 5,
            description: `Prepend letter '${char}' to running title accumulator: "${char}" + "${oldTitle}" => "${titleResult}".`,
            variables: { originalNumber: origNum, currentNumber: num, adjustedNumber: adjustedNum, rem, char, titleResult, phase: 'loop' },
            logEntry: `Prepend letter '${char}' to title result => "${titleResult}".`
          });

          const oldNum = num;
          num = Math.floor(adjustedNum / 26);

          steps.push({
            line: 5,
            description: `Divide number to progress to next base place: num = floor(adjustedNum / 26) => floor(${adjustedNum} / 26) = ${num}.`,
            variables: { originalNumber: origNum, currentNumber: num, titleResult, phase: 'loop' },
            logEntry: `Base shift: number reduced from ${oldNum} to ${num}.`
          });
        }

        steps.push({
          line: 7,
          description: `Conversion complete! Excel column number ${origNum} corresponds to Title "${titleResult}".`,
          variables: { originalNumber: origNum, currentNumber: num, titleResult, result: titleResult, phase: 'done' },
          logEntry: `Reverse conversion finished: ${origNum} -> "${titleResult}".`
        });

        expectedOutput = `"${titleResult}"`;
      }
      break;
    }

    default:
      break;
  }

  return {
    steps,
    expectedOutput
  };
}
