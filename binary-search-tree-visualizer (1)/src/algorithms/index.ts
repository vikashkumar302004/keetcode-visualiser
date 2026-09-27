import { AlgorithmId, BSTNode, SimulationStep } from '../types';
import { ALGORITHM_METADATA } from './cppSnippets';
import { generateInsertSteps, generateSearchSteps, generateDeleteSteps } from './crudOperations';
import { generateValidateBSTSteps, generateFindMinMaxSteps, generateKthElementSteps } from './validationMetrics';
import { generateRangeSumSteps, generatePruneBSTSteps } from './rangePruning';
import { generateSortedArrayToBSTSteps, generateBinaryTreeToBSTSteps, generateBSTFromPreorderSteps } from './constructionConversions';
import { generateLCASteps, generateSuccessorPredecessorSteps } from './nodeRelations';
import {
  generateTwoSumBSTSteps,
  generateGreaterSumTreeSteps,
  generateRecoverBSTSteps,
  generateClosestValueSteps,
} from './patternQuestions';

export interface AlgorithmExecutionParams {
  value?: number;
  low?: number;
  high?: number;
  k?: number;
  kthMode?: 'smallest' | 'largest';
  pVal?: number;
  qVal?: number;
  sortedArray?: number[];
  preorderArray?: number[];
  target?: number;
}

export function runAlgorithm(
  algorithmId: AlgorithmId,
  tree: BSTNode | null,
  params: AlgorithmExecutionParams = {}
): SimulationStep[] {
  switch (algorithmId) {
    case 'insert':
      return generateInsertSteps(tree, params.value ?? 45);

    case 'search':
      return generateSearchSteps(tree, params.value ?? 37);

    case 'delete':
      return generateDeleteSteps(tree, params.value ?? 25);

    case 'validate':
      return generateValidateBSTSteps(tree);

    case 'find_min_max':
      return generateFindMinMaxSteps(tree);

    case 'kth_element':
      return generateKthElementSteps(tree, params.k ?? 3, params.kthMode ?? 'smallest');

    case 'range_sum':
      return generateRangeSumSteps(tree, params.low ?? 20, params.high ?? 65);

    case 'prune':
      return generatePruneBSTSteps(tree, params.low ?? 20, params.high ?? 75);

    case 'sorted_array_to_bst':
      return generateSortedArrayToBSTSteps(params.sortedArray || [12, 25, 37, 50, 62, 75, 87]);

    case 'binary_tree_to_bst':
      return generateBinaryTreeToBSTSteps(tree);

    case 'bst_from_preorder':
      return generateBSTFromPreorderSteps(params.preorderArray || [50, 25, 12, 37, 75, 62, 87]);

    case 'lca':
      return generateLCASteps(tree, params.pVal ?? 12, params.qVal ?? 37);

    case 'successor_predecessor':
      return generateSuccessorPredecessorSteps(tree, params.value ?? 25);

    case 'two_sum':
      return generateTwoSumBSTSteps(tree, params.target ?? params.value ?? 75);

    case 'greater_sum_tree':
      return generateGreaterSumTreeSteps(tree);

    case 'recover_bst':
      return generateRecoverBSTSteps(tree);

    case 'closest_value':
      return generateClosestValueSteps(tree, params.target ?? params.value ?? 34);

    default:
      return [];
  }
}

export { ALGORITHM_METADATA };
