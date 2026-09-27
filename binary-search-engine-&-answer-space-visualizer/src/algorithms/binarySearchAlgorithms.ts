/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationStep, DiscardedRange, PredicateState } from '../types';

// Helper to get 1D discarded ranges
function getDiscarded1D(length: number, low: number, high: number): DiscardedRange[] {
  const ranges: DiscardedRange[] = [];
  if (low > 0) {
    ranges.push({ start: 0, end: Math.min(low - 1, length - 1) });
  }
  if (high < length - 1) {
    ranges.push({ start: Math.max(0, high + 1), end: length - 1 });
  }
  return ranges;
}

export function generateSteps(
  problemId: string,
  inputArray: any,
  inputTarget: number,
  extraParams: Record<string, number> = {}
): SimulationStep[] {
  const steps: SimulationStep[] = [];

  switch (problemId) {
    // ==========================================
    // 1. Classic 1D Search
    // ==========================================
    case 'binary-search': {
      const nums = inputArray as number[];
      const target = inputTarget;
      let low = 0;
      let high = nums.length - 1;

      // Initial state
      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize binary search. Pointers low = 0, high = ${high}. Active search space has ${nums.length} elements.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null', 'nums[mid]': 'N/A', target }
      });

      while (low <= high) {
        // While check
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Loop condition check: low (${low}) <= high (${high}) is true. Proceeding with search.`,
          line: 3,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid: 'null', 'nums[mid]': 'N/A', target }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];

        // Mid computed
        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute middle index: mid = ${low} + (${high} - ${low}) / 2 = ${mid}. Middle element is nums[${mid}] = ${midVal}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, 'nums[mid]': midVal, target }
        });

        if (midVal === target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Match found! nums[mid] (${midVal}) matches the target value ${target} at index ${mid}.`,
            line: 5,
            found: true,
            foundIndex: mid,
            ans: mid,
            variables: { low, high, mid, 'nums[mid]': midVal, target, status: 'FOUND' }
          });
          return steps;
        } else if (midVal < target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) < target (${target}), target must lie in the right half. Discarding elements index 0 to ${mid}. Set low = mid + 1 = ${mid + 1}.`,
            line: 7,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target, action: 'Go Right' }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) > target (${target}), target must lie in the left half. Discarding elements index ${mid} to ${high}. Set high = mid - 1 = ${mid - 1}.`,
            line: 9,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target, action: 'Go Left' }
          });
          high = mid - 1;
        }
      }

      // Loop exited, not found
      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Loop terminated. low (${low}) > high (${high}). Target element ${target} is not present in the array.`,
        line: 13,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null', 'nums[mid]': 'N/A', target, status: 'NOT FOUND' }
      });
      break;
    }

    case 'lower-upper-bound': {
      const nums = inputArray as number[];
      const target = inputTarget;
      let low = 0;
      let high = nums.length - 1;
      let ans = nums.length;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize Lower Bound search. Target is ${target}. We seek the first element >= ${target}. Initialize ans = nums.size() = ${ans}.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans,
        variables: { low, high, mid: 'null', ans, target }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Loop condition check: low (${low}) <= high (${high}) is true.`,
          line: 3,
          found: false,
          foundIndex: null,
          ans,
          variables: { low, high, mid: 'null', ans, target }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute mid = ${mid}. Element is nums[${mid}] = ${midVal}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans,
          variables: { low, high, mid, 'nums[mid]': midVal, ans, target }
        });

        if (midVal >= target) {
          ans = mid;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) >= target (${target}), this is a candidate position. Record ans = ${mid}. Search smaller indices to see if there is an even earlier match. Set high = mid - 1 = ${mid - 1}.`,
            line: 5,
            found: false,
            foundIndex: null,
            ans,
            variables: { low, high, mid, 'nums[mid]': midVal, ans, target, action: 'Set high = mid - 1' }
          });
          high = mid - 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) < target (${target}), it cannot be the lower bound. Search larger indices. Set low = mid + 1 = ${mid + 1}.`,
            line: 8,
            found: false,
            foundIndex: null,
            ans,
            variables: { low, high, mid, 'nums[mid]': midVal, ans, target, action: 'Set low = mid + 1' }
          });
          low = mid + 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Search completed. First element >= target (${target}) is found at index ${ans} (value: ${ans < nums.length ? nums[ans] : 'N/A'}).`,
        line: 11,
        found: true,
        foundIndex: ans,
        ans,
        variables: { low, high, mid: 'null', ans, target, status: 'COMPLETED' }
      });
      break;
    }

    case 'search-insert': {
      const nums = inputArray as number[];
      const target = inputTarget;
      let low = 0;
      let high = nums.length - 1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize search for target insertion index. If found, returns index; else, returns insertion point.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null', target }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Loop check: low (${low}) <= high (${high}).`,
          line: 3,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid: 'null', target }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute mid = ${mid}. Value is nums[${mid}] = ${midVal}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, 'nums[mid]': midVal, target }
        });

        if (midVal === target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Target ${target} found at index ${mid}. We can immediately return this insertion index.`,
            line: 5,
            found: true,
            foundIndex: mid,
            ans: mid,
            variables: { low, high, mid, 'nums[mid]': midVal, target }
          });
          return steps;
        } else if (midVal < target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) < target (${target}), insert position must be to the right. Set low = mid + 1 = ${mid + 1}.`,
            line: 7,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) > target (${target}), insert position must be to the left. Set high = mid - 1 = ${mid - 1}.`,
            line: 9,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target }
          });
          high = mid - 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Target not found in array. Pointers crossed. The correct insertion index is low = ${low}.`,
        line: 13,
        found: true,
        foundIndex: low,
        ans: low,
        variables: { low, high, mid: 'null', target, ans: low }
      });
      break;
    }

    case 'first-last-pos': {
      const nums = inputArray as number[];
      const target = inputTarget;

      // Left Bound Search
      let low = 0;
      let high = nums.length - 1;
      let startAns = -1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Phase 1: Binary search to find the leftmost (first) position of target ${target}.`,
        line: 7,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null', first_pos: startAns, last_pos: -1, phase: 'FIND_FIRST' }
      });

      while (low <= high) {
        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `[FIND_FIRST] Mid index computed: mid = ${mid}. Element = ${midVal}.`,
          line: 9,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, 'nums[mid]': midVal, first_pos: startAns, last_pos: -1, phase: 'FIND_FIRST' }
        });

        if (midVal === target) {
          startAns = mid;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `[FIND_FIRST] Found target! Record start candidate index = ${mid}. Continue searching LEFT to find if there is an even earlier position. Set high = mid - 1 = ${mid - 1}.`,
            line: 10,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, first_pos: startAns, last_pos: -1, phase: 'FIND_FIRST' }
          });
          high = mid - 1;
        } else if (midVal < target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `[FIND_FIRST] nums[mid] (${midVal}) < target (${target}). Search right half. Set low = mid + 1 = ${mid + 1}.`,
            line: 14,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, first_pos: startAns, last_pos: -1, phase: 'FIND_FIRST' }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `[FIND_FIRST] nums[mid] (${midVal}) > target (${target}). Search left half. Set high = mid - 1 = ${mid - 1}.`,
            line: 16,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, first_pos: startAns, last_pos: -1, phase: 'FIND_FIRST' }
          });
          high = mid - 1;
        }
      }

      // Phase 2: Right Bound Search
      let startResult = startAns;
      let low2 = 0;
      let high2 = nums.length - 1;
      let endAns = -1;

      steps.push({
        low: low2,
        high: high2,
        mid: null,
        discardedRanges: [],
        description: `Phase 2: Binary search to find the rightmost (last) position of target ${target}. Leftmost found is ${startResult}.`,
        line: 8,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low: low2, high: high2, mid: 'null', first_pos: startResult, last_pos: endAns, phase: 'FIND_LAST' }
      });

      while (low2 <= high2) {
        const mid = Math.floor(low2 + (high2 - low2) / 2);
        const midVal = nums[mid];

        steps.push({
          low: low2,
          high: high2,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low2, high2),
          description: `[FIND_LAST] Mid index computed: mid = ${mid}. Element = ${midVal}.`,
          line: 9,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low: low2, high: high2, mid, 'nums[mid]': midVal, first_pos: startResult, last_pos: endAns, phase: 'FIND_LAST' }
        });

        if (midVal === target) {
          endAns = mid;
          steps.push({
            low: low2,
            high: high2,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low2, high2),
            description: `[FIND_LAST] Found target! Record end candidate index = ${mid}. Continue searching RIGHT to find if there is an even later position. Set low = mid + 1 = ${mid + 1}.`,
            line: 12,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low: low2, high: high2, mid, 'nums[mid]': midVal, first_pos: startResult, last_pos: endAns, phase: 'FIND_LAST' }
          });
          low2 = mid + 1;
        } else if (midVal < target) {
          steps.push({
            low: low2,
            high: high2,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low2, high2),
            description: `[FIND_LAST] nums[mid] (${midVal}) < target (${target}). Search right half. Set low = mid + 1 = ${mid + 1}.`,
            line: 14,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low: low2, high: high2, mid, 'nums[mid]': midVal, first_pos: startResult, last_pos: endAns, phase: 'FIND_LAST' }
          });
          low2 = mid + 1;
        } else {
          steps.push({
            low: low2,
            high: high2,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low2, high2),
            description: `[FIND_LAST] nums[mid] (${midVal}) > target (${target}). Search left half. Set high = mid - 1 = ${mid - 1}.`,
            line: 16,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low: low2, high: high2, mid, 'nums[mid]': midVal, first_pos: startResult, last_pos: endAns, phase: 'FIND_LAST' }
          });
          high2 = mid - 1;
        }
      }

      steps.push({
        low: low2,
        high: high2,
        mid: null,
        discardedRanges: [],
        description: `Dual search complete. Leftmost position of target is index ${startResult}, rightmost position is index ${endAns}. Return [${startResult}, ${endAns}].`,
        line: 3,
        found: true,
        foundIndex: [startResult, endAns],
        ans: startResult,
        variables: { first_pos: startResult, last_pos: endAns, result: `[${startResult}, ${endAns}]`, status: 'FINISHED' }
      });
      break;
    }

    case 'single-element-sorted': {
      const nums = inputArray as number[];
      let low = 0;
      let high = nums.length - 1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize parity-based search for single non-duplicate element.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null' }
      });

      while (low < high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Loop condition check: low (${low}) < high (${high}).`,
          line: 3,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid: 'null' }
        });

        let mid = Math.floor(low + (high - low) / 2);
        const originalMid = mid;

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute middle index mid = ${mid}. Element nums[${mid}] = ${nums[mid]}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, originalMid }
        });

        const isOdd = mid % 2 === 1;
        if (isOdd) {
          mid--;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since mid is odd (${originalMid}), align it to the even index (${mid}) to enforce the pair pattern check.`,
            line: 5,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, originalMid, aligned: true }
          });
        }

        if (nums[mid] === nums[mid + 1]) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `nums[mid] (${nums[mid]}) matches nums[mid+1] (${nums[mid+1]}). This means the odd element has not appeared yet in the left side. Go right. Set low = mid + 2 = ${mid + 2}.`,
            line: 6,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, originalMid, match: true }
          });
          low = mid + 2;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `nums[mid] (${nums[mid]}) does NOT match nums[mid+1] (${nums[mid+1]}). The single element must reside at or before this even-aligned index. Set high = mid = ${mid}.`,
            line: 8,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, originalMid, match: false }
          });
          high = mid;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Search completed. Pointers collapsed at index low = ${low}. The single element is nums[${low}] = ${nums[low]}.`,
        line: 12,
        found: true,
        foundIndex: low,
        ans: low,
        variables: { low, high, answer: nums[low] }
      });
      break;
    }

    // ==========================================
    // 2. Rotated & Mountain Arrays
    // ==========================================
    case 'search-rotated-1': {
      const nums = inputArray as number[];
      const target = inputTarget;
      let low = 0;
      let high = nums.length - 1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize search in Rotated Sorted Array.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null', target }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Check loop bounds: low (${low}) <= high (${high}).`,
          line: 3,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid: 'null', target }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute mid = ${mid}, value is nums[mid] = ${midVal}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, 'nums[mid]': midVal, target }
        });

        if (midVal === target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Target found at mid index ${mid}!`,
            line: 5,
            found: true,
            foundIndex: mid,
            ans: mid,
            variables: { low, high, mid, 'nums[mid]': midVal, target, status: 'FOUND' }
          });
          return steps;
        }

        // Left sorted check
        const isLeftSorted = nums[low] <= midVal;
        if (isLeftSorted) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[low] (${nums[low]}) <= nums[mid] (${midVal}), the left half [${low}...${mid}] is sorted. Checking if target (${target}) is inside this sorted range.`,
            line: 6,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target, isLeftSorted: 'YES' }
          });

          if (target >= nums[low] && target < midVal) {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target (${target}) is within sorted left range [${nums[low]} ... ${midVal}]. Discard right. Set high = mid - 1 = ${mid - 1}.`,
              line: 7,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, 'nums[mid]': midVal, target }
            });
            high = mid - 1;
          } else {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target (${target}) is NOT inside sorted left range. Target must be in right half. Set low = mid + 1 = ${mid + 1}.`,
              line: 9,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, 'nums[mid]': midVal, target }
            });
            low = mid + 1;
          }
        } else {
          // Right half is sorted
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[low] (${nums[low]}) > nums[mid] (${midVal}), the right half [${mid}...${high}] is sorted. Checking if target is within this sorted range.`,
            line: 11,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target, isLeftSorted: 'NO' }
          });

          if (target > midVal && target <= nums[high]) {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target (${target}) is within sorted right range [${midVal} ... ${nums[high]}]. Discard left. Set low = mid + 1 = ${mid + 1}.`,
              line: 12,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, 'nums[mid]': midVal, target }
            });
            low = mid + 1;
          } else {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target (${target}) is NOT inside sorted right range. Target must be in left half. Set high = mid - 1 = ${mid - 1}.`,
              line: 14,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, 'nums[mid]': midVal, target }
            });
            high = mid - 1;
          }
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Rotated search ended. Pointers crossed. Target not found.`,
        line: 19,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, target }
      });
      break;
    }

    case 'search-rotated-2': {
      const nums = inputArray as number[];
      const target = inputTarget;
      let low = 0;
      let high = nums.length - 1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize search in Rotated Sorted Array II (duplicates allowed).`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null', target }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Loop condition check: low (${low}) <= high (${high}).`,
          line: 3,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid: 'null', target }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute mid = ${mid}. Element is nums[mid] = ${midVal}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, 'nums[mid]': midVal, target }
        });

        if (midVal === target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Target (${target}) found at index ${mid}!`,
            line: 5,
            found: true,
            foundIndex: mid,
            ans: mid,
            variables: { low, high, mid, 'nums[mid]': midVal, target }
          });
          return steps;
        }

        // Duplicates check
        if (nums[low] === midVal && midVal === nums[high]) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `nums[low] == nums[mid] == nums[high] (${midVal}) is true. We cannot determine which half is sorted! Shrink search space by executing low++ and high--.`,
            line: 6,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target, duplicateShrink: true }
          });
          low++;
          high--;
          continue;
        }

        // Left sorted check
        const isLeftSorted = nums[low] <= midVal;
        if (isLeftSorted) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Left half [${low}...${mid}] is sorted. Checking if target lies within.`,
            line: 10,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target, isLeftSorted: 'YES' }
          });

          if (target >= nums[low] && target < midVal) {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target in sorted left range. Set high = mid - 1 = ${mid - 1}.`,
              line: 11,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, target }
            });
            high = mid - 1;
          } else {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target not in sorted left range. Set low = mid + 1 = ${mid + 1}.`,
              line: 12,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, target }
            });
            low = mid + 1;
          }
        } else {
          // Right half is sorted
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Right half [${mid}...${high}] is sorted. Checking if target lies within.`,
            line: 13,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high, mid, 'nums[mid]': midVal, target, isLeftSorted: 'NO' }
          });

          if (target > midVal && target <= nums[high]) {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target in sorted right range. Set low = mid + 1 = ${mid + 1}.`,
              line: 14,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, target }
            });
            low = mid + 1;
          } else {
            steps.push({
              low,
              high,
              mid,
              discardedRanges: getDiscarded1D(nums.length, low, high),
              description: `Target not in sorted right range. Set high = mid - 1 = ${mid - 1}.`,
              line: 15,
              found: false,
              foundIndex: null,
              ans: null,
              variables: { low, high, mid, target }
            });
            high = mid - 1;
          }
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Search completed. Target not found. Returning false.`,
        line: 19,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, target }
      });
      break;
    }

    case 'find-min-rotated': {
      const nums = inputArray as number[];
      let low = 0;
      let high = nums.length - 1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize search for Minimum in Rotated Sorted Array.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null' }
      });

      while (low < high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Loop condition check: low (${low}) < high (${high}).`,
          line: 3,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid: 'null' }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];
        const highVal = nums[high];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute mid = ${mid}. Elements are nums[mid] = ${midVal}, nums[high] = ${highVal}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, 'nums[mid]': midVal, 'nums[high]': highVal }
        });

        if (midVal > highVal) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) > nums[high] (${highVal}), the array is rotated and the minimum must reside in the right portion. Discard left. Set low = mid + 1 = ${mid + 1}.`,
            line: 5,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low: mid + 1, high, mid, 'nums[mid]': midVal }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) <= nums[high] (${highVal}), the right portion is sorted normally. The minimum lies at or before mid. Set high = mid = ${mid}.`,
            line: 7,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high: mid, mid, 'nums[mid]': midVal }
          });
          high = mid;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Minimum found! Pointers collapsed at index low = ${low}. Value is nums[${low}] = ${nums[low]}.`,
        line: 11,
        found: true,
        foundIndex: low,
        ans: low,
        variables: { low, high, minimum: nums[low] }
      });
      break;
    }

    case 'peak-mountain': {
      const nums = inputArray as number[];
      let low = 0;
      let high = nums.length - 1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize peak search in mountain array. Slope climbing visualizer active.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null' }
      });

      while (low < high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Loop condition check: low (${low}) < high (${high}).`,
          line: 3,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid: 'null' }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const midVal = nums[mid];
        const nextVal = nums[mid + 1];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(nums.length, low, high),
          description: `Compute mid = ${mid}. Compare nums[mid] (${midVal}) and nums[mid + 1] (${nextVal}).`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, mid, 'nums[mid]': midVal, 'nums[mid+1]': nextVal }
        });

        if (midVal < nextVal) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) < nums[mid+1] (${nextVal}), we are currently climbing UP on the left side of the mountain. The peak must be further to the right. Set low = mid + 1 = ${mid + 1}.`,
            line: 5,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low: mid + 1, high, mid }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(nums.length, low, high),
            description: `Since nums[mid] (${midVal}) >= nums[mid+1] (${nextVal}), we are sliding DOWN the right slope of the mountain. The peak could be mid itself or to the left. Set high = mid = ${mid}.`,
            line: 7,
            found: false,
            foundIndex: null,
            ans: null,
            variables: { low, high: mid, mid }
          });
          high = mid;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(nums.length, low, high),
        description: `Peak element located at index low = ${low}. Peak value is nums[${low}] = ${nums[low]}.`,
        line: 11,
        found: true,
        foundIndex: low,
        ans: low,
        variables: { low, high, peak_index: low, peak_value: nums[low] }
      });
      break;
    }

    // ==========================================
    // 3. 2D Matrix Binary Search
    // ==========================================
    case 'search-2d-matrix-1': {
      const matrix = inputArray as number[][];
      const target = inputTarget;
      const rows = matrix.length;
      const cols = matrix[0].length;
      const totalElements = rows * cols;
      let low = 0;
      let high = totalElements - 1;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Virtual 1D coordinate mapping. Total elements = ${rows} x ${cols} = ${totalElements}. Search space: [0 ... ${high}].`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, mid: 'null', rows, cols, target }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(totalElements, low, high),
          description: `Loop condition check: low (${low}) <= high (${high}).`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high, target }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const r = Math.floor(mid / cols);
        const c = mid % cols;
        const midVal = matrix[r][c];

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(totalElements, low, high),
          description: `Compute virtual mid = ${mid}. Mapping: row = mid / cols = ${r}, col = mid % cols = ${c}. Element matrix[${r}][${c}] = ${midVal}.`,
          line: 5,
          found: false,
          foundIndex: null,
          ans: null,
          row: r,
          col: c,
          variables: { low, high, mid, r, c, 'matrix[r][c]': midVal, target }
        });

        if (midVal === target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(totalElements, low, high),
            description: `Target ${target} found at matrix[${r}][${c}]!`,
            line: 7,
            found: true,
            foundIndex: [r, c],
            ans: mid,
            row: r,
            col: c,
            variables: { low, high, mid, r, c, 'matrix[r][c]': midVal, target }
          });
          return steps;
        } else if (midVal < target) {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(totalElements, low, high),
            description: `Since matrix[r][c] (${midVal}) < target (${target}), target must reside further right. Set low = mid + 1 = ${mid + 1}.`,
            line: 8,
            found: false,
            foundIndex: null,
            ans: null,
            row: r,
            col: c,
            variables: { low: mid + 1, high, mid, r, c, target }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(totalElements, low, high),
            description: `Since matrix[r][c] (${midVal}) > target (${target}), target must reside further left. Set high = mid - 1 = ${mid - 1}.`,
            line: 9,
            found: false,
            foundIndex: null,
            ans: null,
            row: r,
            col: c,
            variables: { low, high: mid - 1, mid, r, c, target }
          });
          high = mid - 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: getDiscarded1D(totalElements, low, high),
        description: `Search completed. Target not found.`,
        line: 11,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, target }
      });
      break;
    }

    case 'search-2d-matrix-2': {
      const matrix = inputArray as number[][];
      const target = inputTarget;
      const rows = matrix.length;
      const cols = matrix[0].length;

      let r = 0;
      let c = cols - 1;
      const eliminatedRows: number[] = [];
      const eliminatedCols: number[] = [];

      steps.push({
        low: 0,
        high: rows * cols - 1,
        mid: null,
        discardedRanges: [],
        description: `Start staircase search at the top-right corner: cell [row: 0, col: ${c}] = ${matrix[0][c]}.`,
        line: 3,
        found: false,
        foundIndex: null,
        ans: null,
        row: r,
        col: c,
        eliminatedRows: [...eliminatedRows],
        eliminatedCols: [...eliminatedCols],
        variables: { row: r, col: c, 'matrix[row][col]': matrix[r][c], target }
      });

      while (r < rows && c >= 0) {
        const val = matrix[r][c];

        steps.push({
          low: 0,
          high: rows * cols - 1,
          mid: null,
          discardedRanges: [],
          description: `Evaluating cell matrix[${r}][${c}] = ${val}.`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          row: r,
          col: c,
          eliminatedRows: [...eliminatedRows],
          eliminatedCols: [...eliminatedCols],
          variables: { row: r, col: c, 'matrix[row][col]': val, target }
        });

        if (val === target) {
          steps.push({
            low: 0,
            high: rows * cols - 1,
            mid: null,
            discardedRanges: [],
            description: `Target ${target} found in matrix at cell [${r}, ${c}]!`,
            line: 5,
            found: true,
            foundIndex: [r, c],
            ans: r * cols + c,
            row: r,
            col: c,
            eliminatedRows: [...eliminatedRows],
            eliminatedCols: [...eliminatedCols],
            variables: { row: r, col: c, 'matrix[row][col]': val, target }
          });
          return steps;
        } else if (val > target) {
          eliminatedCols.push(c);
          steps.push({
            low: 0,
            high: rows * cols - 1,
            mid: null,
            discardedRanges: [],
            description: `Since cell value (${val}) > target (${target}), and columns are sorted ascending, no element in column ${c} can be target. Eliminate column ${c}. Move LEFT (col--).`,
            line: 6,
            found: false,
            foundIndex: null,
            ans: null,
            row: r,
            col: c,
            eliminatedRows: [...eliminatedRows],
            eliminatedCols: [...eliminatedCols],
            variables: { row: r, col: c, 'matrix[row][col]': val, target, action: 'Eliminate Column' }
          });
          c--;
        } else {
          eliminatedRows.push(r);
          steps.push({
            low: 0,
            high: rows * cols - 1,
            mid: null,
            discardedRanges: [],
            description: `Since cell value (${val}) < target (${target}), and rows are sorted ascending, no element in row ${r} before column ${c} can be target. Eliminate row ${r}. Move DOWN (row++).`,
            line: 7,
            found: false,
            foundIndex: null,
            ans: null,
            row: r,
            col: c,
            eliminatedRows: [...eliminatedRows],
            eliminatedCols: [...eliminatedCols],
            variables: { row: r, col: c, 'matrix[row][col]': val, target, action: 'Eliminate Row' }
          });
          r++;
        }
      }

      steps.push({
        low: 0,
        high: rows * cols - 1,
        mid: null,
        discardedRanges: [],
        description: `Staircase boundary exceeded (row = ${r}, col = ${c}). Target ${target} not found in matrix.`,
        line: 9,
        found: false,
        foundIndex: null,
        ans: null,
        row: null,
        col: null,
        eliminatedRows: [...eliminatedRows],
        eliminatedCols: [...eliminatedCols],
        variables: { row: r, col: c, target }
      });
      break;
    }

    // ==========================================
    // 4. Binary Search on Answer / Predicate
    // ==========================================
    case 'integer-sqrt': {
      const x = extraParams.x ?? 45;
      let low = 1;
      let high = Math.floor(x / 2);
      let ans = 0;

      if (x < 2) {
        steps.push({
          low: x,
          high: x,
          mid: x,
          discardedRanges: [],
          description: `Since x = ${x} < 2, the square root of ${x} is trivially ${x}.`,
          line: 2,
          found: true,
          foundIndex: x,
          ans: x,
          variables: { x, ans: x }
        });
        return steps;
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Searching candidate integer square root in range [1 ... ${high}]. x = ${x}.`,
        line: 3,
        found: false,
        foundIndex: null,
        ans: 0,
        variables: { low, high, ans, x }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(high + 2, low, high),
          description: `Check loop range: low (${low}) <= high (${high}).`,
          line: 4,
          found: false,
          foundIndex: null,
          ans,
          variables: { low, high, ans, x }
        });

        const mid = Math.floor(low + (high - low) / 2);
        const sq = mid * mid;
        const feasible = sq <= x;

        const pred: PredicateState = {
          isPossible: feasible,
          explanation: `Is mid * mid <= x? ${mid} * ${mid} = ${sq} <= ${x} ? ${feasible ? 'YES' : 'NO'}`
        };

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(high + 2, low, high),
          description: `Compute candidate mid = ${mid}. Calculate mid^2 = ${sq}.`,
          line: 5,
          found: false,
          foundIndex: null,
          ans,
          predicateState: pred,
          variables: { low, high, mid, sq, ans, x }
        });

        if (feasible) {
          ans = mid;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 2, low, high),
            description: `Since mid^2 (${sq}) <= ${x}, mid = ${mid} is a valid integer square root. Record ans = ${mid}. Let's see if we can find a larger valid integer. Set low = mid + 1 = ${mid + 1}.`,
            line: 6,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, sq, ans, x }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 2, low, high),
            description: `Since mid^2 (${sq}) > ${x}, mid is too large. Discard larger values. Set high = mid - 1 = ${mid - 1}.`,
            line: 9,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, sq, ans, x }
          });
          high = mid - 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Search completed. The largest integer whose square <= ${x} is ans = ${ans}.`,
        line: 13,
        found: true,
        foundIndex: ans,
        ans,
        variables: { ans, x }
      });
      break;
    }

    case 'koko-bananas': {
      const piles = inputArray as number[];
      const h = extraParams.h ?? 8;
      let low = 1;
      let high = Math.max(...piles);
      let ans = high;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize search for minimum speed k. Range of speeds: [1 ... max_pile = ${high}]. Target hours = ${h}.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans,
        variables: { low, high, ans, h, piles: `[${piles.join(',')}]` }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Check speed range: low (${low}) <= high (${high}).`,
          line: 4,
          found: false,
          foundIndex: null,
          ans,
          variables: { low, high, ans, h }
        });

        const mid = Math.floor(low + (high - low) / 2);
        
        // Calculate hours spent
        let hoursSpent = 0;
        const subValues = piles.map(p => {
          const hours = Math.ceil(p / mid);
          hoursSpent += hours;
          return { label: `Pile ${p}`, value: `${hours}h (ceil(${p}/${mid}))` };
        });

        const isFeasible = hoursSpent <= h;

        const pred: PredicateState = {
          isPossible: isFeasible,
          explanation: `Total hours spent with speed ${mid} bananas/hr is ${hoursSpent}h. Limit: ${h}h.`,
          details: [
            { label: 'Current Speed (k)', value: mid },
            { label: 'Total Hours Spent', value: `${hoursSpent} hours` },
            { label: 'Hours Allowed (h)', value: h },
            { label: 'Feasibility Calculation', value: `Piles breakdown:`, subValues }
          ]
        };

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Evaluate speed mid = ${mid} banana/hour. Total hours spent: ${hoursSpent} hours.`,
          line: 5,
          found: false,
          foundIndex: null,
          ans,
          predicateState: pred,
          variables: { low, high, mid, hoursSpent, ans, h }
        });

        if (isFeasible) {
          ans = mid;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Hours spent (${hoursSpent}) <= Limit (${h}). Koko CAN finish all bananas at speed ${mid}. Record speed ${mid} as candidate. Search for smaller, slower speeds. Set high = mid - 1 = ${mid - 1}.`,
            line: 6,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, hoursSpent, ans, h }
          });
          high = mid - 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Hours spent (${hoursSpent}) > Limit (${h}). Koko CANNOT finish at speed ${mid}. We need a higher eating speed. Set low = mid + 1 = ${mid + 1}.`,
            line: 9,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, hoursSpent, ans, h }
          });
          low = mid + 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Search completed. The minimum speed Koko needs to eat all banana piles within ${h} hours is k = ${ans}.`,
        line: 13,
        found: true,
        foundIndex: ans,
        ans,
        variables: { minimum_speed: ans, h }
      });
      break;
    }

    case 'capacity-ship': {
      const weights = inputArray as number[];
      const days = extraParams.days ?? 5;
      let low = Math.max(...weights);
      let high = weights.reduce((a, b) => a + b, 0);
      let ans = high;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Initialize search for minimum shipping capacity. Range: [max_weight = ${low} ... total_weight = ${high}]. Days limit = ${days}.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans,
        variables: { low, high, ans, days, weights: `[${weights.join(',')}]` }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Check capacity range: low (${low}) <= high (${high}).`,
          line: 5,
          found: false,
          foundIndex: null,
          ans,
          variables: { low, high, ans, days }
        });

        const mid = Math.floor(low + (high - low) / 2);

        // Simulation of days grouping
        let daysCount = 1;
        let currentWeightSum = 0;
        const subValues: { label: string; value: string }[] = [];
        let dayWeightList: number[] = [];

        weights.forEach((w) => {
          if (currentWeightSum + w > mid) {
            subValues.push({ label: `Day ${daysCount}`, value: `Weights [${dayWeightList.join('+')}] = ${currentWeightSum} (Capacity limit ${mid})` });
            daysCount++;
            currentWeightSum = w;
            dayWeightList = [w];
          } else {
            currentWeightSum += w;
            dayWeightList.push(w);
          }
        });
        subValues.push({ label: `Day ${daysCount}`, value: `Weights [${dayWeightList.join('+')}] = ${currentWeightSum}` });

        const isFeasible = daysCount <= days;

        const pred: PredicateState = {
          isPossible: isFeasible,
          explanation: `Greedy allocation requires ${daysCount} days with capacity ${mid}. Days allowed: ${days}.`,
          details: [
            { label: 'Current Capacity', value: mid },
            { label: 'Days Required', value: daysCount },
            { label: 'Days Budget', value: days },
            { label: 'Daily Cargo Breakdown', value: `Cargo groupings:`, subValues }
          ]
        };

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Test capacity mid = ${mid}. Allocation results in ${daysCount} days.`,
          line: 6,
          found: false,
          foundIndex: null,
          ans,
          predicateState: pred,
          variables: { low, high, mid, daysCount, ans, days }
        });

        if (isFeasible) {
          ans = mid;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Required days (${daysCount}) <= Limit (${days}). Capacity is sufficient. Record ans = ${mid}. Try finding a smaller feasible capacity. Set high = mid - 1 = ${mid - 1}.`,
            line: 7,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, daysCount, ans, days }
          });
          high = mid - 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Required days (${daysCount}) > Limit (${days}). Capacity ${mid} is too small to ship within limit. Set low = mid + 1 = ${mid + 1}.`,
            line: 10,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, daysCount, ans, days }
          });
          low = mid + 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Ship capacity optimization complete. The minimum required capacity to ship packages in ${days} days is ${ans}.`,
        line: 14,
        found: true,
        foundIndex: ans,
        ans,
        variables: { minimum_capacity: ans, days }
      });
      break;
    }

    case 'split-array-sum': {
      const nums = inputArray as number[];
      const k = extraParams.k ?? 2;
      let low = Math.max(...nums);
      let high = nums.reduce((a, b) => a + b, 0);
      let ans = high;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Split Array Largest Sum: range [max_element = ${low} ... sum_elements = ${high}]. Subarrays split budget = ${k}.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans,
        variables: { low, high, ans, k }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Check target sum boundary: low (${low}) <= high (${high}).`,
          line: 5,
          found: false,
          foundIndex: null,
          ans,
          variables: { low, high, ans, k }
        });

        const mid = Math.floor(low + (high - low) / 2);

        // Simulation splits
        let splitsCount = 1;
        let currentSubarraySum = 0;
        const subValues: { label: string; value: string }[] = [];
        let items: number[] = [];

        nums.forEach((val) => {
          if (currentSubarraySum + val > mid) {
            subValues.push({ label: `Subarray ${splitsCount}`, value: `[${items.join(',')}] = ${currentSubarraySum} (Limit ${mid})` });
            splitsCount++;
            currentSubarraySum = val;
            items = [val];
          } else {
            currentSubarraySum += val;
            items.push(val);
          }
        });
        subValues.push({ label: `Subarray ${splitsCount}`, value: `[${items.join(',')}] = ${currentSubarraySum}` });

        const isFeasible = splitsCount <= k;

        const pred: PredicateState = {
          isPossible: isFeasible,
          explanation: `Using max subarray sum ${mid} requires ${splitsCount} segments. Segment budget k: ${k}.`,
          details: [
            { label: 'Current Max Sum Candidate (mid)', value: mid },
            { label: 'Segment Count Needed', value: splitsCount },
            { label: 'Segment Budget (k)', value: k },
            { label: 'Segment Splitting Logs', value: 'Partitions:', subValues }
          ]
        };

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Test max subarray sum limit mid = ${mid}. Needs ${splitsCount} segments.`,
          line: 6,
          found: false,
          foundIndex: null,
          ans,
          predicateState: pred,
          variables: { low, high, mid, splitsCount, ans, k }
        });

        if (isFeasible) {
          ans = mid;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Required segments (${splitsCount}) <= Budget (${k}). Sum limit ${mid} is feasible. Record ans = ${mid}. Try searching smaller limits on left. Set high = mid - 1 = ${mid - 1}.`,
            line: 7,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, splitsCount, ans, k }
          });
          high = mid - 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Required segments (${splitsCount}) > Budget (${k}). This sum limit ${mid} is too small to group items within segments limit. Need larger sum limit. Set low = mid + 1 = ${mid + 1}.`,
            line: 10,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, splitsCount, ans, k }
          });
          low = mid + 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Split Array optimization complete. The minimized largest subarray sum with ${k} partitions is ${ans}.`,
        line: 14,
        found: true,
        foundIndex: ans,
        ans,
        variables: { answer: ans, k }
      });
      break;
    }

    case 'aggressive-cows': {
      const stalls = [...(inputArray as number[])].sort((a, b) => a - b);
      const cows = extraParams.cows ?? 3;
      let low = 1;
      let high = stalls[stalls.length - 1] - stalls[0];
      let ans = 0;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Aggressive Cows Distance optimization. Stall coordinates sorted: [${stalls.join(',')}]. Range of possible distances: [1 ... ${high}]. Items to place: ${cows}.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans,
        variables: { low, high, ans, cows, stalls: `[${stalls.join(',')}]` }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Check distance limits: low (${low}) <= high (${high}).`,
          line: 4,
          found: false,
          foundIndex: null,
          ans,
          variables: { low, high, ans, cows }
        });

        const mid = Math.floor(low + (high - low) / 2);

        // Place cows greedily
        let cowsPlaced = 1;
        let lastPlacedPosition = stalls[0];
        const placementLogs: { label: string; value: string }[] = [
          { label: 'Cow 1', value: `Placed at Stall ${stalls[0]}` }
        ];

        for (let i = 1; i < stalls.length; i++) {
          if (stalls[i] - lastPlacedPosition >= mid) {
            cowsPlaced++;
            placementLogs.push({ label: `Cow ${cowsPlaced}`, value: `Placed at Stall ${stalls[i]} (distance ${stalls[i] - lastPlacedPosition} >= ${mid})` });
            lastPlacedPosition = stalls[i];
          }
        }

        const isFeasible = cowsPlaced >= cows;

        const pred: PredicateState = {
          isPossible: isFeasible,
          explanation: `Can we place ${cows} items with minimum distance >= ${mid}? Placed ${cowsPlaced} items.`,
          details: [
            { label: 'Tested Min Distance (mid)', value: mid },
            { label: 'Cows Placed', value: cowsPlaced },
            { label: 'Cows Required', value: cows },
            { label: 'Placement breakdown:', value: 'Locations:', subValues: placementLogs }
          ]
        };

        steps.push({
          low,
          high,
          mid,
          discardedRanges: getDiscarded1D(high + 1, low, high),
          description: `Test minimum separation distance mid = ${mid}. Greedily placed ${cowsPlaced} cows in stalls.`,
          line: 5,
          found: false,
          foundIndex: null,
          ans,
          predicateState: pred,
          variables: { low, high, mid, cowsPlaced, ans, cows }
        });

        if (isFeasible) {
          ans = mid;
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Placed (${cowsPlaced}) >= required (${cows}). Distance of ${mid} is feasible. Record ans = ${mid}. Search larger distances to maximize. Set low = mid + 1 = ${mid + 1}.`,
            line: 6,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, cowsPlaced, ans, cows }
          });
          low = mid + 1;
        } else {
          steps.push({
            low,
            high,
            mid,
            discardedRanges: getDiscarded1D(high + 1, low, high),
            description: `Only placed (${cowsPlaced}) < required (${cows}). Distance of ${mid} is too large. Reduce distance. Set high = mid - 1 = ${mid - 1}.`,
            line: 9,
            found: false,
            foundIndex: null,
            ans,
            predicateState: pred,
            variables: { low, high, mid, cowsPlaced, ans, cows }
          });
          high = mid - 1;
        }
      }

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Optimization complete. The maximized minimum distance between placed cows is ${ans}.`,
        line: 13,
        found: true,
        foundIndex: ans,
        ans,
        variables: { maximum_min_distance: ans, cows }
      });
      break;
    }

    case 'median-two-sorted': {
      // Median of Two Sorted Arrays
      const nums1 = inputArray as number[];
      // Support customizable second array via params
      const array2Val = extraParams.array2 ?? 7; 
      const nums2 = [2, 4, 6, 8, 10, 12].slice(0, array2Val); // Generate dynamic second array

      // Always perform binary search on smaller array
      const swapped = nums1.length > nums2.length;
      const A = swapped ? nums2 : nums1;
      const B = swapped ? nums1 : nums2;

      const m = A.length;
      const n = B.length;
      let low = 0;
      let high = m;

      steps.push({
        low,
        high,
        mid: null,
        discardedRanges: [],
        description: `Partition Binary Search. Ensure nums1 is smaller. Searching on smaller array size ${m}. Total sizes: m = ${m}, n = ${n}.`,
        line: 2,
        found: false,
        foundIndex: null,
        ans: null,
        variables: { low, high, m, n, swapped }
      });

      while (low <= high) {
        steps.push({
          low,
          high,
          mid: null,
          discardedRanges: getDiscarded1D(m + 1, low, high),
          description: `Loop checking range: low (${low}) <= high (${high}).`,
          line: 4,
          found: false,
          foundIndex: null,
          ans: null,
          variables: { low, high }
        });

        const i = Math.floor(low + (high - low) / 2);
        const j = Math.floor((m + n + 1) / 2) - i;

        const maxLeftA = i === 0 ? -Infinity : A[i - 1];
        const minRightA = i === m ? Infinity : A[i];
        const maxLeftB = j === 0 ? -Infinity : B[j - 1];
        const minRightB = j === n ? Infinity : B[j];

        const match = maxLeftA <= minRightB && maxLeftB <= minRightA;

        const pred: PredicateState = {
          isPossible: match,
          explanation: `Checking partition correctness: maxLeftA (${maxLeftA}) <= minRightB (${minRightB}) and maxLeftB (${maxLeftB}) <= minRightA (${minRightA})`,
          details: [
            { label: 'A Partition Index (i)', value: i },
            { label: 'B Partition Index (j)', value: j },
            { label: 'A Left Edge Max', value: maxLeftA === -Infinity ? '-INF' : maxLeftA },
            { label: 'A Right Edge Min', value: minRightA === Infinity ? 'INF' : minRightA },
            { label: 'B Left Edge Max', value: maxLeftB === -Infinity ? '-INF' : maxLeftB },
            { label: 'B Right Edge Min', value: minRightB === Infinity ? 'INF' : minRightB }
          ]
        };

        steps.push({
          low,
          high,
          mid: i,
          discardedRanges: getDiscarded1D(m + 1, low, high),
          description: `Compute partition index i = ${i} for Array A, which maps to partition index j = ${j} for Array B.`,
          line: 5,
          found: false,
          foundIndex: null,
          ans: null,
          predicateState: pred,
          variables: { i, j, maxLeftA, minRightA, maxLeftB, minRightB }
        });

        if (match) {
          let median: number;
          if ((m + n) % 2 === 1) {
            median = Math.max(maxLeftA, maxLeftB);
          } else {
            median = (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2;
          }

          steps.push({
            low,
            high,
            mid: i,
            discardedRanges: getDiscarded1D(m + 1, low, high),
            description: `Correct partition found! Elements on left are all <= elements on right. Median is computed: ${median}.`,
            line: 7,
            found: true,
            foundIndex: i,
            ans: median,
            predicateState: pred,
            variables: { i, j, maxLeftA, minRightA, maxLeftB, minRightB, median }
          });
          return steps;
        } else if (maxLeftA > minRightB) {
          steps.push({
            low,
            high,
            mid: i,
            discardedRanges: getDiscarded1D(m + 1, low, high),
            description: `Since maxLeftA (${maxLeftA}) > minRightB (${minRightB}), we have partition index i too far right in Array A. Reduce i. Set high = i - 1 = ${i - 1}.`,
            line: 10,
            found: false,
            foundIndex: null,
            ans: null,
            predicateState: pred,
            variables: { i, j, maxLeftA, minRightB }
          });
          high = i - 1;
        } else {
          steps.push({
            low,
            high,
            mid: i,
            discardedRanges: getDiscarded1D(m + 1, low, high),
            description: `Since maxLeftB (${maxLeftB}) > minRightA (${minRightA}), we have partition index i too far left in Array A. Increase i. Set low = i + 1 = ${i + 1}.`,
            line: 12,
            found: false,
            foundIndex: null,
            ans: null,
            predicateState: pred,
            variables: { i, j, maxLeftB, minRightA }
          });
          low = i + 1;
        }
      }

      break;
    }
  }

  return steps;
}
