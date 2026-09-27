/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CppSnippet {
  code: string;
  lines: string[];
}

export const CPP_SNIPPETS: Record<string, CppSnippet> = {
  lc876_cpp: {
    code: `ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
    lines: [
      `ListNode* middleNode(ListNode* head) {`, // 1
      `    ListNode* slow = head;`,             // 2
      `    ListNode* fast = head;`,             // 3
      `    `,                                  // 4
      `    while (fast != nullptr && fast->next != nullptr) {`, // 5
      `        slow = slow->next;`,             // 6
      `        fast = fast->next->next;`,       // 7
      `    }`,                                  // 8
      `    return slow;`,                       // 9
      `}`                                        // 10
    ]
  },
  lc2095_cpp: {
    code: `ListNode* deleteMiddle(ListNode* head) {
    if (head == nullptr || head->next == nullptr) {
        return nullptr;
    }
    ListNode* slow = head;
    ListNode* fast = head;
    ListNode* prev = nullptr;
    
    while (fast != nullptr && fast->next != nullptr) {
        prev = slow;
        slow = slow->next;
        fast = fast->next->next;
    }
    prev->next = slow->next;
    delete slow;
    return head;
}`,
    lines: [
      `ListNode* deleteMiddle(ListNode* head) {`, // 1
      `    if (head == nullptr || head->next == nullptr) {`, // 2
      `        return nullptr;`, // 3
      `    }`, // 4
      `    ListNode* slow = head;`, // 5
      `    ListNode* fast = head;`, // 6
      `    ListNode* prev = nullptr;`, // 7
      `    `, // 8
      `    while (fast != nullptr && fast->next != nullptr) {`, // 9
      `        prev = slow;`, // 10
      `        slow = slow->next;`, // 11
      `        fast = fast->next->next;`, // 12
      `    }`, // 13
      `    prev->next = slow->next;`, // 14
      `    delete slow;`, // 15
      `    return head;`, // 16
      `}` // 17
    ]
  },
  lc234_cpp: {
    code: `bool isPalindrome(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    ListNode* prev = nullptr;
    ListNode* curr = slow;
    while (curr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    
    ListNode* p1 = head;
    ListNode* p2 = prev;
    while (p2 != nullptr) {
        if (p1->val != p2->val) return false;
        p1 = p1->next;
        p2 = p2->next;
    }
    return true;
}`,
    lines: [
      `bool isPalindrome(ListNode* head) {`, // 1
      `    ListNode* slow = head;`, // 2
      `    ListNode* fast = head;`, // 3
      `    while (fast && fast->next) {`, // 4
      `        slow = slow->next;`, // 5
      `        fast = fast->next->next;`, // 6
      `    }`, // 7
      `    `, // 8
      `    ListNode* prev = nullptr;`, // 9
      `    ListNode* curr = slow;`, // 10
      `    while (curr) {`, // 11
      `        ListNode* nextTemp = curr->next;`, // 12
      `        curr->next = prev;`, // 13
      `        prev = curr;`, // 14
      `        curr = nextTemp;`, // 15
      `    }`, // 16
      `    `, // 17
      `    ListNode* p1 = head;`, // 18
      `    ListNode* p2 = prev;`, // 19
      `    while (p2 != nullptr) {`, // 20
      `        if (p1->val != p2->val) return false;`, // 21
      `        p1 = p1->next;`, // 22
      `        p2 = p2->next;`, // 23
      `    }`, // 24
      `    return true;`, // 25
      `}` // 26
    ]
  },
  lc143_cpp: {
    code: `void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    ListNode* prev = nullptr;
    ListNode* curr = slow;
    while (curr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    
    ListNode* first = head;
    ListNode* second = prev;
    while (second->next) {
        ListNode* tmp1 = first->next;
        ListNode* tmp2 = second->next;
        first->next = second;
        second->next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
    lines: [
      `void reorderList(ListNode* head) {`, // 1
      `    if (!head || !head->next) return;`, // 2
      `    ListNode* slow = head;`, // 3
      `    ListNode* fast = head;`, // 4
      `    while (fast && fast->next) {`, // 5
      `        slow = slow->next;`, // 6
      `        fast = fast->next->next;`, // 7
      `    }`, // 8
      `    `, // 9
      `    ListNode* prev = nullptr;`, // 10
      `    ListNode* curr = slow;`, // 11
      `    while (curr) {`, // 12
      `        ListNode* nextTemp = curr->next;`, // 13
      `        curr->next = prev;`, // 14
      `        prev = curr;`, // 15
      `        curr = nextTemp;`, // 16
      `    }`, // 17
      `    `, // 18
      `    ListNode* first = head;`, // 19
      `    ListNode* second = prev;`, // 20
      `    while (second->next) {`, // 21
      `        ListNode* tmp1 = first->next;`, // 22
      `        ListNode* tmp2 = second->next;`, // 23
      `        first->next = second;`, // 24
      `        second->next = tmp1;`, // 25
      `        first = tmp1;`, // 26
      `        second = tmp2;`, // 27
      `    }`, // 28
      `}` // 29
    ]
  },
  lc148_cpp: {
    code: `ListNode* splitMiddle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    ListNode* secondHalf = slow->next;
    slow->next = nullptr;
    return secondHalf;
}`,
    lines: [
      `ListNode* splitMiddle(ListNode* head) {`, // 1
      `    ListNode* slow = head;`,             // 2
      `    ListNode* fast = head;`,             // 3
      `    while (fast && fast->next && fast->next->next) {`, // 4
      `        slow = slow->next;`,             // 5
      `        fast = fast->next->next;`,       // 6
      `    }`,                                  // 7
      `    ListNode* secondHalf = slow->next;`, // 8
      `    slow->next = nullptr;`,              // 9
      `    return secondHalf;`,                 // 10
      `}`                                        // 11
    ]
  },
  lc141_cpp: {
    code: `bool hasCycle(ListNode *head) {
    if (head == nullptr) return false;
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
    lines: [
      `bool hasCycle(ListNode *head) {`, // 1
      `    if (head == nullptr) return false;`, // 2
      `    ListNode *slow = head;`, // 3
      `    ListNode *fast = head;`, // 4
      `    `, // 5
      `    while (fast != nullptr && fast->next != nullptr) {`, // 6
      `        slow = slow->next;`, // 7
      `        fast = fast->next->next;`, // 8
      `        if (slow == fast) {`, // 9
      `            return true;`, // 10
      `        }`, // 11
      `    }`, // 12
      `    return false;`, // 13
      `}` // 14
    ]
  },
  lc142_cpp: {
    code: `ListNode *detectCycle(ListNode *head) {
    ListNode *slow = head;
    ListNode *fast = head;
    bool hasCycle = false;
    
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            hasCycle = true;
            break;
        }
    }
    if (!hasCycle) return nullptr;
    
    ListNode *ptr1 = head;
    ListNode *ptr2 = slow;
    while (ptr1 != ptr2) {
        ptr1 = ptr1->next;
        ptr2 = ptr2->next;
    }
    return ptr1;
}`,
    lines: [
      `ListNode *detectCycle(ListNode *head) {`, // 1
      `    ListNode *slow = head;`, // 2
      `    ListNode *fast = head;`, // 3
      `    bool hasCycle = false;`, // 4
      `    `, // 5
      `    while (fast != nullptr && fast->next != nullptr) {`, // 6
      `        slow = slow->next;`, // 7
      `        fast = fast->next->next;`, // 8
      `        if (slow == fast) {`, // 9
      `            hasCycle = true;`, // 10
      `            break;`, // 11
      `        }`, // 12
      `    }`, // 13
      `    if (!hasCycle) return nullptr;`, // 14
      `    `, // 15
      `    ListNode *ptr1 = head;`, // 16
      `    ListNode *ptr2 = slow;`, // 17
      `    while (ptr1 != ptr2) {`, // 18
      `        ptr1 = ptr1->next;`, // 19
      `        ptr2 = ptr2->next;`, // 20
      `    }`, // 21
      `    return ptr1;`, // 22
      `}` // 23
    ]
  },
  lc160_cpp: {
    code: `ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
    if (headA == nullptr || headB == nullptr) return nullptr;
    ListNode *pA = headA;
    ListNode *pB = headB;
    
    while (pA != pB) {
        pA = (pA == nullptr) ? headB : pA->next;
        pB = (pB == nullptr) ? headA : pB->next;
    }
    return pA;
}`,
    lines: [
      `ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {`, // 1
      `    if (headA == nullptr || headB == nullptr) return nullptr;`, // 2
      `    ListNode *pA = headA;`, // 3
      `    ListNode *pB = headB;`, // 4
      `    `, // 5
      `    while (pA != pB) {`, // 6
      `        pA = (pA == nullptr) ? headB : pA->next;`, // 7
      `        pB = (pB == nullptr) ? headA : pB->next;`, // 8
      `    }`, // 9
      `    return pA;`, // 10
      `}` // 11
    ]
  },
  lc202_cpp: {
    code: `bool isHappy(int n) {
    auto getNext = [](int number) {
        int totalSum = 0;
        while (number > 0) {
            int d = number % 10;
            number = number / 10;
            totalSum += d * d;
        }
        return totalSum;
    };
    int slow = n;
    int fast = getNext(n);
    while (fast != 1 && getNext(fast) != 1) {
        if (slow == fast) return false;
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    return true;
}`,
    lines: [
      `bool isHappy(int n) {`, // 1
      `    auto getNext = [](int number) {`, // 2
      `        int totalSum = 0;`, // 3
      `        while (number > 0) {`, // 4
      `            int d = number % 10;`, // 5
      `            totalSum += d * d;`, // 6
      `        }`, // 7
      `        return totalSum;`, // 8
      `    };`, // 9
      `    int slow = n;`, // 10
      `    int fast = getNext(n);`, // 11
      `    while (fast != 1 && getNext(fast) != 1) {`, // 12
      `        if (slow == fast) return false;`, // 13
      `        slow = getNext(slow);`, // 14
      `        fast = getNext(getNext(fast));`, // 15
      `    }`, // 16
      `    return true;`, // 17
      `}` // 18
    ]
  },
  lc287_cpp: {
    code: `int findDuplicate(vector<int>& nums) {
    int slow = nums[0];
    int fast = nums[nums[0]];
    
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    
    int ptr1 = 0;
    int ptr2 = slow;
    while (ptr1 != ptr2) {
        ptr1 = nums[ptr1];
        ptr2 = nums[ptr2];
    }
    return ptr1;
}`,
    lines: [
      `int findDuplicate(vector<int>& nums) {`, // 1
      `    int slow = nums[0];`, // 2
      `    int fast = nums[nums[0]];`, // 3
      `    `, // 4
      `    while (slow != fast) {`, // 5
      `        slow = nums[slow];`, // 6
      `        fast = nums[nums[fast]];`, // 7
      `    }`, // 8
      `    `, // 9
      `    int ptr1 = 0;`, // 10
      `    int ptr2 = slow;`, // 11
      `    while (ptr1 != ptr2) {`, // 12
      `        ptr1 = nums[ptr1];`, // 13
      `        ptr2 = nums[ptr2];`, // 14
      `    }`, // 15
      `    return ptr1;`, // 16
      `}` // 17
    ]
  },
  lc457_cpp: {
    code: `bool circularArrayLoop(vector<int>& nums) {
    int n = nums.size();
    auto getNext = [&](int curr, bool isForward) {
        bool direction = nums[curr] >= 0;
        if (direction != isForward) return -1;
        int nextIdx = (curr + nums[curr]) % n;
        if (nextIdx < 0) nextIdx += n;
        if (nextIdx == curr) return -1; // Single-node self loops are invalid
        return nextIdx;
    };
    for (int i = 0; i < n; ++i) {
        if (nums[i] == 0) continue;
        int slow = i, fast = i;
        bool isForward = nums[i] >= 0;
        do {
            slow = getNext(slow, isForward);
            fast = getNext(fast, isForward);
            if (fast != -1) fast = getNext(fast, isForward);
        } while (slow != -1 && fast != -1 && slow != fast);
        if (slow != -1 && slow == fast) return true;
    }
    return false;
}`,
    lines: [
      `bool circularArrayLoop(vector<int>& nums) {`, // 1
      `    int n = nums.size();`, // 2
      `    auto getNext = [&](int curr, bool isForward) {`, // 3
      `        bool direction = nums[curr] >= 0;`, // 4
      `        if (direction != isForward) return -1;`, // 5
      `        int nextIdx = (curr + nums[curr]) % n;`, // 6
      `        if (nextIdx < 0) nextIdx += n;`, // 7
      `        if (nextIdx == curr) return -1;`, // 8
      `        return nextIdx;`, // 9
      `    };`, // 10
      `    for (int i = 0; i < n; ++i) {`, // 11
      `        int slow = i, fast = i;`, // 12
      `        bool isForward = nums[i] >= 0;`, // 13
      `        do {`, // 14
      `            slow = getNext(slow, isForward);`, // 15
      `            fast = getNext(fast, isForward);`, // 16
      `            if (fast != -1) fast = getNext(fast, isForward);`, // 17
      `        } while (slow != -1 && fast != -1 && slow != fast);`, // 18
      `        if (slow != -1 && slow == fast) return true;`, // 19
      `    }`, // 20
      `    return false;`, // 21
      `}` // 22
    ]
  }
};
