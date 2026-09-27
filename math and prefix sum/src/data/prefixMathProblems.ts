import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  // Module 1: 1D Prefix Sum & Range Query Foundations
  {
    id: 'lc303',
    seqNumber: 1,
    leetcodeTag: 'LC #303',
    difficulty: 'Easy',
    title: 'Range Sum Query - Immutable',
    moduleId: 'prefix-1d',
    description: 'Query the sum of elements of an array between indices L and R in O(1) time after O(N) preprocessing.',
    details: `■ PROBLEM STATEMENT:
Given an integer array 'nums', handle multiple queries to calculate the sum of elements between indices 'left' and 'right' inclusive (i.e., sum(nums[left...right])).

■ ALGORITHMIC INTUITION:
Instead of running a linear sweep from left to right for each query (which takes O(N) time), we precompute a running sum prefix array where prefix[i] stores the sum of first i elements. The range sum can then be answered in O(1) time by taking the difference prefix[right + 1] - prefix[left].

■ TEST CASE SPECIFICATION:
• Input Array (nums): [3, -2, 5, -3, 8, -4]
• Range Query: L = 2 (value: 5), R = 4 (value: 8)
• Hand-Calculated Range Sum: 5 + (-3) + 8 = 10
• Precomputed Prefix Array: [0, 3, 1, 6, 3, 11, 7]
• Constant-Time Evaluation: prefix[5] - prefix[2] => 11 - 1 = 10`,
    invariant: 'Sum(L, R) = prefix[R + 1] - prefix[L]',
    defaultInput: { nums: [3, -2, 5, -3, 8, -4], L: 2, R: 4 },
    inputSchema: {
      type: 'array',
      labels: ['Nums Array', 'L (Left Index)', 'R (Right Index)'],
      placeholders: ['3, -2, 5, -3, 8, -4', '2', '4']
    }
  },
  {
    id: 'lc1480',
    seqNumber: 2,
    leetcodeTag: 'LC #1480',
    difficulty: 'Easy',
    title: 'Running Sum of 1D Array',
    moduleId: 'prefix-1d',
    description: 'Transform an array in-place so that each index contains the cumulative running sum up to that index.',
    details: `■ PROBLEM STATEMENT:
Given an array 'nums', define a running sum of the array where runningSum[i] is the sum of nums[0] through nums[i] inclusive.

■ ALGORITHMIC INTUITION:
We can solve this problem in-place using O(1) auxiliary space. We start traversing the array from index 1 and accumulate the previous value at each index, so that nums[i] = nums[i-1] + nums[i].

■ TEST CASE SPECIFICATION:
• Input Array (nums): [1, 2, 3, 4]
• Hand-Calculated Cumulative Sums:
  - i = 0: [1]
  - i = 1: 1 + 2 = 3 => [1, 3]
  - i = 2: 3 + 3 = 6 => [1, 3, 6]
  - i = 3: 6 + 4 = 10 => [1, 3, 6, 10]
• Expected Output Array: [1, 3, 6, 10]`,
    invariant: 'runningSum[i] = runningSum[i-1] + nums[i]',
    defaultInput: { nums: [1, 2, 3, 4] },
    inputSchema: {
      type: 'array',
      labels: ['Nums Array'],
      placeholders: ['1, 2, 3, 4']
    }
  },
  {
    id: 'lc724',
    seqNumber: 3,
    leetcodeTag: 'LC #724',
    difficulty: 'Easy',
    title: 'Find Pivot Index',
    moduleId: 'prefix-1d',
    description: 'Find the equilibrium index where the sum of numbers strictly to the left equals numbers to the right.',
    details: `■ PROBLEM STATEMENT:
Given an array of integers 'nums', calculate the pivot (equilibrium) index where the sum of all elements strictly to the left of the index is equal to the sum of all elements strictly to the right. If no such index exists, return -1.

■ ALGORITHMIC INTUITION:
Compute the total sum of the array in O(N). Then iterate through the array while maintaining a running 'leftSum'. At each index i, the sum of elements to the right is: rightSum = totalSum - leftSum - nums[i]. If leftSum == rightSum, then i is the pivot.

■ TEST CASE SPECIFICATION:
• Input Array (nums): [1, 7, 3, 6, 5, 6]
• Total Sum Calculation: 1 + 7 + 3 + 6 + 5 + 6 = 28
• Traversal Scan:
  - At index 3 (value 6): leftSum = 1 + 7 + 3 = 11.
  - Calculated rightSum = 28 - 11 - 6 = 11.
  - leftSum (11) == rightSum (11) holds true!
• Expected Pivot Index Output: 3`,
    invariant: 'leftSum == totalSum - leftSum - nums[i]',
    defaultInput: { nums: [1, 7, 3, 6, 5, 6] },
    inputSchema: {
      type: 'array',
      labels: ['Nums Array'],
      placeholders: ['1, 7, 3, 6, 5, 6']
    }
  },
  {
    id: 'lc238',
    seqNumber: 4,
    leetcodeTag: 'LC #238',
    difficulty: 'Medium',
    title: 'Product of Array Except Self',
    moduleId: 'prefix-1d',
    description: 'Construct a division-free prefix and suffix product array.',
    details: `■ PROBLEM STATEMENT:
Given an integer array 'nums', return an output array 'res' such that res[i] is equal to the product of all elements of nums except nums[i]. The division operator is strictly prohibited, and it must execute in O(N) time.

■ ALGORITHMIC INTUITION:
Any element except self is the product of all elements to its left multiplied by all elements to its right. We make two passes:
1. Left-to-right: Fill the results array with prefix products of nums.
2. Right-to-left: Accumulate a running suffix product and multiply it with the prefix product already stored in the results.

■ TEST CASE SPECIFICATION:
• Input Array (nums): [1, 2, 3, 4]
• Prefix Products Pass: [1, 1, 2, 6]
• Suffix Products Pass (backwards with running factor):
  - i = 3: res[3] = 6 * 1 = 6 (factor update: 1 * 4 = 4)
  - i = 2: res[2] = 2 * 4 = 8 (factor update: 4 * 3 = 12)
  - i = 1: res[1] = 1 * 12 = 12 (factor update: 12 * 2 = 24)
  - i = 0: res[0] = 1 * 24 = 24
• Expected Output Array: [24, 12, 8, 6]`,
    invariant: 'output[i] = prefixProducts[i] * suffixProducts[i]',
    defaultInput: { nums: [1, 2, 3, 4] },
    inputSchema: {
      type: 'array',
      labels: ['Nums Array'],
      placeholders: ['1, 2, 3, 4']
    }
  },
  {
    id: 'lc42',
    seqNumber: 5,
    leetcodeTag: 'LC #42',
    difficulty: 'Hard',
    title: 'Trapping Rain Water',
    moduleId: 'prefix-1d',
    description: 'Calculate trapped rainwater using precomputed prefix maximum and suffix maximum sweeps.',
    details: `■ PROBLEM STATEMENT:
Given 'n' non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

■ ALGORITHMIC INTUITION:
The amount of water that can be trapped on top of any bar at index 'i' is determined by the minimum of the maximum height to its left and the maximum height to its right, minus the height of the bar itself:
  water[i] = min(leftMax[i], rightMax[i]) - height[i]
We precompute:
  1. prefixMax (leftMax) array representing the highest block from left to right.
  2. suffixMax (rightMax) array representing the highest block from right to left.

■ TEST CASE SPECIFICATION:
• Input Elevation Heights: [3, 0, 1, 3, 0, 2]
• Calculated Left Maximums: [3, 3, 3, 3, 3, 3]
• Calculated Right Maximums: [3, 3, 3, 3, 2, 2]
• Solved water columns:
  - idx 0: min(3,3) - 3 = 0
  - idx 1: min(3,3) - 0 = 3
  - idx 2: min(3,3) - 1 = 2
  - idx 3: min(3,3) - 3 = 0
  - idx 4: min(3,2) - 0 = 2
  - idx 5: min(3,2) - 2 = 0
• Total trapped volume: 0 + 3 + 2 + 0 + 2 + 0 = 7 units`,
    invariant: 'water[i] = min(leftMax[i], rightMax[i]) - height[i]',
    defaultInput: { nums: [3, 0, 1, 3, 0, 2] },
    inputSchema: {
      type: 'array',
      labels: ['Block Heights Array'],
      placeholders: ['3, 0, 1, 3, 0, 2']
    }
  },

  // Module 2: Prefix Sum with Hash Map (O(N) Subarray Lookups)
  {
    id: 'lc560',
    seqNumber: 6,
    leetcodeTag: 'LC #560',
    difficulty: 'Medium',
    title: 'Subarray Sum Equals K',
    moduleId: 'prefix-hashmap',
    description: 'Count continuous subarrays whose sum equals target value K.',
    details: `■ PROBLEM STATEMENT:
Given an array of integers 'nums' and an integer 'k', return the total number of continuous subarrays whose sum equals to k.

■ ALGORITHMIC INTUITION:
We maintain a running prefix sum. If the cumulative sum up to index j is 'currSum', we check if there exists an earlier index i such that the cumulative sum was 'currSum - k'. Since currSum - (currSum - k) = k, this represents a valid subarray of sum k. We use a Hash Map to store the frequency of all seen prefix sums to resolve lookups in O(1) time.

■ TEST CASE SPECIFICATION:
• Input Array (nums): [3, 4, 7, 2, -3, 1, 4, 2], k = 7
• Traversal Scan:
  - i = 0: currSum = 3. Map contains {0:1, 3:1}
  - i = 1: currSum = 7. (7 - 7 = 0) exists! count + 1 = 1. Map: {0:1, 3:1, 7:1}
  - i = 2: currSum = 14. (14 - 7 = 7) exists! count + 1 = 2. Map: {0:1, 3:1, 7:1, 14:1}
• Total Count: 4 valid matching subarrays`,
    invariant: 'Map stores frequency of seen prefix sums.',
    defaultInput: { nums: [3, 4, 7, 2, -3, 1, 4, 2], k: 7 },
    inputSchema: {
      type: 'range-add-args',
      labels: ['Nums Array', 'Target Sum (k)'],
      placeholders: ['3, 4, 7, 2, -3, 1, 4, 2', '7']
    }
  },
  {
    id: 'lc523',
    seqNumber: 7,
    leetcodeTag: 'LC #523',
    difficulty: 'Medium',
    title: 'Continuous Subarray Sum',
    moduleId: 'prefix-hashmap',
    description: 'Check if there is a subarray of length >= 2 whose sum is a multiple of K.',
    details: `■ PROBLEM STATEMENT:
Given an integer array 'nums' and an integer 'k', return true if nums has a continuous subarray of size at least two whose elements sum up to a multiple of k (i.e., n * k).

■ ALGORITHMIC INTUITION:
We compute the running prefix sum modulo k. If the same modulo remainder appears at two different indices, the elements between them must sum up to a multiple of k. We store the first occurrence index of each remainder in a Hash Map to verify the length is at least 2 (current_index - first_seen_index >= 2).

■ TEST CASE SPECIFICATION:
• Input Array (nums): [23, 2, 4, 6, 7], k = 6
• Modulo Tracker:
  - i = 0: prefix sum = 23, rem = 23 % 6 = 5. Map: {0: -1, 5: 0}
  - i = 1: prefix sum = 25, rem = 25 % 6 = 1. Map: {0: -1, 5: 0, 1: 1}
  - i = 2: prefix sum = 29, rem = 29 % 6 = 5. Remainder '5' is already in the map at index 0!
  - Interval length: 2 - 0 = 2. Since 2 >= 2, return true!
• Expected Output: true`,
    invariant: 'Repeating prefix sum remainder implies a multiple of k.',
    defaultInput: { nums: [23, 2, 4, 6, 7], k: 6 },
    inputSchema: {
      type: 'range-add-args',
      labels: ['Nums Array', 'Modulo Divisor (k)'],
      placeholders: ['23, 2, 4, 6, 7', '6']
    }
  },
  {
    id: 'lc525',
    seqNumber: 8,
    leetcodeTag: 'LC #525',
    difficulty: 'Medium',
    title: 'Contiguous Array (Equal 0 & 1)',
    moduleId: 'prefix-hashmap',
    description: 'Find the maximum length of a contiguous subarray with an equal number of 0s and 1s.',
    details: `■ PROBLEM STATEMENT:
Given a binary array 'nums' containing only 0s and 1s, find the maximum length of a contiguous subarray with an equal number of 0 and 1.

■ ALGORITHMIC INTUITION:
We transform the array conceptually: treat every 0 as -1 and every 1 as +1. The problem then reduces to finding the longest contiguous subarray whose sum is exactly 0. We track the running prefix sum and store its earliest occurrence in a Hash Map. If we see a prefix sum again, we compute the index span.

■ TEST CASE SPECIFICATION:
• Input Array (nums): [0, 1, 0, 1, 1, 0, 0]
• Concept Array: [-1, +1, -1, +1, +1, -1, -1]
• Running sum analysis:
  - i = 0: sum = -1. Map: {0: -1, -1: 0}
  - i = 1: sum = 0. Already seen at -1! length = 1 - (-1) = 2. Max = 2.
  - i = 2: sum = -1. Already seen at 0! length = 2 - 0 = 2. Max = 2.
  - i = 3: sum = 0. Already seen at -1! length = 3 - (-1) = 4. Max = 4.
  - i = 4: sum = 1. Map: {..., 1: 4}
  - i = 5: sum = 0. Already seen at -1! length = 5 - (-1) = 6. Max = 6.
• Expected Output: 6`,
    invariant: 'Same prefix sum balance at two indices implies net sum of 0.',
    defaultInput: { nums: [0, 1, 0, 1, 1, 0, 0] },
    inputSchema: {
      type: 'array',
      labels: ['Binary Array (0s & 1s)'],
      placeholders: ['0, 1, 0, 1, 1, 0, 0']
    }
  },
  {
    id: 'lc370',
    seqNumber: 9,
    leetcodeTag: 'LC #370',
    difficulty: 'Medium',
    title: 'Range Addition / Difference Array',
    moduleId: 'prefix-hashmap',
    description: 'Demonstrate range updates using a boundary-tagging difference array.',
    details: `■ PROBLEM STATEMENT:
Start with an array of size N filled with 0s. Apply multiple range updates [L, R, value] in O(1) time per query, then reconstruct the final array using a prefix sum sweep.

■ ALGORITHMIC INTUITION:
To perform range addition on interval [L, R] with value 'V' in O(1) time, we mark the boundaries on an auxiliary difference array 'diff':
  1. diff[L] += V
  2. diff[R + 1] -= V (if in bounds)
A cumulative prefix sum sweep on the difference array 'diff' resolves all range additions into the final array in O(N) total time.

■ TEST CASE SPECIFICATION:
• Array Size: 6 (initialized to [0, 0, 0, 0, 0, 0])
• Query Updates:
  - Add 2 to range [1, 3] => diff[1] += 2, diff[4] -= 2
  - Add 3 to range [2, 4] => diff[2] += 3, diff[5] -= 3
  - Subtract 2 from range [0, 2] => diff[0] -= 2, diff[3] += 2
• Difference Array: [-2, 2, 3, 2, -2, -3]
• Reconstructed Prefix Sum: [-2, 0, 3, 5, 3, 0]`,
    invariant: 'diff[L] += val, diff[R+1] -= val',
    defaultInput: { size: 6, updates: '1,3,2; 2,4,3; 0,2,-2' },
    inputSchema: {
      type: 'range-add-args',
      labels: ['Array Size', 'Updates (L,R,val; separated by semi-colon)'],
      placeholders: ['6', '1,3,2; 2,4,3; 0,2,-2']
    }
  },

  // Module 3: Essential Number Theory & Prime Algorithms
  {
    id: 'gcd',
    seqNumber: 10,
    leetcodeTag: 'Math - GCD',
    difficulty: 'Easy',
    title: 'Euclidean GCD Algorithm',
    moduleId: 'number-theory',
    description: 'Calculate the Greatest Common Divisor of two integers.',
    details: `■ PROBLEM STATEMENT:
Compute the Greatest Common Divisor (GCD) of two numbers A and B using the Euclidean algorithm, which recursively takes modulo remainders.

■ ALGORITHMIC INTUITION:
The Euclidean algorithm is based on the principle that the greatest common divisor of two integers A and B (where A > B) is the same as the greatest common divisor of B and the remainder of A divided by B (A % B). We recursively apply gcd(a, b) = gcd(b, a % b) until the divisor becomes 0.

■ TEST CASE SPECIFICATION:
• Input: A = 54, B = 24
• Reduction steps:
  - Step 1: 54 % 24 = 6. Problem reduces to GCD(24, 6)
  - Step 2: 24 % 6 = 0. Problem reduces to GCD(6, 0)
• Divisor is 0. Return Dividend A = 6.
• Expected Output: 6`,
    invariant: 'gcd(a, b) = gcd(b, a % b)',
    defaultInput: { a: 54, b: 24 },
    inputSchema: {
      type: 'two-numbers',
      labels: ['Number A', 'Number B'],
      placeholders: ['54', '24']
    }
  },
  {
    id: 'lc204',
    seqNumber: 11,
    leetcodeTag: 'LC #204',
    difficulty: 'Medium',
    title: 'Count Primes (Sieve of Eratosthenes)',
    moduleId: 'number-theory',
    description: 'Find the total count of prime numbers strictly less than N.',
    details: `■ PROBLEM STATEMENT:
Given an integer 'n', return the number of prime numbers that are strictly less than n.

■ ALGORITHMIC INTUITION:
The Sieve of Eratosthenes is an ancient algorithm that finds primes up to N. We initialize a boolean array 'isPrime' of size N with true. Starting at p = 2, if isPrime[p] is true, we mark all of its multiples (p*2, p*3, ...) as composite (false). We only need to iterate p up to sqrt(N) because any composite number less than N must have a prime factor less than or equal to sqrt(N).

■ TEST CASE SPECIFICATION:
• Input: N = 30
• Filtering Multiples:
  - Strike off multiples of 2: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28
  - Strike off multiples of 3: 9, 15, 21, 27 (some are already crossed out)
  - Strike off multiples of 5: 25
• Remaining Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
• Expected Count Output: 10`,
    invariant: 'Sift out composite multiples starting from p * p.',
    defaultInput: { n: 30 },
    inputSchema: {
      type: 'number',
      labels: ['Upper Limit N'],
      placeholders: ['30']
    }
  },
  {
    id: 'lc50',
    seqNumber: 12,
    leetcodeTag: 'LC #50',
    difficulty: 'Medium',
    title: 'Binary Modular Exponentiation',
    moduleId: 'number-theory',
    description: 'Compute power under modulo efficiently in logarithmic time.',
    details: `■ PROBLEM STATEMENT:
Calculate (base^exp) % modulo in O(log exp) logarithmic time.

■ ALGORITHMIC INTUITION:
Instead of multiplying base recursively 'exp' times (which is O(exp)), we represent the exponent in binary. For each bit, we square the base. If the current bit is 1, we multiply our answer by the squared base. This divides the power by 2 at each step, yielding O(log N) time complexity.

■ TEST CASE SPECIFICATION:
• Input: Base = 3, Exponent = 13, Modulo = 1000
• Exponent in Binary: 13 = 1101_2 (Bits from LSB: 1, 0, 1, 1)
• Squaring Passes:
  - Bit 0 (1): Multiply ans = (1 * 3) % 1000 = 3. Square base = 3^2 = 9.
  - Bit 1 (0): Skip ans multiplication. Square base = 9^2 = 81.
  - Bit 2 (1): Multiply ans = (3 * 81) % 1000 = 243. Square base = 81^2 = 6561 % 1000 = 561.
  - Bit 3 (1): Multiply ans = (243 * 561) % 1000 = 136323 % 1000 = 323.
• Expected Output: 323`,
    invariant: 'Process active bits in binary representation of the power.',
    defaultInput: { base: 3, exp: 13, mod: 1000 },
    inputSchema: {
      type: 'pow-args',
      labels: ['Base (x)', 'Exponent (n)', 'Modulo (m)'],
      placeholders: ['3', '13', '1000']
    }
  },

  // Module 4: Integer Manipulation & Digit Math
  {
    id: 'lc9',
    seqNumber: 13,
    leetcodeTag: 'LC #9',
    difficulty: 'Easy',
    title: 'Palindrome Number',
    moduleId: 'integer-math',
    description: 'Determine if an integer is a palindrome without string conversion.',
    details: `■ PROBLEM STATEMENT:
Given an integer x, return true if x is a palindrome, and false otherwise, without converting the integer into a string.

■ ALGORITHMIC INTUITION:
Instead of reversing the whole number (which could overflow 32-bit integer limits), we only reverse the second half of the digits and compare it with the first half. When x <= reversedNum, we have processed half of the digits.

■ TEST CASE SPECIFICATION:
• Input: x = 1221
• Digits extraction loop:
  - Step 1: Pop 1. x = 122, reversed = 1.
  - Step 2: Pop 2. x = 12, reversed = 12.
• Loop ends since x (12) <= reversed (12).
• Compare: x == reversed (12 == 12) is true!
• Expected Output: true`,
    invariant: 'x == reversed second half of digits',
    defaultInput: { x: 1221 },
    inputSchema: {
      type: 'number',
      labels: ['Integer x'],
      placeholders: ['1221']
    }
  },
  {
    id: 'lc7',
    seqNumber: 14,
    leetcodeTag: 'LC #7',
    difficulty: 'Medium',
    title: 'Reverse Integer',
    moduleId: 'integer-math',
    description: 'Reverse the digits of a 32-bit signed integer with overflow safeguards.',
    details: `■ PROBLEM STATEMENT:
Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], return 0.

■ ALGORITHMIC INTUITION:
We extract the last digit of x using x % 10, then append it to our reversed accumulator. To avoid raw integer overflow before we multiply by 10, we check:
  if (rev > INT_MAX / 10 || rev < INT_MIN / 10) return 0.

■ TEST CASE SPECIFICATION:
• Input: x = 12345678
• Multi-step digital inversion:
  - Pop 8 => rev = 8
  - Pop 7 => rev = 87
  - ...
  - Pop 1 => rev = 87654321
• Since 87654321 is inside [-2147483648, 2147483647], the result is valid.
• Expected Output: 87654321`,
    invariant: 'Safeguard against INT_MAX/10 before actual multiplication.',
    defaultInput: { x: 12345678 },
    inputSchema: {
      type: 'number',
      labels: ['Integer x'],
      placeholders: ['12345678']
    }
  },
  {
    id: 'lc172',
    seqNumber: 15,
    leetcodeTag: 'LC #172',
    difficulty: 'Medium',
    title: 'Factorial Trailing Zeroes',
    moduleId: 'integer-math',
    description: 'Return the number of trailing zeroes in factorial N.',
    details: `■ PROBLEM STATEMENT:
Given an integer n, return the number of trailing zeroes in n!. Count the occurrence of prime factor 5 in divisors of n!.

■ ALGORITHMIC INTUITION:
Trailing zeroes are produced by combinations of factors 2 and 5 (which make 10). In any factorial, the prime factor 2 is much more abundant than 5. Thus, counting the number of trailing zeros is equivalent to counting how many factors of 5 are in the prime factorization of n!. We compute this via sum of floor(n / 5^k).

■ TEST CASE SPECIFICATION:
• Input: n = 100
• Evaluating Legendre's formula:
  - 100 / 5 = 20 multiples of 5 (5, 10, 15, ..., 100)
  - 100 / 25 = 4 multiples of 25 (25, 50, 75, 100) which contain an extra factor of 5
  - Total zeroes = 20 + 4 = 24
• Expected Output: 24`,
    invariant: 'Trailing zeroes = sum floor(n / 5^k)',
    defaultInput: { n: 100 },
    inputSchema: {
      type: 'number',
      labels: ['Integer n'],
      placeholders: ['100']
    }
  },
  {
    id: 'lc171_168',
    seqNumber: 16,
    leetcodeTag: 'LC #171 & #168',
    difficulty: 'Easy',
    title: 'Excel Column Title & Number',
    moduleId: 'integer-math',
    description: 'Bijective conversion between column letters and integers.',
    details: `■ PROBLEM STATEMENT:
Convert an Excel column letter title (e.g., "A", "Z", "AA") to its corresponding column integer index, and vice versa.

■ ALGORITHMIC INTUITION:
This represents a bijective base-26 positional numeral system without a zero digit.
• Title to Number: num = num * 26 + (char - 'A' + 1).
• Number to Title: decrement the value by 1, take modulo 26 to find character code, and shift by division.

■ TEST CASE SPECIFICATION:
• Input Column Title: FXSH
• Conversion steps:
  - Char 'F' (6): 0 * 26 + 6 = 6
  - Char 'X' (24): 6 * 26 + 24 = 180
  - Char 'S' (19): 180 * 26 + 19 = 4699
  - Char 'H' (8): 4699 * 26 + 8 = 122182
• Expected Column Index Output: 122182`,
    invariant: 'Bijective Base-26 representation.',
    defaultInput: { columnTitle: 'FXSH' },
    inputSchema: {
      type: 'array',
      labels: ['Column Title (e.g. FXSH)'],
      placeholders: ['FXSH']
    }
  }
];
