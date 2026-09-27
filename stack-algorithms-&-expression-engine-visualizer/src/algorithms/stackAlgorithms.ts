import {
  ProblemId,
  SimulationStep,
  StackItem,
  TokenItem,
  PrecedenceComparison
} from '../types';

// Helper to generate UUIDs/unique keys for stack items
const makeId = () => Math.random().toString(36).substring(2, 9);

// Precedence calculator
function getPrecedence(op: string): number {
  if (op === '^') return 3;
  if (op === '*' || op === '/') return 2;
  if (op === '+' || op === '-') return 1;
  return -1;
}

// Token tokenizer for expressions
function tokenizeExpression(expr: string): TokenItem[] {
  const tokens: TokenItem[] = [];
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === ' ') continue;
    
    let type: TokenItem['type'] = 'unknown';
    if (/[a-zA-Z0-9]/.test(c)) {
      type = 'operand';
    } else if (['+', '-', '*', '/', '^'].includes(c)) {
      type = 'operator';
    } else if (c === '(' || c === ')') {
      type = 'parenthesis';
    }
    tokens.push({ value: c, type, isScanned: false, isActive: false });
  }
  return tokens;
}

// Parse input array (comma or space separated)
function parseInputArray(input: string): string[] {
  return input
    .split(/[,,|\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function generateSimulationSteps(problemId: ProblemId, input: string): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const logs: string[] = [];

  const addStep = (
    desc: string,
    line: number,
    stackState: StackItem[],
    cursor: number,
    tokens?: TokenItem[],
    variables: Record<string, any> = {},
    extra: Partial<SimulationStep> = {}
  ) => {
    logs.push(desc);
    
    // Create copies for immutability
    const snapshotStack = stackState.map(item => ({ ...item }));
    const snapshotTokens = tokens ? tokens.map((t, idx) => ({
      ...t,
      isScanned: idx < cursor,
      isActive: idx === cursor
    })) : undefined;

    steps.push({
      stepIndex: steps.length,
      description: desc,
      line,
      stack: snapshotStack,
      inputTokens: snapshotTokens,
      inputCursor: cursor,
      variables,
      logs: [...logs],
      ...extra
    });
  };

  switch (problemId) {
    case 'basic-stack': {
      const items = parseInputArray(input);
      const stack: StackItem[] = [];
      
      addStep('Initialize empty stack', 5, [], -1, undefined, { size: 0, isEmpty: true });
      
      // Simulate pushes
      for (let i = 0; i < items.length; i++) {
        const val = items[i];
        stack.push({ id: makeId(), value: val });
        addStep(
          `Push "${val}" onto stack`,
          9 + i,
          stack,
          i,
          undefined,
          { size: stack.length, isEmpty: false, top: val }
        );
      }

      if (stack.length > 0) {
        const topChar = stack[stack.length - 1].value;
        addStep(
          `Inspect Stack Top: "${topChar}"`,
          13,
          stack,
          -1,
          undefined,
          { size: stack.length, isEmpty: false, top: topChar }
        );
        addStep(
          `Inspect Stack Size: ${stack.length}`,
          14,
          stack,
          -1,
          undefined,
          { size: stack.length, isEmpty: false, top: topChar }
        );
        
        // Pop
        const popped = stack.pop();
        addStep(
          `Pop element from stack (removed "${popped?.value}")`,
          17,
          stack,
          -1,
          undefined,
          { size: stack.length, isEmpty: stack.length === 0, top: stack.length > 0 ? stack[stack.length - 1].value : 'None', popped: popped?.value }
        );
      }

      addStep(
        `Final check: stack is ${stack.length === 0 ? 'empty' : 'not empty'}`,
        19,
        stack,
        -1,
        undefined,
        { size: stack.length, isEmpty: stack.length === 0 }
      );
      break;
    }

    case 'valid-parentheses': {
      const tokens = tokenizeExpression(input);
      const stack: StackItem[] = [];
      
      addStep('Initialize empty stack to track matching brackets', 6, [], 0, tokens, { isValid: true });

      let valid = true;
      for (let i = 0; i < tokens.length; i++) {
        const char = tokens[i].value;
        addStep(`Scan bracket: "${char}"`, 7, stack, i, tokens, { isValid: valid });

        if (char === '(' || char === '{' || char === '[') {
          stack.push({ id: makeId(), value: char });
          addStep(`Push opening bracket "${char}" to stack`, 9, stack, i, tokens, { isValid: valid });
        } else {
          if (stack.length === 0) {
            valid = false;
            addStep(`Error: Found closing bracket "${char}" with an empty stack (Underflow)`, 11, stack, i, tokens, { isValid: false });
            break;
          }
          
          const top = stack[stack.length - 1].value;
          const isMatch = 
            (char === ')' && top === '(') ||
            (char === '}' && top === '{') ||
            (char === ']' && top === '[');

          if (isMatch) {
            stack.pop();
            addStep(`Matched: Popped "${top}" matching with "${char}"`, 16, stack, i, tokens, { isValid: true, popped: top });
          } else {
            valid = false;
            addStep(`Mismatch: Bracket "${char}" does not match the top element "${top}"`, 19, stack, i, tokens, { isValid: false });
            break;
          }
        }
      }

      if (valid) {
        const isEmpty = stack.length === 0;
        addStep(
          `Final evaluation: stack is ${isEmpty ? 'empty' : 'not empty'} -> returns ${isEmpty ? 'TRUE (Valid)' : 'FALSE (Invalid)'}`,
          23,
          stack,
          tokens.length,
          tokens,
          { isValid: isEmpty }
        );
      }
      break;
    }

    case 'min-stack': {
      const items = parseInputArray(input).map(Number);
      const valStack: StackItem[] = [];
      const minStack: StackItem[] = [];
      
      addStep('Initialize main stack and O(1) auxiliary Min Stack', 8, [], -1, undefined, { minVal: 'None' });

      for (let i = 0; i < items.length; i++) {
        const val = items[i];
        let currentMin = val;
        
        if (minStack.length > 0) {
          const prevMin = minStack[minStack.length - 1].value as number;
          currentMin = Math.min(val, prevMin);
        }

        valStack.push({ id: makeId(), value: val, subValue: currentMin });
        minStack.push({ id: makeId(), value: currentMin });

        addStep(
          `Push element: ${val}. Calculated min: min(${val}, ${minStack.length > 1 ? minStack[minStack.length - 2].value : 'None'}) = ${currentMin}`,
          13,
          valStack,
          i,
          undefined,
          { minVal: currentMin, top: val },
          { secondaryStack: minStack }
        );
      }

      // Show top and min retrieves
      if (valStack.length > 0) {
        addStep(
          `Call top(): returns top of value stack = ${valStack[valStack.length - 1].value}`,
          28,
          valStack,
          -1,
          undefined,
          { minVal: minStack[minStack.length - 1].value, top: valStack[valStack.length - 1].value },
          { secondaryStack: minStack }
        );

        addStep(
          `Call getMin(): returns top of Min Stack = ${minStack[minStack.length - 1].value}`,
          32,
          valStack,
          -1,
          undefined,
          { minVal: minStack[minStack.length - 1].value, top: valStack[valStack.length - 1].value },
          { secondaryStack: minStack }
        );

        // Pop
        const poppedVal = valStack.pop();
        const poppedMin = minStack.pop();
        addStep(
          `Call pop(): removes top from both stacks (${poppedVal?.value} popped)`,
          23,
          valStack,
          -1,
          undefined,
          { minVal: minStack.length > 0 ? minStack[minStack.length - 1].value : 'None', top: valStack.length > 0 ? valStack[valStack.length - 1].value : 'None' },
          { secondaryStack: minStack }
        );
      }
      break;
    }

    case 'queue-using-stacks': {
      const items = parseInputArray(input);
      const inStack: StackItem[] = [];
      const outStack: StackItem[] = [];

      addStep('Initialize dual stacks: inStack (push) and outStack (pop)', 6, [], -1, undefined, { activeAction: 'init' }, { secondaryStack: [] });

      // Push items to inStack
      for (let i = 0; i < items.length; i++) {
        const val = items[i];
        inStack.push({ id: makeId(), value: val });
        addStep(
          `Push element "${val}" to inStack`,
          25,
          inStack,
          i,
          undefined,
          { activeAction: `push(${val})` },
          { secondaryStack: outStack }
        );
      }

      // Perform pop operation step-by-step to show the reversal transfer
      addStep('Request pop() from Queue: outStack is empty, triggering reversal transfer', 29, inStack, -1, undefined, { activeAction: 'pop_start' }, { secondaryStack: outStack });

      // Transfer
      while (inStack.length > 0) {
        const popped = inStack.pop()!;
        addStep(
          `Transfer step: Pop "${popped.value}" from top of inStack`,
          13,
          inStack,
          -1,
          undefined,
          { activeAction: 'transfer_pop', popped: popped.value },
          { secondaryStack: outStack }
        );
        
        outStack.push({ id: makeId(), value: popped.value });
        addStep(
          `Transfer step: Push "${popped.value}" to outStack`,
          14,
          inStack,
          -1,
          undefined,
          { activeAction: 'transfer_push', pushed: popped.value },
          { secondaryStack: outStack }
        );
      }

      // Finally perform pop from outStack
      const finalPopped = outStack.pop()!;
      addStep(
        `Pop complete: Pop top of outStack ("${finalPopped.value}" is returned in FIFO order!)`,
        31,
        inStack,
        -1,
        undefined,
        { activeAction: 'pop_complete', returned: finalPopped.value },
        { secondaryStack: outStack }
      );
      break;
    }

    case 'infix-to-postfix': {
      const tokens = tokenizeExpression(input);
      const stack: StackItem[] = [];
      let output = '';

      addStep('Initialize Shunting-Yard operator stack and empty output buffer', 12, [], 0, tokens, { output });

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const val = token.value;

        if (token.type === 'operand') {
          output += val;
          addStep(`Operand "${val}": Append directly to Output`, 16, stack, i + 1, tokens, { output });
        } else if (val === '(') {
          stack.push({ id: makeId(), value: '(' });
          addStep(`Opening bracket "(": Push directly to operator stack`, 18, stack, i + 1, tokens, { output });
        } else if (val === ')') {
          addStep(`Closing bracket ")": Pop operator stack to output until matching "(" is found`, 20, stack, i + 1, tokens, { output });
          while (stack.length > 0 && stack[stack.length - 1].value !== '(') {
            const popped = stack.pop()!;
            output += popped.value;
            addStep(`Pop operator "${popped.value}" and append to output`, 21, stack, i + 1, tokens, { output });
          }
          if (stack.length > 0 && stack[stack.length - 1].value === '(') {
            stack.pop();
            addStep(`Match found: Pop and discard matching "("`, 24, stack, i + 1, tokens, { output });
          }
        } else if (token.type === 'operator') {
          const currentPrec = getPrecedence(val);
          
          while (stack.length > 0) {
            const topOp = stack[stack.length - 1].value as string;
            const topPrec = getPrecedence(topOp);
            
            const compResult = topPrec >= currentPrec;
            const reason = `Precedence comparison: top "${topOp}" (${topPrec}) >= incoming "${val}" (${currentPrec})`;

            const compare: PrecedenceComparison = {
              op1: val,
              op2: topOp,
              prec1: currentPrec,
              prec2: topPrec,
              result: compResult ? 'pop' : 'push',
              reason
            };

            if (compResult) {
              const popped = stack.pop()!;
              output += popped.value;
              addStep(
                `Pop "${popped.value}" due to higher or equal precedence (prec("${popped.value}") >= prec("${val}"))`,
                26,
                stack,
                i,
                tokens,
                { output },
                { precedenceCompare: compare }
              );
            } else {
              break;
            }
          }

          stack.push({ id: makeId(), value: val });
          addStep(`Push operator "${val}" onto stack`, 29, stack, i + 1, tokens, { output });
        }
      }

      // Pop remaining operators
      if (stack.length > 0) {
        addStep('Expression scanning completed. Pop all remaining operators in stack', 33, stack, tokens.length, tokens, { output });
        while (stack.length > 0) {
          const popped = stack.pop()!;
          output += popped.value;
          addStep(`Pop remaining operator "${popped.value}" to Output`, 34, stack, tokens.length, tokens, { output });
        }
      }

      addStep(`Postfix conversion completed successfully. Result: "${output}"`, 37, stack, tokens.length, tokens, { output });
      break;
    }

    case 'infix-to-prefix': {
      // Step-by-step visualization for Infix to Prefix:
      // 1. Reverse expression, swap brackets
      // 2. Perform Shunting-Yard
      // 3. Reverse final output
      const tokens = tokenizeExpression(input);
      addStep(`Infix to Prefix: Start by reversing the input: "${input}"`, 13, [], 0, tokens, { phase: 'Reverse Input', output: '' });

      // Reverse input characters
      const reversedInput = input.split('').reverse().map(c => {
        if (c === '(') return ')';
        if (c === ')') return '(';
        return c;
      }).join('');

      const revTokens = tokenizeExpression(reversedInput);
      addStep(`Reversed expression with swapped parentheses: "${reversedInput}"`, 17, [], 0, revTokens, { phase: 'reversed', output: '' });

      const stack: StackItem[] = [];
      let intermediatePostfix = '';

      // Run postfix on reversed
      for (let i = 0; i < revTokens.length; i++) {
        const token = revTokens[i];
        const val = token.value;

        if (token.type === 'operand') {
          intermediatePostfix += val;
          addStep(`Operand "${val}": Append to postfix ribbon`, 26, stack, i + 1, revTokens, { phase: 'shunting_yard', output: intermediatePostfix });
        } else if (val === '(') {
          stack.push({ id: makeId(), value: '(' });
          addStep(`Push "(" onto stack`, 28, stack, i + 1, revTokens, { phase: 'shunting_yard', output: intermediatePostfix });
        } else if (val === ')') {
          while (stack.length > 0 && stack[stack.length - 1].value !== '(') {
            const popped = stack.pop()!;
            intermediatePostfix += popped.value;
            addStep(`Pop "${popped.value}" to postfix ribbon`, 31, stack, i + 1, revTokens, { phase: 'shunting_yard', output: intermediatePostfix });
          }
          stack.pop(); // Pop '('
          addStep(`Discard matching parenthesized pairing`, 34, stack, i + 1, revTokens, { phase: 'shunting_yard', output: intermediatePostfix });
        } else if (token.type === 'operator') {
          const currentPrec = getPrecedence(val);
          while (stack.length > 0) {
            const topOp = stack[stack.length - 1].value as string;
            const topPrec = getPrecedence(topOp);
            // Modified precedence for prefix comparison: strict inequality (<) instead of (<=)
            if (topPrec > currentPrec) {
              const popped = stack.pop()!;
              intermediatePostfix += popped.value;
              addStep(`Pop higher precedence operator "${popped.value}"`, 37, stack, i, revTokens, { phase: 'shunting_yard', output: intermediatePostfix });
            } else {
              break;
            }
          }
          stack.push({ id: makeId(), value: val });
          addStep(`Push operator "${val}"`, 40, stack, i + 1, revTokens, { phase: 'shunting_yard', output: intermediatePostfix });
        }
      }

      while (stack.length > 0) {
        const popped = stack.pop()!;
        intermediatePostfix += popped.value;
        addStep(`Pop remaining operator "${popped.value}" to postfix ribbon`, 44, stack, revTokens.length, revTokens, { phase: 'shunting_yard', output: intermediatePostfix });
      }

      const finalPrefix = intermediatePostfix.split('').reverse().join('');
      addStep(`Final Prefix result: reverse intermediate postfix "${intermediatePostfix}" -> "${finalPrefix}"`, 48, [], revTokens.length, revTokens, { phase: 'Reverse Output', output: finalPrefix });
      break;
    }

    case 'evaluate-postfix': {
      const items = parseInputArray(input);
      const stack: StackItem[] = [];
      const tokens: TokenItem[] = items.map(val => {
        const isOp = ['+', '-', '*', '/', '^'].includes(val);
        return {
          value: val,
          type: isOp ? 'operator' : 'operand',
          isScanned: false,
          isActive: false
        };
      });

      addStep('Initialize numerical evaluation stack', 7, [], 0, tokens);

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'operand') {
          const num = Number(tok.value);
          stack.push({ id: makeId(), value: num });
          addStep(`Operand "${num}": Push onto stack`, 16, stack, i + 1, tokens);
        } else {
          const op2 = stack.pop()!;
          const op1 = stack.pop()!;
          const v2 = Number(op2.value);
          const v1 = Number(op1.value);
          let res = 0;
          switch (tok.value) {
            case '+': res = v1 + v2; break;
            case '-': res = v1 - v2; break;
            case '*': res = v1 * v2; break;
            case '/': res = Math.floor(v1 / v2); break;
            case '^': res = Math.pow(v1, v2); break;
          }
          stack.push({ id: makeId(), value: res });
          addStep(
            `Operator "${tok.value}": Pop operands (${v1}, ${v2}), evaluate "${v1} ${tok.value} ${v2}" = ${res}, push result back`,
            11,
            stack,
            i + 1,
            tokens,
            { op1: v1, op2: v2, result: res }
          );
        }
      }

      addStep(`Evaluation completed. Output: ${stack[stack.length - 1].value}`, 18, stack, tokens.length, tokens);
      break;
    }

    case 'evaluate-prefix': {
      const items = parseInputArray(input);
      const stack: StackItem[] = [];
      const tokens: TokenItem[] = items.map(val => {
        const isOp = ['+', '-', '*', '/', '^'].includes(val);
        return {
          value: val,
          type: isOp ? 'operator' : 'operand',
          isScanned: false,
          isActive: false
        };
      });

      addStep('Initialize numerical evaluation stack (Prefix evaluates Right-to-Left)', 7, [], tokens.length, tokens);

      for (let i = tokens.length - 1; i >= 0; i--) {
        const tok = tokens[i];
        if (tok.type === 'operand') {
          const num = Number(tok.value);
          stack.push({ id: makeId(), value: num });
          addStep(`Operand "${num}": Push onto stack`, 18, stack, i, tokens);
        } else {
          const op1 = stack.pop()!;
          const op2 = stack.pop()!;
          const v1 = Number(op1.value);
          const v2 = Number(op2.value);
          let res = 0;
          switch (tok.value) {
            case '+': res = v1 + v2; break;
            case '-': res = v1 - v2; break;
            case '*': res = v1 * v2; break;
            case '/': res = Math.floor(v1 / v2); break;
            case '^': res = Math.pow(v1, v2); break;
          }
          stack.push({ id: makeId(), value: res });
          addStep(
            `Operator "${tok.value}": Pop operands (${v1}, ${v2}), evaluate "${v1} ${tok.value} ${v2}" = ${res}, push result back`,
            12,
            stack,
            i,
            tokens,
            { op1: v1, op2: v2, result: res }
          );
        }
      }

      addStep(`Evaluation completed. Output: ${stack[stack.length - 1].value}`, 20, stack, 0, tokens);
      break;
    }

    case 'postfix-to-infix': {
      const items = parseInputArray(input);
      const stack: StackItem[] = [];
      const tokens: TokenItem[] = items.map(val => {
        const isOp = ['+', '-', '*', '/', '^'].includes(val);
        return {
          value: val,
          type: isOp ? 'operator' : 'operand',
          isScanned: false,
          isActive: false
        };
      });

      addStep('Initialize postfix-to-infix conversion stack of expressions', 7, [], 0, tokens);

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.type === 'operand') {
          stack.push({ id: makeId(), value: tok.value });
          addStep(`Operand "${tok.value}": Push onto stack`, 14, stack, i + 1, tokens);
        } else {
          const op2 = stack.pop()!;
          const op1 = stack.pop()!;
          const expr = `(${op1.value} ${tok.value} ${op2.value})`;
          stack.push({ id: makeId(), value: expr });
          addStep(
            `Operator "${tok.value}": Pop two elements, wrap with operator as "${expr}", push back`,
            10,
            stack,
            i + 1,
            tokens
          );
        }
      }

      addStep(`Infix translation completed. Result: "${stack[stack.length - 1]?.value || ''}"`, 16, stack, tokens.length, tokens);
      break;
    }

    case 'prefix-to-infix': {
      const items = parseInputArray(input);
      const stack: StackItem[] = [];
      const tokens: TokenItem[] = items.map(val => {
        const isOp = ['+', '-', '*', '/', '^'].includes(val);
        return {
          value: val,
          type: isOp ? 'operator' : 'operand',
          isScanned: false,
          isActive: false
        };
      });

      addStep('Initialize prefix-to-infix conversion stack (scanning Right-to-Left)', 7, [], tokens.length, tokens);

      for (let i = tokens.length - 1; i >= 0; i--) {
        const tok = tokens[i];
        if (tok.type === 'operand') {
          stack.push({ id: makeId(), value: tok.value });
          addStep(`Operand "${tok.value}": Push onto stack`, 18, stack, i, tokens);
        } else {
          const op1 = stack.pop()!;
          const op2 = stack.pop()!;
          const expr = `(${op1.value} ${tok.value} ${op2.value})`;
          stack.push({ id: makeId(), value: expr });
          addStep(
            `Operator "${tok.value}": Pop two elements, wrap with operator as "${expr}", push back`,
            12,
            stack,
            i,
            tokens
          );
        }
      }

      addStep(`Infix translation completed. Result: "${stack[stack.length - 1]?.value || ''}"`, 20, stack, 0, tokens);
      break;
    }

    case 'basic-calculator': {
      const tokens = tokenizeExpression(input);
      const stack: StackItem[] = [];
      let result = 0;
      let number = 0;
      let sign = 1;

      addStep('Initialize dynamic calculation state: result = 0, sign = 1', 6, [], 0, tokens, { result, sign, number });

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const val = tok.value;

        if (tok.type === 'operand' && /[0-9]/.test(val)) {
          number = 10 * number + Number(val);
          addStep(`Build number digit-by-digit: number = ${number}`, 12, stack, i + 1, tokens, { result, sign, number });
        } else if (val === '+') {
          const prev = result;
          result += sign * number;
          addStep(`Operator "+": Add prior number (${sign} * ${number}) to result: ${prev} -> ${result}`, 15, stack, i + 1, tokens, { result, sign: 1, number: 0 });
          sign = 1;
          number = 0;
        } else if (val === '-') {
          const prev = result;
          result += sign * number;
          addStep(`Operator "-": Add prior number (${sign} * ${number}) to result: ${prev} -> ${result}`, 19, stack, i + 1, tokens, { result, sign: -1, number: 0 });
          sign = -1;
          number = 0;
        } else if (val === '(') {
          // Push result and sign onto stack
          stack.push({ id: makeId(), value: result, subValue: `result` });
          stack.push({ id: makeId(), value: sign, subValue: `sign` });
          addStep(`Parenthesis "(": Push running result (${result}) and sign (${sign}) onto stack, reset context`, 22, stack, i + 1, tokens, { result: 0, sign: 1, number: 0 });
          result = 0;
          sign = 1;
        } else if (val === ')') {
          const innerPrev = result;
          result += sign * number;
          addStep(`Parenthesis ")": Close current nested group, calculate inner result = ${result}`, 26, stack, i + 1, tokens, { result, sign, number: 0 });
          
          number = 0;
          const poppedSign = stack.pop()!.value as number;
          const poppedPriorResult = stack.pop()!.value as number;
          
          const combined = (result * poppedSign) + poppedPriorResult;
          addStep(
            `Merge scopes: Pop sign (${poppedSign}) & prior result (${poppedPriorResult}) -> new result = (${result} * ${poppedSign}) + ${poppedPriorResult} = ${combined}`,
            28,
            stack,
            i + 1,
            tokens,
            { result: combined, sign: 1, number: 0 }
          );
          result = combined;
        }
      }

      const finalVal = result + (sign * number);
      addStep(`Finalize: Add last digit grouping -> Output Result = ${finalVal}`, 32, stack, tokens.length, tokens, { result: finalVal, sign, number: 0 });
      break;
    }

    case 'next-greater-element': {
      const nums = parseInputArray(input).map(Number);
      const n = nums.length;
      const res = Array(n).fill(-1);
      const stack: StackItem[] = []; // Stores indices

      addStep('Initialize empty monotonic decreasing index stack and result array filled with -1', 6, [], 0, undefined, { res: [...res] });

      // Scan twice
      for (let i = 0; i < 2 * n; i++) {
        const idx = i % n;
        addStep(
          `Inspect element at index ${idx} (value: ${nums[idx]}) in loop iteration ${i + 1}/${2*n}`,
          11,
          stack,
          idx,
          undefined,
          { res: [...res], idx, value: nums[idx], stackVals: stack.map(it => nums[it.value as number]) }
        );

        while (stack.length > 0) {
          const topIdx = stack[stack.length - 1].value as number;
          if (nums[topIdx] < nums[idx]) {
            res[topIdx] = nums[idx];
            stack.pop();
            addStep(
              `Monotonic condition breached: nums[${topIdx}] (${nums[topIdx]}) < current (${nums[idx]}). Pop index ${topIdx} and record Next Greater = ${nums[idx]}`,
              13,
              stack,
              idx,
              undefined,
              { res: [...res], idx, value: nums[idx], poppedIndex: topIdx, stackVals: stack.map(it => nums[it.value as number]) }
            );
          } else {
            break;
          }
        }

        if (i < n) {
          stack.push({ id: makeId(), value: idx, subValue: nums[idx] });
          addStep(
            `Push index ${idx} to stack (retains monotonic decreasing invariant)`,
            18,
            stack,
            idx,
            undefined,
            { res: [...res], idx, value: nums[idx], stackVals: stack.map(it => nums[it.value as number]) }
          );
        }
      }

      addStep(`Monotonic stack scanning completed. Final results calculated!`, 22, stack, -1, undefined, { res: [...res] });
      break;
    }

    case 'daily-temperatures': {
      const temps = parseInputArray(input).map(Number);
      const n = temps.length;
      const ans = Array(n).fill(0);
      const stack: StackItem[] = [];

      addStep('Initialize index stack and answer array with 0', 6, [], 0, undefined, { ans: [...ans] });

      for (let i = 0; i < n; i++) {
        addStep(`Inspect temperature at day ${i}: ${temps[i]}°F`, 9, stack, i, undefined, { ans: [...ans], currentTemp: temps[i] });

        while (stack.length > 0) {
          const topIdx = stack[stack.length - 1].value as number;
          if (temps[i] > temps[topIdx]) {
            stack.pop();
            ans[topIdx] = i - topIdx;
            addStep(
              `Warmer day found! ${temps[i]}°F > ${temps[topIdx]}°F (day ${topIdx}). Pop day ${topIdx}. Wait time: ${i} - ${topIdx} = ${ans[topIdx]} days`,
              11,
              stack,
              i,
              undefined,
              { ans: [...ans], currentTemp: temps[i], poppedDay: topIdx }
            );
          } else {
            break;
          }
        }

        stack.push({ id: makeId(), value: i, subValue: temps[i] });
        addStep(`Push day ${i} onto monotonic decreasing stack`, 14, stack, i, undefined, { ans: [...ans], currentTemp: temps[i] });
      }

      addStep(`Daily Temperatures completed. Output waiting arrays calculated!`, 17, stack, -1, undefined, { ans: [...ans] });
      break;
    }

    case 'online-stock-span': {
      const prices = parseInputArray(input).map(Number);
      const stack: StackItem[] = []; // stores pairs {price, span}
      const spans: number[] = [];

      addStep('Initialize StockSpanner with empty monotonic price stack', 8, [], -1, undefined, { spans: [] });

      for (let i = 0; i < prices.length; i++) {
        const price = prices[i];
        let span = 1;
        
        addStep(`New stock price incoming: $${price}`, 13, stack, i, undefined, { spans: [...spans], price });

        while (stack.length > 0) {
          const topItem = stack[stack.length - 1];
          const topPrice = topItem.value as number;
          const topSpan = topItem.subValue as number;

          if (topPrice <= price) {
            stack.pop();
            span += topSpan;
            addStep(
              `Pop stock $${topPrice} from stack since it is <= $${price}. Accrue prior span: ${span - topSpan} + ${topSpan} = ${span}`,
              15,
              stack,
              i,
              undefined,
              { spans: [...spans], price, poppedPrice: topPrice, poppedSpan: topSpan }
            );
          } else {
            break;
          }
        }

        stack.push({ id: makeId(), value: price, subValue: span });
        spans.push(span);
        addStep(
          `Push current price $${price} with accumulated span ${span} onto stack`,
          18,
          stack,
          i,
          undefined,
          { spans: [...spans], price, currentSpan: span }
        );
      }
      break;
    }

    case 'largest-rectangle': {
      const heights = parseInputArray(input).map(Number);
      const stack: StackItem[] = [];
      let maxArea = 0;
      const n = heights.length;

      addStep('Initialize monotonic increasing index stack: maxArea = 0', 7, [], 0, undefined, { maxArea });

      for (let i = 0; i <= n; i++) {
        const h = i === n ? 0 : heights[i];
        addStep(
          `Step ${i}: Inspect boundary index ${i} (height: ${h})`,
          11,
          stack,
          i,
          undefined,
          { maxArea, currentH: h }
        );

        while (stack.length > 0) {
          const topIdx = stack[stack.length - 1].value as number;
          if (h < heights[topIdx]) {
            stack.pop();
            const height = heights[topIdx];
            const width = stack.length === 0 ? i : i - (stack[stack.length - 1].value as number) - 1;
            const area = height * width;
            const prevMax = maxArea;
            maxArea = Math.max(maxArea, area);

            const histState = {
              currentWidth: width,
              currentHeight: height,
              currentArea: area,
              maxArea,
              activeIndices: [topIdx],
              leftBoundary: stack.length === 0 ? 0 : (stack[stack.length - 1].value as number) + 1,
              rightBoundary: i - 1
            };

            addStep(
              `Pop index ${topIdx} (height ${height}). Width bounded by next stack top and index ${i} is ${width}. Area = ${height} * ${width} = ${area}. maxArea updated: max(${prevMax}, ${area}) = ${maxArea}`,
              13,
              stack,
              i,
              undefined,
              { maxArea, activePop: topIdx, currentH: h },
              { histogramState: histState }
            );
          } else {
            break;
          }
        }

        if (i < n) {
          stack.push({ id: makeId(), value: i, subValue: heights[i] });
          addStep(
            `Push index ${i} (height: ${heights[i]}) onto monotonic increasing stack`,
            19,
            stack,
            i,
            undefined,
            { maxArea, currentH: h }
          );
        }
      }

      addStep(`Largest Rectangle calculation completed. Absolute Max Area: ${maxArea}`, 22, stack, n, undefined, { maxArea });
      break;
    }

    case 'maximal-rectangle': {
      // 2D grid matrix parsing
      // e.g., input: "1 0 1 0 0 | 1 0 1 1 1 | 1 1 1 1 1 | 1 0 0 1 0"
      const rowsRaw = input.split('|');
      const matrix: string[][] = rowsRaw.map(r => r.trim().split(/\s+/).filter(Boolean));
      const cols = matrix[0]?.length || 0;
      const heights = Array(cols).fill(0);
      let maxArea = 0;

      addStep('Initialize cumulative column heights for 2D matrix rows', 8, [], -1, undefined, { maxArea, heights: [...heights] });

      for (let r = 0; r < matrix.length; r++) {
        addStep(`Process Matrix Row ${r + 1}/${matrix.length}`, 13, [], -1, undefined, { maxArea, activeRow: r, heights: [...heights] });

        for (let c = 0; c < cols; c++) {
          const val = matrix[r][c];
          if (val === '1') {
            heights[c]++;
          } else {
            heights[c] = 0;
          }
        }
        addStep(
          `Row ${r + 1} height values calculated: [${heights.join(', ')}]. Now calculate Largest Rectangle in Histogram on these heights`,
          16,
          [],
          -1,
          undefined,
          { maxArea, activeRow: r, heights: [...heights] }
        );

        // Nested Shunting / Histogram simulation on row
        const rowStack: StackItem[] = [];
        for (let i = 0; i <= cols; i++) {
          const h = i === cols ? 0 : heights[i];
          while (rowStack.length > 0) {
            const topIdx = rowStack[rowStack.length - 1].value as number;
            if (h < heights[topIdx]) {
              rowStack.pop();
              const height = heights[topIdx];
              const width = rowStack.length === 0 ? i : i - (rowStack[rowStack.length - 1].value as number) - 1;
              const area = height * width;
              maxArea = Math.max(maxArea, area);
              addStep(
                `Row ${r + 1}, Col boundary ${i}: Pop index ${topIdx} (height ${height}, width ${width}) -> Area: ${area}. maxArea = ${maxArea}`,
                24,
                rowStack,
                i,
                undefined,
                { maxArea, activeRow: r, heights: [...heights], topIdx }
              );
            } else {
              break;
            }
          }
          if (i < cols) {
            rowStack.push({ id: makeId(), value: i, subValue: heights[i] });
          }
        }
      }

      addStep(`Maximal Rectangle in 2D Binary Matrix completed. Maximum Rectangle Area: ${maxArea}`, 31, [], -1, undefined, { maxArea });
      break;
    }

    case 'trapping-rain-water': {
      const height = parseInputArray(input).map(Number);
      const stack: StackItem[] = [];
      let totalWater = 0;
      let i = 0;
      const n = height.length;

      addStep('Initialize monotonic decreasing stack of indices to find elevation boundaries', 7, [], 0, undefined, { totalWater, i });

      while (i < n) {
        addStep(`Inspect elevation bar at index ${i} (height: ${height[i]})`, 11, stack, i, undefined, { totalWater, i });

        while (stack.length > 0) {
          const topIdx = stack[stack.length - 1].value as number;
          if (height[i] > height[topIdx]) {
            stack.pop();
            addStep(
              `Valley valley-floor found! Elevation at ${i} (${height[i]}) > Top valley-floor at index ${topIdx} (${height[topIdx]}). Pop valley`,
              13,
              stack,
              i,
              undefined,
              { totalWater, i, poppedIdx: topIdx }
            );

            if (stack.length === 0) {
              addStep(`No left boundary elevation remaining to trap water. Discarding valley`, 15, stack, i, undefined, { totalWater, i });
              break;
            }

            const leftIdx = stack[stack.length - 1].value as number;
            const distance = i - leftIdx - 1;
            const boundedHeight = Math.min(height[i], height[leftIdx]) - height[topIdx];
            const waterAccrued = distance * boundedHeight;
            totalWater += waterAccrued;

            const wState = {
              trapped: [...height].map((h, idx) => (idx > leftIdx && idx < i ? Math.max(0, Math.min(height[i], height[leftIdx]) - h) : 0)),
              leftMax: [],
              rightMax: [],
              currentLeft: leftIdx,
              currentRight: i,
              totalWater
            };

            addStep(
              `Water Trapped between index ${leftIdx} (height ${height[leftIdx]}) and index ${i} (height ${height[i]}) over valley depth ${height[topIdx]}: width ${distance} * height ${boundedHeight} = ${waterAccrued}. Total Water: ${totalWater}`,
              18,
              stack,
              i,
              undefined,
              { totalWater, i, waterAccrued, leftIdx, rightIdx: i },
              { waterState: wState }
            );
          } else {
            break;
          }
        }

        stack.push({ id: makeId(), value: i, subValue: height[i] });
        addStep(`Push index ${i} onto monotonic decreasing stack`, 20, stack, i + 1, undefined, { totalWater, i });
        i++;
      }

      addStep(`Trapping Rain Water completed. Total water trapped: ${totalWater} units`, 22, stack, n, undefined, { totalWater });
      break;
    }

    case 'asteroid-collision': {
      const asteroids = parseInputArray(input).map(Number);
      const stack: StackItem[] = [];

      addStep('Initialize asteroid chamber stack', 6, [], 0, undefined, { asteroids });

      for (let i = 0; i < asteroids.length; i++) {
        const ast = asteroids[i];
        let survives = true;

        addStep(`Incoming asteroid: size ${ast} (direction: ${ast > 0 ? 'Right' : 'Left'})`, 8, stack, i, undefined, { asteroids, ast });

        while (stack.length > 0) {
          const topAst = stack[stack.length - 1].value as number;
          
          // Collision only if top is moving Right (+) and incoming is moving Left (-)
          if (topAst > 0 && ast < 0) {
            const topAbs = Math.abs(topAst);
            const incomingAbs = Math.abs(ast);

            if (topAbs < incomingAbs) {
              stack.pop();
              addStep(
                `Collision! Incoming leftward asteroid [${ast}] obliterates smaller rightward asteroid [${topAst}] at top. Pop top.`,
                11,
                stack,
                i,
                undefined,
                { asteroids, ast, collisionResult: 'incoming_wins' }
              );
              continue;
            } else if (topAbs === incomingAbs) {
              stack.pop();
              survives = false;
              addStep(
                `Collision! Both asteroids have equal size [${topAbs}]. Both are completely annihilated! Pop top & destroy incoming`,
                14,
                stack,
                i,
                undefined,
                { asteroids, ast, collisionResult: 'both_destroyed' }
              );
            } else {
              survives = false;
              addStep(
                `Collision! Rightward asteroid [${topAst}] is larger than incoming [${ast}]. Incoming asteroid is obliterated!`,
                17,
                stack,
                i,
                undefined,
                { asteroids, ast, collisionResult: 'top_wins' }
              );
            }
            break;
          } else {
            break;
          }
        }

        if (survives) {
          stack.push({ id: makeId(), value: ast });
          addStep(`Asteroid [${ast}] survives and is pushed onto stack chamber`, 21, stack, i + 1, undefined, { asteroids });
        }
      }

      const finalState = stack.map(it => it.value);
      addStep(`Asteroid Collision simulation completed. Surviving asteroids: [${finalState.join(', ')}]`, 25, stack, asteroids.length, undefined, { asteroids });
      break;
    }

    case 'remove-k-digits': {
      // Input e.g. "1432219, k=3"
      let numStr = '1432219';
      let k = 3;
      
      const parts = input.split(',');
      if (parts[0]) numStr = parts[0].trim();
      if (parts[1]) {
        const kMatch = parts[1].match(/\d+/);
        if (kMatch) k = Number(kMatch[0]);
      }

      const tokens: TokenItem[] = numStr.split('').map(char => ({
        value: char,
        type: 'operand',
        isScanned: false,
        isActive: false
      }));

      const stack: StackItem[] = [];
      addStep(`Initialize digit stack. Goal: remove ${k} elements to make smallest number from "${numStr}"`, 6, [], 0, tokens, { k });

      for (let i = 0; i < tokens.length; i++) {
        const digit = tokens[i].value;
        addStep(`Inspect digit: "${digit}"`, 8, stack, i, tokens, { k, digit });

        while (k > 0 && stack.length > 0) {
          const topDigit = stack[stack.length - 1].value as string;
          if (topDigit > digit) {
            stack.pop();
            k--;
            addStep(
              `Monotonic condition: Stack top digit "${topDigit}" > incoming "${digit}" and we still have k=${k+1} removals. Pop "${topDigit}" (k decrements to ${k})`,
              9,
              stack,
              i,
              tokens,
              { k, digit, popped: topDigit }
            );
          } else {
            break;
          }
        }

        stack.push({ id: makeId(), value: digit });
        addStep(`Push digit "${digit}" onto stack`, 12, stack, i + 1, tokens, { k });
      }

      // Pop remaining k digits if any
      if (k > 0) {
        addStep(`Scan complete. Still need to remove remaining k=${k} elements. Pop from stack top`, 15, stack, tokens.length, tokens, { k });
        while (k > 0 && stack.length > 0) {
          const popped = stack.pop()!;
          k--;
          addStep(`Pop element "${popped.value}" (k decrements to ${k})`, 17, stack, tokens.length, tokens, { k });
        }
      }

      // Clear leading zeros
      const combinedDigits = stack.map(it => it.value).join('');
      let leadingZerosCount = 0;
      while (leadingZerosCount < combinedDigits.length && combinedDigits[leadingZerosCount] === '0') {
        leadingZerosCount++;
      }

      const cleanStr = combinedDigits.substring(leadingZerosCount) || '0';
      addStep(
        `Final step: clean leading zeros. Full string is "${combinedDigits}" -> returns final smallest number: "${cleanStr}"`,
        21,
        stack,
        tokens.length,
        tokens,
        { k, finalResult: cleanStr }
      );
      break;
    }
  }

  return steps;
}
