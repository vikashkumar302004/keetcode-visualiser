import { AlgorithmId, AlgorithmMetadata } from '../types';

export const ALGORITHM_METADATA: Record<AlgorithmId, AlgorithmMetadata> = {
  insert: {
    id: 'insert',
    title: 'Insert a Node',
    category: 'crud',
    shortDesc: 'Traverse left or right comparing keys until finding an empty leaf placement slot.',
    timeComplexity: 'O(h) ~ O(log n)',
    spaceComplexity: 'O(h) recursive stack',
    lineCount: 11,
    cppCode: `TreeNode* insert(TreeNode* root, int val) {
    if (root == nullptr) {
        return new TreeNode(val);
    }
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    return root;
}`,
  },
  search: {
    id: 'search',
    title: 'Search a Value',
    category: 'crud',
    shortDesc: 'Navigate the search path from root down to target key or reach null in O(h) time.',
    timeComplexity: 'O(h) ~ O(log n)',
    spaceComplexity: 'O(1) iterative / O(h) stack',
    lineCount: 9,
    cppCode: `TreeNode* searchBST(TreeNode* root, int val) {
    if (root == nullptr || root->val == val) {
        return root;
    }
    if (val < root->val) {
        return searchBST(root->left, val);
    } else {
        return searchBST(root->right, val);
    }
}`,
  },
  delete: {
    id: 'delete',
    title: 'Delete a Node (3 Cases)',
    category: 'crud',
    shortDesc: 'Handle Leaf removal, Single-child bypass, and Two-child Inorder Successor replacement.',
    timeComplexity: 'O(h) ~ O(log n)',
    spaceComplexity: 'O(h) recursive stack',
    lineCount: 26,
    cppCode: `TreeNode* deleteNode(TreeNode* root, int key) {
    if (root == nullptr) return nullptr;
    if (key < root->val) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->val) {
        root->right = deleteNode(root->right, key);
    } else {
        // Case 1: Leaf node
        if (!root->left && !root->right) {
            delete root;
            return nullptr;
        }
        // Case 2: Single child
        if (!root->left) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        } else if (!root->right) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }
        // Case 3: Two children (Inorder Successor)
        TreeNode* succ = findMin(root->right);
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}`,
  },
  validate: {
    id: 'validate',
    title: 'Validate BST',
    category: 'validation',
    shortDesc: 'Verify tree validity using propagating range boundaries: minVal < root->val < maxVal.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) stack space',
    lineCount: 9,
    cppCode: `bool isValidBST(TreeNode* root, long minVal, long maxVal) {
    if (root == nullptr) return true;
    if (root->val <= minVal || root->val >= maxVal) {
        return false;
    }
    bool leftValid = isValidBST(root->left, minVal, root->val);
    bool rightValid = isValidBST(root->right, root->val, maxVal);
    return leftValid && rightValid;
}`,
  },
  find_min_max: {
    id: 'find_min_max',
    title: 'Find Min & Max Elements',
    category: 'validation',
    shortDesc: 'Traverse down the leftmost path for Minimum and rightmost path for Maximum.',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(1)',
    lineCount: 16,
    cppCode: `int findMin(TreeNode* root) {
    if (root == nullptr) return -1;
    while (root->left != nullptr) {
        root = root->left;
    }
    return root->val;
}

int findMax(TreeNode* root) {
    if (root == nullptr) return -1;
    while (root->right != nullptr) {
        root = root->right;
    }
    return root->val;
}`,
  },
  kth_element: {
    id: 'kth_element',
    title: 'K-th Smallest / Largest',
    category: 'validation',
    shortDesc: 'Perform Inorder traversal (smallest) or Reverse Inorder (largest) counting visited nodes.',
    timeComplexity: 'O(h + k)',
    spaceComplexity: 'O(h) recursion',
    lineCount: 9,
    cppCode: `int kthSmallest(TreeNode* root, int& k) {
    if (root == nullptr) return -1;
    int leftResult = kthSmallest(root->left, k);
    if (leftResult != -1) return leftResult;
    k--;
    if (k == 0) return root->val;
    return kthSmallest(root->right, k);
}`,
  },
  range_sum: {
    id: 'range_sum',
    title: 'Range Sum of BST',
    category: 'range',
    shortDesc: 'Accumulate values within [Low, High], skipping invalid sub-branches greedily.',
    timeComplexity: 'O(n) worst, O(k) average',
    spaceComplexity: 'O(h) recursive stack',
    lineCount: 15,
    cppCode: `int rangeSumBST(TreeNode* root, int low, int high) {
    if (root == nullptr) return 0;
    int sum = 0;
    if (root->val >= low && root->val <= high) {
        sum += root->val;
    }
    if (root->val > low) {
        sum += rangeSumBST(root->left, low, high);
    }
    if (root->val < high) {
        sum += rangeSumBST(root->right, low, high);
    }
    return sum;
}`,
  },
  prune: {
    id: 'prune',
    title: 'Prune BST',
    category: 'range',
    shortDesc: 'Trim subtrees so that all retained node values strictly lie inside [Low, High].',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursive stack',
    lineCount: 11,
    cppCode: `TreeNode* pruneBST(TreeNode* root, int low, int high) {
    if (root == nullptr) return nullptr;
    if (root->val < low) {
        return pruneBST(root->right, low, high);
    }
    if (root->val > high) {
        return pruneBST(root->left, low, high);
    }
    root->left = pruneBST(root->left, low, high);
    root->right = pruneBST(root->right, low, high);
    return root;
}`,
  },
  sorted_array_to_bst: {
    id: 'sorted_array_to_bst',
    title: 'Sorted Array to Balanced BST',
    category: 'construction',
    shortDesc: 'Recursively pick middle element as root to construct a minimum-height balanced BST.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(log n) tree depth',
    lineCount: 8,
    cppCode: `TreeNode* sortedArrayToBST(const vector<int>& nums, int left, int right) {
    if (left > right) return nullptr;
    int mid = left + (right - left) / 2;
    TreeNode* root = new TreeNode(nums[mid]);
    root->left = sortedArrayToBST(nums, left, mid - 1);
    root->right = sortedArrayToBST(nums, mid + 1, right);
    return root;
}`,
  },
  binary_tree_to_bst: {
    id: 'binary_tree_to_bst',
    title: 'Convert Binary Tree to BST',
    category: 'construction',
    shortDesc: 'Collect node values via inorder traversal, sort values in O(n log n), and re-populate.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n) auxiliary array',
    lineCount: 7,
    cppCode: `void convertBinaryTreeToBST(TreeNode* root) {
    vector<int> values;
    inorderCollect(root, values);
    sort(values.begin(), values.end());
    int index = 0;
    inorderFill(root, values, index);
}`,
  },
  bst_from_preorder: {
    id: 'bst_from_preorder',
    title: 'BST from Preorder',
    category: 'construction',
    shortDesc: 'Reconstruct a unique BST from its preorder sequence in O(n) using an upper bound.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursive stack',
    lineCount: 9,
    cppCode: `TreeNode* bstFromPreorder(vector<int>& preorder, int& idx, int bound) {
    if (idx == preorder.size() || preorder[idx] > bound) {
        return nullptr;
    }
    TreeNode* root = new TreeNode(preorder[idx++]);
    root->left = bstFromPreorder(preorder, idx, root->val);
    root->right = bstFromPreorder(preorder, idx, bound);
    return root;
}`,
  },
  lca: {
    id: 'lca',
    title: 'Lowest Common Ancestor (LCA)',
    category: 'relations',
    shortDesc: 'Find the lowest common ancestor in O(h) time by identifying the first branch split.',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(1) iterative / O(h) stack',
    lineCount: 10,
    cppCode: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (root == nullptr) return nullptr;
    if (p->val < root->val && q->val < root->val) {
        return lowestCommonAncestor(root->left, p, q);
    }
    if (p->val > root->val && q->val > root->val) {
        return lowestCommonAncestor(root->right, p, q);
    }
    return root; // Split point: p and q diverge or one equals root
}`,
  },
  successor_predecessor: {
    id: 'successor_predecessor',
    title: 'Inorder Successor & Predecessor',
    category: 'relations',
    shortDesc: 'Identify the smallest node strictly greater (successor) and largest strictly smaller (predecessor).',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(1)',
    lineCount: 20,
    cppCode: `void findPreSuc(TreeNode* root, TreeNode*& pre, TreeNode*& suc, int key) {
    if (root == nullptr) return;
    if (root->val == key) {
        if (root->left) {
            TreeNode* tmp = root->left;
            while (tmp->right) tmp = tmp->right;
            pre = tmp;
        }
        if (root->right) {
            TreeNode* tmp = root->right;
            while (tmp->left) tmp = tmp->left;
            suc = tmp;
        }
        return;
    }
    if (key < root->val) {
        suc = root;
        findPreSuc(root->left, pre, suc, key);
    } else {
        pre = root;
        findPreSuc(root->right, pre, suc, key);
    }
}`,
  },
  two_sum: {
    id: 'two_sum',
    title: 'Two Sum in BST (Target Pair)',
    category: 'relations',
    shortDesc: 'Find if there exists two BST elements whose sum equals k using Inorder + Two Pointers.',
    timeComplexity: 'O(n) time',
    spaceComplexity: 'O(n) space',
    lineCount: 17,
    cppCode: `void inorder(TreeNode* root, vector<int>& nums) {
    if (!root) return;
    inorder(root->left, nums);
    nums.push_back(root->val);
    inorder(root->right, nums);
}
bool findTarget(TreeNode* root, int k) {
    vector<int> nums; inorder(root, nums);
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == k) return true;
        if (sum < k) left++;
        else right--;
    }
    return false;
}`,
  },
  greater_sum_tree: {
    id: 'greater_sum_tree',
    title: 'Convert BST to Greater Tree',
    category: 'construction',
    shortDesc: 'Transform every node into the sum of itself plus all greater keys using Reverse In-order.',
    timeComplexity: 'O(n) time',
    spaceComplexity: 'O(h) recursive stack',
    lineCount: 9,
    cppCode: `int sum = 0;
TreeNode* convertBST(TreeNode* root) {
    if (root == nullptr) return nullptr;
    convertBST(root->right); // Visit greater nodes first
    sum += root->val;
    root->val = sum; // Replace with running sum
    convertBST(root->left); // Visit smaller nodes
    return root;
}`,
  },
  recover_bst: {
    id: 'recover_bst',
    title: 'Recover BST (Two Swapped Nodes)',
    category: 'validation',
    shortDesc: 'Recover tree ordering by detecting inversion violations during in-order traversal.',
    timeComplexity: 'O(n) time',
    spaceComplexity: 'O(h) recursive stack',
    lineCount: 15,
    cppCode: `TreeNode *first = nullptr, *second = nullptr, *prev = nullptr;
void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    if (prev && prev->val > root->val) {
        if (!first) first = prev;
        second = root; // Inversion violation pair
    }
    prev = root;
    inorder(root->right);
}
void recoverTree(TreeNode* root) {
    inorder(root);
    swap(first->val, second->val); // Restore BST ordering
}`,
  },
  closest_value: {
    id: 'closest_value',
    title: 'Closest Binary Search Tree Value',
    category: 'range',
    shortDesc: 'Track the node with the minimum absolute difference along the binary search path.',
    timeComplexity: 'O(h) ~ O(log n)',
    spaceComplexity: 'O(1) iterative space',
    lineCount: 13,
    cppCode: `int closestValue(TreeNode* root, double target) {
    int closest = root->val;
    TreeNode* curr = root;
    while (curr != nullptr) {
        if (abs(curr->val - target) < abs(closest - target))
            closest = curr->val;
        if (target < curr->val)
            curr = curr->left;
        else
            curr = curr->right;
    }
    return closest;
}`,
  },
};

