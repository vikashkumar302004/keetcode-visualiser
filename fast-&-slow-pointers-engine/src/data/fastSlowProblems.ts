/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  {
    id: 'lc876',
    orderIndex: 1,
    title: 'Middle of the Linked List',
    leetcodeNum: 'LC #876',
    difficulty: 'Easy',
    category: 'Middle Node',
    description: 'Find the middle node of a singly linked list using the Tortoise and Hare approach.',
    detailedDescription: 'Move the fast pointer at twice the speed of the slow pointer. When the fast pointer reaches the end of the list, the slow pointer will be precisely at the middle node (or the second middle if the length is even).',
    invariant: 'At step S, slow is at node S, and fast is at node 2S. Since fast travels 2x faster, slow lands on the middle when fast reaches the boundary (nullptr). Space: O(1), Time: O(N).',
    expectedExplanation: 'The slow pointer reaches the exact center node at the moment fast hits NULL.',
    defaultValues: [1, 2, 3, 4, 5, 6],
    defaultPos: -1,
    cppSnippetId: 'lc876_cpp'
  },
  {
    id: 'lc2095',
    orderIndex: 2,
    title: 'Delete the Middle Node',
    leetcodeNum: 'LC #2095',
    difficulty: 'Medium',
    category: 'Middle Node',
    description: 'Delete the middle node of a linked list and return the head.',
    detailedDescription: 'By tracking a "prev" pointer immediately behind the slow pointer, we can sever the middle node by pointing prev->next directly to slow->next. This shows a three-pointer configuration in action.',
    invariant: 'The "prev" pointer tracks slow-1. When fast reaches nullptr, slow is at the middle. We set prev->next = slow->next, deleting the middle node from the list topology.',
    expectedExplanation: 'The node at the middle is unlinked, demonstrating how standard pointers perform deletion.',
    defaultValues: [1, 3, 4, 7, 1, 2, 6],
    defaultPos: -1,
    cppSnippetId: 'lc2095_cpp'
  },
  {
    id: 'lc234',
    orderIndex: 3,
    title: 'Palindrome Linked List',
    leetcodeNum: 'LC #234',
    difficulty: 'Easy',
    category: 'Middle Node',
    description: 'Check if a singly linked list is a palindrome in O(N) time and O(1) auxiliary space.',
    detailedDescription: 'Find the middle of the list. Reverse the second half of the list in-place. Then, compare the first half and the reversed second half element by element. Re-reverse back if needed to restore the list.',
    invariant: 'After finding the middle node, the second half of the list is reversed. Pointers start at head and reversed_head, moving inward step-by-step and comparing values.',
    expectedExplanation: 'Values are compared inward. If any mismatch occurs, it is not a palindrome.',
    defaultValues: [1, 2, 3, 3, 2, 1],
    defaultPos: -1,
    cppSnippetId: 'lc234_cpp'
  },
  {
    id: 'lc143',
    orderIndex: 4,
    title: 'Reorder List',
    leetcodeNum: 'LC #143',
    difficulty: 'Medium',
    category: 'Middle Node',
    description: 'Reorder the list to weave nodes alternately from start and end.',
    detailedDescription: 'Weave list nodes in the pattern: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ... This is achieved by: 1. Finding the middle node, 2. Reversing the second half, 3. Merging the two halves alternately.',
    invariant: 'Split at middle, reverse second half, and then alternate pointers (firstHalf->next = secondHalf; secondHalf->next = tempFirst; firstHalf = tempFirst; secondHalf = tempSecond).',
    expectedExplanation: 'Demonstrates a complex multi-phase sequence: Find Middle, Reverse, and Weave.',
    defaultValues: [1, 2, 3, 4, 5],
    defaultPos: -1,
    cppSnippetId: 'lc143_cpp'
  },
  {
    id: 'lc148',
    orderIndex: 5,
    title: 'Sort List (Merge Sort Middle Split)',
    leetcodeNum: 'LC #148',
    difficulty: 'Medium',
    category: 'Middle Node',
    description: 'Split a linked list into two halves using slow & fast pointers to perform Merge Sort.',
    detailedDescription: 'Find the middle node of the list using slow and fast pointers. To split the list into two independent sublists, we find the node immediately preceding the middle, set its next pointer to NULL, and return the head of the second half (slow). This is the divide step of Merge Sort.',
    invariant: 'By advancing slow by 1 step and fast by 2 steps, slow lands on the split point when fast reaches the end. Setting slow->next to nullptr severs the connection between the left and right halves.',
    expectedExplanation: 'The list is split into two independent sublists: Left (head to slow) and Right (slow->next to end).',
    defaultValues: [4, 2, 1, 3],
    defaultPos: -1,
    cppSnippetId: 'lc148_cpp'
  },
  {
    id: 'lc141',
    orderIndex: 6,
    title: 'Linked List Cycle I',
    leetcodeNum: 'LC #141',
    difficulty: 'Easy',
    category: 'Cycle Detection',
    description: 'Detect if a linked list contains a cycle using Floyd\'s Cycle-Finding Algorithm.',
    detailedDescription: 'If there is no cycle, the fast pointer will reach nullptr. If there is a cycle, the relative distance between fast and slow decreases by exactly 1 node per iteration inside the cycle, ensuring a collision.',
    invariant: 'Inside a cycle of length C, the relative distance decreases by 1 per step. The fast pointer is guaranteed to catch up to the slow pointer from behind in at most C steps.',
    expectedExplanation: 'The meeting point confirms a cycle without allocating extra memory for visited nodes.',
    defaultValues: [3, 2, 0, -4],
    defaultPos: 1, // Cycle points to index 1 (value 2)
    cppSnippetId: 'lc141_cpp'
  },
  {
    id: 'lc142',
    orderIndex: 7,
    title: 'Linked List Cycle II',
    leetcodeNum: 'LC #142',
    difficulty: 'Medium',
    category: 'Cycle Detection',
    description: 'Identify the exact cycle entry node where the loop begins.',
    detailedDescription: 'Once a collision is detected (Phase 1), keep one pointer at the meeting node and reset another pointer to the head of the list (Phase 2). Move both at equal 1x speed. They will meet precisely at the entry node of the cycle.',
    invariant: 'Proof: Distance from Head to Entry is L1. Distance from Entry to Meeting is L2. Since fast traveled 2x slow: 2(L1 + L2) = L1 + L2 + kC => L1 = kC - L2. Thus, moving 1x from Head and Meeting converges on the Entry node!',
    expectedExplanation: 'Phase 2 matches the distance of Head-to-Entry with Meeting-to-Entry, finding the gate node.',
    defaultValues: [3, 2, 0, -4],
    defaultPos: 1,
    cppSnippetId: 'lc142_cpp'
  },
  {
    id: 'lc160',
    orderIndex: 8,
    title: 'Intersection of Two Lists',
    leetcodeNum: 'LC #160',
    difficulty: 'Easy',
    category: 'Cycle Detection',
    description: 'Find the node at which two singly linked lists intersect.',
    detailedDescription: 'Two pointers traverse lists A and B. When either reaches the end, reset it to the head of the other list. This aligns the path lengths: (Length A + Length B) is traversed by both, so they must collide at the intersection node!',
    invariant: 'Both pointers traverse exactly Length(A) + Length(B) + Length(Intersection) before meeting. It virtually acts as a cycle of length (A + B) where convergence is guaranteed.',
    expectedExplanation: 'Aligned pointer paths meet at the intersection point, proving they traveled equal distances.',
    defaultValues: [4, 1, 8, 4, 5, 5, 0, 1], // Custom arrangement for Intersection view
    defaultPos: 2, // We will manually construct list A: [4, 1, 8, 4, 5] and B: [5, 0, 1, 8, 4, 5] intersecting at 8 (index 2 in defaultValues)
    cppSnippetId: 'lc160_cpp'
  },
  {
    id: 'lc202',
    orderIndex: 9,
    title: 'Happy Number',
    leetcodeNum: 'LC #202',
    difficulty: 'Easy',
    category: 'Cyclic Array',
    description: 'Determine if a number is "happy" using cycle detection on the sum of squared digits.',
    detailedDescription: 'Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat until the number equals 1 (happy), or it loops endlessly in a cycle (not happy). Run fast and slow pointers on this chain.',
    invariant: 'The process forms an implicit singly linked list where next(n) is the sum of squared digits of n. A cycle will form if the number is unhappy. If happy, both slow and fast reach 1.',
    expectedExplanation: 'Unhappy numbers loop in a cycle containing the notorious unhappy loop {4, 16, 37, 58, 89, 145, 42, 20}.',
    defaultValues: [19], // Let's also support custom inputs
    defaultPos: -1,
    cppSnippetId: 'lc202_cpp'
  },
  {
    id: 'lc287',
    orderIndex: 10,
    title: 'Find the Duplicate Number',
    leetcodeNum: 'LC #287',
    difficulty: 'Medium',
    category: 'Cyclic Array',
    description: 'Find the duplicate element in an array of size N+1 containing integers from 1 to N.',
    detailedDescription: 'By treating the array indices as node addresses and elements as pointers (i -> nums[i]), the problem is mathematically identical to finding the cycle entry node in a linked list. The duplicate value is the cycle entry node!',
    invariant: 'Because numbers are 1 to N, index 0 is never pointed to, acting as the list head. Multiple indices pointing to the duplicate value create the cycle entry point. Phase 1 finds collision; Phase 2 finds duplicate.',
    expectedExplanation: 'The duplicate value is the entrance to the cycle created by overlapping pointer indexes.',
    defaultValues: [1, 3, 4, 2, 2],
    defaultPos: -1,
    cppSnippetId: 'lc287_cpp'
  },
  {
    id: 'lc457',
    orderIndex: 11,
    title: 'Circular Array Loop',
    leetcodeNum: 'LC #457',
    difficulty: 'Medium',
    category: 'Cyclic Array',
    description: 'Detect unidirectional loops in a circular array of non-zero integers.',
    detailedDescription: 'Each index has a jump size `nums[i]`. Index wraps around circularly. A cycle is valid if: 1. It is unidirectional (either all forward or all backward), 2. The cycle length > 1 node. Use slow and fast pointers to detect these cycles.',
    invariant: 'A pointer updates as: next = (curr + nums[curr]) % N. If a direction change occurs or a self-loop is hit, we mark the path as invalid (0) and continue. Fast moves 2 jumps, slow moves 1 jump.',
    expectedExplanation: 'Ensures unidirectional travel and catches self-loops (size 1) which are invalid according to constraints.',
    defaultValues: [2, -1, 1, 2, 2],
    defaultPos: -1,
    cppSnippetId: 'lc457_cpp'
  }
];
