/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TreeDict } from './types';

export interface PresetTree {
  name: string;
  description: string;
  rootId: string | null;
  treeDict: TreeDict;
}

export const PRESET_TREES: Record<string, PresetTree> = {
  perfect: {
    name: 'Perfect Binary Tree',
    description: 'A balanced binary tree where all internal nodes have two children and all leaves are at the same depth.',
    rootId: '1',
    treeDict: {
      '1': { id: '1', val: 4, leftId: '2', rightId: '3' },
      '2': { id: '2', val: 7, leftId: '4', rightId: '5' },
      '3': { id: '3', val: 9, leftId: '6', rightId: '7' },
      '4': { id: '4', val: 2, leftId: null, rightId: null },
      '5': { id: '5', val: 15, leftId: null, rightId: null },
      '6': { id: '6', val: 6, leftId: null, rightId: null },
      '7': { id: '7', val: 1, leftId: null, rightId: null },
    },
  },
  skewed: {
    name: 'Left-Skewed Tree',
    description: 'A tree where each node has only a left child, behaving like a linked list.',
    rootId: '1',
    treeDict: {
      '1': { id: '1', val: 12, leftId: '2', rightId: null },
      '2': { id: '2', val: 5, leftId: '3', rightId: null },
      '3': { id: '3', val: 8, leftId: '4', rightId: null },
      '4': { id: '4', val: 21, leftId: null, rightId: null },
    },
  },
  symmetric: {
    name: 'Symmetric / Mirror Tree',
    description: 'A tree that is a perfect mirror image of itself around its center root.',
    rootId: '1',
    treeDict: {
      '1': { id: '1', val: 1, leftId: '2', rightId: '3' },
      '2': { id: '2', val: 2, leftId: '4', rightId: '5' },
      '3': { id: '3', val: 2, leftId: '6', rightId: '7' },
      '4': { id: '4', val: 3, leftId: null, rightId: null },
      '5': { id: '5', val: 4, leftId: null, rightId: null },
      '6': { id: '6', val: 4, leftId: null, rightId: null },
      '7': { id: '7', val: 3, leftId: null, rightId: null },
    },
  },
  deep: {
    name: 'Deep Arbitrary Tree',
    description: 'A deeper, asymmetric tree with varied depths to explore more complex traversals and LCA paths.',
    rootId: '1',
    treeDict: {
      '1': { id: '1', val: 8, leftId: '2', rightId: '3' },
      '2': { id: '2', val: 3, leftId: '4', rightId: '5' },
      '3': { id: '3', val: 10, leftId: null, rightId: '8' },
      '4': { id: '4', val: 1, leftId: null, rightId: null },
      '5': { id: '5', val: 6, leftId: '6', rightId: '7' },
      '6': { id: '6', val: 4, leftId: null, rightId: null },
      '7': { id: '7', val: 7, leftId: null, rightId: null },
      '8': { id: '8', val: 14, leftId: '9', rightId: null },
      '9': { id: '9', val: 13, leftId: null, rightId: null },
    },
  },
};
