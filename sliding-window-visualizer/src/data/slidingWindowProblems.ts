import { ProblemDefinition } from '../types';

export const SLIDING_WINDOW_PROBLEMS: ProblemDefinition[] = [
  // 1. Fixed-Size Sliding Window Patterns
  {
    id: 'max-sum-subarray-k',
    seq: 1,
    pattern: 'fixed',
    patternLabel: 'Fixed Window',
    difficulty: 'Easy',
    title: 'Maximum Sum Subarray of Size K',
    summary: 'Find the maximum contiguous sum of any subarray having a fixed length k.',
    invariant: 'Maintain a fixed window of size k: add nums[R] on expand, subtract nums[L] when sliding.',
    inputType: 'array',
    paramLabel: 'Window Size (k)',
    defaultK: 3,
    presets: [
      { name: 'Standard Case', input: '2, 1, 5, 1, 3, 2', paramK: 3, description: 'Optimal sum is 9 at [5, 1, 3]' },
      { name: 'Ascending Array', input: '1, 2, 3, 4, 5, 6', paramK: 3, description: 'Optimal sum is 15 at [4, 5, 6]' },
      { name: 'Negative Values', input: '-1, 4, -2, 5, -3, 6, 2', paramK: 4, description: 'Handles negative integers with fixed size 4' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'first-negative-integer-k',
    seq: 2,
    pattern: 'fixed',
    patternLabel: 'Fixed Window',
    difficulty: 'Easy',
    title: 'First Negative Integer in Every Window of Size K',
    summary: 'For each contiguous window of size k, find the first negative integer (or 0 if none exist).',
    invariant: 'Maintain an auxiliary queue of indices of negative numbers; pop the front when it leaves window L.',
    inputType: 'array',
    paramLabel: 'Window Size (k)',
    defaultK: 3,
    presets: [
      { name: 'Mixed Array', input: '12, -1, -7, 8, -15, 30, 16, 28', paramK: 3, description: 'Results: [-1, -1, -7, -15, -15, 0]' },
      { name: 'Sparse Negatives', input: '5, 2, -3, 4, 7, -8, 9', paramK: 3, description: 'Sparse negative numbers in sliding windows' },
      { name: 'No Negatives', input: '10, 20, 30, 40, 50', paramK: 2, description: 'Window outputs 0 when no negative elements exist' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)'
  },
  {
    id: 'subarrays-k-avg-threshold',
    seq: 3,
    pattern: 'fixed',
    patternLabel: 'Fixed Window',
    difficulty: 'Medium',
    leetcodeNumber: 1343,
    title: 'Sub-arrays of Size K and Average >= Threshold',
    summary: 'Given an array of integers arr and two integers k and threshold, return the number of sub-arrays of size k and average greater than or equal to threshold.',
    invariant: 'Maintain running sum of window k; condition average >= threshold is equivalent to sum >= k * threshold.',
    inputType: 'array',
    paramLabel: 'Window Size (k)',
    defaultK: 3,
    paramTargetLabel: 'Threshold (avg)',
    defaultTarget: '4',
    presets: [
      { name: 'LeetCode Example 1', input: '2, 2, 2, 2, 5, 5, 5, 8', paramK: 3, paramTarget: '4', description: 'Threshold 4 -> Target sum 12. Total 3 valid windows' },
      { name: 'High Threshold', input: '11, 13, 17, 23, 29, 31, 7, 5, 2, 3', paramK: 3, paramTarget: '5', description: 'Threshold 5, checks all windows' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'max-vowels-in-substring',
    seq: 4,
    pattern: 'fixed',
    patternLabel: 'Fixed Window',
    difficulty: 'Medium',
    leetcodeNumber: 1456,
    title: 'Maximum Number of Vowels in a Substring of Length K',
    summary: 'Find the maximum number of vowel letters in any substring of s with length k.',
    invariant: 'Track vowel count in fixed window of size k; add 1 if s[R] is vowel, subtract 1 if s[L] is vowel.',
    inputType: 'string',
    paramLabel: 'Window Size (k)',
    defaultK: 3,
    presets: [
      { name: 'LeetCode Example', input: 'abciiidef', paramK: 3, description: 'Substrings include "iii" with 3 vowels' },
      { name: 'Repeating Vowels', input: 'aeiou', paramK: 2, description: 'Window of size 2 over pure vowels' },
      { name: 'Mixed Alphabet', input: 'leetcode', paramK: 3, description: 'Max vowels in window of 3' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sliding-window-maximum',
    seq: 5,
    pattern: 'fixed',
    patternLabel: 'Fixed Window (Deque)',
    difficulty: 'Hard',
    leetcodeNumber: 239,
    title: 'Sliding Window Maximum',
    summary: 'Given an array nums and window size k, return the max element in each sliding window.',
    invariant: 'Maintain a monotonically decreasing deque of indices: remove elements smaller than nums[R], and pop indices out of [L...R].',
    inputType: 'array',
    paramLabel: 'Window Size (k)',
    defaultK: 3,
    presets: [
      { name: 'LeetCode Classic', input: '1, 3, -1, -3, 5, 3, 6, 7', paramK: 3, description: 'Output: [3, 3, 5, 5, 6, 7]' },
      { name: 'Monotonic Decreasing', input: '9, 8, 7, 6, 5, 4', paramK: 3, description: 'Front of deque is always the leading element' },
      { name: 'Oscillating Sequence', input: '4, 2, 12, 3, 8, 9', paramK: 2, description: 'Window size 2 with dynamic deque maintenance' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)'
  },

  // 2. Variable / Dynamic-Size Window Patterns
  {
    id: 'min-size-subarray-sum',
    seq: 6,
    pattern: 'variable',
    patternLabel: 'Dynamic Window',
    difficulty: 'Medium',
    leetcodeNumber: 209,
    title: 'Minimum Size Subarray Sum',
    summary: 'Find the minimal length of a contiguous subarray of which the sum is greater than or equal to target.',
    invariant: 'Expand R to make sum >= target. Once valid, shrink L repeatedly to record minimal valid window.',
    inputType: 'array',
    paramLabel: 'Target Sum (S)',
    defaultK: 7,
    presets: [
      { name: 'LeetCode Example', input: '2, 3, 1, 2, 4, 3', paramK: 7, description: 'Minimal subarray is [4, 3] of length 2' },
      { name: 'Single Element Match', input: '1, 4, 4', paramK: 4, description: 'Target 4 is satisfied by single element length 1' },
      { name: 'No Valid Subarray', input: '1, 1, 1, 1, 1, 1, 1', paramK: 11, description: 'Sum never reaches target 11 -> returns 0' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'longest-substring-no-repeat',
    seq: 7,
    pattern: 'variable',
    patternLabel: 'Dynamic Window',
    difficulty: 'Medium',
    leetcodeNumber: 3,
    title: 'Longest Substring Without Repeating Characters',
    summary: 'Find the length of the longest substring without repeating characters.',
    invariant: 'Expand R and record char counts. If s[R] becomes duplicate (>1), shrink L until window has all distinct chars.',
    inputType: 'string',
    presets: [
      { name: 'LeetCode Example 1', input: 'abcabcbb', description: 'Longest non-repeating substring is "abc" with length 3' },
      { name: 'Repeated Char', input: 'bbbbb', description: 'All characters identical -> max length 1' },
      { name: 'Subsequence Overlap', input: 'pwwkew', description: 'Answer is "wke" with length 3' },
      { name: 'Complex Pattern', input: 'tmmzuxt', description: 'Requires shrinking past the first t and m' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, Sigma))'
  },
  {
    id: 'longest-substring-k-distinct',
    seq: 8,
    pattern: 'variable',
    patternLabel: 'Dynamic Window',
    difficulty: 'Medium',
    leetcodeNumber: 340,
    title: 'Longest Substring with At Most K Distinct Characters',
    summary: 'Find the length of the longest substring that contains at most k distinct characters.',
    invariant: 'Expand R adding chars to frequency map. If map.size() > k, shrink L until distinct characters <= k.',
    inputType: 'string',
    paramLabel: 'Max Distinct (k)',
    defaultK: 2,
    presets: [
      { name: 'Standard Case', input: 'eceba', paramK: 2, description: 'Answer is "ece" with length 3 (chars e and c)' },
      { name: 'Single Distinct (k=1)', input: 'aaabbc', paramK: 1, description: 'Answer is "aaa" with length 3' },
      { name: 'High Diversity', input: 'WORLDWIDE', paramK: 3, description: 'At most 3 unique characters allowed' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)'
  },
  {
    id: 'fruit-into-baskets',
    seq: 9,
    pattern: 'variable',
    patternLabel: 'Dynamic Window',
    difficulty: 'Medium',
    leetcodeNumber: 904,
    title: 'Fruit Into Baskets',
    summary: 'Pick the maximum number of fruits with 2 baskets (equivalent to longest subarray with at most 2 distinct integers).',
    invariant: 'Expand R collecting fruit types into basket map. When basket types > 2, shrink L until only 2 types remain.',
    inputType: 'array',
    paramLabel: 'Max Baskets (k=2)',
    defaultK: 2,
    presets: [
      { name: 'Alternating Fruits', input: '1, 2, 1', paramK: 2, description: 'Can collect all 3 fruits' },
      { name: 'Three Types', input: '0, 1, 2, 2', paramK: 2, description: 'Can pick [1, 2, 2] for total 3' },
      { name: 'Plateau Sequence', input: '1, 2, 3, 2, 2', paramK: 2, description: 'Can pick [2, 3, 2, 2] for total 4' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'max-consecutive-ones-iii',
    seq: 10,
    pattern: 'variable',
    patternLabel: 'Dynamic Window',
    difficulty: 'Medium',
    leetcodeNumber: 1004,
    title: 'Max Consecutive Ones III',
    summary: 'Given a binary array and integer k, return the maximum consecutive 1s if you can flip at most k 0s.',
    invariant: 'Maintain window where count of zeros <= k. If zeros > k, shrink L until zeros <= k, updating max window size.',
    inputType: 'array',
    paramLabel: 'Max Zero Flips (k)',
    defaultK: 2,
    presets: [
      { name: 'LeetCode Example 1', input: '1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0', paramK: 2, description: 'Flipping two zeros yields 6 consecutive 1s' },
      { name: 'Short Flips', input: '0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1', paramK: 3, description: 'Max length 10 by flipping 3 zeros' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'longest-repeating-char-replacement',
    seq: 11,
    pattern: 'variable',
    patternLabel: 'Dynamic Window',
    difficulty: 'Medium',
    leetcodeNumber: 424,
    title: 'Longest Repeating Character Replacement',
    summary: 'Find the length of the longest substring containing identical letters you can get by replacing at most k characters.',
    invariant: 'Window is valid if (windowLength - maxFrequency) <= k. If invalid, shrink L to restore invariant.',
    inputType: 'string',
    paramLabel: 'Max Replacements (k)',
    defaultK: 1,
    presets: [
      { name: 'LeetCode Example 1', input: 'ABAB', paramK: 2, description: 'Replace two characters to get "AAAA" of length 4' },
      { name: 'LeetCode Example 2', input: 'AABABBA', paramK: 1, description: 'Replace one "B" in "AABA" to get "AAAA" length 4' },
      { name: 'Dense String', input: 'BAAAB', paramK: 2, description: 'Can flip both B to make 5 consecutive A' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(26)'
  },

  // 3. Substring Search & Target Matching Patterns
  {
    id: 'permutation-in-string',
    seq: 12,
    pattern: 'target',
    patternLabel: 'Target Match (Fixed)',
    difficulty: 'Medium',
    leetcodeNumber: 567,
    title: 'Permutation in String / Find Anagrams',
    summary: 'Given strings s1 and s2, return true if s2 contains a permutation of s1 (fixed window of size s1.length()).',
    invariant: 'Fixed window of size |s1|: maintain match count of characters with matching frequencies. Match occurs when matched == 26.',
    inputType: 'string',
    paramTargetLabel: 'Pattern s1',
    defaultTarget: 'ab',
    presets: [
      { name: 'Match Exists', input: 'eidbaooo', paramTarget: 'ab', description: 'Substring "ba" is a permutation of "ab"' },
      { name: 'No Match', input: 'eidboaoo', paramTarget: 'ab', description: '"ab" permutation does not exist contiguously' },
      { name: 'Anagram Finder', input: 'cbaebabacd', paramTarget: 'abc', description: 'Permutation of "abc" matches at indices 0 and 6' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(26)'
  },
  {
    id: 'minimum-window-substring',
    seq: 13,
    pattern: 'target',
    patternLabel: 'Target Match (Dynamic)',
    difficulty: 'Hard',
    leetcodeNumber: 76,
    title: 'Minimum Window Substring',
    summary: 'Find the minimum window in s which will contain all the characters in t in complexity O(m+n).',
    invariant: 'Expand R to satisfy all required character counts (matched == required). Then shrink L to find minimal valid length.',
    inputType: 'string',
    paramTargetLabel: 'Target t',
    defaultTarget: 'ABC',
    presets: [
      { name: 'LeetCode Classic', input: 'ADOBECODEBANC', paramTarget: 'ABC', description: 'Minimal substring is "BANC" containing A, B, C' },
      { name: 'Single Char Exact', input: 'a', paramTarget: 'a', description: 'Single character match of length 1' },
      { name: 'Duplicates in Target', input: 'aaflslflabb', paramTarget: 'aab', description: 'Requires two "a"s and one "b"' }
    ],
    timeComplexity: 'O(M + N)',
    spaceComplexity: 'O(Sigma)'
  },
  {
    id: 'substring-concatenation-words',
    seq: 14,
    pattern: 'target',
    patternLabel: 'Target Match (Chunked)',
    difficulty: 'Hard',
    leetcodeNumber: 30,
    title: 'Substring with Concatenation of All Words',
    summary: 'Find all starting indices of substring(s) in s that is a concatenation of each word in words exactly once.',
    invariant: 'Slide window of chunk size (wordLength * totalWords) in wordLength strides, tracking word frequency match.',
    inputType: 'string',
    paramTargetLabel: 'Words (comma separated)',
    defaultTarget: 'foo,bar',
    presets: [
      { name: 'Two Words', input: 'barfoothefoobarman', paramTarget: 'foo,bar', description: 'Matches at index 0 ("barfoo") and index 9 ("foobar")' },
      { name: 'Word Repetition', input: 'wordgoodgoodgoodbestword', paramTarget: 'word,good,best,word', description: 'Concatenation check across word strides' }
    ],
    timeComplexity: 'O(N * wordLen)',
    spaceComplexity: 'O(M * wordLen)'
  },

  // 4. The Exact-K via At-Most-K Trick
  {
    id: 'subarrays-k-different-integers',
    seq: 15,
    pattern: 'exact-k',
    patternLabel: 'Exact-K Pattern',
    difficulty: 'Hard',
    leetcodeNumber: 992,
    title: 'Subarrays with K Different Integers',
    summary: 'Count good contiguous subarrays with exactly k different integers using exact(K) = atMost(K) - atMost(K - 1).',
    invariant: 'In atMost(K), for every R, when distinct <= K, all (R - L + 1) subarrays ending at R are valid. Exactly(K) is atMost(K) - atMost(K-1).',
    inputType: 'array',
    paramLabel: 'Exact Distinct (k)',
    defaultK: 2,
    presets: [
      { name: 'LeetCode Example 1', input: '1, 2, 1, 2, 3', paramK: 2, description: 'Subarrays with exactly 2 distinct: 7 total' },
      { name: 'Uniform Array', input: '1, 2, 1, 3, 4', paramK: 3, description: 'Finds count with exactly 3 distinct integers' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)'
  },
  {
    id: 'binary-subarrays-with-sum',
    seq: 16,
    pattern: 'exact-k',
    patternLabel: 'Exact-K Pattern',
    difficulty: 'Medium',
    leetcodeNumber: 930,
    title: 'Binary Subarrays With Sum',
    summary: 'Count non-empty subarrays with sum equal to goal. Solved elegantly via atMost(goal) - atMost(goal - 1).',
    invariant: 'Maintain atMost(sum) sliding window where runningSum <= goal. Subarrays ending at R count (R - L + 1). Subtract atMost(goal - 1).',
    inputType: 'array',
    paramLabel: 'Goal Sum',
    defaultK: 2,
    presets: [
      { name: 'LeetCode Example 1', input: '1, 0, 1, 0, 1', paramK: 2, description: 'Subarrays with sum 2: 4 total' },
      { name: 'All Zeros (Goal 0)', input: '0, 0, 0, 0, 0', paramK: 0, description: 'Count subarrays with sum 0: 15 total' }
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)'
  }
];
