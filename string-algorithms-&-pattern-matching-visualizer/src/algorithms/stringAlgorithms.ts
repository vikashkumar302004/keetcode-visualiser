import { AlgorithmId, SimulationStep, CellState } from '../types';

// Helper to make character states record
function makeNeutralStates(length: number): Record<number, CellState> {
  const states: Record<number, CellState> = {};
  for (let i = 0; i < length; i++) {
    states[i] = 'neutral';
  }
  return states;
}

export function generateSimulationSteps(
  id: AlgorithmId,
  text: string,
  pattern: string,
  caseSensitive: boolean
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  
  // Normalize casing if insensitive
  const normalizeChar = (c: string) => caseSensitive ? c : c.toLowerCase();
  const compareChars = (c1: string, c2: string) => {
    if (!c1 || !c2) return false;
    return normalizeChar(c1) === normalizeChar(c2);
  };

  switch (id) {
    case 'reverse_words': {
      // s is the source text.
      let s = text;
      const n = s.length;
      let i = 0;
      let j = 0;
      
      const pushStep = (line: number, desc: string, overrideS?: string, customStates?: Record<number, CellState>, twoPtrs?: any) => {
        const currentS = overrideS !== undefined ? overrideS : s;
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: currentS,
          pattern: '',
          textPointer: j,
          patternPointer: i,
          twoPointers: twoPtrs || { left: i, right: j },
          textStates: customStates || makeNeutralStates(currentS.length),
          patternStates: {},
          vars: { i, j, n, s: `"${currentS}"` }
        });
      };

      pushStep(1, 'Initializing word-reversal algorithm with string s.', s);
      pushStep(3, `Computing string length n = ${n}. Initializing write-head i = 0, read-head j = 0.`, s);

      const chars = s.split('');
      while (j < n) {
        pushStep(5, `Checking loop condition: read pointer j (${j}) < length (${n}).`, chars.join(''));
        
        // Skip leading spaces
        let spaceSkipped = false;
        while (j < n && chars[j] === ' ') {
          const states = makeNeutralStates(chars.length);
          states[j] = 'scanning';
          j++;
          spaceSkipped = true;
          pushStep(6, `Reading index j = ${j-1}. Found space character. Skipping it.`, chars.join(''), states);
        }
        
        if (j === n) {
          pushStep(7, 'Read pointer j reached end of string. Breaking space-skipping loop.', chars.join(''));
          break;
        }

        if (i > 0) {
          chars[i] = ' ';
          const states = makeNeutralStates(chars.length);
          states[i] = 'highlight';
          i++;
          pushStep(8, `Write index i > 0. Placing single space separator at write index i = ${i - 1}.`, chars.join(''), states);
        }

        const start = i;
        pushStep(9, `Recording start index of current word: start = ${start}.`, chars.join(''));

        while (j < n && chars[j] !== ' ') {
          const states = makeNeutralStates(chars.length);
          states[j] = 'scanning';
          states[i] = 'active';
          
          chars[i] = chars[j];
          i++;
          j++;
          pushStep(10, `Copying character '${chars[i-1]}' from read-head j = ${j-1} to write-head i = ${i-1}. Incrementing both pointers.`, chars.join(''), states);
        }

        // Reverse the single word we just copied
        const wordLen = i - start;
        pushStep(13, `Word boundaries identified: [${start} ... ${i-1}] ("${chars.slice(start, i).join('')}"). Reversing this word in-place.`, chars.join(''));
        
        let l = start, r = i - 1;
        while (l < r) {
          const temp = chars[l];
          chars[l] = chars[r];
          chars[r] = temp;
          
          const states = makeNeutralStates(chars.length);
          states[l] = 'matched';
          states[r] = 'matched';
          l++;
          r--;
          pushStep(13, `Swapping characters inside word [${start}...${i-1}] during sub-reversal.`, chars.join(''), states, { left: l, right: r });
        }
        pushStep(13, `Word reversal complete: "${chars.slice(start, i).join('')}".`, chars.join(''));
      }

      // Resize the string to write-head position i
      const resizedS = chars.slice(0, i).join('');
      pushStep(15, `Resizing string to exclude unwritten tail. New string: "${resizedS}" (length ${i}).`, resizedS);

      // Reverse the entire string
      const finalChars = resizedS.split('');
      pushStep(17, 'Reversing the entire string in-place to restore original word order.', finalChars.join(''));
      
      let left = 0, right = finalChars.length - 1;
      while (left < right) {
        const temp = finalChars[left];
        finalChars[left] = finalChars[right];
        finalChars[right] = temp;
        
        const states = makeNeutralStates(finalChars.length);
        states[left] = 'matched';
        states[right] = 'matched';
        left++;
        right--;
        pushStep(17, `Swapping outer characters at indices ${left-1} and ${right+1} for final string reversal.`, finalChars.join(''), states, { left, right });
      }

      pushStep(18, `Algorithm finished. Final word-reversed string: "${finalChars.join('')}"`, finalChars.join(''));
      break;
    }

    case 'longest_common_prefix': {
      // Parse list from comma separated text
      const list = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (list.length === 0) {
        steps.push({
          stepIndex: 0,
          line: 2,
          description: 'Input list is empty. Returning empty string.',
          text,
          pattern: '',
          textPointer: 0,
          patternPointer: 0,
          textStates: {},
          patternStates: {},
          vars: { list }
        });
        break;
      }

      const pushLcpStep = (line: number, desc: string, col: number, row: number, customStates: Record<number, CellState>, currentPrefix: string) => {
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: list.join(' | '),
          pattern: '',
          textPointer: col,
          patternPointer: row,
          textStates: customStates,
          patternStates: {},
          lcpCurrentPrefix: currentPrefix,
          lcpStringIndex: row,
          lcpStringsList: list,
          vars: { col, row, currentPrefix, listSize: list.length }
        });
      };

      // Base step
      pushLcpStep(1, `Initializing Longest Common Prefix with list: [${list.map(s => `"${s}"`).join(', ')}]`, 0, 0, {}, '');
      pushLcpStep(2, `First string in list is "${list[0]}". Starting scanning index.`, 0, 0, {}, '');

      const shortestLen = Math.min(...list.map(s => s.length));
      let col = 0;
      let matchedPrefix = '';
      let mismatchFound = false;

      // Reconstruct indices based on "string1 | string2 | string3" format for visual tracking
      const getVisualIndex = (strRow: number, charCol: number) => {
        let offset = 0;
        for (let r = 0; r < strRow; r++) {
          offset += list[r].length + 3; // adding length of ' | '
        }
        return offset + charCol;
      };

      for (col = 0; col < list[0].length; col++) {
        const c = list[0][col];
        pushLcpStep(4, `Examining column ${col}. Anchoring matching character to '${c}' from first string.`, col, 0, {
          [getVisualIndex(0, col)]: 'active'
        }, matchedPrefix);

        for (let row = 1; row < list.length; row++) {
          const currentVisualStates: Record<number, CellState> = {};
          // Highlight previous matches
          for (let prevCol = 0; prevCol < col; prevCol++) {
            for (let r = 0; r < list.length; r++) {
              currentVisualStates[getVisualIndex(r, prevCol)] = 'matched';
            }
          }
          currentVisualStates[getVisualIndex(0, col)] = 'active';
          currentVisualStates[getVisualIndex(row, col)] = 'scanning';

          pushLcpStep(6, `Comparing list[0][${col}] ('${c}') with list[${row}][${col}] ('${list[row][col] || 'EOF'}').`, col, row, currentVisualStates, matchedPrefix);

          if (col === list[row].length || !compareChars(list[row][col], c)) {
            // Mismatch
            currentVisualStates[getVisualIndex(row, col)] = 'mismatched';
            pushLcpStep(7, `Mismatch or boundary hit at list[${row}] col ${col}. Truncating prefix to index 0...${col - 1}.`, col, row, currentVisualStates, matchedPrefix);
            mismatchFound = true;
            break;
          } else {
            // Match in this row
            currentVisualStates[getVisualIndex(row, col)] = 'matched';
            pushLcpStep(6, `Match found at list[${row}] col ${col}! Continuing verification.`, col, row, currentVisualStates, matchedPrefix);
          }
        }

        if (mismatchFound) {
          break;
        }
        matchedPrefix += c;
        // Mark all in this column as matched
        const finalColStates: Record<number, CellState> = {};
        for (let prevCol = 0; prevCol <= col; prevCol++) {
          for (let r = 0; r < list.length; r++) {
            finalColStates[getVisualIndex(r, prevCol)] = 'matched';
          }
        }
        pushLcpStep(4, `Column ${col} fully verified across all strings. Prefix grows to "${matchedPrefix}".`, col, list.length - 1, finalColStates, matchedPrefix);
      }

      const finalStates: Record<number, CellState> = {};
      for (let prevCol = 0; prevCol < matchedPrefix.length; prevCol++) {
        for (let r = 0; r < list.length; r++) {
          finalStates[getVisualIndex(r, prevCol)] = 'matched';
        }
      }
      pushLcpStep(12, `Algorithm finished. LCP of the group is "${matchedPrefix}".`, col, list.length - 1, finalStates, matchedPrefix);
      break;
    }

    case 'valid_anagram': {
      const s = text;
      const t = pattern;
      const counts: Record<string, number> = {};
      // Init counts
      'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => counts[char] = 0);

      const pushAnagramStep = (line: number, desc: string, i: number, highlightS: number | null, highlightT: number | null, customStatesS?: CellState, customStatesT?: CellState) => {
        const textStates: Record<number, CellState> = {};
        const patternStates: Record<number, CellState> = {};
        
        if (highlightS !== null) textStates[highlightS] = customStatesS || 'scanning';
        if (highlightT !== null) patternStates[highlightT] = customStatesT || 'scanning';

        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: s,
          pattern: t,
          textPointer: highlightS ?? -1,
          patternPointer: highlightT ?? -1,
          textStates,
          patternStates,
          charFrequencyDelta: { ...counts },
          vars: { i, sLen: s.length, tLen: t.length }
        });
      };

      pushAnagramStep(1, `Initializing Anagram Validation. Comparing s ("${s}") and t ("${t}").`, 0, null, null);
      pushAnagramStep(2, `Checking string lengths: s (${s.length}) vs t (${t.length}).`, 0, null, null);

      if (s.length !== t.length) {
        pushAnagramStep(2, `Length mismatch! s (${s.length}) != t (${t.length}). Returning false.`, 0, null, null);
        break;
      }

      pushAnagramStep(3, 'Allocating 26-bucket integer frequency array initialized to all zeros.', 0, null, null);

      for (let i = 0; i < s.length; i++) {
        const charS = normalizeChar(s[i]);
        const charT = normalizeChar(t[i]);

        pushAnagramStep(5, `Processing index i = ${i}. Scanning '${s[i]}' in s and '${t[i]}' in t.`, i, i, i, 'scanning', 'scanning');
        
        counts[charS] = (counts[charS] || 0) + 1;
        pushAnagramStep(6, `Incrementing bucket '${charS}' to ${counts[charS]}.`, i, i, i, 'matched', 'scanning');
        
        counts[charT] = (counts[charT] || 0) - 1;
        pushAnagramStep(7, `Decrementing bucket '${charT}' to ${counts[charT]}.`, i, i, i, 'matched', 'matched');
      }

      // Check final counts
      pushAnagramStep(9, 'Verifying 26-bucket frequency delta array is balanced (all elements must be 0).', s.length, null, null);
      
      let isAna = true;
      for (const char of 'abcdefghijklmnopqrstuvwxyz'.split('')) {
        if (counts[char] !== 0) {
          isAna = false;
          pushAnagramStep(10, `Bucket '${char}' has unbalanced frequency delta: ${counts[char]}. Not an anagram. Returning false.`, s.length, null, null);
          break;
        }
      }

      if (isAna) {
        // Highlight all as matched
        const textStates = makeNeutralStates(s.length);
        const patternStates = makeNeutralStates(t.length);
        for (let idx = 0; idx < s.length; idx++) {
          textStates[idx] = 'matched';
          patternStates[idx] = 'matched';
        }
        steps.push({
          stepIndex: steps.length,
          line: 12,
          description: 'All 26 buckets are perfectly balanced! Returning true.',
          text: s,
          pattern: t,
          textPointer: s.length,
          patternPointer: t.length,
          textStates,
          patternStates,
          charFrequencyDelta: { ...counts },
          vars: { sLen: s.length, tLen: t.length, isAnagram: true }
        });
      }
      break;
    }

    case 'isomorphic_strings': {
      const s = text;
      const t = pattern;
      const mapS: Record<string, string> = {};
      const mapT: Record<string, string> = {};

      const pushIsoStep = (line: number, desc: string, i: number, highlight: boolean, isError: boolean = false) => {
        const textStates: Record<number, CellState> = {};
        const patternStates: Record<number, CellState> = {};
        if (highlight && i < s.length) {
          textStates[i] = isError ? 'mismatched' : 'scanning';
          patternStates[i] = isError ? 'mismatched' : 'scanning';
        } else if (!isError) {
          // Highlight previous matches
          for (let idx = 0; idx < i; idx++) {
            textStates[idx] = 'matched';
            patternStates[idx] = 'matched';
          }
        }
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: s,
          pattern: t,
          textPointer: i,
          patternPointer: i,
          textStates,
          patternStates,
          mappingStoT: { ...mapS },
          mappingTtoS: { ...mapT },
          vars: { i, mapSSize: Object.keys(mapS).length, mapTSize: Object.keys(mapT).length }
        });
      };

      pushIsoStep(1, `Initializing Isomorphic check between S ("${s}") and T ("${t}").`, 0, false);
      pushIsoStep(2, 'Creating mapping tables map_s and map_t initialized with zeros.', 0, false);

      let isomorphic = true;
      for (let i = 0; i < s.length; i++) {
        const charS = s[i];
        const charT = t[i];

        pushIsoStep(5, `Examining S[${i}] ('${charS}') and T[${i}] ('${charT}'). Checking maps.`, i, true);

        if (mapS[charS] !== undefined && mapS[charS] !== charT) {
          pushIsoStep(6, `Conflict found in map_s! '${charS}' already mapped to '${mapS[charS]}', cannot map to '${charT}'. Returning false.`, i, true, true);
          isomorphic = false;
          break;
        }

        if (mapT[charT] !== undefined && mapT[charT] !== charS) {
          pushIsoStep(7, `Conflict found in map_t! '${charT}' already mapped to '${mapT[charT]}', cannot map to '${charS}'. Returning false.`, i, true, true);
          isomorphic = false;
          break;
        }

        mapS[charS] = charT;
        pushIsoStep(8, `Recording mapping map_s['${charS}'] -> '${charT}'.`, i, false);

        mapT[charT] = charS;
        pushIsoStep(9, `Recording mapping map_t['${charT}'] -> '${charS}'.`, i, false);
      }

      if (isomorphic) {
        pushIsoStep(11, 'All characters satisfy 1-to-1 bijection map. Returning true!', s.length, false);
      }
      break;
    }

    case 'atoi': {
      const s = text;
      const n = s.length;
      let i = 0;
      let sign = 1;
      let num = 0;
      let stage: 'whitespace' | 'sign' | 'digits' | 'clamp' | 'done' = 'whitespace';

      const pushAtoiStep = (line: number, desc: string, currentStage: typeof stage) => {
        const textStates = makeNeutralStates(s.length);
        if (i < n) textStates[i] = 'scanning';
        // Highlight written digits in emerald
        for (let idx = 0; idx < i; idx++) {
          if (s[idx] >= '0' && s[idx] <= '9') {
            textStates[idx] = 'matched';
          } else if (s[idx] === '+' || s[idx] === '-') {
            textStates[idx] = 'active';
          }
        }

        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: s,
          pattern: '',
          textPointer: i,
          patternPointer: 0,
          textStates,
          patternStates: {},
          atoiState: { sign, num, stage: currentStage },
          vars: { i, sign, num, stage: currentStage, sChar: s[i] ? `'${s[i]}'` : 'EOF' }
        });
      };

      pushAtoiStep(1, 'Initializing string-to-integer parsing (myAtoi).', 'whitespace');
      pushAtoiStep(4, 'Scanning leading whitespaces. Pointers set.', 'whitespace');

      while (i < n && s[i] === ' ') {
        i++;
        pushAtoiStep(4, `Found space at i = ${i - 1}. Skipping whitespace.`, 'whitespace');
      }

      if (i === n) {
        pushAtoiStep(5, 'Text contains only spaces. Terminating with 0.', 'done');
        break;
      }

      stage = 'sign';
      pushAtoiStep(7, `Setting sign variable. Checking sign character at i = ${i} ('${s[i]}').`, 'sign');

      if (s[i] === '+' || s[i] === '-') {
        sign = s[i] === '-' ? -1 : 1;
        i++;
        pushAtoiStep(8, `Sign is set to ${sign}. Advanced pointer to i = ${i}.`, 'sign');
      }

      stage = 'digits';
      pushAtoiStep(13, 'Beginning digits accumulation loop.', 'digits');

      const INT_MIN = -2147483648;
      const INT_MAX = 2147483647;

      while (i < n && s[i] >= '0' && s[i] <= '9') {
        const digit = parseInt(s[i]);
        num = num * 10 + digit;
        i++;
        pushAtoiStep(14, `Accumulated digit ${digit}. Numeric accumulator: ${num}.`, 'digits');

        const currentVal = sign * num;
        if (currentVal <= INT_MIN) {
          num = Math.abs(INT_MIN);
          pushAtoiStep(15, `Underflow detected! Clamping value to INT_MIN (${INT_MIN}).`, 'clamp');
          break;
        }
        if (currentVal >= INT_MAX) {
          num = INT_MAX;
          pushAtoiStep(16, `Overflow detected! Clamping value to INT_MAX (${INT_MAX}).`, 'clamp');
          break;
        }
      }

      pushAtoiStep(20, `Parsing complete. Final calculated integer: ${sign * num}.`, 'done');
      break;
    }

    case 'string_compression': {
      const chars = text.split('');
      const n = chars.length;
      let write = 0;
      let read = 0;

      const pushCompStep = (line: number, desc: string, highlightRead: number, highlightWrite: number) => {
        const textStates: Record<number, CellState> = {};
        for (let idx = 0; idx < n; idx++) {
          textStates[idx] = 'neutral';
        }
        if (highlightRead < n) textStates[highlightRead] = 'scanning';
        if (highlightWrite < n) textStates[highlightWrite] = 'active';
        
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: chars.join(''),
          pattern: '',
          textPointer: highlightRead,
          patternPointer: highlightWrite,
          twoPointers: { left: highlightRead, right: highlightWrite, write },
          textStates,
          patternStates: {},
          vars: { read: highlightRead, write: highlightWrite, n }
        });
      };

      pushCompStep(1, 'Initializing run-length string compression in-place.', read, write);
      pushCompStep(2, `Pointers: read = 0, write = 0, chars.size = ${n}.`, read, write);

      while (read < n) {
        pushCompStep(4, `Starting block scanning at read = ${read}.`, read, write);
        const curr = chars[read];
        let count = 0;
        
        pushCompStep(5, `Current block character target set to '${curr}'.`, read, write);

        while (read < n && chars[read] === curr) {
          read++;
          count++;
          pushCompStep(7, `Found match with '${curr}'. Block count = ${count}. Incremented read pointer to ${read}.`, read - 1, write);
        }

        // Write character
        chars[write] = curr;
        write++;
        pushCompStep(11, `Writing block character '${curr}' to write-index ${write - 1}.`, read, write - 1);

        if (count > 1) {
          pushCompStep(12, `Count of block (${count}) is > 1. Writing count digits to array.`, read, write);
          const countStr = count.toString();
          for (let cIdx = 0; cIdx < countStr.length; cIdx++) {
            const digitChar = countStr[cIdx];
            chars[write] = digitChar;
            write++;
            pushCompStep(14, `Writing digit character '${digitChar}' to write-index ${write - 1}.`, read, write - 1);
          }
        }
      }

      pushCompStep(20, `In-place compression complete. Resized compressed string length: ${write}. Output array: "${chars.slice(0, write).join('')}"`, read, write);
      break;
    }

    case 'valid_palindrome': {
      const s = text;
      const cleanChars = s.split('');
      
      const pushPalStep = (line: number, desc: string, l: number, r: number, highlight: boolean, isError: boolean = false) => {
        const textStates = makeNeutralStates(s.length);
        if (highlight) {
          textStates[l] = isError ? 'mismatched' : 'scanning';
          textStates[r] = isError ? 'mismatched' : 'scanning';
        } else {
          textStates[l] = 'active';
          textStates[r] = 'active';
        }
        
        // Mark matched outside edges as green
        for (let idx = 0; idx < l; idx++) {
          if (/[a-zA-Z0-9]/.test(s[idx])) textStates[idx] = 'matched';
        }
        for (let idx = s.length - 1; idx > r; idx--) {
          if (/[a-zA-Z0-9]/.test(s[idx])) textStates[idx] = 'matched';
        }

        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: s,
          pattern: '',
          textPointer: l,
          patternPointer: r,
          twoPointers: { left: l, right: r },
          textStates,
          patternStates: {},
          vars: { left: l, right: r, charLeft: s[l] ? `'${s[l]}'` : 'EOF', charRight: s[r] ? `'${s[r]}'` : 'EOF' }
        });
      };

      let left = 0;
      let right = s.length - 1;

      pushPalStep(1, `Initializing Palindrome check for S: "${s}"`, left, right, false);
      pushPalStep(2, `Setting pointers: left = 0, right = ${right}.`, left, right, false);

      let palindrome = true;
      while (left < right) {
        pushPalStep(3, `Evaluating loop condition: left (${left}) < right (${right}).`, left, right, false);

        // Skip left non-alnum
        let movedL = false;
        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) {
          left++;
          movedL = true;
          pushPalStep(4, `Left character at ${left-1} is non-alphanumeric. Skipping it. Pushing left pointer to ${left}.`, left, right, false);
        }

        // Skip right non-alnum
        let movedR = false;
        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) {
          right--;
          movedR = true;
          pushPalStep(5, `Right character at ${right+1} is non-alphanumeric. Skipping it. Pulling right pointer to ${right}.`, left, right, false);
        }

        if (left >= right) break;

        pushPalStep(6, `Comparing case-insensitively: left S[${left}] ('${s[left]}') with right S[${right}] ('${s[right]}').`, left, right, true);

        if (!compareChars(s[left], s[right])) {
          pushPalStep(6, `Mismatch found! S[${left}] ('${s[left]}') != S[${right}] ('${s[right]}'). Not a palindrome. Returning false.`, left, right, true, true);
          palindrome = false;
          break;
        }

        pushPalStep(7, `Match confirmed! S[${left}] ('${s[left]}') == S[${right}] ('${s[right]}'). Advancing outward pointers inward.`, left, right, true);
        left++;
        right--;
      }

      if (palindrome) {
        // Mark all alnum as green
        const textStates = makeNeutralStates(s.length);
        for (let idx = 0; idx < s.length; idx++) {
          if (/[a-zA-Z0-9]/.test(s[idx])) {
            textStates[idx] = 'matched';
          }
        }
        steps.push({
          stepIndex: steps.length,
          line: 10,
          description: 'Pointers crossed! String S is a valid palindrome. Returning true.',
          text: s,
          pattern: '',
          textPointer: left,
          patternPointer: right,
          twoPointers: { left, right },
          textStates,
          patternStates: {},
          vars: { left, right, isPalindrome: true }
        });
      }
      break;
    }

    case 'longest_palindromic_substring': {
      const s = text;
      const n = s.length;
      let start = 0;
      let maxLen = 0;

      const pushLpsStep = (line: number, desc: string, i: number, l: number, r: number, isExp: boolean, matchStatus: 'checking' | 'matched' | 'mismatch') => {
        const textStates = makeNeutralStates(s.length);
        textStates[i] = 'active'; // active center
        
        if (l >= 0 && r < n) {
          if (matchStatus === 'checking') {
            textStates[l] = 'scanning';
            textStates[r] = 'scanning';
          } else if (matchStatus === 'matched') {
            textStates[l] = 'matched';
            textStates[r] = 'matched';
          } else if (matchStatus === 'mismatch') {
            textStates[l] = 'mismatched';
            textStates[r] = 'mismatched';
          }
        }

        // Highlight current best palindrome in highlight state
        if (maxLen > 0) {
          for (let idx = start; idx < start + maxLen; idx++) {
            if (textStates[idx] === 'neutral') {
              textStates[idx] = 'highlight';
            }
          }
        }

        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: s,
          pattern: '',
          textPointer: i,
          patternPointer: maxLen,
          twoPointers: { left: l, right: r },
          textStates,
          patternStates: {},
          vars: { i, start, maxLen, currentBest: `"${s.substr(start, maxLen)}"` }
        });
      };

      pushLpsStep(1, `Initializing Longest Palindromic Substring for: "${s}"`, 0, -1, -1, false, 'checking');
      if (n < 1) {
        steps.push({
          stepIndex: steps.length,
          line: 2,
          description: 'String is empty, returning empty string.',
          text: s,
          pattern: '',
          textPointer: 0,
          patternPointer: 0,
          textStates: {},
          patternStates: {},
          vars: { maxLen: 0, start: 0 }
        });
        break;
      }

      // Helper for expansions simulation
      const expand = (center: number, lStart: number, rStart: number, isEven: boolean) => {
        let left = lStart;
        let right = rStart;
        let localLen = 0;
        
        pushLpsStep(4, `Expanding palindrome ${isEven ? 'even' : 'odd'}-centered around indices [${left} ... ${right}].`, center, left, right, true, 'checking');
        
        while (left >= 0 && right < n && compareChars(s[left], s[right])) {
          pushLpsStep(5, `Character match found: S[${left}] ('${s[left]}') == S[${right}] ('${s[right]}'). Expanding outward.`, center, left, right, true, 'matched');
          left--;
          right++;
        }

        if (left < 0 || right >= n || !compareChars(s[left], s[right])) {
          pushLpsStep(5, `Expansion stopped. Boundary hit or mismatch: S[${Math.max(0, left)}] and S[${Math.min(n-1, right)}].`, center, left, right, true, 'mismatch');
        }

        localLen = right - left - 1;
        return localLen;
      };

      for (let i = 0; i < n; i++) {
        pushLpsStep(10, `Processing center index i = ${i}.`, i, -1, -1, false, 'checking');

        // Odd center
        const len1 = expand(i, i, i, false);
        
        // Even center
        const len2 = expand(i, i, i + 1, true);

        const len = Math.max(len1, len2);
        pushLpsStep(13, `Max expansion length centered at index ${i} is ${len} (Odd: ${len1}, Even: ${len2}).`, i, -1, -1, false, 'checking');

        if (len > maxLen) {
          maxLen = len;
          start = i - Math.floor((len - 1) / 2);
          pushLpsStep(14, `New longest palindrome found! Centered at ${i}, length = ${maxLen}, substring = "${s.substr(start, maxLen)}".`, i, -1, -1, false, 'checking');
        }
      }

      const endStates = makeNeutralStates(s.length);
      for (let idx = start; idx < start + maxLen; idx++) {
        endStates[idx] = 'matched';
      }

      steps.push({
        stepIndex: steps.length,
        line: 19,
        description: `Algorithm finished. Longest palindromic substring is "${s.substr(start, maxLen)}" (length ${maxLen}).`,
        text: s,
        pattern: '',
        textPointer: start,
        patternPointer: maxLen,
        textStates: endStates,
        patternStates: {},
        vars: { start, maxLen, result: `"${s.substr(start, maxLen)}"` }
      });
      break;
    }

    case 'palindromic_substrings_count': {
      const s = text;
      const n = s.length;
      let count = 0;

      const pushCountStep = (line: number, desc: string, i: number, l: number, r: number, matchStatus: 'checking' | 'matched' | 'mismatch') => {
        const textStates = makeNeutralStates(s.length);
        textStates[i] = 'active'; // Center point
        if (l >= 0 && r < n) {
          textStates[l] = matchStatus === 'checking' ? 'scanning' : (matchStatus === 'matched' ? 'matched' : 'mismatched');
          textStates[r] = matchStatus === 'checking' ? 'scanning' : (matchStatus === 'matched' ? 'matched' : 'mismatched');
        }

        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: s,
          pattern: '',
          textPointer: i,
          patternPointer: count,
          twoPointers: { left: l, right: r },
          textStates,
          patternStates: {},
          vars: { i, count, currentExpansion: l >= 0 && r < n ? `"${s.substring(l, r + 1)}"` : 'none' }
        });
      };

      pushCountStep(1, `Initializing Palindromic Substrings counter for: "${s}"`, 0, -1, -1, 'checking');
      pushCountStep(2, 'Setting count = 0.', 0, -1, -1, 'checking');

      const expandCount = (center: number, lStart: number, rStart: number, isEven: boolean) => {
        let left = lStart;
        let right = rStart;
        let localCount = 0;

        pushCountStep(4, `Beginning outward expansion ${isEven ? 'even' : 'odd'}-centered at [${left} ... ${right}].`, center, left, right, 'checking');

        while (left >= 0 && right < n && compareChars(s[left], s[right])) {
          localCount++;
          count++;
          pushCountStep(5, `Match! S[${left}] ('${s[left]}') == S[${right}] ('${s[right]}'). Total palindromes count increments to ${count}.`, center, left, right, 'matched');
          left--;
          right++;
        }

        if (left < 0 || right >= n || !compareChars(s[left], s[right])) {
          pushCountStep(5, `Boundary or mismatch at index [${Math.max(0, left)}, ${Math.min(n-1, right)}]. expansion stopped.`, center, left, right, 'mismatch');
        }
        return localCount;
      };

      for (let i = 0; i < n; i++) {
        pushCountStep(11, `Moving center pivot to i = ${i}.`, i, -1, -1, 'checking');
        
        // Odd
        expandCount(i, i, i, false);
        // Even
        expandCount(i, i, i + 1, true);
      }

      steps.push({
        stepIndex: steps.length,
        line: 15,
        description: `Algorithm complete. Total palindromic substrings counted: ${count}.`,
        text: s,
        pattern: '',
        textPointer: n,
        patternPointer: count,
        textStates: {},
        patternStates: {},
        vars: { count, sLength: n }
      });
      break;
    }

    case 'strstr_naive': {
      const n = text.length;
      const m = pattern.length;

      const pushNaiveStep = (line: number, desc: string, i: number, j: number, currentTextStates: Record<number, CellState>, currentPatternStates: Record<number, CellState>) => {
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text,
          pattern,
          textPointer: i + j,
          patternPointer: j,
          slidingOffset: i,
          textStates: currentTextStates,
          patternStates: currentPatternStates,
          vars: { i, j, n, m, textCompare: text[i+j] ? `'${text[i+j]}'` : 'EOF', patCompare: pattern[j] ? `'${pattern[j]}'` : 'EOF' }
        });
      };

      pushNaiveStep(1, `Initializing Naive sliding pattern search. Text length = ${n}, Pattern length = ${m}.`, 0, 0, {}, {});

      if (m === 0) {
        pushNaiveStep(1, 'Empty pattern. Found immediate match at index 0.', 0, 0, {}, {});
        break;
      }

      let foundIndex = -1;
      for (let i = 0; i <= n - m; i++) {
        pushNaiveStep(3, `Outer Loop: Aligning Pattern window at Text start index i = ${i}.`, i, 0, {}, {});

        let j = 0;
        let matched = true;

        while (j < m) {
          const tStates = makeNeutralStates(n);
          const pStates = makeNeutralStates(m);
          
          // Mark previous matches within current sliding window
          for (let k = 0; k < j; k++) {
            tStates[i + k] = 'matched';
            pStates[k] = 'matched';
          }
          tStates[i + j] = 'scanning';
          pStates[j] = 'scanning';

          pushNaiveStep(5, `Comparing Text S[i+j] ('${text[i+j]}') vs Pattern P[j] ('${pattern[j]}') at window offset ${j}.`, i, j, tStates, pStates);

          if (!compareChars(text[i + j], pattern[j])) {
            const errT = makeNeutralStates(n);
            const errP = makeNeutralStates(m);
            for (let k = 0; k < j; k++) {
              errT[i + k] = 'matched';
              errP[k] = 'matched';
            }
            errT[i + j] = 'mismatched';
            errP[j] = 'mismatched';
            
            pushNaiveStep(5, `Mismatch! S[${i+j}] ('${text[i+j]}') != P[${j}] ('${pattern[j]}'). Aborting window search.`, i, j, errT, errP);
            matched = false;
            break;
          }

          j++;
          const matchT = makeNeutralStates(n);
          const matchP = makeNeutralStates(m);
          for (let k = 0; k < j; k++) {
            matchT[i + k] = 'matched';
            matchP[k] = 'matched';
          }
          pushNaiveStep(6, `Characters match! Incrementing inner pattern pointer j to ${j}.`, i, j, matchT, matchP);
        }

        if (matched && j === m) {
          foundIndex = i;
          const matchT = makeNeutralStates(n);
          const matchP = makeNeutralStates(m);
          for (let k = 0; k < m; k++) {
            matchT[i + k] = 'matched';
            matchP[k] = 'matched';
          }
          pushNaiveStep(8, `Pattern matched completely! Occurrences start index found at i = ${i}.`, i, j, matchT, matchP);
          break;
        }
      }

      if (foundIndex === -1) {
        pushNaiveStep(10, 'Search exhausted. Pattern not found in Text. Returning -1.', n - m, 0, {}, {});
      }
      break;
    }

    case 'kmp_lps': {
      // Build LPS array for pattern
      const p = text; // User places pattern in primary Text field for LPS precomputation
      const m = p.length;
      const lpsArray = Array(m).fill(0);
      let len = 0;
      let i = 1;

      const pushLpsStep = (line: number, desc: string, currI: number, currLen: number, matchStatus: 'checking' | 'matched' | 'mismatch' | 'jump' | 'none') => {
        const textStates = makeNeutralStates(m);
        // prefix highlighted in amber
        // suffix highlighted in indigo
        if (matchStatus === 'checking') {
          textStates[currLen] = 'active'; // prefix char to compare
          textStates[currI] = 'scanning'; // suffix char to compare
        } else if (matchStatus === 'matched') {
          textStates[currLen] = 'matched';
          textStates[currI] = 'matched';
        } else if (matchStatus === 'mismatch' || matchStatus === 'jump') {
          textStates[currLen] = 'mismatched';
          textStates[currI] = 'mismatched';
        }

        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: p,
          pattern: '',
          textPointer: currI,
          patternPointer: currLen,
          textStates,
          patternStates: {},
          lps: [...lpsArray],
          vars: { i: currI, len: currLen, 'P[i]': p[currI], 'P[len]': p[currLen] }
        });
      };

      pushLpsStep(1, `Initializing KMP LPS Precomputation for Pattern P: "${p}"`, 0, 0, 'none');
      pushLpsStep(2, `Allocating LPS table of size ${m} initialized to zeros.`, 0, 0, 'none');
      pushLpsStep(4, `Pointers: len = 0 (tracking matching prefix), i = 1 (scanning suffix pointer).`, 1, 0, 'none');

      while (i < m) {
        pushLpsStep(5, `Comparing P[i] ('${p[i]}') and P[len] ('${p[len]}') to check suffix/prefix equality.`, i, len, 'checking');

        if (compareChars(p[i], p[len])) {
          len++;
          lpsArray[i] = len;
          pushLpsStep(6, `Equality match! Incremented prefix length len = ${len}.`, i, len, 'matched');
          i++;
          pushLpsStep(8, `Assigned lps[${i-1}] = ${len}. Advanced index i to ${i}.`, i, len, 'none');
        } else {
          pushLpsStep(9, `Mismatch between P[i] ('${p[i]}') and P[len] ('${p[len]}').`, i, len, 'mismatch');
          if (len !== 0) {
            const oldLen = len;
            len = lpsArray[len - 1];
            
            // Draw a jump arc description
            steps.push({
              stepIndex: steps.length,
              line: 11,
              description: `Falling back prefix index len: jumping from ${oldLen} to lps[${oldLen-1}] = ${len} without incrementing i.`,
              text: p,
              pattern: '',
              textPointer: i,
              patternPointer: len,
              textStates: { [oldLen - 1]: 'active', [i]: 'scanning' },
              patternStates: {},
              lps: [...lpsArray],
              skipArc: { from: oldLen, to: len },
              vars: { i, len, oldLen }
            });
          } else {
            lpsArray[i] = 0;
            pushLpsStep(13, `Since len is already 0, cannot fall back. Assigned lps[${i}] = 0.`, i, len, 'none');
            i++;
            pushLpsStep(14, `Advanced index i to ${i}.`, i, len, 'none');
          }
        }
      }

      steps.push({
        stepIndex: steps.length,
        line: 18,
        description: `LPS Table construction complete! LPS array values: [${lpsArray.join(', ')}]`,
        text: p,
        pattern: '',
        textPointer: m,
        patternPointer: len,
        textStates: {},
        patternStates: {},
        lps: [...lpsArray],
        vars: { finalizedLPS: `[${lpsArray.join(', ')}]` }
      });
      break;
    }

    case 'kmp_search': {
      const t = text;
      const p = pattern;
      const n = t.length;
      const m = p.length;

      // 1. Precompute LPS
      const lpsArray = Array(m).fill(0);
      let preLen = 0;
      let preI = 1;
      while (preI < m) {
        if (compareChars(p[preI], p[preLen])) {
          preLen++;
          lpsArray[preI] = preLen;
          preI++;
        } else {
          if (preLen !== 0) {
            preLen = lpsArray[preLen - 1];
          } else {
            lpsArray[preI] = 0;
            preI++;
          }
        }
      }

      const matchesList: number[] = [];
      let i = 0;
      let j = 0;

      const pushKmpSearchStep = (line: number, desc: string, currI: number, currJ: number, matchStatus: 'checking' | 'matched' | 'mismatch', arc?: { from: number, to: number } | null) => {
        const textStates = makeNeutralStates(n);
        const patternStates = makeNeutralStates(m);
        
        // Highlight active comparisons
        if (currI < n && currJ < m) {
          textStates[currI] = matchStatus === 'checking' ? 'scanning' : (matchStatus === 'matched' ? 'matched' : 'mismatched');
          patternStates[currJ] = matchStatus === 'checking' ? 'scanning' : (matchStatus === 'matched' ? 'matched' : 'mismatched');
        }

        // Highlight historical match segments
        matchesList.forEach(mIdx => {
          for (let k = 0; k < m; k++) {
            if (mIdx + k < n) {
              textStates[mIdx + k] = 'matched';
            }
          }
        });

        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: t,
          pattern: p,
          textPointer: currI,
          patternPointer: currJ,
          slidingOffset: currI - currJ,
          textStates,
          patternStates,
          lps: lpsArray,
          matchedIndices: [...matchesList],
          skipArc: arc,
          vars: { i: currI, j: currJ, n, m, textChar: t[currI] ? `'${t[currI]}'` : 'EOF', patChar: p[currJ] ? `'${p[currJ]}'` : 'EOF' }
        });
      };

      steps.push({
        stepIndex: steps.length,
        line: 1,
        description: `Initializing KMP Search. Precomputed LPS Table for Pattern is [${lpsArray.join(', ')}].`,
        text: t,
        pattern: p,
        textPointer: 0,
        patternPointer: 0,
        lps: lpsArray,
        textStates: {},
        patternStates: {},
        vars: { i, j, n, m }
      });

      while (i < n) {
        pushKmpSearchStep(7, `Comparing Text character T[i] ('${t[i]}') vs Pattern P[j] ('${p[j]}') at alignment offset i-j = ${i-j}.`, i, j, 'checking');

        if (compareChars(t[i], p[j])) {
          i++;
          j++;
          pushKmpSearchStep(8, `Characters match! Advanced text pointer i to ${i} and pattern pointer j to ${j}.`, i, j, 'matched');
        }

        if (j === m) {
          const matchIdx = i - j;
          matchesList.push(matchIdx);
          const oldJ = j;
          j = lpsArray[j - 1];
          
          pushKmpSearchStep(11, `Occurrences found! Pattern matched completely starting at index ${matchIdx}. Shifting pattern using fallback j = lps[j-1] = ${j}.`, i, j, 'matched', { from: oldJ, to: j });
        } else if (i < n && !compareChars(t[i], p[j])) {
          pushKmpSearchStep(13, `Mismatch! T[i] ('${t[i]}') != P[j] ('${p[j]}'). Evaluating KMP slide jump.`, i, j, 'mismatch');
          if (j !== 0) {
            const oldJ = j;
            j = lpsArray[j - 1];
            pushKmpSearchStep(14, `Pattern index j > 0. Retaining text pointer i = ${i}, shifting pattern pointer j to lps[j-1] = ${j} to save scanning operations.`, i, j, 'mismatch', { from: oldJ, to: j });
          } else {
            i++;
            pushKmpSearchStep(15, `Pattern index j is 0. Backtrack exhausted. Advancing text pointer i to ${i}.`, i, j, 'none' as any);
          }
        }
      }

      // Final step
      const finalTStates = makeNeutralStates(n);
      matchesList.forEach(mIdx => {
        for (let k = 0; k < m; k++) {
          finalTStates[mIdx + k] = 'matched';
        }
      });

      steps.push({
        stepIndex: steps.length,
        line: 18,
        description: `KMP Text Search finished. Matches list: [${matchesList.join(', ')}]`,
        text: t,
        pattern: p,
        textPointer: i,
        patternPointer: j,
        textStates: finalTStates,
        patternStates: {},
        lps: lpsArray,
        matchedIndices: [...matchesList],
        vars: { matchesFound: matchesList.length, totalIterations: i }
      });
      break;
    }

    case 'repeated_substring': {
      const s = text;
      const n = s.length;

      // 1. Build LPS
      const lpsArray = Array(n).fill(0);
      let len = 0;
      let i = 1;
      while (i < n) {
        if (compareChars(s[i], s[len])) {
          len++;
          lpsArray[i] = len;
          i++;
        } else {
          if (len !== 0) {
            len = lpsArray[len - 1];
          } else {
            lpsArray[i] = 0;
            i++;
          }
        }
      }

      const lpsVal = lpsArray[n - 1];
      const repeatLen = n - lpsVal;
      const isRepeated = lpsVal > 0 && n % repeatLen === 0;

      const textStates = makeNeutralStates(n);
      if (isRepeated) {
        // Highlight prefix block and matching periodic blocks
        for (let idx = 0; idx < lpsVal; idx++) {
          textStates[idx] = 'matched';
        }
        for (let idx = repeatLen; idx < n; idx++) {
          textStates[idx] = 'highlight';
        }
      } else {
        textStates[n-1] = 'mismatched';
      }

      steps.push({
        stepIndex: 0,
        line: 1,
        description: `Initializing Repeated Substring Pattern verification for string S: "${s}" (length ${n}).`,
        text: s,
        pattern: '',
        textPointer: n,
        patternPointer: 0,
        lps: lpsArray,
        textStates: {},
        patternStates: {},
        vars: { n }
      });

      steps.push({
        stepIndex: 1,
        line: 3,
        description: `Constructed LPS Table for S: [${lpsArray.join(', ')}].`,
        text: s,
        pattern: '',
        textPointer: n,
        patternPointer: 0,
        lps: lpsArray,
        textStates: {},
        patternStates: {},
        vars: { lps: `[${lpsArray.join(', ')}]` }
      });

      steps.push({
        stepIndex: 2,
        line: 4,
        description: `Retrieving longest proper prefix length which is also suffix: lps[N-1] = ${lpsVal}.`,
        text: s,
        pattern: '',
        textPointer: n - 1,
        patternPointer: lpsVal,
        lps: lpsArray,
        textStates: { [n - 1]: 'active' },
        patternStates: {},
        vars: { len: lpsVal, k: lpsVal }
      });

      const formulaStr = `N % (N - len) -> ${n} % (${n} - ${lpsVal}) = ${n} % ${repeatLen} = ${n % repeatLen}`;
      if (isRepeated) {
        steps.push({
          stepIndex: 3,
          line: 5,
          description: `Verification check: length is divisible by repeat block: ${formulaStr} == 0! String S is periodic. Repeating substring is "${s.substr(0, repeatLen)}". Returning true.`,
          text: s,
          pattern: '',
          textPointer: n,
          patternPointer: lpsVal,
          lps: lpsArray,
          textStates,
          patternStates: {},
          vars: { len: lpsVal, repeatBlockLength: repeatLen, isRepeated: true }
        });
      } else {
        steps.push({
          stepIndex: 3,
          line: 5,
          description: `Verification check: ${lpsVal === 0 ? 'No proper prefix suffix exists.' : `Length is not divisible by repeat block: ${formulaStr} != 0.`} String is not periodic. Returning false.`,
          text: s,
          pattern: '',
          textPointer: n,
          patternPointer: lpsVal,
          lps: lpsArray,
          textStates,
          patternStates: {},
          vars: { len: lpsVal, repeatBlockLength: repeatLen, isRepeated: false }
        });
      }
      break;
    }

    case 'rabin_karp': {
      const t = text;
      const p = pattern;
      const n = t.length;
      const m = p.length;

      const B = 256;
      const M = 101; // modulo arithmetic Prime

      let h_pat = 0;
      let h_txt = 0;
      let h_pow = 1;

      // 1. Precompute B^(m-1) % M
      for (let idx = 0; idx < m - 1; idx++) {
        h_pow = (h_pow * B) % M;
      }

      // Compute initial hashes
      for (let idx = 0; idx < m; idx++) {
        h_pat = (B * h_pat + p.charCodeAt(idx)) % M;
        h_txt = (B * h_txt + t.charCodeAt(idx)) % M;
      }

      const pushRkStep = (line: number, desc: string, currI: number, currJ: number, tStates: Record<number, CellState>, pStates: Record<number, CellState>, spur: boolean = false) => {
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: t,
          pattern: p,
          textPointer: currI + currJ,
          patternPointer: currJ,
          slidingOffset: currI,
          textStates: tStates,
          patternStates: pStates,
          hashTarget: h_pat,
          hashCurrent: h_txt,
          hashWindowStart: currI,
          spuriousHit: spur,
          hashBase: B,
          hashMod: M,
          hashPower: h_pow,
          vars: { i: currI, j: currJ, n, m, textHash: h_txt, patHash: h_pat }
        });
      };

      steps.push({
        stepIndex: steps.length,
        line: 1,
        description: `Initializing Rabin-Karp polynomial rolling hash search with Base B = ${B}, Mod M = ${M}.`,
        text: t,
        pattern: p,
        textPointer: 0,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        hashTarget: 0,
        hashCurrent: 0,
        vars: { B, M }
      });

      steps.push({
        stepIndex: steps.length,
        line: 5,
        description: `Precomputed window scale factor base^(m-1) % mod = ${B}^(${m}-1) % ${M} = ${h_pow}.`,
        text: t,
        pattern: p,
        textPointer: 0,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        hashTarget: h_pat,
        hashCurrent: h_txt,
        vars: { h_pow }
      });

      steps.push({
        stepIndex: steps.length,
        line: 6,
        description: `Calculated target Pattern Hash H(P) = ${h_pat}, and first Text Window Hash H(T[0...${m-1}]) = ${h_txt}.`,
        text: t,
        pattern: p,
        textPointer: 0,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        hashTarget: h_pat,
        hashCurrent: h_txt,
        vars: { h_pat, h_txt }
      });

      let matchIndex = -1;
      for (let i = 0; i <= n - m; i++) {
        const textStates = makeNeutralStates(n);
        const patternStates = makeNeutralStates(m);
        for (let k = 0; k < m; k++) {
          textStates[i + k] = 'scanning';
          patternStates[k] = 'scanning';
        }

        pushRkStep(10, `Aligned Window starting at index ${i}. Comparing Current Window Hash (${h_txt}) vs Target Hash (${h_pat}).`, i, 0, textStates, patternStates);

        if (h_pat === h_txt) {
          pushRkStep(11, `Hash match collision detected at index ${i}! Spurious hit? Executing strict character verification.`, i, 0, textStates, patternStates, true);
          
          let j = 0;
          let realMatch = true;
          while (j < m) {
            const verifT = makeNeutralStates(n);
            const verifP = makeNeutralStates(m);
            for (let k = 0; k < m; k++) {
              verifT[i + k] = 'scanning';
              verifP[k] = 'scanning';
            }
            // Mark verified characters
            for (let k = 0; k < j; k++) {
              verifT[i + k] = 'matched';
              verifP[k] = 'matched';
            }
            verifT[i + j] = 'active';
            verifP[j] = 'active';

            pushRkStep(13, `Verifying character alignment index ${j}: T[${i + j}] ('${t[i + j]}') vs P[${j}] ('${p[j]}').`, i, j, verifT, verifP, true);

            if (!compareChars(t[i + j], p[j])) {
              const errT = makeNeutralStates(n);
              const errP = makeNeutralStates(m);
              errT[i + j] = 'mismatched';
              errP[j] = 'mismatched';
              pushRkStep(13, `Mismatch found! Spurious collision confirmed. Continuing rolling window search.`, i, j, errT, errP, true);
              realMatch = false;
              break;
            }
            j++;
          }

          if (realMatch && j === m) {
            matchIndex = i;
            const matchT = makeNeutralStates(n);
            const matchP = makeNeutralStates(m);
            for (let k = 0; k < m; k++) {
              matchT[i + k] = 'matched';
              matchP[k] = 'matched';
            }
            pushRkStep(14, `Hash match was genuine! Complete matching occurrence found starting at index ${i}.`, i, j, matchT, matchP, false);
            break;
          }
        }

        if (i < n - m) {
          const oldHash = h_txt;
          const removedChar = t.charCodeAt(i);
          const addedChar = t.charCodeAt(i + m);
          
          // Roll hash step
          h_txt = (B * (h_txt - removedChar * h_pow) + addedChar) % M;
          if (h_txt < 0) h_txt += M;

          const rollStates = makeNeutralStates(n);
          rollStates[i] = 'mismatched'; // removed head
          rollStates[i + m] = 'active'; // added tail
          for (let k = 1; k < m; k++) {
            rollStates[i + k] = 'matched'; // sliding body
          }

          steps.push({
            stepIndex: steps.length,
            line: 17,
            description: `Rolling Hash forward: Removing '${t[i]}' (val ${removedChar}) and Adding '${t[i+m]}' (val ${addedChar}). Hash updates ${oldHash} -> ${h_txt}.`,
            text: t,
            pattern: p,
            textPointer: i + m,
            patternPointer: 0,
            slidingOffset: i + 1,
            textStates: rollStates,
            patternStates: {},
            hashTarget: h_pat,
            hashCurrent: h_txt,
            hashWindowStart: i + 1,
            hashBase: B,
            hashMod: M,
            hashPower: h_pow,
            vars: { i, newHash: h_txt, oldHash, removedChar: t[i], addedChar: t[i+m] }
          });
        }
      }

      if (matchIndex === -1) {
        steps.push({
          stepIndex: steps.length,
          line: 21,
          description: 'Search completed. Pattern was not found in Text. Returning -1.',
          text: t,
          pattern: p,
          textPointer: n,
          patternPointer: 0,
          textStates: {},
          patternStates: {},
          hashTarget: h_pat,
          hashCurrent: h_txt,
          vars: { matchIndex: -1 }
        });
      }
      break;
    }

    case 'z_algorithm': {
      // Z Algorithm visualizer
      // Typically runs on S = Pattern + "$" + Text. Let's build exactly that!
      const separator = '$';
      const S = pattern + separator + text;
      const zArray = Array(S.length).fill(0);
      const n = S.length;
      let L = 0, R = 0;

      const pushZStep = (line: number, desc: string, i: number, currL: number, currR: number, customStates: Record<number, CellState>) => {
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: S,
          pattern: '',
          textPointer: i,
          patternPointer: zArray[i],
          textStates: customStates,
          patternStates: {},
          zArray: [...zArray],
          zBoxL: currL,
          zBoxR: currR,
          vars: { i, L: currL, R: currR, 'S[i]': S[i], zVal: zArray[i] }
        });
      };

      steps.push({
        stepIndex: steps.length,
        line: 1,
        description: `Concatenated search string S = Pattern + "$" + Text: "${S}" (total length ${n}).`,
        text: S,
        pattern: '',
        textPointer: 0,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        zArray: [...zArray],
        vars: { S, n }
      });

      steps.push({
        stepIndex: steps.length,
        line: 3,
        description: 'Allocated Z-array initialized to all zeros. Set active Z-box range variables: L = 0, R = 0.',
        text: S,
        pattern: '',
        textPointer: 0,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        zArray: [...zArray],
        zBoxL: 0,
        zBoxR: 0,
        vars: { L: 0, R: 0 }
      });

      for (let i = 1; i < n; i++) {
        const preState = makeNeutralStates(n);
        // Highlight active Z-box
        if (L <= R && R > 0) {
          for (let k = L; k <= R; k++) preState[k] = 'highlight';
        }
        preState[i] = 'scanning';

        pushZStep(5, `Loop iteration i = ${i}. Checking if index falls within current Z-box [L=${L}, R=${R}].`, i, L, R, preState);

        if (i <= R) {
          const mirrorIdx = i - L;
          const limit = R - i + 1;
          const preVal = zArray[i];
          zArray[i] = Math.min(limit, zArray[mirrorIdx]);
          
          const copyState = makeNeutralStates(n);
          if (L <= R) {
            for (let k = L; k <= R; k++) copyState[k] = 'highlight';
          }
          copyState[mirrorIdx] = 'active'; // mirror origin source
          copyState[i] = 'scanning'; // copy target
          
          pushZStep(6, `Index i (${i}) <= R (${R}). Reusing previous Z-value inside Z-box: copying z[i-L] = z[${mirrorIdx}] (${zArray[mirrorIdx]}) capped at boundary remaining length (${limit}). Initialized z[${i}] = ${zArray[i]}.`, i, L, R, copyState);
        }

        // Expand symmetrically
        let prevZ = zArray[i];
        while (i + zArray[i] < n && compareChars(S[zArray[i]], S[i + zArray[i]])) {
          zArray[i]++;
          const expState = makeNeutralStates(n);
          // Highlight previous Z-box
          if (L <= R && R > 0) {
            for (let k = L; k <= R; k++) expState[k] = 'highlight';
          }
          // Highlight active matching pointers
          expState[zArray[i]-1] = 'matched';
          expState[i + zArray[i]-1] = 'matched';

          pushZStep(8, `Character match! S[${zArray[i]-1}] == S[${i + zArray[i]-1}]. Incremented Z[${i}] value to ${zArray[i]}.`, i, L, R, expState);
        }

        if (i + zArray[i] < n) {
          const mismatchState = makeNeutralStates(n);
          if (L <= R && R > 0) {
            for (let k = L; k <= R; k++) mismatchState[k] = 'highlight';
          }
          mismatchState[zArray[i]] = 'mismatched';
          mismatchState[i + zArray[i]] = 'mismatched';
          pushZStep(8, `Mismatch at index S[${zArray[i]}] and S[${i + zArray[i]}]. Expansion stopped.`, i, L, R, mismatchState);
        }

        // Update Z-box
        if (i + zArray[i] - 1 > R) {
          L = i;
          R = i + zArray[i] - 1;
          const boxState = makeNeutralStates(n);
          for (let k = L; k <= R; k++) boxState[k] = 'matched';
          pushZStep(11, `Index boundary exceeded right wall R! Re-centering Z-box window to: [L=${L}, R=${R}] based on matching sequence.`, i, L, R, boxState);
        }
      }

      steps.push({
        stepIndex: steps.length,
        line: 16,
        description: `Z-Algorithm complete. Synthesized Z-Array is: [${zArray.join(', ')}]`,
        text: S,
        pattern: '',
        textPointer: n,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        zArray: [...zArray],
        vars: { zArray: `[${zArray.join(', ')}]` }
      });
      break;
    }

    case 'manacher': {
      const s = text;
      // Transform string to include separators
      let T = '^';
      for (let idx = 0; idx < s.length; idx++) {
        T += '#' + s[idx];
      }
      T += '#$';
      const n = T.length;
      const P = Array(n).fill(0);
      let C = 0, R = 0;

      const pushManStep = (line: number, desc: string, currI: number, currC: number, currR: number, customStates: Record<number, CellState>) => {
        steps.push({
          stepIndex: steps.length,
          line,
          description: desc,
          text: T,
          pattern: '',
          textPointer: currI,
          patternPointer: P[currI],
          textStates: customStates,
          patternStates: {},
          manacherP: [...P],
          manacherString: T,
          manacherCenter: currC,
          manacherRight: currR,
          manacherMirror: 2 * currC - currI,
          manacherCurrentRadius: P[currI],
          vars: { i: currI, C: currC, R: currR, i_mirror: 2 * currC - currI, pRadius: P[currI] }
        });
      };

      steps.push({
        stepIndex: steps.length,
        line: 1,
        description: `Initializing Manacher's Algorithm. Transformed String T to handle odd/even centers: "${T}".`,
        text: T,
        pattern: '',
        textPointer: 0,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        manacherP: [...P],
        manacherString: T,
        vars: { s, T }
      });

      steps.push({
        stepIndex: steps.length,
        line: 6,
        description: 'Allocated Radius table P of size N initialized to all zeros. Pointers: center C = 0, right wall R = 0.',
        text: T,
        pattern: '',
        textPointer: 0,
        patternPointer: 0,
        textStates: {},
        patternStates: {},
        manacherP: [...P],
        manacherString: T,
        manacherCenter: 0,
        manacherRight: 0,
        vars: { C: 0, R: 0 }
      });

      for (let i = 1; i < n - 1; i++) {
        const mirrorIdx = 2 * C - i;
        const preStates = makeNeutralStates(n);
        preStates[C] = 'active'; // Center
        preStates[i] = 'scanning'; // Current pointer

        pushManStep(8, `Loop iteration i = ${i}. Computing mirror index i' across center C: i' = 2*C - i = 2*${C} - ${i} = ${mirrorIdx}.`, i, C, R, preStates);

        if (R > i) {
          const rem = R - i;
          P[i] = Math.min(rem, P[mirrorIdx]);
          const mirrorStates = makeNeutralStates(n);
          mirrorStates[C] = 'active';
          mirrorStates[mirrorIdx] = 'matched'; // copy source
          mirrorStates[i] = 'scanning'; // copy target
          
          pushManStep(9, `Current index i (${i}) < right wall R (${R}). Copying mirrored radius: P[i] = min(R - i (${rem}), P[i_mirror] (${P[mirrorIdx]})) = ${P[i]}.`, i, C, R, mirrorStates);
        }

        // Expand symmetrically
        pushManStep(11, `Symmetric outward expansion attempt centered at i = ${i} (current radius radius = ${P[i]}).`, i, C, R, preStates);

        while (i + 1 + P[i] < n && i - 1 - P[i] >= 0 && compareChars(T[i + 1 + P[i]], T[i - 1 - P[i]])) {
          P[i]++;
          const expStates = makeNeutralStates(n);
          expStates[i] = 'active';
          expStates[i + P[i]] = 'matched';
          expStates[i - P[i]] = 'matched';
          pushManStep(11, `Character match: T[${i + P[i]}] ('${T[i + P[i]]}') == T[${i - P[i]}] ('${T[i - P[i]]}'). Incremented radius P[${i}] to ${P[i]}.`, i, C, R, expStates);
        }

        if (i + 1 + P[i] < n && i - 1 - P[i] >= 0) {
          const mismatchStates = makeNeutralStates(n);
          mismatchStates[i] = 'active';
          mismatchStates[i + 1 + P[i]] = 'mismatched';
          mismatchStates[i - 1 - P[i]] = 'mismatched';
          pushManStep(11, `Mismatch or boundary hit at T[${i + 1 + P[i]}] and T[${i - 1 - P[i]}]. Expansion halted.`, i, C, R, mismatchStates);
        }

        // Update center
        if (i + P[i] > R) {
          C = i;
          R = i + P[i];
          const newCenterStates = makeNeutralStates(n);
          for (let k = C - P[i]; k <= C + P[i]; k++) {
            if (k >= 0 && k < n) newCenterStates[k] = 'matched';
          }
          newCenterStates[C] = 'active';
          pushManStep(12, `Expanded boundaries exceed previous right wall R! Re-centering Manacher center to C = ${C}, Right boundary wall R = ${R}.`, i, C, R, newCenterStates);
        }
      }

      // Find max length
      let maxLen = 0;
      let centerIndex = 0;
      for (let i = 1; i < n - 1; i++) {
        if (P[i] > maxLen) {
          maxLen = P[i];
          centerIndex = i;
        }
      }

      const start = Math.floor((centerIndex - 1 - maxLen) / 2);
      const resultStr = s.substr(start, maxLen);

      const finalStates = makeNeutralStates(n);
      for (let k = centerIndex - maxLen; k <= centerIndex + maxLen; k++) {
        finalStates[k] = 'matched';
      }
      finalStates[centerIndex] = 'active';

      steps.push({
        stepIndex: steps.length,
        line: 19,
        description: `Manacher's search completed. Max radius is ${maxLen} at center ${centerIndex}. Substring retrieved: "${resultStr}".`,
        text: T,
        pattern: '',
        textPointer: centerIndex,
        patternPointer: maxLen,
        textStates: finalStates,
        patternStates: {},
        manacherP: [...P],
        manacherString: T,
        manacherCenter: C,
        manacherRight: R,
        vars: { maxLen, centerIndex, start, resultStr }
      });
      break;
    }
  }

  return steps;
}
