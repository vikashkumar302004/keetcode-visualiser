import {
  ProblemId,
  SimulationStep,
  TreeNode,
  CallStackFrame,
  NodeState,
  HanoiState,
  ChessboardState,
  SudokuState,
  Grid2DState
} from '../types';

// Deep clone utility for safety (handles undefined, Set, objects, and arrays)
function clone<T>(obj: T): T {
  if (obj === undefined) return undefined as any;
  if (obj === null) return null as any;
  if (obj instanceof Set) {
    return new Set(obj) as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => clone(item)) as any;
  }
  if (typeof obj === 'object') {
    const clonedObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = clone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

export function generateSimulationSteps(
  problemId: ProblemId,
  inputs: Record<string, any>
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  
  // State accumulators
  let stepCounter = 0;
  let treeNodes: Record<string, TreeNode> = {};
  let callStack: CallStackFrame[] = [];
  let currentPath: string[] = [];
  let solutions: any[] = [];
  let nodeCount = 0;
  let maxDepthReached = 0;
  let validLeavesCount = 0;
  let prunedBranchesCount = 0;

  // Track the unique node generation
  function getNewNodeId(): string {
    nodeCount++;
    return `node_${nodeCount}`;
  }

  // Record a simulation step
  function recordStep(params: {
    activeNodeId: string | null;
    description: string;
    highlightedLine: number;
    choices: string[];
    boardState?: {
      hanoi?: HanoiState;
      queens?: ChessboardState;
      sudoku?: SudokuState;
      grid2d?: Grid2DState;
    };
  }) {
    // Collect active metrics
    const currentDepth = callStack.length;
    if (currentDepth > maxDepthReached) {
      maxDepthReached = currentDepth;
    }

    steps.push({
      stepIndex: stepCounter++,
      activeNodeId: params.activeNodeId,
      treeNodes: clone(treeNodes),
      callStack: clone(callStack),
      currentPath: clone(currentPath),
      solutions: clone(solutions),
      boardState: clone(params.boardState),
      description: params.description,
      highlightedLine: params.highlightedLine,
      metrics: {
        nodesVisited: nodeCount,
        maxDepth: maxDepthReached,
        validLeaves: validLeavesCount,
        prunedBranches: prunedBranchesCount,
      },
      choices: params.choices,
    });
  }

  // ==========================================
  // ALGORITHM 1: Factorial of N
  // ==========================================
  if (problemId === 'factorial') {
    const n = Number(inputs.n) || 4;

    function solveFact(val: number, parentId: string | null): number {
      const nodeId = getNewNodeId();
      const label = `fact(${val})`;
      
      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'factorial',
        params: { n: val },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Calling factorial(${val}). Checking if base case n <= 1 is met.`,
        highlightedLine: 3,
        choices: val > 1 ? [`factorial(${val - 1})`] : [],
      });

      if (val <= 1) {
        node.state = 'success';
        node.result = '1';
        validLeavesCount++;
        solutions.push(1);
        
        recordStep({
          activeNodeId: nodeId,
          description: `Base case reached! factorial(${val}) returns 1.`,
          highlightedLine: 3,
          choices: [],
        });
        
        callStack.pop();
        return 1;
      }

      // Recursive explore
      node.state = 'active';
      recordStep({
        activeNodeId: nodeId,
        description: `n = ${val} > 1. Recursing to compute factorial(${val - 1}).`,
        highlightedLine: 5,
        choices: [`factorial(${val - 1})`],
      });

      const subResult = solveFact(val - 1, nodeId);

      // Return Step
      const res = val * subResult;
      node.state = 'completed';
      node.result = String(res);
      solutions.push(res);
      
      recordStep({
        activeNodeId: nodeId,
        description: `factorial(${val - 1}) resolved to ${subResult}. Returning ${val} * ${subResult} = ${res}.`,
        highlightedLine: 5,
        choices: [],
      });

      callStack.pop();
      return res;
    }

    solveFact(n, null);
  }

  // ==========================================
  // ALGORITHM 2: Fibonacci Numbers
  // ==========================================
  else if (problemId === 'fibonacci') {
    const n = Number(inputs.n) || 4;

    function solveFib(val: number, parentId: string | null, branchChoice?: string): number {
      const nodeId = getNewNodeId();
      const label = `fib(${val})`;
      
      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: branchChoice,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'fib',
        params: { n: val },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Calling fib(${val}). Checking if base case n <= 1 is met.`,
        highlightedLine: 3,
        choices: val > 1 ? [`fib(${val - 1})`, `fib(${val - 2})`] : [],
      });

      if (val <= 1) {
        node.state = 'success';
        node.result = String(val);
        validLeavesCount++;
        solutions.push(val);

        recordStep({
          activeNodeId: nodeId,
          description: `Base case reached! fib(${val}) returns ${val}.`,
          highlightedLine: 3,
          choices: [],
        });

        callStack.pop();
        return val;
      }

      // Left branch
      recordStep({
        activeNodeId: nodeId,
        description: `fib(${val}) needs left branch. Recursing to fib(${val - 1}).`,
        highlightedLine: 5,
        choices: [`fib(${val - 1})`, `fib(${val - 2})`],
      });

      const leftRes = solveFib(val - 1, nodeId, `left (n-1)`);

      // Right branch
      treeNodes[nodeId].state = 'active'; // keep parent active
      recordStep({
        activeNodeId: nodeId,
        description: `Left branch fib(${val - 1}) returned ${leftRes}. Recursing to right branch fib(${val - 2}).`,
        highlightedLine: 6,
        choices: [`fib(${val - 2})`],
      });

      const rightRes = solveFib(val - 2, nodeId, `right (n-2)`);

      // Combine
      const total = leftRes + rightRes;
      node.state = 'completed';
      node.result = String(total);

      solutions.push(total);

      recordStep({
        activeNodeId: nodeId,
        description: `Both branches finished! fib(${val - 1}) = ${leftRes}, fib(${val - 2}) = ${rightRes}. Returning sum ${total}.`,
        highlightedLine: 8,
        choices: [],
      });

      callStack.pop();
      return total;
    }

    solveFib(n, null);
  }

  // ==========================================
  // ALGORITHM 3: Sum of First N Numbers
  // ==========================================
  else if (problemId === 'sum_n') {
    const n = Number(inputs.n) || 5;

    function solveSumN(val: number, parentId: string | null): number {
      const nodeId = getNewNodeId();
      const label = `sumN(${val})`;
      
      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'sumN',
        params: { n: val },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Calling sumN(${val}). Checking if base case n <= 0 is met.`,
        highlightedLine: 3,
        choices: val > 0 ? [`sumN(${val - 1})`] : [],
      });

      if (val <= 0) {
        node.state = 'success';
        node.result = '0';
        validLeavesCount++;
        solutions.push(0);

        recordStep({
          activeNodeId: nodeId,
          description: `Base case met! sumN(0) returns 0.`,
          highlightedLine: 3,
          choices: [],
        });

        callStack.pop();
        return 0;
      }

      recordStep({
        activeNodeId: nodeId,
        description: `n = ${val} > 0. Recursing to compute sumN(${val - 1}).`,
        highlightedLine: 5,
        choices: [`sumN(${val - 1})`],
      });

      const subSum = solveSumN(val - 1, nodeId);
      const total = val + subSum;
      
      node.state = 'completed';
      node.result = String(total);
      solutions.push(total);

      recordStep({
        activeNodeId: nodeId,
        description: `sumN(${val - 1}) returned ${subSum}. Accumulating ${val} + ${subSum} = ${total}.`,
        highlightedLine: 5,
        choices: [],
      });

      callStack.pop();
      return total;
    }

    solveSumN(n, null);
  }

  // ==========================================
  // ALGORITHM 4: Sum of Array Elements
  // ==========================================
  else if (problemId === 'array_sum') {
    const nums = inputs.nums || [1, 2, 3, 4];

    function solveArraySum(arr: number[], i: number, parentId: string | null): number {
      const nodeId = getNewNodeId();
      const label = `sumArr(i=${i})`;
      
      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'sumArray',
        params: { i, value: i < arr.length ? arr[i] : 'out_of_bounds' },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Evaluating array index pointer i=${i}. Checking if index equals array size ${arr.length}.`,
        highlightedLine: 3,
        choices: i < arr.length ? [`sumArray(arr, ${i + 1})`] : [],
      });

      if (i === arr.length) {
        node.state = 'success';
        node.result = '0';
        validLeavesCount++;
        solutions.push(0);

        recordStep({
          activeNodeId: nodeId,
          description: `Reached end of array index bounds (i=${i}). Base case returns 0.`,
          highlightedLine: 3,
          choices: [],
        });

        callStack.pop();
        return 0;
      }

      recordStep({
        activeNodeId: nodeId,
        description: `Index i=${i} is valid (value=${arr[i]}). Recursing to check index ${i + 1}.`,
        highlightedLine: 5,
        choices: [`sumArray(arr, ${i + 1})`],
      });

      const subSum = solveArraySum(arr, i + 1, nodeId);
      const total = arr[i] + subSum;

      node.state = 'completed';
      node.result = String(total);
      solutions.push(total);

      recordStep({
        activeNodeId: nodeId,
        description: `Sum of elements from index ${i+1} is ${subSum}. Returning arr[${i}] + ${subSum} = ${total}.`,
        highlightedLine: 5,
        choices: [],
      });

      callStack.pop();
      return total;
    }

    solveArraySum(nums, 0, null);
  }

  // ==========================================
  // ALGORITHM 5: Recursive Binary Search
  // ==========================================
  else if (problemId === 'binary_search') {
    const rawNums = inputs.nums || [1, 3, 5, 7, 9];
    const nums = [...rawNums].sort((a, b) => a - b);
    const target = Number(inputs.target) ?? 7;

    function solveBinarySearch(arr: number[], l: number, r: number, key: number, parentId: string | null): number {
      const nodeId = getNewNodeId();
      const label = `search([${l},${r}])`;
      
      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'binarySearch',
        params: { l, r, target: key, mid: l <= r ? Math.floor(l + (r - l) / 2) : -1 },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Checking binary search bounds: l=${l}, r=${r}.`,
        highlightedLine: 3,
        choices: l <= r ? [`Check mid index`] : [],
      });

      if (l > r) {
        node.state = 'fail';
        node.result = '-1';
        prunedBranchesCount++;

        recordStep({
          activeNodeId: nodeId,
          description: `Search pointers crossed (l=${l} > r=${r}). Target ${key} not present! Returning -1.`,
          highlightedLine: 3,
          choices: [],
        });

        callStack.pop();
        return -1;
      }

      const mid = Math.floor(l + (r - l) / 2);
      const midVal = arr[mid];

      recordStep({
        activeNodeId: nodeId,
        description: `Calculated pivot mid=${mid} (value=${midVal}). Comparing with target ${key}.`,
        highlightedLine: 5,
        choices: [],
      });

      if (midVal === key) {
        node.state = 'success';
        node.result = `index ${mid}`;
        validLeavesCount++;
        solutions.push(mid);

        recordStep({
          activeNodeId: nodeId,
          description: `Success! Median value arr[${mid}]=${midVal} matches target ${key}. Found index ${mid}!`,
          highlightedLine: 6,
          choices: [],
        });

        callStack.pop();
        return mid;
      }

      if (midVal > key) {
        recordStep({
          activeNodeId: nodeId,
          description: `Pivot val ${midVal} > target ${key}. Shrinking boundary right to search Left: [${l}, ${mid - 1}].`,
          highlightedLine: 9,
          choices: [`binarySearch(arr, ${l}, ${mid - 1}, ${key})`],
        });

        const res = solveBinarySearch(arr, l, mid - 1, key, nodeId);
        node.state = res !== -1 ? 'success' : 'fail';
        node.result = String(res);
        
        callStack.pop();
        return res;
      } else {
        recordStep({
          activeNodeId: nodeId,
          description: `Pivot val ${midVal} < target ${key}. Shrinking boundary left to search Right: [${mid + 1}, ${r}].`,
          highlightedLine: 11,
          choices: [`binarySearch(arr, ${mid + 1}, ${r}, ${key})`],
        });

        const res = solveBinarySearch(arr, mid + 1, r, key, nodeId);
        node.state = res !== -1 ? 'success' : 'fail';
        node.result = String(res);

        callStack.pop();
        return res;
      }
    }

    solveBinarySearch(nums, 0, nums.length - 1, target, null);
  }

  // ==========================================
  // ALGORITHM 2: Binary Exponentiation
  // ==========================================
  else if (problemId === 'binary_exponentiation') {
    const x = Number(inputs.x) ?? 2;
    const n = Number(inputs.n) ?? 5;

    function solvePow(baseX: number, powerN: number, parentId: string | null): number {
      const nodeId = getNewNodeId();
      const label = `pow(${baseX}, ${powerN})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'myPow',
        params: { x: baseX, n: powerN },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Calling myPow(${baseX}, ${powerN}). Checking power base cases.`,
        highlightedLine: 3,
        choices: powerN !== 0 ? [`myPow(${baseX}, ${Math.floor(powerN / 2)})`] : [],
      });

      if (powerN === 0) {
        node.state = 'success';
        node.result = '1';
        validLeavesCount++;
        recordStep({
          activeNodeId: nodeId,
          description: `Base case met: n == 0. Returning 1.0.`,
          highlightedLine: 3,
          choices: [],
        });
        callStack.pop();
        return 1;
      }

      if (powerN < 0) {
        recordStep({
          activeNodeId: nodeId,
          description: `Power is negative (${powerN}). Inverting and recursing on positive power.`,
          highlightedLine: 4,
          choices: [],
        });
        const posRes = solvePow(baseX, -powerN, nodeId);
        const invRes = 1 / posRes;
        node.state = 'completed';
        node.result = String(invRes);
        recordStep({
          activeNodeId: nodeId,
          description: `Resolved negative power. Returning 1 / ${posRes} = ${invRes}`,
          highlightedLine: 4,
          choices: [],
        });
        callStack.pop();
        return invRes;
      }

      const halfN = Math.floor(powerN / 2);
      recordStep({
        activeNodeId: nodeId,
        description: `Dividing power by 2: n/2 = ${halfN}. Calling recursively.`,
        highlightedLine: 6,
        choices: [`myPow(${baseX}, ${halfN})`],
      });

      const halfVal = solvePow(baseX, halfN, nodeId);

      let finalVal: number;
      let isEven = powerN % 2 === 0;
      if (isEven) {
        finalVal = halfVal * halfVal;
        node.state = 'completed';
        node.result = String(finalVal);
        recordStep({
          activeNodeId: nodeId,
          description: `Power ${powerN} is even. Square the half result: ${halfVal} * ${halfVal} = ${finalVal}.`,
          highlightedLine: 9,
          choices: [],
        });
      } else {
        finalVal = baseX * halfVal * halfVal;
        node.state = 'completed';
        node.result = String(finalVal);
        recordStep({
          activeNodeId: nodeId,
          description: `Power ${powerN} is odd. Multiply base by squared half: ${baseX} * ${halfVal} * ${halfVal} = ${finalVal}.`,
          highlightedLine: 11,
          choices: [],
        });
      }

      if (parentId === null) {
        solutions.push({ x: baseX, n: powerN, ans: finalVal });
      }

      callStack.pop();
      return finalVal;
    }

    solvePow(x, n, null);
  }

  // ==========================================
  // ALGORITHM 3: Reverse String & Palindrome Check
  // ==========================================
  else if (problemId === 'reverse_palindrome') {
    const text = inputs.text || 'radar';
    const mode = inputs.mode || 'palindrome';

    if (mode === 'palindrome') {
      function checkPal(s: string, l: number, r: number, parentId: string | null): boolean {
        const nodeId = getNewNodeId();
        const label = `isPal("${s}", ${l}, ${r})`;

        const node: TreeNode = {
          id: nodeId,
          label,
          parentId,
          state: 'active',
          depth: callStack.length,
        };
        treeNodes[nodeId] = node;

        const stackFrame: CallStackFrame = {
          id: nodeId,
          name: 'isPalindrome',
          params: { s, l, r },
          depth: callStack.length,
        };
        callStack.push(stackFrame);

        recordStep({
          activeNodeId: nodeId,
          description: `Calling isPalindrome on range [${l}, ${r}] of "${s}".`,
          highlightedLine: 3,
          choices: [],
        });

        if (l >= r) {
          node.state = 'success';
          node.result = 'true';
          validLeavesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `Pointers met or crossed (l=${l}, r=${r}). range is palindromic! Returning true.`,
            highlightedLine: 3,
            choices: [],
          });
          callStack.pop();
          return true;
        }

        const matches = s[l] === s[r];
        if (!matches) {
          node.state = 'fail';
          node.result = 'false';
          prunedBranchesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `Character mismatch at boundaries: s[${l}]='${s[l]}' != s[${r}]='${s[r]}'. Pruning branch! Returning false.`,
            highlightedLine: 5,
            choices: [],
          });
          callStack.pop();
          return false;
        }

        recordStep({
          activeNodeId: nodeId,
          description: `s[${l}]='${s[l]}' matches s[${r}]='${s[r]}'. Shrinking boundaries and recursing on [${l+1}, ${r-1}].`,
          highlightedLine: 9,
          choices: [`isPalindrome("${s}", ${l+1}, ${r-1})`],
        });

        const childRes = checkPal(s, l + 1, r - 1, nodeId);
        node.state = childRes ? 'success' : 'fail';
        node.result = String(childRes);

        recordStep({
          activeNodeId: nodeId,
          description: `Sub-boundary check completed with: ${childRes}. Returning ${childRes}.`,
          highlightedLine: 9,
          choices: [],
        });

        if (parentId === null) {
          solutions.push({ word: s, isPal: childRes });
        }

        callStack.pop();
        return childRes;
      }

      checkPal(text, 0, text.length - 1, null);
    } else {
      // Reverse String mode
      function reverseStr(s: string, idx: number, parentId: string | null): string {
        const nodeId = getNewNodeId();
        const label = `rev("${s}", ${idx})`;

        const node: TreeNode = {
          id: nodeId,
          label,
          parentId,
          state: 'active',
          depth: callStack.length,
        };
        treeNodes[nodeId] = node;

        const stackFrame: CallStackFrame = {
          id: nodeId,
          name: 'reverse',
          params: { s, idx },
          depth: callStack.length,
        };
        callStack.push(stackFrame);

        recordStep({
          activeNodeId: nodeId,
          description: `Calling reverse on index ${idx} of "${s}".`,
          highlightedLine: 3,
          choices: [],
        });

        if (idx >= s.length) {
          node.state = 'success';
          node.result = '""';
          validLeavesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `Reached end of string. Returning empty string base case.`,
            highlightedLine: 3,
            choices: [],
          });
          callStack.pop();
          return '';
        }

        recordStep({
          activeNodeId: nodeId,
          description: `Extracting s[${idx}]='${s[idx]}' and recursing to reverse remainder from ${idx + 1}.`,
          highlightedLine: 9,
          choices: [`rev("${s}", ${idx + 1})`],
        });

        const subRev = reverseStr(s, idx + 1, nodeId);
        const finalRev = subRev + s[idx];
        node.state = 'completed';
        node.result = `"${finalRev}"`;

        recordStep({
          activeNodeId: nodeId,
          description: `Appending s[${idx}]='${s[idx]}' to sub-reverse "${subRev}". Returning "${finalRev}".`,
          highlightedLine: 9,
          choices: [],
        });

        if (parentId === null) {
          solutions.push({ word: s, reversed: finalRev });
        }

        callStack.pop();
        return finalRev;
      }

      reverseStr(text, 0, null);
    }
  }

  // ==========================================
  // ALGORITHM 4: Tower of Hanoi
  // ==========================================
  else if (problemId === 'tower_of_hanoi') {
    const disks = Number(inputs.disks) || 3;
    
    // Setup initial peg arrays
    const hanoiBoard: HanoiState = {
      pegs: {
        A: Array.from({ length: disks }, (_, idx) => disks - idx), // bottom to top, e.g. [3, 2, 1]
        B: [],
        C: [],
      },
      moveCount: 0,
    };

    function runHanoi(n: number, from: 'A'|'B'|'C', to: 'A'|'B'|'C', aux: 'A'|'B'|'C', parentId: string | null) {
      const nodeId = getNewNodeId();
      const label = `hanoi(${n}, ${from}→${to})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'hanoi',
        params: { n, from, to, aux },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Running Hanoi(${n}) from Peg ${from} to Peg ${to} using ${aux}.`,
        highlightedLine: 3,
        choices: [],
        boardState: { hanoi: clone(hanoiBoard) },
      });

      if (n === 1) {
        // Move single disk
        const poppedDisk = hanoiBoard.pegs[from].pop();
        if (poppedDisk !== undefined) {
          hanoiBoard.pegs[to].push(poppedDisk);
        }
        hanoiBoard.moveCount++;
        node.state = 'success';
        node.result = `move ${from}→${to}`;
        validLeavesCount++;

        solutions.push(`Move disk from ${from} to ${to}`);

        recordStep({
          activeNodeId: nodeId,
          description: `Base case: Moved top disk ${poppedDisk} directly from Peg ${from} to Peg ${to}.`,
          highlightedLine: 3,
          choices: [],
          boardState: { hanoi: clone(hanoiBoard) },
        });

        callStack.pop();
        return;
      }

      // Step 1: Move top n-1 disks from source to aux
      recordStep({
        activeNodeId: nodeId,
        description: `Step 1: Move top ${n-1} disks from Peg ${from} to Peg ${aux} using Peg ${to}.`,
        highlightedLine: 7,
        choices: [`hanoi(${n-1}, ${from}→${aux})`],
        boardState: { hanoi: clone(hanoiBoard) },
      });

      runHanoi(n - 1, from, aux, to, nodeId);

      // Move the remaining bottom disk to destination
      treeNodes[nodeId].state = 'active'; // retain parent active
      const bottomDisk = hanoiBoard.pegs[from].pop();
      if (bottomDisk !== undefined) {
        hanoiBoard.pegs[to].push(bottomDisk);
      }
      hanoiBoard.moveCount++;
      solutions.push(`Move disk from ${from} to ${to}`);

      recordStep({
        activeNodeId: nodeId,
        description: `Move baseline disk ${bottomDisk} from Peg ${from} to Peg ${to}.`,
        highlightedLine: 8,
        choices: [],
        boardState: { hanoi: clone(hanoiBoard) },
      });

      // Step 2: Move top n-1 disks from aux to dest
      recordStep({
        activeNodeId: nodeId,
        description: `Step 2: Move top ${n-1} disks from auxiliary Peg ${aux} to target Peg ${to} using Peg ${from}.`,
        highlightedLine: 9,
        choices: [`hanoi(${n-1}, ${aux}→${to})`],
        boardState: { hanoi: clone(hanoiBoard) },
      });

      runHanoi(n - 1, aux, to, from, nodeId);

      node.state = 'completed';
      node.result = 'done';

      recordStep({
        activeNodeId: nodeId,
        description: `Hanoi(${n}) completed for pegs ${from} to ${to}.`,
        highlightedLine: 10,
        choices: [],
        boardState: { hanoi: clone(hanoiBoard) },
      });

      callStack.pop();
    }

    runHanoi(disks, 'A', 'C', 'B', null);
  }

  // ==========================================
  // ALGORITHM 5: Subsets I
  // ==========================================
  else if (problemId === 'subsets_1') {
    const nums = inputs.nums || [1, 2, 3];

    function runSubsets1(idx: number, parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `sub1(i=${idx})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { i: idx, curr: clone(currentPath) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Index i=${idx}. Checking if we reached elements boundary size=${nums.length}.`,
        highlightedLine: 3,
        choices: idx < nums.length ? [`Include ${nums[idx]}`, `Skip ${nums[idx]}`] : [],
      });

      if (idx === nums.length) {
        node.state = 'success';
        node.result = `[${currentPath.join(',')}]`;
        validLeavesCount++;
        solutions.push(clone(currentPath));

        recordStep({
          activeNodeId: nodeId,
          description: `Boundary index reached! Adding subset [${currentPath.join(', ')}] to results collection.`,
          highlightedLine: 4,
          choices: [],
        });

        callStack.pop();
        return;
      }

      const activeNum = nums[idx];

      // Choice 1: Include
      currentPath.push(String(activeNum));
      recordStep({
        activeNodeId: nodeId,
        description: `Choice: Include element ${activeNum}. Appending to workspace path. Recursing to index ${idx + 1}.`,
        highlightedLine: 9,
        choices: [`Include ${activeNum}`],
      });

      runSubsets1(idx + 1, nodeId, `Include ${activeNum}`);

      // Backtrack
      currentPath.pop();
      treeNodes[nodeId].state = 'backtracking';
      recordStep({
        activeNodeId: nodeId,
        description: `Backtracking: Removing (popping) ${activeNum} from workspace path. Restoring state.`,
        highlightedLine: 11,
        choices: [],
      });

      // Choice 2: Exclude
      treeNodes[nodeId].state = 'active';
      recordStep({
        activeNodeId: nodeId,
        description: `Choice: Skip / Exclude element ${activeNum}. Recursing directly to index ${idx + 1}.`,
        highlightedLine: 14,
        choices: [`Skip ${activeNum}`],
      });

      runSubsets1(idx + 1, nodeId, `Skip ${activeNum}`);

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Finished processing decisions for element ${activeNum} at index ${idx}. Returning.`,
        highlightedLine: 15,
        choices: [],
      });

      callStack.pop();
    }

    runSubsets1(0, null);
  }

  // ==========================================
  // ALGORITHM 6: Subsets II (With Duplicates)
  // ==========================================
  else if (problemId === 'subsets_2') {
    const rawNums = inputs.nums || [1, 2, 2];
    const nums = [...rawNums].sort((a, b) => a - b);

    function runSubsets2(start: number, parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `sub2(start=${start})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { start, curr: clone(currentPath) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      // Record current path as a valid subset immediately
      node.state = 'success';
      node.result = `[${currentPath.join(',')}]`;
      validLeavesCount++;
      solutions.push(clone(currentPath));

      recordStep({
        activeNodeId: nodeId,
        description: `Adding subset [${currentPath.join(', ')}] to result list. Iterating choices from start index ${start}.`,
        highlightedLine: 3,
        choices: Array.from({ length: nums.length - start }, (_, i) => `Choose ${nums[start + i]}`),
      });

      node.state = 'active';

      for (let i = start; i < nums.length; i++) {
        const val = nums[i];

        // Skip duplicates at the same level
        if (i > start && nums[i] === nums[i - 1]) {
          prunedBranchesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `i=${i}: nums[${i}] == nums[${i-1}] (${val} == ${nums[i-1]}). Skipping duplicate to prune redundant branch!`,
            highlightedLine: 7,
            choices: [],
          });
          continue;
        }

        currentPath.push(String(val));
        recordStep({
          activeNodeId: nodeId,
          description: `i=${i}: Choosing element ${val}. Recursing with next index start=${i + 1}.`,
          highlightedLine: 9,
          choices: [`Choose ${val}`],
        });

        runSubsets2(i + 1, nodeId, `Choose ${val}`);

        // Backtrack
        currentPath.pop();
        treeNodes[nodeId].state = 'backtracking';
        recordStep({
          activeNodeId: nodeId,
          description: `Backtracking: Popped ${val}. Restored state at index start=${start}.`,
          highlightedLine: 11,
          choices: [],
        });
        treeNodes[nodeId].state = 'active';
      }

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Exited loops for start=${start}. Returning to previous stack frame.`,
        highlightedLine: 13,
        choices: [],
      });

      callStack.pop();
    }

    runSubsets2(0, null);
  }

  // ==========================================
  // ALGORITHM 7: Combination Sum I
  // ==========================================
  else if (problemId === 'combination_sum_1') {
    const candidates = inputs.candidates || [2, 3];
    const target = Number(inputs.target) ?? 5;

    function runCombSum1(idx: number, remTarget: number, parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `comb1(i=${idx}, rem=${remTarget})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { i: idx, target: remTarget, curr: clone(currentPath) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Checking status at index i=${idx}, remaining target=${remTarget}.`,
        highlightedLine: 3,
        choices: remTarget > 0 && idx < candidates.length ? [`Pick ${candidates[idx]}`, `Skip ${candidates[idx]}`] : [],
      });

      if (remTarget === 0) {
        node.state = 'success';
        node.result = `[${currentPath.join(',')}]`;
        validLeavesCount++;
        solutions.push(clone(currentPath));

        recordStep({
          activeNodeId: nodeId,
          description: `Target hit (0)! Found combination: [${currentPath.join(', ')}].`,
          highlightedLine: 4,
          choices: [],
        });

        callStack.pop();
        return;
      }

      if (remTarget < 0 || idx === candidates.length) {
        node.state = 'fail';
        node.result = 'prune';
        prunedBranchesCount++;

        const reason = remTarget < 0 ? `Target exceeded (remTarget=${remTarget} < 0)` : 'Out of candidate index range';
        recordStep({
          activeNodeId: nodeId,
          description: `Pruning state: ${reason}. Dead end!`,
          highlightedLine: 7,
          choices: [],
        });

        callStack.pop();
        return;
      }

      const val = candidates[idx];

      // Option 1: Pick
      currentPath.push(String(val));
      recordStep({
        activeNodeId: nodeId,
        description: `Option 1: Pick ${val} and subtract from target. Remaining target = ${remTarget - val}. Re-using candidate index ${idx}.`,
        highlightedLine: 10,
        choices: [`Pick ${val}`],
      });

      runCombSum1(idx, remTarget - val, nodeId, `Pick ${val}`);

      // Backtrack
      currentPath.pop();
      treeNodes[nodeId].state = 'backtracking';
      recordStep({
        activeNodeId: nodeId,
        description: `Backtracking: Removed (popped) ${val} from accumulated path.`,
        highlightedLine: 12,
        choices: [],
      });

      // Option 2: Skip
      treeNodes[nodeId].state = 'active';
      recordStep({
        activeNodeId: nodeId,
        description: `Option 2: Skip candidate ${val}. Moving to index ${idx + 1} with current target = ${remTarget}.`,
        highlightedLine: 15,
        choices: [`Skip ${val}`],
      });

      runCombSum1(idx + 1, remTarget, nodeId, `Skip ${val}`);

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Completed options for index ${idx}. Popping call frame.`,
        highlightedLine: 16,
        choices: [],
      });

      callStack.pop();
    }

    runCombSum1(0, target, null);
  }

  // ==========================================
  // ALGORITHM 8: Combination Sum II
  // ==========================================
  else if (problemId === 'combination_sum_2') {
    const rawCand = inputs.candidates || [2, 5, 2, 1, 2];
    const candidates = [...rawCand].sort((a, b) => a - b);
    const target = Number(inputs.target) ?? 5;

    function runCombSum2(start: number, remTarget: number, parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `comb2(start=${start}, rem=${remTarget})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { start, target: remTarget, curr: clone(currentPath) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      if (remTarget === 0) {
        node.state = 'success';
        node.result = `[${currentPath.join(',')}]`;
        validLeavesCount++;
        solutions.push(clone(currentPath));

        recordStep({
          activeNodeId: nodeId,
          description: `Target matched! Adding combination [${currentPath.join(', ')}] to solutions list.`,
          highlightedLine: 3,
          choices: [],
        });

        callStack.pop();
        return;
      }

      recordStep({
        activeNodeId: nodeId,
        description: `Exploring from index start=${start}, remaining target=${remTarget}.`,
        highlightedLine: 8,
        choices: [],
      });

      for (let i = start; i < candidates.length; i++) {
        const val = candidates[i];

        if (val > remTarget) {
          prunedBranchesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `i=${i}: Candidate value ${val} is greater than remaining target ${remTarget}. Pruning current loop early!`,
            highlightedLine: 9,
            choices: [],
          });
          break; // Since sorted, subsequent items are also larger
        }

        if (i > start && candidates[i] === candidates[i - 1]) {
          prunedBranchesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `i=${i}: Skip duplicate candidate ${val} to avoid duplicate combination sets.`,
            highlightedLine: 10,
            choices: [],
          });
          continue;
        }

        currentPath.push(String(val));
        recordStep({
          activeNodeId: nodeId,
          description: `i=${i}: Choosing ${val}. Recursing on index start=${i + 1} with remainder target=${remTarget - val}.`,
          highlightedLine: 12,
          choices: [`Choose ${val}`],
        });

        runCombSum2(i + 1, remTarget - val, nodeId, `Choose ${val}`);

        currentPath.pop();
        treeNodes[nodeId].state = 'backtracking';
        recordStep({
          activeNodeId: nodeId,
          description: `Backtracking: Removed (popped) ${val} from workspace path.`,
          highlightedLine: 14,
          choices: [],
        });
        treeNodes[nodeId].state = 'active';
      }

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Exited exploration loop at index start=${start}. Returning.`,
        highlightedLine: 15,
        choices: [],
      });

      callStack.pop();
    }

    runCombSum2(0, target, null);
  }

  // ==========================================
  // ALGORITHM 9: Letter Combinations of Phone Number
  // ==========================================
  else if (problemId === 'letter_combinations') {
    const digits = inputs.digits || '23';
    const phoneMap: Record<string, string> = {
      '2': 'abc',
      '3': 'def',
      '4': 'ghi',
      '5': 'jkl',
      '6': 'mno',
      '7': 'pqrs',
      '8': 'tuv',
      '9': 'wxyz',
    };

    function runLetters(idx: number, parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `letter(idx=${idx})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { idx, current_word: currentPath.join('') },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Checking index idx=${idx} of digits "${digits}".`,
        highlightedLine: 3,
        choices: [],
      });

      if (idx === digits.length) {
        const word = currentPath.join('');
        node.state = 'success';
        node.result = `"${word}"`;
        validLeavesCount++;
        solutions.push(word);

        recordStep({
          activeNodeId: nodeId,
          description: `Formed complete combinations: "${word}". Appending to results list.`,
          highlightedLine: 4,
          choices: [],
        });

        callStack.pop();
        return;
      }

      const currentDigit = digits[idx];
      const letters = phoneMap[currentDigit] || '';

      recordStep({
        activeNodeId: nodeId,
        description: `Digit '${currentDigit}' maps to letters "${letters}". Launching branches.`,
        highlightedLine: 8,
        choices: letters.split('').map(c => `Branch '${c}'`),
      });

      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        currentPath.push(letter);
        recordStep({
          activeNodeId: nodeId,
          description: `Choice: branch on character '${letter}'. Progressing to next digit index ${idx + 1}.`,
          highlightedLine: 10,
          choices: [`Branch '${letter}'`],
        });

        runLetters(idx + 1, nodeId, `+ '${letter}'`);

        currentPath.pop();
        treeNodes[nodeId].state = 'backtracking';
        recordStep({
          activeNodeId: nodeId,
          description: `Backtracking: Popped letter '${letter}'. Returning back to level idx=${idx}.`,
          highlightedLine: 10,
          choices: [],
        });
        treeNodes[nodeId].state = 'active';
      }

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Completed letter loops for digit '${currentDigit}'. Returning.`,
        highlightedLine: 11,
        choices: [],
      });

      callStack.pop();
    }

    if (digits.length > 0) {
      runLetters(0, null);
    }
  }

  // ==========================================
  // ALGORITHM 10: Permutations I
  // ==========================================
  else if (problemId === 'permutations_1') {
    const nums = inputs.nums || [1, 2, 3];
    const visited = Array(nums.length).fill(false);

    function runPerms1(parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `perm1(sz=${currentPath.length})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { curr: clone(currentPath), visited: clone(visited) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Current size is ${currentPath.length}. Checking if permutation is fully formed.`,
        highlightedLine: 3,
        choices: [],
      });

      if (currentPath.length === nums.length) {
        node.state = 'success';
        node.result = `[${currentPath.join(',')}]`;
        validLeavesCount++;
        solutions.push(clone(currentPath));

        recordStep({
          activeNodeId: nodeId,
          description: `Permutation matches size! Adding [${currentPath.join(', ')}] to output.`,
          highlightedLine: 4,
          choices: [],
        });

        callStack.pop();
        return;
      }

      recordStep({
        activeNodeId: nodeId,
        description: `Scanning available elements to choose from.`,
        highlightedLine: 8,
        choices: nums.map((v: number, i: number) => visited[i] ? `Used: ${v}` : `Unused: ${v}`),
      });

      for (let i = 0; i < nums.length; i++) {
        if (visited[i]) {
          recordStep({
            activeNodeId: nodeId,
            description: `Index ${i} (${nums[i]}) is already visited/used in current path. Skipping.`,
            highlightedLine: 9,
            choices: [],
          });
          continue;
        }

        visited[i] = true;
        currentPath.push(String(nums[i]));

        recordStep({
          activeNodeId: nodeId,
          description: `Choosing unused element ${nums[i]}. Marking as visited and recursing to depth ${currentPath.length}.`,
          highlightedLine: 11,
          choices: [`Choose ${nums[i]}`],
        });

        runPerms1(nodeId, `Choose ${nums[i]}`);

        // Backtrack
        currentPath.pop();
        visited[i] = false;
        treeNodes[nodeId].state = 'backtracking';

        recordStep({
          activeNodeId: nodeId,
          description: `Backtracking: Restored state, popped element ${nums[i]} and unmarked index ${i} as unvisited.`,
          highlightedLine: 16,
          choices: [],
        });
        treeNodes[nodeId].state = 'active';
      }

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Finished looping at size=${currentPath.length}. Popping function frame.`,
        highlightedLine: 18,
        choices: [],
      });

      callStack.pop();
    }

    runPerms1(null);
  }

  // ==========================================
  // ALGORITHM 11: Permutations II (Duplicates)
  // ==========================================
  else if (problemId === 'permutations_2') {
    const rawNums = inputs.nums || [1, 1, 2];
    const nums = [...rawNums].sort((a, b) => a - b);
    const visited = Array(nums.length).fill(false);

    function runPerms2(parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `perm2(sz=${currentPath.length})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { curr: clone(currentPath), visited: clone(visited) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      if (currentPath.length === nums.length) {
        node.state = 'success';
        node.result = `[${currentPath.join(',')}]`;
        validLeavesCount++;
        solutions.push(clone(currentPath));

        recordStep({
          activeNodeId: nodeId,
          description: `Unique permutation formed! Adding [${currentPath.join(', ')}] to result solutions list.`,
          highlightedLine: 3,
          choices: [],
        });

        callStack.pop();
        return;
      }

      recordStep({
        activeNodeId: nodeId,
        description: `Scanning index list with duplication constraints checking.`,
        highlightedLine: 7,
        choices: [],
      });

      for (let i = 0; i < nums.length; i++) {
        if (visited[i]) continue;

        // Skip duplicates
        if (i > 0 && nums[i] === nums[i - 1] && !visited[i - 1]) {
          prunedBranchesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `i=${i}: Element ${nums[i]} matches predecessor ${nums[i-1]} which is unvisited. Pruning to maintain stability!`,
            highlightedLine: 10,
            choices: [],
          });
          continue;
        }

        visited[i] = true;
        currentPath.push(String(nums[i]));

        recordStep({
          activeNodeId: nodeId,
          description: `Choosing duplicate-safe element ${nums[i]} at index ${i}. Recursing.`,
          highlightedLine: 12,
          choices: [`Choose ${nums[i]}`],
        });

        runPerms2(nodeId, `Choose ${nums[i]}`);

        currentPath.pop();
        visited[i] = false;
        treeNodes[nodeId].state = 'backtracking';

        recordStep({
          activeNodeId: nodeId,
          description: `Backtrack: Restored state. Popped element ${nums[i]} from path.`,
          highlightedLine: 15,
          choices: [],
        });
        treeNodes[nodeId].state = 'active';
      }

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Returning from PermuteII frame.`,
        highlightedLine: 17,
        choices: [],
      });

      callStack.pop();
    }

    runPerms2(null);
  }

  // ==========================================
  // ALGORITHM 12: Palindrome Partitioning
  // ==========================================
  else if (problemId === 'palindrome_partitioning') {
    const s = inputs.text || 'aab';

    function isPalCheck(str: string, l: number, r: number): boolean {
      while (l < r) {
        if (str[l] !== str[r]) return false;
        l++;
        r--;
      }
      return true;
    }

    function runPalPart(start: number, parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `part(start=${start})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'backtrack',
        params: { start, path: clone(currentPath) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Index start=${start}. Checking if string partition cuts are complete.`,
        highlightedLine: 3,
        choices: [],
      });

      if (start === s.length) {
        node.state = 'success';
        node.result = `[${currentPath.join('|')}]`;
        validLeavesCount++;
        solutions.push(clone(currentPath));

        recordStep({
          activeNodeId: nodeId,
          description: `Matched partitions! Adding layout [${currentPath.join(' | ')}] to outcomes list.`,
          highlightedLine: 4,
          choices: [],
        });

        callStack.pop();
        return;
      }

      for (let i = start; i < s.length; i++) {
        const prefix = s.substring(start, i + 1);
        const valid = isPalCheck(s, start, i);

        if (valid) {
          currentPath.push(prefix);
          recordStep({
            activeNodeId: nodeId,
            description: `i=${i}: Cut prefix "${prefix}" is palindrome. Appending and exploring remainder from index ${i + 1}.`,
            highlightedLine: 9,
            choices: [`Keep Cut: "${prefix}"`],
          });

          runPalPart(i + 1, nodeId, `Cut: "${prefix}"`);

          currentPath.pop();
          treeNodes[nodeId].state = 'backtracking';
          recordStep({
            activeNodeId: nodeId,
            description: `Backtracking: Restoring after prefix cut "${prefix}". Popping partition frame.`,
            highlightedLine: 11,
            choices: [],
          });
          treeNodes[nodeId].state = 'active';
        } else {
          prunedBranchesCount++;
          recordStep({
            activeNodeId: nodeId,
            description: `i=${i}: Cut prefix "${prefix}" is NOT palindrome. Pruning branch early!`,
            highlightedLine: 8,
            choices: [],
          });
        }
      }

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Finished cut scans for start=${start}. Returning.`,
        highlightedLine: 13,
        choices: [],
      });

      callStack.pop();
    }

    runPalPart(0, null);
  }

  // ==========================================
  // ALGORITHM 13: N-Queens
  // ==========================================
  else if (problemId === 'n_queens') {
    const size = Number(inputs.n) || 4;

    const queensBoard: ChessboardState = {
      size,
      queens: [],
      conflicts: {
        rows: new Set(),
        cols: new Set(),
        diag1: new Set(),
        diag2: new Set(),
      },
    };

    function runNQueens(row: number, parentId: string | null, choiceLabel?: string) {
      const nodeId = getNewNodeId();
      const label = `queens(r=${row})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
        choice: choiceLabel,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'solve',
        params: { r: row, n: size, activeQueens: queensBoard.queens.map(q => `(${q.row},${q.col})`) },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      recordStep({
        activeNodeId: nodeId,
        description: `Row r=${row}. Checking if all rows are safely filled.`,
        highlightedLine: 3,
        choices: [],
        boardState: { queens: clone(queensBoard) },
      });

      if (row === size) {
        node.state = 'success';
        node.result = 'solved';
        validLeavesCount++;
        
        // Push board snapshot layout into solutions
        const boardMatrix = Array.from({ length: size }, () => Array(size).fill('.'));
        queensBoard.queens.forEach(q => {
          boardMatrix[q.row][q.col] = 'Q';
        });
        solutions.push(boardMatrix);

        recordStep({
          activeNodeId: nodeId,
          description: `All ${size} rows successfully configured! Adding solved board layout to solutions grid.`,
          highlightedLine: 4,
          choices: [],
          boardState: { queens: clone(queensBoard) },
        });

        callStack.pop();
        return;
      }

      for (let col = 0; col < size; col++) {
        const d1 = row - col;
        const d2 = row + col;

        const hasColConflict = queensBoard.conflicts.cols.has(col);
        const hasDiag1Conflict = queensBoard.conflicts.diag1.has(d1);
        const hasDiag2Conflict = queensBoard.conflicts.diag2.has(d2);

        queensBoard.trialCell = { row, col, valid: !(hasColConflict || hasDiag1Conflict || hasDiag2Conflict) };

        if (hasColConflict || hasDiag1Conflict || hasDiag2Conflict) {
          prunedBranchesCount++;
          
          let conflictMsg = '';
          if (hasColConflict) conflictMsg += `Col ${col} blocked. `;
          if (hasDiag1Conflict) conflictMsg += `Diag \\ (diff=${d1}) blocked. `;
          if (hasDiag2Conflict) conflictMsg += `Diag / (sum=${d2}) blocked. `;

          recordStep({
            activeNodeId: nodeId,
            description: `Trial placement (row=${row}, col=${col}) has conflict: ${conflictMsg} Skipping cell!`,
            highlightedLine: 9,
            choices: [],
            boardState: { queens: clone(queensBoard) },
          });
          continue;
        }

        // Safe to place
        queensBoard.queens.push({ row, col });
        queensBoard.conflicts.cols.add(col);
        queensBoard.conflicts.diag1.add(d1);
        queensBoard.conflicts.diag2.add(d2);
        queensBoard.trialCell = undefined;

        recordStep({
          activeNodeId: nodeId,
          description: `Success: Placing Queen at cell (${row}, ${col}). Setting blocked ray conflicts and progressing to Row ${row + 1}.`,
          highlightedLine: 11,
          choices: [`Place Queen (${row}, ${col})`],
          boardState: { queens: clone(queensBoard) },
        });

        runNQueens(row + 1, nodeId, `Queen (${row},${col})`);

        // Backtrack / Rollback
        queensBoard.queens.pop();
        queensBoard.conflicts.cols.delete(col);
        queensBoard.conflicts.diag1.delete(d1);
        queensBoard.conflicts.diag2.delete(d2);
        queensBoard.trialCell = { row, col, valid: false };

        treeNodes[nodeId].state = 'backtracking';
        recordStep({
          activeNodeId: nodeId,
          description: `Backtracking: Removing Queen from (${row}, ${col}). Erasing marked conflict rays.`,
          highlightedLine: 16,
          choices: [],
          boardState: { queens: clone(queensBoard) },
        });
        treeNodes[nodeId].state = 'active';
        queensBoard.trialCell = undefined;
      }

      node.state = 'completed';
      recordStep({
        activeNodeId: nodeId,
        description: `Exited column scanner for Row ${row}. Backtracking to previous row.`,
        highlightedLine: 17,
        choices: [],
        boardState: { queens: clone(queensBoard) },
      });

      callStack.pop();
    }

    runNQueens(0, null);
  }

  // ==========================================
  // ALGORITHM 14: Sudoku Solver
  // ==========================================
  else if (problemId === 'sudoku_solver') {
    // Elegant 4x4 or small pre-defined solver so it fits within step budgets easily
    const initialGrid = [
      [1, 0, 3, 0],
      [0, 0, 0, 2],
      [3, 0, 0, 0],
      [0, 1, 0, 3]
    ];
    
    const sudokuBoard: SudokuState = {
      grid: clone(initialGrid),
      original: initialGrid.map(row => row.map(v => v !== 0)),
    };

    function isValid(grid: number[][], r: number, c: number, val: number): boolean {
      // Check row & col
      for (let i = 0; i < 4; i++) {
        if (grid[r][i] === val && i !== c) return false;
        if (grid[i][c] === val && i !== r) return false;
      }
      // Check 2x2 box
      const boxRow = Math.floor(r / 2) * 2;
      const boxCol = Math.floor(c / 2) * 2;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          if (grid[boxRow + i][boxCol + j] === val && (boxRow + i !== r || boxCol + j !== c)) {
            return false;
          }
        }
      }
      return true;
    }

    let searchSteps = 0;
    
    function solveSudoku(parentId: string | null): boolean {
      if (searchSteps > 60) return false; // Safety stop for speed/size

      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (sudokuBoard.grid[r][c] === 0) {
            
            const nodeId = getNewNodeId();
            const label = `sudoku(${r},${c})`;

            const node: TreeNode = {
              id: nodeId,
              label,
              parentId,
              state: 'active',
              depth: callStack.length,
            };
            treeNodes[nodeId] = node;

            const stackFrame: CallStackFrame = {
              id: nodeId,
              name: 'solve',
              params: { cell: `(${r},${c})` },
              depth: callStack.length,
            };
            callStack.push(stackFrame);

            recordStep({
              activeNodeId: nodeId,
              description: `Found empty cell at (${r}, ${c}). Trial digits 1 to 4.`,
              highlightedLine: 5,
              choices: ['1', '2', '3', '4'],
              boardState: { sudoku: clone(sudokuBoard) },
            });

            for (let val = 1; val <= 4; val++) {
              searchSteps++;
              const safe = isValid(sudokuBoard.grid, r, c, val);
              
              if (safe) {
                sudokuBoard.grid[r][c] = val;
                sudokuBoard.conflictCell = null;

                recordStep({
                  activeNodeId: nodeId,
                  description: `Digit ${val} is valid at cell (${r}, ${c}). Placing and recursing to solve remainder.`,
                  highlightedLine: 8,
                  choices: [`Try ${val}`],
                  boardState: { sudoku: clone(sudokuBoard) },
                });

                const isSolved = solveSudoku(nodeId);
                if (isSolved) {
                  node.state = 'success';
                  node.result = String(val);
                  validLeavesCount++;
                  
                  solutions.push(clone(sudokuBoard.grid));
                  
                  recordStep({
                    activeNodeId: nodeId,
                    description: `Success! Board resolved. Bubble back.`,
                    highlightedLine: 9,
                    choices: [],
                    boardState: { sudoku: clone(sudokuBoard) },
                  });

                  callStack.pop();
                  return true;
                }

                // Rollback
                sudokuBoard.grid[r][c] = 0;
                treeNodes[nodeId].state = 'backtracking';
                recordStep({
                  activeNodeId: nodeId,
                  description: `Branch failed! Backtracking: Resetting cell (${r}, ${c}) to 0.`,
                  highlightedLine: 10,
                  choices: [],
                  boardState: { sudoku: clone(sudokuBoard) },
                });
                treeNodes[nodeId].state = 'active';

              } else {
                prunedBranchesCount++;
                sudokuBoard.conflictCell = { row: r, col: c };
                recordStep({
                  activeNodeId: nodeId,
                  description: `Pruning trial digit ${val} at cell (${r}, ${c}): Causes box, row, or column overlap.`,
                  highlightedLine: 7,
                  choices: [],
                  boardState: { sudoku: clone(sudokuBoard) },
                });
              }
            }

            sudokuBoard.conflictCell = null;
            node.state = 'fail';
            node.result = 'fail';
            recordStep({
              activeNodeId: nodeId,
              description: `No choices 1-4 valid at cell (${r}, ${c}). Triggering backtrack!`,
              highlightedLine: 13,
              choices: [],
              boardState: { sudoku: clone(sudokuBoard) },
            });

            callStack.pop();
            return false;
          }
        }
      }

      // If no cell is empty
      solutions.push(clone(sudokuBoard.grid));
      return true;
    }

    solveSudoku(null);
  }

  // ==========================================
  // ALGORITHM 15: Word Search
  // ==========================================
  else if (problemId === 'word_search') {
    const word = inputs.word || 'ABCCED';
    const grid = [
      ['A', 'B', 'C', 'E'],
      ['S', 'F', 'C', 'S'],
      ['A', 'D', 'E', 'E']
    ];

    const gridState: Grid2DState = {
      grid: clone(grid),
      rows: 3,
      cols: 4,
      path: [],
      visited: Array.from({ length: 3 }, () => Array(4).fill(false)),
      word,
      wordIndex: 0,
    };

    function runWordSearch() {
      let solved = false;

      function dfs(r: number, c: number, wIdx: number, parentId: string | null): boolean {
        if (solved) return true;

        const nodeId = getNewNodeId();
        const label = `dfs(r=${r},c=${c},i=${wIdx})`;

        const node: TreeNode = {
          id: nodeId,
          label,
          parentId,
          state: 'active',
          depth: callStack.length,
        };
        treeNodes[nodeId] = node;

        const stackFrame: CallStackFrame = {
          id: nodeId,
          name: 'dfs',
          params: { r, c, idx: wIdx, char: word[wIdx] },
          depth: callStack.length,
        };
        callStack.push(stackFrame);

        gridState.wordIndex = wIdx;
        gridState.path.push([r, c]);

        recordStep({
          activeNodeId: nodeId,
          description: `Checking node at position (${r}, ${c}). Target character index is word[${wIdx}]='${word[wIdx]}'.`,
          highlightedLine: 3,
          choices: [],
          boardState: { grid2d: clone(gridState) },
        });

        if (wIdx === word.length - 1) {
          solved = true;
          node.state = 'success';
          node.result = 'found';
          validLeavesCount++;
          
          solutions.push(clone(gridState.path));

          recordStep({
            activeNodeId: nodeId,
            description: `Full word match found! Successfully aligned path to "${word}".`,
            highlightedLine: 3,
            choices: [],
            boardState: { grid2d: clone(gridState) },
          });

          callStack.pop();
          return true;
        }

        // Mark temporary as visited
        const charTemp = gridState.grid[r][c];
        gridState.grid[r][c] = '#';
        gridState.visited[r][c] = true;

        const dR = [1, -1, 0, 0];
        const dC = [0, 0, 1, -1];
        const directions = ['Down', 'Up', 'Right', 'Left'];

        let matchFound = false;

        for (let i = 0; i < 4; i++) {
          const nR = r + dR[i];
          const nC = c + dC[i];

          const isInside = nR >= 0 && nR < 3 && nC >= 0 && nC < 4;
          const targetChar = word[wIdx + 1];
          const isMatch = isInside && gridState.grid[nR][nC] === targetChar;

          if (isInside && isMatch) {
            recordStep({
              activeNodeId: nodeId,
              description: `Direction ${directions[i]}: Found next character '${targetChar}' at (${nR}, ${nC}). Recursing.`,
              highlightedLine: 12,
              choices: [directions[i]],
              boardState: { grid2d: clone(gridState) },
            });

            if (dfs(nR, nC, wIdx + 1, nodeId)) {
              matchFound = true;
              break;
            }
          } else {
            prunedBranchesCount++;
            if (isInside) {
              recordStep({
                activeNodeId: nodeId,
                description: `Direction ${directions[i]} to (${nR}, ${nC}) character '${gridState.grid[nR][nC]}' does not match next target character '${targetChar}'. Pruning.`,
                highlightedLine: 6,
                choices: [],
                boardState: { grid2d: clone(gridState) },
              });
            }
          }
        }

        // Backtrack Restore
        gridState.grid[r][c] = charTemp;
        gridState.visited[r][c] = false;
        gridState.path.pop();

        if (!matchFound) {
          node.state = 'fail';
          node.result = 'fail';
          treeNodes[nodeId].state = 'backtracking';

          recordStep({
            activeNodeId: nodeId,
            description: `No neighboring matching cells found from (${r}, ${c}). Restoring character state to '${charTemp}'.`,
            highlightedLine: 17,
            choices: [],
            boardState: { grid2d: clone(gridState) },
          });
          treeNodes[nodeId].state = 'active';
        } else {
          node.state = 'completed';
        }

        callStack.pop();
        return matchFound;
      }

      // Start word search from the first cell that matches word[0]
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === word[0]) {
            if (dfs(r, c, 0, null)) {
              return;
            }
          }
        }
      }
    }

    runWordSearch();
  }

  // ==========================================
  // ALGORITHM 16: Rat in a Maze
  // ==========================================
  else if (problemId === 'rat_in_maze') {
    const maze = [
      [1, 0, 0, 0],
      [1, 1, 0, 1],
      [0, 1, 0, 0],
      [1, 1, 1, 1]
    ];

    const gridState: Grid2DState = {
      grid: maze.map(row => row.map(v => v === 1 ? ' ' : '█')),
      rows: 4,
      cols: 4,
      path: [],
      visited: Array.from({ length: 4 }, () => Array(4).fill(false)),
      targetX: 3,
      targetY: 3,
    };

    function solveMaze(r: number, c: number, pathStr: string, parentId: string | null) {
      const nodeId = getNewNodeId();
      const label = `rat(${r},${c})`;

      const node: TreeNode = {
        id: nodeId,
        label,
        parentId,
        state: 'active',
        depth: callStack.length,
      };
      treeNodes[nodeId] = node;

      const stackFrame: CallStackFrame = {
        id: nodeId,
        name: 'solve',
        params: { r, c, path: pathStr },
        depth: callStack.length,
      };
      callStack.push(stackFrame);

      gridState.path.push([r, c]);
      gridState.visited[r][c] = true;

      recordStep({
        activeNodeId: nodeId,
        description: `Rat entered position (${r}, ${c}). Checking if we reached destination (3,3).`,
        highlightedLine: 3,
        choices: [],
        boardState: { grid2d: clone(gridState) },
      });

      if (r === 3 && c === 3) {
        node.state = 'success';
        node.result = `"${pathStr}"`;
        validLeavesCount++;
        solutions.push(pathStr);

        recordStep({
          activeNodeId: nodeId,
          description: `Target hit! Found a valid escape path sequence: "${pathStr}".`,
          highlightedLine: 4,
          choices: [],
          boardState: { grid2d: clone(gridState) },
        });

        gridState.visited[r][c] = false;
        gridState.path.pop();
        callStack.pop();
        return;
      }

      // Temporary block cell
      gridState.grid[r][c] = '●'; // visually mark rat trace path

      const dR = [1, 0, 0, -1];
      const dC = [0, -1, 1, 0];
      const dirChars = ['D', 'L', 'R', 'U'];
      const dirNames = ['Down', 'Left', 'Right', 'Up'];

      recordStep({
        activeNodeId: nodeId,
        description: `Scanning 4 possible directions (Down, Left, Right, Up) from cell (${r}, ${c}).`,
        highlightedLine: 13,
        choices: dirNames,
        boardState: { grid2d: clone(gridState) },
      });

      for (let i = 0; i < 4; i++) {
        const nR = r + dR[i];
        const nC = c + dC[i];

        const isInside = nR >= 0 && nR < 4 && nC >= 0 && nC < 4;
        const isFree = isInside && maze[nR][nC] === 1 && !gridState.visited[nR][nC];

        if (isFree) {
          recordStep({
            activeNodeId: nodeId,
            description: `Direction ${dirNames[i]}: Neighbor (${nR}, ${nC}) is free and unvisited. Moving rat in that direction.`,
            highlightedLine: 18,
            choices: [dirNames[i]],
            boardState: { grid2d: clone(gridState) },
          });

          solveMaze(nR, nC, pathStr + dirChars[i], nodeId);
          treeNodes[nodeId].state = 'active'; // keep parent node active
        } else if (isInside) {
          prunedBranchesCount++;
          const reason = maze[nR][nC] === 0 ? 'cell is blocked (wall)' : 'already visited';
          recordStep({
            activeNodeId: nodeId,
            description: `Direction ${dirNames[i]} to (${nR}, ${nC}) is invalid because the ${reason}. Pruning.`,
            highlightedLine: 15,
            choices: [],
            boardState: { grid2d: clone(gridState) },
          });
        }
      }

      // Backtrack
      gridState.grid[r][c] = ' ';
      gridState.visited[r][c] = false;
      gridState.path.pop();
      node.state = 'completed';

      treeNodes[nodeId].state = 'backtracking';
      recordStep({
        activeNodeId: nodeId,
        description: `Backtracking from (${r}, ${c}). Unmarking cell visit and restoring maze pathway.`,
        highlightedLine: 22,
        choices: [],
        boardState: { grid2d: clone(gridState) },
      });
      treeNodes[nodeId].state = 'active';

      callStack.pop();
    }

    solveMaze(0, 0, '', null);
  }

  return steps;
}
