import { AlgorithmType } from './types';

export interface ProblemQuestion {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  inputCase: string;
  expectedOutput: string;
}

export const ALGORITHM_QUESTIONS: Record<AlgorithmType, ProblemQuestion> = {
  'preorder-rec': {
    title: 'LeetCode 144: Binary Tree Preorder Traversal',
    difficulty: 'Easy',
    description: "Given the root of a binary tree, return the preorder traversal of its nodes' values (Root -> Left -> Right).",
    inputCase: 'Root=[1], Left=[2], Right=[3]',
    expectedOutput: '[1, 2, 3]'
  },
  'inorder-rec': {
    title: 'LeetCode 94: Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values (Left -> Root -> Right).",
    inputCase: 'Root=[1], Left=[2], Right=[3]',
    expectedOutput: '[2, 1, 3]'
  },
  'postorder-rec': {
    title: 'LeetCode 145: Binary Tree Postorder Traversal',
    difficulty: 'Easy',
    description: "Given the root of a binary tree, return the postorder traversal of its nodes' values (Left -> Right -> Root).",
    inputCase: 'Root=[1], Left=[2], Right=[3]',
    expectedOutput: '[2, 3, 1]'
  },
  'preorder-iter': {
    title: 'LeetCode 144 (Iterative): Preorder Traversal',
    difficulty: 'Easy',
    description: 'Traverse the binary tree in preorder iteratively without using recursion, using an explicit stack structure.',
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '[1, 2, 4, 5, 3, 6, 7]'
  },
  'inorder-iter': {
    title: 'LeetCode 94 (Iterative): Inorder Traversal',
    difficulty: 'Easy',
    description: 'Traverse the binary tree in inorder iteratively without using recursion, using an explicit stack structure.',
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '[4, 2, 5, 1, 6, 3, 7]'
  },
  'postorder-iter': {
    title: 'LeetCode 145 (Iterative): Postorder Traversal',
    difficulty: 'Easy',
    description: 'Traverse the binary tree in postorder iteratively using stack structures (e.g. using two stacks or single stack).',
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '[4, 5, 2, 6, 7, 3, 1]'
  },
  'level-order': {
    title: 'LeetCode 102: Level Order Traversal',
    difficulty: 'Medium',
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '[1, 2, 3, 4, 5, 6, 7]'
  },
  'height': {
    title: 'LeetCode 104: Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    description: 'Find the length of the longest path from the root node down to the farthest leaf node.',
    inputCase: 'Perfect Binary Tree (depth=2)',
    expectedOutput: '3'
  },
  'diameter': {
    title: 'LeetCode 543: Diameter of Binary Tree',
    difficulty: 'Easy',
    description: 'Return the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.',
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '4 (edges) or 5 (nodes)'
  },
  'lca': {
    title: 'LeetCode 236: Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    description: 'Find the lowest common ancestor node of two given nodes p and q. The LCA is defined as the lowest node in T that has both p and q as descendants.',
    inputCase: 'Perfect Tree with targets P=4, Q=7',
    expectedOutput: '1'
  },
  'left-view': {
    title: 'Left View of Binary Tree',
    difficulty: 'Medium',
    description: 'Return the nodes visible when the binary tree is viewed from the left side (first node of each level).',
    inputCase: 'Left-Skewed Tree',
    expectedOutput: '[1, 2, 3]'
  },
  'right-view': {
    title: 'LeetCode 199: Binary Tree Right Side View',
    difficulty: 'Medium',
    description: 'Return the nodes visible when the binary tree is viewed from the right side (last node of each level).',
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '[1, 3, 7]'
  },
  'top-view': {
    title: 'Top View of Binary Tree',
    difficulty: 'Medium',
    description: 'Return the nodes that are visible when the binary tree is viewed from the top, ordered from left to right.',
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '[4, 2, 1, 3, 7]'
  },
  'bottom-view': {
    title: 'Bottom View of Binary Tree',
    difficulty: 'Medium',
    description: 'Return the nodes that are visible when the binary tree is viewed from the bottom, ordered from left to right.',
    inputCase: 'Perfect Binary Tree',
    expectedOutput: '[4, 5, 6, 7]'
  },
  'path-sum': {
    title: 'LeetCode 112: Path Sum',
    difficulty: 'Easy',
    description: 'Determine if the tree has a root-to-leaf path such that adding up all the values along the path equals the targetSum.',
    inputCase: 'Perfect Tree, Target=15 (Path 1 -> 3 -> 7)',
    expectedOutput: 'true'
  },
  'symmetric': {
    title: 'LeetCode 101: Symmetric Tree',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).',
    inputCase: 'Symmetric Tree Preset',
    expectedOutput: 'true'
  },
  'serialize-deserialize': {
    title: 'LeetCode 297: Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    description: 'Design an algorithm to serialize a binary tree into a string representation, and deserialize that string back to the original tree structure.',
    inputCase: 'Perfect Tree',
    expectedOutput: '"1,2,4,#,#,5,#,#,3,6,#,#,7,#,#"'
  },
  'boundary-traversal': {
    title: 'LeetCode 545: Boundary of Binary Tree',
    difficulty: 'Medium',
    description: 'Return the values of the boundary of a binary tree in anti-clockwise order starting from the root: Left Boundary, Leaves, and Right Boundary reversed.',
    inputCase: 'Perfect Tree',
    expectedOutput: '[1, 2, 4, 5, 6, 7, 3]'
  },
  'morris-inorder': {
    title: 'Morris Inorder Traversal (O(1) Space)',
    difficulty: 'Medium',
    description: 'Perform inorder traversal iteratively in O(N) time and O(1) extra memory space by dynamically constructing back-links (threads).',
    inputCase: 'Perfect Tree',
    expectedOutput: '[4, 2, 5, 1, 6, 3, 7]'
  },
  'burning-tree': {
    title: 'Burning Tree / Distance K from Target Node',
    difficulty: 'Hard',
    description: 'Calculate the minimum time required to burn the entire binary tree if fire starts at a target node and spreads 1 unit per second to adjacent nodes.',
    inputCase: 'Fire starts at Node 4 in Perfect Tree',
    expectedOutput: '4 seconds'
  }
};
