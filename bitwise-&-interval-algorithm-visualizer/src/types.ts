/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrackId = 'bit' | 'interval';

export type AlgoId = 
  | 'single-number' 
  | 'hamming-weight' 
  | 'power-of-two' 
  | 'merge-intervals' 
  | 'insert-interval' 
  | 'erase-overlap'
  | 'meeting-rooms'
  | 'meeting-rooms-ii';

export interface CodeBlock {
  language: string;
  code: string;
  lines: string[];
}

export interface SimulationStep<T = any> {
  line: number; // 1-indexed C++ line to highlight
  description: string; // Detail explanation for students
  variables: {
    [key: string]: any;
  };
  dataState: T; // Track-specific visual state
}

// Visual State Structures

export interface SingleNumberState {
  nums: number[];
  currentIndex: number; // -1 if not started or finished
  accumulator: number;
  completedIndices: number[];
}

export interface HammingWeightState {
  n: number;
  originalN: number;
  count: number;
  binaryRepresentation: string; // 32-bit binary representation of current n
  maskRepresentation?: string; // representation of n-1 or active bits
  operationType: 'start' | 'check' | 'apply' | 'increment' | 'done';
}

export interface PowerOfTwoState {
  n: number;
  originalN: number;
  isPowerOfTwo: boolean;
  nBinary: string;
  nMinusOneBinary: string;
  andResultBinary: string;
  operationType: 'start' | 'check-zero' | 'and-operation' | 'done';
}

export interface Interval {
  id: number;
  start: number;
  end: number;
  color?: string; // Visual coloring
}

export interface MergeIntervalsState {
  originalIntervals: Interval[];
  intervals: Interval[]; // working sorted list
  currentIndex: number;
  stack: Interval[];
  comparing: boolean;
  overlapping: boolean;
}

export interface InsertIntervalState {
  intervals: Interval[];
  newInterval: Interval;
  currentIndex: number;
  result: Interval[];
  phase: 'left' | 'merge' | 'right' | 'done';
  tempNewInterval?: Interval; // active changing interval
}

export interface EraseOverlapState {
  intervals: Interval[];
  currentIndex: number;
  prevEnd: number | null;
  removedIndices: number[];
  selectedIndices: number[];
  count: number;
}

export interface MeetingRoomsState {
  intervals: Interval[];
  currentIndex: number;
  hasConflict: boolean;
  conflictPairs: number[]; // indices of conflicting intervals if any
}

export interface MeetingRoomsIIState {
  intervals: Interval[];
  starts: number[];
  ends: number[];
  startIndex: number;
  endIndex: number;
  activeRooms: number;
  maxRooms: number;
}

// Preset Data Defaults

export const PRESETS = {
  'single-number': [4, 1, 2, 1, 2],
  'hamming-weight': 11, // binary: 1011 -> count: 3
  'power-of-two': 16,
  'merge-intervals': [
    { id: 1, start: 1, end: 3 },
    { id: 2, start: 2, end: 6 },
    { id: 3, start: 8, end: 10 },
    { id: 4, start: 15, end: 18 }
  ] as Interval[],
  'insert-interval': {
    intervals: [
      { id: 1, start: 1, end: 3 },
      { id: 2, start: 6, end: 9 }
    ] as Interval[],
    newInterval: { id: 99, start: 2, end: 5 } as Interval
  },
  'erase-overlap': [
    { id: 1, start: 1, end: 2 },
    { id: 2, start: 2, end: 3 },
    { id: 3, start: 3, end: 4 },
    { id: 4, start: 1, end: 3 }
  ] as Interval[],
  'meeting-rooms': [
    { id: 1, start: 0, end: 30 },
    { id: 2, start: 5, end: 10 },
    { id: 3, start: 15, end: 20 }
  ] as Interval[],
  'meeting-rooms-ii': [
    { id: 1, start: 0, end: 30 },
    { id: 2, start: 5, end: 10 },
    { id: 3, start: 15, end: 20 }
  ] as Interval[]
};

// C++ Source Code Templates

export const CODE_TEMPLATES: Record<AlgoId, CodeBlock> = {
  'single-number': {
    language: 'cpp',
    code: `int singleNumber(vector<int>& nums) {
    int xor_sum = 0;
    for (int num : nums) {
        xor_sum ^= num;
    }
    return xor_sum;
}`,
    lines: [
      'int singleNumber(vector<int>& nums) {',
      '    int xor_sum = 0;',
      '    for (int num : nums) {',
      '        xor_sum ^= num;',
      '    }',
      '    return xor_sum;',
      '}'
    ]
  },
  'hamming-weight': {
    language: 'cpp',
    code: `int hammingWeight(uint32_t n) {
    int count = 0;
    while (n > 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
}`,
    lines: [
      'int hammingWeight(uint32_t n) {',
      '    int count = 0;',
      '    while (n > 0) {',
      '        n = n & (n - 1);',
      '        count++;',
      '    }',
      '    return count;',
      '}'
    ]
  },
  'power-of-two': {
    language: 'cpp',
    code: `bool isPowerOfTwo(int n) {
    if (n <= 0) {
        return false;
    }
    return (n & (n - 1)) == 0;
}`,
    lines: [
      'bool isPowerOfTwo(int n) {',
      '    if (n <= 0) {',
      '        return false;',
      '    }',
      '    return (n & (n - 1)) == 0;',
      '}'
    ]
  },
  'merge-intervals': {
    language: 'cpp',
    code: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    merged.push_back(intervals[0]);
    for (int i = 1; i < intervals.size(); ++i) {
        auto& last = merged.back();
        if (intervals[i][0] <= last[1]) {
            last[1] = max(last[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}`,
    lines: [
      'vector<vector<int>> merge(vector<vector<int>>& intervals) {',
      '    if (intervals.empty()) return {};',
      '    sort(intervals.begin(), intervals.end());',
      '    vector<vector<int>> merged;',
      '    merged.push_back(intervals[0]);',
      '    for (int i = 1; i < intervals.size(); ++i) {',
      '        auto& last = merged.back();',
      '        if (intervals[i][0] <= last[1]) {',
      '            last[1] = max(last[1], intervals[i][1]);',
      '        } else {',
      '            merged.push_back(intervals[i]);',
      '        }',
      '    }',
      '    return merged;',
      '}'
    ]
  },
  'insert-interval': {
    language: 'cpp',
    code: `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>> result;
    int i = 0, n = intervals.size();
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push_back(intervals[i++]);
    }
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push_back(newInterval);
    while (i < n) {
        result.push_back(intervals[i++]);
    }
    return result;
}`,
    lines: [
      'vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {',
      '    vector<vector<int>> result;',
      '    int i = 0, n = intervals.size();',
      '    while (i < n && intervals[i][1] < newInterval[0]) {',
      '        result.push_back(intervals[i++]);',
      '    }',
      '    while (i < n && intervals[i][0] <= newInterval[1]) {',
      '        newInterval[0] = min(newInterval[0], intervals[i][0]);',
      '        newInterval[1] = max(newInterval[1], intervals[i][1]);',
      '        i++;',
      '    }',
      '    result.push_back(newInterval);',
      '    while (i < n) {',
      '        result.push_back(intervals[i++]);',
      '    }',
      '    return result;',
      '}'
    ]
  },
  'erase-overlap': {
    language: 'cpp',
    code: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1];
    });
    int count = 0;
    int prev_end = intervals[0][1];
    for (int i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] < prev_end) {
            count++;
        } else {
            prev_end = intervals[i][1];
        }
    }
    return count;
}`,
    lines: [
      'int eraseOverlapIntervals(vector<vector<int>>& intervals) {',
      '    if (intervals.empty()) return 0;',
      '    sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {',
      '        return a[1] < b[1];',
      '    });',
      '    int count = 0;',
      '    int prev_end = intervals[0][1];',
      '    for (int i = 1; i < intervals.size(); ++i) {',
      '        if (intervals[i][0] < prev_end) {',
      '            count++;',
      '        } else {',
      '            prev_end = intervals[i][1];',
      '        }',
      '    }',
      '    return count;',
      '}'
    ]
  },
  'meeting-rooms': {
    language: 'cpp',
    code: `bool canAttendMeetings(vector<vector<int>>& intervals) {
    if (intervals.empty()) return true;
    sort(intervals.begin(), intervals.end());
    for (int i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] < intervals[i - 1][1]) {
            return false;
        }
    }
    return true;
}`,
    lines: [
      'bool canAttendMeetings(vector<vector<int>>& intervals) {',
      '    if (intervals.empty()) return true;',
      '    sort(intervals.begin(), intervals.end());',
      '    for (int i = 1; i < intervals.size(); ++i) {',
      '        if (intervals[i][0] < intervals[i - 1][1]) {',
      '            return false;',
      '        }',
      '    }',
      '    return true;',
      '}'
    ]
  },
  'meeting-rooms-ii': {
    language: 'cpp',
    code: `int minMeetingRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    vector<int> starts, ends;
    for (auto& it : intervals) {
        starts.push_back(it[0]);
        ends.push_back(it[1]);
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    int rooms = 0, endIdx = 0;
    for (int i = 0; i < starts.size(); ++i) {
        if (starts[i] < ends[endIdx]) {
            rooms++;
        } else {
            endIdx++;
        }
    }
    return rooms;
}`,
    lines: [
      'int minMeetingRooms(vector<vector<int>>& intervals) {',
      '    if (intervals.empty()) return 0;',
      '    vector<int> starts, ends;',
      '    for (auto& it : intervals) {',
      '        starts.push_back(it[0]);',
      '        ends.push_back(it[1]);',
      '    }',
      '    sort(starts.begin(), starts.end());',
      '    sort(ends.begin(), ends.end());',
      '    int rooms = 0, endIdx = 0;',
      '    for (int i = 0; i < starts.size(); ++i) {',
      '        if (starts[i] < ends[endIdx]) {',
      '            rooms++;',
      '        } else {',
      '            endIdx++;',
      '        }',
      '    }',
      '    return rooms;',
      '}'
    ]
  }
};
