import { ProblemMetadata } from '../types';

export const PROBLEMS: ProblemMetadata[] = [
  // Foundations of Recursion
  {
    id: 'factorial',
    index: '#01',
    difficulty: 'Easy',
    title: 'Factorial of N',
    category: 'Foundations of Recursion',
    invariant: 'Linear reduction: Reduce N by 1 at each recursion step. Peak stack memory reaches exactly depth N.',
    descriptionText: 'Compute the factorial of a number N recursively (N! = N * (N-1)!). Demonstrates the simplest form of linear mathematical recursion.',
    defaultInputs: { n: 4 },
    cppCode: `// Factorial Recursive Implementation
int factorial(int n) {
    if (n <= 1) return 1; // Base case
    
    return n * factorial(n - 1); // Recurse
}`,
    cppLineMap: {
      'base': 3,
      'recurse': 5
    }
  },
  {
    id: 'fibonacci',
    index: '#02',
    difficulty: 'Easy',
    title: 'Fibonacci Numbers',
    category: 'Foundations of Recursion',
    invariant: 'Divide & Conquer Branching: Form a binary tree of subproblems F(n-1) and F(n-2) at each layer.',
    descriptionText: 'Generate the N-th Fibonacci number. Shows how a single call bifurcates into a branching execution tree of overlapping subproblems.',
    defaultInputs: { n: 4 },
    cppCode: `// Fibonacci Recursive Implementation
int fib(int n) {
    if (n <= 1) return n; // Base case
    
    int left = fib(n - 1);  // Left branch
    int right = fib(n - 2); // Right branch
    
    return left + right;    // Combine sum
}`,
    cppLineMap: {
      'base': 3,
      'left': 5,
      'right': 6,
      'combine': 8
    }
  },
  {
    id: 'sum_n',
    index: '#03',
    difficulty: 'Easy',
    title: 'Sum of First N Numbers',
    category: 'Foundations of Recursion',
    invariant: 'Incremental accumulation: Accumulate the index value inside the current stack frame recursively.',
    descriptionText: 'Calculate the sum of integers from 1 up to N (1 + 2 + ... + N) using single linear recursion.',
    defaultInputs: { n: 5 },
    cppCode: `// Sum of first N numbers
int sumN(int n) {
    if (n <= 0) return 0; // Base case
    
    return n + sumN(n - 1); // Accumulate & Recurse
}`,
    cppLineMap: {
      'base': 3,
      'recurse': 5
    }
  },
  {
    id: 'array_sum',
    index: '#04',
    difficulty: 'Easy',
    title: 'Sum of Array Elements',
    category: 'Foundations of Recursion',
    invariant: 'Index Traversal: Advance the active index element pointer linearly across the array boundaries.',
    descriptionText: 'Recursively accumulate array element values by traversing indexes from left to right.',
    defaultInputs: { nums: [1, 2, 3, 4] },
    cppCode: `// Sum of array elements recursively
int sumArray(vector<int>& nums, int i) {
    if (i == nums.size()) return 0; // Base case
    
    return nums[i] + sumArray(nums, i + 1); // Recurse next index
}`,
    cppLineMap: {
      'base': 3,
      'recurse': 5
    }
  },
  {
    id: 'binary_search',
    index: '#05',
    difficulty: 'Easy',
    title: 'Recursive Binary Search',
    category: 'Foundations of Recursion',
    invariant: 'Logarithmic Division: Halve search intervals by updating pivot bounds based on median checks.',
    descriptionText: 'Perform binary search within a sorted array. Evaluates boundaries recursively, halving the search space at each level.',
    defaultInputs: { nums: [1, 3, 5, 7, 9], target: 7 },
    cppCode: `// Recursive Binary Search in Sorted Array
int binarySearch(vector<int>& nums, int l, int r, int target) {
    if (l > r) return -1; // Base case: not found
    
    int mid = l + (r - l) / 2;
    if (nums[mid] == target) return mid; // Found!
    
    if (nums[mid] > target) {
        return binarySearch(nums, l, mid - 1, target); // Search Left
    } else {
        return binarySearch(nums, mid + 1, r, target); // Search Right
    }
}`,
    cppLineMap: {
      'base': 3,
      'mid': 5,
      'found': 6,
      'left': 9,
      'right': 11
    }
  },
  {
    id: 'binary_exponentiation',
    index: '#06',
    leetcode: 'LC #50',
    difficulty: 'Medium',
    title: 'Binary Exponentiation (Fast Power)',
    category: 'Foundations of Recursion',
    invariant: 'Logarithmic division: Squaring halves the recursive exponent multiplication count in logarithmic stack time.',
    descriptionText: 'Compute x^n. If n is even, x^n = (x^(n/2))^2. If odd, x^n = x * (x^(n/2))^2, slashing depth to logarithmic scale.',
    defaultInputs: { x: 2, n: 5 },
    cppCode: `// Fast Power O(log N) Recursive
double myPow(double x, long long n) {
    if (n == 0) return 1.0; // Base Case
    if (n < 0) return 1.0 / myPow(x, -n);
    
    double half = myPow(x, n / 2); // Divide
    
    if (n % 2 == 0) {
        return half * half; // Combine Even
    } else {
        return x * half * half; // Combine Odd
    }
}`,
    cppLineMap: {
      'base': 3,
      'neg': 4,
      'recurse': 6,
      'even': 9,
      'odd': 11
    }
  },
  {
    id: 'reverse_palindrome',
    index: '#07',
    difficulty: 'Easy',
    title: 'Reverse String & Palindrome Check',
    category: 'Foundations of Recursion',
    invariant: 'Boundary contraction: Recursively evaluate outside boundaries, then fold indices inwards.',
    descriptionText: 'Evaluate if a word reads the same forward and backward by checking boundary characters and folding inward recursively.',
    defaultInputs: { text: 'radar', mode: 'palindrome' },
    cppCode: `// Recursive Palindrome Verification
bool isPalindrome(string s, int l, int r) {
    if (l >= r) return true; // Base Case
    
    if (s[l] != s[r]) {
        return false; // Mismatch / Prune
    }
    
    return isPalindrome(s, l + 1, r - 1); // Shrink
}`,
    cppLineMap: {
      'base': 3,
      'mismatch': 5,
      'recurse': 9
    }
  },
  {
    id: 'tower_of_hanoi',
    index: '#08',
    difficulty: 'Medium',
    title: 'Tower of Hanoi',
    category: 'Foundations of Recursion',
    invariant: 'Divide and Conquer: Move N-1 disks to helper peg, transfer base disk, then move N-1 back.',
    descriptionText: 'The classic disk puzzle. Coordinate recursive peg shifting to complete moves in minimal steps.',
    defaultInputs: { disks: 3 },
    cppCode: `// Tower of Hanoi Solve
void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        moveDisk(from, to); // Base case: move 1 disk
        return;
    }
    hanoi(n - 1, from, aux, to);  // Move top n-1 to auxiliary
    moveDisk(from, to);          // Move bottom disk to destination
    hanoi(n - 1, aux, to, from);  // Move top n-1 to destination
}`,
    cppLineMap: {
      'base': 3,
      'step1': 7,
      'move': 8,
      'step2': 9
    }
  },

  // Subsets & Combinations (The "Pick or Skip" Pattern)
  {
    id: 'subsets_1',
    index: '#09',
    leetcode: 'LC #78',
    difficulty: 'Medium',
    title: 'Subsets I (Power Set)',
    category: 'Subsets & Combinations',
    invariant: 'Pick vs Skip choice branch: Select whether to append element to path or bypass it, generating 2^N combinations.',
    descriptionText: 'Find all unique subsets of an array of unique integers. Recursively choose to include or exclude each element.',
    defaultInputs: { nums: [1, 2, 3] },
    cppCode: `// Find all subsets using backtracking
void backtrack(vector<int>& nums, int i, vector<int>& curr, vector<vector<int>>& res) {
    if (i == nums.size()) {
        res.push_back(curr); // Found a subset
        return;
    }
    
    // Choice 1: Include nums[i]
    curr.push_back(nums[i]);
    backtrack(nums, i + 1, curr, res);
    curr.pop_back(); // Backtrack
    
    // Choice 2: Exclude nums[i]
    backtrack(nums, i + 1, curr, res);
}`,
    cppLineMap: {
      'base': 3,
      'pick_add': 9,
      'pick_recur': 10,
      'pick_pop': 11,
      'skip_recur': 14
    }
  },
  {
    id: 'subsets_2',
    index: '#10',
    leetcode: 'LC #90',
    difficulty: 'Medium',
    title: 'Subsets II (With Duplicates)',
    category: 'Subsets & Combinations',
    invariant: 'Sorting & skipping duplicates at matching layers prevents generating identical duplicate subset branches.',
    descriptionText: 'Generate subsets of array with duplicate entries. Sort and skip matching choices at same stack depth to prune.',
    defaultInputs: { nums: [1, 2, 2] },
    cppCode: `// Backtracking subsets with duplicates
void backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr); // Record current subset
    
    for (int i = start; i < nums.size(); i++) {
        // Skip duplicate numbers at the same recursion depth
        if (i > start && nums[i] == nums[i-1]) continue;
        
        curr.push_back(nums[i]); // Choose
        backtrack(nums, i + 1, curr, res); // Explore
        curr.pop_back(); // Un-choose / Backtrack
    }
}`,
    cppLineMap: {
      'add': 3,
      'loop': 5,
      'skip_dup': 7,
      'choose': 9,
      'explore': 10,
      'unchoose': 11
    }
  },
  {
    id: 'combination_sum_1',
    index: '#11',
    leetcode: 'LC #39',
    difficulty: 'Medium',
    title: 'Combination Sum I (Unbounded)',
    category: 'Subsets & Combinations',
    invariant: 'Unbounded inclusion: Re-use candidate values repeatedly until target sum becomes <= 0.',
    descriptionText: 'Locate unique combinations summing up to target with infinite re-use allowed for candidates.',
    defaultInputs: { candidates: [2, 3], target: 5 },
    cppCode: `// Unbounded combination sum
void backtrack(vector<int>& cand, int i, int target, vector<int>& curr, vector<vector<int>>& res) {
    if (target == 0) {
        res.push_back(curr); // Success
        return;
    }
    if (target < 0 || i == cand.size()) return; // Dead end / Prune
    
    // Option 1: Include candidate i (unbounded, can re-use)
    curr.push_back(cand[i]);
    backtrack(cand, i, target - cand[i], curr, res);
    curr.pop_back(); // Backtrack
    
    // Option 2: Exclude candidate i
    backtrack(cand, i + 1, target, curr, res);
}`,
    cppLineMap: {
      'success': 3,
      'fail': 7,
      'pick_add': 10,
      'pick_recur': 11,
      'pick_pop': 12,
      'skip_recur': 15
    }
  },
  {
    id: 'combination_sum_2',
    index: '#12',
    leetcode: 'LC #40',
    difficulty: 'Medium',
    title: 'Combination Sum II (Bounded & Unique)',
    category: 'Subsets & Combinations',
    invariant: 'Sorted Bounded elements: Choose each element once. Prune candidates exceeding target.',
    descriptionText: 'Find unique combinations where candidates sum up to target, using each input item once.',
    defaultInputs: { candidates: [2, 5, 2, 1, 2], target: 5 },
    cppCode: `// Bounded unique combination sum
void backtrack(vector<int>& cand, int start, int target, vector<int>& curr, vector<vector<int>>& res) {
    if (target == 0) {
        res.push_back(curr);
        return;
    }
    
    for (int i = start; i < cand.size(); i++) {
        if (cand[i] > target) break; // Optimization prune
        if (i > start && cand[i] == cand[i-1]) continue; // Deduplicate
        
        curr.push_back(cand[i]); // Choose
        backtrack(cand, i + 1, target - cand[i], curr, res); // Explore
        curr.pop_back(); // Unchoose
    }
}`,
    cppLineMap: {
      'success': 3,
      'loop': 8,
      'prune': 9,
      'dup': 10,
      'choose': 12,
      'explore': 13,
      'unchoose': 14
    }
  },
  {
    id: 'letter_combinations',
    index: '#13',
    leetcode: 'LC #17',
    difficulty: 'Medium',
    title: 'Letter Combinations of Phone Number',
    category: 'Subsets & Combinations',
    invariant: 'Digit Map Traversal: Branch through characters corresponding to digit keys recursively.',
    descriptionText: 'Generate keypad character configurations matching consecutive digits keys recursively.',
    defaultInputs: { digits: '23' },
    cppCode: `// Letter Combinations
void backtrack(string digits, int idx, string curr, vector<string>& res) {
    if (idx == digits.length()) {
        res.push_back(curr); // Leaf reached
        return;
    }
    
    string letters = phoneMap[digits[idx] - '0'];
    for (char c : letters) {
        backtrack(digits, idx + 1, curr + c, res); // Branch
    }
}`,
    cppLineMap: {
      'base': 3,
      'map': 8,
      'loop': 9,
      'recurse': 10
    }
  },

  // Permutations & Partitioning
  {
    id: 'permutations_1',
    index: '#14',
    leetcode: 'LC #46',
    difficulty: 'Medium',
    title: 'Permutations I (Unique Arrays)',
    category: 'Permutations & Partitioning',
    invariant: 'Factorial State Search: Recursively choose slots and track element usage in a lookup mask.',
    descriptionText: 'Form permutations of unique elements. Check state vectors to skip used values, exploring factorial combinations.',
    defaultInputs: { nums: [1, 2, 3] },
    cppCode: `// Permute using visited lookup
void backtrack(vector<int>& nums, vector<bool>& visited, vector<int>& curr, vector<vector<int>>& res) {
    if (curr.size() == nums.size()) {
        res.push_back(curr); // Solution found
        return;
    }
    
    for (int i = 0; i < nums.size(); i++) {
        if (visited[i]) continue; // Already used in this branch
        
        visited[i] = true; // Choose
        curr.push_back(nums[i]);
        
        backtrack(nums, visited, curr, res); // Explore
        
        curr.pop_back(); // Backtrack
        visited[i] = false;
    }
}`,
    cppLineMap: {
      'base': 3,
      'loop': 8,
      'check_used': 9,
      'choose': 11,
      'explore': 14,
      'unchoose': 16
    }
  },
  {
    id: 'permutations_2',
    index: '#15',
    leetcode: 'LC #47',
    difficulty: 'Medium',
    title: 'Permutations II (With Duplicates)',
    category: 'Permutations & Partitioning',
    invariant: 'Ordered tracking: Only pick duplicate values if the predecessor has been selected to enforce stability.',
    descriptionText: 'Form unique permutations containing duplicate items. Sort list and apply strict used order pruning.',
    defaultInputs: { nums: [1, 1, 2] },
    cppCode: `// Unique Permutations
void backtrack(vector<int>& nums, vector<bool>& visited, vector<int>& curr, vector<vector<int>>& res) {
    if (curr.size() == nums.size()) {
        res.push_back(curr);
        return;
    }
    for (int i = 0; i < nums.size(); i++) {
        if (visited[i]) continue;
        // Skip duplicate choices to prevent redundant trees
        if (i > 0 && nums[i] == nums[i-1] && !visited[i-1]) continue;
        
        visited[i] = true;
        curr.push_back(nums[i]);
        backtrack(nums, visited, curr, res);
        curr.pop_back();
        visited[i] = false;
    }
}`,
    cppLineMap: {
      'base': 3,
      'loop': 7,
      'visited': 8,
      'dup_prune': 10,
      'choose': 12,
      'explore': 14,
      'unchoose': 15
    }
  },
  {
    id: 'palindrome_partitioning',
    index: '#16',
    leetcode: 'LC #131',
    difficulty: 'Medium',
    title: 'Palindrome Partitioning',
    category: 'Permutations & Partitioning',
    invariant: 'Prefix slice verification: Validate prefix palndromes before recurring on suffix remainder.',
    descriptionText: 'Slice a word into substrings such that every sub-word is a palindrome. Prunes non-palindromic prefixes immediately.',
    defaultInputs: { text: 'aab' },
    cppCode: `// Palindrome Partitioning
void backtrack(string s, int start, vector<string>& curr, vector<vector<string>>& res) {
    if (start == s.length()) {
        res.push_back(curr);
        return;
    }
    for (int i = start; i < s.length(); i++) {
        if (isPalindrome(s, start, i)) { // Valid Prefix
            curr.push_back(s.substr(start, i - start + 1)); // Choose
            backtrack(s, i + 1, curr, res); // Explore remainder
            curr.pop_back(); // Backtrack
        }
    }
}`,
    cppLineMap: {
      'base': 3,
      'loop': 7,
      'check_pal': 8,
      'choose': 9,
      'explore': 10,
      'unchoose': 11
    }
  },

  // Hard Constraint Backtracking
  {
    id: 'n_queens',
    index: '#17',
    leetcode: 'LC #51',
    difficulty: 'Hard',
    title: 'N-Queens',
    category: 'Constraint Backtracking',
    invariant: 'Ray safety checks: Mark columns, positive and negative diagonals to verify safe coordinates.',
    descriptionText: 'Place N non-attacking Queens on an NxN board. Maintains col, positive and negative diagonal conflict matrices.',
    defaultInputs: { n: 4 },
    cppCode: `// N-Queens Backtracking Solver
void solve(int r, int n, vector<int>& queens, vector<vector<string>>& res) {
    if (r == n) {
        res.push_back(buildBoard(queens)); // Solution placed
        return;
    }
    for (int c = 0; c < n; c++) {
        // Safe checks: row r, col c
        if (cols[c] || diag1[r - c] || diag2[r + c]) continue;
        
        queens[r] = c; // Choose column
        cols[c] = diag1[r - c] = diag2[r + c] = true; // Mark blocked rays
        
        solve(r + 1, n, queens, res); // Recurse to next row
        
        cols[c] = diag1[r - c] = diag2[r + c] = false; // Backtrack / Rollback
    }
}`,
    cppLineMap: {
      'base': 3,
      'loop': 7,
      'conflict': 9,
      'choose': 11,
      'explore': 14,
      'unchoose': 16
    }
  },
  {
    id: 'sudoku_solver',
    index: '#18',
    leetcode: 'LC #37',
    difficulty: 'Hard',
    title: 'Sudoku Solver',
    category: 'Constraint Backtracking',
    invariant: 'Grid constraints verification: Try cell digits 1-4. Validate row, column and 2x2 subgrid uniqueness.',
    descriptionText: 'Fill a 4x4 Sudoku grid recursively. Explores digits from 1 to 4, backtracking if constraints are violated.',
    defaultInputs: { boardPreset: 'easy_3x3' },
    cppCode: `// Sudoku Solver recursive search
bool solve(vector<vector<char>>& board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == '.') { // Find empty
                for (char val = '1'; val <= '9'; val++) {
                    if (isValid(board, r, c, val)) {
                        board[r][c] = val; // Choose
                        if (solve(board)) return true; // Explore success
                        board[r][c] = '.'; // Unchoose / Rollback
                    }
                }
                return false; // Backtrack trigger
            }
        }
    }
    return true; // Solved
}`,
    cppLineMap: {
      'loops': 3,
      'empty': 5,
      'val_loop': 6,
      'check': 7,
      'choose': 8,
      'explore': 9,
      'unchoose': 10,
      'dead_end': 13,
      'solved': 17
    }
  },
  {
    id: 'word_search',
    index: '#19',
    leetcode: 'LC #79',
    difficulty: 'Medium',
    title: 'Word Search in 2D Grid',
    category: 'Constraint Backtracking',
    invariant: 'Adjacent Grid DFS: Scan top, down, left and right. Mark visited coordinates to block double matching.',
    descriptionText: 'Find target word on a character matrix. Traverses neighbors with recursive DFS and backtracks state.',
    defaultInputs: { gridPreset: 'simple', word: 'ABCCED' },
    cppCode: `// Word Search DFS with backtracking
bool dfs(vector<vector<char>>& board, string word, int idx, int r, int c) {
    if (idx == word.length()) return true; // Success
    
    // Bounds check and mismatch validation
    if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] != word[idx]) return false;
    
    char temp = board[r][c];
    board[r][c] = '#'; // Choose / Mark visited
    
    // Explore 4 directions
    bool found = dfs(board, word, idx + 1, r + 1, c) ||
                 dfs(board, word, idx + 1, r - 1, c) ||
                 dfs(board, word, idx + 1, r, c + 1) ||
                 dfs(board, word, idx + 1, r, c - 1);
                 
    board[r][c] = temp; // Un-choose / Restore state
    return found;
}`,
    cppLineMap: {
      'success': 3,
      'fail': 6,
      'mark': 9,
      'explore': 12,
      'restore': 17
    }
  },
  {
    id: 'rat_in_maze',
    index: '#20',
    difficulty: 'Medium',
    title: 'Rat in a Maze',
    category: 'Constraint Backtracking',
    invariant: 'Path Accumulator: Traverses open pathways towards target, unmarking visits on backtracking.',
    descriptionText: 'Find all matching routes for a rat to travel from source to target cheese inside an obstacle maze.',
    defaultInputs: { mazePreset: 'simple_maze' },
    cppCode: `// Find all paths from (0,0) to (N-1,N-1)
void solve(int r, int c, int n, vector<vector<int>>& maze, string path, vector<string>& res) {
    if (r == n - 1 && c == n - 1) {
        res.push_back(path); // Solved path
        return;
    }
    
    // 4 possible directions: Down, Left, Right, Up
    int dr[] = {1, 0, 0, -1};
    int dc[] = {0, -1, 1, 0};
    char dir[] = {'D', 'L', 'R', 'U'};
    
    maze[r][c] = 0; // Temporarily block as visited
    
    for (int i = 0; i < 4; i++) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nc >= 0 && nr < n && nc < n && maze[nr][nc] == 1) {
            solve(nr, nc, n, maze, path + dir[i], res); // Recurse
        }
    }
    
    maze[r][c] = 1; // Unblock / Backtrack
}`,
    cppLineMap: {
      'success': 3,
      'visit': 13,
      'loop': 15,
      'recurse': 18,
      'backtrack': 22
    }
  }
];
