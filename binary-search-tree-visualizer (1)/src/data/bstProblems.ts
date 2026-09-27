import { AlgorithmId } from '../types';

export interface BSTProblem {
  id: AlgorithmId;
  sequenceNumber: number;
  title: string;
  leetcodeTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  testCase: {
    inputDisplay: string;
    expectedOutput: string;
    explanation: string;
    defaultTreeValues?: number[];
    defaultParams: Record<string, any>;
  };
  keyInsight: string;
}

export const BST_PROBLEMS_SEQUENCE: BSTProblem[] = [
  {
    id: 'search',
    sequenceNumber: 1,
    title: 'Search in a Binary Search Tree',
    leetcodeTag: 'LeetCode #700',
    difficulty: 'Easy',
    description:
      'Given the root of a binary search tree and an integer val, find the node in the BST whose value equals val. If found, return the subtree; otherwise return null.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], val = 37',
      expectedOutput: 'Node [37] (Subtree root found in 2 comparisons)',
      explanation:
        'Compare 37 with root 50 (37 < 50 → go left to 25). Compare 37 with 25 (37 > 25 → go right to 37). Target found!',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { value: 37 },
    },
    keyInsight: 'O(h) time complexity: at each step we discard half of the remaining subtrees.',
  },
  {
    id: 'kth_element',
    sequenceNumber: 2,
    title: 'K-th Smallest / Largest Element in BST',
    leetcodeTag: 'LeetCode #230',
    difficulty: 'Medium',
    description:
      'Given the root of a BST and an integer k, return the kth smallest (or largest) value of all node values using in-order traversal properties.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], k = 3, mode = "smallest"',
      expectedOutput: '37 (3rd smallest element)',
      explanation:
        'In-order traversal yields sorted order: [12 (1st), 25 (2nd), 37 (3rd), 50, 62, 75, 87]. When counter reaches k=3, return node 37.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { k: 3, kthMode: 'smallest' },
    },
    keyInsight: 'In-order traversal of a BST always visits nodes in strictly increasing sorted order.',
  },
  {
    id: 'insert',
    sequenceNumber: 3,
    title: 'Insert into a Binary Search Tree',
    leetcodeTag: 'LeetCode #701',
    difficulty: 'Medium',
    description:
      'Given the root of a BST and a value to insert, place the new value in the tree such that BST ordering remains valid. New nodes always attach at an empty leaf position.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], val = 45',
      expectedOutput: 'Attached as right child of node [37]',
      explanation:
        '45 < 50 (left to 25) → 45 > 25 (right to 37) → 45 > 37 (right is null) → Create node(45) and link.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { value: 45 },
    },
    keyInsight: 'Insertion never requires rotating or rebalancing standard BST nodes; it is always a leaf attachment.',
  },
  {
    id: 'delete',
    sequenceNumber: 4,
    title: 'Delete Node in a BST (3 Cases)',
    leetcodeTag: 'LeetCode #450',
    difficulty: 'Medium',
    description:
      'Given the root and a key, delete the key from the BST. Demonstrates Case 1 (Leaf removal), Case 2 (Single child bypass), and Case 3 (Two children: replace with Inorder Successor).',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], key = 25 (Two-child case)',
      expectedOutput: 'Node [25] replaced by Inorder Successor [37]',
      explanation:
        'Node 25 has two children (12 and 37). Find its inorder successor (min node in right subtree = 37), copy value, and delete original leaf 37.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { value: 25 },
    },
    keyInsight: 'Case 3 reduces two-child deletion into single-child or leaf deletion of the inorder successor.',
  },
  {
    id: 'validate',
    sequenceNumber: 5,
    title: 'Validate Binary Search Tree',
    leetcodeTag: 'LeetCode #98',
    difficulty: 'Medium',
    description:
      'Determine if a binary tree is a valid BST. Every node must satisfy the strict invariant: all left subtree keys < current node key < all right subtree keys.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87]',
      expectedOutput: 'true (All subtrees respect propagating interval constraints)',
      explanation:
        'Recursively checks that each node value falls within (minVal, maxVal). Left child bounds become (minVal, parent.val); right child bounds become (parent.val, maxVal).',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: {},
    },
    keyInsight: 'Checking only immediate children is insufficient; ancestral interval boundaries must be maintained.',
  },
  {
    id: 'find_min_max',
    sequenceNumber: 6,
    title: 'Find Minimum & Maximum Elements',
    leetcodeTag: 'GFG / Standard',
    difficulty: 'Easy',
    description:
      'Find the minimum and maximum keys in a BST by following the leftmost and rightmost links in O(h) time.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87]',
      expectedOutput: 'Min = 12 (leftmost path), Max = 87 (rightmost path)',
      explanation:
        'From root 50, keep traversing left (50 → 25 → 12) for Minimum. Keep traversing right (50 → 75 → 87) for Maximum.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: {},
    },
    keyInsight: 'Smallest key is always the leftmost node; largest key is always the rightmost node.',
  },
  {
    id: 'lca',
    sequenceNumber: 7,
    title: 'Lowest Common Ancestor (LCA) in BST',
    leetcodeTag: 'LeetCode #235',
    difficulty: 'Medium',
    description:
      'Find the lowest common ancestor node of two target nodes p and q. In a BST, the LCA is the first node where p and q diverge into different branches.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], p = 12, q = 37',
      expectedOutput: 'LCA = Node [25]',
      explanation:
        'At root 50, both 12 and 37 are smaller (go left to 25). At node 25, 12 < 25 while 37 > 25. The paths split, making 25 their LCA.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { pVal: 12, qVal: 37 },
    },
    keyInsight: 'If both values lie on one side, LCA is in that subtree. The divergence point is the LCA in O(h) time.',
  },
  {
    id: 'successor_predecessor',
    sequenceNumber: 8,
    title: 'Inorder Successor & Predecessor',
    leetcodeTag: 'LeetCode #285',
    difficulty: 'Medium',
    description:
      'Find the immediate in-order predecessor (largest element smaller than key) and in-order successor (smallest element greater than key) of a node.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], key = 25',
      expectedOutput: 'Predecessor = 12, Successor = 37',
      explanation:
        'Predecessor is max of left subtree (12). Successor is min of right subtree (37). If subtrees are absent, ancestors track the candidate.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { value: 25 },
    },
    keyInsight: 'O(h) time with O(1) extra space without needing full in-order traversal.',
  },
  {
    id: 'range_sum',
    sequenceNumber: 9,
    title: 'Range Sum of BST',
    leetcodeTag: 'LeetCode #938',
    difficulty: 'Easy',
    description:
      'Given the root node and inclusive bounds [low, high], return the sum of all values in this range while pruning subtrees that fall completely outside.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], low = 25, high = 65',
      expectedOutput: 'Sum = 174 (Includes: 25 + 37 + 50 + 62)',
      explanation:
        'Node 50 is in range (+50). Since 50 > 25, explore left. Node 25 is in range (+25), but since 25 is not > 25, skip left child 12. Total sum is 174.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { low: 25, high: 65 },
    },
    keyInsight: 'If current node is < low, right subtree might still have valid values, but left subtree is guaranteed out of range.',
  },
  {
    id: 'prune',
    sequenceNumber: 10,
    title: 'Trim / Prune a Binary Search Tree',
    leetcodeTag: 'LeetCode #669',
    difficulty: 'Medium',
    description:
      'Trim the BST so that all node values lie strictly inside [low, high]. Trimming preserves parent-child relationships for surviving nodes.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], low = 25, high = 75',
      expectedOutput: 'Trimmed Tree: [50, 25, 75, 37, 62] (pruned 12 and 87)',
      explanation:
        'Node 12 is < 25, so its subtree is cut. Node 87 is > 75, so its subtree is cut. The remaining tree stays a valid BST.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { low: 25, high: 75 },
    },
    keyInsight: 'When a node is < low, return trimmed right child directly; when > high, return trimmed left child.',
  },
  {
    id: 'two_sum',
    sequenceNumber: 11,
    title: 'Two Sum in BST (Find Target Pair)',
    leetcodeTag: 'LeetCode #653',
    difficulty: 'Easy',
    description:
      'Given the root of a BST and an integer k, return true if there exist two elements in the BST such that their sum equals k.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], k = 74',
      expectedOutput: 'true (Pair found: [12, 62] → 12 + 62 = 74)',
      explanation:
        'In-order traversal produces sorted array [12, 25, 37, 50, 62, 75, 87]. Two pointers start at 12 and 87 (sum 99 > 74 → decrement right). When left points to 12 and right to 62, sum = 74!',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { target: 74, value: 74 },
    },
    keyInsight: 'BST in-order traversal is sorted; combining it with two-pointers resolves the search in linear O(n) time.',
  },
  {
    id: 'greater_sum_tree',
    sequenceNumber: 12,
    title: 'Convert BST to Greater Tree',
    leetcodeTag: 'LeetCode #538 / #1038',
    difficulty: 'Medium',
    description:
      'Convert a BST into a Greater Tree such that every key is changed to the original key plus the sum of all keys greater than it.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87]',
      expectedOutput: 'Converted nodes: 87→87, 75→162, 62→224, 50→274, 37→311, 25→336, 12→348',
      explanation:
        'Traverse in reverse in-order (Right → Root → Left). Accumulate running sum: 87 is largest, then 75 becomes 87+75=162, etc.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: {},
    },
    keyInsight: 'Reverse In-Order traversal visits nodes in strictly descending order, perfectly suited for running prefix sums.',
  },
  {
    id: 'recover_bst',
    sequenceNumber: 13,
    title: 'Recover BST (Two Swapped Nodes)',
    leetcodeTag: 'LeetCode #99',
    difficulty: 'Medium',
    description:
      'Two nodes of a BST are swapped by mistake. Recover the tree without changing its structure by identifying inversion violations.',
    testCase: {
      inputDisplay: 'BST with swapped nodes [25] and [62]',
      expectedOutput: 'Recovered BST: swap(first->val, second->val) restores valid ordering',
      explanation:
        'During in-order traversal, track prev pointer. If prev->val > curr->val, first violation sets first = prev, second = curr. A second violation updates second = curr. Swap their values back.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: {},
    },
    keyInsight: 'In an in-order sequence with two swapped values, either one adjacent inversion or two separate inversions occur.',
  },
  {
    id: 'closest_value',
    sequenceNumber: 14,
    title: 'Closest Binary Search Tree Value',
    leetcodeTag: 'LeetCode #270',
    difficulty: 'Easy',
    description:
      'Given the root of a BST and a target value, find the value in the BST that is closest to the target.',
    testCase: {
      inputDisplay: 'root = [50, 25, 75, 12, 37, 62, 87], target = 34',
      expectedOutput: 'Closest Value = 37 (difference = |37 - 34| = 3)',
      explanation:
        'Navigate from root [50] (diff 16). 34 < 50 → move left to [25] (diff 9). 34 > 25 → move right to [37] (diff 3). 37 is the closest.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { target: 34, value: 34 },
    },
    keyInsight: 'Follow the binary search branch path: closer candidates can only lie along the standard search route.',
  },
  {
    id: 'sorted_array_to_bst',
    sequenceNumber: 15,
    title: 'Convert Sorted Array to Balanced BST',
    leetcodeTag: 'LeetCode #108',
    difficulty: 'Easy',
    description:
      'Given an ascending sorted array, convert it to a height-balanced BST using divide and conquer.',
    testCase: {
      inputDisplay: 'nums = [12, 25, 37, 50, 62, 75, 87]',
      expectedOutput: 'Balanced BST with root [50], height = 3',
      explanation:
        'Choose middle element (50) as root. Left subarray [12, 25, 37] recursively forms left subtree (mid = 25). Right subarray forms right subtree (mid = 75).',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { sortedArray: [12, 25, 37, 50, 62, 75, 87] },
    },
    keyInsight: 'Always selecting mid = left + (right - left) / 2 ensures subtrees differ in height by at most 1.',
  },
  {
    id: 'bst_from_preorder',
    sequenceNumber: 16,
    title: 'Construct BST from Preorder Traversal',
    leetcodeTag: 'LeetCode #1008',
    difficulty: 'Medium',
    description:
      'Given an array of integers representing the preorder traversal of a BST, reconstruct the tree in O(n) time using an upper bound.',
    testCase: {
      inputDisplay: 'preorder = [50, 25, 12, 37, 75, 62, 87]',
      expectedOutput: 'Reconstructed BST matching original preorder stream',
      explanation:
        'Root is 50. Elements < 50 ([25, 12, 37]) belong to left subtree. Elements > 50 belong to right subtree.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: { preorderArray: [50, 25, 12, 37, 75, 62, 87] },
    },
    keyInsight: 'Passing an upper bound allows constructing the tree in linear O(n) time without searching.',
  },
  {
    id: 'binary_tree_to_bst',
    sequenceNumber: 17,
    title: 'Convert Binary Tree to BST',
    leetcodeTag: 'Classic Interview',
    difficulty: 'Medium',
    description:
      'Convert an arbitrary binary tree to a Binary Search Tree while preserving the original tree structure (shape).',
    testCase: {
      inputDisplay: 'Arbitrary Tree with keys [10, 30, 15, 20, 5]',
      expectedOutput: 'BST with sorted keys [5, 10, 15, 20, 30] in original node slots',
      explanation:
        '1) Extract node values via in-order. 2) Sort array. 3) Re-populate node values in-order.',
      defaultTreeValues: [50, 25, 75, 12, 37, 62, 87],
      defaultParams: {},
    },
    keyInsight: 'Preserves the exact structural topology of the tree while restoring the BST invariant.',
  },
];

export const BST_PROBLEMS_MAP: Record<AlgorithmId, BSTProblem> = BST_PROBLEMS_SEQUENCE.reduce(
  (acc, problem) => {
    acc[problem.id] = problem;
    return acc;
  },
  {} as Record<AlgorithmId, BSTProblem>
);
