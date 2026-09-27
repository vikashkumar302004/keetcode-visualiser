import { Problem } from '../types';

export const pointerProblems: Problem[] = [
  // Opposite Direction
  {
    id: 'two-sum-ii',
    seq: 1,
    title: 'Two Sum II - Input Array Is Sorted',
    leetcodeId: 'LC #167',
    difficulty: 'Medium',
    category: 'opposite',
    description: 'Find two numbers in a 1-indexed sorted array such that they add up to a specific target number.',
    invariant: 'Since the array is sorted, we can converge inward. If the sum is too small, increase the left pointer; if too large, decrease the right pointer.',
    defaultArray: [2, 7, 11, 15],
    defaultTarget: 9,
    presets: [
      { label: 'Standard Target 9', array: [2, 7, 11, 15], target: 9 },
      { label: 'Large Array Target 18', array: [1, 3, 4, 6, 8, 10, 12, 15], target: 18 },
      { label: 'Target 10 (Duplicates)', array: [2, 3, 5, 5, 8, 11], target: 10 }
    ]
  },
  {
    id: 'valid-palindrome',
    seq: 2,
    title: 'Valid Palindrome',
    leetcodeId: 'LC #125',
    difficulty: 'Easy',
    category: 'opposite',
    description: 'Determine if a string is a palindrome, considering only alphanumeric characters and ignoring cases.',
    invariant: 'Using left and right pointers at both ends of the string, skip non-alphanumeric characters, and check if lowercased elements match as they converge.',
    defaultArray: [1, 2, 3, 2, 1], // In visual form, we represent characters as elements: "A", "m", "a", "n", "a", "p", ... We can model it with an array of characters (or integers representing characters)
    presets: [
      { label: 'Palindromic Numbers', array: [1, 2, 3, 4, 3, 2, 1] },
      { label: 'Non-Palindrome', array: [1, 2, 3, 4, 5, 2, 1] },
      { label: 'Uniform Symmetric', array: [9, 9, 9, 9, 9, 9] }
    ]
  },
  {
    id: 'reverse-string',
    seq: 3,
    title: 'Reverse String',
    leetcodeId: 'LC #344',
    difficulty: 'Easy',
    category: 'opposite',
    description: 'Reverse an array in-place using O(1) extra memory.',
    invariant: 'Swap the elements at the left and right pointers, then increment left and decrement right until they meet in the middle.',
    defaultArray: [1, 2, 3, 4, 5, 6, 7],
    presets: [
      { label: 'Odd Count', array: [1, 2, 3, 4, 5, 6, 7] },
      { label: 'Even Count', array: [10, 20, 30, 40, 50, 60] },
      { label: 'Symmetric Ends', array: [5, 1, 1, 1, 1, 5] }
    ]
  },
  {
    id: 'container-with-most-water',
    seq: 4,
    title: 'Container With Most Water',
    leetcodeId: 'LC #11',
    difficulty: 'Medium',
    category: 'opposite',
    description: 'Find two lines that, together with the x-axis, form a container that holds the most water.',
    invariant: 'Calculate the area with width (right - left) and height (min(height[left], height[right])). Always shift the pointer of the shorter bar inward, as that is the only way to potentially find a taller boundary and a larger area.',
    defaultArray: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    presets: [
      { label: 'Standard Peak-to-Peak', array: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
      { label: 'Descending Steps', array: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
      { label: 'Symmetrical Valley', array: [8, 2, 1, 1, 2, 8] }
    ]
  },
  {
    id: '3sum',
    seq: 5,
    title: '3Sum',
    leetcodeId: 'LC #15',
    difficulty: 'Medium',
    category: 'opposite',
    description: 'Find all unique triplets in the array which gives the sum of zero.',
    invariant: 'Sort the array first. Iterate each element i. Use opposite pointers (left = i+1, right = n-1) to scan for nums[left] + nums[right] == -nums[i]. Skip duplicates for i, left, and right to avoid redundant triplets.',
    defaultArray: [-4, -1, -1, 0, 1, 2],
    presets: [
      { label: 'Sorted Mixed Duplicates', array: [-4, -1, -1, 0, 1, 2] },
      { label: 'All Zeroes', array: [0, 0, 0, 0, 0] },
      { label: 'No Triplets Valid', array: [-3, -2, 5, 10, 15] }
    ]
  },
  {
    id: '4sum',
    seq: 6,
    title: '4Sum',
    leetcodeId: 'LC #18',
    difficulty: 'Medium',
    category: 'opposite',
    description: 'Find all unique quadruplets in the array which gives the sum of target.',
    invariant: 'Sort the array. Run dual outer loops with pointers i and j. Then use a nested opposite two-pointer convergence (left = j+1, right = n-1) to find sums matching target.',
    defaultArray: [-3, -1, 0, 1, 2, 3],
    defaultTarget: 0,
    presets: [
      { label: 'Sum Target 0', array: [-3, -1, 0, 1, 2, 3], target: 0 },
      { label: 'Sum Target 2', array: [-2, -1, 0, 0, 1, 2], target: 2 }
    ]
  },
  {
    id: 'trapping-rain-water',
    seq: 7,
    title: 'Trapping Rain Water',
    leetcodeId: 'LC #42',
    difficulty: 'Hard',
    category: 'opposite',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    invariant: 'Track leftMax and rightMax of elevations. Iterate inwards from left & right; the water trapped is limited by the lower maximum wall. Add leftMax - height[left] if height[left] is smaller, else rightMax - height[right].',
    defaultArray: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    presets: [
      { label: 'LeetCode Elevation Map', array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] },
      { label: 'Deep Central Valley', array: [4, 2, 0, 3, 2, 5] },
      { label: 'Staircase No Trapped Water', array: [1, 2, 3, 4, 5, 4, 3, 2, 1] }
    ]
  },

  // Same Direction & Fast/Slow
  {
    id: 'remove-duplicates',
    seq: 8,
    title: 'Remove Duplicates from Sorted Array',
    leetcodeId: 'LC #26',
    difficulty: 'Easy',
    category: 'same',
    description: 'Remove duplicates from a sorted array in-place such that each unique element appears only once.',
    invariant: 'Use a slow pointer to track the unique elements boundary, and a fast pointer to scan the array. When nums[fast] != nums[slow], increment slow and copy nums[fast] to nums[slow].',
    defaultArray: [1, 1, 2, 2, 3, 4, 4],
    presets: [
      { label: 'Multiple Duplicates', array: [1, 1, 2, 2, 3, 4, 4] },
      { label: 'All Duplicates', array: [2, 2, 2, 2, 2] },
      { label: 'No Duplicates', array: [1, 2, 3, 4, 5] }
    ]
  },
  {
    id: 'move-zeroes',
    seq: 9,
    title: 'Move Zeroes',
    leetcodeId: 'LC #283',
    difficulty: 'Easy',
    category: 'same',
    description: 'Move all 0s to the end of the array while maintaining the relative order of the non-zero elements in-place.',
    invariant: 'Slow pointer tracks the write-head for non-zero elements. Fast pointer scans. When a non-zero element is encountered, swap it with nums[slow] and increment slow.',
    defaultArray: [0, 1, 0, 3, 12],
    presets: [
      { label: 'Mixed Zeroes', array: [0, 1, 0, 3, 12] },
      { label: 'Zeroes At Front', array: [0, 0, 0, 1, 2, 3] },
      { label: 'No Zeroes', array: [1, 2, 3, 4, 5] }
    ]
  },
  {
    id: 'sort-colors',
    seq: 10,
    title: 'Sort Colors (Dutch National Flag)',
    leetcodeId: 'LC #75',
    difficulty: 'Medium',
    category: 'same',
    description: 'Sort an array of red, white, and blue elements (represented as 0, 1, 2) in-place without using the library sort function.',
    invariant: 'Maintain three pointers: low (boundary of 0s), mid (current active scan index), and high (boundary of 2s). Swap elements into their correct boundaries as mid traverses.',
    defaultArray: [2, 0, 2, 1, 1, 0],
    presets: [
      { label: 'Unsorted 0, 1, 2 Colors', array: [2, 0, 2, 1, 1, 0] },
      { label: 'Only 0 and 2', array: [2, 0, 0, 2, 0, 2] },
      { label: 'Already Sorted Colors', array: [0, 0, 1, 1, 2, 2] }
    ]
  },
  {
    id: 'linked-list-cycle',
    seq: 11,
    title: 'Linked List Cycle',
    leetcodeId: 'LC #141 / #142',
    difficulty: 'Medium',
    category: 'same',
    description: 'Detect if a linked list contains a cycle. If yes, locate the index of node where the cycle starts using Floyd\'s Tortoise and Hare algorithm.',
    invariant: 'Slow pointer moves 1 step at a time, Fast pointer moves 2 steps. If a cycle exists, they will eventually meet. To find the cycle start, reset slow to head, then advance both slow and fast 1 step at a time; they will meet at the start of the cycle.',
    defaultArray: [3, 2, 0, -4], // We can simulate a cycle by having a cycle target index (e.g., node at index 3 connects back to index 1)
    defaultTarget: 1, // Cycle start index (target)
    presets: [
      { label: 'Cycle back to Index 1', array: [3, 2, 0, -4], target: 1 },
      { label: 'Cycle back to Head (Index 0)', array: [1, 2, 3, 4, 5], target: 0 },
      { label: 'No Cycle', array: [10, 20, 30, 40], target: -1 }
    ]
  },
  {
    id: 'middle-of-linked-list',
    seq: 12,
    title: 'Middle of the Linked List',
    leetcodeId: 'LC #876',
    difficulty: 'Easy',
    category: 'same',
    description: 'Find the middle node of a linked list. If there are two middle nodes, return the second middle node.',
    invariant: 'Slow pointer moves 1 step per turn, while Fast pointer moves 2 steps. When Fast reaches the end of the list, Slow will be exactly at the middle node.',
    defaultArray: [1, 2, 3, 4, 5, 6],
    presets: [
      { label: 'Even Nodes Count (6)', array: [1, 2, 3, 4, 5, 6] },
      { label: 'Odd Nodes Count (5)', array: [1, 2, 3, 4, 5] }
    ]
  },

  // Kadane's Algorithm & Subarray Optimization
  {
    id: 'maximum-subarray',
    seq: 13,
    title: 'Maximum Subarray (Kadane\'s)',
    leetcodeId: 'LC #53',
    difficulty: 'Medium',
    category: 'kadane',
    description: 'Find the contiguous subarray within a one-dimensional array of numbers which has the largest sum.',
    invariant: 'Discard negative prefixes! At each index, decide whether to append the element to the current subarray (currentSum + num) or start a new subarray from this element (num). Track the global maximum.',
    defaultArray: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    presets: [
      { label: 'LeetCode Standard Case', array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
      { label: 'All Negative Values', array: [-3, -1, -5, -2, -8] },
      { label: 'Alternating Highs', array: [1, -2, 3, -1, 4, -5, 6] }
    ]
  },
  {
    id: 'maximum-sum-circular-subarray',
    seq: 14,
    title: 'Maximum Sum Circular Subarray',
    leetcodeId: 'LC #918',
    difficulty: 'Medium',
    category: 'kadane',
    description: 'Find the maximum possible sum of a non-empty contiguous subarray in a circular array.',
    invariant: 'The max subarray sum can either wrap around or not. Use Kadane\'s to find: 1) Max subarray sum in standard array, 2) Min subarray sum in standard array. Max circular sum = max(maxSum, totalSum - minSum). (Edge case: all negative, answer is maxSum).',
    defaultArray: [5, -3, 5],
    presets: [
      { label: 'Symmetrical Wrapping', array: [5, -3, 5] },
      { label: 'Standard Non-Wrapping Max', array: [1, -2, 3, -2] },
      { label: 'Wrap with Negative Valley', array: [3, -2, 2, -3, 3] }
    ]
  },
  {
    id: 'maximum-product-subarray',
    seq: 15,
    title: 'Maximum Product Subarray',
    leetcodeId: 'LC #152',
    difficulty: 'Medium',
    category: 'kadane',
    description: 'Find the contiguous subarray within an array of numbers that has the largest product.',
    invariant: 'Track both max product and min product. When encountering a negative number, maximum and minimum products swap. Always compute maxProd = max(x, maxProd * x) and minProd = min(x, minProd * x) to handle signs.',
    defaultArray: [2, 3, -2, 4],
    presets: [
      { label: 'Single Negative', array: [2, 3, -2, 4] },
      { label: 'Even Negatives (Double Negative Multiplying)', array: [-2, 3, -4] },
      { label: 'With Zero Disruption', array: [-2, 0, -1] }
    ]
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    seq: 16,
    title: 'Best Time to Buy and Sell Stock',
    leetcodeId: 'LC #121',
    difficulty: 'Easy',
    category: 'kadane',
    description: 'Find the maximum profit you can achieve by buying on a single day and selling on a different day in the future.',
    invariant: 'This is a 1D Kadane variant. Maintain the minimum price seen so far. At each index, calculate the current profit (price - minPrice) and update the global maximum profit.',
    defaultArray: [7, 1, 5, 3, 6, 4],
    presets: [
      { label: 'Standard Fluctuations', array: [7, 1, 5, 3, 6, 4] },
      { label: 'Strictly Descending (No Profit)', array: [7, 6, 5, 4, 3, 1] },
      { label: 'U-Shape Rise', array: [3, 2, 1, 4, 5, 6] }
    ]
  },
  {
    id: 'maximum-absolute-sum-of-any-subarray',
    seq: 17,
    title: 'Maximum Absolute Sum of Any Subarray',
    leetcodeId: 'LC #1749',
    difficulty: 'Medium',
    category: 'kadane',
    description: 'Find the absolute maximum sum of any contiguous subarray.',
    invariant: 'The maximum absolute sum is max(max_subarray_sum, |min_subarray_sum|). Run a double-ended Kadane tracking both the highest positive peak and lowest negative valley.',
    defaultArray: [1, -3, 2, 3, -4],
    presets: [
      { label: 'Positive and Negative Valleys', array: [1, -3, 2, 3, -4] },
      { label: 'Deep Negative Subarray', array: [2, -5, 1, -4, 3] },
      { label: 'All Positive', array: [1, 2, 3, 4, 5] }
    ]
  }
];
