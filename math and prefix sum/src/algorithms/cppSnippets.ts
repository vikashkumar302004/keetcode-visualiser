export interface CppSnippet {
  code: string;
  lineDescriptions: Record<number, string>;
}

export const CPP_SNIPPETS: Record<string, CppSnippet> = {
  lc303: {
    code: `// Constructor precomputes prefix array of size N + 1
NumArray(vector<int>& nums) {
    int n = nums.size();
    prefix.resize(n + 1, 0);
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
}

// O(1) Range query using the sentinel index offset
int sumRange(int left, int right) {
    return prefix[right + 1] - prefix[left];
}`,
    lineDescriptions: {
      1: "Constructor initialized with input array",
      2: "Find input array size N",
      3: "Resize prefix sum array to N + 1 filled with 0s",
      4: "Loop through original array indices 0 to N-1",
      5: "Add current element to prefix[i] to populate prefix[i+1]",
      9: "Query range [L, R] requested",
      10: "Return difference of prefix[right + 1] and prefix[left]"
    }
  },
  lc1480: {
    code: `vector<int> runningSum(vector<int>& nums) {
    int n = nums.size();
    for (int i = 1; i < n; i++) {
        nums[i] = nums[i - 1] + nums[i];
    }
    return nums;
}`,
    lineDescriptions: {
      1: "Function runningSum returns cumulative array",
      2: "Find array size N",
      3: "Iterate from index 1 to N-1 (since index 0 is already runningSum[0])",
      4: "Add preceding runningSum directly to current element in-place",
      6: "Return the modified original array as cumulative running sums"
    }
  },
  lc724: {
    code: `int pivotIndex(vector<int>& nums) {
    int totalSum = 0;
    for (int x : nums) totalSum += x;
    
    int leftSum = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (leftSum == totalSum - leftSum - nums[i]) {
            return i;
        }
        leftSum += nums[i];
    }
    return -1;
}`,
    lineDescriptions: {
      1: "Function pivotIndex returns equilibrium index",
      2: "Initialize total sum of array elements",
      3: "Accumulate total sum of the array in O(N)",
      5: "Initialize left sum accumulator to 0",
      6: "Scan the array from left to right",
      7: "Check if leftSum equals rightSum (totalSum - leftSum - nums[i])",
      8: "If match found, index i is the pivot point",
      10: "Add current element to leftSum for next iteration",
      12: "Return -1 if no pivot index satisfies the balance constraint"
    }
  },
  lc238: {
    code: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, 1);
    
    // Pass 1: Prefix products stored directly in 'res'
    for (int i = 1; i < n; i++) {
        res[i] = res[i - 1] * nums[i - 1];
    }
    
    // Pass 2: Multiply with running suffix products
    int rightProduct = 1;
    for (int i = n - 1; i >= 0; i--) {
        res[i] = res[i] * rightProduct;
        rightProduct *= nums[i];
    }
    return res;
}`,
    lineDescriptions: {
      1: "Function productExceptSelf returns array of products",
      2: "Find size of original array",
      3: "Initialize results array of size N with 1",
      6: "Scan left to right from index 1 to N-1",
      7: "Accumulate prefix product of elements up to index i-1",
      11: "Initialize suffix tracker rightProduct to 1",
      12: "Scan right to left from index N-1 down to 0",
      13: "Multiply prefix product at index i with running suffix product",
      14: "Update running suffix product with current element nums[i]",
      16: "Return final product array in O(N) time and O(1) auxiliary space"
    }
  },
  lc42: {
    code: `int trap(vector<int>& height) {
    int n = height.size();
    vector<int> leftMax(n), rightMax(n);
    
    leftMax[0] = height[0];
    for (int i = 1; i < n; i++) {
        leftMax[i] = max(leftMax[i - 1], height[i]);
    }
    
    rightMax[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--) {
        rightMax[i] = max(rightMax[i + 1], height[i]);
    }
    
    int ans = 0;
    for (int i = 0; i < n; i++) {
        ans += min(leftMax[i], rightMax[i]) - height[i];
    }
    return ans;
}`,
    lineDescriptions: {
      1: "Function trap calculates total water volume trapped",
      2: "Find size N of the elevation profile",
      3: "Initialize leftMax prefix array and rightMax suffix array",
      5: "Base case: leftMax[0] is heights[0]",
      6: "Scan left to right from index 1 to N-1",
      7: "Accumulate current left boundary prefix maximum",
      10: "Base case: rightMax[N-1] is heights[N-1]",
      11: "Scan right to left from index N-2 down to 0",
      12: "Accumulate current right boundary suffix maximum",
      15: "Initialize accumulated trapped water answer to 0",
      16: "Loop through columns to calculate trapped water height",
      17: "Calculate local column water level and add to total sum",
      19: "Return final computed trapped water volume"
    }
  },
  lc560: {
    code: `int subarraySum(vector<int>& nums, int k) {
    int count = 0, currSum = 0;
    unordered_map<int, int> prefixFreq;
    prefixFreq[0] = 1; // Sentinel for empty prefix sum
    
    for (int i = 0; i < nums.size(); i++) {
        currSum += nums[i];
        if (prefixFreq.count(currSum - k)) {
            count += prefixFreq[currSum - k];
        }
        prefixFreq[currSum]++;
    }
    return count;
}`,
    lineDescriptions: {
      1: "Function subarraySum calculates total intervals with sum K",
      2: "Initialize total subarray count and running sum to 0",
      3: "Declare hash map to store seen prefix sums and their frequencies",
      4: "Add sentinel 0 into map with a count of 1 (empty prefix representation)",
      6: "Scan the input array from index 0 to N-1",
      7: "Add current element to running sum",
      8: "Check if (currSum - k) exists in our frequency map",
      9: "Increment total count by occurrences of (currSum - k) seen so far",
      11: "Record the newly encountered prefix sum frequency in map",
      13: "Return total count of valid subarrays"
    }
  },
  lc523: {
    code: `bool checkSubarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> remMap;
    remMap[0] = -1; // Sentinel for modulo remainder 0 at offset -1
    int currSum = 0;
    
    for (int i = 0; i < nums.size(); i++) {
        currSum += nums[i];
        int rem = currSum % k;
        if (remMap.count(rem)) {
            if (i - remMap[rem] >= 2) return true;
        } else {
            remMap[rem] = i;
        }
    }
    return false;
}`,
    lineDescriptions: {
      1: "Function checkSubarraySum returns boolean",
      2: "Declare hash map mapping remainders to their first seen index",
      3: "Initialize remainder 0 at index -1 to allow whole prefix divisibility",
      4: "Initialize cumulative prefix sum tracker",
      6: "Iterate over original array indices",
      7: "Accumulate elements into prefix sum",
      8: "Obtain current remainder of running sum modulo divisor K",
      9: "Verify if remainder has been encountered earlier",
      10: "If index difference is at least 2, return true",
      12: "Save current index as first seen location for remainder",
      15: "Return false if search exhausts without matching segment"
    }
  },
  lc525: {
    code: `int findMaxLength(vector<int>& nums) {
    unordered_map<int, int> sumIndexMap;
    sumIndexMap[0] = -1; // Sentinel prefix sum 0 at index -1
    int maxLen = 0, currSum = 0;
    
    for (int i = 0; i < nums.size(); i++) {
        currSum += (nums[i] == 1) ? 1 : -1;
        if (sumIndexMap.count(currSum)) {
            maxLen = max(maxLen, i - sumIndexMap[currSum]);
        } else {
            sumIndexMap[currSum] = i;
        }
    }
    return maxLen;
}`,
    lineDescriptions: {
      1: "Function findMaxLength finds longest equal subsegment",
      2: "Map tracking earliest index for each cumulative sum",
      3: "Set sentinel prefix sum 0 at index -1 to handle full range",
      4: "Initialize max length tracker and running balance to 0",
      6: "Scan the array",
      7: "Increment sum for 1, decrement sum for 0 (transforming 0 to -1)",
      8: "Check if the same net balance has been recorded before",
      9: "Compute interval length and update maxLen",
      11: "Record the current index as the earliest occurrence",
      14: "Return the maximum subsegment length found"
    }
  },
  lc370: {
    code: `vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {
    vector<int> diff(length, 0);
    for (auto& update : updates) {
        int start = update[0], end = update[1], val = update[2];
        diff[start] += val;
        if (end + 1 < length) {
            diff[end + 1] -= val;
        }
    }
    // Reconstruct modified array via prefix sums of differences
    for (int i = 1; i < length; i++) {
        diff[i] += diff[i - 1];
    }
    return diff;
}`,
    lineDescriptions: {
      1: "Function getModifiedArray returns constructed results",
      2: "Initialize a difference array of specified length with 0s",
      3: "Iterate through each update range instruction",
      4: "Destructure the update variables [L, R, value]",
      5: "Add value to boundary L to trigger increment starting here",
      6: "If R+1 is in array bounds, decrement boundary R+1",
      11: "Apply sequential prefix sum sweep to resolve updates in O(N)",
      12: "Accumulate preceding difference array cell in-place",
      14: "Return reconstructed array with all range additions resolved"
    }
  },
  gcd: {
    code: `int getGcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
    lineDescriptions: {
      1: "Function getGcd computes GCD of (a, b)",
      2: "Iterate until remainder / divisor becomes 0",
      3: "Store current divisor in temporary variable",
      4: "Update divisor to be the remainder (a % b)",
      5: "Set current dividend a to the previous divisor stored in temp",
      7: "Return dividend 'a' which is the greatest common divisor"
    }
  },
  lc204: {
    code: `int countPrimes(int n) {
    if (n <= 2) return 0;
    vector<bool> isPrime(n, true);
    isPrime[0] = isPrime[1] = false;
    
    for (int p = 2; p * p < n; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i < n; i += p) {
                isPrime[i] = false;
            }
        }
    }
    // Count remainders
    int count = 0;
    for (int i = 2; i < n; i++) {
        if (isPrime[i]) count++;
    }
    return count;
}`,
    lineDescriptions: {
      1: "Function countPrimes counts primes strictly less than N",
      2: "Return 0 immediately if input is less than or equal to 2",
      3: "Initialize boolean Sieve array of size N to true",
      4: "Flag index 0 and 1 as false (not prime)",
      6: "Iterate prime candidate p from 2 up to sqrt(N)",
      7: "If candidate p is verified as prime",
      8: "Eliminate multiples starting from p*p in steps of p",
      9: "Flag multiple index i as composite (false)",
      14: "Initialize counter",
      15: "Scan Sieve to count elements remaining marked as true",
      17: "Return total count of primes found"
    }
  },
  lc50: {
    code: `long long modularPow(long long base, long long exp, long long mod) {
    long long ans = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp & 1) {
            ans = (ans * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp >> 1;
    }
    return ans;
}`,
    lineDescriptions: {
      1: "Function modularPow calculates modular power (base^exp) % mod",
      2: "Initialize accumulator ans to 1",
      3: "Pre-reduce base with modulo",
      4: "Loop until all bits of the exponent are processed",
      5: "Bitwise check if the current lowest bit of exponent is 1",
      6: "Multiply current base power to answer under modulo",
      8: "Square the current base power under modulo",
      9: "Bit-shift exponent right by 1 to process next bit",
      11: "Return computed modular answer"
    }
  },
  lc9: {
    code: `bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    
    int reversedNum = 0;
    while (x > reversedNum) {
        reversedNum = reversedNum * 10 + x % 10;
        x /= 10;
    }
    return x == reversedNum || x == reversedNum / 10;
}`,
    lineDescriptions: {
      1: "Function isPalindrome returns true/false without string convert",
      2: "Negative numbers or numbers ending in 0 (except 0) are not palindromes",
      4: "Initialize reversed second-half variable to 0",
      5: "Loop until we reach middle of the number (x <= reversedNum)",
      6: "Extract last digit, shift reversedNum left, and append digit",
      7: "Trunk last digit of x by dividing by 10",
      9: "Match first half with second half (handling even/odd digit cases)"
    }
  },
  lc7: {
    code: `int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int pop = x % 10;
        x /= 10;
        if (rev > INT_MAX/10 || (rev == INT_MAX/10 && pop > 7)) return 0;
        if (rev < INT_MIN/10 || (rev == INT_MIN/10 && pop < -8)) return 0;
        rev = rev * 10 + pop;
    }
    return rev;
}`,
    lineDescriptions: {
      1: "Function reverse returns reversed digits or 0 on overflow",
      2: "Initialize reversed value accumulator",
      3: "Process digits until input is reduced to 0",
      4: "Pop the last digit",
      5: "Reduce x",
      6: "Check if multiplying by 10 exceeds positive 32-bit bound",
      7: "Check if multiplying by 10 exceeds negative 32-bit bound",
      8: "Commit multiplication and add the popped digit",
      10: "Return fully reversed integer"
    }
  },
  lc172: {
    code: `int trailingZeroes(int n) {
    int count = 0;
    while (n >= 5) {
        count += n / 5;
        n /= 5;
    }
    return count;
}`,
    lineDescriptions: {
      1: "Function trailingZeroes counts factors of 5 in n!",
      2: "Initialize prime factor 5 count to 0",
      3: "While denominator is less than or equal to n",
      4: "Accumulate total multiples of current power of 5 in range",
      5: "Divide n by 5 to move to next exponent power (5^2, 5^3...)",
      7: "Return the accumulated trailing zero count"
    }
  },
  lc171_168: {
    code: `int titleToNumber(string s) {
    int result = 0;
    for (char c : s) {
        int d = c - 'A' + 1;
        result = result * 26 + d;
    }
    return result;
}`,
    lineDescriptions: {
      1: "Function titleToNumber converts title to numeric index",
      2: "Initialize column index count to 0",
      3: "Traverse each character of column string from left to right",
      4: "Find numeric representation (A=1, B=2 ... Z=26)",
      5: "Accumulate base-26 positional value in O(N)",
      7: "Return total integer column code value"
    }
  }
};
