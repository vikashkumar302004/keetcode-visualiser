import { AlgorithmId, SimulationStep } from '../types';

export function generateSimulationSteps(
  id: AlgorithmId,
  inputs: Record<string, any>
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const logs: string[] = [];

  function addStep(
    line: number,
    explanation: string,
    stateOverrides: Partial<SimulationStep>
  ) {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const fullLogMessage = `[${timestamp}] L${line}: ${explanation}`;
    
    // We append the new log to the logs list
    const updatedLogs = [...logs];
    // Check if the exact message isn't already the last log to prevent visual duplication
    if (updatedLogs.length === 0 || updatedLogs[updatedLogs.length - 1] !== fullLogMessage) {
      updatedLogs.push(fullLogMessage);
      logs.push(fullLogMessage);
    }

    steps.push({
      stepIndex: steps.length,
      line,
      explanation,
      logs: [...updatedLogs],
      ...stateOverrides,
    });
  }

  // --- 01: Standard Linear Queue ---
  if (id === '01') {
    const capacity = Number(inputs.capacity) || 5;
    const opsStr = inputs.operations || 'Enqueue(10), Enqueue(20), Enqueue(30), Dequeue(), Enqueue(40), Dequeue()';
    const ops = opsStr.split(',').map((s: string) => s.trim());

    let queue: (string | number | null)[] = Array(capacity).fill(null);
    let front = 0;
    let rear = 0;

    addStep(1, 'Initialize Standard Linear Queue with Capacity ' + capacity, {
      queue: [...queue],
      front,
      rear,
      count: 0,
      capacity,
    });

    for (const op of ops) {
      if (op.startsWith('Enqueue')) {
        const valMatch = op.match(/\(([^)]+)\)/);
        const val = valMatch ? valMatch[1] : 'X';
        addStep(9, `Attempt Enqueue(${val})`, { queue: [...queue], front, rear, capacity });

        addStep(10, `Check if Rear reaches Capacity (${rear} == ${capacity})`, { queue: [...queue], front, rear, capacity });
        if (rear === capacity) {
          addStep(11, `Queue Overflow! Cannot enqueue ${val}. Rear pointer has reached capacity end.`, {
            queue: [...queue],
            front,
            rear,
            capacity,
            highlightedIndices: [],
          });
        } else {
          queue[rear] = val;
          addStep(13, `Insert value '${val}' at rear index ${rear}`, {
            queue: [...queue],
            front,
            rear,
            capacity,
            highlightedIndices: [rear],
          });
          rear++;
          addStep(14, `Increment rear pointer to ${rear}`, {
            queue: [...queue],
            front,
            rear,
            capacity,
          });
        }
      } else if (op.startsWith('Dequeue')) {
        addStep(16, 'Attempt Dequeue()', { queue: [...queue], front, rear, capacity });
        addStep(17, `Check if Queue is empty (Front == Rear) -> (${front} == ${rear})`, { queue: [...queue], front, rear, capacity });

        if (front === rear) {
          addStep(18, 'Queue Underflow! Queue is completely empty.', {
            queue: [...queue],
            front,
            rear,
            capacity,
          });
        } else {
          const removedVal = queue[front];
          addStep(20, `Fetch element '${removedVal}' at front index ${front} and increment front to ${front + 1}`, {
            queue: [...queue],
            front,
            rear,
            capacity,
            highlightedIndices: [front],
          });
          queue[front] = null; // simulate dequeue removal
          front++;
          addStep(21, `Element '${removedVal}' successfully dequeued. New Front: ${front}`, {
            queue: [...queue],
            front,
            rear,
            capacity,
          });
        }
      } else if (op.startsWith('Peek')) {
        addStep(23, 'Attempt Peek()', { queue: [...queue], front, rear, capacity });
        addStep(24, `Check if empty (Front == Rear) -> (${front} == ${rear})`, { queue: [...queue], front, rear, capacity });
        if (front === rear) {
          addStep(24, 'Peek failed! Queue is empty.', { queue: [...queue], front, rear, capacity });
        } else {
          addStep(25, `Peek returned front element: '${queue[front]}'`, {
            queue: [...queue],
            front,
            rear,
            capacity,
            highlightedIndices: [front],
          });
        }
      }
    }
    return steps;
  }

  // --- 02: Design Circular Queue ---
  if (id === '02') {
    const capacity = Number(inputs.capacity) || 5;
    const opsStr = inputs.operations || 'enq(1), enq(2), enq(3), enq(4), deq(), enq(5), deq()';
    const ops = opsStr.split(',').map((s: string) => s.trim());

    let queue: (string | number | null)[] = Array(capacity).fill(null);
    let front = 0;
    let rear = 0;
    let count = 0;

    addStep(8, `Initialize Circular Queue with Capacity ${capacity}`, {
      queue: [...queue],
      front,
      rear,
      count,
      capacity,
    });

    for (const op of ops) {
      if (op.toLowerCase().startsWith('enq')) {
        const valMatch = op.match(/\(([^)]+)\)/);
        const val = valMatch ? valMatch[1] : 'X';
        addStep(10, `Attempt enQueue(${val})`, { queue: [...queue], front, rear, count, capacity });
        addStep(11, `Check if isFull() -> (${count} == ${capacity})`, { queue: [...queue], front, rear, count, capacity });

        if (count === capacity) {
          addStep(11, `Queue is Full! Cannot enqueue ${val}.`, { queue: [...queue], front, rear, count, capacity });
        } else {
          queue[rear] = val;
          addStep(12, `Store element '${val}' at rear index ${rear}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [rear],
          });
          const oldRear = rear;
          rear = (rear + 1) % capacity;
          addStep(13, `Update rear pointer using circular modulo: (rear + 1) % capacity -> (${oldRear} + 1) % ${capacity} = ${rear}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
          });
          count++;
          addStep(14, `Increment element count to ${count}`, { queue: [...queue], front, rear, count, capacity });
        }
      } else if (op.toLowerCase().startsWith('deq')) {
        addStep(18, 'Attempt deQueue()', { queue: [...queue], front, rear, count, capacity });
        addStep(19, `Check if isEmpty() -> (${count} == 0)`, { queue: [...queue], front, rear, count, capacity });

        if (count === 0) {
          addStep(19, 'Queue is Empty! Cannot dequeue.', { queue: [...queue], front, rear, count, capacity });
        } else {
          const removed = queue[front];
          queue[front] = null;
          addStep(20, `Remove element '${removed}' at front index ${front}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [front],
          });
          const oldFront = front;
          front = (front + 1) % capacity;
          addStep(21, `Update front pointer: (front + 1) % capacity -> (${oldFront} + 1) % ${capacity} = ${front}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
          });
          count--;
          addStep(22, `Decrement element count to ${count}`, { queue: [...queue], front, rear, count, capacity });
        }
      } else if (op.toLowerCase().startsWith('front')) {
        addStep(26, 'Invoke Front()', { queue: [...queue], front, rear, count, capacity });
        if (count === 0) {
          addStep(27, 'Front() returned -1 (Empty queue)', { queue: [...queue], front, rear, count, capacity });
        } else {
          addStep(27, `Front() returned element: '${queue[front]}'`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [front],
          });
        }
      } else if (op.toLowerCase().startsWith('rear')) {
        addStep(30, 'Invoke Rear()', { queue: [...queue], front, rear, count, capacity });
        if (count === 0) {
          addStep(31, 'Rear() returned -1 (Empty queue)', { queue: [...queue], front, rear, count, capacity });
        } else {
          const lastIdx = (rear - 1 + capacity) % capacity;
          addStep(32, `Rear() calculated last occupied index: (rear - 1 + capacity) % capacity = ${lastIdx}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
          });
          addStep(33, `Rear() returned element: '${queue[lastIdx]}'`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [lastIdx],
          });
        }
      }
    }
    return steps;
  }

  // --- 03: Design Circular Deque ---
  if (id === '03') {
    const capacity = Number(inputs.capacity) || 5;
    const opsStr = inputs.operations || 'insertLast(1), insertLast(2), insertFront(3), deleteLast(), getFront(), getRear()';
    const ops = opsStr.split(',').map((s: string) => s.trim());

    let queue: (string | number | null)[] = Array(capacity).fill(null);
    let front = 0;
    let rear = 0;
    let count = 0;

    addStep(8, `Initialize Circular Deque with Capacity ${capacity}`, {
      queue: [...queue],
      front,
      rear,
      count,
      capacity,
    });

    for (const op of ops) {
      if (op.startsWith('insertFront')) {
        const valMatch = op.match(/\(([^)]+)\)/);
        const val = valMatch ? valMatch[1] : 'X';
        addStep(10, `Attempt insertFront(${val})`, { queue: [...queue], front, rear, count, capacity });
        addStep(11, `Check if isFull() -> (${count} == ${capacity})`, { queue: [...queue], front, rear, count, capacity });

        if (count === capacity) {
          addStep(11, `Deque is Full! Cannot insertFront ${val}.`, { queue: [...queue], front, rear, count, capacity });
        } else {
          const oldFront = front;
          front = (front - 1 + capacity) % capacity;
          addStep(12, `Circular decrement Front pointer: (front - 1 + capacity) % capacity -> (${oldFront} - 1 + ${capacity}) % ${capacity} = ${front}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
          });
          queue[front] = val;
          addStep(13, `Store element '${val}' at new front index ${front}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [front],
          });
          count++;
          addStep(14, `Increment element count to ${count}`, { queue: [...queue], front, rear, count, capacity });
        }
      } else if (op.startsWith('insertLast')) {
        const valMatch = op.match(/\(([^)]+)\)/);
        const val = valMatch ? valMatch[1] : 'X';
        addStep(18, `Attempt insertLast(${val})`, { queue: [...queue], front, rear, count, capacity });
        addStep(19, `Check if isFull() -> (${count} == ${capacity})`, { queue: [...queue], front, rear, count, capacity });

        if (count === capacity) {
          addStep(19, `Deque is Full! Cannot insertLast ${val}.`, { queue: [...queue], front, rear, count, capacity });
        } else {
          queue[rear] = val;
          addStep(20, `Store element '${val}' at rear index ${rear}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [rear],
          });
          const oldRear = rear;
          rear = (rear + 1) % capacity;
          addStep(21, `Circular increment Rear pointer: (rear + 1) % capacity -> (${oldRear} + 1) % ${capacity} = ${rear}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
          });
          count++;
          addStep(22, `Increment element count to ${count}`, { queue: [...queue], front, rear, count, capacity });
        }
      } else if (op.startsWith('deleteFront')) {
        addStep(26, 'Attempt deleteFront()', { queue: [...queue], front, rear, count, capacity });
        addStep(27, `Check if isEmpty() -> (${count} == 0)`, { queue: [...queue], front, rear, count, capacity });

        if (count === 0) {
          addStep(27, 'Deque is Empty! Cannot deleteFront.', { queue: [...queue], front, rear, count, capacity });
        } else {
          const val = queue[front];
          queue[front] = null;
          addStep(28, `Clear element '${val}' at front index ${front}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [front],
          });
          const oldFront = front;
          front = (front + 1) % capacity;
          addStep(29, `Circular increment Front pointer: (front + 1) % capacity -> (${oldFront} + 1) % ${capacity} = ${front}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
          });
          count--;
          addStep(30, `Decrement element count to ${count}`, { queue: [...queue], front, rear, count, capacity });
        }
      } else if (op.startsWith('deleteLast')) {
        addStep(34, 'Attempt deleteLast()', { queue: [...queue], front, rear, count, capacity });
        addStep(35, `Check if isEmpty() -> (${count} == 0)`, { queue: [...queue], front, rear, count, capacity });

        if (count === 0) {
          addStep(35, 'Deque is Empty! Cannot deleteLast.', { queue: [...queue], front, rear, count, capacity });
        } else {
          const oldRear = rear;
          rear = (rear - 1 + capacity) % capacity;
          addStep(36, `Circular decrement Rear pointer: (rear - 1 + capacity) % capacity -> (${oldRear} - 1 + ${capacity}) % ${capacity} = ${rear}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
          });
          const val = queue[rear];
          queue[rear] = null;
          addStep(37, `Clear element '${val}' at new rear index ${rear}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [rear],
          });
          count--;
          addStep(38, `Decrement element count to ${count}`, { queue: [...queue], front, rear, count, capacity });
        }
      } else if (op.startsWith('getFront')) {
        addStep(42, 'Attempt getFront()', { queue: [...queue], front, rear, count, capacity });
        if (count === 0) {
          addStep(42, 'getFront() returned -1 (Empty Deque)', { queue: [...queue], front, rear, count, capacity });
        } else {
          addStep(42, `getFront() returned element '${queue[front]}' at front index ${front}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [front],
          });
        }
      } else if (op.startsWith('getRear')) {
        addStep(43, 'Attempt getRear()', { queue: [...queue], front, rear, count, capacity });
        if (count === 0) {
          addStep(43, 'getRear() returned -1 (Empty Deque)', { queue: [...queue], front, rear, count, capacity });
        } else {
          const lastIdx = (rear - 1 + capacity) % capacity;
          addStep(44, `getRear() returned element '${queue[lastIdx]}' at index (rear - 1) % capacity = ${lastIdx}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [lastIdx],
          });
        }
      }
    }
    return steps;
  }

  // --- 04: Implement Queue using Stacks ---
  if (id === '04') {
    const opsStr = inputs.operations || 'Push(1), Push(2), Push(3), Pop(), Push(4), Pop(), Peek()';
    const ops = opsStr.split(',').map((s: string) => s.trim());

    let stack1: (string | number)[] = [];
    let stack2: (string | number)[] = [];

    addStep(1, 'Initialize Stack1 and Stack2 to simulate a FIFO Queue', { stack1: [...stack1], stack2: [...stack2] });

    for (const op of ops) {
      if (op.startsWith('Push')) {
        const valMatch = op.match(/\(([^)]+)\)/);
        const val = valMatch ? valMatch[1] : 'X';
        addStep(13, `Push operation triggered for value '${val}'`, { stack1: [...stack1], stack2: [...stack2] });
        stack1.push(val);
        addStep(14, `Pushed '${val}' onto Stack1`, { stack1: [...stack1], stack2: [...stack2], highlightedIndices: [stack1.length - 1] });
      } else if (op.startsWith('Pop') || op.startsWith('Peek')) {
        const isPop = op.startsWith('Pop');
        addStep(isPop ? 18 : 24, `Triggered ${op}()`, { stack1: [...stack1], stack2: [...stack2] });

        if (stack2.length === 0) {
          addStep(6, `Stack2 is empty. Initiating step-by-step element transfer from Stack1 to Stack2 to reverse LIFO order.`, {
            stack1: [...stack1],
            stack2: [...stack2],
            activeTransfer: true,
          });

          while (stack1.length > 0) {
            const popped = stack1.pop()!;
            addStep(8, `Pop top element '${popped}' from Stack1`, {
              stack1: [...stack1],
              stack2: [...stack2],
              activeTransfer: true,
            });
            stack2.push(popped);
            addStep(9, `Push element '${popped}' onto Stack2`, {
              stack1: [...stack1],
              stack2: [...stack2],
              activeTransfer: true,
            });
          }
          addStep(11, 'Transfer complete. Stack2 now contains elements in reversed order (FIFO).', {
            stack1: [...stack1],
            stack2: [...stack2],
            activeTransfer: false,
          });
        }

        if (stack2.length === 0) {
          addStep(isPop ? 19 : 25, `Queue is completely empty! Underflow exception.`, { stack1: [...stack1], stack2: [...stack2] });
        } else {
          if (isPop) {
            const popped = stack2.pop()!;
            addStep(20, `Pop top element '${popped}' from Stack2 (representing Queue Front)`, {
              stack1: [...stack1],
              stack2: [...stack2],
            });
            addStep(21, `Pop returned popped value: '${popped}'`, { stack1: [...stack1], stack2: [...stack2] });
          } else {
            const topVal = stack2[stack2.length - 1];
            addStep(25, `Peek returns top element of Stack2 (Queue Front): '${topVal}'`, {
              stack1: [...stack1],
              stack2: [...stack2],
              highlightedIndices: [stack2.length - 1],
            });
          }
        }
      }
    }
    return steps;
  }

  // --- 05: Implement Stack using Queues ---
  if (id === '05') {
    const opsStr = inputs.operations || 'Push(10), Push(20), Push(30), Pop(), Push(40), Pop(), Top()';
    const ops = opsStr.split(',').map((s: string) => s.trim());

    let q: (string | number)[] = [];

    addStep(1, 'Initialize dynamic queue Q to simulate a Stack', { queue1: [...q] });

    for (const op of ops) {
      if (op.startsWith('Push')) {
        const valMatch = op.match(/\(([^)]+)\)/);
        const val = valMatch ? valMatch[1] : 'X';
        addStep(6, `Push(${val}) operation started. Enqueue element to back of Q.`, { queue1: [...q] });
        
        q.push(val);
        addStep(7, `Enqueued '${val}' to Q. Queue contents: [${q.join(', ')}]`, { queue1: [...q] });

        const size = q.length;
        addStep(8, `Queue size is ${size}. We must rotate the first ${size - 1} elements to move '${val}' to the front (LIFO top).`, {
          queue1: [...q],
        });

        for (let i = 0; i < size - 1; i++) {
          const frontEl = q.shift()!;
          addStep(9, `Step ${i + 1}/${size - 1}: Dequeue front element '${frontEl}'`, {
            queue1: [...q],
            activeTransfer: true,
          });
          q.push(frontEl);
          addStep(10, `Step ${i + 1}/${size - 1}: Enqueue '${frontEl}' back to Rear`, {
            queue1: [...q],
            activeTransfer: true,
          });
        }
        addStep(11, `Rotation completed. Newest element '${val}' is now at the front of the queue.`, {
          queue1: [...q],
          activeTransfer: false,
        });
      } else if (op.startsWith('Pop')) {
        addStep(14, 'Pop() operation triggered. Remove element from Q Front.', { queue1: [...q] });
        if (q.length === 0) {
          addStep(15, 'Stack is Empty! Cannot Pop.', { queue1: [...q] });
        } else {
          const popped = q.shift()!;
          addStep(15, `Dequeued front element '${popped}' (representing Stack Top)`, { queue1: [...q] });
          addStep(16, `Pop completed. Returned element: '${popped}'`, { queue1: [...q] });
        }
      } else if (op.startsWith('Top') || op.startsWith('Peek')) {
        addStep(19, 'Top() operation triggered. Query Q Front.', { queue1: [...q] });
        if (q.length === 0) {
          addStep(20, 'Stack is Empty! Top is -1.', { queue1: [...q] });
        } else {
          addStep(20, `Top of Stack is front element: '${q[0]}'`, { queue1: [...q], highlightedIndices: [0] });
        }
      }
    }
    return steps;
  }

  // --- 06: Sliding Window Maximum ---
  if (id === '06') {
    const arrayStr = inputs.array || '1,3,-1,-3,5,3,6,7';
    const nums = arrayStr.split(',').map((x: string) => Number(x.trim()));
    const k = Number(inputs.k) || 3;

    let dq: number[] = []; // stores indices
    let result: number[] = [];

    addStep(1, `Initialize Sliding Window Maximum. Array: [${nums.join(', ')}], Window Size K = ${k}`, {
      array: [...nums],
      deque: [],
      ans: [],
      windowL: null,
      windowR: null,
    });

    for (let i = 0; i < nums.size; i++) {
      // nums.size might be undefined, use nums.length
    }
    const len = nums.length;

    for (let i = 0; i < len; i++) {
      const currentVal = nums[i];
      addStep(4, `Iterating index i = ${i} (value: ${currentVal})`, {
        array: [...nums],
        deque: [...dq],
        ans: [...result],
        windowR: i,
        windowL: Math.max(0, i - k + 1),
      });

      // 1. Remove indices out of current window
      if (dq.length > 0 && dq[0] < i - k + 1) {
        const removedIdx = dq.shift()!;
        addStep(6, `Index ${removedIdx} at front of deque is outside active window [${i - k + 1}, ${i}]. Pop front.`, {
          array: [...nums],
          deque: [...dq],
          ans: [...result],
          windowR: i,
          windowL: i - k + 1,
        });
      }

      // 2. Maintain decreasing order in deque
      while (dq.length > 0 && nums[dq[dq.length - 1]] <= currentVal) {
        const poppedIdx = dq.pop()!;
        addStep(10, `Element at index ${poppedIdx} (val: ${nums[poppedIdx]}) <= current val ${currentVal}. Pop from back to maintain monotonic decreasing order.`, {
          array: [...nums],
          deque: [...dq],
          ans: [...result],
          windowR: i,
          windowL: Math.max(0, i - k + 1),
        });
      }

      // 3. Insert current element index
      dq.push(i);
      addStep(14, `Push current index ${i} to deque. Deque (indices): [${dq.join(', ')}] (values: [${dq.map(idx => nums[idx]).join(', ')}])`, {
        array: [...nums],
        deque: [...dq],
        ans: [...result],
        windowR: i,
        windowL: Math.max(0, i - k + 1),
      });

      // 4. Record maximum of current window
      if (i >= k - 1) {
        const maxIdx = dq[0];
        result.push(nums[maxIdx]);
        addStep(16, `Window is fully formed. Front of deque index ${maxIdx} represents maximum value: ${nums[maxIdx]}`, {
          array: [...nums],
          deque: [...dq],
          ans: [...result],
          windowR: i,
          windowL: i - k + 1,
          highlightedIndices: [maxIdx],
        });
      }
    }

    addStep(21, `Completed. Sliding Window Maximum results: [${result.join(', ')}]`, {
      array: [...nums],
      deque: [...dq],
      ans: [...result],
      windowR: len - 1,
      windowL: len - k,
    });
    return steps;
  }

  // --- 07: Longest Continuous Subarray With Absolute Diff <= Limit ---
  if (id === '07') {
    const arrayStr = inputs.array || '8,2,4,7';
    const nums = arrayStr.split(',').map((x: string) => Number(x.trim()));
    const limit = Number(inputs.limit) || 4;

    let maxDq: number[] = [];
    let minDq: number[] = [];
    let left = 0;
    let maxLength = 0;

    addStep(1, `Initialize. Finding longest subarray with max-diff <= ${limit}. Array: [${nums.join(', ')}]`, {
      array: [...nums],
      maxDeque: [],
      minDeque: [],
      windowL: left,
      windowR: null,
      ans: 0,
    });

    for (let right = 0; right < nums.length; right++) {
      const rightVal = nums[right];
      addStep(4, `Expand window right to index ${right} (val: ${rightVal})`, {
        array: [...nums],
        maxDeque: [...maxDq],
        minDeque: [...minDq],
        windowL: left,
        windowR: right,
        ans: maxLength,
      });

      // Maintain maxDq decreasing
      while (maxDq.length > 0 && nums[maxDq[maxDq.length - 1]] < rightVal) {
        const popped = maxDq.pop();
        addStep(5, `Pop index ${popped} from Max-Deque back because ${nums[popped!]} < ${rightVal}`, {
          array: [...nums],
          maxDeque: [...maxDq],
          minDeque: [...minDq],
          windowL: left,
          windowR: right,
          ans: maxLength,
        });
      }
      maxDq.push(right);

      // Maintain minDq increasing
      while (minDq.length > 0 && nums[minDq[minDq.length - 1]] > rightVal) {
        const popped = minDq.pop();
        addStep(7, `Pop index ${popped} from Min-Deque back because ${nums[popped!]} > ${rightVal}`, {
          array: [...nums],
          maxDeque: [...maxDq],
          minDeque: [...minDq],
          windowL: left,
          windowR: right,
          ans: maxLength,
        });
      }
      minDq.push(right);

      addStep(9, `Pushed index ${right} to Max-Deque and Min-Deque. Max-Dq (vals): [${maxDq.map(idx => nums[idx]).join(', ')}]. Min-Dq (vals): [${minDq.map(idx => nums[idx]).join(', ')}]`, {
        array: [...nums],
        maxDeque: [...maxDq],
        minDeque: [...minDq],
        windowL: left,
        windowR: right,
        ans: maxLength,
      });

      // Check limit violation
      let isViolating = nums[maxDq[0]] - nums[minDq[0]] > limit;
      while (isViolating) {
        const maxVal = nums[maxDq[0]];
        const minVal = nums[minDq[0]];
        addStep(13, `Limit Violated! Current Window [${left}, ${right}] has range max (${maxVal}) - min (${minVal}) = ${maxVal - minVal} > Limit (${limit}). Must shrink left pointer.`, {
          array: [...nums],
          maxDeque: [...maxDq],
          minDeque: [...minDq],
          windowL: left,
          windowR: right,
          ans: maxLength,
        });

        if (maxDq[0] === left) {
          maxDq.shift();
          addStep(14, `Front index of Max-Deque was left index ${left}. Pop front.`, {
            array: [...nums],
            maxDeque: [...maxDq],
            minDeque: [...minDq],
            windowL: left,
            windowR: right,
            ans: maxLength,
          });
        }
        if (minDq[0] === left) {
          minDq.shift();
          addStep(15, `Front index of Min-Deque was left index ${left}. Pop front.`, {
            array: [...nums],
            maxDeque: [...maxDq],
            minDeque: [...minDq],
            windowL: left,
            windowR: right,
            ans: maxLength,
          });
        }
        left++;
        isViolating = maxDq.length > 0 && minDq.length > 0 && (nums[maxDq[0]] - nums[minDq[0]] > limit);
        addStep(16, `Left index advanced to ${left}. New range max - min = ${maxDq.length > 0 && minDq.length > 0 ? nums[maxDq[0]] - nums[minDq[0]] : 0}`, {
          array: [...nums],
          maxDeque: [...maxDq],
          minDeque: [...minDq],
          windowL: left,
          windowR: right,
          ans: maxLength,
        });
      }

      const currentLen = right - left + 1;
      if (currentLen > maxLength) {
        maxLength = currentLen;
        addStep(18, `Valid window found! Update max length to ${maxLength} (Window: [${left} ... ${right}])`, {
          array: [...nums],
          maxDeque: [...maxDq],
          minDeque: [...minDq],
          windowL: left,
          windowR: right,
          ans: maxLength,
        });
      } else {
        addStep(18, `Window is valid but length ${currentLen} is not larger than max ${maxLength}.`, {
          array: [...nums],
          maxDeque: [...maxDq],
          minDeque: [...minDq],
          windowL: left,
          windowR: right,
          ans: maxLength,
        });
      }
    }

    addStep(21, `Completed. Longest valid subarray length is ${maxLength}`, {
      array: [...nums],
      maxDeque: [...maxDq],
      minDeque: [...minDq],
      windowL: left,
      windowR: nums.length - 1,
      ans: maxLength,
    });
    return steps;
  }

  // --- 08: Shortest Subarray with Sum at Least K ---
  if (id === '08') {
    const arrayStr = inputs.array || '2,-1,2';
    const nums = arrayStr.split(',').map((x: string) => Number(x.trim()));
    const k = Number(inputs.k) || 3;
    const n = nums.length;

    // Build Prefix sums
    const prefix: number[] = Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
      prefix[i + 1] = prefix[i] + nums[i];
    }

    let dq: number[] = [];
    let minLen = n + 1;

    addStep(1, `Initialize Shortest Subarray with Sum >= ${k}. Build prefix sum array.`, {
      array: [...nums],
      prefixSums: [...prefix],
      deque: [],
      ans: -1,
      windowL: null,
      windowR: null,
    });

    addStep(4, `Prefix sum array constructed: [${prefix.join(', ')}]`, {
      array: [...nums],
      prefixSums: [...prefix],
      deque: [],
      ans: -1,
    });

    for (let i = 0; i <= n; i++) {
      addStep(8, `Iterating index i = ${i} (Prefix sum: ${prefix[i]})`, {
        array: [...nums],
        prefixSums: [...prefix],
        deque: [...dq],
        windowR: i,
        ans: minLen > n ? -1 : minLen,
      });

      // Check if we can obtain a valid sum >= K by shrinking the left index (deque front)
      while (dq.length > 0 && prefix[i] - prefix[dq[0]] >= k) {
        const startIdx = dq.shift()!;
        const currentLen = i - startIdx;
        minLen = Math.min(minLen, currentLen);
        addStep(10, `Found valid subarray prefix[${i}] - prefix[${startIdx}] = ${prefix[i]} - ${prefix[startIdx]} = ${prefix[i] - prefix[startIdx]} >= ${k}. Current len: ${currentLen}. Update min length to ${minLen > n ? -1 : minLen}`, {
          array: [...nums],
          prefixSums: [...prefix],
          deque: [...dq],
          windowL: startIdx,
          windowR: i,
          ans: minLen > n ? -1 : minLen,
          highlightedIndices: [startIdx, i],
        });
      }

      // Maintain monotonic increasing order in the prefix deque
      while (dq.length > 0 && prefix[i] <= prefix[dq[dq.length - 1]]) {
        const popped = dq.pop()!;
        addStep(13, `Prefix sum prefix[${i}] (${prefix[i]}) <= prefix[${popped}] (${prefix[popped]}). Pop back from deque to keep prefix sums increasing.`, {
          array: [...nums],
          prefixSums: [...prefix],
          deque: [...dq],
          windowR: i,
          ans: minLen > n ? -1 : minLen,
        });
      }

      dq.push(i);
      addStep(15, `Push index ${i} to Deque. Deque: [${dq.join(', ')}]`, {
        array: [...nums],
        prefixSums: [...prefix],
        deque: [...dq],
        windowR: i,
        ans: minLen > n ? -1 : minLen,
      });
    }

    const finalAns = minLen > n ? -1 : minLen;
    addStep(18, `Completed. Shortest subarray with sum >= ${k} has length ${finalAns}`, {
      array: [...nums],
      prefixSums: [...prefix],
      deque: [...dq],
      ans: finalAns,
    });
    return steps;
  }

  // --- 09: First Non-Repeating Character in a Stream ---
  if (id === '09') {
    const stream = inputs.stream || 'a,a,b,c,b,d,a,f';
    const chars = stream.split(',').map((s: string) => s.trim());

    let freq: Record<string, number> = {};
    let q: string[] = [];
    let ans = '';

    addStep(1, `Initialize Stream Processing. Stream: [${chars.join(', ')}]`, {
      charFreq: {},
      queue1: [],
      ans: '',
    });

    for (const ch of chars) {
      if (!ch) continue;
      addStep(6, `Process stream character '${ch}'`, {
        charFreq: { ...freq },
        queue1: [...q],
        ans,
      });

      freq[ch] = (freq[ch] || 0) + 1;
      addStep(7, `Increment frequency of '${ch}' to ${freq[ch]}`, {
        charFreq: { ...freq },
        queue1: [...q],
        ans,
      });

      q.push(ch);
      addStep(8, `Enqueue character '${ch}' to Rear`, {
        charFreq: { ...freq },
        queue1: [...q],
        ans,
      });

      // Pop non-unique chars from front
      while (q.length > 0 && freq[q[0]] > 1) {
        const removed = q.shift()!;
        addStep(10, `Front element '${removed}' frequency is ${freq[removed]} > 1 (repeating). Dequeue.`, {
          charFreq: { ...freq },
          queue1: [...q],
          ans,
        });
      }

      if (q.length === 0) {
        ans += '#';
        addStep(12, `Queue is empty. No non-repeating character exists at this point. Append '#'`, {
          charFreq: { ...freq },
          queue1: [...q],
          ans,
        });
      } else {
        const activeChar = q[0];
        ans += activeChar;
        addStep(13, `Front of queue has character '${activeChar}' with frequency 1. It is the first non-repeating character. Append '${activeChar}'`, {
          charFreq: { ...freq },
          queue1: [...q],
          ans,
          highlightedIndices: [0],
        });
      }
    }

    addStep(16, `Completed stream processing. Result: ${ans}`, {
      charFreq: { ...freq },
      queue1: [...q],
      ans,
    });
    return steps;
  }

  // --- 10: Moving Average from Data Stream ---
  if (id === '10') {
    const arrayStr = inputs.array || '1,10,3,5';
    const nums = arrayStr.split(',').map((x: string) => Number(x.trim()));
    const size = Number(inputs.size) || 3;

    let q: number[] = [];
    let sum = 0;

    addStep(1, `Initialize Moving Average from Data Stream. Max Size: ${size}`, {
      queue1: [],
      sum: 0,
      average: 0,
      array: [...nums],
    });

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      addStep(11, `Iterating index ${i}: Next data stream value is ${val}`, {
        queue1: [...q],
        sum,
        average: q.length > 0 ? sum / q.length : 0,
        array: [...nums],
        highlightedIndices: [i],
      });

      q.push(val);
      sum += val;
      addStep(12, `Enqueued ${val} and added to sum. Cumulative Sum: ${sum}`, {
        queue1: [...q],
        sum,
        average: sum / q.length,
        array: [...nums],
      });

      if (q.length > size) {
        const popped = q.shift()!;
        sum -= popped;
        addStep(15, `Queue size ${q.length + 1} exceeds sliding limit ${size}. Dequeue oldest '${popped}' and subtract from sum. New Sum: ${sum}`, {
          queue1: [...q],
          sum,
          average: sum / q.length,
          array: [...nums],
        });
      }

      const avg = sum / q.length;
      addStep(17, `Calculated moving average: ${sum} / ${q.length} = ${avg.toFixed(3)}`, {
        queue1: [...q],
        sum,
        average: avg,
        array: [...nums],
      });
    }

    addStep(20, 'Stream fully processed. Running simulation complete.', {
      queue1: [...q],
      sum,
      average: sum / q.length,
      array: [...nums],
    });
    return steps;
  }

  // --- 11: Reveal Cards In Increasing Order ---
  if (id === '11') {
    const arrayStr = inputs.array || '17,13,11,2,3,5,7';
    const deck = arrayStr.split(',').map((x: string) => Number(x.trim()));
    const n = deck.length;

    // 1. Sort the deck
    const sortedDeck = [...deck].sort((a, b) => a - b);

    addStep(1, `Initialize. Input Deck: [${deck.join(', ')}].`, {
      deck: [...deck],
      revealed: Array(n).fill(null),
    });

    addStep(2, `Sort the deck in increasing order: [${sortedDeck.join(', ')}]`, {
      deck: [...sortedDeck],
      revealed: Array(n).fill(null),
    });

    // 2. Initialize a queue of indices
    let q: number[] = [];
    for (let i = 0; i < n; i++) q.push(i);

    addStep(5, `Initialize FIFO queue of array indices: [${q.join(', ')}]`, {
      deck: [...sortedDeck],
      queue1: [...q],
      revealed: Array(n).fill(null),
    });

    let res: number[] = Array(n).fill(0);

    for (let step = 0; step < sortedDeck.length; step++) {
      const card = sortedDeck[step];
      const targetIdx = q[0];

      addStep(8, `Take next card ${card} from sorted deck`, {
        deck: [...sortedDeck],
        queue1: [...q],
        revealed: [...res],
        highlightedIndices: [step],
      });

      res[targetIdx] = card;
      addStep(9, `Assign card ${card} to output index res[${targetIdx}]`, {
        deck: [...sortedDeck],
        queue1: [...q],
        revealed: [...res],
        highlightedIndices: [targetIdx],
      });

      q.shift();
      addStep(9, `Dequeue front index ${targetIdx} from indices queue`, {
        deck: [...sortedDeck],
        queue1: [...q],
        revealed: [...res],
      });

      if (q.length > 0) {
        const rotateIdx = q.shift()!;
        q.push(rotateIdx);
        addStep(12, `Rotate Queue: Dequeue next front index ${rotateIdx} and move it to the Rear. Queue: [${q.join(', ')}]`, {
          deck: [...sortedDeck],
          queue1: [...q],
          revealed: [...res],
        });
      }
    }

    addStep(16, `Completed simulation. Reveal configuration: [${res.join(', ')}]`, {
      deck: [...sortedDeck],
      queue1: [...q],
      revealed: [...res],
    });
    return steps;
  }

  // --- 12: Rotting Oranges ---
  if (id === '12') {
    const gridStr = inputs.grid || '2,1,1;1,1,0;0,1,1';
    const rows = gridStr.split(';').map((r: string) => r.split(',').map((x: string) => Number(x.trim())));
    const R = rows.length;
    const C = rows[0].length;

    let grid = rows.map((r: number[]) => [...r]);
    let q: [number, number, number][] = []; // [row, col, minutes]
    let fresh = 0;
    let mins = 0;

    addStep(1, `Initialize multi-source BFS. Grid Dimensions: ${R}x${C}`, {
      grid: grid.map((r: number[]) => [...r]),
      orangeQueue: [],
      freshCount: 0,
      minutes: 0,
    });

    // Populate initially rotten oranges & count fresh
    for (let i = 0; i < R; ++i) {
      for (let j = 0; j < C; ++j) {
        if (grid[i][j] === 2) {
          q.push([i, j, 0]);
        } else if (grid[i][j] === 1) {
          fresh++;
        }
      }
    }

    addStep(6, `Found initially rotten oranges: [${q.map(([r,c]) => `(${r},${c})`).join(', ')}] and fresh: ${fresh}`, {
      grid: grid.map((r: number[]) => [...r]),
      orangeQueue: [...q],
      freshCount: fresh,
      minutes: mins,
    });

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (q.length > 0) {
      const [currR, currC, currMin] = q.shift()!;
      mins = Math.max(mins, currMin);

      addStep(13, `Pop rotten orange at (${currR}, ${currC}) from BFS queue. Active timestamp: ${currMin} minutes.`, {
        grid: grid.map((r: number[]) => [...r]),
        orangeQueue: [...q],
        freshCount: fresh,
        minutes: mins,
        activeCells: [[currR, currC]],
      });

      let localRot = false;
      let activeNeighbors: [number, number][] = [];

      for (const [dr, dc] of dirs) {
        const nr = currR + dr;
        const nc = currC + dc;
        
        if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
          activeNeighbors.push([nr, nc]);
          if (grid[nr][nc] === 1) {
            grid[nr][nc] = 2;
            fresh--;
            q.push([nr, nc, currMin + 1]);
            localRot = true;
            addStep(16, `Neighbor at (${nr}, ${nc}) is fresh. Contaminate and turn it ROTTEN. Enqueue with mins = ${currMin + 1}`, {
              grid: grid.map((r: number[]) => [...r]),
              orangeQueue: [...q],
              freshCount: fresh,
              minutes: mins,
              activeCells: [[currR, currC], [nr, nc]],
            });
          }
        }
      }
    }

    const completedSuccessfully = fresh === 0;
    addStep(21, completedSuccessfully ? `No more fresh oranges left! Completed in ${mins} minutes.` : `All rot spread stopped, but ${fresh} fresh oranges are isolated and unreachable. Return -1.`, {
      grid: grid.map((r: number[]) => [...r]),
      orangeQueue: [],
      freshCount: fresh,
      minutes: completedSuccessfully ? mins : -1,
    });

    return steps;
  }

  // --- 13: Gas Station / Circular Tour ---
  if (id === '13') {
    const gasStr = inputs.gas || '1,2,3,4,5';
    const costStr = inputs.cost || '3,4,5,1,2';
    const gas = gasStr.split(',').map((x: string) => Number(x.trim()));
    const cost = costStr.split(',').map((x: string) => Number(x.trim()));

    let totalGas = 0;
    let totalCost = 0;
    let tank = 0;
    let startIdx = 0;

    addStep(1, `Initialize Gas Station Tour. Stations: ${gas.length}`, {
      gas: [...gas],
      cost: [...cost],
      tank: 0,
      startCandidate: 0,
      activeStation: null,
    });

    for (let i = 0; i < gas.length; ++i) {
      totalGas += gas[i];
      totalCost += cost[i];
      tank += gas[i] - cost[i];

      addStep(5, `Visit Station ${i}. Gain gas: +${gas[i]}, Lose cost: -${cost[i]}. Net change: ${gas[i] - cost[i]}. Active Tank Balance: ${tank}`, {
        gas: [...gas],
        cost: [...cost],
        tank,
        startCandidate: startIdx,
        activeStation: i,
        highlightedIndices: [i],
      });

      if (tank < 0) {
        const oldStart = startIdx;
        startIdx = i + 1;
        tank = 0;
        addStep(8, `Tank went negative (${tank + (cost[i] - gas[i])} < 0)! Stations from index ${oldStart} to ${i} cannot be starting stations. Reset start candidate to ${startIdx}`, {
          gas: [...gas],
          cost: [...cost],
          tank,
          startCandidate: startIdx,
          activeStation: i,
        });
      }
    }

    const possible = totalGas >= totalCost;
    const ans = possible ? startIdx : -1;

    addStep(12, `Check overall balance: Total Gas (${totalGas}) >= Total Cost (${totalCost})? ${possible ? 'YES' : 'NO'}`, {
      gas: [...gas],
      cost: [...cost],
      tank,
      startCandidate: ans,
      activeStation: null,
    });

    addStep(13, possible ? `Tour is possible! Return valid start station index: ${ans}` : `Insufficient fuel globally to complete circuit. Return -1`, {
      gas: [...gas],
      cost: [...cost],
      tank,
      startCandidate: ans,
    });

    return steps;
  }

  // --- 14: Task Scheduler ---
  if (id === '14') {
    const tasksStr = inputs.tasks || 'A,A,A,B,B,B';
    const n = Number(inputs.n) || 2;
    const tasks = tasksStr.split(',').map((s: string) => s.trim());

    let counts: Record<string, number> = {};
    for (const t of tasks) {
      if (t) counts[t] = (counts[t] || 0) + 1;
    }

    addStep(1, `Initialize Task Scheduler with cooling limit N = ${n}. Tasks: [${tasks.join(', ')}]`, {
      tasks: [...tasks],
      taskCounts: { ...counts },
      taskCooldowns: {},
      scheduleResult: [],
      time: 0,
    });

    addStep(3, `Calculated frequencies: ${JSON.stringify(counts)}`, {
      tasks: [...tasks],
      taskCounts: { ...counts },
      taskCooldowns: {},
      scheduleResult: [],
      time: 0,
    });

    let time = 0;
    let result: string[] = [];
    let cooldowns: Record<string, number> = {}; // task -> time when it is free

    function hasTasksLeft() {
      return Object.values(counts).some(c => c > 0);
    }

    while (hasTasksLeft()) {
      time++;
      
      // Find eligible task with max frequency
      let bestTask: string | null = null;
      let maxFreq = 0;

      for (const [task, count] of Object.entries(counts)) {
        if (count > 0) {
          const isCool = !cooldowns[task] || cooldowns[task] <= time;
          if (isCool && count > maxFreq) {
            maxFreq = count;
            bestTask = task;
          }
        }
      }

      const activeCooldownsLog: Record<string, number> = {};
      for (const [task, freeTime] of Object.entries(cooldowns)) {
        if (freeTime > time && counts[task] > 0) {
          activeCooldownsLog[task] = freeTime - time;
        }
      }

      if (bestTask) {
        counts[bestTask]--;
        cooldowns[bestTask] = time + n + 1; // can execute again at time + n + 1
        result.push(bestTask);

        addStep(12, `Time Clock ${time}: Execute Task '${bestTask}' (remaining frequency: ${counts[bestTask]}). Cooldown starts for ${n} units (next eligible at time ${time + n + 1})`, {
          tasks: [...tasks],
          taskCounts: { ...counts },
          taskCooldowns: { ...activeCooldownsLog },
          scheduleResult: [...result],
          time,
        });
      } else {
        result.push('IDLE');
        addStep(13, `Time Clock ${time}: No tasks eligible (all remaining are in cooldown). CPU is IDLE.`, {
          tasks: [...tasks],
          taskCounts: { ...counts },
          taskCooldowns: { ...activeCooldownsLog },
          scheduleResult: [...result],
          time,
        });
      }
    }

    addStep(17, `All tasks scheduled successfully. Total units of time taken: ${time}`, {
      tasks: [...tasks],
      taskCounts: { ...counts },
      taskCooldowns: {},
      scheduleResult: [...result],
      time,
    });

    return steps;
  }

  // --- 15: LRU Cache (Least Recently Used) ---
  if (id === '15') {
    const capacity = Number(inputs.capacity) || 2;
    const opsStr = inputs.operations || 'Put(1,10), Put(2,20), Get(1), Put(3,30), Get(2)';
    const ops = opsStr.split(',').map((s: string) => s.trim());

    // dll represented as deque of keys (front is MRU, back is LRU)
    let deque: number[] = [];
    let cache: Record<number, number> = {};

    addStep(6, `Initialize LRU Cache with capacity ${capacity}`, {
      deque: [...deque],
      capacity,
      charFreq: { ...cache },
      explanation: 'Empty Cache Initialized.'
    });

    for (const op of ops) {
      if (op.startsWith('Put') || op.startsWith('put')) {
        const match = op.match(/\(([^,]+),([^)]+)\)/);
        if (!match) continue;
        const key = parseInt(match[1]);
        const val = parseInt(match[2]);

        addStep(14, `Put operation: Put(${key}, ${val})`, { deque: [...deque], capacity, charFreq: { ...cache } });

        const exists = cache[key] !== undefined;
        addStep(15, `Check if key ${key} already exists in cache: ${exists ? 'YES' : 'NO'}`, { deque: [...deque], capacity, charFreq: { ...cache } });

        if (exists) {
          addStep(16, `Key ${key} exists. Erase from current list position to update MRU status.`, { deque: [...deque], capacity, charFreq: { ...cache } });
          deque = deque.filter(k => k !== key);
        } else {
          addStep(17, `Key ${key} is new. Check if size reaches capacity (${deque.length} == ${capacity})`, { deque: [...deque], capacity, charFreq: { ...cache } });
          if (deque.length >= capacity) {
            const lruKey = deque[deque.length - 1];
            addStep(18, `Cache FULL. Evict Least Recently Used (LRU) key from the back: ${lruKey}`, { deque: [...deque], capacity, charFreq: { ...cache }, highlightedIndices: [deque.length - 1] });
            deque.pop();
            delete cache[lruKey];
            addStep(19, `LRU key ${lruKey} evicted successfully.`, { deque: [...deque], capacity, charFreq: { ...cache } });
          }
        }

        deque.unshift(key); // Move to head (MRU)
        cache[key] = val;
        addStep(21, `Push key ${key} to front (Most Recently Used). Update cache[${key}] = ${val}`, {
          deque: [...deque],
          capacity,
          charFreq: { ...cache },
          highlightedIndices: [0]
        });
      } else if (op.startsWith('Get') || op.startsWith('get')) {
        const match = op.match(/\(([^)]+)\)/);
        if (!match) continue;
        const key = parseInt(match[1]);

        addStep(7, `Get operation: Get(${key})`, { deque: [...deque], capacity, charFreq: { ...cache } });
        const exists = cache[key] !== undefined;
        addStep(8, `Check if key ${key} exists in cache: ${exists ? 'YES' : 'NO'}`, { deque: [...deque], capacity, charFreq: { ...cache } });

        if (!exists) {
          addStep(8, `Key ${key} not found. Return -1`, { deque: [...deque], capacity, charFreq: { ...cache }, ans: -1 });
        } else {
          const val = cache[key];
          addStep(9, `Key ${key} found with value ${val}. Erase from current position.`, { deque: [...deque], capacity, charFreq: { ...cache } });
          deque = deque.filter(k => k !== key);
          
          deque.unshift(key); // Move to head
          addStep(10, `Push key ${key} to front of Deque (Most Recently Used). Return value ${val}`, {
            deque: [...deque],
            capacity,
            charFreq: { ...cache },
            ans: val,
            highlightedIndices: [0]
          });
        }
      }
    }
    return steps;
  }

  // --- 16: Binary Tree Level Order Traversal ---
  if (id === '16') {
    const treeStr = inputs.tree || '3, 9, 20, null, null, 15, 7';
    const nodes = treeStr.split(',').map((s: string) => s.trim());

    // Simulate BFS using standard queue
    let queue: string[] = [];
    let traversalResult: string[][] = [];

    addStep(2, 'Initialize level order BFS traversal. Check if root is null', {
      queue: [...queue],
      revealed: [...traversalResult] as any[],
    });

    if (nodes[0] && nodes[0] !== 'null') {
      queue.push(nodes[0]);
      addStep(5, `Push root node '${nodes[0]}' to Queue`, {
        queue: [...queue],
        revealed: [...traversalResult] as any[],
        highlightedIndices: [0]
      });

      let treeIdx = 0;
      while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevelNodes: string[] = [];
        addStep(7, `Start Level processing. Current Queue size = ${levelSize}`, {
          queue: [...queue],
          revealed: [...traversalResult] as any[],
        });

        for (let i = 0; i < levelSize; i++) {
          const curr = queue.shift()!;
          currentLevelNodes.push(curr);
          addStep(11, `Pop node '${curr}' from Front of Queue, append to active level list`, {
            queue: [...queue],
            revealed: [...traversalResult, currentLevelNodes] as any[],
          });

          // Simulate children enqueuing based on level-index mapping
          const leftChildIdx = 2 * treeIdx + 1;
          const rightChildIdx = 2 * treeIdx + 2;
          treeIdx++;

          const leftChild = nodes[leftChildIdx];
          const rightChild = nodes[rightChildIdx];

          if (leftChild && leftChild !== 'null') {
            queue.push(leftChild);
            addStep(13, `Node '${curr}' has left child '${leftChild}'. Enqueue it.`, {
              queue: [...queue],
              revealed: [...traversalResult, currentLevelNodes] as any[],
            });
          }
          if (rightChild && rightChild !== 'null') {
            queue.push(rightChild);
            addStep(14, `Node '${curr}' has right child '${rightChild}'. Enqueue it.`, {
              queue: [...queue],
              revealed: [...traversalResult, currentLevelNodes] as any[],
            });
          }
        }
        traversalResult.push(currentLevelNodes);
        addStep(16, `Completed processing Level. Level list is [${currentLevelNodes.join(', ')}]`, {
          queue: [...queue],
          revealed: [...traversalResult] as any[],
        });
      }
    }

    addStep(18, `Traversal completed successfully! Final levels: [${traversalResult.map(lv => `[${lv.join(', ')}]`).join(', ')}]`, {
      queue: [],
      revealed: [...traversalResult] as any[],
    });

    return steps;
  }

  // --- 17: Number of Recent Calls ---
  if (id === '17') {
    const pingsStr = inputs.pings || '1, 100, 3001, 3002, 6000';
    const pings = pingsStr.split(',').map((s: string) => parseInt(s.trim())).filter((n: number) => !isNaN(n));

    let queue: number[] = [];

    addStep(5, 'Initialize RecentCounter. Prepare empty sliding window queue.', {
      queue: [...queue],
      ans: 0
    });

    for (const t of pings) {
      addStep(7, `Ping request received at timestamp t = ${t}ms`, { queue: [...queue] });
      
      queue.push(t);
      addStep(8, `Enqueue current ping timestamp ${t} to sliding window`, {
        queue: [...queue],
        highlightedIndices: [queue.length - 1]
      });

      addStep(9, `Check if old pings are outside the 3000ms window (older than ${t - 3000}ms)`, { queue: [...queue] });
      while (queue.length > 0 && queue[0] < t - 3000) {
        const evicted = queue.shift()!;
        addStep(10, `Evict stale ping timestamp ${evicted} (since ${evicted} < ${t - 3000}ms)`, {
          queue: [...queue],
          highlightedIndices: []
        });
      }

      addStep(12, `Window cleaned. Active requests in window [${t - 3000}ms to ${t}ms] = ${queue.length}`, {
        queue: [...queue],
        ans: queue.length
      });
    }

    return steps;
  }

  // --- 18: Design Bounded Blocking Queue ---
  if (id === '18') {
    const capacity = Number(inputs.capacity) || 3;
    const opsStr = inputs.operations || 'enq(5), enq(10), deq(), enq(15), enq(20), deq()';
    const ops = opsStr.split(',').map((s: string) => s.trim());

    let queue: (number | null)[] = Array(capacity).fill(null);
    let count = 0;
    let front = 0;
    let rear = 0;

    addStep(5, `Initialize Bounded Blocking Queue with capacity = ${capacity}`, {
      queue: [...queue],
      front,
      rear,
      count: 0,
      capacity
    });

    for (const op of ops) {
      if (op.startsWith('enq')) {
        const match = op.match(/\(([^)]+)\)/);
        const val = match ? parseInt(match[1]) : 0;

        addStep(7, `Thread calls Enqueue(${val})`, { queue: [...queue], front, rear, count, capacity });
        addStep(8, `Wait check: Is queue full? (count ${count} == capacity ${capacity})`, { queue: [...queue], front, rear, count, capacity });

        if (count >= capacity) {
          addStep(9, `Queue is FULL! Enqueue(${val}) thread blocks/waits...`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [front]
          });
          // For simulation purposes, we won't execute full blocking but will show that thread had to wait.
        } else {
          queue[rear] = val;
          rear = (rear + 1) % capacity;
          count++;
          addStep(10, `Enqueue successful. Inserted '${val}' at rear. Incremented size to ${count}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            highlightedIndices: [(rear - 1 + capacity) % capacity]
          });
        }
      } else if (op.startsWith('deq')) {
        addStep(13, `Thread calls Dequeue()`, { queue: [...queue], front, rear, count, capacity });
        addStep(14, `Wait check: Is queue empty? (count ${count} == 0)`, { queue: [...queue], front, rear, count, capacity });

        if (count === 0) {
          addStep(15, `Queue is EMPTY! Dequeue() thread blocks/waits...`, { queue: [...queue], front, rear, count, capacity });
        } else {
          const val = queue[front];
          queue[front] = null;
          front = (front + 1) % capacity;
          count--;
          addStep(16, `Dequeue successful. Popped element '${val}' from front. Decremented size to ${count}`, {
            queue: [...queue],
            front,
            rear,
            count,
            capacity,
            ans: val,
            highlightedIndices: [front]
          });
        }
      }
    }

    return steps;
  }

  // --- 19: Queue Reconstruction by Height ---
  if (id === '19') {
    const peopleStr = inputs.people || '[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]';
    // Parse people array from string
    const personMatches = peopleStr.match(/\[\s*\d+\s*,\s*\d+\s*\]/g) || [];
    const people = personMatches.map((p: string) => {
      const parts = p.replace(/[\[\]]/g, '').split(',').map((s: string) => parseInt(s.trim()));
      return [parts[0], parts[1]];
    });

    addStep(1, `Initialize queue reconstruction with ${people.length} people`, {
      queue: [],
      explanation: 'Unsorted candidates loaded.'
    });

    // Step 1: Sort by height descending, then by count ascending
    const sortedPeople = [...people].sort((a, b) => {
      if (a[0] === b[0]) return a[1] - b[1];
      return b[0] - a[0];
    });

    addStep(3, `Sort candidates by height descending, then by k-count ascending. Sorted: [${sortedPeople.map(p => `[${p[0]},${p[1]}]`).join(', ')}]`, {
      queue: [],
      explanation: 'Sorted candidates prepared for greedy inserts.'
    });

    let currentQueue: number[][] = [];
    for (const person of sortedPeople) {
      const insertIdx = person[1];
      addStep(7, `Process person [${person[0]}, ${person[1]}]. Insert index = ${insertIdx}`, {
        queue: currentQueue.map(p => p[0]),
        explanation: `Placing person with height ${person[0]} at index ${insertIdx}.`
      });

      // Insert at index k
      currentQueue.splice(insertIdx, 0, person);
      addStep(8, `Inserted person [${person[0]}, ${person[1]}] at index ${insertIdx}`, {
        queue: currentQueue.map(p => p[0]),
        highlightedIndices: [insertIdx]
      });
    }

    addStep(10, `Queue reconstructed successfully! Final order: [${currentQueue.map(p => `[${p[0]},${p[1]}]`).join(', ')}]`, {
      queue: currentQueue.map(p => p[0]),
      highlightedIndices: []
    });

    return steps;
  }

  // --- 20: 0-1 BFS Shortest Path ---
  if (id === '20') {
    // Simple mock adjacency graph for visualization based on input edges
    // Default edges: A-B(0), A-C(1), B-D(1), C-D(0), D-E(1)
    const start = inputs.start || 'A';
    const end = inputs.end || 'E';

    let deque: string[] = [];
    let dists: Record<string, number> = { A: 0 };

    addStep(5, `Initialize 0-1 BFS starting from node '${start}'. dist['${start}'] = 0`, {
      deque: [...deque],
      charFreq: { ...dists }
    });

    deque.push(start);
    addStep(6, `Push start node '${start}' to front of Deque`, {
      deque: [...deque],
      charFreq: { ...dists },
      highlightedIndices: [0]
    });

    // Custom 4-step traversal representing the BFS expansion
    // Step 1: Pop A, process neighbors B (weight 0) and C (weight 1)
    const u1 = deque.shift()!;
    dists['B'] = 0; // weight 0
    dists['C'] = 1; // weight 1
    deque.unshift('B'); // 0 weight goes to front
    deque.push('C'); // 1 weight goes to back
    addStep(7, `Pop '${u1}' from front. Neighbor 'B' has edge weight 0: set dist['B']=0, push B to Front. Neighbor 'C' has edge weight 1: set dist['C']=1, push C to Back.`, {
      deque: [...deque],
      charFreq: { ...dists }
    });

    // Step 2: Pop B, process neighbor D (weight 1)
    const u2 = deque.shift()!; // B
    dists['D'] = 1; // 0 + 1
    deque.push('D');
    addStep(7, `Pop '${u2}' from front. Neighbor 'D' has edge weight 1 from B: set dist['D']=1, push D to Back.`, {
      deque: [...deque],
      charFreq: { ...dists }
    });

    // Step 3: Pop C, process neighbor D (weight 0)
    const u3 = deque.shift()!; // C
    // dist['D'] remains 1 (min of 1 and 1+0=1)
    addStep(7, `Pop '${u3}' from front. Neighbor 'D' has edge weight 0 from C: check if new dist (1) < current dist (1). Equal, so skip enqueuing.`, {
      deque: [...deque],
      charFreq: { ...dists }
    });

    // Step 4: Pop D, process neighbor E (weight 1)
    const u4 = deque.shift()!; // D
    dists['E'] = 2; // 1 + 1
    deque.push('E');
    addStep(7, `Pop '${u4}' from front. Neighbor 'E' has edge weight 1 from D: set dist['E']=2, push E to Back.`, {
      deque: [...deque],
      charFreq: { ...dists }
    });

    // Step 5: Pop E, reached destination
    const u5 = deque.shift()!; // E
    addStep(16, `Reached target node '${end}' from front of Deque. Shortest distance is ${dists[end]}`, {
      deque: [...deque],
      charFreq: { ...dists },
      ans: dists[end]
    });

    return steps;
  }

  // Fallback
  return [{ stepIndex: 0, line: 1, explanation: 'Simulation initialized.', logs: [] }];
}
