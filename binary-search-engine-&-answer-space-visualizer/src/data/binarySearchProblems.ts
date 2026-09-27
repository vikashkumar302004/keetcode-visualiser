/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  // --- Category 1: Classic 1D ---
  {
    id: 'binary-search',
    sequenceNum: 1,
    title: 'Binary Search',
    leetcode: 'LC #704',
    difficulty: 'Easy',
    category: 'Classic 1D Search',
    description: 'Find target in a sorted ascending array.',
    details: 'The classic algorithm divides the active search range in half in O(log N) time. It uses an overflow-safe midpoint: mid = low + (high - low) / 2.',
    invariant: 'The array nums is sorted in ascending order. If target exists, it is within nums[low...high].',
    defaultArray: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21],
    defaultTarget: 13
  },
  {
    id: 'lower-upper-bound',
    sequenceNum: 2,
    title: 'Lower & Upper Bound',
    leetcode: 'C++ std::bounds',
    difficulty: 'Easy',
    category: 'Classic 1D Search',
    description: 'Find first index >= target (Lower Bound) and > target (Upper Bound).',
    details: 'Lower bound finds the first element not less than target. Upper bound finds the first element strictly greater than target. These are essential primitives for range queries.',
    invariant: 'The array nums is sorted. Range halves based on conditional checks, recording candidate solutions and moving limits.',
    defaultArray: [1, 2, 4, 4, 4, 6, 7, 9, 10, 10, 12],
    defaultTarget: 4
  },
  {
    id: 'search-insert',
    sequenceNum: 3,
    title: 'Search Insert Position',
    leetcode: 'LC #35',
    difficulty: 'Easy',
    category: 'Classic 1D Search',
    description: 'Find position to insert target in a sorted array to maintain order.',
    details: 'If target is found, return its index. If not found, return the index where it should be inserted (which is low at the end of loop).',
    invariant: 'For any target, the final insert position is exactly low where the search range [low...high] collapses.',
    defaultArray: [1, 3, 5, 6, 8, 10, 12],
    defaultTarget: 7
  },
  {
    id: 'first-last-pos',
    sequenceNum: 4,
    title: 'First & Last Position',
    leetcode: 'LC #34',
    difficulty: 'Medium',
    category: 'Classic 1D Search',
    description: 'Find starting and ending position of a given target in a sorted array.',
    details: 'Runs two binary searches. One finds the leftmost position (lower bound with confirmation), and the second finds the rightmost position.',
    invariant: 'Left search targets first occurrence (shrinks right when nums[mid] >= target). Right search targets last occurrence (shrinks left when nums[mid] <= target).',
    defaultArray: [5, 7, 7, 8, 8, 8, 8, 10],
    defaultTarget: 8
  },
  {
    id: 'single-element-sorted',
    sequenceNum: 5,
    title: 'Single Element in Sorted Array',
    leetcode: 'LC #540',
    difficulty: 'Medium',
    category: 'Classic 1D Search',
    description: 'Find the unique element in an array where every other element appears twice.',
    details: 'All elements except one appear twice. We can binary search using index parity. In a clean pairs array, the first occurrence of a pair is at an even index and second at an odd index.',
    invariant: 'If the single element is on the right, the pair at mid starts at an even index. If mid is even, check nums[mid] == nums[mid+1]. If true, single element is on the right (set low = mid + 2).',
    defaultArray: [1, 1, 2, 3, 3, 4, 4, 8, 8],
    defaultTarget: 0 // Target is not used for single element
  },

  // --- Category 2: Rotated & Mountain ---
  {
    id: 'search-rotated-1',
    sequenceNum: 6,
    title: 'Search in Rotated Sorted Array I',
    leetcode: 'LC #33',
    difficulty: 'Medium',
    category: 'Rotated & Mountain Arrays',
    description: 'Find target in a rotated sorted array with unique elements.',
    details: 'Even after rotation, one half of the array is always sorted. Determine which half is sorted, then check if target falls within that sorted half to discard the other half.',
    invariant: 'nums[low...high] contains a single rotation pivot. At least one half nums[low...mid] or nums[mid...high] is strictly sorted.',
    defaultArray: [4, 5, 6, 7, 0, 1, 2],
    defaultTarget: 0
  },
  {
    id: 'search-rotated-2',
    sequenceNum: 7,
    title: 'Search in Rotated Sorted Array II',
    leetcode: 'LC #81',
    difficulty: 'Medium',
    category: 'Rotated & Mountain Arrays',
    description: 'Find target in a rotated sorted array containing duplicates.',
    details: 'When duplicates exist, we can get nums[low] == nums[mid] == nums[high]. In this case, we cannot determine which half is sorted, so we must fall back to low++ and high--.',
    invariant: 'Worst case is O(N) when duplicate elements fill the array, but average remains O(log N).',
    defaultArray: [2, 5, 6, 0, 0, 1, 2, 2, 2],
    defaultTarget: 0
  },
  {
    id: 'find-min-rotated',
    sequenceNum: 8,
    title: 'Find Minimum in Rotated Sorted Array',
    leetcode: 'LC #153',
    difficulty: 'Medium',
    category: 'Rotated & Mountain Arrays',
    description: 'Find the minimum element in a rotated sorted array of unique values.',
    details: 'Compare nums[mid] with nums[high]. If nums[mid] > nums[high], the pivot and minimum lie in the right unsorted half. Otherwise, minimum lies in the left sorted half.',
    invariant: 'The minimum element is always maintained within the active range [low...high].',
    defaultArray: [4, 5, 6, 7, 1, 2, 3],
    defaultTarget: 0 // Target not used
  },
  {
    id: 'peak-mountain',
    sequenceNum: 9,
    title: 'Peak Index in Mountain Array',
    leetcode: 'LC #852 / #162',
    difficulty: 'Medium',
    category: 'Rotated & Mountain Arrays',
    description: 'Find peak element index in an array that increases then decreases.',
    details: 'Binary search on gradient slope. Compare nums[mid] with nums[mid + 1]. If nums[mid] < nums[mid + 1], we are on an ascending slope, so peak must be on the right (set low = mid + 1). Otherwise, we are descending.',
    invariant: 'A mountain peak exists and is enclosed by the active bounds. Checking mid vs mid+1 isolates the direction.',
    defaultArray: [1, 3, 5, 10, 8, 6, 4, 2, 0],
    defaultTarget: 0 // Target not used
  },

  // --- Category 3: 2D Matrix ---
  {
    id: 'search-2d-matrix-1',
    sequenceNum: 10,
    title: 'Search a 2D Matrix I',
    leetcode: 'LC #74',
    difficulty: 'Easy',
    category: '2D Matrix Search',
    description: 'Find target in a matrix where rows and columns are fully sorted sequentially.',
    details: 'Since the last element of a row is smaller than the first element of the next, we can flatten the R x C matrix into a virtual 1D array of size R * C and apply binary search.',
    invariant: 'Virtual index mid corresponds to row = mid / cols and col = mid % cols.',
    defaultArray: [
      [1, 3, 5, 7],
      [10, 11, 16, 20],
      [23, 30, 34, 60]
    ],
    defaultTarget: 16
  },
  {
    id: 'search-2d-matrix-2',
    sequenceNum: 11,
    title: 'Search a 2D Matrix II',
    leetcode: 'LC #240',
    difficulty: 'Medium',
    category: '2D Matrix Search',
    description: 'Search target in a matrix sorted in ascending order along rows and columns.',
    details: 'Start at the top-right corner (or bottom-left). If cell value is greater than target, the entire column can be eliminated (col--). If smaller, the entire row is eliminated (row++).',
    invariant: 'At each cell [row, col], we eliminate either a full row or a full column in O(M + N) time.',
    defaultArray: [
      [1, 4, 7, 11, 15],
      [2, 5, 8, 12, 19],
      [3, 6, 9, 16, 22],
      [10, 13, 14, 17, 24],
      [18, 21, 23, 26, 30]
    ],
    defaultTarget: 5
  },

  // --- Category 4: Search on Answer ---
  {
    id: 'integer-sqrt',
    sequenceNum: 12,
    title: 'Sqrt(x) / Integer Square Root',
    leetcode: 'LC #69',
    difficulty: 'Easy',
    category: 'Binary Search on Answer',
    description: 'Compute the integer square root of a non-negative integer x.',
    details: 'The search space is [1 ... x]. For each candidate mid, check if mid * mid <= x. If yes, mid is a viable candidate (record ans = mid) and try a larger number on the right. Otherwise, go left.',
    invariant: 'The answer is the largest integer mid whose square is less than or equal to x.',
    defaultArray: [45], // Represent x as first item
    defaultTarget: 0, // Not used
    extraParams: {
      x: { label: 'Input Value (x)', defaultValue: 45, min: 1, max: 200 }
    }
  },
  {
    id: 'koko-bananas',
    sequenceNum: 13,
    title: 'Koko Eating Bananas',
    leetcode: 'LC #875',
    difficulty: 'Medium',
    category: 'Binary Search on Answer',
    description: 'Find minimum eating speed k to finish all bananas within h hours.',
    details: 'Bananas in pile can be finished in ceil(pile / k) hours. Search speed in [1 ... max(piles)]. If possible(mid), speed mid is feasible (record as ans) and search lower speeds on left.',
    invariant: 'The speed feasibility is monotonic: if speed speed_1 is feasible, any speed_2 > speed_1 is also feasible.',
    defaultArray: [3, 6, 7, 11],
    defaultTarget: 0, // Not used
    extraParams: {
      h: { label: 'Available Hours (h)', defaultValue: 8, min: 4, max: 24 }
    }
  },
  {
    id: 'capacity-ship',
    sequenceNum: 14,
    title: 'Capacity To Ship Packages',
    leetcode: 'LC #1011',
    difficulty: 'Medium',
    category: 'Binary Search on Answer',
    description: 'Find minimum ship capacity to ship all packages within D days.',
    details: 'Search space is [max(weights) ... sum(weights)]. For a mid capacity, greedily load packages. If days taken <= D, mid is feasible (record as ans) and try smaller capacities on left.',
    invariant: 'Capacity is monotonic. Feasibility function loads elements in sequence without reordering.',
    defaultArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    defaultTarget: 0,
    extraParams: {
      days: { label: 'Days Limit (D)', defaultValue: 5, min: 1, max: 15 }
    }
  },
  {
    id: 'split-array-sum',
    sequenceNum: 15,
    title: 'Split Array Largest Sum',
    leetcode: 'LC #410',
    difficulty: 'Hard',
    category: 'Binary Search on Answer',
    description: 'Split array into k subarrays to minimize the maximum sum among them.',
    details: 'Search space is [max(nums) ... sum(nums)]. For mid maximum sum, count minimum split groups. If groups <= k, mid is feasible. Try smaller maximums on left.',
    invariant: 'Minimizing maximum subarray sum using binary search on answer with a greedy feasibility check.',
    defaultArray: [7, 2, 5, 10, 8],
    defaultTarget: 0,
    extraParams: {
      k: { label: 'Subarrays (k)', defaultValue: 2, min: 1, max: 5 }
    }
  },
  {
    id: 'aggressive-cows',
    sequenceNum: 16,
    title: 'Aggressive Cows / Magnetic Force',
    leetcode: 'LC #1552',
    difficulty: 'Hard',
    category: 'Binary Search on Answer',
    description: 'Place c items into stalls to maximize the minimum distance between any two.',
    details: 'Sort stall positions. Search space is [1 ... max_dist]. For distance mid, greedily place items. If c items can be placed, mid distance is feasible (record as ans) and try larger distances.',
    invariant: 'Maximize minimum distance. Feasible at distance x means we can place all c items such that absolute difference >= x.',
    defaultArray: [1, 2, 4, 8, 9], // stall positions
    defaultTarget: 0,
    extraParams: {
      cows: { label: 'Cows/Balls (c)', defaultValue: 3, min: 2, max: 5 }
    }
  },
  {
    id: 'median-two-sorted',
    sequenceNum: 17,
    title: 'Median of Two Sorted Arrays',
    leetcode: 'LC #4',
    difficulty: 'Hard',
    category: 'Binary Search on Answer',
    description: 'Find median of two sorted arrays of size m and n in O(log(min(m,n))) time.',
    details: 'Binary search partition on the smaller array. Partition index i split smaller array, and index j = (m + n + 1) / 2 - i splits larger array. We check if left max <= right min.',
    invariant: 'Partitioning both arrays such that elements in left half are smaller than elements in right half, then calculating median.',
    defaultArray: [1, 3, 8, 9, 15], // Array 1
    defaultTarget: 0,
    extraParams: {
      array2: { label: 'Array 2 (second)', defaultValue: 7, min: 1, max: 5 } // Custom toggle or second array configured in canvas
    }
  }
];
