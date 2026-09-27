import { ProblemId } from '../types';

export const CPP_SNIPPETS: Record<ProblemId, string> = {
  'basic-stack': `// 01: Basic Stack Operations using std::stack
#include <iostream>
#include <stack>

int main() {
    std::stack<int> s;

    // Push elements onto the stack
    s.push(10);
    s.push(20);
    s.push(30);

    // Inspect properties
    std::cout << "Top element: " << s.top() << std::endl;
    std::cout << "Stack size: " << s.size() << std::endl;

    // Pop element
    s.pop();

    if (s.empty()) {
        std::cout << "Stack is empty" << std::endl;
    } else {
        std::cout << "Stack is not empty" << std::endl;
    }
    return 0;
}`,

  'valid-parentheses': `// 02: Valid Parentheses (LeetCode #20)
#include <stack>
#include <string>

bool isValid(std::string s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            if ((c == ')' && top == '(') ||
                (c == '}' && top == '{') ||
                (c == ']' && top == '[')) {
                st.pop();
            } else {
                return false;
            }
        }
    }
    return st.empty();
}`,

  'min-stack': `// 03: Min Stack in O(1) (LeetCode #155)
#include <stack>
#include <algorithm>

class MinStack {
private:
    std::stack<int> valStack;
    std::stack<int> minStack;

public:
    void push(int val) {
        valStack.push(val);
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.top());
        }
    }

    void pop() {
        valStack.pop();
        minStack.pop();
    }

    int top() {
        return valStack.top();
    }

    int getMin() {
        return minStack.top();
    }
};`,

  'queue-using-stacks': `// 04: Implement Queue using Stacks (LeetCode #232)
#include <stack>

class MyQueue {
private:
    std::stack<int> inStack;
    std::stack<int> outStack;

    void transfer() {
        if (outStack.empty()) {
            while (!inStack.empty()) {
                outStack.push(inStack.top());
                inStack.pop();
            }
        }
    }

public:
    void push(int x) {
        inStack.push(x);
    }

    int pop() {
        transfer();
        int topVal = outStack.top();
        outStack.pop();
        return topVal;
    }

    int peek() {
        transfer();
        return outStack.top();
    }

    bool empty() {
        return inStack.empty() && outStack.empty();
    }
};`,

  'infix-to-postfix': `// 05: Infix to Postfix Conversion (Shunting-Yard)
#include <stack>
#include <string>

int prec(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

std::string infixToPostfix(std::string s) {
    std::stack<char> st;
    std::string result = "";
    for (char c : s) {
        if (isalnum(c)) {
            result += c;
        } else if (c == '(') {
            st.push('(');
        } else if (c == ')') {
            while (!st.empty() && st.top() != '(') {
                result += st.top();
                st.pop();
            }
            st.pop(); // Pop '('
        } else {
            while (!st.empty() && prec(c) <= prec(st.top())) {
                result += st.top();
                st.pop();
            }
            st.push(c);
        }
    }
    while (!st.empty()) {
        result += st.top();
        st.pop();
    }
    return result;
}`,

  'infix-to-prefix': `// 06: Infix to Prefix Conversion
#include <stack>
#include <string>
#include <algorithm>

int prec(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

std::string infixToPrefix(std::string s) {
    // 1. Reverse string
    std::reverse(s.begin(), s.end());
    // 2. Swap parentheses
    for (int i = 0; i < s.length(); i++) {
        if (s[i] == '(') s[i] = ')';
        else if (s[i] == ')') s[i] = '(';
    }
    // 3. Postfix conversion (modified for right-associativity)
    std::stack<char> st;
    std::string result = "";
    for (char c : s) {
        if (isalnum(c)) {
            result += c;
        } else if (c == '(') {
            st.push('(');
        } else if (c == ')') {
            while (!st.empty() && st.top() != '(') {
                result += st.top();
                st.pop();
            }
            st.pop();
        } else {
            while (!st.empty() && prec(c) < prec(st.top())) {
                result += st.top();
                st.pop();
            }
            st.push(c);
        }
    }
    while (!st.empty()) {
        result += st.top();
        st.pop();
    }
    // 4. Reverse result
    std::reverse(result.begin(), result.end());
    return result;
}`,

  'evaluate-postfix': `// 07: Evaluate Postfix (LeetCode #150 - Reverse Polish Notation)
#include <stack>
#include <vector>
#include <string>

int evalRPN(std::vector<std::string>& tokens) {
    std::stack<int> st;
    for (std::string& t : tokens) {
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            int op2 = st.top(); st.pop();
            int op1 = st.top(); st.pop();
            if (t == "+") st.push(op1 + op2);
            else if (t == "-") st.push(op1 - op2);
            else if (t == "*") st.push(op1 * op2);
            else if (t == "/") st.push(op1 / op2);
        } else {
            st.push(std::stoi(t));
        }
    }
    return st.top();
}`,

  'evaluate-prefix': `// 08: Evaluate Prefix Expression
#include <stack>
#include <string>
#include <vector>

int evalPrefix(std::vector<std::string>& tokens) {
    std::stack<int> st;
    // Scan from right to left
    for (int i = tokens.size() - 1; i >= 0; i--) {
        std::string t = tokens[i];
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            int op1 = st.top(); st.pop();
            int op2 = st.top(); st.pop();
            if (t == "+") st.push(op1 + op2);
            else if (t == "-") st.push(op1 - op2);
            else if (t == "*") st.push(op1 * op2);
            else if (t == "/") st.push(op1 / op2);
        } else {
            st.push(std::stoi(t));
        }
    }
    return st.top();
}`,

  'postfix-to-infix': `// 09: Postfix to Infix Conversion
#include <stack>
#include <string>
#include <vector>

std::string postfixToInfix(std::vector<std::string>& tokens) {
    std::stack<std::string> st;
    for (std::string& t : tokens) {
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            std::string op2 = st.top(); st.pop();
            std::string op1 = st.top(); st.pop();
            std::string combined = "(" + op1 + t + op2 + ")";
            st.push(combined);
        } else {
            st.push(t);
        }
    }
    return st.top();
}`,

  'prefix-to-infix': `// 10: Prefix to Infix Conversion
#include <stack>
#include <string>
#include <vector>

std::string prefixToInfix(std::vector<std::string>& tokens) {
    std::stack<std::string> st;
    // Scan right to left
    for (int i = tokens.size() - 1; i >= 0; i--) {
        std::string t = tokens[i];
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            std::string op1 = st.top(); st.pop();
            std::string op2 = st.top(); st.pop();
            std::string combined = "(" + op1 + t + op2 + ")";
            st.push(combined);
        } else {
            st.push(t);
        }
    }
    return st.top();
}`,

  'basic-calculator': `// 11: Basic Calculator (LeetCode #224)
#include <stack>
#include <string>

int calculate(std::string s) {
    std::stack<int> st;
    int result = 0;
    int number = 0;
    int sign = 1;
    for (char c : s) {
        if (isdigit(c)) {
            number = 10 * number + (c - '0');
        } else if (c == '+') {
            result += sign * number;
            number = 0;
            sign = 1;
        } else if (c == '-') {
            result += sign * number;
            number = 0;
            sign = -1;
        } else if (c == '(') {
            st.push(result);
            st.push(sign);
            result = 0;
            sign = 1;
        } else if (c == ')') {
            result += sign * number;
            number = 0;
            result *= st.top(); st.pop(); // Pop sign
            result += st.top(); st.pop(); // Pop prior result
        }
    }
    result += sign * number;
    return result;
}`,

  'next-greater-element': `// 12: Next Greater Element II (LeetCode #503)
#include <vector>
#include <stack>

std::vector<int> nextGreaterElements(std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> res(n, -1);
    std::stack<int> st; // stores indices
    // Loop twice for circular property
    for (int i = 0; i < 2 * n; i++) {
        int idx = i % n;
        while (!st.empty() && nums[st.top()] < nums[idx]) {
            res[st.top()] = nums[idx];
            st.pop();
        }
        if (i < n) {
            st.push(idx);
        }
    }
    return res;
}`,

  'daily-temperatures': `// 13: Daily Temperatures (LeetCode #739)
#include <vector>
#include <stack>

std::vector<int> dailyTemperatures(std::vector<int>& T) {
    int n = T.size();
    std::vector<int> ans(n, 0);
    std::stack<int> st; // stores indices
    for (int i = 0; i < n; i++) {
        while (!st.empty() && T[i] > T[st.top()]) {
            int idx = st.top();
            st.pop();
            ans[idx] = i - idx;
        }
        st.push(i);
    }
    return ans;
}`,

  'online-stock-span': `// 14: Online Stock Span (LeetCode #901)
#include <stack>
#include <utility>

class StockSpanner {
private:
    std::stack<std::pair<int, int>> s; // {price, span}

public:
    int next(int price) {
        int span = 1;
        while (!s.empty() && s.top().first <= price) {
            span += s.top().second;
            s.pop();
        }
        s.push({price, span});
        return span;
    }
};`,

  'largest-rectangle': `// 15: Largest Rectangle in Histogram (LeetCode #84)
#include <vector>
#include <stack>
#include <algorithm>

int largestRectangleArea(std::vector<int>& heights) {
    std::stack<int> st; // stores indices
    int maxArea = 0;
    int n = heights.size();
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!st.empty() && h < heights[st.top()]) {
            int height = heights[st.top()];
            st.pop();
            int width = st.empty() ? i : (i - st.top() - 1);
            maxArea = std::max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}`,

  'maximal-rectangle': `// 16: Maximal Rectangle (LeetCode #85)
#include <vector>
#include <stack>
#include <algorithm>

int maximalRectangle(std::vector<std::vector<char>>& matrix) {
    if (matrix.empty()) return 0;
    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<int> heights(cols, 0);
    int maxArea = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == '1') heights[c]++;
            else heights[c] = 0;
        }
        // Run Largest Rectangle Area on heights
        std::stack<int> st;
        for (int i = 0; i <= cols; i++) {
            int h = (i == cols) ? 0 : heights[i];
            while (!st.empty() && h < heights[st.top()]) {
                int height = heights[st.top()];
                st.pop();
                int width = st.empty() ? i : (i - st.top() - 1);
                maxArea = std::max(maxArea, height * width);
            }
            st.push(i);
        }
    }
    return maxArea;
}`,

  'trapping-rain-water': `// 17: Trapping Rain Water (LeetCode #42)
#include <vector>
#include <stack>
#include <algorithm>

int trap(std::vector<int>& height) {
    std::stack<int> st; // stores indices
    int totalWater = 0;
    int i = 0, n = height.size();
    while (i < n) {
        while (!st.empty() && height[i] > height[st.top()]) {
            int topIdx = st.top();
            st.pop();
            if (st.empty()) break;
            int distance = i - st.top() - 1;
            int boundedHeight = std::min(height[i], height[st.top()]) - height[topIdx];
            totalWater += distance * boundedHeight;
        }
        st.push(i++);
    }
    return totalWater;
}`,

  'asteroid-collision': `// 18: Asteroid Collision (LeetCode #735)
#include <vector>
#include <stack>
#include <cmath>

std::vector<int> asteroidCollision(std::vector<int>& asteroids) {
    std::vector<int> st; // using vector as stack
    for (int ast : asteroids) {
        bool survives = true;
        while (!st.empty() && st.back() > 0 && ast < 0) {
            if (st.back() < -ast) {
                st.pop_back(); // popped smaller rightward asteroid
                continue;
            } else if (st.back() == -ast) {
                st.pop_back(); // both annihilated
            }
            survives = false;
            break;
        }
        if (survives) {
            st.push_back(ast);
        }
    }
    return st;
}`,

  'remove-k-digits': `// 19: Remove K Digits (LeetCode #402)
#include <string>
#include <stack>

std::string removeKDigits(std::string num, int k) {
    std::string st = ""; // using string as stack
    for (char digit : num) {
        while (k > 0 && !st.empty() && st.back() > digit) {
            st.pop_back();
            k--;
        }
        st.push_back(digit);
    }
    // pop remaining k elements
    while (k > 0 && !st.empty()) {
        st.pop_back();
        k--;
    }
    // clean leading zeros
    int nonZeroIdx = 0;
    while (nonZeroIdx < st.size() && st[nonZeroIdx] == '0') {
        nonZeroIdx++;
    }
    std::string res = st.substr(nonZeroIdx);
    return res.empty() ? "0" : res;
}`
};
