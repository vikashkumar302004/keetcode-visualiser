export interface CppSnippet {
  code: string;
  lines: string[];
}

export const CPP_SNIPPETS: Record<string, CppSnippet> = {
  p01_insert: {
    code: `void push(int val) {
    heap.push_back(val);
    int i = heap.size() - 1;
    
    // Percolate Up (Sift-Up)
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[i] > heap[parent]) { // Max-Heap invariant
            swap(heap[i], heap[parent]);
            i = parent;
        } else {
            break; // Heap property satisfied
        }
    }
}`,
    lines: [
      "void push(int val) {",
      "    heap.push_back(val);",
      "    int i = heap.size() - 1;",
      "    ",
      "    // Percolate Up (Sift-Up)",
      "    while (i > 0) {",
      "        int parent = (i - 1) / 2;",
      "        if (heap[i] > heap[parent]) { // Max-Heap invariant",
      "            swap(heap[i], heap[parent]);",
      "            i = parent;",
      "        } else {",
      "            break; // Heap property satisfied",
      "        }",
      "    }",
      "}"
    ]
  },

  p02_extract: {
    code: `int pop() {
    if (heap.empty()) return -1;
    int root = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    
    // Percolate Down (Sift-Down)
    heapifyDown(0);
    return root;
}

void heapifyDown(int i) {
    int candidate = i;
    int left = 2 * i + 1, right = 2 * i + 2;
    int n = heap.size();
    
    if (left < n && heap[left] > heap[candidate])
        candidate = left;
    if (right < n && heap[right] > heap[candidate])
        candidate = right;
        
    if (candidate != i) {
        swap(heap[i], heap[candidate]);
        heapifyDown(candidate);
    }
}`,
    lines: [
      "int pop() {",
      "    if (heap.empty()) return -1;",
      "    int root = heap[0];",
      "    heap[0] = heap.back();",
      "    heap.pop_back();",
      "    ",
      "    // Percolate Down (Sift-Down)",
      "    heapifyDown(0);",
      "    return root;",
      "}",
      "",
      "void heapifyDown(int i) {",
      "    int candidate = i;",
      "    int left = 2 * i + 1, right = 2 * i + 2;",
      "    int n = heap.size();",
      "    ",
      "    if (left < n && heap[left] > heap[candidate])",
      "        candidate = left;",
      "    if (right < n && heap[right] > heap[candidate])",
      "        candidate = right;",
      "        ",
      "    if (candidate != i) {",
      "        swap(heap[i], heap[candidate]);",
      "        heapifyDown(candidate);",
      "    }",
      "}"
    ]
  },

  p03_build_heap: {
    code: `// Floyd's Algorithm - O(N) Bottom-Up Build Heap
void buildHeap(vector<int>& arr) {
    int n = arr.size();
    // Start at last non-leaf node: parent of last element
    for (int i = (n / 2) - 1; i >= 0; --i) {
        heapifyDown(arr, n, i);
    }
}

void heapifyDown(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1, right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapifyDown(arr, n, largest);
    }
}`,
    lines: [
      "// Floyd's Algorithm - O(N) Bottom-Up Build Heap",
      "void buildHeap(vector<int>& arr) {",
      "    int n = arr.size();",
      "    // Start at last non-leaf node: parent of last element",
      "    for (int i = (n / 2) - 1; i >= 0; --i) {",
      "        heapifyDown(arr, n, i);",
      "    }",
      "}",
      "",
      "void heapifyDown(vector<int>& arr, int n, int i) {",
      "    int largest = i;",
      "    int left = 2 * i + 1, right = 2 * i + 2;",
      "    ",
      "    if (left < n && arr[left] > arr[largest]) largest = left;",
      "    if (right < n && arr[right] > arr[largest]) largest = right;",
      "    ",
      "    if (largest != i) {",
      "        swap(arr[i], arr[largest]);",
      "        heapifyDown(arr, n, largest);",
      "    }",
      "}"
    ]
  },

  p04_heap_sort: {
    code: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    // Step 1: Build max-heap in O(N)
    for (int i = (n / 2) - 1; i >= 0; --i)
        heapifyDown(arr, n, i);
        
    // Step 2: Extract max one by one and move to array tail
    for (int i = n - 1; i > 0; --i) {
        swap(arr[0], arr[i]); // Move root to current end
        heapifyDown(arr, i, 0); // Restore heap for remaining [0..i-1]
    }
}`,
    lines: [
      "void heapSort(vector<int>& arr) {",
      "    int n = arr.size();",
      "    // Step 1: Build max-heap in O(N)",
      "    for (int i = (n / 2) - 1; i >= 0; --i)",
      "        heapifyDown(arr, n, i);",
      "        ",
      "    // Step 2: Extract max one by one and move to array tail",
      "    for (int i = n - 1; i > 0; --i) {",
      "        swap(arr[0], arr[i]); // Move root to current end",
      "        heapifyDown(arr, i, 0); // Restore heap for remaining [0..i-1]",
      "    }",
      "}"
    ]
  },

  p05_kth_largest: {
    code: `// LC #215 - Kth Largest Element in an Array
int findKthLargest(vector<int>& nums, int k) {
    // Min-heap maintains the k largest elements seen so far
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop(); // Evict smaller element; top is kth largest
        }
    }
    return minHeap.top();
}`,
    lines: [
      "// LC #215 - Kth Largest Element in an Array",
      "int findKthLargest(vector<int>& nums, int k) {",
      "    // Min-heap maintains the k largest elements seen so far",
      "    priority_queue<int, vector<int>, greater<int>> minHeap;",
      "    ",
      "    for (int num : nums) {",
      "        minHeap.push(num);",
      "        if (minHeap.size() > k) {",
      "            minHeap.pop(); // Evict smaller element; top is kth largest",
      "        }",
      "    }",
      "    return minHeap.top();",
      "}"
    ]
  },

  p06_top_k_frequent: {
    code: `// LC #347 - Top K Frequent Elements
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> count;
    for (int n : nums) count[n]++;
    
    // Min-heap ordered by frequency: pair<freq, num>
    using P = pair<int, int>;
    priority_queue<P, vector<P>, greater<P>> minHeap;
    
    for (auto& [val, freq] : count) {
        minHeap.push({freq, val});
        if (minHeap.size() > k) minHeap.pop();
    }
    
    vector<int> res;
    while (!minHeap.empty()) {
        res.push_back(minHeap.top().second);
        minHeap.pop();
    }
    return res;
}`,
    lines: [
      "// LC #347 - Top K Frequent Elements",
      "vector<int> topKFrequent(vector<int>& nums, int k) {",
      "    unordered_map<int, int> count;",
      "    for (int n : nums) count[n]++;",
      "    ",
      "    // Min-heap ordered by frequency: pair<freq, num>",
      "    using P = pair<int, int>;",
      "    priority_queue<P, vector<P>, greater<P>> minHeap;",
      "    ",
      "    for (auto& [val, freq] : count) {",
      "        minHeap.push({freq, val});",
      "        if (minHeap.size() > k) minHeap.pop();",
      "    }",
      "    ",
      "    vector<int> res;",
      "    while (!minHeap.empty()) {",
      "        res.push_back(minHeap.top().second);",
      "        minHeap.pop();",
      "    }",
      "    return res;",
      "}"
    ]
  },

  p07_k_closest_points: {
    code: `// LC #973 - K Closest Points to Origin
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    // Max-heap stores: {distance_squared, point}
    priority_queue<pair<int, vector<int>>> maxHeap;
    
    for (auto& pt : points) {
        int dist = pt[0] * pt[0] + pt[1] * pt[1];
        maxHeap.push({dist, pt});
        if (maxHeap.size() > k) maxHeap.pop(); // Evict farthest point
    }
    
    vector<vector<int>> result;
    while (!maxHeap.empty()) {
        result.push_back(maxHeap.top().second);
        maxHeap.pop();
    }
    return result;
}`,
    lines: [
      "// LC #973 - K Closest Points to Origin",
      "vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {",
      "    // Max-heap stores: {distance_squared, point}",
      "    priority_queue<pair<int, vector<int>>> maxHeap;",
      "    ",
      "    for (auto& pt : points) {",
      "        int dist = pt[0] * pt[0] + pt[1] * pt[1];",
      "        maxHeap.push({dist, pt});",
      "        if (maxHeap.size() > k) maxHeap.pop(); // Evict farthest point",
      "    }",
      "    ",
      "    vector<vector<int>> result;",
      "    while (!maxHeap.empty()) {",
      "        result.push_back(maxHeap.top().second);",
      "        maxHeap.pop();",
      "    }",
      "    return result;",
      "}"
    ]
  },

  p08_sort_chars_freq: {
    code: `// LC #451 - Sort Characters By Frequency
string frequencySort(string s) {
    unordered_map<char, int> freq;
    for (char c : s) freq[c]++;
    
    // Max-heap pairs: pair<freq, char>
    priority_queue<pair<int, char>> maxHeap;
    for (auto& [c, count] : freq) {
        maxHeap.push({count, c});
    }
    
    string result = "";
    while (!maxHeap.empty()) {
        auto [count, c] = maxHeap.top();
        maxHeap.pop();
        result.append(count, c);
    }
    return result;
}`,
    lines: [
      "// LC #451 - Sort Characters By Frequency",
      "string frequencySort(string s) {",
      "    unordered_map<char, int> freq;",
      "    for (char c : s) freq[c]++;",
      "    ",
      "    // Max-heap pairs: pair<freq, char>",
      "    priority_queue<pair<int, char>> maxHeap;",
      "    for (auto& [c, count] : freq) {",
      "        maxHeap.push({count, c});",
      "    }",
      "    ",
      "    string result = \"\";",
      "    while (!maxHeap.empty()) {",
      "        auto [count, c] = maxHeap.top();",
      "        maxHeap.pop();",
      "        result.append(count, c);",
      "    }",
      "    return result;",
      "}"
    ]
  },

  p09_median_stream: {
    code: `// LC #295 - Find Median from Data Stream
class MedianFinder {
    priority_queue<int> maxHeap; // Lower half
    priority_queue<int, vector<int>, greater<int>> minHeap; // Upper half
public:
    void addNum(int num) {
        maxHeap.push(num);
        minHeap.push(maxHeap.top());
        maxHeap.pop();
        
        // Maintain invariant: maxHeap.size() >= minHeap.size()
        if (maxHeap.size() < minHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    
    double findMedian() {
        if (maxHeap.size() > minHeap.size())
            return maxHeap.top();
        return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};`,
    lines: [
      "// LC #295 - Find Median from Data Stream",
      "class MedianFinder {",
      "    priority_queue<int> maxHeap; // Lower half",
      "    priority_queue<int, vector<int>, greater<int>> minHeap; // Upper half",
      "public:",
      "    void addNum(int num) {",
      "        maxHeap.push(num);",
      "        minHeap.push(maxHeap.top());",
      "        maxHeap.pop();",
      "        ",
      "        // Maintain invariant: maxHeap.size() >= minHeap.size()",
      "        if (maxHeap.size() < minHeap.size()) {",
      "            maxHeap.push(minHeap.top());",
      "            minHeap.pop();",
      "        }",
      "    }",
      "    ",
      "    double findMedian() {",
      "        if (maxHeap.size() > minHeap.size())",
      "            return maxHeap.top();",
      "        return (maxHeap.top() + minHeap.top()) / 2.0;",
      "    }",
      "};"
    ]
  },

  p10_sliding_window_median: {
    code: `// LC #480 - Sliding Window Median (Dual Heaps + Hash Map Lazy Removal)
vector<double> medianSlidingWindow(vector<int>& nums, int k) {
    priority_queue<int> small; // max-heap
    priority_queue<int, vector<int>, greater<int>> large; // min-heap
    unordered_map<int, int> delayed;
    vector<double> medians;
    
    for (int i = 0; i < nums.size(); ++i) {
        // Insert new element into dual heaps
        if (small.empty() || nums[i] <= small.top()) small.push(nums[i]);
        else large.push(nums[i]);
        
        // Lazy-remove outgoing element leaving window [i - k]
        if (i >= k) {
            int out = nums[i - k];
            delayed[out]++;
            if (out <= small.top()) smallSize--; else largeSize--;
        }
        rebalance();
        if (i >= k - 1) medians.push_back(getMedian(k));
    }
    return medians;
}`,
    lines: [
      "// LC #480 - Sliding Window Median (Dual Heaps + Hash Map Lazy Removal)",
      "vector<double> medianSlidingWindow(vector<int>& nums, int k) {",
      "    priority_queue<int> small; // max-heap",
      "    priority_queue<int, vector<int>, greater<int>> large; // min-heap",
      "    unordered_map<int, int> delayed;",
      "    vector<double> medians;",
      "    ",
      "    for (int i = 0; i < nums.size(); ++i) {",
      "        // Insert new element into dual heaps",
      "        if (small.empty() || nums[i] <= small.top()) small.push(nums[i]);",
      "        else large.push(nums[i]);",
      "        ",
      "        // Lazy-remove outgoing element leaving window [i - k]",
      "        if (i >= k) {",
      "            int out = nums[i - k];",
      "            delayed[out]++;",
      "            if (out <= small.top()) smallSize--; else largeSize--;",
      "        }",
      "        rebalance();",
      "        if (i >= k - 1) medians.push_back(getMedian(k));",
      "    }",
      "    return medians;",
      "}"
    ]
  },

  p11_merge_k_sorted: {
    code: `// LC #23 - Merge K Sorted Lists / Arrays
vector<int> mergeKSorted(vector<vector<int>>& lists) {
    // Min-heap stores: {val, listIdx, elemIdx}
    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;
    
    // Push first element of each non-empty list
    for (int i = 0; i < lists.size(); ++i) {
        if (!lists[i].empty()) minHeap.push({lists[i][0], i, 0});
    }
    
    vector<int> result;
    while (!minHeap.empty()) {
        vector<int> curr = minHeap.top();
        minHeap.pop();
        int val = curr[0], lIdx = curr[1], eIdx = curr[2];
        result.push_back(val);
        
        // Push next element from same list if exists
        if (eIdx + 1 < lists[lIdx].size()) {
            minHeap.push({lists[lIdx][eIdx + 1], lIdx, eIdx + 1});
        }
    }
    return result;
}`,
    lines: [
      "// LC #23 - Merge K Sorted Lists / Arrays",
      "vector<int> mergeKSorted(vector<vector<int>>& lists) {",
      "    // Min-heap stores: {val, listIdx, elemIdx}",
      "    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;",
      "    ",
      "    // Push first element of each non-empty list",
      "    for (int i = 0; i < lists.size(); ++i) {",
      "        if (!lists[i].empty()) minHeap.push({lists[i][0], i, 0});",
      "    }",
      "    ",
      "    vector<int> result;",
      "    while (!minHeap.empty()) {",
      "        vector<int> curr = minHeap.top();",
      "        minHeap.pop();",
      "        int val = curr[0], lIdx = curr[1], eIdx = curr[2];",
      "        result.push_back(val);",
      "        ",
      "        // Push next element from same list if exists",
      "        if (eIdx + 1 < lists[lIdx].size()) {",
      "            minHeap.push({lists[lIdx][eIdx + 1], lIdx, eIdx + 1});",
      "        }",
      "    }",
      "    return result;",
      "}"
    ]
  },

  p12_reorganize_string: {
    code: `// LC #767 - Reorganize String
string reorganizeString(string s) {
    unordered_map<char, int> freq;
    for (char c : s) freq[c]++;
    
    // Max-heap stores pair<count, char>
    priority_queue<pair<int, char>> maxHeap;
    for (auto& [c, count] : freq) maxHeap.push({count, c});
    
    string result = "";
    pair<int, char> prev = {-1, '#'}; // Cooldown buffer
    
    while (!maxHeap.empty()) {
        auto [count, ch] = maxHeap.top();
        maxHeap.pop();
        result += ch;
        
        if (prev.first > 0) maxHeap.push(prev); // Re-insert once cooled down
        prev = {count - 1, ch}; // Current character enters 1-step cooldown
    }
    return result.length() == s.length() ? result : "";
}`,
    lines: [
      "// LC #767 - Reorganize String",
      "string reorganizeString(string s) {",
      "    unordered_map<char, int> freq;",
      "    for (char c : s) freq[c]++;",
      "    ",
      "    // Max-heap stores pair<count, char>",
      "    priority_queue<pair<int, char>> maxHeap;",
      "    for (auto& [c, count] : freq) maxHeap.push({count, c});",
      "    ",
      "    string result = \"\";",
      "    pair<int, char> prev = {-1, '#'}; // Cooldown buffer",
      "    ",
      "    while (!maxHeap.empty()) {",
      "        auto [count, ch] = maxHeap.top();",
      "        maxHeap.pop();",
      "        result += ch;",
      "        ",
      "        if (prev.first > 0) maxHeap.push(prev); // Re-insert once cooled down",
      "        prev = {count - 1, ch}; // Current character enters 1-step cooldown",
      "    }",
      "    return result.length() == s.length() ? result : \"\";",
      "}"
    ]
  },

  p13_task_scheduler: {
    code: `// LC #621 - Task Scheduler
int leastInterval(vector<char>& tasks, int n) {
    unordered_map<char, int> counts;
    for (char t : tasks) counts[t]++;
    
    priority_queue<int> maxHeap;
    for (auto& [t, c] : counts) maxHeap.push(c);
    
    queue<pair<int, int>> waitQueue; // {remaining_count, ready_time}
    int time = 0;
    
    while (!maxHeap.empty() || !waitQueue.empty()) {
        time++;
        if (!maxHeap.empty()) {
            int cnt = maxHeap.top() - 1;
            maxHeap.pop();
            if (cnt > 0) waitQueue.push({cnt, time + n});
        }
        if (!waitQueue.empty() && waitQueue.front().second == time) {
            maxHeap.push(waitQueue.front().first);
            waitQueue.pop();
        }
    }
    return time;
}`,
    lines: [
      "// LC #621 - Task Scheduler",
      "int leastInterval(vector<char>& tasks, int n) {",
      "    unordered_map<char, int> counts;",
      "    for (char t : tasks) counts[t]++;",
      "    ",
      "    priority_queue<int> maxHeap;",
      "    for (auto& [t, c] : counts) maxHeap.push(c);",
      "    ",
      "    queue<pair<int, int>> waitQueue; // {remaining_count, ready_time}",
      "    int time = 0;",
      "    ",
      "    while (!maxHeap.empty() || !waitQueue.empty()) {",
      "        time++;",
      "        if (!maxHeap.empty()) {",
      "            int cnt = maxHeap.top() - 1;",
      "            maxHeap.pop();",
      "            if (cnt > 0) waitQueue.push({cnt, time + n});",
      "        }",
      "        if (!waitQueue.empty() && waitQueue.front().second == time) {",
      "            maxHeap.push(waitQueue.front().first);",
      "            waitQueue.pop();",
      "        }",
      "    }",
      "    return time;",
      "}"
    ]
  },

  p14_connect_sticks: {
    code: `// LC #1167 / Huffman Coding - Minimum Cost to Connect Sticks
int connectSticks(vector<int>& sticks) {
    // Greedy strategy: repeatedly merge the two smallest sticks
    priority_queue<int, vector<int>, greater<int>> minHeap(sticks.begin(), sticks.end());
    int totalCost = 0;
    
    while (minHeap.size() > 1) {
        int first = minHeap.top(); minHeap.pop();
        int second = minHeap.top(); minHeap.pop();
        
        int combined = first + second;
        totalCost += combined;
        minHeap.push(combined);
    }
    return totalCost;
}`,
    lines: [
      "// LC #1167 / Huffman Coding - Minimum Cost to Connect Sticks",
      "int connectSticks(vector<int>& sticks) {",
      "    // Greedy strategy: repeatedly merge the two smallest sticks",
      "    priority_queue<int, vector<int>, greater<int>> minHeap(sticks.begin(), sticks.end());",
      "    int totalCost = 0;",
      "    ",
      "    while (minHeap.size() > 1) {",
      "        int first = minHeap.top(); minHeap.pop();",
      "        int second = minHeap.top(); minHeap.pop();",
      "        ",
      "        int combined = first + second;",
      "        totalCost += combined;",
      "        minHeap.push(combined);",
      "    }",
      "    return totalCost;",
      "}"
    ]
  },

  p15_k_pairs_smallest_sums: {
    code: `// LC #373 - Find K Pairs with Smallest Sums
vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
    // Min-Heap stores: {sum, i, j}
    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;
    
    // Push initial pairs (nums1[i] + nums2[0], i, 0)
    for (int i = 0; i < min((int)nums1.size(), k); i++) {
        int sum = nums1[i] + nums2[0];
        minHeap.push({sum, i, 0});
    }
    
    vector<vector<int>> result;
    while (!minHeap.empty() && result.size() < k) {
        vector<int> curr = minHeap.top();
        minHeap.pop();
        int i = curr[1], j = curr[2];
        result.push_back({nums1[i], nums2[j]});
        
        // Push next element in row i: (nums1[i] + nums2[j+1], i, j + 1)
        if (j + 1 < nums2.size()) {
            int nextSum = nums1[i] + nums2[j + 1];
            minHeap.push({nextSum, i, j + 1});
        }
    }
    return result;
}`,
    lines: [
      "// LC #373 - Find K Pairs with Smallest Sums",
      "vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {",
      "    // Min-Heap stores: {sum, i, j}",
      "    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;",
      "    ",
      "    // Push initial pairs (nums1[i] + nums2[0], i, 0)",
      "    for (int i = 0; i < min((int)nums1.size(), k); i++) {",
      "        int sum = nums1[i] + nums2[0];",
      "        minHeap.push({sum, i, 0});",
      "    }",
      "    ",
      "    vector<vector<int>> result;",
      "    while (!minHeap.empty() && result.size() < k) {",
      "        vector<int> curr = minHeap.top();",
      "        minHeap.pop();",
      "        int i = curr[1], j = curr[2];",
      "        result.push_back({nums1[i], nums2[j]});",
      "        ",
      "        // Push next element in row i: (nums1[i] + nums2[j+1], i, j + 1)",
      "        if (j + 1 < nums2.size()) {",
      "            int nextSum = nums1[i] + nums2[j + 1];",
      "            minHeap.push({nextSum, i, j + 1});",
      "        }",
      "    }",
      "    return result;",
      "}"
    ]
  },

  p16_meeting_rooms_ii: {
    code: `// LC #253 - Meeting Rooms II (Min Conference Rooms)
int minMeetingRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    sort(intervals.begin(), intervals.end());
    
    // Min-heap tracking end times of active meetings
    priority_queue<int, vector<int>, greater<int>> minHeap;
    minHeap.push(intervals[0][1]);
    
    for (int i = 1; i < intervals.size(); i++) {
        // If room is freed before current meeting starts, reuse room
        if (intervals[i][0] >= minHeap.top()) {
            minHeap.pop();
        }
        minHeap.push(intervals[i][1]);
    }
    return minHeap.size(); // Total conference rooms allocated
}`,
    lines: [
      "// LC #253 - Meeting Rooms II (Min Conference Rooms)",
      "int minMeetingRooms(vector<vector<int>>& intervals) {",
      "    if (intervals.empty()) return 0;",
      "    sort(intervals.begin(), intervals.end());",
      "    ",
      "    // Min-heap tracking end times of active meetings",
      "    priority_queue<int, vector<int>, greater<int>> minHeap;",
      "    minHeap.push(intervals[0][1]);",
      "    ",
      "    for (int i = 1; i < intervals.size(); i++) {",
      "        // If room is freed before current meeting starts, reuse room",
      "        if (intervals[i][0] >= minHeap.top()) {",
      "            minHeap.pop();",
      "        }",
      "        minHeap.push(intervals[i][1]);",
      "    }",
      "    return minHeap.size(); // Total conference rooms allocated",
      "}"
    ]
  },

  p17_kth_smallest_matrix: {
    code: `// LC #378 - Kth Smallest Element in a Sorted Matrix
int kthSmallest(vector<vector<int>>& matrix, int k) {
    int n = matrix.size();
    // Min-heap stores: {val, r, c}
    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;
    
    // Initialize with first element of each row
    for (int r = 0; r < min(n, k); r++) {
        minHeap.push({matrix[r][0], r, 0});
    }
    
    int result = 0;
    for (int count = 0; count < k; count++) {
        vector<int> curr = minHeap.top();
        minHeap.pop();
        result = curr[0];
        int r = curr[1], c = curr[2];
        
        // Push next column element from same row
        if (c + 1 < n) {
            minHeap.push({matrix[r][c + 1], r, c + 1});
        }
    }
    return result;
}`,
    lines: [
      "// LC #378 - Kth Smallest Element in a Sorted Matrix",
      "int kthSmallest(vector<vector<int>>& matrix, int k) {",
      "    int n = matrix.size();",
      "    // Min-heap stores: {val, r, c}",
      "    priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;",
      "    ",
      "    // Initialize with first element of each row",
      "    for (int r = 0; r < min(n, k); r++) {",
      "        minHeap.push({matrix[r][0], r, 0});",
      "    }",
      "    ",
      "    int result = 0;",
      "    for (int count = 0; count < k; count++) {",
      "        vector<int> curr = minHeap.top();",
      "        minHeap.pop();",
      "        result = curr[0];",
      "        int r = curr[1], c = curr[2];",
      "        ",
      "        // Push next column element from same row",
      "        if (c + 1 < n) {",
      "            minHeap.push({matrix[r][c + 1], r, c + 1});",
      "        }",
      "    }",
      "    return result;",
      "}"
    ]
  },

  p18_furthest_building: {
    code: `// LC #1642 - Furthest Building You Can Reach
int furthestBuilding(vector<int>& heights, int bricks, int ladders) {
    // Min-heap of climb differences (allocated to ladders)
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int i = 0; i < heights.size() - 1; i++) {
        int climb = heights[i + 1] - heights[i];
        if (climb > 0) {
            minHeap.push(climb);
            
            // If climbs exceed ladder count, pay smallest climb with bricks
            if (minHeap.size() > ladders) {
                bricks -= minHeap.top();
                minHeap.pop();
                if (bricks < 0) return i; // Cannot proceed
            }
        }
    }
    return heights.size() - 1;
}`,
    lines: [
      "// LC #1642 - Furthest Building You Can Reach",
      "int furthestBuilding(vector<int>& heights, int bricks, int ladders) {",
      "    // Min-heap of climb differences (allocated to ladders)",
      "    priority_queue<int, vector<int>, greater<int>> minHeap;",
      "    ",
      "    for (int i = 0; i < heights.size() - 1; i++) {",
      "        int climb = heights[i + 1] - heights[i];",
      "        if (climb > 0) {",
      "            minHeap.push(climb);",
      "            ",
      "            // If climbs exceed ladder count, pay smallest climb with bricks",
      "            if (minHeap.size() > ladders) {",
      "                bricks -= minHeap.top();",
      "                minHeap.pop();",
      "                if (bricks < 0) return i; // Cannot proceed",
      "            }",
      "        }",
      "    }",
      "    return heights.size() - 1;",
      "}"
    ]
  }
};
