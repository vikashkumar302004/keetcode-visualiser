import { AlgorithmId } from '../types';

export interface CppSnippet {
  code: string;
  lines: string[];
}

export const CPP_SNIPPETS: Record<AlgorithmId, CppSnippet> = {
  reverse_words: {
    code: `void reverseWords(string& s) {
    // 1. Clean extra spaces
    int n = s.length();
    int i = 0, j = 0;
    while (j < n) {
        while (j < n && s[j] == ' ') j++; // skip spaces
        if (j == n) break;
        if (i > 0) s[i++] = ' '; // add a single space separator
        int start = i;
        while (j < n && s[j] != ' ') {
            s[i++] = s[j++];
        }
        reverse(s.begin() + start, s.begin() + i);
    }
    s.resize(i);
    // 2. Reverse the whole string
    reverse(s.begin(), s.end());
}`,
    lines: [
      "void reverseWords(string& s) {",
      "    // 1. Clean extra spaces",
      "    int n = s.length();",
      "    int i = 0, j = 0;",
      "    while (j < n) {",
      "        while (j < n && s[j] == ' ') j++; // skip spaces",
      "        if (j == n) break;",
      "        if (i > 0) s[i++] = ' '; // single separator",
      "        int start = i;",
      "        while (j < n && s[j] != ' ') {",
      "            s[i++] = s[j++];",
      "        }",
      "        reverse(s.begin() + start, s.begin() + i);",
      "    }",
      "    s.resize(i);",
      "    // 2. Reverse the whole string",
      "    reverse(s.begin(), s.end());",
      "}"
    ]
  },
  longest_common_prefix: {
    code: `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    // Vertical scanning approach
    for (int col = 0; col < strs[0].length(); col++) {
        char c = strs[0][col];
        for (int row = 1; row < strs.size(); row++) {
            if (col == strs[row].length() || strs[row][col] != c) {
                return strs[0].substr(0, col);
            }
        }
    }
    return strs[0];
}`,
    lines: [
      "string longestCommonPrefix(vector<string>& strs) {",
      "    if (strs.empty()) return \"\";",
      "    // Vertical scanning approach",
      "    for (int col = 0; col < strs[0].length(); col++) {",
      "        char c = strs[0][col];",
      "        for (int row = 1; row < strs.size(); row++) {",
      "            if (col == strs[row].length() || strs[row][col] != c) {",
      "                return strs[0].substr(0, col);",
      "            }",
      "        }",
      "    }",
      "    return strs[0];",
      "}"
    ]
  },
  valid_anagram: {
    code: `bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    int count[26] = {0};
    for (int i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int i = 0; i < 26; i++) {
        if (count[i] != 0) return false;
    }
    return true;
}`,
    lines: [
      "bool isAnagram(string s, string t) {",
      "    if (s.length() != t.length()) return false;",
      "    int count[26] = {0};",
      "    for (int i = 0; i < s.length(); i++) {",
      "        count[s[i] - 'a']++;",
      "        count[t[i] - 'a']--;",
      "    }",
      "    for (int i = 0; i < 26; i++) {",
      "        if (count[i] != 0) return false;",
      "    }",
      "    return true;",
      "}"
    ]
  },
  isomorphic_strings: {
    code: `bool isIsomorphic(string s, string t) {
    char map_s[256] = {0};
    char map_t[256] = {0};
    for (int i = 0; i < s.length(); i++) {
        if (map_s[s[i]] != 0 && map_s[s[i]] != t[i]) return false;
        if (map_t[t[i]] != 0 && map_t[t[i]] != s[i]) return false;
        map_s[s[i]] = t[i];
        map_t[t[i]] = s[i];
    }
    return true;
}`,
    lines: [
      "bool isIsomorphic(string s, string t) {",
      "    char map_s[256] = {0};",
      "    char map_t[256] = {0};",
      "    for (int i = 0; i < s.length(); i++) {",
      "        if (map_s[s[i]] != 0 && map_s[s[i]] != t[i]) return false;",
      "        if (map_t[t[i]] != 0 && map_t[t[i]] != s[i]) return false;",
      "        map_s[s[i]] = t[i];",
      "        map_t[t[i]] = s[i];",
      "    }",
      "    return true;",
      "}"
    ]
  },
  atoi: {
    code: `int myAtoi(string s) {
    int i = 0, n = s.length();
    // 1. Skip leading whitespace
    while (i < n && s[i] == ' ') i++;
    if (i == n) return 0;
    // 2. Read sign
    int sign = 1;
    if (s[i] == '+' || s[i] == '-') {
        sign = (s[i] == '-') ? -1 : 1;
        i++;
    }
    // 3. Accumulate digits & Clamp
    long num = 0;
    while (i < n && isdigit(s[i])) {
        num = num * 10 + (s[i] - '0');
        if (sign * num <= INT_MIN) return INT_MIN;
        if (sign * num >= INT_MAX) return INT_MAX;
        i++;
    }
    return sign * num;
}`,
    lines: [
      "int myAtoi(string s) {",
      "    int i = 0, n = s.length();",
      "    // 1. Skip leading whitespace",
      "    while (i < n && s[i] == ' ') i++;",
      "    if (i == n) return 0;",
      "    // 2. Read sign",
      "    int sign = 1;",
      "    if (s[i] == '+' || s[i] == '-') {",
      "        sign = (s[i] == '-') ? -1 : 1;",
      "        i++;",
      "    }",
      "    // 3. Accumulate digits & Clamp",
      "    long num = 0;",
      "    while (i < n && isdigit(s[i])) {",
      "        num = num * 10 + (s[i] - '0');",
      "        if (sign * num <= INT_MIN) return INT_MIN;",
      "        if (sign * num >= INT_MAX) return INT_MAX;",
      "        i++;",
      "    }",
      "    return sign * num;",
      "}"
    ]
  },
  string_compression: {
    code: `int compress(vector<char>& chars) {
    int write = 0, read = 0;
    int n = chars.size();
    while (read < n) {
        char curr = chars[read];
        int count = 0;
        while (read < n && chars[read] == curr) {
            read++;
            count++;
        }
        chars[write++] = curr;
        if (count > 1) {
            string countStr = to_string(count);
            for (char c : countStr) {
                chars[write++] = c;
            }
        }
    }
    return write;
}`,
    lines: [
      "int compress(vector<char>& chars) {",
      "    int write = 0, read = 0;",
      "    int n = chars.size();",
      "    while (read < n) {",
      "        char curr = chars[read];",
      "        int count = 0;",
      "        while (read < n && chars[read] == curr) {",
      "            read++;",
      "            count++;",
      "        }",
      "        chars[write++] = curr;",
      "        if (count > 1) {",
      "            string countStr = to_string(count);",
      "            for (char c : countStr) {",
      "                chars[write++] = c;",
      "            }",
      "        }",
      "    }",
      "    return write;",
      "}"
    ]
  },
  valid_palindrome: {
    code: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}`,
    lines: [
      "bool isPalindrome(string s) {",
      "    int left = 0, right = s.length() - 1;",
      "    while (left < right) {",
      "        while (left < right && !isalnum(s[left])) left++;",
      "        while (left < right && !isalnum(s[right])) right--;",
      "        if (tolower(s[left]) != tolower(s[right])) return false;",
      "        left++;",
      "        right--;",
      "    }",
      "    return true;",
      "}"
    ]
  },
  longest_palindromic_substring: {
    code: `string longestPalindrome(string s) {
    if (s.length() < 1) return "";
    int start = 0, maxLen = 0;
    auto expand = [&](int left, int right) {
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    };
    for (int i = 0; i < s.length(); i++) {
        int len1 = expand(i, i);     // Odd center
        int len2 = expand(i, i + 1); // Even center
        int len = max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    return s.substr(start, maxLen);
}`,
    lines: [
      "string longestPalindrome(string s) {",
      "    if (s.length() < 1) return \"\";",
      "    int start = 0, maxLen = 0;",
      "    auto expand = [&](int left, int right) {",
      "        while (left >= 0 && right < s.length() && s[left] == s[right]) {",
      "            left--; right++;",
      "        }",
      "        return right - left - 1;",
      "    };",
      "    for (int i = 0; i < s.length(); i++) {",
      "        int len1 = expand(i, i);     // Odd center",
      "        int len2 = expand(i, i + 1); // Even center",
      "        int len = max(len1, len2);",
      "        if (len > maxLen) {",
      "            maxLen = len;",
      "            start = i - (len - 1) / 2;",
      "        }",
      "    }",
      "    return s.substr(start, maxLen);",
      "}"
    ]
  },
  palindromic_substrings_count: {
    code: `int countSubstrings(string s) {
    int count = 0;
    auto expand = [&](int left, int right) {
        int localCount = 0;
        while (left >= 0 && right < s.length() && s[left] == s[right]) {
            localCount++;
            left--;
            right++;
        }
        return localCount;
    };
    for (int i = 0; i < s.length(); i++) {
        count += expand(i, i);     // Odd length
        count += expand(i, i + 1); // Even length
    }
    return count;
}`,
    lines: [
      "int countSubstrings(string s) {",
      "    int count = 0;",
      "    auto expand = [&](int left, int right) {",
      "        int localCount = 0;",
      "        while (left >= 0 && right < s.length() && s[left] == s[right]) {",
      "            localCount++;",
      "            left--; right++;",
      "        }",
      "        return localCount;",
      "    };",
      "    for (int i = 0; i < s.length(); i++) {",
      "        count += expand(i, i);     // Odd centers",
      "        count += expand(i, i + 1); // Even centers",
      "    }",
      "    return count;",
      "}"
    ]
  },
  strstr_naive: {
    code: `int strStrNaive(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m && text[i + j] == pattern[j]) {
            j++;
        }
        if (j == m) return i; // Found match at index i
    }
    return -1;
}`,
    lines: [
      "int strStrNaive(string text, string pattern) {",
      "    int n = text.length(), m = pattern.length();",
      "    for (int i = 0; i <= n - m; i++) {",
      "        int j = 0;",
      "        while (j < m && text[i + j] == pattern[j]) {",
      "            j++;",
      "        }",
      "        if (j == m) return i; // Match found!",
      "    }",
      "    return -1;",
      "}"
    ]
  },
  kmp_lps: {
    code: `vector<int> computeLPS(string pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1]; // fallback len
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}`,
    lines: [
      "vector<int> computeLPS(string pattern) {",
      "    int m = pattern.length();",
      "    vector<int> lps(m, 0);",
      "    int len = 0, i = 1;",
      "    while (i < m) {",
      "        if (pattern[i] == pattern[len]) {",
      "            len++;",
      "            lps[i] = len;",
      "            i++;",
      "        } else {",
      "            if (len != 0) {",
      "                len = lps[len - 1];",
      "            } else {",
      "                lps[i] = 0;",
      "                i++;",
      "            }",
      "        }",
      "    }",
      "    return lps;",
      "}"
    ]
  },
  kmp_search: {
    code: `vector<int> KMPSearch(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    vector<int> lps = computeLPS(pattern);
    vector<int> matches;
    int i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) {
            i++; j++;
        }
        if (j == m) {
            matches.push_back(i - j); // Match at index (i-j)
            j = lps[j - 1]; // shift using prefix length
        } else if (i < n && text[i] != pattern[j]) {
            if (j != 0) j = lps[j - 1];
            else i++;
        }
    }
    return matches;
}`,
    lines: [
      "vector<int> KMPSearch(string text, string pattern) {",
      "    int n = text.length(), m = pattern.length();",
      "    vector<int> lps = computeLPS(pattern);",
      "    vector<int> matches;",
      "    int i = 0, j = 0;",
      "    while (i < n) {",
      "        if (text[i] == pattern[j]) {",
      "            i++; j++;",
      "        }",
      "        if (j == m) {",
      "            matches.push_back(i - j);",
      "            j = lps[j - 1];",
      "        } else if (i < n && text[i] != pattern[j]) {",
      "            if (j != 0) j = lps[j - 1];",
      "            else i++;",
      "        }",
      "    }",
      "    return matches;",
      "}"
    ]
  },
  repeated_substring: {
    code: `bool repeatedSubstringPattern(string s) {
    int n = s.length();
    vector<int> lps = computeLPS(s);
    int len = lps[n - 1];
    return (len > 0 && n % (n - len) == 0);
}`,
    lines: [
      "bool repeatedSubstringPattern(string s) {",
      "    int n = s.length();",
      "    vector<int> lps = computeLPS(s);",
      "    int len = lps[n - 1];",
      "    return (len > 0 && n % (n - len) == 0);",
      "}"
    ]
  },
  rabin_karp: {
    code: `int rabinKarp(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    int B = 256, M = 101; // Base & Modulo
    int h_pat = 0, h_txt = 0, h_pow = 1;
    // Precompute B^(m-1) % M
    for (int i = 0; i < m - 1; i++) {
        h_pow = (h_pow * B) % M;
    }
    // Compute initial hashes
    for (int i = 0; i < m; i++) {
        h_pat = (B * h_pat + pattern[i]) % M;
        h_txt = (B * h_txt + text[i]) % M;
    }
    // Search sliding window
    for (int i = 0; i <= n - m; i++) {
        if (h_pat == h_txt) {
            // Hash collision -> verify chars
            int j = 0;
            while (j < m && text[i + j] == pattern[j]) j++;
            if (j == m) return i; // Real Match found!
        }
        if (i < n - m) {
            // Rolling Hash slide
            h_txt = (B * (h_txt - text[i] * h_pow) + text[i + m]) % M;
            if (h_txt < 0) h_txt += M;
        }
    }
    return -1;
}`,
    lines: [
      "int rabinKarp(string text, string pattern) {",
      "    int n = text.length(), m = pattern.length();",
      "    int B = 256, M = 101; // Base & Modulo",
      "    int h_pat = 0, h_txt = 0, h_pow = 1;",
      "    for (int i = 0; i < m - 1; i++) h_pow = (h_pow * B) % M;",
      "    for (int i = 0; i < m; i++) {",
      "        h_pat = (B * h_pat + pattern[i]) % M;",
      "        h_txt = (B * h_txt + text[i]) % M;",
      "    }",
      "    for (int i = 0; i <= n - m; i++) {",
      "        if (h_pat == h_txt) {",
      "            int j = 0;",
      "            while (j < m && text[i + j] == pattern[j]) j++;",
      "            if (j == m) return i; // Match!",
      "        }",
      "        if (i < n - m) {",
      "            h_txt = (B * (h_txt - text[i] * h_pow) + text[i + m]) % M;",
      "            if (h_txt < 0) h_txt += M;",
      "        }",
      "    }",
      "    return -1;",
      "}"
    ]
  },
  z_algorithm: {
    code: `vector<int> calculateZ(string s) {
    int n = s.length();
    vector<int> z(n, 0);
    int L = 0, R = 0;
    for (int i = 1; i < n; i++) {
        if (i <= R) {
            z[i] = min(R - i + 1, z[i - L]);
        }
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }
        if (i + z[i] - 1 > R) {
            L = i;
            R = i + z[i] - 1;
        }
    }
    return z;
}`,
    lines: [
      "vector<int> calculateZ(string s) {",
      "    int n = s.length();",
      "    vector<int> z(n, 0);",
      "    int L = 0, R = 0;",
      "    for (int i = 1; i < n; i++) {",
      "        if (i <= R) {",
      "            z[i] = min(R - i + 1, z[i - L]);",
      "        }",
      "        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {",
      "            z[i]++;",
      "        }",
      "        if (i + z[i] - 1 > R) {",
      "            L = i;",
      "            R = i + z[i] - 1;",
      "        }",
      "    }",
      "    return z;",
      "}"
    ]
  },
  manacher: {
    code: `string manacher(string s) {
    // 1. Transform string
    string T = "^";
    for (char c : s) T += "#" + string(1, c);
    T += "#$";
    int n = T.length();
    vector<int> P(n, 0);
    int C = 0, R = 0;
    for (int i = 1; i < n - 1; i++) {
        int i_mirror = 2 * C - i;
        if (R > i) {
            P[i] = min(R - i, P[i_mirror]);
        }
        // Expand center symmetrically
        while (T[i + 1 + P[i]] == T[i - 1 - P[i]]) {
            P[i]++;
        }
        // Update center if right of window exceeded
        if (i + P[i] > R) {
            C = i;
            R = i + P[i];
        }
    }
    // Retrieve longest palindrome length & center
    int maxLen = 0, centerIndex = 0;
    for (int i = 1; i < n - 1; i++) {
        if (P[i] > maxLen) {
            maxLen = P[i];
            centerIndex = i;
        }
    }
    int start = (centerIndex - 1 - maxLen) / 2;
    return s.substr(start, maxLen);
}`,
    lines: [
      "string manacher(string s) {",
      "    string T = \"^\";",
      "    for (char c : s) T += \"#\" + string(1, c);",
      "    T += \"#$\";",
      "    int n = T.length();",
      "    vector<int> P(n, 0);",
      "    int C = 0, R = 0;",
      "    for (int i = 1; i < n - 1; i++) {",
      "        int i_mirror = 2 * C - i;",
      "        if (R > i) P[i] = min(R - i, P[i_mirror]);",
      "        while (T[i + 1 + P[i]] == T[i - 1 - P[i]]) P[i]++;",
      "        if (i + P[i] > R) {",
      "            C = i;",
      "            R = i + P[i];",
      "        }",
      "    }",
      "    // Find max value in P",
      "    int maxLen = 0, centerIndex = 0;",
      "    for (int i = 1; i < n - 1; i++) {",
      "        if (P[i] > maxLen) { maxLen = P[i]; centerIndex = i; }",
      "    }",
      "    int start = (centerIndex - 1 - maxLen) / 2;",
      "    return s.substr(start, maxLen);",
      "}"
    ]
  }
};
