import { SimulationStep } from '../types';

// Helper to clone array
const cloneArray = (arr: any[]) => [...arr];

export function generateSimulationSteps(
  problemId: string,
  inputArray: number[],
  targetValue?: number
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const n = inputArray.length;

  const addStep = (step: Omit<SimulationStep, 'index'>) => {
    steps.push({
      ...step,
      index: steps.length
    });
  };

  switch (problemId) {
    case 'two-sum-ii': {
      const arr = cloneArray(inputArray);
      const target = targetValue ?? 9;
      let left = 0;
      let right = n - 1;

      addStep({
        line: 1,
        array: arr,
        variables: { target, left: 'uninitialized', right: 'uninitialized' },
        description: `Initialize target to ${target}. Start simulation.`,
        log: `Starting Two Sum II with target ${target}`
      });

      addStep({
        line: 2,
        array: arr,
        left,
        variables: { target, left, right: 'uninitialized' },
        description: `Set left pointer to 0 (value: ${arr[left]}).`,
        log: `Set left pointer to index 0`
      });

      addStep({
        line: 3,
        array: arr,
        left,
        right,
        variables: { target, left, right },
        description: `Set right pointer to ${right} (value: ${arr[right]}).`,
        log: `Set right pointer to index ${right}`
      });

      while (left < right) {
        addStep({
          line: 4,
          array: arr,
          left,
          right,
          variables: { target, left, right, 'left < right': left < right },
          description: `Check loop condition left < right (${left} < ${right}).`,
          log: `Loop check: left < right (${left} < ${right})`
        });

        const currentSum = arr[left] + arr[right];

        addStep({
          line: 5,
          array: arr,
          left,
          right,
          currentSum,
          target,
          variables: { target, left, right, currentSum },
          description: `Compute currentSum = numbers[left] + numbers[right] (${arr[left]} + ${arr[right]} = ${currentSum}).`,
          log: `Computed sum = ${currentSum}`
        });

        if (currentSum === target) {
          addStep({
            line: 6,
            array: arr,
            left,
            right,
            currentSum,
            target,
            variables: { target, left, right, currentSum, 'sum == target': true },
            description: `Check if currentSum (${currentSum}) matches target (${target}). Yes, target found!`,
            log: `Sum matches target!`
          });

          addStep({
            line: 7,
            array: arr,
            left,
            right,
            currentSum,
            target,
            variables: { target, left, right, currentSum, result: `[${left + 1}, ${right + 1}]` },
            description: `Return 1-based indices: {${left + 1}, ${right + 1}}.`,
            log: `Returned solution: index ${left + 1} and ${right + 1}`
          });
          return steps;
        } else if (currentSum < target) {
          addStep({
            line: 8,
            array: arr,
            left,
            right,
            currentSum,
            target,
            variables: { target, left, right, currentSum, 'currentSum < target': true },
            description: `Check if currentSum (${currentSum}) < target (${target}). Yes, the sum is too small. We need a larger value.`,
            log: `Sum ${currentSum} < target ${target}. Need larger sum.`
          });

          left++;
          addStep({
            line: 9,
            array: arr,
            left,
            right,
            currentSum,
            target,
            variables: { target, left, right, currentSum },
            description: `Increment left pointer to ${left} (value: ${arr[left] ?? 'out of bounds'}).`,
            log: `Incremented left to index ${left}`
          });
        } else {
          addStep({
            line: 8,
            array: arr,
            left,
            right,
            currentSum,
            target,
            variables: { target, left, right, currentSum, 'currentSum < target': false },
            description: `Check if currentSum (${currentSum}) < target (${target}). No, the sum is too large. We need a smaller value.`,
            log: `Sum ${currentSum} > target ${target}. Need smaller sum.`
          });

          right--;
          addStep({
            line: 11,
            array: arr,
            left,
            right,
            currentSum,
            target,
            variables: { target, left, right, currentSum },
            description: `Decrement right pointer to ${right} (value: ${arr[right] ?? 'out of bounds'}).`,
            log: `Decremented right to index ${right}`
          });
        }
      }

      addStep({
        line: 14,
        array: arr,
        variables: { target, left, right },
        description: `Pointers met or crossed. No such pair exists.`,
        log: `Search terminated, no pair found`
      });
      break;
    }

    case 'valid-palindrome': {
      // Map elements to custom symbols or numbers.
      // Let's treat the numbers as characters, or stringify. Let's make an alphanumeric checking helper.
      // E.g. [1, 2, 3, 2, 1] is palindrome.
      const arr = cloneArray(inputArray);
      let left = 0;
      let right = n - 1;

      addStep({
        line: 1,
        array: arr,
        variables: { left: 'uninitialized', right: 'uninitialized' },
        description: `Start Valid Palindrome check on array.`,
        log: `Starting palindrome check`
      });

      addStep({
        line: 2,
        array: arr,
        left,
        variables: { left, right: 'uninitialized' },
        description: `Set left pointer to 0 (value: ${arr[left]}).`,
        log: `Set left to index 0`
      });

      addStep({
        line: 3,
        array: arr,
        left,
        right,
        variables: { left, right },
        description: `Set right pointer to ${right} (value: ${arr[right]}).`,
        log: `Set right to index ${right}`
      });

      while (left < right) {
        addStep({
          line: 4,
          array: arr,
          left,
          right,
          variables: { left, right, 'left < right': true },
          description: `Loop checking left < right (${left} < ${right}).`,
          log: `Checking left < right (${left} < ${right})`
        });

        // Simulating skipping non-alphanumerics (for our visualization, let's treat any negative numbers as special symbols to skip if we want, or just assume everything is valid but show the check!)
        // Let's check for matches:
        if (arr[left] !== arr[right]) {
          addStep({
            line: 11,
            array: arr,
            left,
            right,
            variables: { left, right, 'arr[left] == arr[right]': false },
            description: `Element at left (${arr[left]}) does not match element at right (${arr[right]}). Return false!`,
            log: `Mismatch at left index ${left} (${arr[left]}) and right index ${right} (${arr[right]})`
          });
          return steps;
        } else {
          addStep({
            line: 11,
            array: arr,
            left,
            right,
            variables: { left, right, 'arr[left] == arr[right]': true },
            description: `Element at left (${arr[left]}) matches element at right (${arr[right]}). Keep scanning.`,
            log: `Match at index ${left} and ${right} (${arr[left]})`
          });
        }

        left++;
        right--;
        addStep({
          line: 14,
          array: arr,
          left,
          right,
          variables: { left, right },
          description: `Move pointers inward. Left -> ${left}, Right -> ${right}.`,
          log: `Pointers moved inward: left=${left}, right=${right}`
        });
      }

      addStep({
        line: 17,
        array: arr,
        variables: { left, right },
        description: `Pointers met or crossed safely. The array is a valid palindrome! Return true.`,
        log: `Palindrome verified successfully`
      });
      break;
    }

    case 'reverse-string': {
      let arr = cloneArray(inputArray);
      let left = 0;
      let right = n - 1;

      addStep({
        line: 1,
        array: [...arr],
        variables: { left: 'uninitialized', right: 'uninitialized' },
        description: `Start Reverse String visualizer.`,
        log: `Starting string reversal`
      });

      addStep({
        line: 2,
        array: [...arr],
        left,
        variables: { left, right: 'uninitialized' },
        description: `Set left pointer to 0.`,
        log: `Left pointer set to 0`
      });

      addStep({
        line: 3,
        array: [...arr],
        left,
        right,
        variables: { left, right },
        description: `Set right pointer to ${right}.`,
        log: `Right pointer set to ${right}`
      });

      while (left < right) {
        addStep({
          line: 4,
          array: [...arr],
          left,
          right,
          variables: { left, right, 'left < right': true },
          description: `Check loop left < right (${left} < ${right}). True. Swap items.`,
          log: `Loop condition left < right is true`
        });

        // Swap
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        addStep({
          line: 5,
          array: [...arr],
          left,
          right,
          variables: { left, right },
          description: `Swap element at index ${left} (${arr[right]}) with element at index ${right} (${arr[left]}).`,
          log: `Swapped index ${left} and ${right}`
        });

        left++;
        addStep({
          line: 6,
          array: [...arr],
          left,
          right,
          variables: { left, right },
          description: `Increment left pointer to ${left}.`,
          log: `Incremented left to ${left}`
        });

        right--;
        addStep({
          line: 7,
          array: [...arr],
          left,
          right,
          variables: { left, right },
          description: `Decrement right pointer to ${right}.`,
          log: `Decremented right to ${right}`
        });
      }

      addStep({
        line: 9,
        array: [...arr],
        variables: { left, right },
        description: `Pointers met or crossed. Reversal complete!`,
        log: `Reversal complete. Final array: [${arr.join(', ')}]`
      });
      break;
    }

    case 'container-with-most-water': {
      const arr = cloneArray(inputArray);
      let left = 0;
      let right = n - 1;
      let maxArea = 0;

      addStep({
        line: 1,
        array: arr,
        variables: { maxArea: 0, left: 'uninitialized', right: 'uninitialized' },
        description: `Initialize Container With Most Water. Track maxArea.`,
        log: `Starting Container with Most Water`
      });

      addStep({
        line: 2,
        array: arr,
        left,
        variables: { maxArea, left, right: 'uninitialized' },
        description: `Initialize left pointer at index 0 (height: ${arr[left]}).`,
        log: `Left pointer at index 0`
      });

      addStep({
        line: 3,
        array: arr,
        left,
        right,
        variables: { maxArea, left, right },
        description: `Initialize right pointer at index ${right} (height: ${arr[right]}).`,
        log: `Right pointer at index ${right}`
      });

      addStep({
        line: 4,
        array: arr,
        left,
        right,
        maxArea,
        variables: { maxArea, left, right },
        description: `Set global maxArea = 0.`,
        log: `Initialized maxArea to 0`
      });

      while (left < right) {
        addStep({
          line: 5,
          array: arr,
          left,
          right,
          maxArea,
          variables: { maxArea, left, right, 'left < right': true },
          description: `Check loop left < right (${left} < ${right}).`,
          log: `Loop check: left < right`
        });

        const width = right - left;
        const currentArea = Math.min(arr[left], arr[right]) * width;

        addStep({
          line: 6,
          array: arr,
          left,
          right,
          maxArea,
          currentArea,
          variables: { maxArea, left, right, width, currentArea },
          description: `Calculate width = ${right} - ${left} = ${width}.`,
          log: `Calculated width = ${width}`
        });

        addStep({
          line: 7,
          array: arr,
          left,
          right,
          maxArea,
          currentArea,
          variables: { maxArea, left, right, width, currentArea },
          description: `Calculate currentArea = min(${arr[left]}, ${arr[right]}) * ${width} = ${currentArea}.`,
          log: `Calculated currentArea = ${currentArea}`
        });

        const prevMax = maxArea;
        maxArea = Math.max(maxArea, currentArea);

        addStep({
          line: 8,
          array: arr,
          left,
          right,
          maxArea,
          currentArea,
          variables: { maxArea, left, right, prevMax, currentArea, updated: maxArea > prevMax },
          description: `Update maxArea = max(${prevMax}, ${currentArea}) = ${maxArea}.`,
          log: `Max area updated: ${prevMax} -> ${maxArea}`
        });

        if (arr[left] < arr[right]) {
          addStep({
            line: 9,
            array: arr,
            left,
            right,
            maxArea,
            currentArea,
            variables: { maxArea, left, right, 'height[left] < height[right]': true },
            description: `Since left height (${arr[left]}) < right height (${arr[right]}), shift left pointer inward to look for taller walls.`,
            log: `Left wall is shorter. Shift left.`
          });
          left++;
        } else {
          addStep({
            line: 9,
            array: arr,
            left,
            right,
            maxArea,
            currentArea,
            variables: { maxArea, left, right, 'height[left] < height[right]': false },
            description: `Since right height (${arr[right]}) <= left height (${arr[left]}), shift right pointer inward to look for taller walls.`,
            log: `Right wall is shorter or equal. Shift right.`
          });
          right--;
        }
      }

      addStep({
        line: 15,
        array: arr,
        maxArea,
        variables: { maxArea },
        description: `Simulation complete. The maximum container area found is ${maxArea}.`,
        log: `Simulation finished. Return Max Area: ${maxArea}`
      });
      break;
    }

    case '3sum': {
      // Sorting is required for 3Sum
      const arr = cloneArray(inputArray).sort((a, b) => a - b);

      addStep({
        line: 1,
        array: arr,
        variables: { res: '[]' },
        description: `Sorted input array for 3Sum: [${arr.join(', ')}].`,
        log: `Sorted array for 3Sum`
      });

      for (let i = 0; i < n - 2; i++) {
        addStep({
          line: 5,
          array: arr,
          i,
          variables: { i, val: arr[i] },
          description: `Outer loop: fixed pointer i = ${i} (value: ${arr[i]}).`,
          log: `Set outer pointer i = ${i}`
        });

        if (i > 0 && arr[i] === arr[i - 1]) {
          addStep({
            line: 6,
            array: arr,
            i,
            variables: { i, val: arr[i], skip: true },
            description: `Duplicate found for value ${arr[i]} at index ${i}. Skip to avoid duplicate triplets.`,
            log: `Skipped duplicate value ${arr[i]} at index ${i}`
          });
          continue;
        }

        let left = i + 1;
        let right = n - 1;

        addStep({
          line: 7,
          array: arr,
          i,
          left,
          variables: { i, left, right: 'uninitialized' },
          description: `Initialize left pointer next to i at ${left} (value: ${arr[left]}).`,
          log: `Set left to ${left}`
        });

        addStep({
          line: 8,
          array: arr,
          i,
          left,
          right,
          variables: { i, left, right },
          description: `Initialize right pointer at end index ${right} (value: ${arr[right]}).`,
          log: `Set right to ${right}`
        });

        while (left < right) {
          const sum = arr[i] + arr[left] + arr[right];

          addStep({
            line: 10,
            array: arr,
            i,
            left,
            right,
            currentSum: sum,
            variables: { i, left, right, sum },
            description: `Calculate triplet sum = nums[i] + nums[left] + nums[right] (${arr[i]} + ${arr[left]} + ${arr[right]} = ${sum}).`,
            log: `Calculated triplet sum: ${sum}`
          });

          if (sum === 0) {
            addStep({
              line: 11,
              array: arr,
              i,
              left,
              right,
              currentSum: sum,
              variables: { i, left, right, sum, 'sum == 0': true },
              description: `Triplet found! Triple: {${arr[i]}, ${arr[left]}, ${arr[right]}}. Record this.`,
              log: `Found valid triplet: {${arr[i]}, ${arr[left]}, ${arr[right]}}`
            });

            left++;
            right--;
            addStep({
              line: 15,
              array: arr,
              i,
              left,
              right,
              currentSum: sum,
              variables: { i, left, right },
              description: `Move both left and right pointers inward to search for more combinations.`,
              log: `Advanced left to ${left} and decremented right to ${right}`
            });
          } else if (sum < 0) {
            addStep({
              line: 16,
              array: arr,
              i,
              left,
              right,
              currentSum: sum,
              variables: { i, left, right, sum },
              description: `Sum ${sum} is too small (< 0). Increment left to increase the sum.`,
              log: `Sum ${sum} < 0. Left advanced.`
            });
            left++;
          } else {
            addStep({
              line: 18,
              array: arr,
              i,
              left,
              right,
              currentSum: sum,
              variables: { i, left, right, sum },
              description: `Sum ${sum} is too large (> 0). Decrement right to decrease the sum.`,
              log: `Sum ${sum} > 0. Right decremented.`
            });
            right--;
          }
        }
      }

      addStep({
        line: 23,
        array: arr,
        variables: {},
        description: `Three Sum outer loop complete. Returing collected unique triplets.`,
        log: `Three Sum simulation complete`
      });
      break;
    }

    case '4sum': {
      const arr = cloneArray(inputArray).sort((a, b) => a - b);
      const target = targetValue ?? 0;

      addStep({
        line: 1,
        array: arr,
        variables: { res: '[]', target },
        description: `Sorted input array for 4Sum: [${arr.join(', ')}]. Target is ${target}.`,
        log: `Sorted array for 4Sum, target ${target}`
      });

      for (let i = 0; i < n - 3; i++) {
        if (i > 0 && arr[i] === arr[i - 1]) continue;

        for (let j = i + 1; j < n - 2; j++) {
          if (j > i + 1 && arr[j] === arr[j - 1]) continue;

          let left = j + 1;
          let right = n - 1;

          addStep({
            line: 9,
            array: arr,
            i,
            j,
            left,
            right,
            variables: { i, j, left, right, target },
            description: `Fixed parameters: i = ${i} (val: ${arr[i]}), j = ${j} (val: ${arr[j]}). Left = ${left}, Right = ${right}.`,
            log: `Nested outer loop: i=${i}, j=${j}`
          });

          while (left < right) {
            const sum = arr[i] + arr[j] + arr[left] + arr[right];

            addStep({
              line: 11,
              array: arr,
              i,
              j,
              left,
              right,
              currentSum: sum,
              target,
              variables: { i, j, left, right, sum, target },
              description: `Check 4-element sum: ${arr[i]} + ${arr[j]} + ${arr[left]} + ${arr[right]} = ${sum}.`,
              log: `Checking quadruplet sum: ${sum}`
            });

            if (sum === target) {
              addStep({
                line: 12,
                array: arr,
                i,
                j,
                left,
                right,
                currentSum: sum,
                target,
                variables: { i, j, left, right, sum },
                description: `Quadruplet found! {${arr[i]}, ${arr[j]}, ${arr[left]}, ${arr[right]}} adds up to target.`,
                log: `Found quadruplet: {${arr[i]}, ${arr[j]}, ${arr[left]}, ${arr[right]}}`
              });
              left++;
              right--;
            } else if (sum < target) {
              left++;
            } else {
              right--;
            }
          }
        }
      }

      addStep({
        line: 25,
        array: arr,
        variables: {},
        description: `4Sum simulation finished.`,
        log: `Completed 4Sum analysis`
      });
      break;
    }

    case 'trapping-rain-water': {
      const arr = cloneArray(inputArray);
      let left = 0;
      let right = n - 1;
      let leftMax = 0;
      let rightMax = 0;
      let totalWater = 0;
      const waterLevels = new Array(n).fill(0);

      addStep({
        line: 1,
        array: arr,
        variables: { leftMax: 0, rightMax: 0, totalWater: 0 },
        description: `Start Trapping Rain Water algorithm. Track leftMax, rightMax, and totalWater.`,
        log: `Starting Trapping Rain Water`
      });

      addStep({
        line: 2,
        array: arr,
        left,
        right,
        variables: { left, right, leftMax, rightMax },
        description: `Set left pointer to 0 and right pointer to ${right}.`,
        log: `Pointers set to ends of height array`
      });

      while (left < right) {
        addStep({
          line: 5,
          array: arr,
          left,
          right,
          leftMax,
          rightMax,
          waterLevels: [...waterLevels],
          variables: { left, right, leftMax, rightMax, totalWater, 'left < right': true },
          description: `Compare columns at left (${arr[left]}) and right (${arr[right]}).`,
          log: `Loop compare: left (${arr[left]}) vs right (${arr[right]})`
        });

        if (arr[left] < arr[right]) {
          addStep({
            line: 6,
            array: arr,
            left,
            right,
            leftMax,
            rightMax,
            waterLevels: [...waterLevels],
            variables: { left, right, leftMax, rightMax, totalWater, 'height[left] < height[right]': true },
            description: `Since left height (${arr[left]}) is smaller, process the left pointer.`,
            log: `Left wall is smaller. Processing left.`
          });

          if (arr[left] >= leftMax) {
            leftMax = arr[left];
            addStep({
              line: 8,
              array: arr,
              left,
              right,
              leftMax,
              rightMax,
              waterLevels: [...waterLevels],
              variables: { left, right, leftMax, rightMax, totalWater },
              description: `Current left height (${arr[left]}) is >= leftMax (${leftMax}). Update leftMax to ${leftMax}. No water trapped here.`,
              log: `Updated leftMax to ${leftMax}`
            });
          } else {
            const trapped = leftMax - arr[left];
            totalWater += trapped;
            waterLevels[left] = trapped;
            addStep({
              line: 10,
              array: arr,
              left,
              right,
              leftMax,
              rightMax,
              waterLevels: [...waterLevels],
              variables: { left, right, leftMax, rightMax, totalWater, trapped },
              description: `Current height (${arr[left]}) < leftMax (${leftMax}). Trapped water = leftMax - height = ${leftMax} - ${arr[left]} = ${trapped}. Total water = ${totalWater}.`,
              log: `Trapped ${trapped} units of water at index ${left}`
            });
          }
          left++;
        } else {
          addStep({
            line: 6,
            array: arr,
            left,
            right,
            leftMax,
            rightMax,
            waterLevels: [...waterLevels],
            variables: { left, right, leftMax, rightMax, totalWater, 'height[left] < height[right]': false },
            description: `Since right height (${arr[right]}) <= left height (${arr[left]}), process the right pointer.`,
            log: `Right wall is smaller/equal. Processing right.`
          });

          if (arr[right] >= rightMax) {
            rightMax = arr[right];
            addStep({
              line: 14,
              array: arr,
              left,
              right,
              leftMax,
              rightMax,
              waterLevels: [...waterLevels],
              variables: { left, right, leftMax, rightMax, totalWater },
              description: `Current right height (${arr[right]}) is >= rightMax (${rightMax}). Update rightMax to ${rightMax}. No water trapped.`,
              log: `Updated rightMax to ${rightMax}`
            });
          } else {
            const trapped = rightMax - arr[right];
            totalWater += trapped;
            waterLevels[right] = trapped;
            addStep({
              line: 16,
              array: arr,
              left,
              right,
              leftMax,
              rightMax,
              waterLevels: [...waterLevels],
              variables: { left, right, leftMax, rightMax, totalWater, trapped },
              description: `Current height (${arr[right]}) < rightMax (${rightMax}). Trapped water = rightMax - height = ${rightMax} - ${arr[right]} = ${trapped}. Total water = ${totalWater}.`,
              log: `Trapped ${trapped} units of water at index ${right}`
            });
          }
          right--;
        }
      }

      addStep({
        line: 21,
        array: arr,
        leftMax,
        rightMax,
        waterLevels: [...waterLevels],
        variables: { totalWater },
        description: `Pointers met. Total trapped water is ${totalWater} units.`,
        log: `Reaching termination. Total water = ${totalWater}`
      });
      break;
    }

    // Same Direction
    case 'remove-duplicates': {
      let arr = cloneArray(inputArray);
      let slow = 0;

      addStep({
        line: 1,
        array: [...arr],
        variables: { slow: 'uninitialized' },
        description: `Start Remove Duplicates on sorted array.`,
        log: `Starting duplicate removal`
      });

      addStep({
        line: 3,
        array: [...arr],
        slow,
        variables: { slow },
        description: `Set slow pointer to index 0 (value: ${arr[slow]}). It represents the write-head of unique values.`,
        log: `Slow pointer initialized to index 0`
      });

      for (let fast = 1; fast < n; fast++) {
        addStep({
          line: 4,
          array: [...arr],
          slow,
          fast,
          variables: { slow, fast, 'nums[fast] != nums[slow]': arr[fast] !== arr[slow] },
          description: `Scan index fast = ${fast} (value: ${arr[fast]}). Compare with slow index ${slow} (value: ${arr[slow]}).`,
          log: `Checking fast index ${fast} (val: ${arr[fast]}) vs slow index ${slow} (val: ${arr[slow]})`
        });

        if (arr[fast] !== arr[slow]) {
          slow++;
          const prevVal = arr[slow];
          arr[slow] = arr[fast];

          addStep({
            line: 5,
            array: [...arr],
            slow,
            fast,
            variables: { slow, fast },
            description: `Different element found! Increment slow pointer to ${slow} and copy value ${arr[fast]} there.`,
            log: `Moved unique value ${arr[fast]} to index ${slow}`
          });
        } else {
          addStep({
            line: 4,
            array: [...arr],
            slow,
            fast,
            variables: { slow, fast },
            description: `Duplicate value (${arr[fast]}) found. Ignore it and advance fast pointer.`,
            log: `Ignored duplicate value ${arr[fast]} at index ${fast}`
          });
        }
      }

      addStep({
        line: 9,
        array: [...arr],
        slow,
        variables: { count: slow + 1 },
        description: `Array traversal complete. Unique count is ${slow + 1} (represented by elements in index 0 to ${slow}).`,
        log: `Returned size of unique prefix: ${slow + 1}`
      });
      break;
    }

    case 'move-zeroes': {
      let arr = cloneArray(inputArray);
      let slow = 0;

      addStep({
        line: 1,
        array: [...arr],
        variables: { slow: 'uninitialized' },
        description: `Start Move Zeroes visualizer.`,
        log: `Starting Move Zeroes`
      });

      addStep({
        line: 2,
        array: [...arr],
        slow,
        variables: { slow },
        description: `Initialize slow pointer to index 0. This tracks the destination index of the next non-zero element.`,
        log: `Slow pointer initialized at 0`
      });

      for (let fast = 0; fast < n; fast++) {
        addStep({
          line: 3,
          array: [...arr],
          slow,
          fast,
          variables: { slow, fast, 'nums[fast] != 0': arr[fast] !== 0 },
          description: `Scan index fast = ${fast} (value: ${arr[fast]}). Check if it is non-zero.`,
          log: `Fast index ${fast} (value: ${arr[fast]})`
        });

        if (arr[fast] !== 0) {
          // Swap
          const temp = arr[slow];
          arr[slow] = arr[fast];
          arr[fast] = temp;

          addStep({
            line: 4,
            array: [...arr],
            slow,
            fast,
            variables: { slow, fast },
            description: `Non-zero value ${arr[slow]} found at fast. Swap elements at slow (${slow}) and fast (${fast}).`,
            log: `Swapped slow index ${slow} and fast index ${fast}`
          });

          slow++;
          addStep({
            line: 5,
            array: [...arr],
            slow,
            fast,
            variables: { slow, fast },
            description: `Increment slow pointer to ${slow} for the next non-zero insert.`,
            log: `Slow pointer incremented to ${slow}`
          });
        } else {
          addStep({
            line: 3,
            array: [...arr],
            slow,
            fast,
            variables: { slow, fast },
            description: `Value is 0. Skip it and keep searching with fast.`,
            log: `Skipped zero value at index ${fast}`
          });
        }
      }

      addStep({
        line: 8,
        array: [...arr],
        variables: { slow },
        description: `All non-zeroes have been moved forward. Zeroes remain at the back. Re-ordering complete.`,
        log: `Move Zeroes complete! final array: [${arr.join(', ')}]`
      });
      break;
    }

    case 'sort-colors': {
      let arr = cloneArray(inputArray);
      let low = 0;
      let mid = 0;
      let high = n - 1;

      addStep({
        line: 1,
        array: [...arr],
        variables: { low: 'uninitialized', mid: 'uninitialized', high: 'uninitialized' },
        description: `Start Dutch National Flag / Sort Colors algorithm. 0 is Red, 1 is White, 2 is Blue.`,
        log: `Starting Dutch National Flag sorting`
      });

      addStep({
        line: 2,
        array: [...arr],
        low,
        mid,
        high,
        variables: { low, mid, high },
        description: `Set low = 0, mid = 0 (left bounds) and high = ${high} (right bounds).`,
        log: `Pointers set: low=0, mid=0, high=${high}`
      });

      while (mid <= high) {
        addStep({
          line: 4,
          array: [...arr],
          low,
          mid,
          high,
          variables: { low, mid, high, 'mid <= high': true },
          description: `Compare element at mid index ${mid} (value: ${arr[mid]}).`,
          log: `Loop check: mid (${mid}) <= high (${high})`
        });

        if (arr[mid] === 0) {
          addStep({
            line: 5,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high, 'nums[mid] == 0': true },
            description: `Element is 0 (Red). Swap with low index ${low} so it sits in the front boundary.`,
            log: `Found Red (0) at mid index ${mid}`
          });

          const temp = arr[low];
          arr[low] = arr[mid];
          arr[mid] = temp;

          addStep({
            line: 6,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high },
            description: `Swapped elements at low (${low}) and mid (${mid}).`,
            log: `Swapped low index ${low} and mid index ${mid}`
          });

          low++;
          mid++;
          addStep({
            line: 7,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high },
            description: `Increment low to ${low} and mid to ${mid}.`,
            log: `Moved low to ${low} and mid to ${mid}`
          });
        } else if (arr[mid] === 1) {
          addStep({
            line: 8,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high, 'nums[mid] == 1': true },
            description: `Element is 1 (White). It is in the correct middle section. Just increment mid.`,
            log: `Found White (1) at mid index ${mid}. Shifting mid.`
          });

          mid++;
          addStep({
            line: 9,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high },
            description: `Increment mid to ${mid}.`,
            log: `mid pointer incremented to ${mid}`
          });
        } else {
          addStep({
            line: 10,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high, 'nums[mid] == 2': true },
            description: `Element is 2 (Blue). Swap with high index ${high} to place it in the back boundary.`,
            log: `Found Blue (2) at mid index ${mid}`
          });

          const temp = arr[mid];
          arr[mid] = arr[high];
          arr[high] = temp;

          addStep({
            line: 11,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high },
            description: `Swapped elements at mid (${mid}) and high (${high}). Do not increment mid yet, as the swapped element must be checked.`,
            log: `Swapped mid index ${mid} and high index ${high}`
          });

          high--;
          addStep({
            line: 12,
            array: [...arr],
            low,
            mid,
            high,
            variables: { low, mid, high },
            description: `Decrement high pointer to ${high}.`,
            log: `Decremented high pointer to ${high}`
          });
        }
      }

      addStep({
        line: 15,
        array: [...arr],
        variables: {},
        description: `mid pointer (${mid}) surpassed high (${high}). Sorting complete!`,
        log: `Dutch National Flag complete: [${arr.join(', ')}]`
      });
      break;
    }

    case 'linked-list-cycle': {
      // Linked List cycle: slow moves 1, fast moves 2. Let's represent nodes on screen.
      // If cycleTargetIndex is set, say targetValue = 1 (cycle connects back to node 1)
      const arr = cloneArray(inputArray);
      const cycleStartIdx = targetValue !== undefined && targetValue >= 0 && targetValue < n ? targetValue : -1;

      addStep({
        line: 1,
        array: arr,
        cycleTargetIndex: cycleStartIdx >= 0 ? cycleStartIdx : undefined,
        variables: { slow: 'uninitialized', fast: 'uninitialized', cycleStartIdx },
        description: `Start Linked List Cycle detector. Cycle points back to index: ${cycleStartIdx >= 0 ? cycleStartIdx : 'None (No Cycle)'}.`,
        log: `Initialized LinkedList cycle check. Cycle: index -> ${cycleStartIdx}`
      });

      let slow = 0;
      let fast = 0;

      addStep({
        line: 2,
        array: arr,
        slow,
        variables: { slow, fast: 'uninitialized' },
        description: `Set slow pointer to head (index 0).`,
        log: `Set slow to head`
      });

      addStep({
        line: 3,
        array: arr,
        slow,
        fast,
        variables: { slow, fast },
        description: `Set fast pointer to head (index 0).`,
        log: `Set fast to head`
      });

      let hasCycle = false;
      let stepsCount = 0;
      const maxIter = 50; // Prevent infinite loops

      while (stepsCount < maxIter) {
        stepsCount++;
        // Check out of bounds
        if (fast >= n || fast === -1) {
          addStep({
            line: 4,
            array: arr,
            slow,
            variables: { slow, fast },
            description: `fast pointer is null. Reached the end of the list. No cycle exists!`,
            log: `Fast reached null. No cycle.`
          });
          break;
        }

        // Fast next node calculation
        let fastNext = fast + 1;
        if (fast === n - 1 && cycleStartIdx >= 0) {
          fastNext = cycleStartIdx; // Cycle wrap
        } else if (fast === n - 1) {
          fastNext = -1; // End
        }

        let fastNextNext = -1;
        if (fastNext !== -1) {
          fastNextNext = fastNext + 1;
          if (fastNext === n - 1 && cycleStartIdx >= 0) {
            fastNextNext = cycleStartIdx;
          } else if (fastNext === n - 1) {
            fastNextNext = -1;
          }
        }

        addStep({
          line: 4,
          array: arr,
          slow,
          fast,
          variables: { slow, fast, 'fast != null && fast->next != null': fastNext !== -1 && fastNextNext !== -1 },
          description: `Loop verification. Check if fast or fast->next is null. Slow at ${slow}, Fast at ${fast}.`,
          log: `Checking node connections: fast=${fast}`
        });

        if (fastNext === -1 || fastNextNext === -1) {
          addStep({
            line: 4,
            array: arr,
            slow,
            fast,
            variables: { slow, fast },
            description: `fast->next is null. End of list reached. No cycle exists.`,
            log: `Fast next is null. Termination.`
          });
          break;
        }

        // Move slow
        let slowNext = slow + 1;
        if (slow === n - 1 && cycleStartIdx >= 0) {
          slowNext = cycleStartIdx;
        }

        slow = slowNext;
        addStep({
          line: 5,
          array: arr,
          slow,
          fast,
          variables: { slow, fast },
          description: `Advance slow pointer by 1 node to index ${slow} (value: ${arr[slow]}).`,
          log: `Slow moved to node ${slow}`
        });

        // Move fast
        fast = fastNextNext;
        addStep({
          line: 6,
          array: arr,
          slow,
          fast,
          variables: { slow, fast },
          description: `Advance fast pointer by 2 nodes to index ${fast} (value: ${arr[fast] ?? 'null'}).`,
          log: `Fast moved to node ${fast}`
        });

        if (slow === fast) {
          hasCycle = true;
          addStep({
            line: 7,
            array: arr,
            slow,
            fast,
            variables: { slow, fast, 'slow == fast': true },
            description: `Intersection! slow pointer meets fast pointer at index ${slow}. Cycle detected!`,
            log: `Slow met fast at node ${slow}. Cycle confirmed.`
          });

          // Phase 2: Find cycle start (LeetCode 142 Tortoise & Hare start finding)
          addStep({
            line: 7,
            array: arr,
            slow,
            fast,
            variables: { slow, fast },
            description: `Phase 2: Find cycle start. Reset slow pointer to head (index 0). Keep fast pointer at ${fast}.`,
            log: `Starting cycle entry discovery. Resetting slow to 0.`
          });

          slow = 0;
          addStep({
            line: 7,
            array: arr,
            slow,
            fast,
            variables: { slow, fast },
            description: `Slow is at index 0. Fast is at index ${fast}. Advance both 1 step at a time until they meet.`,
            log: `Slow reset. slow=${slow}, fast=${fast}`
          });

          while (slow !== fast) {
            let sNext = slow + 1;
            if (slow === n - 1 && cycleStartIdx >= 0) sNext = cycleStartIdx;
            slow = sNext;

            let fNext = fast + 1;
            if (fast === n - 1 && cycleStartIdx >= 0) fNext = cycleStartIdx;
            fast = fNext;

            addStep({
              line: 7,
              array: arr,
              slow,
              fast,
              variables: { slow, fast },
              description: `Advance both pointers 1 step. Slow -> ${slow}, Fast -> ${fast}.`,
              log: `Step: slow -> ${slow}, fast -> ${fast}`
            });
          }

          addStep({
            line: 7,
            array: arr,
            slow,
            fast,
            variables: { slow, fast, 'cycleStart': slow },
            description: `Pointers meet at index ${slow}! This is the start of the linked list cycle.`,
            log: `Intersection at index ${slow}. Cycle start detected!`
          });
          return steps;
        }
      }
      break;
    }

    case 'middle-of-linked-list': {
      const arr = cloneArray(inputArray);
      let slow = 0;
      let fast = 0;

      addStep({
        line: 1,
        array: arr,
        variables: { slow: 'uninitialized', fast: 'uninitialized' },
        description: `Start Middle of the Linked List search.`,
        log: `Starting Middle of LinkedList`
      });

      addStep({
        line: 2,
        array: arr,
        slow,
        variables: { slow, fast: 'uninitialized' },
        description: `Initialize slow pointer to head (index 0).`,
        log: `Slow set to head (0)`
      });

      addStep({
        line: 3,
        array: arr,
        slow,
        fast,
        variables: { slow, fast },
        description: `Initialize fast pointer to head (index 0).`,
        log: `Fast set to head (0)`
      });

      while (fast < n && fast + 1 < n) {
        addStep({
          line: 4,
          array: arr,
          slow,
          fast,
          variables: { slow, fast, 'fast != null && fast->next != null': true },
          description: `Check loop condition. Fast (${fast}) has next nodes. Move slow 1 step, fast 2 steps.`,
          log: `Loop condition check: fast has space to move`
        });

        slow = slow + 1;
        addStep({
          line: 5,
          array: arr,
          slow,
          fast,
          variables: { slow, fast },
          description: `Move slow pointer 1 step to index ${slow} (value: ${arr[slow]}).`,
          log: `Slow advanced to ${slow}`
        });

        fast = fast + 2;
        addStep({
          line: 6,
          array: arr,
          slow,
          fast,
          variables: { slow, fast },
          description: `Move fast pointer 2 steps to index ${fast} (value: ${arr[fast] ?? 'null/out-of-bounds'}).`,
          log: `Fast advanced to ${fast}`
        });
      }

      addStep({
        line: 4,
        array: arr,
        slow,
        fast,
        variables: { slow, fast, 'fast != null && fast->next != null': false },
        description: `Fast reached the end of the list. Loop terminated.`,
        log: `Fast pointer reached boundary`
      });

      addStep({
        line: 8,
        array: arr,
        slow,
        variables: { middleNodeValue: arr[slow] },
        description: `Return slow pointer node at index ${slow} (value: ${arr[slow]}).`,
        log: `Returned middle node: index ${slow} (val: ${arr[slow]})`
      });
      break;
    }

    // Kadane's Algorithm & Subarray Optimization
    case 'maximum-subarray': {
      const arr = cloneArray(inputArray);
      let maxSum = arr[0];
      let currentSum = arr[0];
      let start = 0;
      let bestStart = 0;
      let bestEnd = 0;

      addStep({
        line: 1,
        array: arr,
        currentSum,
        maxSum,
        activeRange: [0, 0],
        bestRange: [0, 0],
        variables: { currentSum, maxSum, start, bestStart, bestEnd },
        description: `Initialize currentSum = nums[0] (${arr[0]}) and maxSum = nums[0] (${arr[0]}). Best range [0, 0].`,
        log: `Initialized Kadane's. maxSum = ${maxSum}`
      });

      for (let i = 1; i < n; i++) {
        const val = arr[i];

        addStep({
          line: 5,
          array: arr,
          currentSum,
          maxSum,
          activeRange: [start, i - 1],
          bestRange: [bestStart, bestEnd],
          i,
          variables: { i, val, currentSum, maxSum, start },
          description: `Scan index i = ${i} (value: ${val}). Decide: extend or discard?`,
          log: `Processing element ${val} at index ${i}`
        });

        if (currentSum < 0) {
          currentSum = val;
          start = i;
          addStep({
            line: 7,
            array: arr,
            currentSum,
            maxSum,
            activeRange: [start, i],
            bestRange: [bestStart, bestEnd],
            i,
            variables: { i, val, currentSum, maxSum, start },
            description: `Since currentSum (${currentSum - val}) < 0, discard previous negative prefix. Start fresh subarray at index ${i} (currentSum = ${currentSum}).`,
            log: `Discarded negative sum. Started fresh subarray at index ${i}`
          });
        } else {
          currentSum += val;
          addStep({
            line: 9,
            array: arr,
            currentSum,
            maxSum,
            activeRange: [start, i],
            bestRange: [bestStart, bestEnd],
            i,
            variables: { i, val, currentSum, maxSum, start },
            description: `Add element ${val} to currentSum. New currentSum = ${currentSum}.`,
            log: `Added element ${val} to currentSum. Sum: ${currentSum}`
          });
        }

        if (currentSum > maxSum) {
          const prevMax = maxSum;
          maxSum = currentSum;
          bestStart = start;
          bestEnd = i;

          addStep({
            line: 12,
            array: arr,
            currentSum,
            maxSum,
            activeRange: [start, i],
            bestRange: [bestStart, bestEnd],
            i,
            variables: { i, val, currentSum, maxSum, start, bestStart, bestEnd },
            description: `currentSum (${currentSum}) exceeds previous maxSum (${prevMax}). Update maxSum to ${maxSum}. Best range is now [${bestStart} ... ${bestEnd}].`,
            log: `Updated global maxSum to ${maxSum} [${bestStart}...${bestEnd}]`
          });
        }
      }

      addStep({
        line: 18,
        array: arr,
        currentSum,
        maxSum,
        activeRange: null,
        bestRange: [bestStart, bestEnd],
        variables: { maxSum, bestStart, bestEnd },
        description: `Completed Kadane's scan. Maximum contiguous subarray sum is ${maxSum} found in range [${bestStart} ... ${bestEnd}].`,
        log: `Kadane's complete. Result: ${maxSum}`
      });
      break;
    }

    case 'maximum-sum-circular-subarray': {
      const arr = cloneArray(inputArray);
      let totalSum = 0;
      let currentMax = 0;
      let maxSoFar = arr[0];
      let currentMin = 0;
      let minSoFar = arr[0];

      addStep({
        line: 1,
        array: arr,
        variables: { totalSum, maxSoFar, minSoFar },
        description: `Start Maximum Sum Circular Subarray. Compute standard max subarray and standard min subarray.`,
        log: `Starting Circular Kadane's`
      });

      for (let i = 0; i < n; i++) {
        const x = arr[i];
        totalSum += x;
        currentMax = Math.max(x, currentMax + x);
        maxSoFar = Math.max(maxSoFar, currentMax);

        currentMin = Math.min(x, currentMin + x);
        minSoFar = Math.min(minSoFar, currentMin);

        addStep({
          line: 5,
          array: arr,
          i,
          totalSum,
          currentMin,
          minSum: minSoFar,
          currentSum: currentMax,
          maxSum: maxSoFar,
          variables: { i, x, totalSum, currentMax, maxSoFar, currentMin, minSoFar },
          description: `Element ${x} at index ${i}: Accumulate totalSum = ${totalSum}. Standard maxSoFar = ${maxSoFar}, Standard minSoFar = ${minSoFar}.`,
          log: `Processed x=${x}. totalSum=${totalSum}, max=${maxSoFar}, min=${minSoFar}`
        });
      }

      const circularSum = totalSum - minSoFar;
      const answer = maxSoFar < 0 ? maxSoFar : Math.max(maxSoFar, circularSum);

      addStep({
        line: 12,
        array: arr,
        totalSum,
        minSum: minSoFar,
        maxSum: maxSoFar,
        variables: { maxSoFar, totalSum, minSoFar, circularSum, answer },
        description: `Check if maxSoFar < 0. No. Return max(maxSoFar (${maxSoFar}), totalSum - minSoFar (${totalSum} - (${minSoFar}) = ${circularSum})). Result is ${answer}.`,
        log: `Circular Kadane complete. Final Answer: ${answer}`
      });
      break;
    }

    case 'maximum-product-subarray': {
      const arr = cloneArray(inputArray);
      let maxProd = arr[0];
      let minProd = arr[0];
      let result = arr[0];

      addStep({
        line: 1,
        array: arr,
        maxProd,
        minProd,
        maxSum: result,
        variables: { maxProd, minProd, result },
        description: `Initialize maxProd = ${maxProd}, minProd = ${minProd}, global result = ${result}.`,
        log: `Starting Max Product Subarray`
      });

      for (let i = 1; i < n; i++) {
        const x = arr[i];

        addStep({
          line: 5,
          array: arr,
          i,
          maxProd,
          minProd,
          maxSum: result,
          variables: { i, x, maxProd, minProd, result },
          description: `Examine element ${x} at index ${i}.`,
          log: `Examining element ${x} at index ${i}`
        });

        if (x < 0) {
          const temp = maxProd;
          maxProd = minProd;
          minProd = temp;

          addStep({
            line: 7,
            array: arr,
            i,
            maxProd,
            minProd,
            maxSum: result,
            variables: { i, x, maxProd, minProd, result },
            description: `Since x (${x}) is negative, swap maxProd and minProd. Swapped states: maxProd = ${maxProd}, minProd = ${minProd}.`,
            log: `Negative element found. Swapped maxProd and minProd.`
          });
        }

        maxProd = Math.max(x, maxProd * x);
        minProd = Math.min(x, minProd * x);
        result = Math.max(result, maxProd);

        addStep({
          line: 9,
          array: arr,
          i,
          maxProd,
          minProd,
          maxSum: result,
          variables: { i, x, maxProd, minProd, result },
          description: `Update maxProd = max(${x}, maxProd * ${x}) = ${maxProd}. Update minProd = min(${x}, minProd * ${x}) = ${minProd}. Global result = max(${result}, ${maxProd}) = ${result}.`,
          log: `Updated step products: max=${maxProd}, min=${minProd}, best result=${result}`
        });
      }

      addStep({
        line: 15,
        array: arr,
        maxProd,
        minProd,
        maxSum: result,
        variables: { result },
        description: `Traversal complete. Maximum Product Subarray product is ${result}.`,
        log: `Max Product Subarray complete. Result: ${result}`
      });
      break;
    }

    case 'best-time-to-buy-and-sell-stock': {
      const arr = cloneArray(inputArray);
      let minPrice = arr[0];
      let maxProfit = 0;

      addStep({
        line: 1,
        array: arr,
        minPrice,
        maxSum: maxProfit,
        variables: { minPrice, maxProfit },
        description: `Set initial minPrice = prices[0] (${arr[0]}), maxProfit = 0.`,
        log: `Starting Buy and Sell Stock`
      });

      for (let i = 1; i < n; i++) {
        const price = arr[i];

        addStep({
          line: 4,
          array: arr,
          i,
          minPrice,
          maxSum: maxProfit,
          variables: { i, price, minPrice, maxProfit },
          description: `Check day ${i} price: ${price}. Update minPrice seen so far.`,
          log: `Checking day ${i} price: ${price}`
        });

        const prevMin = minPrice;
        minPrice = Math.min(minPrice, price);

        addStep({
          line: 5,
          array: arr,
          i,
          minPrice,
          maxSum: maxProfit,
          variables: { i, price, minPrice, prevMin, maxProfit },
          description: `minPrice = min(${prevMin}, ${price}) = ${minPrice}.`,
          log: `Updated minPrice to ${minPrice}`
        });

        const profit = price - minPrice;
        const prevProfit = maxProfit;
        maxProfit = Math.max(maxProfit, profit);

        addStep({
          line: 6,
          array: arr,
          i,
          minPrice,
          maxSum: maxProfit,
          variables: { i, price, minPrice, profit, maxProfit, prevProfit },
          description: `Calculate potential profit today = ${price} - ${minPrice} = ${profit}. maxProfit = max(${prevProfit}, ${profit}) = ${maxProfit}.`,
          log: `Calculated possible profit = ${profit}. New maxProfit = ${maxProfit}`
        });
      }

      addStep({
        line: 8,
        array: arr,
        minPrice,
        maxSum: maxProfit,
        variables: { maxProfit },
        description: `Completed search. Maximum profit achievable is ${maxProfit}.`,
        log: `Stock profit tracking finished. Result profit: ${maxProfit}`
      });
      break;
    }

    case 'maximum-absolute-sum-of-any-subarray': {
      const arr = cloneArray(inputArray);
      let currentMax = 0;
      let maxSoFar = 0;
      let currentMin = 0;
      let minSoFar = 0;

      addStep({
        line: 1,
        array: arr,
        variables: { currentMax: 0, maxSoFar: 0, currentMin: 0, minSoFar: 0 },
        description: `Start Maximum Absolute Sum visualizer. Track dual positive peaks and negative valleys.`,
        log: `Starting Maximum Absolute Sum`
      });

      for (let i = 0; i < n; i++) {
        const x = arr[i];
        currentMax = Math.max(0, currentMax + x);
        maxSoFar = Math.max(maxSoFar, currentMax);

        currentMin = Math.min(0, currentMin + x);
        minSoFar = Math.min(minSoFar, currentMin);

        addStep({
          line: 5,
          array: arr,
          i,
          currentSum: currentMax,
          maxSum: maxSoFar,
          currentMin: currentMin,
          minSum: minSoFar,
          maxAbsSum: Math.max(maxSoFar, Math.abs(minSoFar)),
          variables: { i, x, currentMax, maxSoFar, currentMin, minSoFar },
          description: `Element ${x} at index ${i}: currentMax subarray sum is ${currentMax} (maxSoFar: ${maxSoFar}). currentMin subarray sum is ${currentMin} (minSoFar: ${minSoFar}).`,
          log: `Processed index ${i} value ${x}. Max positive sum: ${maxSoFar}, Min negative sum: ${minSoFar}`
        });
      }

      const ans = Math.max(maxSoFar, Math.abs(minSoFar));

      addStep({
        line: 12,
        array: arr,
        minSum: minSoFar,
        maxSum: maxSoFar,
        maxAbsSum: ans,
        variables: { maxSoFar, minSoFar, ans },
        description: `Simulation completed. Return max(maxSoFar (${maxSoFar}), |minSoFar| (|${minSoFar}| = ${Math.abs(minSoFar)})) = ${ans}.`,
        log: `Simulation ended. Return Max Absolute Sum: ${ans}`
      });
      break;
    }

    default:
      break;
  }

  return steps;
}
