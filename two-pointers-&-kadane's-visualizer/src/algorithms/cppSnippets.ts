export const cppSnippets: Record<string, string> = {
  'two-sum-ii': `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;
    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        if (currentSum == target) {
            return {left + 1, right + 1};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {};
}`,

  'valid-palindrome': `bool isPalindrome(string s) {
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) {
            left++;
        }
        while (left < right && !isalnum(s[right])) {
            right--;
        }
        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,

  'reverse-string': `void reverseString(vector<char>& s) {
    int left = 0;
    int right = s.size() - 1;
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}`,

  'container-with-most-water': `int maxArea(vector<int>& height) {
    int left = 0;
    int right = height.size() - 1;
    int maxArea = 0;
    while (left < right) {
        int width = right - left;
        int currentArea = min(height[left], height[right]) * width;
        maxArea = max(maxArea, currentArea);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}`,

  '3sum': `vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>> res;
    sort(nums.begin(), nums.end());
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int left = i + 1;
        int right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                res.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                left++; right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return res;
}`,

  '4sum': `vector<vector<int>> fourSum(vector<int>& nums, int target) {
    vector<vector<int>> res;
    sort(nums.begin(), nums.end());
    int n = nums.size();
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j-1]) continue;
            int left = j + 1, right = n - 1;
            while (left < right) {
                long long sum = (long long)nums[i] + nums[j] + nums[left] + nums[right];
                if (sum == target) {
                    res.push_back({nums[i], nums[j], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left+1]) left++;
                    while (left < right && nums[right] == nums[right-1]) right--;
                    left++; right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }
    return res;
}`,

  'trapping-rain-water': `int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0;
    int totalWater = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }
    return totalWater;
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

  'move-zeroes': `void moveZeroes(vector<int>& nums) {
    int slow = 0;
    for (int fast = 0; fast < nums.size(); fast++) {
        if (nums[fast] != 0) {
            swap(nums[slow], nums[fast]);
            slow++;
        }
    }
}`,

  'sort-colors': `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0;
    int high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`,

  'linked-list-cycle': `bool hasCycle(ListNode *head) {
    ListNode *slow = head;
    ListNode *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}`,

  'middle-of-linked-list': `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head;
    ListNode *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,

  'maximum-subarray': `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    int start = 0, bestStart = 0, bestEnd = 0;
    for (int i = 1; i < nums.size(); i++) {
        if (currentSum < 0) {
            currentSum = nums[i];
            start = i;
        } else {
            currentSum += nums[i];
        }
        if (currentSum > maxSum) {
            maxSum = currentSum;
            bestStart = start;
            bestEnd = i;
        }
    }
    return maxSum;
}`,

  'maximum-sum-circular-subarray': `int maxSubarraySumCircular(vector<int>& nums) {
    int totalSum = 0;
    int currentMax = 0, maxSoFar = nums[0];
    int currentMin = 0, minSoFar = nums[0];
    for (int x : nums) {
        totalSum += x;
        currentMax = max(x, currentMax + x);
        maxSoFar = max(maxSoFar, currentMax);
        currentMin = min(x, currentMin + x);
        minSoFar = min(minSoFar, currentMin);
    }
    if (maxSoFar < 0) return maxSoFar;
    return max(maxSoFar, totalSum - minSoFar);
}`,

  'maximum-product-subarray': `int maxProduct(vector<int>& nums) {
    int maxProd = nums[0];
    int minProd = nums[0];
    int result = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        int x = nums[i];
        if (x < 0) {
            swap(maxProd, minProd);
        }
        maxProd = max(x, maxProd * x);
        minProd = min(x, minProd * x);
        result = max(result, maxProd);
    }
    return result;
}`,

  'best-time-to-buy-and-sell-stock': `int maxProfit(vector<int>& prices) {
    int minPrice = prices[0];
    int maxProfit = 0;
    for (int i = 1; i < prices.size(); i++) {
        minPrice = min(minPrice, prices[i]);
        maxProfit = max(maxProfit, prices[i] - minPrice);
    }
    return maxProfit;
}`,

  'maximum-absolute-sum-of-any-subarray': `int maxAbsoluteSum(vector<int>& nums) {
    int currentMax = 0, maxSoFar = 0;
    int currentMin = 0, minSoFar = 0;
    for (int x : nums) {
        currentMax = max(0, currentMax + x);
        maxSoFar = max(maxSoFar, currentMax);
        currentMin = min(0, currentMin + x);
        minSoFar = min(minSoFar, currentMin);
    }
    return max(maxSoFar, abs(minSoFar));
}`
};
