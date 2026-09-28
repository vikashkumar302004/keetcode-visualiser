# Keetcode® | DSA Algorithm Visualizer Suite

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-v11.0-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Keetcode®** is an interactive Data Structures and Algorithms visualizer portal I built to help students, competitive programmers, and developers understand how algorithms work under the hood.

---

## 💡 About The Project

I created **Keetcode®** because learning DSA from static diagrams, dry pseudocode, or textbook formulas often lacks clarity. When practicing problem-solving, seeing step-by-step state changes, pointer movements, and memory representations in real time makes a huge difference.

This portal brings together **16 major DSA domains** into interactive visualizers where you can step through algorithms, test custom inputs, and observe variable states live.

---

## 🏗️ How It's Built

Keetcode® is designed as a fast, modular React web app powered by Vite and Firebase Authentication:

- **Modular Lazy Loading**: Every algorithm engine is isolated into standalone modules and dynamically loaded using `React.lazy()` to keep initial page loads fast.
- **Interactive Visual Engines**: Step-by-step execution engines designed for arrays, trees, graphs, strings, and matrices.
- **Glassmorphic UI**: Modern dark theme layout built with responsive CSS, smooth transitions, and live step logs.
- **Firebase Auth**: Integrated Google sign-in with local state persistence.

---

## 🚀 16 Interactive Algorithm Engines

| # | Visualizer Suite | Key Algorithms & Topics Included | Level |
|---|---|---|---|
| 1 | **Array Algorithms Engine** | Kadane's Algorithm, Prefix Sums, Dutch National Flag, Array Rotations | Beginner |
| 2 | **Binary Search & Answer Space** | Lower/Upper Bound, Search in Rotated Array, Answer Space (Aggressive Cows) | Intermediate |
| 3 | **Binary Search Tree (BST)** | BST Insert/Delete, Inorder/Preorder/Postorder, Floor/Ceil, AVL Balance | Intermediate |
| 4 | **Binary Tree Algorithms** | BFS Level Order, Max Path Sum, Tree Diameter, Left/Right Views | Intermediate |
| 5 | **Bitwise & Interval Engine** | Bit Shifts, XOR Tricks, Merge Intervals, Insert Interval | Intermediate |
| 6 | **Fast & Slow Pointers** | Floyd's Cycle Detection, Find Middle Node, Happy Number | Beginner |
| 7 | **Graph Algorithms Suite** | BFS, DFS, Dijkstra's Shortest Path, Kahn's Topological Sort, Kruskal's MST | Advanced |
| 8 | **Heap & Priority Queue** | Min/Max Heapify, Heap Sort, Top K Frequent Elements, Running Median | Intermediate |
| 9 | **Linked List Pointer Engine** | Singly & Doubly Lists, Reverse List, Merge Sorted Lists, K-Group Reverse | Beginner |
| 10 | **Math & Prefix Sum Engine** | Sieve of Eratosthenes, Euclidean GCD, 2D Matrix Prefix Sum, Difference Array | Beginner |
| 11 | **Queue & Deque Engine** | Circular Queue, Monotonic Deque, Sliding Window Maximum | Beginner |
| 12 | **Recursion & Backtracking** | N-Queens Puzzle, Sudoku Solver, Subsets & Permutations, Maze Pathfinding | Advanced |
| 13 | **Sliding Window Visualizer** | Fixed Window Sum, Longest Substring Without Repeats, Min Window Substring | Intermediate |
| 14 | **Stack & Expression Engine** | Monotonic Stack (Next Greater Element), Infix to Postfix, RPN Evaluator | Intermediate |
| 15 | **String & Pattern Matching** | KMP Algorithm (LPS Array), Rabin-Karp Hashing, Z-Algorithm, Trie Autocomplete | Advanced |
| 16 | **Two Pointers & Kadane's** | Two Sum, 3Sum, Trapping Rain Water, Container With Most Water, Kadane's | Beginner |

---

## 🛠️ Local Development & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vikashkumar302004/keetcode-visualiser.git
   cd keetcode-visualiser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Frontend Server**:
   ```bash
   npm run dev
   ```
   *Runs locally on `http://localhost:3000/`.*

4. **Start Express API Backend (Optional)**:
   ```bash
   npm run server
   ```
   *Runs locally on `http://localhost:5000/`.*

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
