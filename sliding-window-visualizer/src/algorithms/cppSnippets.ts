export interface CppSnippet {
  code: string;
  lines: string[];
}

export const CPP_SNIPPETS: Record<string, CppSnippet> = {
  'max-sum-subarray-k': {
    code: `class Solution {
public:
    int maximumSumSubarray(vector<int>& nums, int k) {
        int n = nums.size();
        if (n < k) return 0;
        int windowSum = 0;
        for (int i = 0; i < k; ++i) {
            windowSum += nums[i];
        }
        int maxSum = windowSum;
        int L = 0;
        for (int R = k; R < n; ++R) {
            windowSum += nums[R] - nums[L];
            maxSum = max(maxSum, windowSum);
            L++;
        }
        return maxSum;
    }
};`,
    lines: []
  },
  'first-negative-integer-k': {
    code: `class Solution {
public:
    vector<int> firstNegativeInWindow(vector<int>& nums, int k) {
        int n = nums.size();
        queue<int> negQueue;
        vector<int> result;
        int L = 0;
        for (int R = 0; R < n; ++R) {
            if (nums[R] < 0) negQueue.push(R);
            if (R - L + 1 == k) {
                while (!negQueue.empty() && negQueue.front() < L) {
                    negQueue.pop();
                }
                result.push_back(negQueue.empty() ? 0 : nums[negQueue.front()]);
                L++;
            }
        }
        return result;
    }
};`,
    lines: []
  },
  'subarrays-k-avg-threshold': {
    code: `class Solution {
public:
    int numOfSubarrays(vector<int>& arr, int k, int threshold) {
        int n = arr.size();
        int targetSum = k * threshold;
        int windowSum = 0;
        int count = 0;
        for (int i = 0; i < k; ++i) windowSum += arr[i];
        if (windowSum >= targetSum) count++;
        int L = 0;
        for (int R = k; R < n; ++R) {
            windowSum += arr[R] - arr[L];
            if (windowSum >= targetSum) count++;
            L++;
        }
        return count;
    }
};`,
    lines: []
  },
  'max-vowels-in-substring': {
    code: `class Solution {
public:
    bool isVowel(char c) {
        c = tolower(c);
        return c=='a' || c=='e' || c=='i' || c=='o' || c=='u';
    }
    int maxVowels(string s, int k) {
        int n = s.size();
        int vowelCount = 0;
        for (int i = 0; i < k; ++i) {
            if (isVowel(s[i])) vowelCount++;
        }
        int maxV = vowelCount;
        int L = 0;
        for (int R = k; R < n; ++R) {
            if (isVowel(s[R])) vowelCount++;
            if (isVowel(s[L])) vowelCount--;
            maxV = max(maxV, vowelCount);
            L++;
        }
        return maxV;
    }
};`,
    lines: []
  },
  'sliding-window-maximum': {
    code: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq; // stores indices
        vector<int> result;
        int L = 0;
        for (int R = 0; R < nums.size(); ++R) {
            while (!dq.empty() && nums[dq.back()] <= nums[R]) {
                dq.pop_back();
            }
            dq.push_back(R);
            if (dq.front() < L) dq.pop_front();
            if (R - L + 1 == k) {
                result.push_back(nums[dq.front()]);
                L++;
            }
        }
        return result;
    }
};`,
    lines: []
  },
  'min-size-subarray-sum': {
    code: `class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        int minLen = INT_MAX;
        int windowSum = 0;
        int L = 0;
        for (int R = 0; R < n; ++R) {
            windowSum += nums[R];
            while (windowSum >= target) {
                minLen = min(minLen, R - L + 1);
                windowSum -= nums[L];
                L++;
            }
        }
        return (minLen == INT_MAX) ? 0 : minLen;
    }
};`,
    lines: []
  },
  'longest-substring-no-repeat': {
    code: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> freq;
        int maxLen = 0;
        int L = 0;
        for (int R = 0; R < s.size(); ++R) {
            freq[s[R]]++;
            while (freq[s[R]] > 1) {
                freq[s[L]]--;
                L++;
            }
            maxLen = max(maxLen, R - L + 1);
        }
        return maxLen;
    }
};`,
    lines: []
  },
  'longest-substring-k-distinct': {
    code: `class Solution {
public:
    int lengthOfLongestSubstringKDistinct(string s, int k) {
        if (k == 0) return 0;
        unordered_map<char, int> count;
        int maxLen = 0, L = 0;
        for (int R = 0; R < s.size(); ++R) {
            count[s[R]]++;
            while (count.size() > k) {
                count[s[L]]--;
                if (count[s[L]] == 0) count.erase(s[L]);
                L++;
            }
            maxLen = max(maxLen, R - L + 1);
        }
        return maxLen;
    }
};`,
    lines: []
  },
  'fruit-into-baskets': {
    code: `class Solution {
public:
    int totalFruit(vector<int>& fruits) {
        unordered_map<int, int> basket;
        int maxFruits = 0;
        int L = 0;
        for (int R = 0; R < fruits.size(); ++R) {
            basket[fruits[R]]++;
            while (basket.size() > 2) {
                basket[fruits[L]]--;
                if (basket[fruits[L]] == 0) basket.erase(fruits[L]);
                L++;
            }
            maxFruits = max(maxFruits, R - L + 1);
        }
        return maxFruits;
    }
};`,
    lines: []
  },
  'max-consecutive-ones-iii': {
    code: `class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int zeroCount = 0;
        int maxConsecutive = 0;
        int L = 0;
        for (int R = 0; R < nums.size(); ++R) {
            if (nums[R] == 0) zeroCount++;
            while (zeroCount > k) {
                if (nums[L] == 0) zeroCount--;
                L++;
            }
            maxConsecutive = max(maxConsecutive, R - L + 1);
        }
        return maxConsecutive;
    }
};`,
    lines: []
  },
  'longest-repeating-char-replacement': {
    code: `class Solution {
public:
    int characterReplacement(string s, int k) {
        unordered_map<char, int> count;
        int maxFreq = 0;
        int maxLen = 0;
        int L = 0;
        for (int R = 0; R < s.size(); ++R) {
            count[s[R]]++;
            maxFreq = max(maxFreq, count[s[R]]);
            while ((R - L + 1) - maxFreq > k) {
                count[s[L]]--;
                L++;
            }
            maxLen = max(maxLen, R - L + 1);
        }
        return maxLen;
    }
};`,
    lines: []
  },
  'permutation-in-string': {
    code: `class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.size() > s2.size()) return false;
        vector<int> target(26, 0), window(26, 0);
        for (char c : s1) target[c - 'a']++;
        int k = s1.size();
        int L = 0;
        for (int R = 0; R < s2.size(); ++R) {
            window[s2[R] - 'a']++;
            if (R - L + 1 > k) {
                window[s2[L] - 'a']--;
                L++;
            }
            if (R - L + 1 == k && window == target) {
                return true;
            }
        }
        return false;
    }
};`,
    lines: []
  },
  'minimum-window-substring': {
    code: `class Solution {
public:
    string minWindow(string s, string t) {
        unordered_map<char, int> targetFreq, windowFreq;
        for (char c : t) targetFreq[c]++;
        int required = targetFreq.size();
        int matched = 0;
        int minLen = INT_MAX, bestL = 0;
        int L = 0;
        for (int R = 0; R < s.size(); ++R) {
            char c = s[R];
            windowFreq[c]++;
            if (targetFreq.count(c) && windowFreq[c] == targetFreq[c]) {
                matched++;
            }
            while (matched == required) {
                if (R - L + 1 < minLen) {
                    minLen = R - L + 1;
                    bestL = L;
                }
                char leftChar = s[L];
                windowFreq[leftChar]--;
                if (targetFreq.count(leftChar) && windowFreq[leftChar] < targetFreq[leftChar]) {
                    matched--;
                }
                L++;
            }
        }
        return (minLen == INT_MAX) ? "" : s.substr(bestL, minLen);
    }
};`,
    lines: []
  },
  'substring-concatenation-words': {
    code: `class Solution {
public:
    vector<int> findSubstring(string s, vector<string>& words) {
        vector<int> indices;
        if (words.empty() || s.empty()) return indices;
        int wordLen = words[0].size();
        int numWords = words.size();
        int totalLen = wordLen * numWords;
        unordered_map<string, int> wordCount;
        for (const string& w : words) wordCount[w]++;
        for (int offset = 0; offset < wordLen; ++offset) {
            int L = offset;
            unordered_map<string, int> seen;
            int count = 0;
            for (int R = offset; R + wordLen <= s.size(); R += wordLen) {
                string word = s.substr(R, wordLen);
                if (wordCount.count(word)) {
                    seen[word]++;
                    count++;
                    while (seen[word] > wordCount[word]) {
                        string leftWord = s.substr(L, wordLen);
                        seen[leftWord]--;
                        count--;
                        L += wordLen;
                    }
                    if (count == numWords) indices.push_back(L);
                } else {
                    seen.clear();
                    count = 0;
                    L = R + wordLen;
                }
            }
        }
        return indices;
    }
};`,
    lines: []
  },
  'subarrays-k-different-integers': {
    code: `class Solution {
public:
    int atMost(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        int total = 0, L = 0;
        for (int R = 0; R < nums.size(); ++R) {
            count[nums[R]]++;
            while (count.size() > k) {
                count[nums[L]]--;
                if (count[nums[L]] == 0) count.erase(nums[L]);
                L++;
            }
            total += (R - L + 1);
        }
        return total;
    }
    int subarraysWithKDistinct(vector<int>& nums, int k) {
        return atMost(nums, k) - atMost(nums, k - 1);
    }
};`,
    lines: []
  },
  'binary-subarrays-with-sum': {
    code: `class Solution {
public:
    int atMost(vector<int>& nums, int goal) {
        if (goal < 0) return 0;
        int sum = 0, count = 0, L = 0;
        for (int R = 0; R < nums.size(); ++R) {
            sum += nums[R];
            while (sum > goal) {
                sum -= nums[L];
                L++;
            }
            count += (R - L + 1);
        }
        return count;
    }
    int numSubarraysWithSum(vector<int>& nums, int goal) {
        return atMost(nums, goal) - atMost(nums, goal - 1);
    }
};`,
    lines: []
  }
};

// Populate the lines array for accurate line-by-line tracing
for (const key in CPP_SNIPPETS) {
  CPP_SNIPPETS[key].lines = CPP_SNIPPETS[key].code.split('\n');
}
