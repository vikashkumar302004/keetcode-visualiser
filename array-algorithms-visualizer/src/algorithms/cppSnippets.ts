/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlgorithmId } from '../types';

export const cppSnippets: Record<AlgorithmId, string> = {
  'reverse-array': `void reverseArray(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;
    while (left < right) {
        swap(nums[left], nums[right]);
        left++;
        right--;
    }
}`,

  'rotate-array': `void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    k = k % n;
    if (k == 0) return;
    
    // Step 1: Reverse entire array
    reverse(nums.begin(), nums.end());
    
    // Step 2: Reverse first k elements
    reverse(nums.begin(), nums.begin() + k);
    
    // Step 3: Reverse remaining n-k elements
    reverse(nums.begin() + k, nums.end());
}`,

  'plus-one': `vector<int> plusOne(vector<int>& digits) {
    int n = digits.size();
    for (int i = n - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits;
        }
        digits[i] = 0;
    }
    digits.insert(digits.begin(), 1);
    return digits;
}`,

  'move-zeroes': `void moveZeroes(vector<int>& nums) {
    int lastNonZero = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != 0) {
            swap(nums[lastNonZero], nums[i]);
            lastNonZero++;
        }
    }
}`,

  'remove-duplicates': `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.size(); fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}`,

  'next-permutation': `void nextPermutation(vector<int>& nums) {
    int n = nums.size();
    int i = n - 2;
    // Step 1: Find first decreasing element from right
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    if (i >= 0) {
        // Step 2: Find element larger than nums[i] to swap
        int j = n - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        swap(nums[i], nums[j]);
    }
    // Step 3: Reverse suffix to get lexicographically smallest
    reverse(nums.begin() + i + 1, nums.end());
}`,

  'prev-permutation': `vector<int> prevPermOpt1(vector<int>& nums) {
    int n = nums.size();
    int i = n - 2;
    // Find rightmost dip nums[i] > nums[i+1]
    while (i >= 0 && nums[i] <= nums[i + 1]) {
        i--;
    }
    if (i < 0) return nums;
    
    // Find largest nums[j] < nums[i] that is closest
    int j = n - 1;
    while (nums[j] >= nums[i] || (j > 0 && nums[j] == nums[j - 1])) {
        j--;
    }
    while (nums[j] == nums[j - 1]) {
        j--;
    }
    
    swap(nums[i], nums[j]);
    return nums;
}`,

  'wiggle-sort': `void wiggleSort(vector<int>& nums) {
    for (int i = 0; i < (int)nums.size() - 1; i++) {
        if (i % 2 == 0) {
            if (nums[i] > nums[i + 1]) {
                swap(nums[i], nums[i + 1]);
            }
        } else {
            if (nums[i] < nums[i + 1]) {
                swap(nums[i], nums[i + 1]);
            }
        }
    }
}`,

  'sort-colors': `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`,

  'merge-sorted': `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int p1 = m - 1;
    int p2 = n - 1;
    int p = m + n - 1;
    
    while (p2 >= 0) {
        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
            nums1[p] = nums1[p1];
            p1--;
        } else {
            nums1[p] = nums2[p2];
            p2--;
        }
        p--;
    }
}`,

  'boyer-moore': `int majorityElement(vector<int>& nums) {
    int candidate = 0, count = 0;
    // Phase 1: Find candidate
    for (int num : nums) {
        if (count == 0) {
            candidate = num;
        }
        count += (num == candidate) ? 1 : -1;
    }
    return candidate; // Assumes majority always exists
}`,

  'boyer-moore-ii': `vector<int> majorityElementII(vector<int>& nums) {
    int cand1 = 0, cand2 = 1, count1 = 0, count2 = 0;
    for (int num : nums) {
        if (num == cand1) count1++;
        else if (num == cand2) count2++;
        else if (count1 == 0) { cand1 = num; count1 = 1; }
        else if (count2 == 0) { cand2 = num; count2 = 1; }
        else { count1--; count2--; }
    }
    // Verify votes
    count1 = count2 = 0;
    for (int num : nums) {
        if (num == cand1) count1++;
        else if (num == cand2) count2++;
    }
    vector<int> result;
    if (count1 > nums.size() / 3) result.push_back(cand1);
    if (count2 > nums.size() / 3) result.push_back(cand2);
    return result;
}`,

  'missing-number': `int missingNumber(vector<int>& nums) {
    int n = nums.size();
    int expectedSum = n * (n + 1) / 2;
    int actualSum = 0;
    for (int num : nums) {
        actualSum += num;
    }
    return expectedSum - actualSum;
}`,

  'disappeared-numbers': `vector<int> findDisappearedNumbers(vector<int>& nums) {
    for (int i = 0; i < nums.size(); i++) {
        int idx = abs(nums[i]) - 1;
        if (nums[idx] > 0) {
            nums[idx] = -nums[idx]; // Mark as negative
        }
    }
    vector<int> missing;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] > 0) {
            missing.push_back(i + 1);
        }
    }
    return missing;
}`,

  'product-except-self': `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> answer(n, 1);
    
    // Prefix products
    int prefix = 1;
    for (int i = 0; i < n; i++) {
        answer[i] = prefix;
        prefix *= nums[i];
    }
    
    // Suffix products
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= suffix;
        suffix *= nums[i];
    }
    return answer;
}`,

  'pascals-triangle': `vector<vector<int>> generate(int numRows) {
    vector<vector<int>> triangle;
    for (int i = 0; i < numRows; i++) {
        vector<int> row(i + 1, 1);
        for (int j = 1; j < i; j++) {
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }
        triangle.push_back(row);
    }
    return triangle;
}`,

  'set-matrix-zeroes': `void setZeroes(vector<vector<int>>& matrix) {
    int R = matrix.size();
    int C = matrix[0].size();
    bool firstRowZero = false;
    bool firstColZero = false;
    
    // Check first col
    for (int i = 0; i < R; i++)
        if (matrix[i][0] == 0) firstColZero = true;
        
    // Check first row
    for (int j = 0; j < C; j++)
        if (matrix[0][j] == 0) firstRowZero = true;
        
    // Use first row & first col as flags
    for (int i = 1; i < R; i++) {
        for (int j = 1; j < C; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    // Nullify cells based on flags
    for (int i = 1; i < R; i++)
        for (int j = 1; j < C; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0)
                matrix[i][j] = 0;
                
    // Nullify first row & col if needed
    if (firstRowZero)
        for (int j = 0; j < C; j++) matrix[0][j] = 0;
    if (firstColZero)
        for (int i = 0; i < R; i++) matrix[i][0] = 0;
}`,

  'rotate-image': `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Step 1: Transpose Matrix
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
    // Step 2: Reverse each row
    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}`,

  'spiral-matrix': `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    
    while (top <= bottom && left <= right) {
        // 1. Traverse Right
        for (int i = left; i <= right; i++) 
            result.push_back(matrix[top][i]);
        top++;
        
        // 2. Traverse Down
        for (int i = top; i <= bottom; i++) 
            result.push_back(matrix[i][right]);
        right--;
        
        // 3. Traverse Left
        if (top <= bottom) {
            for (int i = right; i >= left; i--) 
                result.push_back(matrix[bottom][i]);
            bottom--;
        }
        
        // 4. Traverse Up
        if (left <= right) {
            for (int i = bottom; i >= top; i--) 
                result.push_back(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
};
