import { QueueProblem } from '../types';

export const QUEUE_PROBLEMS: QueueProblem[] = [
  {
    id: '01',
    sequenceNum: 1,
    leetcodeTag: 'Concept',
    difficulty: 'Easy',
    title: 'Standard Linear Queue',
    description: 'A basic first-in-first-out (FIFO) linear data structure. Elements are inserted at the Rear and removed from the Front. It can experience "false overflow" when empty space accumulates at the front after dequeues.',
    keyInsight: 'Enqueue pushes to the back, dequeue removes from the front. If the rear pointer reaches the end, no more elements can be added, even if the front is empty.',
    defaultInput: {
      operations: 'Enqueue(10), Enqueue(20), Enqueue(30), Dequeue(), Enqueue(40), Dequeue(), Peek()',
      capacity: 5
    },
    cppSnippetId: 'cpp_01',
    category: 'Standard & Circular Queues'
  },
  {
    id: '02',
    sequenceNum: 2,
    leetcodeTag: 'LC #622',
    difficulty: 'Medium',
    title: 'Design Circular Queue',
    description: 'A circular buffer solves the "false overflow" problem of linear queues by connecting the end of the array back to the beginning using modulo arithmetic.',
    keyInsight: 'Advance pointers using `(index + 1) % capacity`. It is full when `(rear + 1) % capacity == front` or when `count == capacity`.',
    defaultInput: {
      operations: 'enq(1), enq(2), enq(3), enq(4), deq(), enq(5), deq(), Front(), Rear()',
      capacity: 5
    },
    cppSnippetId: 'cpp_02',
    category: 'Standard & Circular Queues'
  },
  {
    id: '03',
    sequenceNum: 3,
    leetcodeTag: 'LC #641',
    difficulty: 'Medium',
    title: 'Design Circular Deque',
    description: 'A double-ended queue (deque) allows insertions and deletions at both the front and rear ends of a circular array buffer.',
    keyInsight: 'Insert front decrements pointer: `(front - 1 + capacity) % capacity`. Insert rear increments pointer: `(rear + 1) % capacity`. Deque supports symmetric FIFO/LIFO.',
    defaultInput: {
      operations: 'insertLast(1), insertLast(2), insertFront(3), deleteLast(), getFront(), getRear()',
      capacity: 5
    },
    cppSnippetId: 'cpp_03',
    category: 'Circular Deques'
  },
  {
    id: '04',
    sequenceNum: 4,
    leetcodeTag: 'LC #232',
    difficulty: 'Easy',
    title: 'Implement Queue using Stacks',
    description: 'Simulates a First-In-First-Out (FIFO) queue using two Last-In-First-Out (LIFO) stacks. Elements are pushed to `inStack`. On peek/pop, if `outStack` is empty, all elements are moved from `inStack` to `outStack`.',
    keyInsight: 'Amortized O(1) operations. Moving items from one stack to another reverses their order, perfectly converting LIFO behavior into FIFO!',
    defaultInput: {
      operations: 'Push(1), Push(2), Push(3), Pop(), Push(4), Pop(), Peek()'
    },
    cppSnippetId: 'cpp_04',
    category: 'Stack & Queue Interconversions'
  },
  {
    id: '05',
    sequenceNum: 5,
    leetcodeTag: 'LC #225',
    difficulty: 'Easy',
    title: 'Implement Stack using Queues',
    description: 'Simulates a Last-In-First-Out (LIFO) stack using queues. Can be done with two queues or a single queue by rotating the elements when pushing so the newest element always ends up at the front.',
    keyInsight: 'To push to a single queue, enqueue the element, then dequeue and re-enqueue all previous elements (size - 1 times). Front is now the top of stack.',
    defaultInput: {
      operations: 'Push(10), Push(20), Push(30), Pop(), Push(40), Pop(), Top()'
    },
    cppSnippetId: 'cpp_05',
    category: 'Stack & Queue Interconversions'
  },
  {
    id: '06',
    sequenceNum: 6,
    leetcodeTag: 'LC #239',
    difficulty: 'Hard',
    title: 'Sliding Window Maximum',
    description: 'Finds the maximum value in each sliding window of size k in an array. Utilizes a monotonic decreasing deque to maintain candidate indices.',
    keyInsight: 'The deque stores indices. Elements in the deque are in strictly decreasing order. If the current element is greater than elements at the deque tail, we pop them because they can never be the maximum.',
    defaultInput: {
      array: '1,3,-1,-3,5,3,6,7',
      k: 3
    },
    cppSnippetId: 'cpp_06',
    category: 'Sliding Window & Monotonic Deques'
  },
  {
    id: '07',
    sequenceNum: 7,
    leetcodeTag: 'LC #1438',
    difficulty: 'Medium',
    title: 'Longest Subarray with Abs Diff <= Limit',
    description: 'Finds the length of the longest non-empty subarray such that the absolute difference between any two elements is less than or equal to the limit.',
    keyInsight: 'Use two monotonic deques (one min-deque, one max-deque) to keep track of the minimum and maximum elements in the sliding window. Expand right, shrink left when max - min > limit.',
    defaultInput: {
      array: '8,2,4,7',
      limit: 4
    },
    cppSnippetId: 'cpp_07',
    category: 'Sliding Window & Monotonic Deques'
  },
  {
    id: '08',
    sequenceNum: 8,
    leetcodeTag: 'LC #862',
    difficulty: 'Hard',
    title: 'Shortest Subarray with Sum >= K',
    description: 'Finds the length of the shortest non-empty subarray of an array with a sum of at least K. The array can contain negative values.',
    keyInsight: 'Use prefix sums and a monotonic increasing deque of indices. Maintain increasing prefix sums in the deque. If prefix_sum[i] - prefix_sum[deque.front()] >= K, record length and pop front.',
    defaultInput: {
      array: '2,-1,2',
      k: 3
    },
    cppSnippetId: 'cpp_08',
    category: 'Sliding Window & Monotonic Deques'
  },
  {
    id: '09',
    sequenceNum: 9,
    leetcodeTag: 'Concept',
    difficulty: 'Medium',
    title: 'First Non-Repeating Character in a Stream',
    description: 'Processes a continuous stream of characters and dynamically identifies the first character that has appeared exactly once so far.',
    keyInsight: 'Use a frequency array/hashmap and a queue. For each char, increment its count and enqueue it. To find the answer, pop from the queue until the front element has a frequency of 1.',
    defaultInput: {
      stream: 'a,a,b,c,b,d,a,f'
    },
    cppSnippetId: 'cpp_09',
    category: 'Streams & Cache Buffers'
  },
  {
    id: '10',
    sequenceNum: 10,
    leetcodeTag: 'LC #346',
    difficulty: 'Easy',
    title: 'Moving Average from Data Stream',
    description: 'Calculates the moving average of all integers in a sliding window of a fixed size.',
    keyInsight: 'Maintain a queue of size up to size. Keep track of the current window sum. When queue exceeds size, dequeue the oldest element, subtract it from the sum, enqueue the new element and add it.',
    defaultInput: {
      array: '1,10,3,5',
      size: 3
    },
    cppSnippetId: 'cpp_10',
    category: 'Streams & Cache Buffers'
  },
  {
    id: '11',
    sequenceNum: 11,
    leetcodeTag: 'LC #950',
    difficulty: 'Medium',
    title: 'Reveal Cards In Increasing Order',
    description: 'Returns an ordering of the deck of cards that reveals them in increasing order, where you take the top card, reveal it, and move the next top card to the bottom.',
    keyInsight: 'Simulate the reverse process! Sort the deck. Initialize a queue of indices [0...N-1]. For each card in sorted deck, place it at the index at the front of the queue, then rotate the queue by moving front to rear.',
    defaultInput: {
      array: '17,13,11,2,3,5,7'
    },
    cppSnippetId: 'cpp_11',
    category: 'Streams & Cache Buffers'
  },
  {
    id: '12',
    sequenceNum: 12,
    leetcodeTag: 'LC #994',
    difficulty: 'Medium',
    title: 'Rotting Oranges',
    description: 'Determine the minimum number of minutes that must elapse until no cell has a fresh orange. Rotting spreads from rotten oranges to adjacent fresh ones in 1-minute steps.',
    keyInsight: 'Multi-source BFS. Put all initially rotten oranges in the queue. Pop each orange, spread rot to adjacent fresh oranges, incrementing time, and enqueue the newly rotten ones.',
    defaultInput: {
      grid: '2,1,1;1,1,0;0,1,1'
    },
    cppSnippetId: 'cpp_12',
    category: 'Advanced Queue BFS & Scheduling'
  },
  {
    id: '13',
    sequenceNum: 13,
    leetcodeTag: 'LC #134',
    difficulty: 'Medium',
    title: 'Gas Station / Circular Tour',
    description: 'Find the starting gas station index that allows completing a circular tour around a route of gas stations, where gas[i] is available and cost[i] is needed to reach station i+1.',
    keyInsight: 'If total gas is less than total cost, a solution is impossible. Otherwise, if you cannot reach station B from A, then any station between A and B cannot be a valid starting station.',
    defaultInput: {
      gas: '1,2,3,4,5',
      cost: '3,4,5,1,2'
    },
    cppSnippetId: 'cpp_13',
    category: 'Advanced Queue BFS & Scheduling'
  },
  {
    id: '14',
    sequenceNum: 14,
    leetcodeTag: 'LC #621',
    difficulty: 'Medium',
    title: 'Task Scheduler',
    description: 'Given a characters array of tasks and a cooling interval n, find the least number of units of time that the CPU will take to finish all the given tasks.',
    keyInsight: 'Count task frequencies. Use a max-priority queue (or sorting) to execute the highest-frequency available task first. Keep track of cooldowns in a temporary queue of executed tasks.',
    defaultInput: {
      tasks: 'A,A,A,B,B,B',
      n: 2
    },
    cppSnippetId: 'cpp_14',
    category: 'Advanced Queue BFS & Scheduling'
  },
  {
    id: '15',
    sequenceNum: 15,
    leetcodeTag: 'LC #146',
    difficulty: 'Hard',
    title: 'LRU Cache (Least Recently Used)',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. When cache is full, evict the least recently used key-value pair.',
    keyInsight: 'Uses a Doubly Linked List (represented as a Deque) and a Hash Map. Accessed items are moved to the front (Most Recently Used). Evictions occur from the rear (Least Recently Used).',
    defaultInput: {
      operations: 'Put(1,10), Put(2,20), Get(1), Put(3,30), Get(2), Put(4,40), Get(1), Get(3), Get(4)',
      capacity: 2
    },
    cppSnippetId: 'cpp_15',
    category: 'Streams & Cache Buffers'
  },
  {
    id: '16',
    sequenceNum: 16,
    leetcodeTag: 'LC #102',
    difficulty: 'Medium',
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    keyInsight: 'Standard BFS using a queue. Queue stores pointers to active node levels. For each level, we count the level size, process that many elements from the queue, and enqueue their children.',
    defaultInput: {
      tree: '3, 9, 20, null, null, 15, 7'
    },
    cppSnippetId: 'cpp_16',
    category: 'Advanced Queue BFS & Scheduling'
  },
  {
    id: '17',
    sequenceNum: 17,
    leetcodeTag: 'LC #933',
    difficulty: 'Easy',
    title: 'Number of Recent Calls',
    description: 'Counts the number of recent requests within a sliding time window of 3000 milliseconds. Pings occur at increasing timestamps.',
    keyInsight: 'Enqueue each ping timestamp t. Then, dequeue all timestamps older than t - 3000 from the front. The size of the queue represents the exact number of requests in the active window.',
    defaultInput: {
      pings: '1, 100, 3001, 3002, 6000'
    },
    cppSnippetId: 'cpp_17',
    category: 'Streams & Cache Buffers'
  },
  {
    id: '18',
    sequenceNum: 18,
    leetcodeTag: 'LC #1188',
    difficulty: 'Medium',
    title: 'Design Bounded Blocking Queue',
    description: 'Design a thread-safe bounded blocking queue. Enqueue blocks if the queue is full, and dequeue blocks if the queue is empty.',
    keyInsight: 'Multi-threaded coordination. Uses a bounded array/circular queue guarded by a mutex and two condition variables (notEmpty, notFull) to signal waiting threads.',
    defaultInput: {
      operations: 'enq(5), enq(10), deq(), enq(15), enq(20), enq(25), deq()',
      capacity: 3
    },
    cppSnippetId: 'cpp_18',
    category: 'Standard & Circular Queues'
  },
  {
    id: '19',
    sequenceNum: 19,
    leetcodeTag: 'LC #406',
    difficulty: 'Medium',
    title: 'Queue Reconstruction by Height',
    description: 'Reconstruct a queue of people represented by pairs (h, k) where h is the height of the person and k is the number of other people who are taller or equal and in front.',
    keyInsight: 'Greedy ordering. Sort people by height descending (and count ascending). Then, insert each person into a list-based queue at the exact index k. Taller people are placed first so shorter ones don\'t disrupt their counts.',
    defaultInput: {
      people: '[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]'
    },
    cppSnippetId: 'cpp_19',
    category: 'Advanced Queue BFS & Scheduling'
  },
  {
    id: '20',
    sequenceNum: 20,
    leetcodeTag: 'Concept',
    difficulty: 'Hard',
    title: '0-1 BFS Shortest Path',
    description: 'Finds the shortest path in a graph/grid where edge weights are only 0 or 1. Achieves O(V + E) complexity using a Deque instead of a priority queue.',
    keyInsight: 'If an edge has a weight of 0, we push the neighbor node to the Front of the Deque (higher priority). If the weight is 1, we push it to the Rear (standard priority). This keeps the deque strictly sorted!',
    defaultInput: {
      edges: 'A-B(0), A-C(1), B-D(1), C-D(0), D-E(1)',
      start: 'A',
      end: 'E'
    },
    cppSnippetId: 'cpp_20',
    category: 'Circular Deques'
  }
];
