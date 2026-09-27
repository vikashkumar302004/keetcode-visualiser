import{c as D,R as $,j as e,L as X,i as J,b as ee,A as te}from"./index-DB4ZFUvO.js";import{C as W,a as B}from"./chevron-right-BDoZT-2u.js";import{C as se}from"./chevron-up-wovbb2iz.js";import{C as ae}from"./chevron-down-CkVPmhZp.js";import{C as _}from"./circle-help-CbefhjH4.js";import{R as U,a as G,P as ne}from"./rotate-ccw-CEwYDrlE.js";import{A as ie,m as re}from"./react-aCOZkH92.js";import{G as oe}from"./git-commit-horizontal-DC1sTSXr.js";import{C as Z}from"./check-DUTGoD02.js";import{T as le}from"./trending-up-ua2nNUcA.js";import{C as ce}from"./code-BJg3NIy9.js";import{E as de}from"./eye-gvBe6GVh.js";import{L as pe}from"./list-ordered-BpqFAw7W.js";import{C as ue}from"./copy-e5wT54r1.js";import{Z as he}from"./zap-DymDpJKv.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z",key:"q0gr47"}]],me=D("ChartArea",xe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],ge=D("FileText",fe),I=[{id:"basic-stack",seq:"01",title:"Basic Stack Operations",leetcode:"N/A",difficulty:"Easy",description:"Understand the core Last-In-First-Out (LIFO) behavior of stacks with operations: Push, Pop, Top (Peek), isEmpty, and Capacity limits.",keyInsight:"The elements pushed last are popped first. Pushing on a full stack causes Overflow, and popping an empty stack causes Underflow.",defaultInput:"10, 20, 30",inputType:"array",inputPlaceholder:"e.g. 10, 20, 30"},{id:"valid-parentheses",seq:"02",title:"Valid Parentheses",leetcode:"LC #20",difficulty:"Easy",description:"Given a string containing brackets, check if opening brackets are closed by the same type in correct LIFO order.",keyInsight:"Push opening brackets to stack. When meeting a closing bracket, verify it matches the top of stack and pop. Empty stack at the end means valid.",defaultInput:"()[]{}",inputType:"text",inputPlaceholder:"e.g. {[]}"},{id:"min-stack",seq:"03",title:"Min Stack in O(1)",leetcode:"LC #155",difficulty:"Medium",description:"Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.",keyInsight:'Maintain a secondary parallel "Min Stack" that records the minimum value seen up to each point, or store a pair {value, currentMin} in each stack entry.',defaultInput:"12, 5, 18, 2, 7",inputType:"array",inputPlaceholder:"e.g. 12, 5, 18, 2, 7"},{id:"queue-using-stacks",seq:"04",title:"Implement Queue using Stacks",leetcode:"LC #232",difficulty:"Easy",description:"Implement a First-In-First-Out (FIFO) queue using only two standard LIFO stacks: inStack and outStack.",keyInsight:"Push new elements to inStack. For dequeue/pop, if outStack is empty, transfer all elements of inStack to outStack to reverse their order.",defaultInput:"1, 2, 3",inputType:"array",inputPlaceholder:"e.g. 1, 2, 3"},{id:"infix-to-postfix",seq:"05",title:"Infix to Postfix Conversion",leetcode:"N/A",difficulty:"Medium",description:"Convert standard infix expressions (A + B * C) to postfix (A B C * +) using the Dijkstra Shunting-Yard Algorithm.",keyInsight:"Operands go straight to output. Operators are pushed to stack after popping higher-or-equal precedence operators to ensure proper PEMDAS execution.",defaultInput:"a+b*(c^d-e)^(f+g*h)-i",inputType:"text",inputPlaceholder:"e.g. a+b*c"},{id:"infix-to-prefix",seq:"06",title:"Infix to Prefix Conversion",leetcode:"N/A",difficulty:"Medium",description:"Convert infix expressions to prefix (+ A * B C) by reversing the expression, swapping parentheses, running Shunting-Yard, and reversing output.",keyInsight:"Reversing infix transforms prefix order into postfix order with slightly adjusted operator precedence matching associativity.",defaultInput:"(a+b)*c-d",inputType:"text",inputPlaceholder:"e.g. (a+b)*c"},{id:"evaluate-postfix",seq:"07",title:"Evaluate Postfix (RPN)",leetcode:"LC #150",difficulty:"Medium",description:"Evaluate the value of an arithmetic expression in Reverse Polish Notation (Postfix).",keyInsight:"Scan left-to-right. Push operands onto the stack. When an operator is encountered, pop the top two operands, evaluate, and push the result.",defaultInput:"2, 1, +, 3, *",inputType:"array",inputPlaceholder:"e.g. 2, 1, +, 3, *"},{id:"evaluate-prefix",seq:"08",title:"Evaluate Prefix Expression",leetcode:"N/A",difficulty:"Medium",description:"Evaluate prefix expressions by scanning from right to left, storing operands, and computing results on operators.",keyInsight:'Scan from right-to-left. Push operands to stack. On operator, pop top two operands (op1 then op2), evaluate "op1 operator op2", and push result.',defaultInput:"*, +, 2, 3, 4",inputType:"array",inputPlaceholder:"e.g. *, +, 2, 3, 4"},{id:"postfix-to-infix",seq:"09",title:"Postfix to Infix Conversion",leetcode:"N/A",difficulty:"Medium",description:"Convert postfix expressions back to readable infix expressions with appropriate parentheses formatting.",keyInsight:'Push operands to stack. When an operator is met, pop two operand strings (op2, then op1), wrap them with the operator inside "(op1 op op2)", and push back.',defaultInput:"a, b, c, *, +",inputType:"array",inputPlaceholder:"e.g. a, b, c, *, +"},{id:"prefix-to-infix",seq:"10",title:"Prefix to Infix Conversion",leetcode:"N/A",difficulty:"Medium",description:"Convert prefix expressions back to standard parenthesized infix expressions scanning right-to-left.",keyInsight:'Scan right-to-left. Push operands to stack. On operator, pop top two operands (op1 then op2), push the parenthesized string "(op1 op op2)" back.',defaultInput:"-, +, a, *, b, c, d",inputType:"array",inputPlaceholder:"e.g. +, a, *, b, c"},{id:"basic-calculator",seq:"11",title:"Basic Calculator (Infix with Parens)",leetcode:"LC #224",difficulty:"Hard",description:"Evaluate a mathematical expression containing integers, signs (+, -), and parentheses.",keyInsight:"Maintain a running result and sign. Push result and sign onto stack when opening parentheses is met. Pop and merge them upon closing parentheses.",defaultInput:"1 + (4 + 5 + 2) - 3",inputType:"text",inputPlaceholder:"e.g. (1+(4+5+2)-3)+(6+8)"},{id:"next-greater-element",seq:"12",title:"Next Greater Element I & II",leetcode:"LC #503",difficulty:"Medium",description:"Find the next greater element for each item in a circular array. Monotonic decreasing stack tracks index bounds.",keyInsight:"Scan circular array twice. Use a monotonic decreasing stack storing indices. Pop indices when the current element exceeds the stack top element.",defaultInput:"1, 2, 1",inputType:"array",inputPlaceholder:"e.g. 1, 2, 1"},{id:"daily-temperatures",seq:"13",title:"Daily Temperatures",leetcode:"LC #739",difficulty:"Medium",description:"Given an array of daily temperatures, find how many days you have to wait for a warmer temperature.",keyInsight:"Maintain a monotonic decreasing stack of indices. When current temp is higher than stack top, pop the top and calculate waiting days: `current_index - popped_index`.",defaultInput:"73, 74, 75, 71, 69, 72, 76, 73",inputType:"array",inputPlaceholder:"e.g. 73, 74, 75, 71, 69, 72, 76, 73"},{id:"online-stock-span",seq:"14",title:"Online Stock Span",leetcode:"LC #901",difficulty:"Medium",description:"Calculate the span of a stock price: the maximum number of consecutive days prior to today where the price was less than or equal to today.",keyInsight:"Maintain a monotonic decreasing stack of pairs `(price, span)`. If current price is >= stack top, pop it and add its span to your current span, then push.",defaultInput:"100, 80, 60, 70, 60, 75, 85",inputType:"array",inputPlaceholder:"e.g. 100, 80, 60, 70, 60, 75, 85"},{id:"largest-rectangle",seq:"15",title:"Largest Rectangle in Histogram",leetcode:"LC #84",difficulty:"Hard",description:"Find the area of the largest rectangle that can be formed within a given histogram bar height array.",keyInsight:"Maintain a monotonic increasing stack of indices. If current height is less than stack top, pop the top. The popped bar is the height, and width is bounded by current index and new stack top.",defaultInput:"2, 1, 5, 6, 2, 3",inputType:"array",inputPlaceholder:"e.g. 2, 1, 5, 6, 2, 3"},{id:"maximal-rectangle",seq:"16",title:"Maximal Rectangle",leetcode:"LC #85",difficulty:"Hard",description:"Find the largest rectangle containing only 1s in a 2D binary matrix. Reduces to 1D Histogram calculation on each row.",keyInsight:"Convert matrix rows into successive histogram bars (adding 1 to height if cell is 1, resetting to 0 if 0). Run the Largest Rectangle in Histogram algorithm on each row.",defaultInput:"1 0 1 0 0 | 1 0 1 1 1 | 1 1 1 1 1 | 1 0 0 1 0",inputType:"text",inputPlaceholder:"Use | for rows: e.g. 1 0 1 | 1 1 1"},{id:"trapping-rain-water",seq:"17",title:"Trapping Rain Water",leetcode:"LC #42",difficulty:"Hard",description:"Compute how much water can be trapped after raining over an elevation map represented by an array.",keyInsight:'Using a monotonic decreasing stack. When a bar is higher than stack top, the top is a popped "valley". The new stack top and current bar form the container boundaries.',defaultInput:"0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1",inputType:"array",inputPlaceholder:"e.g. 0, 1, 0, 2, 1, 0, 1, 3"},{id:"asteroid-collision",seq:"18",title:"Asteroid Collision",leetcode:"LC #735",difficulty:"Medium",description:"Simulate the final state of asteroids moving left (negative) and right (positive) at stable speeds.",keyInsight:"A collision only happens if stack top moves right (+) and the incoming asteroid moves left (-). Pop the smaller asteroid, or handle annihilation if equal.",defaultInput:"5, 10, -5",inputType:"array",inputPlaceholder:"e.g. 10, 2, -5"},{id:"remove-k-digits",seq:"19",title:"Remove K Digits",leetcode:"LC #402",difficulty:"Medium",description:"Remove k digits from a non-negative integer represented as a string to make the remaining number as small as possible.",keyInsight:"Greedily maintain a monotonic increasing stack of digits. If current digit is smaller than stack top, pop the stack top and decrement k.",defaultInput:"1432219, k=3",inputType:"text",inputPlaceholder:"e.g. 1432219, k=3"}],be=({currentProblem:u,onProblemSelect:p,onCustomPush:f,onCustomPop:g,onCustomClear:r,customActive:b})=>{const[m,k]=$.useState(""),i=I.findIndex(a=>a.id===u.id),t=()=>{i>0&&p(I[i-1].id)},n=()=>{i<I.length-1&&p(I[i+1].id)},s=a=>{a.preventDefault(),m.trim()&&(f(m.trim()),k(""))};return e.jsxs("header",{className:"h-14 border-b border-slate-200 bg-[#FAF9F6] px-4 flex items-center justify-between shrink-0 select-none",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-800",children:e.jsx(X,{className:"w-4.5 h-4.5 stroke-[2.25]"})}),e.jsxs("div",{children:[e.jsxs("h1",{className:"font-serif text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none",children:["Stack Expression Engine",e.jsx("span",{className:"font-sans text-[10px] tracking-wider uppercase font-semibold text-amber-800 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-200/40",children:"Interactive"})]}),e.jsx("span",{className:"text-[10px] text-slate-500 font-sans tracking-tight",children:"Multi-Algorithm Visual Sandbox"})]})]}),e.jsxs("div",{className:"flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs",children:[e.jsx("button",{onClick:t,disabled:i===0,className:"p-1.5 rounded-md hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all",title:"Previous problem",id:"prev-prob-btn",children:e.jsx(W,{className:"w-4.5 h-4.5"})}),e.jsxs("select",{value:u.id,onChange:a=>p(a.target.value),className:"font-sans text-xs font-semibold text-slate-800 bg-transparent py-1 px-2 pr-8 border-0 focus:ring-0 cursor-pointer text-center",id:"problem-select-dropdown",children:[e.jsx("optgroup",{label:"📂 Stack Foundations & Dual Structures",className:"text-slate-500 font-bold bg-white text-left",children:I.filter(a=>Number(a.seq)<=4).map(a=>e.jsxs("option",{value:a.id,className:"text-slate-800 font-sans",children:["#",a.seq,": ",a.title," (",a.leetcode!=="N/A"?a.leetcode:"Foundations",")"]},a.id))}),e.jsx("optgroup",{label:"🧮 Expression Conversions & Evaluations",className:"text-slate-500 font-bold bg-white text-left",children:I.filter(a=>Number(a.seq)>=5&&Number(a.seq)<=11).map(a=>e.jsxs("option",{value:a.id,className:"text-slate-800 font-sans",children:["#",a.seq,": ",a.title," (",a.leetcode!=="N/A"?a.leetcode:"Foundations",")"]},a.id))}),e.jsx("optgroup",{label:"📈 Monotonic Stack Patterns",className:"text-slate-500 font-bold bg-white text-left",children:I.filter(a=>Number(a.seq)>=12).map(a=>e.jsxs("option",{value:a.id,className:"text-slate-800 font-sans",children:["#",a.seq,": ",a.title," (",a.leetcode!=="N/A"?a.leetcode:"Foundations",")"]},a.id))})]}),e.jsx("button",{onClick:n,disabled:i===I.length-1,className:"p-1.5 rounded-md hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all",title:"Next problem",id:"next-prob-btn",children:e.jsx(B,{className:"w-4.5 h-4.5"})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[b&&e.jsx("div",{className:"flex items-center gap-1.5 bg-amber-50/65 border border-amber-200/50 rounded-lg px-2 py-0.5 animate-pulse",children:e.jsx("span",{className:"text-[10px] font-sans text-amber-800 font-medium",children:"Custom Sandbox Active"})}),e.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5",children:[e.jsxs("form",{onSubmit:s,className:"flex items-center",children:[e.jsx("input",{type:"text",placeholder:"Custom item...",value:m,onChange:a=>k(a.target.value),className:"w-24 px-2 py-1 text-xs font-mono bg-transparent border-0 focus:ring-0 focus:outline-hidden",id:"custom-push-input"}),e.jsx("button",{type:"submit",className:"text-[11px] font-sans font-bold bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded transition-colors",id:"custom-push-btn",children:"Push"})]}),e.jsx("div",{className:"w-px h-5 bg-slate-200 mx-1"}),e.jsx("button",{onClick:g,className:"text-[11px] font-sans font-bold text-slate-700 hover:bg-slate-100 px-2.5 py-1 rounded transition-colors",id:"custom-pop-btn",children:"Pop"}),e.jsx("button",{onClick:r,className:"text-[11px] font-sans font-bold text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded transition-colors",id:"custom-clear-btn",children:"Clear"})]})]})]})},ve=({problem:u,inputValue:p,onInputChange:f,onReset:g,onSimulate:r})=>{const[b,m]=$.useState(!1),k=i=>{switch(i){case"Easy":return"bg-emerald-50 text-emerald-800 border-emerald-200/50";case"Medium":return"bg-amber-50 text-amber-800 border-amber-200/50";case"Hard":return"bg-rose-50 text-rose-800 border-rose-200/50"}};return e.jsxs("div",{className:"bg-white border-b border-slate-200 px-4 py-2 shrink-0 select-none",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"font-mono text-sm font-bold text-amber-800 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200/50",children:["#",u.seq]}),e.jsx("h2",{className:"font-serif text-lg font-bold text-slate-900 tracking-tight",children:u.title}),e.jsx("span",{className:`text-[11px] font-sans font-bold px-2 py-0.5 rounded-full border ${k(u.difficulty)}`,children:u.difficulty}),u.leetcode!=="N/A"&&e.jsx("span",{className:"text-[11px] font-sans font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200",children:u.leetcode})]}),e.jsx("button",{onClick:()=>m(!b),className:"text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs font-sans font-semibold transition-colors",id:"toggle-details-btn",children:b?e.jsxs(e.Fragment,{children:["Hide Details ",e.jsx(se,{className:"w-3.5 h-3.5"})]}):e.jsxs(e.Fragment,{children:["Problem Details ",e.jsx(ae,{className:"w-3.5 h-3.5"})]})})]}),b&&e.jsxs("div",{className:"mt-2 py-2 px-3 bg-slate-50 border border-slate-200/65 rounded-lg text-xs leading-relaxed text-slate-600 font-sans transition-all",children:[e.jsx("p",{className:"font-semibold text-slate-800 mb-1",children:"Description:"}),e.jsx("p",{className:"mb-2",children:u.description}),e.jsxs("p",{className:"font-semibold text-amber-800 mb-1 flex items-center gap-1",children:[e.jsx(_,{className:"w-3.5 h-3.5 text-amber-600 inline"})," Key Algorithmic Insight:"]}),e.jsx("p",{className:"text-amber-900",children:u.keyInsight})]}),e.jsxs("div",{className:"mt-2 flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F6] border border-slate-200/70 rounded-lg p-2",children:[e.jsxs("div",{className:"flex-1 min-w-[280px] flex items-center gap-2",children:[e.jsx("label",{className:"text-[11px] font-sans font-bold text-slate-600 shrink-0 uppercase tracking-wider",children:"Active Input:"}),e.jsxs("div",{className:"relative flex-1",children:[e.jsx("input",{type:"text",value:p,onChange:i=>f(i.target.value),placeholder:u.inputPlaceholder,className:"w-full font-mono text-xs text-slate-800 bg-white border border-slate-200 rounded-md py-1 px-2 pr-20 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-hidden",id:"active-testcase-input"}),e.jsx("span",{className:"absolute right-2 top-1.5 text-[9px] font-sans font-semibold text-slate-400 pointer-events-none uppercase tracking-tight",children:u.inputType==="array"?"Array (1D)":"Text String"})]})]}),e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsxs("button",{onClick:g,className:"flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-sans font-bold py-1 px-2.5 rounded-md transition-colors",title:"Reset to default values",id:"reset-testcase-btn",children:[e.jsx(U,{className:"w-3.5 h-3.5"}),"Reset Case"]}),e.jsxs("button",{onClick:r,className:"flex items-center gap-1 bg-amber-500 hover:bg-amber-600 border border-amber-200 hover:border-amber-400 text-amber-950 text-xs font-sans font-bold py-1 px-3 rounded-md transition-all shadow-xs",id:"simulate-btn",children:[e.jsx(G,{className:"fill-current w-3 h-3"}),"Simulate"]})]})]})]})},ke=({stack:u,secondaryStack:p,secondaryTitle:f="Auxiliary Stack"})=>{const g=Array.isArray(p),r=(b,m,k=!0)=>{const i=b.length===0;return e.jsxs("div",{className:"flex-1 flex flex-col items-center justify-end h-full min-h-0 select-none",children:[m&&e.jsx("div",{className:"mb-2 shrink-0",children:e.jsx("span",{className:"font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 border border-slate-200/65 px-2 py-0.5 rounded-full",children:m})}),e.jsxs("div",{className:"relative w-44 h-full max-h-[280px] bg-slate-50/50 border-l-[6px] border-r-[6px] border-b-[6px] border-slate-300/40 rounded-b-xl flex flex-col justify-end p-2 pb-1.5 shadow-inner",children:[i&&e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-sans text-xs gap-1 opacity-75",children:[e.jsx("span",{className:"text-[10px] font-mono",children:"[EMPTY]"}),e.jsx("span",{className:"tracking-tight",children:"Chamber Underflow"})]}),e.jsx("div",{className:"w-full flex flex-col-reverse gap-1.5 overflow-y-auto max-h-full pr-1 scrollbar-thin",children:e.jsx(ie,{initial:!1,children:b.map((t,n)=>{const s=n===b.length-1;return e.jsxs(re.div,{initial:{opacity:0,y:-60,scale:.9},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-40,scale:.8},transition:{type:"spring",stiffness:220,damping:18},className:`relative w-full h-9 rounded-md flex items-center justify-center border font-mono text-xs font-bold shadow-xs select-none transition-colors ${s?"bg-amber-500 text-amber-950 border-amber-400 font-extrabold ring-2 ring-amber-500/25":"bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`,children:[e.jsxs("span",{className:"absolute left-2 text-[9px] text-slate-400/80 font-sans select-none",children:["[",n,"]"]}),e.jsxs("div",{className:"flex flex-col items-center leading-none",children:[e.jsx("span",{className:"text-sm tracking-tight",children:t.value}),t.subValue&&e.jsx("span",{className:"text-[8.5px] font-medium font-sans opacity-70 mt-0.5",children:t.subValue})]}),s&&e.jsxs("div",{className:"absolute -right-16 flex items-center gap-1 bg-amber-500 text-amber-950 px-1.5 py-0.5 rounded text-[10px] font-sans font-bold shadow-xs",children:[e.jsx(J,{className:"w-3 h-3 animate-pulse"}),e.jsx("span",{children:"TOP"})]})]},t.id)})})})]}),e.jsx("div",{className:"mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 h-4",children:b.length>=8?e.jsxs("span",{className:"text-amber-700 font-sans font-bold flex items-center gap-1 animate-pulse",children:[e.jsx(ee,{className:"w-3.5 h-3.5"})," Overflow Warning"]}):e.jsxs("span",{children:["Size: ",b.length," / 8"]})})]})};return e.jsxs("div",{className:"flex items-center justify-center gap-8 w-full h-full min-h-0 py-2",children:[r(u,g?"Main Stack":"Core Stack Chamber",!0),g&&r(p,f,!1)]})},ye=({tokens:u=[],outputString:p="",precedenceCompare:f,inputCursor:g})=>{const r=(b,m)=>{if(m)return"bg-amber-500 text-amber-950 border-amber-400 ring-2 ring-amber-500/20 font-extrabold scale-110";switch(b){case"operand":return"bg-indigo-50 text-indigo-800 border-indigo-100 font-bold";case"operator":return"bg-amber-50 text-amber-800 border-amber-100 font-bold";case"parenthesis":return"bg-slate-50 text-slate-800 border-slate-200/70 font-semibold";default:return"bg-slate-50 text-slate-500 border-slate-100"}};return e.jsxs("div",{className:"w-full flex flex-col gap-4 select-none h-full justify-center",children:[e.jsxs("div",{className:"flex flex-col gap-1.5 shrink-0",children:[e.jsx("span",{className:"font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider",children:"Token Stream Ribbon"}),e.jsx("div",{className:"w-full h-12 bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-1.5 overflow-x-auto shadow-inner",children:u.length===0?e.jsx("span",{className:"text-xs text-slate-400 italic",children:"No expression loaded"}):u.map((b,m)=>{const k=m===g,i=m<g;return e.jsxs("div",{className:"flex items-center shrink-0",children:[e.jsx("div",{className:`h-8 min-w-[32px] px-2 rounded-md flex items-center justify-center border font-mono text-xs transition-all duration-200 ${r(b.type,k)} ${i?"opacity-40 line-through decoration-slate-300":""}`,children:b.value}),m<u.length-1&&e.jsx(te,{className:"w-3 h-3 text-slate-300 mx-0.5 shrink-0"})]},m)})})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0",children:[e.jsxs("div",{className:"bg-white border border-slate-200/80 rounded-lg p-3 flex flex-col justify-between shadow-xs",children:[e.jsxs("div",{className:"flex items-center gap-1.5 mb-2 border-b border-slate-100 pb-1.5 shrink-0",children:[e.jsx(_,{className:"w-4 h-4 text-amber-600"}),e.jsx("span",{className:"font-sans text-xs font-bold text-slate-800",children:"Operator Precedence Matrix"})]}),f?e.jsxs("div",{className:"flex-1 flex flex-col justify-center text-xs font-sans gap-2",children:[e.jsxs("div",{className:"flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-mono",children:"Incoming Op"}),e.jsx("p",{className:"font-mono text-base font-bold text-indigo-700",children:f.op1}),e.jsxs("p",{className:"text-[10px] text-indigo-600",children:["Precedence: ",f.prec1]})]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800",children:f.result}),e.jsx("span",{className:"text-[14px] text-slate-400",children:"VS"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-mono",children:"Stack Top Op"}),e.jsx("p",{className:"font-mono text-base font-bold text-amber-700",children:f.op2}),e.jsxs("p",{className:"text-[10px] text-amber-600",children:["Precedence: ",f.prec2]})]})]}),e.jsx("div",{className:"text-[11px] leading-relaxed text-slate-600 italic border-l-2 border-amber-500 pl-2",children:f.reason})]}):e.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center text-slate-400 font-sans text-xs italic gap-1",children:[e.jsx(oe,{className:"w-5 h-5 text-slate-300"}),e.jsx("span",{children:"No operator comparison active"})]})]}),e.jsxs("div",{className:"bg-amber-50/20 border border-amber-200/60 rounded-lg p-3 flex flex-col shadow-xs",children:[e.jsx("span",{className:"font-sans text-xs font-bold text-amber-800 mb-1",children:"Dijkstra's Shunting-Yard Guide"}),e.jsxs("ul",{className:"text-[11px] text-slate-600 space-y-1 font-sans leading-snug",children:[e.jsxs("li",{className:"flex items-start gap-1",children:[e.jsx("span",{className:"text-amber-600 font-bold",children:"•"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Operands"})," (a, b, c...) bypass the stack directly to the Output string."]})]}),e.jsxs("li",{className:"flex items-start gap-1",children:[e.jsx("span",{className:"text-amber-600 font-bold",children:"•"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Operators"})," pop the stack as long as the stack top operator has higher or equal precedence."]})]}),e.jsxs("li",{className:"flex items-start gap-1",children:[e.jsx("span",{className:"text-amber-600 font-bold",children:"•"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Parentheses"}),' enforce bounds. "(" is pushed unconditionally, while ")" pops elements until "(" matches.']})]})]})]})]}),e.jsxs("div",{className:"flex flex-col gap-1.5 shrink-0",children:[e.jsx("span",{className:"font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider",children:"Expression Output Ribbon"}),e.jsxs("div",{className:"w-full h-11 bg-slate-900 border border-slate-955 rounded-lg p-2.5 flex items-center justify-between shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 overflow-x-auto",children:[e.jsx("span",{className:"font-mono text-slate-400 text-xs select-none",children:"RESULT:"}),e.jsx("span",{className:"font-mono text-sm font-bold text-emerald-400 tracking-wider",children:p||"empty"})]}),e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-sans font-semibold text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20",children:[e.jsx(Z,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Synchronized"})]})]})]})]})},je=({problemId:u,data:p=[],inputCursor:f,stackIndices:g=[],histogramState:r,waterState:b,variables:m={}})=>{if(!p||p.length===0)return e.jsxs("div",{className:"w-full h-full flex flex-col items-center justify-center text-slate-400 font-sans text-xs italic gap-1 select-none",children:[e.jsx(me,{className:"w-6 h-6 text-slate-300"}),e.jsx("span",{children:"No numeric data to display"})]});const k=Math.max(...p,1),i=180,t=450,n=20,s=i-2*n,a=t-2*n,o=p.length,l=8,c=(a-(o-1)*l)/o,d=p.map((x,P)=>{const T=x/k*s,M=n+P*(c+l),A=i-n-T,w=P===f,R=g.includes(P);let O="fill-slate-200 stroke-slate-300";return u==="trapping-rain-water"?O="fill-slate-400 stroke-slate-500":w?O="fill-amber-500 stroke-amber-600":R&&(O="fill-indigo-400 stroke-indigo-500"),{value:x,index:P,x:M,y:A,width:c,height:T,colorClass:O,isActive:w,isInStack:R}});let h=null;if((u==="largest-rectangle"||u==="maximal-rectangle")&&r&&r.currentHeight>0&&r.leftBoundary!==void 0&&r.rightBoundary!==void 0){const x=n+r.leftBoundary*(c+l),T=n+r.rightBoundary*(c+l)+c-x,M=r.currentHeight/k*s,A=i-n-M;h=e.jsxs("g",{children:[e.jsx("rect",{x,y:A,width:T,height:M,className:"fill-amber-500/25 stroke-amber-600 stroke-[2] stroke-dasharray-[4]",style:{strokeDasharray:"4 3"}}),e.jsx("text",{x:x+T/2,y:Math.max(A-6,15),textAnchor:"middle",className:"font-sans text-[10px] font-bold fill-amber-800",children:`Area: ${r.currentHeight}H × ${r.currentWidth}W = ${r.currentArea}`})]})}let v=null;u==="trapping-rain-water"&&b&&b.trapped&&(v=b.trapped.map((x,P)=>{if(x<=0)return null;const M=p[P]/k*s,A=x/k*s,w=n+P*(c+l),R=i-n-M-A;return e.jsx("rect",{x:w,y:R,width:c,height:A,className:"fill-cyan-400/70 stroke-cyan-500/85 stroke-[1]"},`water-${P}`)}));const S=()=>{switch(u){case"daily-temperatures":return"Daily Temperature Heights (°F)";case"online-stock-span":return"Stock Price Timeline ($)";case"trapping-rain-water":return"Elevation Map (Grey) + Trapped Water (Blue)";case"largest-rectangle":case"maximal-rectangle":return"Histogram Bar Heights (Yellow: Active, Purple: Stack)";default:return"Monotonic Stack Bar Array"}};return e.jsxs("div",{className:"w-full flex flex-col justify-center select-none h-full gap-2",children:[e.jsxs("div",{className:"flex items-center justify-between shrink-0 px-1",children:[e.jsx("span",{className:"font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider",children:S()}),e.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-mono text-slate-400",children:[e.jsx(le,{className:"w-3.5 h-3.5 text-indigo-500"}),e.jsxs("span",{children:["Scaled Max: ",k]})]})]}),e.jsx("div",{className:"bg-white border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-center shadow-xs min-h-0 flex-1",children:e.jsxs("svg",{viewBox:`0 0 ${t} ${i}`,className:"w-full max-h-[220px] h-full",children:[e.jsx("line",{x1:n,y1:i-n,x2:t-n,y2:i-n,className:"stroke-slate-300 stroke-[1.5]"}),e.jsx("line",{x1:n,y1:n,x2:n,y2:i-n,className:"stroke-slate-300 stroke-[1]"}),d.map(x=>e.jsxs("g",{children:[e.jsx("rect",{x:x.x,y:x.y,width:x.width,height:x.height,rx:"2",className:`transition-all duration-200 ${x.colorClass}`}),e.jsx("text",{x:x.x+x.width/2,y:i-4,textAnchor:"middle",className:"font-mono text-[9px] fill-slate-400",children:x.index}),x.value>0&&e.jsx("text",{x:x.x+x.width/2,y:x.y-4,textAnchor:"middle",className:`font-mono text-[9px] font-semibold ${x.isActive?"fill-amber-800 font-bold":x.isInStack?"fill-indigo-800":"fill-slate-500"}`,children:x.value})]},x.index)),h,v]})})]})},q={"basic-stack":`// 01: Basic Stack Operations using std::stack
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
}`,"valid-parentheses":`// 02: Valid Parentheses (LeetCode #20)
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
}`,"min-stack":`// 03: Min Stack in O(1) (LeetCode #155)
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
};`,"queue-using-stacks":`// 04: Implement Queue using Stacks (LeetCode #232)
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
};`,"infix-to-postfix":`// 05: Infix to Postfix Conversion (Shunting-Yard)
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
}`,"infix-to-prefix":`// 06: Infix to Prefix Conversion
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
}`,"evaluate-postfix":`// 07: Evaluate Postfix (LeetCode #150 - Reverse Polish Notation)
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
}`,"evaluate-prefix":`// 08: Evaluate Prefix Expression
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
}`,"postfix-to-infix":`// 09: Postfix to Infix Conversion
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
}`,"prefix-to-infix":`// 10: Prefix to Infix Conversion
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
}`,"basic-calculator":`// 11: Basic Calculator (LeetCode #224)
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
}`,"next-greater-element":`// 12: Next Greater Element II (LeetCode #503)
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
}`,"daily-temperatures":`// 13: Daily Temperatures (LeetCode #739)
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
}`,"online-stock-span":`// 14: Online Stock Span (LeetCode #901)
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
};`,"largest-rectangle":`// 15: Largest Rectangle in Histogram (LeetCode #84)
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
}`,"maximal-rectangle":`// 16: Maximal Rectangle (LeetCode #85)
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
}`,"trapping-rain-water":`// 17: Trapping Rain Water (LeetCode #42)
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
}`,"asteroid-collision":`// 18: Asteroid Collision (LeetCode #735)
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
}`,"remove-k-digits":`// 19: Remove K Digits (LeetCode #402)
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
}`},Ne=({problemId:u,activeStep:p,variables:f={},stack:g=[],secondaryStack:r=[],logs:b=[]})=>{var o,l;const[m,k]=$.useState("cpp"),[i,t]=$.useState(!1),n=$.useRef(null);$.useEffect(()=>{n.current&&n.current.scrollIntoView({behavior:"smooth",block:"nearest"})},[p.line,m]);const s=()=>{const c=q[u]||"";navigator.clipboard.writeText(c),t(!0),setTimeout(()=>t(!1),2e3)},a=c=>typeof c=="object"&&c!==null?JSON.stringify(c):String(c);return e.jsxs("div",{className:"flex-1 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs",children:[e.jsxs("div",{className:"flex border-b border-slate-200 bg-[#FAF9F6] px-2 h-10 items-center justify-between shrink-0 select-none",children:[e.jsxs("div",{className:"flex gap-1",children:[e.jsxs("button",{onClick:()=>k("cpp"),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all ${m==="cpp"?"bg-white text-slate-900 border border-slate-200/60 shadow-xs":"text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`,children:[e.jsx(ce,{className:"w-3.5 h-3.5"}),"C++ Trace"]}),e.jsxs("button",{onClick:()=>k("inspector"),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all ${m==="inspector"?"bg-white text-slate-900 border border-slate-200/60 shadow-xs":"text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`,id:"state-inspector-tab",children:[e.jsx(de,{className:"w-3.5 h-3.5"}),"State Inspector"]}),e.jsxs("button",{onClick:()=>k("callstack"),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all ${m==="callstack"?"bg-white text-slate-900 border border-slate-200/60 shadow-xs":"text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`,children:[e.jsx(ge,{className:"w-3.5 h-3.5"}),"Variables & frames"]}),e.jsxs("button",{onClick:()=>k("log"),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all relative ${m==="log"?"bg-white text-slate-900 border border-slate-200/60 shadow-xs":"text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`,children:[e.jsx(pe,{className:"w-3.5 h-3.5"}),"Sim Logs",e.jsx("span",{className:"absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full"})]})]}),m==="cpp"&&e.jsx("button",{onClick:s,className:"p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors",title:"Copy C++ implementation",id:"copy-code-btn",children:i?e.jsx(Z,{className:"w-4 h-4 text-emerald-600"}):e.jsx(ue,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"flex-1 min-h-0 overflow-y-auto p-3 font-sans text-xs",children:[m==="cpp"&&e.jsx("div",{className:"font-mono text-[11px] leading-relaxed text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-200/50 overflow-x-auto h-full max-h-[340px] select-text",children:(q[u]||"// Snippet not found").split(`
`).map((c,d)=>{const h=d+1,v=h===p.line;return e.jsxs("div",{ref:v?n:null,className:`flex gap-3 px-1.5 py-0.5 rounded transition-all ${v?"bg-amber-100 border-l-[3px] border-amber-500 text-amber-950 font-bold":"border-l-[3px] border-transparent"}`,children:[e.jsx("span",{className:"w-6 text-right text-[10px] text-slate-400 select-none",children:h}),e.jsx("pre",{className:"whitespace-pre",children:c})]},d)})}),m==="inspector"&&e.jsxs("div",{className:"space-y-4 h-full min-h-0 select-none",children:[["infix-to-postfix","infix-to-prefix","postfix-to-infix","prefix-to-infix","basic-calculator"].includes(u)&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-sans font-bold text-slate-800 border-b border-slate-100 pb-1",children:"Expression Scraper State"}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 uppercase font-bold",children:"Scanned Token"}),e.jsx("p",{className:"font-mono text-sm font-bold text-indigo-700",children:((l=(o=p.inputTokens)==null?void 0:o[p.inputCursor])==null?void 0:l.value)||"EOF"})]}),e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 uppercase font-bold",children:"Stack Contents"}),e.jsxs("p",{className:"font-mono text-sm font-bold text-slate-800",children:["[",g.map(c=>c.value).join(", "),"]"]})]}),e.jsxs("div",{className:"col-span-2 bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 uppercase font-bold",children:"Output built so far"}),e.jsxs("p",{className:"font-mono text-sm font-bold text-emerald-700",children:['"',f.output||p.outputString||"",'"']})]})]})]}),["next-greater-element","daily-temperatures","online-stock-span","largest-rectangle","trapping-rain-water","remove-k-digits"].includes(u)&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-sans font-bold text-slate-800 border-b border-slate-100 pb-1",children:"Monotonic stack Invariant"}),e.jsxs("div",{className:"bg-amber-50/20 border border-amber-200/60 p-2.5 rounded-lg text-[11px] leading-relaxed text-slate-700",children:[e.jsx("p",{className:"font-semibold text-amber-900 mb-1",children:"Invariant constraint:"}),e.jsx("p",{className:"font-mono text-[10px] bg-white border border-slate-100 rounded px-1.5 py-0.5 inline-block mb-1 text-slate-800",children:u==="largest-rectangle"?"Stack stores indices of strictly increasing heights":"Stack stores indices of strictly decreasing values"}),e.jsxs("p",{className:"text-slate-600",children:["Values of indices in Stack: ",e.jsxs("span",{className:"font-mono text-indigo-700 font-bold",children:["[",g.map(c=>c.subValue||c.value).join(", "),"]"]})]})]})]}),(u==="largest-rectangle"||u==="maximal-rectangle")&&p.histogramState&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-sans font-bold text-slate-800 border-b border-slate-100 pb-1",children:"Histogram Rectangle Calculation"}),e.jsxs("div",{className:"grid grid-cols-2 gap-2 font-mono",children:[e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-sans font-bold",children:"Popped Height"}),e.jsx("p",{className:"text-sm font-bold text-slate-800",children:p.histogramState.currentHeight})]}),e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-sans font-bold",children:"Calculated Width"}),e.jsx("p",{className:"text-sm font-bold text-slate-800",children:p.histogramState.currentWidth})]}),e.jsxs("div",{className:"col-span-2 bg-slate-50 p-2 rounded border border-slate-200/50 flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-sans font-bold",children:"Calculated Area"}),e.jsxs("p",{className:"text-base font-bold text-indigo-700",children:[p.histogramState.currentHeight," × ",p.histogramState.currentWidth," = ",p.histogramState.currentArea]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-sans font-bold",children:"Max Area Record"}),e.jsx("p",{className:"text-base font-bold text-emerald-600",children:p.histogramState.maxArea})]})]})]})]}),u==="trapping-rain-water"&&p.waterState&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-sans font-bold text-slate-800 border-b border-slate-100 pb-1",children:"Water Volume Calculation"}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-sans uppercase font-bold",children:"Left boundary idx"}),e.jsx("p",{className:"font-mono text-sm font-bold text-slate-800",children:p.waterState.currentLeft})]}),e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-sans uppercase font-bold",children:"Right boundary idx"}),e.jsx("p",{className:"font-mono text-sm font-bold text-slate-800",children:p.waterState.currentRight})]}),e.jsxs("div",{className:"col-span-2 bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[10px] text-slate-400 font-sans uppercase font-bold",children:"Total Trapped Water Volume"}),e.jsxs("p",{className:"font-mono text-base font-bold text-cyan-600",children:[p.waterState.totalWater," units"]})]})]})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("h4",{className:"font-sans font-bold text-slate-800 border-b border-slate-100 pb-1",children:"Active Snapshot State"}),e.jsxs("div",{className:"grid grid-cols-2 gap-2 font-mono",children:[e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[9px] text-slate-400 font-sans font-bold",children:"Stack Top Peek"}),e.jsx("p",{className:"text-xs font-bold text-slate-800",children:g.length>0?a(g[g.length-1].value):"None (Underflow)"})]}),e.jsxs("div",{className:"bg-slate-50 p-2 rounded border border-slate-200/50",children:[e.jsx("p",{className:"text-[9px] text-slate-400 font-sans font-bold",children:"Stack Size"}),e.jsxs("p",{className:"text-xs font-bold text-slate-800",children:[g.length," elements"]})]})]})]})]}),m==="callstack"&&e.jsxs("div",{className:"space-y-3 select-none",children:[e.jsx("h4",{className:"font-sans font-bold text-slate-800 border-b border-slate-100 pb-1",children:"Active Scope Variables"}),e.jsx("div",{className:"bg-slate-50 border border-slate-200/55 rounded-lg overflow-hidden",children:e.jsxs("table",{className:"w-full text-left font-mono text-[10.5px]",children:[e.jsx("thead",{className:"bg-slate-100/70 text-slate-500 font-sans text-[9.5px]",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-2 font-bold uppercase tracking-wider",children:"Variable"}),e.jsx("th",{className:"p-2 font-bold uppercase tracking-wider",children:"Value"})]})}),e.jsxs("tbody",{className:"divide-y divide-slate-100",children:[Object.entries(f).map(([c,d])=>e.jsxs("tr",{className:"hover:bg-slate-50",children:[e.jsx("td",{className:"p-2 text-indigo-700 font-semibold",children:c}),e.jsx("td",{className:"p-2 text-slate-700",children:a(d)})]},c)),Object.keys(f).length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:2,className:"p-2 text-slate-400 italic text-center font-sans",children:"No variables tracked in current state frame"})})]})]})})]}),m==="log"&&e.jsx("div",{className:"space-y-2 h-full max-h-[340px] overflow-y-auto select-none",children:b.length===0?e.jsx("p",{className:"text-slate-400 italic text-center py-4",children:"No simulation steps tracked"}):e.jsx("div",{className:"space-y-1.5 font-mono text-[10.5px]",children:b.map((c,d)=>e.jsxs("div",{className:`p-1.5 rounded flex items-start gap-2 leading-relaxed ${d===b.length-1?"bg-amber-500/10 text-slate-900 border-l-[3px] border-amber-500 font-bold":"bg-slate-50 text-slate-500 hover:text-slate-800"}`,children:[e.jsxs("span",{className:"text-slate-300 font-sans select-none",children:[d+1,"."]}),e.jsx("span",{children:c})]},d))})})]})]})},we=({currentStepIndex:u,totalSteps:p,isPlaying:f,speed:g,activeDescription:r,onStepIndexChange:b,onPlayPauseToggle:m,onStepForward:k,onStepBackward:i,onReset:t,onSpeedChange:n})=>e.jsxs("div",{className:"bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 select-none shrink-0 shadow-xs",children:[e.jsxs("div",{className:"bg-amber-500/10 border border-amber-200/50 rounded-lg p-2.5 min-h-[50px] flex items-center gap-2.5",children:[e.jsx("div",{className:"w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 border border-amber-200",children:e.jsx(he,{className:"w-3 h-3 text-amber-800"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"text-[10px] font-sans font-bold text-amber-900 uppercase tracking-wider leading-none mb-0.5",children:"Operational Action"}),e.jsx("p",{className:"font-sans text-[11.5px] font-semibold text-slate-800 leading-snug",children:r||"Simulation idle. Click simulate to begin."})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("span",{className:"font-mono text-[10px] text-slate-400 select-none shrink-0",children:["Step ",u," / ",p-1>=0?p-1:0]}),e.jsx("input",{type:"range",min:0,max:p-1>=0?p-1:0,value:u,onChange:s=>b(Number(s.target.value)),className:"flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500",id:"simulation-scrubber"}),e.jsx("div",{className:"flex gap-1 shrink-0",children:[.5,1,2].map(s=>e.jsxs("button",{onClick:()=>n(s),className:`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${g===s?"bg-slate-900 text-white border-slate-900":"bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`,id:`speed-btn-${s}x`,children:[s,"x"]},s))})]}),e.jsxs("div",{className:"flex items-center justify-between border-t border-slate-100 pt-2 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsxs("button",{onClick:i,disabled:u===0||p<=1,className:"flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all",title:"Step Backward (Left Arrow)",id:"step-back-btn",children:[e.jsx(W,{className:"w-4 h-4"}),e.jsx("span",{className:"text-[8px] font-sans font-medium text-slate-400 mt-0.5 uppercase",children:"[←]"})]}),e.jsxs("button",{onClick:m,disabled:p<=1,className:`flex flex-col items-center justify-center px-4 py-2 rounded-lg border text-white transition-all ${f?"bg-slate-800 hover:bg-slate-700 border-slate-800 hover:border-slate-700":"bg-amber-500 hover:bg-amber-600 border-amber-400 hover:border-amber-500 text-amber-950 font-extrabold shadow-sm"} disabled:opacity-40 disabled:hover:bg-transparent`,title:"Play / Pause (Spacebar)",id:"play-pause-btn",children:[f?e.jsx(ne,{className:"w-4 h-4 fill-current"}):e.jsx(G,{className:"w-4 h-4 fill-current"}),e.jsx("span",{className:`text-[8px] font-sans mt-0.5 uppercase ${f?"text-slate-400":"text-amber-900"}`,children:"[Space]"})]}),e.jsxs("button",{onClick:k,disabled:u===p-1||p<=1,className:"flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all",title:"Step Forward (Right Arrow)",id:"step-forward-btn",children:[e.jsx(B,{className:"w-4 h-4"}),e.jsx("span",{className:"text-[8px] font-sans font-medium text-slate-400 mt-0.5 uppercase",children:"[→]"})]})]}),e.jsxs("button",{onClick:t,className:"flex flex-col items-center justify-center p-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all",title:"Reset simulation (R)",id:"sim-reset-btn",children:[e.jsx(U,{className:"w-4 h-4 text-slate-500"}),e.jsx("span",{className:"text-[8px] font-sans font-medium text-slate-400 mt-0.5 uppercase",children:"Reset [R]"})]})]})]}),y=()=>Math.random().toString(36).substring(2,9);function F(u){return u==="^"?3:u==="*"||u==="/"?2:u==="+"||u==="-"?1:-1}function L(u){const p=[];for(let f=0;f<u.length;f++){const g=u[f];if(g===" ")continue;let r="unknown";/[a-zA-Z0-9]/.test(g)?r="operand":["+","-","*","/","^"].includes(g)?r="operator":(g==="("||g===")")&&(r="parenthesis"),p.push({value:g,type:r,isScanned:!1,isActive:!1})}return p}function C(u){return u.split(/[,,|\s]+/).map(p=>p.trim()).filter(p=>p.length>0)}function $e(u,p){var b,m,k;const f=[],g=[],r=(i,t,n,s,a,o={},l={})=>{g.push(i);const c=n.map(h=>({...h})),d=a?a.map((h,v)=>({...h,isScanned:v<s,isActive:v===s})):void 0;f.push({stepIndex:f.length,description:i,line:t,stack:c,inputTokens:d,inputCursor:s,variables:o,logs:[...g],...l})};switch(u){case"basic-stack":{const i=C(p),t=[];r("Initialize empty stack",5,[],-1,void 0,{size:0,isEmpty:!0});for(let n=0;n<i.length;n++){const s=i[n];t.push({id:y(),value:s}),r(`Push "${s}" onto stack`,9+n,t,n,void 0,{size:t.length,isEmpty:!1,top:s})}if(t.length>0){const n=t[t.length-1].value;r(`Inspect Stack Top: "${n}"`,13,t,-1,void 0,{size:t.length,isEmpty:!1,top:n}),r(`Inspect Stack Size: ${t.length}`,14,t,-1,void 0,{size:t.length,isEmpty:!1,top:n});const s=t.pop();r(`Pop element from stack (removed "${s==null?void 0:s.value}")`,17,t,-1,void 0,{size:t.length,isEmpty:t.length===0,top:t.length>0?t[t.length-1].value:"None",popped:s==null?void 0:s.value})}r(`Final check: stack is ${t.length===0?"empty":"not empty"}`,19,t,-1,void 0,{size:t.length,isEmpty:t.length===0});break}case"valid-parentheses":{const i=L(p),t=[];r("Initialize empty stack to track matching brackets",6,[],0,i,{isValid:!0});let n=!0;for(let s=0;s<i.length;s++){const a=i[s].value;if(r(`Scan bracket: "${a}"`,7,t,s,i,{isValid:n}),a==="("||a==="{"||a==="[")t.push({id:y(),value:a}),r(`Push opening bracket "${a}" to stack`,9,t,s,i,{isValid:n});else{if(t.length===0){n=!1,r(`Error: Found closing bracket "${a}" with an empty stack (Underflow)`,11,t,s,i,{isValid:!1});break}const o=t[t.length-1].value;if(a===")"&&o==="("||a==="}"&&o==="{"||a==="]"&&o==="[")t.pop(),r(`Matched: Popped "${o}" matching with "${a}"`,16,t,s,i,{isValid:!0,popped:o});else{n=!1,r(`Mismatch: Bracket "${a}" does not match the top element "${o}"`,19,t,s,i,{isValid:!1});break}}}if(n){const s=t.length===0;r(`Final evaluation: stack is ${s?"empty":"not empty"} -> returns ${s?"TRUE (Valid)":"FALSE (Invalid)"}`,23,t,i.length,i,{isValid:s})}break}case"min-stack":{const i=C(p).map(Number),t=[],n=[];r("Initialize main stack and O(1) auxiliary Min Stack",8,[],-1,void 0,{minVal:"None"});for(let s=0;s<i.length;s++){const a=i[s];let o=a;if(n.length>0){const l=n[n.length-1].value;o=Math.min(a,l)}t.push({id:y(),value:a,subValue:o}),n.push({id:y(),value:o}),r(`Push element: ${a}. Calculated min: min(${a}, ${n.length>1?n[n.length-2].value:"None"}) = ${o}`,13,t,s,void 0,{minVal:o,top:a},{secondaryStack:n})}if(t.length>0){r(`Call top(): returns top of value stack = ${t[t.length-1].value}`,28,t,-1,void 0,{minVal:n[n.length-1].value,top:t[t.length-1].value},{secondaryStack:n}),r(`Call getMin(): returns top of Min Stack = ${n[n.length-1].value}`,32,t,-1,void 0,{minVal:n[n.length-1].value,top:t[t.length-1].value},{secondaryStack:n});const s=t.pop();n.pop(),r(`Call pop(): removes top from both stacks (${s==null?void 0:s.value} popped)`,23,t,-1,void 0,{minVal:n.length>0?n[n.length-1].value:"None",top:t.length>0?t[t.length-1].value:"None"},{secondaryStack:n})}break}case"queue-using-stacks":{const i=C(p),t=[],n=[];r("Initialize dual stacks: inStack (push) and outStack (pop)",6,[],-1,void 0,{activeAction:"init"},{secondaryStack:[]});for(let a=0;a<i.length;a++){const o=i[a];t.push({id:y(),value:o}),r(`Push element "${o}" to inStack`,25,t,a,void 0,{activeAction:`push(${o})`},{secondaryStack:n})}for(r("Request pop() from Queue: outStack is empty, triggering reversal transfer",29,t,-1,void 0,{activeAction:"pop_start"},{secondaryStack:n});t.length>0;){const a=t.pop();r(`Transfer step: Pop "${a.value}" from top of inStack`,13,t,-1,void 0,{activeAction:"transfer_pop",popped:a.value},{secondaryStack:n}),n.push({id:y(),value:a.value}),r(`Transfer step: Push "${a.value}" to outStack`,14,t,-1,void 0,{activeAction:"transfer_push",pushed:a.value},{secondaryStack:n})}const s=n.pop();r(`Pop complete: Pop top of outStack ("${s.value}" is returned in FIFO order!)`,31,t,-1,void 0,{activeAction:"pop_complete",returned:s.value},{secondaryStack:n});break}case"infix-to-postfix":{const i=L(p),t=[];let n="";r("Initialize Shunting-Yard operator stack and empty output buffer",12,[],0,i,{output:n});for(let s=0;s<i.length;s++){const a=i[s],o=a.value;if(a.type==="operand")n+=o,r(`Operand "${o}": Append directly to Output`,16,t,s+1,i,{output:n});else if(o==="(")t.push({id:y(),value:"("}),r('Opening bracket "(": Push directly to operator stack',18,t,s+1,i,{output:n});else if(o===")"){for(r('Closing bracket ")": Pop operator stack to output until matching "(" is found',20,t,s+1,i,{output:n});t.length>0&&t[t.length-1].value!=="(";){const l=t.pop();n+=l.value,r(`Pop operator "${l.value}" and append to output`,21,t,s+1,i,{output:n})}t.length>0&&t[t.length-1].value==="("&&(t.pop(),r('Match found: Pop and discard matching "("',24,t,s+1,i,{output:n}))}else if(a.type==="operator"){const l=F(o);for(;t.length>0;){const c=t[t.length-1].value,d=F(c),h=d>=l,v=`Precedence comparison: top "${c}" (${d}) >= incoming "${o}" (${l})`,S={op1:o,op2:c,prec1:l,prec2:d,result:h?"pop":"push",reason:v};if(h){const x=t.pop();n+=x.value,r(`Pop "${x.value}" due to higher or equal precedence (prec("${x.value}") >= prec("${o}"))`,26,t,s,i,{output:n},{precedenceCompare:S})}else break}t.push({id:y(),value:o}),r(`Push operator "${o}" onto stack`,29,t,s+1,i,{output:n})}}if(t.length>0)for(r("Expression scanning completed. Pop all remaining operators in stack",33,t,i.length,i,{output:n});t.length>0;){const s=t.pop();n+=s.value,r(`Pop remaining operator "${s.value}" to Output`,34,t,i.length,i,{output:n})}r(`Postfix conversion completed successfully. Result: "${n}"`,37,t,i.length,i,{output:n});break}case"infix-to-prefix":{const i=L(p);r(`Infix to Prefix: Start by reversing the input: "${p}"`,13,[],0,i,{phase:"Reverse Input",output:""});const t=p.split("").reverse().map(l=>l==="("?")":l===")"?"(":l).join(""),n=L(t);r(`Reversed expression with swapped parentheses: "${t}"`,17,[],0,n,{phase:"reversed",output:""});const s=[];let a="";for(let l=0;l<n.length;l++){const c=n[l],d=c.value;if(c.type==="operand")a+=d,r(`Operand "${d}": Append to postfix ribbon`,26,s,l+1,n,{phase:"shunting_yard",output:a});else if(d==="(")s.push({id:y(),value:"("}),r('Push "(" onto stack',28,s,l+1,n,{phase:"shunting_yard",output:a});else if(d===")"){for(;s.length>0&&s[s.length-1].value!=="(";){const h=s.pop();a+=h.value,r(`Pop "${h.value}" to postfix ribbon`,31,s,l+1,n,{phase:"shunting_yard",output:a})}s.pop(),r("Discard matching parenthesized pairing",34,s,l+1,n,{phase:"shunting_yard",output:a})}else if(c.type==="operator"){const h=F(d);for(;s.length>0;){const v=s[s.length-1].value;if(F(v)>h){const x=s.pop();a+=x.value,r(`Pop higher precedence operator "${x.value}"`,37,s,l,n,{phase:"shunting_yard",output:a})}else break}s.push({id:y(),value:d}),r(`Push operator "${d}"`,40,s,l+1,n,{phase:"shunting_yard",output:a})}}for(;s.length>0;){const l=s.pop();a+=l.value,r(`Pop remaining operator "${l.value}" to postfix ribbon`,44,s,n.length,n,{phase:"shunting_yard",output:a})}const o=a.split("").reverse().join("");r(`Final Prefix result: reverse intermediate postfix "${a}" -> "${o}"`,48,[],n.length,n,{phase:"Reverse Output",output:o});break}case"evaluate-postfix":{const i=C(p),t=[],n=i.map(s=>{const a=["+","-","*","/","^"].includes(s);return{value:s,type:a?"operator":"operand",isScanned:!1,isActive:!1}});r("Initialize numerical evaluation stack",7,[],0,n);for(let s=0;s<n.length;s++){const a=n[s];if(a.type==="operand"){const o=Number(a.value);t.push({id:y(),value:o}),r(`Operand "${o}": Push onto stack`,16,t,s+1,n)}else{const o=t.pop(),l=t.pop(),c=Number(o.value),d=Number(l.value);let h=0;switch(a.value){case"+":h=d+c;break;case"-":h=d-c;break;case"*":h=d*c;break;case"/":h=Math.floor(d/c);break;case"^":h=Math.pow(d,c);break}t.push({id:y(),value:h}),r(`Operator "${a.value}": Pop operands (${d}, ${c}), evaluate "${d} ${a.value} ${c}" = ${h}, push result back`,11,t,s+1,n,{op1:d,op2:c,result:h})}}r(`Evaluation completed. Output: ${t[t.length-1].value}`,18,t,n.length,n);break}case"evaluate-prefix":{const i=C(p),t=[],n=i.map(s=>{const a=["+","-","*","/","^"].includes(s);return{value:s,type:a?"operator":"operand",isScanned:!1,isActive:!1}});r("Initialize numerical evaluation stack (Prefix evaluates Right-to-Left)",7,[],n.length,n);for(let s=n.length-1;s>=0;s--){const a=n[s];if(a.type==="operand"){const o=Number(a.value);t.push({id:y(),value:o}),r(`Operand "${o}": Push onto stack`,18,t,s,n)}else{const o=t.pop(),l=t.pop(),c=Number(o.value),d=Number(l.value);let h=0;switch(a.value){case"+":h=c+d;break;case"-":h=c-d;break;case"*":h=c*d;break;case"/":h=Math.floor(c/d);break;case"^":h=Math.pow(c,d);break}t.push({id:y(),value:h}),r(`Operator "${a.value}": Pop operands (${c}, ${d}), evaluate "${c} ${a.value} ${d}" = ${h}, push result back`,12,t,s,n,{op1:c,op2:d,result:h})}}r(`Evaluation completed. Output: ${t[t.length-1].value}`,20,t,0,n);break}case"postfix-to-infix":{const i=C(p),t=[],n=i.map(s=>{const a=["+","-","*","/","^"].includes(s);return{value:s,type:a?"operator":"operand",isScanned:!1,isActive:!1}});r("Initialize postfix-to-infix conversion stack of expressions",7,[],0,n);for(let s=0;s<n.length;s++){const a=n[s];if(a.type==="operand")t.push({id:y(),value:a.value}),r(`Operand "${a.value}": Push onto stack`,14,t,s+1,n);else{const o=t.pop(),c=`(${t.pop().value} ${a.value} ${o.value})`;t.push({id:y(),value:c}),r(`Operator "${a.value}": Pop two elements, wrap with operator as "${c}", push back`,10,t,s+1,n)}}r(`Infix translation completed. Result: "${((b=t[t.length-1])==null?void 0:b.value)||""}"`,16,t,n.length,n);break}case"prefix-to-infix":{const i=C(p),t=[],n=i.map(s=>{const a=["+","-","*","/","^"].includes(s);return{value:s,type:a?"operator":"operand",isScanned:!1,isActive:!1}});r("Initialize prefix-to-infix conversion stack (scanning Right-to-Left)",7,[],n.length,n);for(let s=n.length-1;s>=0;s--){const a=n[s];if(a.type==="operand")t.push({id:y(),value:a.value}),r(`Operand "${a.value}": Push onto stack`,18,t,s,n);else{const o=t.pop(),l=t.pop(),c=`(${o.value} ${a.value} ${l.value})`;t.push({id:y(),value:c}),r(`Operator "${a.value}": Pop two elements, wrap with operator as "${c}", push back`,12,t,s,n)}}r(`Infix translation completed. Result: "${((m=t[t.length-1])==null?void 0:m.value)||""}"`,20,t,0,n);break}case"basic-calculator":{const i=L(p),t=[];let n=0,s=0,a=1;r("Initialize dynamic calculation state: result = 0, sign = 1",6,[],0,i,{result:n,sign:a,number:s});for(let l=0;l<i.length;l++){const c=i[l],d=c.value;if(c.type==="operand"&&/[0-9]/.test(d))s=10*s+Number(d),r(`Build number digit-by-digit: number = ${s}`,12,t,l+1,i,{result:n,sign:a,number:s});else if(d==="+"){const h=n;n+=a*s,r(`Operator "+": Add prior number (${a} * ${s}) to result: ${h} -> ${n}`,15,t,l+1,i,{result:n,sign:1,number:0}),a=1,s=0}else if(d==="-"){const h=n;n+=a*s,r(`Operator "-": Add prior number (${a} * ${s}) to result: ${h} -> ${n}`,19,t,l+1,i,{result:n,sign:-1,number:0}),a=-1,s=0}else if(d==="(")t.push({id:y(),value:n,subValue:"result"}),t.push({id:y(),value:a,subValue:"sign"}),r(`Parenthesis "(": Push running result (${n}) and sign (${a}) onto stack, reset context`,22,t,l+1,i,{result:0,sign:1,number:0}),n=0,a=1;else if(d===")"){n+=a*s,r(`Parenthesis ")": Close current nested group, calculate inner result = ${n}`,26,t,l+1,i,{result:n,sign:a,number:0}),s=0;const h=t.pop().value,v=t.pop().value,S=n*h+v;r(`Merge scopes: Pop sign (${h}) & prior result (${v}) -> new result = (${n} * ${h}) + ${v} = ${S}`,28,t,l+1,i,{result:S,sign:1,number:0}),n=S}}const o=n+a*s;r(`Finalize: Add last digit grouping -> Output Result = ${o}`,32,t,i.length,i,{result:o,sign:a,number:0});break}case"next-greater-element":{const i=C(p).map(Number),t=i.length,n=Array(t).fill(-1),s=[];r("Initialize empty monotonic decreasing index stack and result array filled with -1",6,[],0,void 0,{res:[...n]});for(let a=0;a<2*t;a++){const o=a%t;for(r(`Inspect element at index ${o} (value: ${i[o]}) in loop iteration ${a+1}/${2*t}`,11,s,o,void 0,{res:[...n],idx:o,value:i[o],stackVals:s.map(l=>i[l.value])});s.length>0;){const l=s[s.length-1].value;if(i[l]<i[o])n[l]=i[o],s.pop(),r(`Monotonic condition breached: nums[${l}] (${i[l]}) < current (${i[o]}). Pop index ${l} and record Next Greater = ${i[o]}`,13,s,o,void 0,{res:[...n],idx:o,value:i[o],poppedIndex:l,stackVals:s.map(c=>i[c.value])});else break}a<t&&(s.push({id:y(),value:o,subValue:i[o]}),r(`Push index ${o} to stack (retains monotonic decreasing invariant)`,18,s,o,void 0,{res:[...n],idx:o,value:i[o],stackVals:s.map(l=>i[l.value])}))}r("Monotonic stack scanning completed. Final results calculated!",22,s,-1,void 0,{res:[...n]});break}case"daily-temperatures":{const i=C(p).map(Number),t=i.length,n=Array(t).fill(0),s=[];r("Initialize index stack and answer array with 0",6,[],0,void 0,{ans:[...n]});for(let a=0;a<t;a++){for(r(`Inspect temperature at day ${a}: ${i[a]}°F`,9,s,a,void 0,{ans:[...n],currentTemp:i[a]});s.length>0;){const o=s[s.length-1].value;if(i[a]>i[o])s.pop(),n[o]=a-o,r(`Warmer day found! ${i[a]}°F > ${i[o]}°F (day ${o}). Pop day ${o}. Wait time: ${a} - ${o} = ${n[o]} days`,11,s,a,void 0,{ans:[...n],currentTemp:i[a],poppedDay:o});else break}s.push({id:y(),value:a,subValue:i[a]}),r(`Push day ${a} onto monotonic decreasing stack`,14,s,a,void 0,{ans:[...n],currentTemp:i[a]})}r("Daily Temperatures completed. Output waiting arrays calculated!",17,s,-1,void 0,{ans:[...n]});break}case"online-stock-span":{const i=C(p).map(Number),t=[],n=[];r("Initialize StockSpanner with empty monotonic price stack",8,[],-1,void 0,{spans:[]});for(let s=0;s<i.length;s++){const a=i[s];let o=1;for(r(`New stock price incoming: $${a}`,13,t,s,void 0,{spans:[...n],price:a});t.length>0;){const l=t[t.length-1],c=l.value,d=l.subValue;if(c<=a)t.pop(),o+=d,r(`Pop stock $${c} from stack since it is <= $${a}. Accrue prior span: ${o-d} + ${d} = ${o}`,15,t,s,void 0,{spans:[...n],price:a,poppedPrice:c,poppedSpan:d});else break}t.push({id:y(),value:a,subValue:o}),n.push(o),r(`Push current price $${a} with accumulated span ${o} onto stack`,18,t,s,void 0,{spans:[...n],price:a,currentSpan:o})}break}case"largest-rectangle":{const i=C(p).map(Number),t=[];let n=0;const s=i.length;r("Initialize monotonic increasing index stack: maxArea = 0",7,[],0,void 0,{maxArea:n});for(let a=0;a<=s;a++){const o=a===s?0:i[a];for(r(`Step ${a}: Inspect boundary index ${a} (height: ${o})`,11,t,a,void 0,{maxArea:n,currentH:o});t.length>0;){const l=t[t.length-1].value;if(o<i[l]){t.pop();const c=i[l],d=t.length===0?a:a-t[t.length-1].value-1,h=c*d,v=n;n=Math.max(n,h);const S={currentWidth:d,currentHeight:c,currentArea:h,maxArea:n,activeIndices:[l],leftBoundary:t.length===0?0:t[t.length-1].value+1,rightBoundary:a-1};r(`Pop index ${l} (height ${c}). Width bounded by next stack top and index ${a} is ${d}. Area = ${c} * ${d} = ${h}. maxArea updated: max(${v}, ${h}) = ${n}`,13,t,a,void 0,{maxArea:n,activePop:l,currentH:o},{histogramState:S})}else break}a<s&&(t.push({id:y(),value:a,subValue:i[a]}),r(`Push index ${a} (height: ${i[a]}) onto monotonic increasing stack`,19,t,a,void 0,{maxArea:n,currentH:o}))}r(`Largest Rectangle calculation completed. Absolute Max Area: ${n}`,22,t,s,void 0,{maxArea:n});break}case"maximal-rectangle":{const t=p.split("|").map(o=>o.trim().split(/\s+/).filter(Boolean)),n=((k=t[0])==null?void 0:k.length)||0,s=Array(n).fill(0);let a=0;r("Initialize cumulative column heights for 2D matrix rows",8,[],-1,void 0,{maxArea:a,heights:[...s]});for(let o=0;o<t.length;o++){r(`Process Matrix Row ${o+1}/${t.length}`,13,[],-1,void 0,{maxArea:a,activeRow:o,heights:[...s]});for(let c=0;c<n;c++)t[o][c]==="1"?s[c]++:s[c]=0;r(`Row ${o+1} height values calculated: [${s.join(", ")}]. Now calculate Largest Rectangle in Histogram on these heights`,16,[],-1,void 0,{maxArea:a,activeRow:o,heights:[...s]});const l=[];for(let c=0;c<=n;c++){const d=c===n?0:s[c];for(;l.length>0;){const h=l[l.length-1].value;if(d<s[h]){l.pop();const v=s[h],S=l.length===0?c:c-l[l.length-1].value-1,x=v*S;a=Math.max(a,x),r(`Row ${o+1}, Col boundary ${c}: Pop index ${h} (height ${v}, width ${S}) -> Area: ${x}. maxArea = ${a}`,24,l,c,void 0,{maxArea:a,activeRow:o,heights:[...s],topIdx:h})}else break}c<n&&l.push({id:y(),value:c,subValue:s[c]})}}r(`Maximal Rectangle in 2D Binary Matrix completed. Maximum Rectangle Area: ${a}`,31,[],-1,void 0,{maxArea:a});break}case"trapping-rain-water":{const i=C(p).map(Number),t=[];let n=0,s=0;const a=i.length;for(r("Initialize monotonic decreasing stack of indices to find elevation boundaries",7,[],0,void 0,{totalWater:n,i:s});s<a;){for(r(`Inspect elevation bar at index ${s} (height: ${i[s]})`,11,t,s,void 0,{totalWater:n,i:s});t.length>0;){const o=t[t.length-1].value;if(i[s]>i[o]){if(t.pop(),r(`Valley valley-floor found! Elevation at ${s} (${i[s]}) > Top valley-floor at index ${o} (${i[o]}). Pop valley`,13,t,s,void 0,{totalWater:n,i:s,poppedIdx:o}),t.length===0){r("No left boundary elevation remaining to trap water. Discarding valley",15,t,s,void 0,{totalWater:n,i:s});break}const l=t[t.length-1].value,c=s-l-1,d=Math.min(i[s],i[l])-i[o],h=c*d;n+=h;const v={trapped:[...i].map((S,x)=>x>l&&x<s?Math.max(0,Math.min(i[s],i[l])-S):0),leftMax:[],rightMax:[],currentLeft:l,currentRight:s,totalWater:n};r(`Water Trapped between index ${l} (height ${i[l]}) and index ${s} (height ${i[s]}) over valley depth ${i[o]}: width ${c} * height ${d} = ${h}. Total Water: ${n}`,18,t,s,void 0,{totalWater:n,i:s,waterAccrued:h,leftIdx:l,rightIdx:s},{waterState:v})}else break}t.push({id:y(),value:s,subValue:i[s]}),r(`Push index ${s} onto monotonic decreasing stack`,20,t,s+1,void 0,{totalWater:n,i:s}),s++}r(`Trapping Rain Water completed. Total water trapped: ${n} units`,22,t,a,void 0,{totalWater:n});break}case"asteroid-collision":{const i=C(p).map(Number),t=[];r("Initialize asteroid chamber stack",6,[],0,void 0,{asteroids:i});for(let s=0;s<i.length;s++){const a=i[s];let o=!0;for(r(`Incoming asteroid: size ${a} (direction: ${a>0?"Right":"Left"})`,8,t,s,void 0,{asteroids:i,ast:a});t.length>0;){const l=t[t.length-1].value;if(l>0&&a<0){const c=Math.abs(l),d=Math.abs(a);if(c<d){t.pop(),r(`Collision! Incoming leftward asteroid [${a}] obliterates smaller rightward asteroid [${l}] at top. Pop top.`,11,t,s,void 0,{asteroids:i,ast:a,collisionResult:"incoming_wins"});continue}else c===d?(t.pop(),o=!1,r(`Collision! Both asteroids have equal size [${c}]. Both are completely annihilated! Pop top & destroy incoming`,14,t,s,void 0,{asteroids:i,ast:a,collisionResult:"both_destroyed"})):(o=!1,r(`Collision! Rightward asteroid [${l}] is larger than incoming [${a}]. Incoming asteroid is obliterated!`,17,t,s,void 0,{asteroids:i,ast:a,collisionResult:"top_wins"}));break}else break}o&&(t.push({id:y(),value:a}),r(`Asteroid [${a}] survives and is pushed onto stack chamber`,21,t,s+1,void 0,{asteroids:i}))}const n=t.map(s=>s.value);r(`Asteroid Collision simulation completed. Surviving asteroids: [${n.join(", ")}]`,25,t,i.length,void 0,{asteroids:i});break}case"remove-k-digits":{let i="1432219",t=3;const n=p.split(",");if(n[0]&&(i=n[0].trim()),n[1]){const d=n[1].match(/\d+/);d&&(t=Number(d[0]))}const s=i.split("").map(d=>({value:d,type:"operand",isScanned:!1,isActive:!1})),a=[];r(`Initialize digit stack. Goal: remove ${t} elements to make smallest number from "${i}"`,6,[],0,s,{k:t});for(let d=0;d<s.length;d++){const h=s[d].value;for(r(`Inspect digit: "${h}"`,8,a,d,s,{k:t,digit:h});t>0&&a.length>0;){const v=a[a.length-1].value;if(v>h)a.pop(),t--,r(`Monotonic condition: Stack top digit "${v}" > incoming "${h}" and we still have k=${t+1} removals. Pop "${v}" (k decrements to ${t})`,9,a,d,s,{k:t,digit:h,popped:v});else break}a.push({id:y(),value:h}),r(`Push digit "${h}" onto stack`,12,a,d+1,s,{k:t})}if(t>0)for(r(`Scan complete. Still need to remove remaining k=${t} elements. Pop from stack top`,15,a,s.length,s,{k:t});t>0&&a.length>0;){const d=a.pop();t--,r(`Pop element "${d.value}" (k decrements to ${t})`,17,a,s.length,s,{k:t})}const o=a.map(d=>d.value).join("");let l=0;for(;l<o.length&&o[l]==="0";)l++;const c=o.substring(l)||"0";r(`Final step: clean leading zeros. Full string is "${o}" -> returns final smallest number: "${c}"`,21,a,s.length,s,{k:t,finalResult:c});break}}return f}function qe(){const[u,p]=$.useState(I[0]),[f,g]=$.useState(I[0].defaultInput),[r,b]=$.useState([]),[m,k]=$.useState(0),[i,t]=$.useState(!1),[n,s]=$.useState(1),[a,o]=$.useState([]),[l,c]=$.useState(!1),d=$.useCallback((j,N)=>{c(!1);const E=$e(j.id,N);b(E),k(0),t(!1)},[]);$.useEffect(()=>{d(u,f)},[u.id]);const h=j=>{const N=I.find(E=>E.id===j);N&&(p(N),g(N.defaultInput),d(N,N.defaultInput))},v=()=>{g(u.defaultInput),d(u,u.defaultInput)},S=()=>{d(u,f)};$.useEffect(()=>{let j;return i&&r.length>0&&(j=setInterval(()=>{k(N=>N<r.length-1?N+1:(t(!1),N))},1e3/n)),()=>clearInterval(j)},[i,r.length,n]);const x=$.useCallback(()=>{m<r.length-1&&k(j=>j+1)},[m,r.length]),P=$.useCallback(()=>{m>0&&k(j=>j-1)},[m]);$.useEffect(()=>{const j=N=>{var E,H;if(!(((E=document.activeElement)==null?void 0:E.tagName)==="INPUT"||((H=document.activeElement)==null?void 0:H.tagName)==="SELECT"))switch(N.code){case"Space":N.preventDefault(),r.length>1&&t(Q=>!Q);break;case"ArrowLeft":N.preventDefault(),P();break;case"ArrowRight":N.preventDefault(),x();break;case"KeyR":N.preventDefault(),v();break}};return window.addEventListener("keydown",j),()=>window.removeEventListener("keydown",j)},[r.length,x,P]);const T=j=>{c(!0),o(N=>[...N,{id:Math.random().toString(36).substring(2,9),value:j}])},M=()=>{c(!0),o(j=>{const N=[...j];return N.pop(),N})},A=()=>{c(!0),o([])},w=r[m]||{stepIndex:0,description:"Idle",line:1,stack:[],variables:{},logs:[]},R=l?a:w.stack,O=l?void 0:w.secondaryStack,z=["next-greater-element","daily-temperatures","online-stock-span","largest-rectangle","trapping-rain-water","maximal-rectangle"].includes(u.id),V=["infix-to-postfix","infix-to-prefix","evaluate-postfix","evaluate-prefix","postfix-to-infix","prefix-to-infix","basic-calculator"].includes(u.id),Y=()=>u.id==="maximal-rectangle"?w.variables.heights||Array(5).fill(0):u.id==="remove-k-digits"?[]:f.split(/[,,|\s]+/).map(Number).filter(j=>!isNaN(j)),K=R.map(j=>typeof j.value=="number"?j.value:NaN).filter(j=>!isNaN(j));return e.jsxs("div",{className:"h-screen max-h-screen flex flex-col bg-[#FAF9F6] text-slate-800 overflow-hidden font-sans select-none",children:[e.jsx(be,{currentProblem:u,onProblemSelect:h,onCustomPush:T,onCustomPop:M,onCustomClear:A,customActive:l}),e.jsx(ve,{problem:u,inputValue:f,onInputChange:g,onReset:v,onSimulate:S}),e.jsxs("main",{className:"flex-1 min-h-0 flex gap-4 p-4",children:[e.jsxs("div",{className:"flex-[7] flex flex-col gap-4 min-h-0",children:[e.jsxs("div",{className:"flex-1 bg-white border border-slate-200 rounded-xl p-4 flex gap-6 min-h-0 shadow-xs",children:[e.jsx("div",{className:"w-[30%] border-r border-slate-100 pr-4 h-full min-h-0",children:e.jsx(ke,{stack:R,secondaryStack:O,secondaryTitle:u.id==="queue-using-stacks"?"outStack (FIFO Pop)":"Auxiliary Stack"})}),e.jsxs("div",{className:"w-[70%] h-full min-h-0",children:[V&&e.jsx(ye,{tokens:w.inputTokens||[],outputString:w.outputString,precedenceCompare:w.precedenceCompare,inputCursor:w.inputCursor}),z&&e.jsx(je,{problemId:u.id,data:Y(),inputCursor:w.inputCursor,stackIndices:K,histogramState:w.histogramState,waterState:w.waterState,variables:w.variables}),!V&&!z&&e.jsxs("div",{className:"h-full flex flex-col justify-center items-center text-center p-6 text-slate-400 font-sans gap-2 select-none",children:[e.jsx("div",{className:"p-3 bg-amber-500/10 border border-amber-200 text-amber-800 rounded-xl mb-1",children:"🌟"}),e.jsx("h3",{className:"font-serif text-sm font-bold text-slate-800",children:"Foundation Stack sandbox"}),e.jsx("p",{className:"text-[11px] text-slate-500 max-w-sm",children:"This problem is a pure stack simulation. Watch elements enter and leave the left-hand chamber, or push custom values using the sandbox tool in the top header."})]})]})]}),e.jsx(we,{currentStepIndex:m,totalSteps:r.length,isPlaying:i,speed:n,activeDescription:w.description,onStepIndexChange:k,onPlayPauseToggle:()=>t(!i),onStepForward:x,onStepBackward:P,onReset:()=>{k(0),t(!1)},onSpeedChange:s})]}),e.jsx("div",{className:"flex-[5] flex flex-col min-h-0",children:e.jsx(Ne,{problemId:u.id,activeStep:w,variables:w.variables,stack:R,secondaryStack:O,logs:w.logs})})]})]})}export{qe as default};
