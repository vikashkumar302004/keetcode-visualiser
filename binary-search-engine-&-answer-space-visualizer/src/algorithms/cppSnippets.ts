/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CodeSnippet {
  code: string;
  lines: string[];
}

export const CPP_SNIPPETS: Record<string, CodeSnippet> = {
  'binary-search': {
    code: `int binarySearch(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            return mid; // Found!
        } else if (nums[mid] < target) {
            low = mid + 1; // Go right
        } else {
            high = mid - 1; // Go left
        }
    }
    return -1; // Not found
}`,
    lines: [
      'int binarySearch(vector<int>& nums, int target) {',
      '    int low = 0, high = nums.size() - 1;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] == target) {',
      '            return mid; // Found!',
      '        } else if (nums[mid] < target) {',
      '            low = mid + 1; // Go right',
      '        } else {',
      '            high = mid - 1; // Go left',
      '        }',
      '    }',
      '    return -1; // Not found',
      '}'
    ]
  },
  'lower-upper-bound': {
    code: `int lowerBound(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1, ans = nums.size();
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] >= target) {
            ans = mid;      // Record candidate
            high = mid - 1; // Search smaller indices
        } else {
            low = mid + 1;  // Search larger indices
        }
    }
    return ans;
}`,
    lines: [
      'int lowerBound(vector<int>& nums, int target) {',
      '    int low = 0, high = nums.size() - 1, ans = nums.size();',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] >= target) {',
      '            ans = mid;      // Record candidate',
      '            high = mid - 1; // Search smaller indices',
      '        } else {',
      '            low = mid + 1;  // Search larger indices',
      '        }',
      '    }',
      '    return ans;',
      '}'
    ]
  },
  'search-insert': {
    code: `int searchInsert(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low; // insertion index
}`,
    lines: [
      'int searchInsert(vector<int>& nums, int target) {',
      '    int low = 0, high = nums.size() - 1;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] == target) {',
      '            return mid;',
      '        } else if (nums[mid] < target) {',
      '            low = mid + 1;',
      '        } else {',
      '            high = mid - 1;',
      '        }',
      '    }',
      '    return low; // insertion index',
      '}'
    ]
  },
  'first-last-pos': {
    code: `vector<int> searchRange(vector<int>& nums, int target) {
    int start = findBound(nums, target, true);  // Find first pos
    int end = findBound(nums, target, false);   // Find last pos
    return {start, end};
}

int findBound(vector<int>& nums, int target, bool isFirst) {
    int low = 0, high = nums.size() - 1, ans = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) {
            ans = mid;
            if (isFirst) high = mid - 1; // continue searching left
            else low = mid + 1;          // continue searching right
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}`,
    lines: [
      'vector<int> searchRange(vector<int>& nums, int target) {',
      '    int start = findBound(nums, target, true);',
      '    int end = findBound(nums, target, false);',
      '    return {start, end};',
      '}',
      'int findBound(vector<int>& nums, int target, bool isFirst) {',
      '    int low = 0, high = nums.size() - 1, ans = -1;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] == target) {',
      '            ans = mid;',
      '            if (isFirst) high = mid - 1;',
      '            else low = mid + 1;',
      '        } else if (nums[mid] < target) {',
      '            low = mid + 1;',
      '        } else {',
      '            high = mid - 1;',
      '        }',
      '    }',
      '    return ans;',
      '}'
    ]
  },
  'single-element-sorted': {
    code: `int singleNonDuplicate(vector<int>& nums) {
    int low = 0, high = nums.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (mid % 2 == 1) mid--; // align to even index
        if (nums[mid] == nums[mid + 1]) {
            low = mid + 2; // single element lies on right
        } else {
            high = mid;    // single element is mid or on left
        }
    }
    return nums[low];
}`,
    lines: [
      'int singleNonDuplicate(vector<int>& nums) {',
      '    int low = 0, high = nums.size() - 1;',
      '    while (low < high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (mid % 2 == 1) mid--; // align to even',
      '        if (nums[mid] == nums[mid + 1]) {',
      '            low = mid + 2; // right side',
      '        } else {',
      '            high = mid;    // left side',
      '        }',
      '    }',
      '    return nums[low];',
      '}'
    ]
  },
  'search-rotated-1': {
    code: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[low] <= nums[mid]) { // Left half sorted
            if (target >= nums[low] && target < nums[mid]) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        } else { // Right half sorted
            if (target > nums[mid] && target <= nums[high]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }
    return -1;
}`,
    lines: [
      'int search(vector<int>& nums, int target) {',
      '    int low = 0, high = nums.size() - 1;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] == target) return mid;',
      '        if (nums[low] <= nums[mid]) { // Left sorted',
      '            if (target >= nums[low] && target < nums[mid]) {',
      '                high = mid - 1;',
      '            } else {',
      '                low = mid + 1;',
      '            }',
      '        } else { // Right sorted',
      '            if (target > nums[mid] && target <= nums[high]) {',
      '                low = mid + 1;',
      '            } else {',
      '                high = mid - 1;',
      '            }',
      '        }',
      '    }',
      '    return -1;',
      '}'
    ]
  },
  'search-rotated-2': {
    code: `bool search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return true;
        if (nums[low] == nums[mid] && nums[mid] == nums[high]) {
            low++; high--; // duplicate shrink
            continue;
        }
        if (nums[low] <= nums[mid]) { // Left sorted
            if (target >= nums[low] && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else { // Right sorted
            if (target > nums[mid] && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return false;
}`,
    lines: [
      'bool search(vector<int>& nums, int target) {',
      '    int low = 0, high = nums.size() - 1;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] == target) return true;',
      '        if (nums[low] == nums[mid] && nums[mid] == nums[high]) {',
      '            low++; high--; // handle duplicates',
      '            continue;',
      '        }',
      '        if (nums[low] <= nums[mid]) { // Left sorted',
      '            if (target >= nums[low] && target < nums[mid]) high = mid - 1;',
      '            else low = mid + 1;',
      '        } else { // Right sorted',
      '            if (target > nums[mid] && target <= nums[high]) low = mid + 1;',
      '            else high = mid - 1;',
      '        }',
      '    }',
      '    return false;',
      '}'
    ]
  },
  'find-min-rotated': {
    code: `int findMin(vector<int>& nums) {
    int low = 0, high = nums.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] > nums[high]) {
            low = mid + 1; // min lies in right half
        } else {
            high = mid;    // min lies in left half (incl mid)
        }
    }
    return nums[low];
}`,
    lines: [
      'int findMin(vector<int>& nums) {',
      '    int low = 0, high = nums.size() - 1;',
      '    while (low < high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] > nums[high]) {',
      '            low = mid + 1; // min on right',
      '        } else {',
      '            high = mid;    // min on left',
      '        }',
      '    }',
      '    return nums[low];',
      '}'
    ]
  },
  'peak-mountain': {
    code: `int peakIndexInMountainArray(vector<int>& nums) {
    int low = 0, high = nums.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] < nums[mid + 1]) {
            low = mid + 1; // climbing up, peak on right
        } else {
            high = mid;    // sliding down, peak is mid or left
        }
    }
    return low;
}`,
    lines: [
      'int peakIndexInMountainArray(vector<int>& nums) {',
      '    int low = 0, high = nums.size() - 1;',
      '    while (low < high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (nums[mid] < nums[mid + 1]) {',
      '            low = mid + 1; // climbing up',
      '        } else {',
      '            high = mid;    // sliding down',
      '        }',
      '    }',
      '    return low;',
      '}'
    ]
  },
  'search-2d-matrix-1': {
    code: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows = matrix.size(), cols = matrix[0].size();
    int low = 0, high = rows * cols - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int r = mid / cols, c = mid % cols;
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}`,
    lines: [
      'bool searchMatrix(vector<vector<int>>& matrix, int target) {',
      '    int rows = matrix.size(), cols = matrix[0].size();',
      '    int low = 0, high = rows * cols - 1;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        int r = mid / cols, c = mid % cols;',
      '        if (matrix[r][c] == target) return true;',
      '        else if (matrix[r][c] < target) low = mid + 1;',
      '        else high = mid - 1;',
      '    }',
      '    return false;',
      '}'
    ]
  },
  'search-2d-matrix-2': {
    code: `bool searchMatrixII(vector<vector<int>>& matrix, int target) {
    int rows = matrix.size(), cols = matrix[0].size();
    int row = 0, col = cols - 1; // start top-right
    while (row < rows && col >= 0) {
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] > target) col--; // eliminate col
        else row++; // eliminate row
    }
    return false;
}`,
    lines: [
      'bool searchMatrixII(vector<vector<int>>& matrix, int target) {',
      '    int rows = matrix.size(), cols = matrix[0].size();',
      '    int row = 0, col = cols - 1; // top-right',
      '    while (row < rows && col >= 0) {',
      '        if (matrix[row][col] == target) return true;',
      '        else if (matrix[row][col] > target) col--;',
      '        else row++;',
      '    }',
      '    return false;',
      '}'
    ]
  },
  'integer-sqrt': {
    code: `int mySqrt(int x) {
    if (x < 2) return x;
    int low = 1, high = x / 2, ans = 0;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (mid * mid <= x) {
            ans = mid;      // candidate answer
            low = mid + 1;  // search larger values
        } else {
            high = mid - 1; // search smaller values
        }
    }
    return ans;
}`,
    lines: [
      'int mySqrt(int x) {',
      '    if (x < 2) return x;',
      '    int low = 1, high = x / 2, ans = 0;',
      '    while (low <= high) {',
      '        long long mid = low + (high - low) / 2;',
      '        if (mid * mid <= x) {',
      '            ans = mid;      // candidate',
      '            low = mid + 1;  // search larger',
      '        } else {',
      '            high = mid - 1; // search smaller',
      '        }',
      '    }',
      '    return ans;',
      '}'
    ]
  },
  'koko-bananas': {
    code: `int minEatingSpeed(vector<int>& piles, int h) {
    int low = 1, high = *max_element(piles.begin(), piles.end());
    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (isPossible(piles, mid, h)) {
            ans = mid;      // feasible speed
            high = mid - 1; // try smaller speed
        } else {
            low = mid + 1;  // need higher speed
        }
    }
    return ans;
}

bool isPossible(vector<int>& piles, int speed, int h) {
    int hoursSpent = 0;
    for (int p : piles) {
        hoursSpent += (p + speed - 1) / speed; // ceil(p / speed)
    }
    return hoursSpent <= h;
}`,
    lines: [
      'int minEatingSpeed(vector<int>& piles, int h) {',
      '    int low = 1, high = max(piles);',
      '    int ans = high;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (isPossible(piles, mid, h)) {',
      '            ans = mid;      // feasible',
      '            high = mid - 1; // try smaller',
      '        } else {',
      '            low = mid + 1;  // need higher',
      '        }',
      '    }',
      '    return ans;',
      '}'
    ]
  },
  'capacity-ship': {
    code: `int shipWithinDays(vector<int>& weights, int days) {
    int low = *max_element(weights.begin(), weights.end());
    int high = accumulate(weights.begin(), weights.end(), 0);
    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (isFeasible(weights, mid, days)) {
            ans = mid;      // feasible capacity
            high = mid - 1; // try smaller capacity
        } else {
            low = mid + 1;  // need larger capacity
        }
    }
    return ans;
}`,
    lines: [
      'int shipWithinDays(vector<int>& weights, int days) {',
      '    int low = max_element(weights), high = sum(weights);',
      '    int ans = high;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (isFeasible(weights, mid, days)) {',
      '            ans = mid;      // feasible',
      '            high = mid - 1; // try smaller',
      '        } else {',
      '            low = mid + 1;  // need larger',
      '        }',
      '    }',
      '    return ans;',
      '}'
    ]
  },
  'split-array-sum': {
    code: `int splitArray(vector<int>& nums, int k) {
    int low = *max_element(nums.begin(), nums.end());
    int high = accumulate(nums.begin(), nums.end(), 0);
    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canSplit(nums, mid, k)) {
            ans = mid;
            high = mid - 1; // try to minimize maximum sum
        } else {
            low = mid + 1;  // need larger max sum limit
        }
    }
    return ans;
}`,
    lines: [
      'int splitArray(vector<int>& nums, int k) {',
      '    int low = max(nums), high = sum(nums);',
      '    int ans = high;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (canSplit(nums, mid, k)) {',
      '            ans = mid;',
      '            high = mid - 1; // minimize sum',
      '        } else {',
      '            low = mid + 1;  // increase sum limit',
      '        }',
      '    }',
      '    return ans;',
      '}'
    ]
  },
  'aggressive-cows': {
    code: `int maxDistance(vector<int>& stalls, int cows) {
    sort(stalls.begin(), stalls.end());
    int low = 1, high = stalls.back() - stalls.front(), ans = 0;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canPlaceCows(stalls, mid, cows)) {
            ans = mid;     // candidate distance
            low = mid + 1; // try to maximize distance
        } else {
            high = mid - 1;// distance too large, go smaller
        }
    }
    return ans;
}`,
    lines: [
      'int maxDistance(vector<int>& stalls, int cows) {',
      '    sort(stalls.begin(), stalls.end());',
      '    int low = 1, high = max_dist, ans = 0;',
      '    while (low <= high) {',
      '        int mid = low + (high - low) / 2;',
      '        if (canPlaceCows(stalls, mid, cows)) {',
      '            ans = mid;     // candidate',
      '            low = mid + 1; // try larger dist',
      '        } else {',
      '            high = mid - 1;// try smaller dist',
      '        }',
      '    }',
      '    return ans;',
      '}'
    ]
  },
  'median-two-sorted': {
    code: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);
    int m = nums1.size(), n = nums2.size();
    int low = 0, high = m;
    while (low <= high) {
        int i = low + (high - low) / 2;
        int j = (m + n + 1) / 2 - i;
        int maxLeft1 = (i == 0) ? INT_MIN : nums1[i-1];
        int minRight1 = (i == m) ? INT_MAX : nums1[i];
        int maxLeft2 = (j == 0) ? INT_MIN : nums2[j-1];
        int minRight2 = (j == n) ? INT_MAX : nums2[j];
        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 == 1) return max(maxLeft1, maxLeft2);
            return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;
        } else if (maxLeft1 > minRight2) {
            high = i - 1; // too far right in nums1
        } else {
            low = i + 1;  // too far left in nums1
        }
    }
    return 0.0;
}`,
    lines: [
      'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {',
      '    if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);',
      '    int low = 0, high = m;',
      '    while (low <= high) {',
      '        int i = low + (high - low) / 2;',
      '        int j = (m + n + 1) / 2 - i;',
      '        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {',
      '            return median; // found partition!',
      '        } else if (maxLeft1 > minRight2) {',
      '            high = i - 1; // move left in nums1',
      '        } else {',
      '            low = i + 1;  // move right in nums1',
      '        }',
      '    }',
      '    return 0.0;',
      '}'
    ]
  }
};
