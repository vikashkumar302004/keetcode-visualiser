import { ProblemDefinition } from '../types';

export const HEAP_PROBLEMS: ProblemDefinition[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. Core Heap Foundations & Operations
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'p01_insert',
    sequenceNumber: 1,
    title: 'Insert & Percolate Up / Sift-Up',
    difficulty: 'Easy',
    category: 'Core Heap Foundations',
    description: 'Insert a new key into the binary heap. The new element is appended to the next available position at the bottom of the complete tree (end of array), then compared with its parent and swapped repeatedly until the heap order property is restored.',
    constraints: [
      'Heap array size <= 15 for optimal visual density',
      'Parent index: floor((i - 1) / 2)',
      'Left child: 2i + 1, Right child: 2i + 2',
      'Invariant: heap[parent] >= heap[child] (Max-Heap) or heap[parent] <= heap[child] (Min-Heap)'
    ],
    complexity: {
      time: 'O(log N) - at most height h = floor(log2 N) swaps',
      space: 'O(1) auxiliary space'
    },
    algorithmicInsight: 'Sift-up only inspects the direct ancestral chain from leaf to root, requiring at most log2(N) comparisons and swaps.',
    defaultHeapType: 'max',
    params: [
      { key: 'initialHeap', label: 'Existing Heap', type: 'array', defaultValue: [90, 75, 80, 50, 60, 40, 70] },
      { key: 'insertVal', label: 'Element to Insert', type: 'number', defaultValue: 85 }
    ],
    defaultTestCase: {
      initialHeap: [90, 75, 80, 50, 60, 40, 70],
      insertVal: 85
    }
  },
  {
    id: 'p02_extract',
    sequenceNumber: 2,
    title: 'Extract Min/Max & Percolate Down / Sift-Down',
    difficulty: 'Easy',
    category: 'Core Heap Foundations',
    description: 'Remove and return the priority element at the root. The last leaf element is moved to the root position to preserve the complete binary tree shape, and is then sifted down by swapping with its highest priority child until the heap invariant is restored.',
    constraints: [
      'Root element is at index 0',
      'Swap root with array.back() and pop last element',
      'Compare parent with children: 2i + 1 and 2i + 2'
    ],
    complexity: {
      time: 'O(log N) - traverses down single path of height h',
      space: 'O(1) auxiliary space'
    },
    algorithmicInsight: 'In sift-down, you must select the larger (for max-heap) or smaller (for min-heap) child before swapping to maintain invariant across both subtrees.',
    defaultHeapType: 'max',
    params: [
      { key: 'heap', label: 'Heap Elements', type: 'array', defaultValue: [95, 80, 85, 60, 70, 50, 65, 30, 40] }
    ],
    defaultTestCase: {
      heap: [95, 80, 85, 60, 70, 50, 65, 30, 40]
    }
  },
  {
    id: 'p03_build_heap',
    sequenceNumber: 3,
    title: "Build Heap (Floyd's Algorithm)",
    difficulty: 'Medium',
    category: 'Core Heap Foundations',
    description: "Transforms an arbitrary unsorted array into a valid heap in linear time O(N) using bottom-up sift-down operations starting from the last non-leaf node at index floor(N/2) - 1 down to index 0.",
    constraints: [
      'Leaves located from index floor(N/2) to N-1 are already trivial 1-node heaps',
      'Iterate backwards: i = (N / 2) - 1 down to 0',
      'Significantly faster than N successive insertions which cost O(N log N)'
    ],
    complexity: {
      time: 'O(N) - sum of heights across all nodes is bounded by 2N',
      space: 'O(1) in-place'
    },
    algorithmicInsight: "Most nodes in a complete binary tree reside near the bottom (depth h) and require at most 0 or 1 sift steps, leading to linear Sigma(n/2^(h+1) * h) = O(N) time.",
    defaultHeapType: 'max',
    params: [
      { key: 'arr', label: 'Unsorted Array', type: 'array', defaultValue: [14, 28, 65, 32, 89, 45, 99, 12] }
    ],
    defaultTestCase: {
      arr: [14, 28, 65, 32, 89, 45, 99, 12]
    }
  },
  {
    id: 'p04_heap_sort',
    sequenceNumber: 4,
    title: 'In-Place Heap Sort',
    difficulty: 'Medium',
    category: 'Core Heap Foundations',
    description: 'An optimal in-place comparison sort. First builds a Max-Heap in O(N). Then repeatedly swaps the root (max element) with the last element in the active heap, decreases the active heap size by 1, and sifts down the new root.',
    constraints: [
      'Array is partitioned into: [Active Max-Heap | Sorted Ascending Suffix]',
      'Does not require auxiliary memory allocation',
      'Not a stable sort'
    ],
    complexity: {
      time: 'O(N log N) in all cases (worst, average, best)',
      space: 'O(1) auxiliary space (in-place)'
    },
    algorithmicInsight: 'By repeatedly moving the current maximum from index 0 to the tail, the array becomes sorted in-place from right to left without auxiliary memory.',
    defaultHeapType: 'max',
    params: [
      { key: 'arr', label: 'Unsorted Array', type: 'array', defaultValue: [42, 18, 91, 23, 77, 35, 60] }
    ],
    defaultTestCase: {
      arr: [42, 18, 91, 23, 77, 35, 60]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. Top-K Elements Pattern
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'p05_kth_largest',
    sequenceNumber: 5,
    title: 'Kth Largest Element in an Array',
    leetCodeNum: 215,
    difficulty: 'Medium',
    category: 'Top-K Elements Pattern',
    description: 'Find the kth largest element in an unsorted array. By maintaining a Min-Heap of bounded capacity K, the root of the heap always holds the Kth largest element encountered so far.',
    constraints: [
      '1 <= k <= nums.length',
      'Min-heap size is strictly clamped to K',
      'Whenever minHeap.size() > K, pop root'
    ],
    complexity: {
      time: 'O(N log K) time',
      space: 'O(K) auxiliary space for the heap'
    },
    algorithmicInsight: 'A Min-Heap of size K acts as a filter: any element smaller than the current Kth largest is evicted or ignored, leaving only the top K largest in the heap.',
    defaultHeapType: 'min',
    params: [
      { key: 'nums', label: 'Numbers', type: 'array', defaultValue: [3, 2, 1, 5, 6, 4] },
      { key: 'k', label: 'K Value', type: 'number', defaultValue: 2 }
    ],
    defaultTestCase: {
      nums: [3, 2, 1, 5, 6, 4],
      k: 2
    }
  },
  {
    id: 'p06_top_k_frequent',
    sequenceNumber: 6,
    title: 'Top K Frequent Elements',
    leetCodeNum: 347,
    difficulty: 'Medium',
    category: 'Top-K Elements Pattern',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. We build a frequency map, then push (frequency, element) pairs into a Min-Heap of size K.',
    constraints: [
      'k is in the range [1, number of unique elements]',
      'Time complexity must be better than O(N log N)'
    ],
    complexity: {
      time: 'O(N + U log K) where U is unique elements count',
      space: 'O(U + K) auxiliary space'
    },
    algorithmicInsight: 'Using a min-heap keyed by frequency ensures that elements with smaller counts are popped off first when the heap size exceeds K.',
    defaultHeapType: 'min',
    params: [
      { key: 'nums', label: 'Numbers', type: 'array', defaultValue: [1, 1, 1, 2, 2, 3, 4, 4, 4, 4] },
      { key: 'k', label: 'K Value', type: 'number', defaultValue: 2 }
    ],
    defaultTestCase: {
      nums: [1, 1, 1, 2, 2, 3, 4, 4, 4, 4],
      k: 2
    }
  },
  {
    id: 'p07_k_closest_points',
    sequenceNumber: 7,
    title: 'K Closest Points to Origin',
    leetCodeNum: 973,
    difficulty: 'Medium',
    category: 'Top-K Elements Pattern',
    description: 'Find the K points closest to the origin (0, 0) on the 2D plane. We maintain a Max-Heap of size K keyed by squared Euclidean distance d^2 = x^2 + y^2.',
    constraints: [
      'Distance formula: x^2 + y^2 (square root unnecessary for comparison)',
      'Max-heap keeps the farthest of the K closest points at the top'
    ],
    complexity: {
      time: 'O(N log K)',
      space: 'O(K) auxiliary space'
    },
    algorithmicInsight: 'A Max-Heap of capacity K immediately exposes the current farthest candidate at the root; when a closer point arrives, the farthest point is evicted.',
    defaultHeapType: 'max',
    params: [
      { key: 'points', label: 'Points [x, y]', type: 'matrix', defaultValue: [[3, 3], [5, -1], [-2, 4], [1, 2], [2, 1]] },
      { key: 'k', label: 'K Value', type: 'number', defaultValue: 3 }
    ],
    defaultTestCase: {
      points: [[3, 3], [5, -1], [-2, 4], [1, 2], [2, 1]],
      k: 3
    }
  },
  {
    id: 'p08_sort_chars_freq',
    sequenceNumber: 8,
    title: 'Sort Characters By Frequency',
    leetCodeNum: 451,
    difficulty: 'Medium',
    category: 'Top-K Elements Pattern',
    description: 'Sort a string in decreasing order based on the frequency of its characters. A frequency map counts character occurrences, and a Max-Heap orders characters by highest occurrence count.',
    constraints: [
      'Case sensitive (e.g., "A" and "a" are treated as different characters)',
      'Elements with identical frequency can appear in any order'
    ],
    complexity: {
      time: 'O(N + C log C) where C is distinct characters count',
      space: 'O(C) space'
    },
    algorithmicInsight: 'A Max-Heap enables greedy consumption: repeatedly pop the highest-frequency character and append its full repetition count to the result.',
    defaultHeapType: 'max',
    params: [
      { key: 's', label: 'Input String', type: 'string', defaultValue: 'treebanana' }
    ],
    defaultTestCase: {
      s: 'treebanana'
    }
  },
  {
    id: 'p17_kth_smallest_matrix',
    sequenceNumber: 9,
    title: 'Kth Smallest Element in a Sorted Matrix',
    leetCodeNum: 378,
    difficulty: 'Medium',
    category: 'Top-K Elements Pattern',
    description: 'Given an n x n matrix where every row and column is sorted in ascending order, find the kth smallest element. A Min-Heap stores elements alongside their (row, col) coordinates, popping the minimum and pushing the next column neighbor.',
    constraints: [
      '1 <= k <= n^2',
      'Both rows and columns are sorted ascendingly'
    ],
    complexity: {
      time: 'O(K log(min(N, K)))',
      space: 'O(min(N, K)) space for heap'
    },
    algorithmicInsight: 'Treating the matrix as N sorted arrays allows using a Min-Heap of size N, extracting the minimum K times to find the Kth element without flattening.',
    defaultHeapType: 'min',
    params: [
      { key: 'matrix', label: 'Sorted Matrix', type: 'matrix', defaultValue: [[1, 5, 9], [10, 11, 13], [12, 13, 15]] },
      { key: 'k', label: 'K Value', type: 'number', defaultValue: 8 }
    ],
    defaultTestCase: {
      matrix: [[1, 5, 9], [10, 11, 13], [12, 13, 15]],
      k: 8
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. Two-Heap Balancing Pattern
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'p09_median_stream',
    sequenceNumber: 10,
    title: 'Find Median from Data Stream',
    leetCodeNum: 295,
    difficulty: 'Hard',
    category: 'Two-Heap Balancing Pattern',
    description: 'Continuously calculate the running median of numbers arriving in a stream. Uses two heaps: a Max-Heap for the lower half of numbers and a Min-Heap for the upper half.',
    constraints: [
      'maxHeap stores smaller half: maxHeap.top() is max of small numbers',
      'minHeap stores larger half: minHeap.top() is min of large numbers',
      'Balance invariant: maxHeap.size() == minHeap.size() or maxHeap.size() == minHeap.size() + 1'
    ],
    complexity: {
      time: 'O(log N) per addNum(), O(1) per findMedian()',
      space: 'O(N) total space to store stream'
    },
    algorithmicInsight: 'The median is either maxHeap.top() (if odd total size) or the average of (maxHeap.top() + minHeap.top()) / 2.0 (if even).',
    defaultHeapType: 'max',
    params: [
      { key: 'stream', label: 'Stream Numbers', type: 'array', defaultValue: [5, 15, 1, 3, 8, 7, 9, 2] }
    ],
    defaultTestCase: {
      stream: [5, 15, 1, 3, 8, 7, 9, 2]
    }
  },
  {
    id: 'p10_sliding_window_median',
    sequenceNumber: 11,
    title: 'Sliding Window Median',
    leetCodeNum: 480,
    difficulty: 'Hard',
    category: 'Two-Heap Balancing Pattern',
    description: 'Find the median of each sliding window of size K as it moves across an array. Employs dual balanced heaps combined with lazy-removal of elements that have fallen outside the window.',
    constraints: [
      'Window size k <= nums.length',
      'Elements moving out of window marked in delayed hash map'
    ],
    complexity: {
      time: 'O(N log K)',
      space: 'O(K) auxiliary space'
    },
    algorithmicInsight: 'Combining two heaps with a lazy-deletion frequency map maintains logarithmic insertion and rebalancing while avoiding expensive O(K) heap-element searches.',
    defaultHeapType: 'max',
    params: [
      { key: 'nums', label: 'Numbers', type: 'array', defaultValue: [1, 3, -1, -3, 5, 3, 6, 7] },
      { key: 'k', label: 'Window Size (k)', type: 'number', defaultValue: 3 }
    ],
    defaultTestCase: {
      nums: [1, 3, -1, -3, 5, 3, 6, 7],
      k: 3
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. K-Way Merge Pattern
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'p11_merge_k_sorted',
    sequenceNumber: 12,
    title: 'Merge K Sorted Lists / Arrays',
    leetCodeNum: 23,
    difficulty: 'Hard',
    category: 'K-Way Merge Pattern',
    description: 'Merge K sorted linked lists or arrays into one sorted sequence. A Min-Heap holds the current head element of each list. In each step, the smallest head is extracted, and the next element from that list is inserted.',
    constraints: [
      'Heap size is at most K (one pointer per list)',
      'Total elements = N'
    ],
    complexity: {
      time: 'O(N log K) where N is total elements across all K lists',
      space: 'O(K) auxiliary space for the heap'
    },
    algorithmicInsight: 'Instead of comparing all K current elements in O(K) time per step, the Min-Heap determines the absolute minimum in O(log K).',
    defaultHeapType: 'min',
    params: [
      { key: 'lists', label: 'Sorted Lists (JSON)', type: 'matrix', defaultValue: [[1, 4, 7], [2, 5, 8], [0, 6, 9]] }
    ],
    defaultTestCase: {
      lists: [[1, 4, 7], [2, 5, 8], [0, 6, 9]]
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. Heap on Pairs & Intervals Pattern
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'p15_k_pairs_smallest_sums',
    sequenceNumber: 13,
    title: 'Find K Pairs with Smallest Sums',
    leetCodeNum: 373,
    difficulty: 'Medium',
    category: 'Heap on Pairs & Intervals Pattern',
    description: 'Given two sorted integer arrays nums1 and nums2, return the K pairs (u, v) with the smallest sums u + v. A Min-Heap stores pairs (nums1[i] + nums2[j], i, j). Initially push (nums1[i], nums2[0]) for all i, then advance j when popped.',
    constraints: [
      '1 <= k <= nums1.length * nums2.length',
      'nums1 and nums2 are sorted in ascending order'
    ],
    complexity: {
      time: 'O(K log(min(K, N1)))',
      space: 'O(min(K, N1)) space in heap'
    },
    algorithmicInsight: 'By pairing each element of nums1 with nums2[0] initially, we create N1 sorted streams and merge them using the Min-Heap on pairs without generating all N1 * N2 combinations.',
    defaultHeapType: 'min',
    params: [
      { key: 'nums1', label: 'Array 1 (Sorted)', type: 'array', defaultValue: [1, 7, 11] },
      { key: 'nums2', label: 'Array 2 (Sorted)', type: 'array', defaultValue: [2, 4, 6] },
      { key: 'k', label: 'K Pairs', type: 'number', defaultValue: 3 }
    ],
    defaultTestCase: {
      nums1: [1, 7, 11],
      nums2: [2, 4, 6],
      k: 3
    }
  },
  {
    id: 'p16_meeting_rooms_ii',
    sequenceNumber: 14,
    title: 'Meeting Rooms II (Min Conference Rooms)',
    leetCodeNum: 253,
    difficulty: 'Medium',
    category: 'Heap on Pairs & Intervals Pattern',
    description: 'Given an array of meeting time intervals [start, end], find the minimum number of conference rooms required. After sorting intervals by start time, a Min-Heap tracks the end times of active meetings in used rooms.',
    constraints: [
      'Interval format: [start, end] where start < end',
      'If a meeting ends at or before current start, the room can be reused'
    ],
    complexity: {
      time: 'O(N log N) sorting + O(N log N) heap operations',
      space: 'O(N) for heap in worst case (all concurrent meetings)'
    },
    algorithmicInsight: 'The root of the Min-Heap always holds the earliest finishing meeting. If current start >= heap.top(), that room is freed up and reused; otherwise, a new room must be allocated.',
    defaultHeapType: 'min',
    params: [
      { key: 'intervals', label: 'Meeting Intervals [start, end]', type: 'matrix', defaultValue: [[0, 30], [5, 10], [15, 20]] }
    ],
    defaultTestCase: {
      intervals: [[0, 30], [5, 10], [15, 20]]
    }
  },
  {
    id: 'p18_furthest_building',
    sequenceNumber: 15,
    title: 'Furthest Building You Can Reach',
    leetCodeNum: 1642,
    difficulty: 'Medium',
    category: 'Heap on Pairs & Intervals Pattern',
    description: 'You are given building heights, bricks, and ladders. When moving to a taller building, you must use 1 ladder or (h[i+1] - h[i]) bricks. Maintain a Min-Heap of size <= ladders to allocate ladders for the largest jumps.',
    constraints: [
      '1 <= heights.length <= 10^5',
      'Climb = max(0, heights[i+1] - heights[i])'
    ],
    complexity: {
      time: 'O(N log L) where L is number of ladders',
      space: 'O(L) space for min-heap'
    },
    algorithmicInsight: 'Always assume you use ladders for climbs. When the number of climbs exceeds your ladder count, pop the smallest climb from the Min-Heap and pay for it with bricks!',
    defaultHeapType: 'min',
    params: [
      { key: 'heights', label: 'Building Heights', type: 'array', defaultValue: [4, 2, 7, 6, 9, 14, 12] },
      { key: 'bricks', label: 'Bricks Count', type: 'number', defaultValue: 5 },
      { key: 'ladders', label: 'Ladders Count', type: 'number', defaultValue: 1 }
    ],
    defaultTestCase: {
      heights: [4, 2, 7, 6, 9, 14, 12],
      bricks: 5,
      ladders: 1
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. Greedy Priority Queue Pattern
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'p12_reorganize_string',
    sequenceNumber: 16,
    title: 'Reorganize String',
    leetCodeNum: 767,
    difficulty: 'Medium',
    category: 'Greedy Priority Queue Pattern',
    description: 'Rearrange characters in a string so that no two adjacent characters are identical. Greedily pick the highest-frequency available character using a Max-Heap, then place it on a 1-turn cooldown before re-inserting.',
    constraints: [
      'Impossible if any character frequency > ceil(length / 2)',
      'Previous character cannot be picked again on the immediate next step'
    ],
    complexity: {
      time: 'O(N log A) where A is alphabet size (<= 26)',
      space: 'O(A) space'
    },
    algorithmicInsight: 'The character with the highest remaining frequency must be scheduled as early as possible to prevent clustering at the end of the string.',
    defaultHeapType: 'max',
    params: [
      { key: 's', label: 'Input String', type: 'string', defaultValue: 'aab' }
    ],
    defaultTestCase: {
      s: 'aab'
    }
  },
  {
    id: 'p13_task_scheduler',
    sequenceNumber: 17,
    title: 'Task Scheduler',
    leetCodeNum: 621,
    difficulty: 'Medium',
    category: 'Greedy Priority Queue Pattern',
    description: 'Find the minimum time units needed to execute CPU tasks with cooldown period N between identical tasks. A Max-Heap prioritizes tasks with highest remaining count, while a wait queue holds cooled tasks until their ready timestamp.',
    constraints: [
      'Cooldown n >= 0',
      'CPU can execute a task or remain idle'
    ],
    complexity: {
      time: 'O(Total Time Units)',
      space: 'O(Unique Tasks Count)'
    },
    algorithmicInsight: 'Greedily selecting tasks with the highest remaining frequencies minimizes idle slots by filling cooldown intervals productively.',
    defaultHeapType: 'max',
    params: [
      { key: 'tasks', label: 'Tasks Array', type: 'array', defaultValue: ['A', 'A', 'A', 'B', 'B', 'B'] },
      { key: 'n', label: 'Cooldown (n)', type: 'number', defaultValue: 2 }
    ],
    defaultTestCase: {
      tasks: ['A', 'A', 'A', 'B', 'B', 'B'],
      n: 2
    }
  },
  {
    id: 'p14_connect_sticks',
    sequenceNumber: 18,
    title: 'Minimum Cost to Connect Sticks',
    leetCodeNum: 1167,
    difficulty: 'Medium',
    category: 'Greedy Priority Queue Pattern',
    description: 'Connect sticks of varying lengths into one single stick. The cost of connecting two sticks of lengths x and y is (x + y). Uses a Min-Heap (Huffman Coding principle) to repeatedly combine the two shortest sticks.',
    constraints: [
      'Each step merges 2 shortest sticks and pushes combined stick back into min-heap',
      'Min-heap size decreases by 1 on each merge until 1 stick remains'
    ],
    complexity: {
      time: 'O(N log N) for N sticks',
      space: 'O(N) space for heap'
    },
    algorithmicInsight: 'Shorter sticks should be merged earlier so their lengths are included in fewer subsequent merge sums, minimizing total overall cost.',
    defaultHeapType: 'min',
    params: [
      { key: 'sticks', label: 'Stick Lengths', type: 'array', defaultValue: [2, 4, 3, 1, 5] }
    ],
    defaultTestCase: {
      sticks: [2, 4, 3, 1, 5]
    }
  }
];
