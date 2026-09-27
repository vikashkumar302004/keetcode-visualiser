import {
  GraphData,
  ExecutionStep,
  NodeVisualStatus,
  EdgeVisualStatus
} from '../types';

/**
 * Builds adjacency list for undirected or directed graph
 */
function getAdjacency(graph: GraphData, directed: boolean) {
  const adj: Record<string, Array<{ to: string; edgeId: string; weight: number }>> = {};
  graph.nodes.forEach(n => {
    adj[n.id] = [];
  });
  graph.edges.forEach(e => {
    if (!adj[e.source]) adj[e.source] = [];
    if (!adj[e.target]) adj[e.target] = [];
    adj[e.source].push({ to: e.target, edgeId: e.id, weight: e.weight });
    if (!directed && !graph.isDirected && !e.directed) {
      adj[e.target].push({ to: e.source, edgeId: e.id, weight: e.weight });
    }
  });
  return adj;
}

// -------------------------------------------------------------
// 1. Critical Connections (Tarjan's Bridge Algorithm - LC 1192)
// -------------------------------------------------------------
export function generateCriticalConnectionsSteps(
  graph: GraphData,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const adj = getAdjacency(graph, false);
  const tin: Record<string, number> = {};
  const low: Record<string, number> = {};
  const bridges: string[] = [];
  let timer = 0;

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `Initialize Tarjan's Bridge Detection. tin[u] (discovery time) and low[u] (lowest reachable ancestor) arrays allocated for ${graph.nodes.length} servers.`,
    phase: 'Initialization',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    dataStructure: {
      type: 'bridges',
      title: "Tarjan's DFS Call Stack",
      items: []
    }
  });

  function dfsBridges(u: string, p: string | null) {
    timer++;
    tin[u] = low[u] = timer;
    visited[u] = true;
    nodeStates[u] = 'active';

    steps.push({
      stepIndex: steps.length,
      cppLine: 4,
      description: `Enter server ${u}: tin[${u}] = low[${u}] = ${timer}.`,
      phase: 'DFS Entry',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      activeNodeId: u,
      variables: { u, parent: p || 'None', tin: tin[u], low: low[u] },
      dataStructure: {
        type: 'bridges',
        title: "Tarjan's Low-Link State",
        items: Object.keys(tin).map(id => ({
          label: id,
          value: `tin:${tin[id]} low:${low[id]}`,
          badge: id === u ? 'Active' : 'Visited'
        }))
      }
    });

    const neighbors = adj[u] || [];
    for (const { to: v, edgeId } of neighbors) {
      if (v === p) {
        steps.push({
          stepIndex: steps.length,
          cppLine: 7,
          description: `Edge (${u}, ${v}) leads directly to parent ${p}. Skip to avoid false cycle.`,
          phase: 'Skip Parent',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          activeEdgeId: edgeId,
          variables: { u, v, reason: 'Parent Edge' },
          dataStructure: {
            type: 'bridges',
            title: "Tarjan's Low-Link State",
            items: Object.keys(tin).map(id => ({ label: id, value: `low:${low[id]}` }))
          }
        });
        continue;
      }

      if (visited[v]) {
        // Back-edge
        const oldLow = low[u];
        low[u] = Math.min(low[u], tin[v]);
        edgeStates[edgeId] = 'cross';

        steps.push({
          stepIndex: steps.length,
          cppLine: 11,
          description: `Back-edge detected from ${u} to ancestor ${v}! Update low[${u}] = min(${oldLow}, tin[${v}]=${tin[v]}) -> ${low[u]}. Cycle detected!`,
          phase: 'Back-Edge Relax',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          activeEdgeId: edgeId,
          variables: { u, v, 'old low': oldLow, 'new low': low[u] },
          dataStructure: {
            type: 'bridges',
            title: "Tarjan's Low-Link State",
            items: Object.keys(tin).map(id => ({ label: id, value: `low:${low[id]}` }))
          }
        });
      } else {
        // Forward tree edge
        edgeStates[edgeId] = 'evaluating';

        steps.push({
          stepIndex: steps.length,
          cppLine: 14,
          description: `Tree edge (${u} -> ${v}). Recurse into child server ${v} with parent ${u}.`,
          phase: 'Tree Edge DFS',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: v,
          activeEdgeId: edgeId,
          dataStructure: {
            type: 'bridges',
            title: "Tarjan's Low-Link State",
            items: Object.keys(tin).map(id => ({ label: id, value: `tin:${tin[id]}` }))
          }
        });

        edgeStates[edgeId] = 'tree';
        dfsBridges(v, u);

        // Returning from recursion
        const prevLowU = low[u];
        low[u] = Math.min(low[u], low[v]);

        steps.push({
          stepIndex: steps.length,
          cppLine: 15,
          description: `Returned from subtree of ${v} to ${u}. Update low[${u}] = min(${prevLowU}, low[${v}]=${low[v]}) -> ${low[u]}.`,
          phase: 'Subtree Return',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          variables: { u, v, 'low[v]': low[v], 'tin[u]': tin[u] },
          dataStructure: {
            type: 'bridges',
            title: "Tarjan's Low-Link State",
            items: Object.keys(tin).map(id => ({ label: id, value: `low:${low[id]}` }))
          }
        });

        // Bridge check
        if (low[v] > tin[u]) {
          bridges.push(edgeId);
          edgeStates[edgeId] = 'bridge';

          steps.push({
            stepIndex: steps.length,
            cppLine: 18,
            description: `CRITICAL CONNECTION FOUND! low[${v}] (${low[v]}) > tin[${u}] (${tin[u]}). No back-edge from ${v}'s subtree reaches ${u} or above. Removing (${u}, ${v}) disconnects the network!`,
            phase: 'Bridge Confirmed',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            activeNodeId: u,
            activeEdgeId: edgeId,
            bridges: [...bridges],
            variables: { 'CRITICAL BRIDGE': `(${u}, ${v})`, 'low[v]': low[v], 'tin[u]': tin[u] },
            dataStructure: {
              type: 'bridges',
              title: 'Critical Connections (Bridges)',
              items: bridges.map(b => ({ label: `Bridge`, value: b, badge: 'CRITICAL' }))
            }
          });
        }
      }
    }

    nodeStates[u] = 'visited';
  }

  // Run DFS on all components
  for (const node of graph.nodes) {
    if (!visited[node.id]) {
      dfsBridges(node.id, null);
    }
  }

  steps.push({
    stepIndex: steps.length,
    cppLine: 22,
    description: `Tarjan's Bridge Analysis Complete! Identified ${bridges.length} critical connection(s). These edges represent single points of network failure.`,
    phase: 'Complete',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    bridges: [...bridges],
    variables: { 'Total Bridges': bridges.length },
    dataStructure: {
      type: 'bridges',
      title: 'Critical Connections Result',
      items: bridges.length > 0
        ? bridges.map((b, i) => ({ label: `Bridge #${i + 1}`, value: b, badge: 'Failure Risk' }))
        : [{ label: 'Network Biconnected', value: '0 Bridges Found', badge: 'Safe' }]
    }
  });

  return steps;
}

// -------------------------------------------------------------
// 2. Articulation Points (Cut Vertices)
// -------------------------------------------------------------
export function generateArticulationPointsSteps(
  graph: GraphData,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const adj = getAdjacency(graph, false);
  const tin: Record<string, number> = {};
  const low: Record<string, number> = {};
  const isCut: Record<string, boolean> = {};
  let timer = 0;

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `Initialize Articulation Points (Cut Vertices) detection using Tarjan's algorithm.`,
    phase: 'Initialization',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    dataStructure: {
      type: 'components',
      title: 'Cut Vertices',
      items: []
    }
  });

  function dfsCut(u: string, p: string | null) {
    timer++;
    tin[u] = low[u] = timer;
    visited[u] = true;
    nodeStates[u] = 'active';
    let children = 0;

    steps.push({
      stepIndex: steps.length,
      cppLine: 4,
      description: `Enter vertex ${u}: tin[${u}] = low[${u}] = ${timer}.`,
      phase: 'DFS Visit',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      activeNodeId: u,
      variables: { u, parent: p || 'None', tin: tin[u], low: low[u] },
      dataStructure: {
        type: 'components',
        title: 'Tarjan Low-Link Values',
        items: Object.keys(tin).map(id => ({ label: id, value: `low:${low[id]}` }))
      }
    });

    const neighbors = adj[u] || [];
    for (const { to: v, edgeId } of neighbors) {
      if (v === p) continue;

      if (visited[v]) {
        low[u] = Math.min(low[u], tin[v]);
        edgeStates[edgeId] = 'cross';
        steps.push({
          stepIndex: steps.length,
          cppLine: 11,
          description: `Back-edge (${u}, ${v}) reached ancestor ${v}. Updated low[${u}] = ${low[u]}.`,
          phase: 'Back-Edge',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          activeEdgeId: edgeId,
          dataStructure: {
            type: 'components',
            title: 'Tarjan Low-Link Values',
            items: Object.keys(tin).map(id => ({ label: id, value: `low:${low[id]}` }))
          }
        });
      } else {
        children++;
        edgeStates[edgeId] = 'tree';
        dfsCut(v, u);

        low[u] = Math.min(low[u], low[v]);

        // Non-root cut vertex condition
        if (p !== null && low[v] >= tin[u]) {
          isCut[u] = true;
          nodeStates[u] = 'cut';

          steps.push({
            stepIndex: steps.length,
            cppLine: 17,
            description: `ARTICULATION POINT (Cut Vertex) FOUND! low[${v}] (${low[v]}) >= tin[${u}] (${tin[u]}). Child ${v} cannot reach any ancestor of ${u} without passing through ${u}. Removing ${u} disconnects the graph!`,
            phase: 'Cut Vertex Confirmed',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            activeNodeId: u,
            articulationPoints: Object.keys(isCut).filter(k => isCut[k]),
            variables: { 'Cut Vertex': u, 'low[child]': low[v], 'tin[u]': tin[u] },
            dataStructure: {
              type: 'components',
              title: 'Confirmed Articulation Points',
              items: Object.keys(isCut).filter(k => isCut[k]).map(id => ({ label: 'Cut Point', value: id, badge: 'DISCONNECTOR' }))
            }
          });
        }
      }
    }

    // Root cut vertex condition
    if (p === null && children > 1) {
      isCut[u] = true;
      nodeStates[u] = 'cut';

      steps.push({
        stepIndex: steps.length,
        cppLine: 23,
        description: `ROOT ARTICULATION POINT FOUND! Root vertex ${u} has ${children} independent children branches in the DFS tree. Removing root ${u} disconnects those branches!`,
        phase: 'Root Cut Vertex',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        activeNodeId: u,
        articulationPoints: Object.keys(isCut).filter(k => isCut[k]),
        variables: { 'Root Cut Vertex': u, 'DFS Children': children },
        dataStructure: {
          type: 'components',
          title: 'Confirmed Articulation Points',
          items: Object.keys(isCut).filter(k => isCut[k]).map(id => ({ label: 'Cut Point', value: id, badge: 'ROOT CUT' }))
        }
      });
    }

    if (!isCut[u]) {
      nodeStates[u] = 'visited';
    }
  }

  for (const node of graph.nodes) {
    if (!visited[node.id]) {
      dfsCut(node.id, null);
    }
  }

  const cutVerticesList = Object.keys(isCut).filter(k => isCut[k]);
  steps.push({
    stepIndex: steps.length,
    cppLine: 26,
    description: `Articulation Points Search Finished! Found ${cutVerticesList.length} cut vertex router(s): [${cutVerticesList.join(', ')}].`,
    phase: 'Complete',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    articulationPoints: cutVerticesList,
    variables: { 'Total Cut Vertices': cutVerticesList.length },
    dataStructure: {
      type: 'components',
      title: 'Articulation Points Summary',
      items: cutVerticesList.map(id => ({ label: 'Cut Vertex', value: id, badge: 'Critical Node' }))
    }
  });

  return steps;
}

// -------------------------------------------------------------
// 3. Make Network Connected (LeetCode 1319)
// -------------------------------------------------------------
export function generateMakeConnectedSteps(
  graph: GraphData,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const n = graph.nodes.length;
  const connectionsCount = graph.edges.length;

  steps.push({
    stepIndex: steps.length,
    cppLine: 2,
    description: `Evaluate Network Cabling: Total Computers n = ${n}, Total Cables = ${connectionsCount}. Need at least n - 1 = ${n - 1} cables to connect all computers.`,
    phase: 'Pre-check',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    variables: { 'Computers (n)': n, 'Cables (m)': connectionsCount, 'Required': n - 1 },
    dataStructure: {
      type: 'components',
      title: 'Cable Sufficiency Check',
      items: [
        { label: 'Total Computers', value: n },
        { label: 'Available Cables', value: connectionsCount },
        { label: 'Minimum Required', value: n - 1, badge: connectionsCount >= n - 1 ? 'Sufficient' : 'Deficit' }
      ]
    }
  });

  if (connectionsCount < n - 1) {
    steps.push({
      stepIndex: steps.length,
      cppLine: 2,
      description: `IMPOSSIBLE! Total cables (${connectionsCount}) < n - 1 (${n - 1}). Even if all cables are relocated, you cannot span all ${n} computers. Returns -1.`,
      phase: 'Impossible (-1)',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      cycleDetected: true,
      variables: { 'Result': -1, 'Missing Cables': (n - 1) - connectionsCount },
      dataStructure: {
        type: 'components',
        title: 'Insufficient Cables',
        items: [{ label: 'Result', value: -1, badge: 'FAIL' }]
      }
    });
    return steps;
  }

  const adj = getAdjacency(graph, false);
  const components: string[][] = [];

  function dfsComponent(u: string, currentComp: string[]) {
    visited[u] = true;
    nodeStates[u] = 'active';
    currentComp.push(u);

    const neighbors = adj[u] || [];
    for (const { to: v, edgeId } of neighbors) {
      if (!visited[v]) {
        edgeStates[edgeId] = 'tree';
        dfsComponent(v, currentComp);
      } else {
        edgeStates[edgeId] = 'cross'; // Redundant loop cable!
      }
    }
    nodeStates[u] = 'visited';
  }

  for (const node of graph.nodes) {
    if (!visited[node.id]) {
      const currentComp: string[] = [];
      dfsComponent(node.id, currentComp);
      components.push(currentComp);

      steps.push({
        stepIndex: steps.length,
        cppLine: 16,
        description: `Discovered Connected Computer Cluster #${components.length}: { ${currentComp.join(', ')} }.`,
        phase: 'Component Found',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        componentsCount: components.length,
        variables: { 'Components Found': components.length, 'Cluster Nodes': currentComp.length },
        dataStructure: {
          type: 'components',
          title: 'Connected Server Clusters',
          items: components.map((comp, idx) => ({
            label: `Cluster #${idx + 1}`,
            value: comp.join(', '),
            badge: `${comp.length} nodes`
          }))
        }
      });
    }
  }

  const operationsNeeded = components.length - 1;
  const redundantCables = connectionsCount - (n - components.length);

  steps.push({
    stepIndex: steps.length,
    cppLine: 21,
    description: `Solution Found! There are ${components.length} disjoint server clusters and ${redundantCables} redundant loop cables. Connecting these clusters requires moving exactly ${operationsNeeded} cable(s).`,
    phase: 'Complete',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    componentsCount: components.length,
    redundantEdgesCount: redundantCables,
    variables: { 'Min Operations': operationsNeeded, 'Redundant Cables': redundantCables, 'Components': components.length },
    dataStructure: {
      type: 'components',
      title: 'Make Connected Result',
      items: [
        { label: 'Disjoint Components', value: components.length },
        { label: 'Redundant Loop Cables', value: redundantCables, badge: 'Available to move' },
        { label: 'Minimum Operations', value: operationsNeeded, badge: 'OPTIMAL' }
      ]
    }
  });

  return steps;
}

// -------------------------------------------------------------
// 4. Eulerian Circuit (Hierholzer's Algorithm)
// -------------------------------------------------------------
export function generateEulerianCircuitSteps(
  graph: GraphData,
  startNodeId: string,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const safeStart = graph.nodes.find(n => n.id === startNodeId)?.id || graph.nodes[0]?.id || 'A';

  // 1. Check degree parity
  const degrees: Record<string, number> = {};
  graph.nodes.forEach(n => { degrees[n.id] = 0; });
  graph.edges.forEach(e => {
    degrees[e.source] = (degrees[e.source] || 0) + 1;
    degrees[e.target] = (degrees[e.target] || 0) + 1;
  });

  steps.push({
    stepIndex: steps.length,
    cppLine: 3,
    description: `Step 1: Check Degree Parity. An Eulerian circuit requires every vertex to have an EVEN degree.`,
    phase: 'Parity Test',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    dataStructure: {
      type: 'hierholzer',
      title: 'Vertex Degree Parity',
      items: Object.keys(degrees).map(id => ({
        label: `Node ${id}`,
        value: `Degree: ${degrees[id]}`,
        badge: degrees[id] % 2 === 0 ? 'EVEN' : 'ODD'
      }))
    }
  });

  const oddVertices = Object.keys(degrees).filter(id => degrees[id] % 2 !== 0);
  if (oddVertices.length > 0) {
    steps.push({
      stepIndex: steps.length,
      cppLine: 4,
      description: `No Eulerian Circuit! Found ${oddVertices.length} vertex(es) with odd degree: [${oddVertices.join(', ')}]. Euler's theorem requires all vertices to have even degrees.`,
      phase: 'Impossible',
      cycleDetected: true,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: { 'Odd Vertices': oddVertices.join(', ') },
      dataStructure: {
        type: 'hierholzer',
        title: 'Parity Check Failed',
        items: oddVertices.map(id => ({ label: id, value: `Degree ${degrees[id]} (Odd)`, badge: 'VIOLATION' }))
      }
    });
    return steps;
  }

  // 2. Hierholzer's Algorithm
  // Create mutable edge lists
  const edgeListCopy: Record<string, Array<{ to: string; edgeId: string }>> = {};
  graph.nodes.forEach(n => { edgeListCopy[n.id] = []; });
  graph.edges.forEach(e => {
    edgeListCopy[e.source].push({ to: e.target, edgeId: e.id });
    edgeListCopy[e.target].push({ to: e.source, edgeId: e.id });
  });

  const usedEdges = new Set<string>();
  const currPath: string[] = [safeStart];
  const circuit: string[] = [];

  steps.push({
    stepIndex: steps.length,
    cppLine: 10,
    description: `All degrees are even! Begin Hierholzer's algorithm. Push start vertex ${safeStart} onto the traversal stack.`,
    phase: 'Hierholzer Start',
    nodeStates: { ...nodeStates, [safeStart]: 'active' },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    activeNodeId: safeStart,
    dataStructure: {
      type: 'hierholzer',
      title: 'Hierholzer Traversal Stack',
      items: [{ label: safeStart, status: 'active' }]
    }
  });

  while (currPath.length > 0) {
    const u = currPath[currPath.length - 1];

    // Find next unused edge
    let nextEdge: { to: string; edgeId: string } | null = null;
    while (edgeListCopy[u].length > 0) {
      const candidate = edgeListCopy[u].pop()!;
      if (!usedEdges.has(candidate.edgeId)) {
        nextEdge = candidate;
        break;
      }
    }

    if (nextEdge) {
      usedEdges.add(nextEdge.edgeId);
      currPath.push(nextEdge.to);
      edgeStates[nextEdge.edgeId] = 'path';
      nodeStates[nextEdge.to] = 'active';

      steps.push({
        stepIndex: steps.length,
        cppLine: 15,
        description: `Traverse edge (${u} -> ${nextEdge.to}). Stack pushes ${nextEdge.to}. (${usedEdges.size}/${graph.edges.length} edges visited).`,
        phase: 'Traverse Edge',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        activeNodeId: nextEdge.to,
        activeEdgeId: nextEdge.edgeId,
        eulerCircuit: [...circuit],
        dataStructure: {
          type: 'hierholzer',
          title: 'Hierholzer Traversal Stack',
          items: currPath.map((v, i) => ({ label: v, badge: i === currPath.length - 1 ? 'Top' : '' }))
        }
      });
    } else {
      // Backtrack and append to circuit
      const popped = currPath.pop()!;
      circuit.push(popped);
      nodeStates[popped] = 'visited';

      steps.push({
        stepIndex: steps.length,
        cppLine: 18,
        description: `No remaining untraversed edges from ${popped}. Pop from stack and append ${popped} to Eulerian circuit.`,
        phase: 'Circuit Append',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        activeNodeId: popped,
        eulerCircuit: [...circuit],
        dataStructure: {
          type: 'hierholzer',
          title: 'Current Circuit Walk (Reversed)',
          items: circuit.map((node, idx) => ({ label: `Step #${idx + 1}`, value: node }))
        }
      });
    }
  }

  circuit.reverse();

  steps.push({
    stepIndex: steps.length,
    cppLine: 24,
    description: `Eulerian Circuit Complete! Full closed walk visiting every single edge exactly once: ${circuit.join(' -> ')}.`,
    phase: 'Complete',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    eulerCircuit: circuit,
    variables: { 'Circuit Length': circuit.length, 'Total Edges': graph.edges.length },
    dataStructure: {
      type: 'hierholzer',
      title: 'Final Eulerian Circuit Sequence',
      items: circuit.map((node, idx) => ({ label: `#${idx + 1}`, value: node, badge: idx === 0 || idx === circuit.length - 1 ? 'Origin' : 'Tour' }))
    }
  });

  return steps;
}

// -------------------------------------------------------------
// 5. Cheapest Flights Within K Stops (LeetCode 787)
// -------------------------------------------------------------
export function generateCheapestFlightsSteps(
  graph: GraphData,
  startNodeId: string,
  targetNodeId: string,
  kStops: number = 1,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const safeStart = graph.nodes.find(n => n.id === startNodeId)?.id || graph.nodes[0]?.id || 'A';
  const safeTarget = graph.nodes.find(n => n.id === targetNodeId)?.id || graph.nodes[graph.nodes.length - 1]?.id || 'B';

  const adj = getAdjacency(graph, true);
  const minCost: Record<string, number> = {};
  graph.nodes.forEach(n => { minCost[n.id] = Infinity; });
  minCost[safeStart] = 0;

  // Queue holds: { stops, u, cost, path: string[] }
  const queue: Array<{ stops: number; u: string; cost: number; path: string[] }> = [
    { stops: 0, u: safeStart, cost: 0, path: [safeStart] }
  ];

  steps.push({
    stepIndex: steps.length,
    cppLine: 5,
    description: `Initialize Cheapest Flights: Origin ${safeStart}, Destination ${safeTarget}, Max Allowed Stops K = ${kStops}.`,
    phase: 'Initialization',
    nodeStates: { ...nodeStates, [safeStart]: 'active' },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    variables: { Origin: safeStart, Destination: safeTarget, 'Max Stops (K)': kStops },
    dataStructure: {
      type: 'queue',
      title: 'Flight Queue (stops, city, cost)',
      items: [{ label: `${safeStart}`, value: `$0`, badge: '0 stops' }]
    }
  });

  let bestRoute: { cost: number; path: string[] } | null = null;

  while (queue.length > 0) {
    const { stops, u, cost, path } = queue.shift()!;
    nodeStates[u] = 'active';

    steps.push({
      stepIndex: steps.length,
      cppLine: 12,
      description: `Dequeue flight itinerary: Arrived at city ${u} with total price $${cost} after ${stops} stop(s).`,
      phase: 'City Dequeue',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      activeNodeId: u,
      variables: { City: u, Price: `$${cost}`, 'Stops Used': stops, 'Max Allowed': kStops },
      dataStructure: {
        type: 'queue',
        title: 'Flight Queue (stops, city, cost)',
        items: queue.map(q => ({ label: q.u, value: `$${q.cost}`, badge: `${q.stops} stops` }))
      }
    });

    if (u === safeTarget) {
      if (!bestRoute || cost < bestRoute.cost) {
        bestRoute = { cost, path };
      }
    }

    if (stops > kStops) {
      steps.push({
        stepIndex: steps.length,
        cppLine: 14,
        description: `Stop budget exceeded! Stops ${stops} > K (${kStops}). Do not expand flights from ${u}.`,
        phase: 'Budget Limit',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        activeNodeId: u,
        dataStructure: {
          type: 'queue',
          title: 'Flight Queue',
          items: queue.map(q => ({ label: q.u, value: `$${q.cost}` }))
        }
      });
      continue;
    }

    const flights = adj[u] || [];
    for (const { to: v, edgeId, weight: price } of flights) {
      const newCost = cost + price;
      if (newCost < minCost[v]) {
        minCost[v] = newCost;
        queue.push({ stops: stops + 1, u: v, cost: newCost, path: [...path, v] });
        edgeStates[edgeId] = 'evaluating';

        steps.push({
          stepIndex: steps.length,
          cppLine: 17,
          description: `Relax flight ${u} -> ${v} (Price $${price}): New cost to reach ${v} is $${newCost} within ${stops} stop(s). Enqueue itinerary.`,
          phase: 'Flight Relax',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: v,
          activeEdgeId: edgeId,
          variables: { 'Next City': v, 'Ticket Price': `$${price}`, 'Total Cost': `$${newCost}` },
          dataStructure: {
            type: 'queue',
            title: 'Flight Queue (stops, city, cost)',
            items: queue.map(q => ({ label: q.u, value: `$${q.cost}`, badge: `${q.stops} stops` }))
          }
        });
      }
    }

    nodeStates[u] = 'visited';
  }

  if (bestRoute) {
    // Mark optimal path
    for (let i = 0; i < bestRoute.path.length - 1; i++) {
      const u = bestRoute.path[i];
      const v = bestRoute.path[i + 1];
      nodeStates[u] = 'path';
      nodeStates[v] = 'path';
      const edge = graph.edges.find(e => (e.source === u && e.target === v) || (!graph.isDirected && e.source === v && e.target === u));
      if (edge) edgeStates[edge.id] = 'path';
    }

    steps.push({
      stepIndex: steps.length,
      cppLine: 24,
      description: `SUCCESS! Cheapest flight from ${safeStart} to ${safeTarget} within ${kStops} stop(s) is $${bestRoute.cost} via: ${bestRoute.path.join(' -> ')}.`,
      phase: 'Optimal Route Found',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      flightsCost: bestRoute.cost,
      stopsTaken: bestRoute.path.length - 2,
      variables: { 'Cheapest Cost': `$${bestRoute.cost}`, 'Itinerary': bestRoute.path.join(' -> ') },
      dataStructure: {
        type: 'queue',
        title: 'Optimal Flight Itinerary',
        items: bestRoute.path.map((city, idx) => ({ label: city, badge: idx === 0 ? 'Origin' : idx === bestRoute!.path.length - 1 ? 'Destination' : 'Layover' }))
      }
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      cppLine: 24,
      description: `NO ROUTE FOUND! Destination ${safeTarget} cannot be reached within ${kStops} layover stop(s). Returns -1.`,
      phase: 'No Route (-1)',
      cycleDetected: true,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: { 'Result': -1 },
      dataStructure: {
        type: 'queue',
        title: 'No Route Result',
        items: [{ label: 'Result', value: -1, badge: 'UNREACHABLE' }]
      }
    });
  }

  return steps;
}

// -------------------------------------------------------------
// 6. COVID-19 Viral Spread & Contact Tracing
// -------------------------------------------------------------
export function generateCovidSpreadSteps(
  graph: GraphData,
  startNodeId: string,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const safeP0 = graph.nodes.find(n => n.id === startNodeId)?.id || graph.nodes[0]?.id || 'A';
  const adj = getAdjacency(graph, false);

  const infected = new Set<string>([safeP0]);
  let currentQueue: string[] = [safeP0];
  let day = 0;

  nodeStates[safeP0] = 'infected';

  steps.push({
    stepIndex: steps.length,
    cppLine: 3,
    description: `Day 0 Outbreak: Patient Zero identified at individual ${safeP0}. Contagion wave begins.`,
    phase: 'Patient Zero',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited, [safeP0]: true },
    activeNodeId: safeP0,
    covidStats: { infected: 1, healthy: graph.nodes.length - 1, day: 0 },
    variables: { Day: 0, 'Patient Zero': safeP0, Infected: 1, 'Susceptible Contacts': graph.nodes.length - 1 },
    dataStructure: {
      type: 'queue',
      title: 'Infection Queue (Day 0)',
      items: [{ label: `Patient Zero (${safeP0})`, badge: 'Infected' }]
    }
  });

  while (currentQueue.length > 0) {
    const nextQueue: string[] = [];
    day++;

    steps.push({
      stepIndex: steps.length,
      cppLine: 10,
      description: `Day ${day}: Active infected cluster size = ${currentQueue.length}. Tracing transmission along social contact edges.`,
      phase: `Day ${day} Spread`,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      covidStats: { infected: infected.size, healthy: graph.nodes.length - infected.size, day },
      dataStructure: {
        type: 'queue',
        title: `Active Spreaders (Day ${day})`,
        items: currentQueue.map(id => ({ label: `Infected ${id}`, badge: 'Active Carrier' }))
      }
    });

    for (const u of currentQueue) {
      const contacts = adj[u] || [];
      for (const { to: v, edgeId } of contacts) {
        if (!infected.has(v)) {
          infected.add(v);
          nextQueue.push(v);
          nodeStates[v] = 'infected';
          edgeStates[edgeId] = 'bridge'; // viral transmission path

          steps.push({
            stepIndex: steps.length,
            cppLine: 16,
            description: `Transmission event! Host ${u} transmits viral infection to contact ${v} via social edge.`,
            phase: 'Contact Infection',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...visited, [v]: true },
            activeNodeId: v,
            activeEdgeId: edgeId,
            covidStats: { infected: infected.size, healthy: graph.nodes.length - infected.size, day },
            variables: { 'Spreader': u, 'Newly Infected': v, 'Day': day, 'Total Cases': infected.size },
            dataStructure: {
              type: 'queue',
              title: `Day ${day} Infections`,
              items: nextQueue.map(id => ({ label: id, badge: 'New Infection' }))
            }
          });
        }
      }
    }

    currentQueue = nextQueue;
  }

  const uninfectedCount = graph.nodes.length - infected.size;
  // Mark remaining healthy as quarantined
  graph.nodes.forEach(n => {
    if (!infected.has(n.id)) {
      nodeStates[n.id] = 'quarantined';
    }
  });

  steps.push({
    stepIndex: steps.length,
    cppLine: 25,
    description: `Epidemic Stabilized! In ${day - 1} day(s), total ${infected.size}/${graph.nodes.length} individuals were infected. ${uninfectedCount} uninfected individual(s) protected via quarantine.`,
    phase: 'Containment',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    covidStats: { infected: infected.size, healthy: uninfectedCount, day: day - 1 },
    variables: { 'Total Days': day - 1, 'Infected Count': infected.size, 'Quarantined Clean': uninfectedCount },
    dataStructure: {
      type: 'queue',
      title: 'Epidemic Summary',
      items: [
        { label: 'Infected Total', value: `${infected.size} people`, badge: 'Infected' },
        { label: 'Protected Contacts', value: `${uninfectedCount} people`, badge: 'Quarantined' },
        { label: 'Days to Stabilize', value: `${day - 1} days`, badge: 'Done' }
      ]
    }
  });

  return steps;
}

// -------------------------------------------------------------
// 7. Course Schedule I & II (LeetCode 207 & 210)
// -------------------------------------------------------------
export function generateCourseScheduleSteps(
  graph: GraphData,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const numCourses = graph.nodes.length;
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  graph.nodes.forEach(n => {
    inDegree[n.id] = 0;
    adj[n.id] = [];
  });

  graph.edges.forEach(e => {
    // Directed prerequisite edge: e.source -> e.target
    if (adj[e.source]) adj[e.source].push(e.target);
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  steps.push({
    stepIndex: steps.length,
    cppLine: 2,
    description: `Initialize Course Schedule Kahn's Algorithm. Compute prerequisite requirements (in-degree) for all ${numCourses} courses.`,
    phase: 'Calculate In-Degrees',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    dataStructure: {
      type: 'indegree',
      title: 'Course Prerequisites (In-Degrees)',
      items: Object.keys(inDegree).map(c => ({
        label: c,
        value: `${inDegree[c]} prereq(s)`,
        badge: inDegree[c] === 0 ? 'Ready' : 'Locked'
      })),
      inDegrees: { ...inDegree }
    }
  });

  const queue: string[] = [];
  for (const node of graph.nodes) {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
      nodeStates[node.id] = 'active';
    }
  }

  steps.push({
    stepIndex: steps.length,
    cppLine: 9,
    description: `Enqueue ${queue.length} entry-level course(s) having 0 prerequisites: [${queue.join(', ')}].`,
    phase: 'Enqueue Ready Courses',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    dataStructure: {
      type: 'queue',
      title: 'Kahn Prerequisite Queue',
      items: queue.map(c => ({ label: c, status: 'queued' }))
    }
  });

  const order: string[] = [];

  while (queue.length > 0) {
    const course = queue.shift()!;
    order.push(course);
    nodeStates[course] = 'visited';

    steps.push({
      stepIndex: steps.length,
      cppLine: 13,
      description: `Complete course ${course}! Course graduation order: [${order.join(' -> ')}]. Unlock its dependent courses.`,
      phase: 'Course Completed',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited, [course]: true },
      activeNodeId: course,
      topoOrder: [...order],
      variables: { Completed: course, 'Total Completed': order.length },
      dataStructure: {
        type: 'queue',
        title: 'Courses Completed Order',
        items: order.map((c, i) => ({ label: `#${i + 1}`, value: c, badge: 'Graduated' }))
      }
    });

    const dependents = adj[course] || [];
    for (const dep of dependents) {
      inDegree[dep]--;
      const edge = graph.edges.find(e => e.source === course && e.target === dep);
      if (edge) edgeStates[edge.id] = 'tree';

      if (inDegree[dep] === 0) {
        queue.push(dep);
        nodeStates[dep] = 'active';

        steps.push({
          stepIndex: steps.length,
          cppLine: 18,
          description: `All prerequisites for course ${dep} are now satisfied! Enqueue ${dep}.`,
          phase: 'Prerequisite Satisfied',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: dep,
          topoOrder: [...order],
          dataStructure: {
            type: 'queue',
            title: 'Kahn Prerequisite Queue',
            items: queue.map(c => ({ label: c, status: 'queued' }))
          }
        });
      }
    }
  }

  const canFinish = order.length === numCourses;

  if (canFinish) {
    // Mark all as path
    graph.nodes.forEach(n => { nodeStates[n.id] = 'path'; });

    steps.push({
      stepIndex: steps.length,
      cppLine: 24,
      description: `Curriculum Validated! All ${numCourses} courses can be finished. Recommended graduation sequence: ${order.join(' -> ')}.`,
      phase: 'Graduation Approved',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      topoOrder: order,
      variables: { 'Can Finish': 'TRUE', 'Total Courses': numCourses },
      dataStructure: {
        type: 'indegree',
        title: 'Final Course Order',
        items: order.map((c, idx) => ({ label: `#${idx + 1}`, value: c, badge: 'Graduated' }))
      }
    });
  } else {
    // Deadlock cycle!
    graph.nodes.forEach(n => {
      if (!order.includes(n.id)) {
        nodeStates[n.id] = 'cycle';
      }
    });

    steps.push({
      stepIndex: steps.length,
      cppLine: 24,
      description: `DEADLOCK DETECTED! Only ${order.length}/${numCourses} courses could be taken. Circular prerequisite dependency trapped the remaining courses: [${graph.nodes.filter(n => !order.includes(n.id)).map(n => n.id).join(', ')}].`,
      phase: 'Cycle Deadlock (-1)',
      cycleDetected: true,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: { 'Can Finish': 'FALSE', 'Completed': order.length, 'Trapped': numCourses - order.length },
      dataStructure: {
        type: 'indegree',
        title: 'Circular Dependency Deadlock',
        items: [{ label: 'Circular Trap', value: `${numCourses - order.length} courses locked`, badge: 'CYCLE' }]
      }
    });
  }

  return steps;
}

// -------------------------------------------------------------
// 8. Cycle Detection in Undirected Graph (BFS Parent Tracking)
// -------------------------------------------------------------
export function generateCycleUndirectedSteps(
  graph: GraphData,
  startNodeId: string,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const adj = getAdjacency(graph, false);
  const parentMap: Record<string, string | null> = {};
  graph.nodes.forEach(n => { parentMap[n.id] = null; });

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `Initialize Undirected Cycle Detection via BFS. Queue stores pairs {node, parent} to detect non-parent back-edges.`,
    phase: 'Initialization',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    dataStructure: {
      type: 'queue',
      title: 'Queue {node, parent}',
      items: []
    }
  });

  const allNodeIds = graph.nodes.map(n => n.id);
  const preferredStart = allNodeIds.includes(startNodeId) ? startNodeId : allNodeIds[0];
  const orderedNodes = [preferredStart, ...allNodeIds.filter(id => id !== preferredStart)];

  let cycleFound = false;

  for (const src of orderedNodes) {
    if (cycleFound) break;
    if (visited[src]) continue;

    visited[src] = true;
    nodeStates[src] = 'active';
    parentMap[src] = '-1';
    const queue: Array<{ node: string; parent: string }> = [{ node: src, parent: '-1' }];

    steps.push({
      stepIndex: steps.length,
      cppLine: 2,
      description: `Start component BFS from node ${src}. Set visited[${src}] = true, parent = -1 (root).`,
      phase: 'Component Start',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      activeNodeId: src,
      variables: { current: src, parent: '-1' },
      dataStructure: {
        type: 'queue',
        title: 'Queue {node, parent}',
        items: queue.map(item => ({ label: `${item.node} (par: ${item.parent})`, badge: 'Front' }))
      }
    });

    while (queue.length > 0) {
      const { node: u, parent: p } = queue.shift()!;
      nodeStates[u] = 'visited';

      steps.push({
        stepIndex: steps.length,
        cppLine: 7,
        description: `Pop front: inspecting node ${u} (came from parent: ${p}). Inspecting its undirected neighbors.`,
        phase: 'Expand Node',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        activeNodeId: u,
        variables: { node: u, parent: p, queueSize: queue.length },
        dataStructure: {
          type: 'queue',
          title: 'Queue {node, parent}',
          items: queue.map(item => ({ label: `${item.node} (par: ${item.parent})`, badge: 'Queued' }))
        }
      });

      const neighbors = adj[u] || [];
      for (const { to: v, edgeId } of neighbors) {
        if (!visited[v]) {
          visited[v] = true;
          parentMap[v] = u;
          nodeStates[v] = 'testing';
          edgeStates[edgeId] = 'tree';
          queue.push({ node: v, parent: u });

          steps.push({
            stepIndex: steps.length,
            cppLine: 11,
            description: `Neighbor ${v} is unvisited. Set visited[${v}] = true, parent[${v}] = ${u}, and push {${v}, ${u}} into queue.`,
            phase: 'Visit Unvisited',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            activeNodeId: v,
            activeEdgeId: edgeId,
            variables: { node: u, neighbor: v, 'parent[v]': u },
            dataStructure: {
              type: 'queue',
              title: 'Queue {node, parent}',
              items: queue.map(item => ({ label: `${item.node} (par: ${item.parent})`, badge: 'Queued' }))
            }
          });
        } else if (v !== p) {
          // Visited neighbor that is NOT parent => Cycle!
          cycleFound = true;
          nodeStates[u] = 'cycle';
          nodeStates[v] = 'cycle';
          edgeStates[edgeId] = 'cycle';

          steps.push({
            stepIndex: steps.length,
            cppLine: 14,
            description: `CYCLE DETECTED! Neighbor ${v} is already VISITED and is NOT parent (${p})! Edge (${u} ↔ ${v}) forms an undirected cycle!`,
            phase: 'Cycle Found!',
            cycleDetected: true,
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            activeNodeId: u,
            activeEdgeId: edgeId,
            variables: { 'Cycle Node A': u, 'Cycle Node B': v, 'Current Parent': p, 'Cycle Status': 'DETECTED' },
            dataStructure: {
              type: 'queue',
              title: 'Undirected Cycle Detected',
              items: [
                { label: `Cycle Vertex ${u}`, badge: 'Cycle' },
                { label: `Cycle Vertex ${v}`, badge: 'Cycle' },
                { label: `Closing Edge (${u} ↔ ${v})`, badge: 'Loop' }
              ]
            }
          });
          break;
        }
      }

      if (cycleFound) break;
    }
  }

  if (!cycleFound) {
    steps.push({
      stepIndex: steps.length,
      cppLine: 18,
      description: `All components traversed without any non-parent back-edges. The undirected graph is ACYCLIC (a Tree/Forest).`,
      phase: 'No Cycle (Acyclic)',
      cycleDetected: false,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: { 'Cycle Status': 'NONE (Acyclic)' },
      dataStructure: {
        type: 'queue',
        title: 'Acyclic Forest Result',
        items: [{ label: 'Status', value: 'No Cycle Found', badge: 'Clean' }]
      }
    });
  }

  return steps;
}

// -------------------------------------------------------------
// 9. Cycle Detection in Directed Graph (DFS Recursion Stack)
// -------------------------------------------------------------
export function generateCycleDirectedSteps(
  graph: GraphData,
  startNodeId: string,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const adj = getAdjacency(graph, true);
  const pathVis: Record<string, boolean> = {};
  graph.nodes.forEach(n => { pathVis[n.id] = false; });

  const callStack: string[] = [];
  let cycleFound = false;

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `Initialize Directed Cycle Detection. vis[u] tracks global completion, pathVis[u] tracks nodes currently in active recursion stack.`,
    phase: 'Initialization',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    dataStructure: {
      type: 'stack',
      title: 'Recursion Call Stack (pathVis)',
      items: []
    }
  });

  const allNodeIds = graph.nodes.map(n => n.id);
  const preferredStart = allNodeIds.includes(startNodeId) ? startNodeId : allNodeIds[0];
  const orderedNodes = [preferredStart, ...allNodeIds.filter(id => id !== preferredStart)];

  function dfs(u: string): boolean {
    if (cycleFound) return true;

    visited[u] = true;
    pathVis[u] = true;
    callStack.push(u);
    nodeStates[u] = 'active';

    steps.push({
      stepIndex: steps.length,
      cppLine: 3,
      description: `Enter DFS(${u}): set vis[${u}] = 1 and push into recursion pathVis stack: [${callStack.join(' → ')}].`,
      phase: 'Push Stack',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      activeNodeId: u,
      variables: { u, 'Recursion Depth': callStack.length },
      dataStructure: {
        type: 'stack',
        title: 'Active Path Stack (pathVis)',
        items: [...callStack].reverse().map(id => ({ label: id, status: 'active', badge: 'In Path' }))
      }
    });

    const neighbors = adj[u] || [];
    for (const { to: v, edgeId } of neighbors) {
      if (!visited[v]) {
        edgeStates[edgeId] = 'tree';

        steps.push({
          stepIndex: steps.length,
          cppLine: 6,
          description: `Traversing tree-edge ${u} → ${v}: neighbor ${v} is unvisited. Recursing deeper.`,
          phase: 'Descend Branch',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: v,
          activeEdgeId: edgeId,
          dataStructure: {
            type: 'stack',
            title: 'Active Path Stack (pathVis)',
            items: [...callStack].reverse().map(id => ({ label: id, badge: 'In Path' }))
          }
        });

        if (dfs(v)) return true;
      } else if (pathVis[v]) {
        // Back-edge found! Directed cycle detected!
        cycleFound = true;
        nodeStates[u] = 'cycle';
        nodeStates[v] = 'cycle';
        edgeStates[edgeId] = 'cycle';

        const cycleNodes = callStack.slice(callStack.indexOf(v));
        cycleNodes.forEach(c => { nodeStates[c] = 'cycle'; });

        steps.push({
          stepIndex: steps.length,
          cppLine: 9,
          description: `DIRECTED CYCLE DETECTED! Edge ${u} → ${v} is a BACK-EDGE pointing to ancestor ${v} currently in active recursion stack! Cycle: [${cycleNodes.join(' → ')} → ${v}].`,
          phase: 'Back-Edge Found!',
          cycleDetected: true,
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          activeEdgeId: edgeId,
          variables: { 'Back-Edge Source': u, 'Cycle Target': v, 'Cycle Loop': `${cycleNodes.join(' → ')} → ${v}` },
          dataStructure: {
            type: 'stack',
            title: 'Directed Cycle Loop',
            items: cycleNodes.map(id => ({ label: id, badge: 'Cycle Loop' }))
          }
        });
        return true;
      }
    }

    // Backtrack
    pathVis[u] = false;
    callStack.pop();
    nodeStates[u] = 'visited';

    steps.push({
      stepIndex: steps.length,
      cppLine: 13,
      description: `Backtracking from node ${u}: all outgoing paths explored with no cycle. Pop ${u} from pathVis stack.`,
      phase: 'Backtrack',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      activeNodeId: u,
      variables: { u, 'Recursion Depth': callStack.length },
      dataStructure: {
        type: 'stack',
        title: 'Active Path Stack (pathVis)',
        items: [...callStack].reverse().map(id => ({ label: id, badge: 'In Path' }))
      }
    });

    return false;
  }

  for (const src of orderedNodes) {
    if (cycleFound) break;
    if (!visited[src]) {
      dfs(src);
    }
  }

  if (!cycleFound) {
    steps.push({
      stepIndex: steps.length,
      cppLine: 14,
      description: `All directed branches fully explored. No back-edges detected. The directed graph is a valid DAG (Directed Acyclic Graph)!`,
      phase: 'Valid DAG (Acyclic)',
      cycleDetected: false,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: { 'DAG Status': 'VALID DAG (No Cycles)' },
      dataStructure: {
        type: 'stack',
        title: 'Result: DAG Verified',
        items: [{ label: 'Cycle Status', value: 'None (Acyclic)', badge: 'DAG' }]
      }
    });
  }

  return steps;
}

// -------------------------------------------------------------
// 10. Circle of Strings (Eulerian Tour on Words)
// -------------------------------------------------------------
export function generateCircleOfStringsSteps(
  graph: GraphData,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  // In Circle of Strings:
  // Each directed edge represents a string, from firstChar -> lastChar
  // If graph.edges have weights or IDs, we extract or map string words
  const words: Array<{ edgeId: string; word: string; u: string; v: string }> = graph.edges.map((e, idx) => {
    // Generate an illustrative word if not provided
    const uChar = e.source.toLowerCase();
    const vChar = e.target.toLowerCase();
    const sampleWord = `${uChar}${idx % 2 === 0 ? 'o' : 'i'}${vChar}`;
    return { edgeId: e.id, word: sampleWord, u: e.source, v: e.target };
  });

  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  graph.nodes.forEach(n => {
    inDegree[n.id] = 0;
    outDegree[n.id] = 0;
  });

  words.forEach(w => {
    outDegree[w.u] = (outDegree[w.u] || 0) + 1;
    inDegree[w.v] = (inDegree[w.v] || 0) + 1;
  });

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `Circle of Strings Problem: Given string words as directed edges from first character to last character. A circle exists iff in-degree equals out-degree for all characters AND all active characters form a single connected component.`,
    phase: 'Problem Setup',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    wordChain: words.map(w => w.word),
    dataStructure: {
      type: 'indegree',
      title: 'Character Degrees & Words',
      items: words.map(w => ({ label: w.word, value: `${w.u} → ${w.v}`, badge: 'Edge' }))
    }
  });

  // Step 1: Degree Balance Check
  steps.push({
    stepIndex: steps.length,
    cppLine: 12,
    description: `Condition 1 Validation: Compute in-degree and out-degree for each character vertex. Checking inDegree[c] == outDegree[c].`,
    phase: 'Degree Balance Check',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    variables: Object.fromEntries(graph.nodes.map(n => [`deg(${n.id})`, `In:${inDegree[n.id]}, Out:${outDegree[n.id]}`])),
    dataStructure: {
      type: 'indegree',
      title: 'In-Degree vs Out-Degree Table',
      items: graph.nodes.map(n => ({
        label: `Char '${n.id}'`,
        value: `In: ${inDegree[n.id]} | Out: ${outDegree[n.id]}`,
        badge: inDegree[n.id] === outDegree[n.id] ? 'Balanced' : 'MISMATCH'
      }))
    }
  });

  const degreesBalanced = graph.nodes.every(n => inDegree[n.id] === outDegree[n.id]);

  if (!degreesBalanced) {
    const mismatched = graph.nodes.filter(n => inDegree[n.id] !== outDegree[n.id]);
    mismatched.forEach(n => { nodeStates[n.id] = 'cycle'; });

    steps.push({
      stepIndex: steps.length,
      cppLine: 14,
      description: `Circle of Strings is IMPOSSIBLE! Degree balance condition failed for character(s): [${mismatched.map(m => `'${m.id}'`).join(', ')}]. A closed circular chain requires equal in-degree and out-degree.`,
      phase: 'Degree Mismatch Failed',
      cycleDetected: false,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: { 'Eulerian Condition 1': 'FAILED', 'Degree Balance': 'False' },
      dataStructure: {
        type: 'indegree',
        title: 'Degree Failure',
        items: mismatched.map(m => ({ label: `Mismatch '${m.id}'`, value: `In:${inDegree[m.id]} ≠ Out:${outDegree[m.id]}`, badge: 'ERROR' }))
      }
    });
    return steps;
  }

  // Step 2: Connectivity Check via forward traversal
  const adj = getAdjacency(graph, true);
  const startChar = graph.nodes[0]?.id || 'A';
  const reachSet = new Set<string>();
  const queue = [startChar];
  reachSet.add(startChar);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const { to: nxt, edgeId } of (adj[cur] || [])) {
      if (!reachSet.has(nxt)) {
        reachSet.add(nxt);
        queue.push(nxt);
        edgeStates[edgeId] = 'tree';
      }
    }
  }

  const isConnected = graph.nodes.every(n => (outDegree[n.id] === 0 && inDegree[n.id] === 0) || reachSet.has(n.id));

  if (!isConnected) {
    steps.push({
      stepIndex: steps.length,
      cppLine: 19,
      description: `Connectivity condition FAILED! Graph is partitioned into disconnected sub-components. A single circle of strings cannot connect all words.`,
      phase: 'Disconnected Components',
      cycleDetected: false,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      dataStructure: {
        type: 'components',
        title: 'Disconnected Word Clusters',
        items: [{ label: 'Connectivity', value: 'Multiple SCCs', badge: 'FAILED' }]
      }
    });
    return steps;
  }

  // Step 3: Construct the circle of words
  graph.nodes.forEach(n => { nodeStates[n.id] = 'path'; });
  graph.edges.forEach(e => { edgeStates[e.id] = 'path'; });

  const wordSequence = words.map(w => w.word);

  steps.push({
    stepIndex: steps.length,
    cppLine: 19,
    description: `SUCCESS! Circle of Strings is VALID! Both degree balance and strong connectivity conditions are satisfied. Closed word loop: [${wordSequence.join(' → ')} → (back to '${words[0]?.word}')].`,
    phase: 'Circle of Strings Verified',
    cycleDetected: true,
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    wordChain: wordSequence,
    variables: { 'Circle Possible': 'YES (1)', 'Total Strings': words.length, 'Loop Chain': wordSequence.join(' → ') },
    dataStructure: {
      type: 'indegree',
      title: 'Valid Circle of Strings Chain',
      items: words.map((w, idx) => ({ label: `Word #${idx + 1}`, value: w.word, badge: `${w.u} → ${w.v}` }))
    }
  });

  return steps;
}

// -------------------------------------------------------------
// 11. Course Schedule II (LeetCode 210 • findOrder)
// -------------------------------------------------------------
export function generateCourseSchedule2Steps(
  graph: GraphData,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited = { ...initVisited };

  const numCourses = graph.nodes.length;
  const adj: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  graph.nodes.forEach(n => {
    adj[n.id] = [];
    inDegree[n.id] = 0;
  });

  graph.edges.forEach(e => {
    adj[e.source].push(e.target);
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  const order: string[] = [];

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `LeetCode 210 • Course Schedule II: findOrder(numCourses = ${numCourses}, prerequisites). Goal: return a valid course sequence vector<int> to graduate, or return empty array [] if a circular prerequisite cycle exists.`,
    phase: 'Problem Setup (LC 210)',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    variables: { numCourses, 'ans': '[]' },
    dataStructure: {
      type: 'indegree',
      title: 'Course Prerequisites (In-Degrees)',
      items: Object.keys(inDegree).map(c => ({
        label: `Course ${c}`,
        value: `${inDegree[c]} prereq(s)`,
        badge: inDegree[c] === 0 ? 'Ready' : 'Locked'
      })),
      inDegrees: { ...inDegree }
    }
  });

  steps.push({
    stepIndex: steps.length,
    cppLine: 5,
    description: `Construct graph and calculate prerequisite counts: inDegree[v] represents number of unfinished prerequisite courses required before taking v.`,
    phase: 'In-Degrees Computed',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    variables: { 'Prerequisite Table': `${numCourses} courses analyzed`, 'ans': '[]' },
    dataStructure: {
      type: 'indegree',
      title: 'Prerequisite Counts (inDegree)',
      items: Object.keys(inDegree).map(c => ({
        label: `Course ${c}`,
        value: `${inDegree[c]} prereq(s)`,
        badge: inDegree[c] === 0 ? '0 Prereq (Ready)' : `${inDegree[c]} Prereq(s)`
      })),
      inDegrees: { ...inDegree }
    }
  });

  const queue: string[] = [];
  for (const node of graph.nodes) {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
      nodeStates[node.id] = 'active';
    }
  }

  steps.push({
    stepIndex: steps.length,
    cppLine: 10,
    description: `Initialize Kahn's BFS Queue: Enqueue ${queue.length} course(s) with inDegree == 0 (no prerequisites needed): [${queue.join(', ')}].`,
    phase: 'Enqueue Ready Courses',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    variables: { 'Queue Size': queue.length, 'ans': '[]' },
    dataStructure: {
      type: 'queue',
      title: "Kahn's Ready Queue",
      items: queue.map(c => ({ label: `Course ${c}`, status: 'active', badge: 'Ready' }))
    }
  });

  while (queue.length > 0) {
    const course = queue.shift()!;
    order.push(course);
    nodeStates[course] = 'visited';

    steps.push({
      stepIndex: steps.length,
      cppLine: 15,
      description: `Pop Course ${course} from queue and append to graduation order vector: ans.push_back(${course}). Current ans = [${order.join(', ')}].`,
      phase: 'Add to findOrder Result',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited, [course]: true },
      activeNodeId: course,
      topoOrder: [...order],
      variables: { 'Current Course': course, 'ans (Order)': `[${order.join(', ')}]`, 'Courses Completed': `${order.length}/${numCourses}` },
      dataStructure: {
        type: 'queue',
        title: 'Graduation Order: ans Vector',
        items: order.map((c, i) => ({ label: `Step ${i + 1}`, value: `Course ${c}`, badge: 'Graduated' }))
      }
    });

    const dependents = adj[course] || [];
    for (const dep of dependents) {
      inDegree[dep]--;
      const edge = graph.edges.find(e => e.source === course && e.target === dep);
      if (edge) edgeStates[edge.id] = 'tree';

      if (inDegree[dep] === 0) {
        queue.push(dep);
        nodeStates[dep] = 'active';

        steps.push({
          stepIndex: steps.length,
          cppLine: 18,
          description: `Decremented prerequisite for Course ${dep}. All prerequisites for ${dep} are now SATISFIED (inDegree == 0)! Push Course ${dep} into queue.`,
          phase: 'Unlock Dependent Course',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: dep,
          topoOrder: [...order],
          variables: { 'Unlocked Course': dep, 'ans': `[${order.join(', ')}]` },
          dataStructure: {
            type: 'queue',
            title: "Kahn's Ready Queue",
            items: queue.map(c => ({ label: `Course ${c}`, status: 'queued', badge: 'Prereq Met' }))
          }
        });
      }
    }
  }

  const canFinish = order.length === numCourses;

  if (canFinish) {
    graph.nodes.forEach(n => { nodeStates[n.id] = 'path'; });

    steps.push({
      stepIndex: steps.length,
      cppLine: 24,
      description: `SUCCESS! All ${numCourses} courses successfully ordered without cycle conflict! findOrder returns valid sequence: [${order.join(', ')}].`,
      phase: 'findOrder: Valid Schedule Returned',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      topoOrder: order,
      variables: {
        'Return Value': `[${order.join(', ')}]`,
        'Total Courses': numCourses,
        'Curriculum Status': 'VALID (No Cycles)'
      },
      dataStructure: {
        type: 'indegree',
        title: 'Final Graduation Order (ans)',
        items: order.map((c, idx) => ({ label: `Order #${idx + 1}`, value: `Course ${c}`, badge: 'Completed' }))
      }
    });
  } else {
    // Deadlock cycle detected!
    const trapped = graph.nodes.filter(n => !order.includes(n.id)).map(n => n.id);
    graph.nodes.forEach(n => {
      if (!order.includes(n.id)) {
        nodeStates[n.id] = 'cycle';
      }
    });

    steps.push({
      stepIndex: steps.length,
      cppLine: 26,
      description: `CIRCULAR DEPENDENCY DEADLOCK DETECTED! Only ${order.length} of ${numCourses} courses could be scheduled. Trapped courses in cycle: [${trapped.join(', ')}]. Per LeetCode 210 specification, findOrder returns EMPTY ARRAY: []!`,
      phase: 'findOrder: Returns [] (Cycle)',
      cycleDetected: true,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: {
        'Return Value': '[] (Empty Vector)',
        'Reason': 'Circular Prerequisite Cycle',
        'Courses Completed': order.length,
        'Trapped Courses': `[${trapped.join(', ')}]`
      },
      dataStructure: {
        type: 'indegree',
        title: 'Cycle Detected -> Returns []',
        items: [
          { label: 'Return', value: '[] (Empty Array)', badge: 'LeetCode 210' },
          { label: 'Cycle Nodes', value: trapped.join(', '), badge: 'LOCKED' }
        ]
      }
    });
  }

  return steps;
}

// -------------------------------------------------------------
// 12. Word Ladder I (LeetCode 127 • Shortest Transformation BFS)
// -------------------------------------------------------------
export function generateWordLadderSteps(
  graph: GraphData,
  startWord: string,
  targetWord: string,
  initVisited: Record<string, boolean>,
  initNodeStates: Record<string, NodeVisualStatus>,
  initEdgeStates: Record<string, EdgeVisualStatus>
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeStates = { ...initNodeStates };
  const edgeStates = { ...initEdgeStates };
  const visited: Record<string, boolean> = { ...initVisited };

  const start = graph.nodes.find(n => n.id === startWord)?.id || graph.nodes[0]?.id || 'hit';
  const target = graph.nodes.find(n => n.id === targetWord)?.id || graph.nodes[graph.nodes.length - 1]?.id || 'cog';

  // Build adjacency list for words
  const adj: Record<string, string[]> = {};
  graph.nodes.forEach(n => { adj[n.id] = []; });
  graph.edges.forEach(e => {
    adj[e.source].push(e.target);
    if (!graph.isDirected && !e.directed) {
      adj[e.target].push(e.source);
    }
  });

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `LeetCode 127 • Word Ladder: Transform beginWord "${start}" to endWord "${target}". Each step changes exactly 1 letter. Find length of shortest transformation sequence using BFS.`,
    phase: 'Problem Setup (LC 127)',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    variables: { 'beginWord': `"${start}"`, 'endWord': `"${target}"`, 'Level': 1, 'Total Words': graph.nodes.length },
    dataStructure: {
      type: 'queue',
      title: 'Word Ladder BFS Queue',
      items: [{ label: `"${start}"`, value: 'Level 1', status: 'queued', badge: 'Start' }]
    }
  });

  const queue: Array<{ word: string; level: number; path: string[] }> = [
    { word: start, level: 1, path: [start] }
  ];
  visited[start] = true;
  nodeStates[start] = 'active';

  steps.push({
    stepIndex: steps.length,
    cppLine: 6,
    description: `Push beginWord "${start}" into BFS queue at Level 1. Erase "${start}" from available dictionary.`,
    phase: 'Queue Initialized',
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    visited: { ...visited },
    activeNodeId: start,
    dataStructure: {
      type: 'queue',
      title: 'Word Ladder BFS Queue',
      items: [{ label: `"${start}"`, value: 'Level 1', status: 'active', badge: 'Current' }]
    }
  });

  let foundPath: string[] | null = null;
  let finalLevel = 0;

  while (queue.length > 0) {
    const { word, level, path } = queue.shift()!;
    nodeStates[word] = 'visited';

    steps.push({
      stepIndex: steps.length,
      cppLine: 10,
      description: `Pop "${word}" at Level ${level}. Current sequence: [${path.join(' → ')}]. Explore all 1-character mutated variants in dictionary.`,
      phase: `Level ${level} Inspection`,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      activeNodeId: word,
      variables: { 'Current Word': `"${word}"`, 'Current Level': level, 'Path So Far': path.join(' → ') },
      dataStructure: {
        type: 'queue',
        title: 'BFS Frontier Queue',
        items: queue.map(q => ({ label: `"${q.word}"`, value: `Level ${q.level}`, status: 'queued' }))
      }
    });

    if (word === target) {
      foundPath = path;
      finalLevel = level;
      break;
    }

    const neighbors = adj[word] || [];
    for (const nextWord of neighbors) {
      const edge = graph.edges.find(
        e => (e.source === word && e.target === nextWord) ||
             (!e.directed && e.source === nextWord && e.target === word)
      );

      if (!visited[nextWord]) {
        visited[nextWord] = true;
        nodeStates[nextWord] = 'active';
        if (edge) edgeStates[edge.id] = 'tree';

        const newPath = [...path, nextWord];
        queue.push({ word: nextWord, level: level + 1, path: newPath });

        steps.push({
          stepIndex: steps.length,
          cppLine: 19,
          description: `Mutate "${word}" by 1 letter to valid dictionary word "${nextWord}"! Enqueue "${nextWord}" at Level ${level + 1}.`,
          phase: '1-Letter Transformation',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: nextWord,
          activeEdgeId: edge?.id,
          variables: { 'Transformed To': `"${nextWord}"`, 'New Level': level + 1, 'Path': newPath.join(' → ') },
          dataStructure: {
            type: 'queue',
            title: 'BFS Frontier Queue',
            items: queue.map(q => ({ label: `"${q.word}"`, value: `Level ${q.level}`, status: 'queued' }))
          }
        });

        if (nextWord === target) {
          foundPath = newPath;
          finalLevel = level + 1;
          break;
        }
      }
    }

    if (foundPath) break;
  }

  if (foundPath) {
    // Highlight shortest ladder path
    foundPath.forEach(w => { nodeStates[w] = 'path'; });
    for (let i = 0; i < foundPath.length - 1; ++i) {
      const u = foundPath[i];
      const v = foundPath[i + 1];
      const edge = graph.edges.find(
        e => (e.source === u && e.target === v) || (!e.directed && e.source === v && e.target === u)
      );
      if (edge) edgeStates[edge.id] = 'path';
    }

    steps.push({
      stepIndex: steps.length,
      cppLine: 12,
      description: `SUCCESS! Reached endWord "${target}"! Shortest Word Ladder transformation length: ${finalLevel}. Sequence: [${foundPath.join(' → ')}].`,
      phase: 'Shortest Ladder Found',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      wordLadder: {
        beginWord: start,
        endWord: target,
        ladderLength: finalLevel,
        path: foundPath
      },
      variables: {
        'ladderLength': finalLevel,
        'Optimal Sequence': foundPath.join(' → '),
        'Start': `"${start}"`,
        'End': `"${target}"`
      },
      dataStructure: {
        type: 'queue',
        title: `Optimal Transformation (${finalLevel} words)`,
        items: foundPath.map((w, idx) => ({ label: `Step ${idx + 1}`, value: `"${w}"`, badge: idx === 0 ? 'Start' : idx === foundPath!.length - 1 ? 'Target' : 'Step' }))
      }
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      cppLine: 28,
      description: `Target word "${target}" is UNREACHABLE from "${start}" through the provided dictionary! Return 0 per LeetCode 127 specification.`,
      phase: 'Target Unreachable',
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      visited: { ...visited },
      variables: { 'ladderLength': 0, 'Status': 'No Valid Ladder Path' },
      dataStructure: {
        type: 'queue',
        title: 'Unreachable (Returns 0)',
        items: [{ label: 'Result', value: '0', badge: 'FAILED' }]
      }
    });
  }

  return steps;
}

// -------------------------------------------------------------
// 13. Word Search (LeetCode 79 • 2D Grid Backtracking DFS)
// -------------------------------------------------------------
export function generateWordSearchSteps(
  board: string[][],
  targetWord: string
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const rows = board.length;
  const cols = board[0].length;
  const word = targetWord.toUpperCase();

  const currentBoard: string[][] = board.map(row => [...row]);
  const path: [number, number][] = [];
  const visitedMatrix: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  steps.push({
    stepIndex: steps.length,
    cppLine: 1,
    description: `LeetCode 79 • Word Search: Search for word "${word}" (length ${word.length}) in ${rows}x${cols} board using 4-directional DFS Backtracking.`,
    phase: 'Problem Setup (LC 79)',
    nodeStates: {},
    edgeStates: {},
    visited: {},
    variables: { 'Word': `"${word}"`, 'Length': word.length, 'Board Size': `${rows}x${cols}` },
    wordSearchState: {
      board: currentBoard.map(r => [...r]),
      targetWord: word,
      matchedIndex: 0,
      path: []
    },
    dataStructure: {
      type: 'grid',
      title: `Word Search: "${word}"`,
      items: [{ label: 'Target', value: word, badge: 'Target Word' }]
    }
  });

  let found = false;

  function dfs(r: number, c: number, idx: number): boolean {
    if (idx === word.length) return true;

    if (r < 0 || r >= rows || c < 0 || c >= cols || visitedMatrix[r][c] || currentBoard[r][c] !== word[idx]) {
      return false;
    }

    // Match character!
    visitedMatrix[r][c] = true;
    path.push([r, c]);

    steps.push({
      stepIndex: steps.length,
      cppLine: 7,
      description: `Matched character '${word[idx]}' at cell [${r}, ${c}]! Current path: "${word.slice(0, idx + 1)}" (${idx + 1}/${word.length}). Mark cell visited.`,
      phase: `Matched '${word[idx]}' (Index ${idx})`,
      nodeStates: {},
      edgeStates: {},
      visited: {},
      variables: {
        'Cell': `[${r}, ${c}]`,
        'Char': `'${word[idx]}'`,
        'Progress': `${idx + 1}/${word.length}`,
        'Matched Substring': `"${word.slice(0, idx + 1)}"`
      },
      wordSearchState: {
        board: currentBoard.map(row => [...row]),
        targetWord: word,
        matchedIndex: idx + 1,
        currentCell: [r, c],
        path: [...path]
      },
      dataStructure: {
        type: 'grid',
        title: `Search Progress: ${idx + 1}/${word.length}`,
        items: path.map(([pr, pc], i) => ({
          label: `#${i + 1} (${pr},${pc})`,
          value: word[i],
          badge: 'Matched'
        }))
      }
    });

    if (idx === word.length - 1) {
      return true; // Completed entire word!
    }

    const dirs = [
      { dr: 0, dc: 1, name: 'RIGHT' },
      { dr: 1, dc: 0, name: 'DOWN' },
      { dr: 0, dc: -1, name: 'LEFT' },
      { dr: -1, dc: 0, name: 'UP' }
    ];

    for (const dir of dirs) {
      const nr = r + dir.dr;
      const nc = c + dir.dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visitedMatrix[nr][nc]) {
        if (currentBoard[nr][nc] === word[idx + 1]) {
          if (dfs(nr, nc, idx + 1)) return true;
        }
      }
    }

    // Backtracking
    visitedMatrix[r][c] = false;
    path.pop();

    steps.push({
      stepIndex: steps.length,
      cppLine: 16,
      description: `Dead end reached exploring from [${r}, ${c}] for next char '${word[idx + 1] || ''}'. BACKTRACK: unmark [${r}, ${c}] and restore state.`,
      phase: 'Backtracking Cell',
      nodeStates: {},
      edgeStates: {},
      visited: {},
      variables: {
        'Backtracked From': `[${r}, ${c}]`,
        'Restored Substring': `"${word.slice(0, idx)}"`
      },
      wordSearchState: {
        board: currentBoard.map(row => [...row]),
        targetWord: word,
        matchedIndex: idx,
        currentCell: [r, c],
        path: [...path]
      },
      dataStructure: {
        type: 'grid',
        title: 'Backtracking State',
        items: [{ label: 'Backtracked', value: `Cell [${r}, ${c}]`, badge: 'REVERT' }]
      }
    });

    return false;
  }

  // Scan board for first character
  for (let r = 0; r < rows && !found; ++r) {
    for (let c = 0; c < cols && !found; ++c) {
      if (currentBoard[r][c] === word[0]) {
        steps.push({
          stepIndex: steps.length,
          cppLine: 21,
          description: `Found first character '${word[0]}' at board cell [${r}, ${c}]. Begin DFS search branch.`,
          phase: 'Start DFS Candidate',
          nodeStates: {},
          edgeStates: {},
          visited: {},
          variables: { 'Candidate Start': `[${r}, ${c}]`, 'First Char': `'${word[0]}'` },
          wordSearchState: {
            board: currentBoard.map(row => [...row]),
            targetWord: word,
            matchedIndex: 0,
            currentCell: [r, c],
            path: []
          },
          dataStructure: {
            type: 'grid',
            title: `Candidate Start [${r}, ${c}]`,
            items: [{ label: 'Start Cell', value: `[${r}, ${c}] = '${word[0]}'`, badge: 'Candidate' }]
          }
        });

        if (dfs(r, c, 0)) {
          found = true;
          break;
        }
      }
    }
  }

  if (found) {
    steps.push({
      stepIndex: steps.length,
      cppLine: 24,
      description: `SUCCESS! Word "${word}" EXISTS on the board! Matching path verified: [${path.map(([r, c]) => `(${r},${c})`).join(' → ')}]. exist() returns true.`,
      phase: 'Word Exists (true)',
      nodeStates: {},
      edgeStates: {},
      visited: {},
      wordSearchState: {
        board: currentBoard.map(row => [...row]),
        targetWord: word,
        matchedIndex: word.length,
        path: [...path],
        found: true
      },
      variables: {
        'exist(board, word)': 'TRUE (1)',
        'Target Word': `"${word}"`,
        'Total Letters': word.length,
        'Path Coordinates': path.map(([r, c]) => `(${r},${c})`).join(' → ')
      },
      dataStructure: {
        type: 'grid',
        title: `Word "${word}" Found!`,
        items: path.map(([pr, pc], i) => ({
          label: `#${i + 1} (${pr},${pc})`,
          value: word[i],
          badge: 'FOUND'
        }))
      }
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      cppLine: 25,
      description: `Search exhausted. Word "${word}" DOES NOT EXIST on the board. exist() returns false.`,
      phase: 'Word Not Found (false)',
      nodeStates: {},
      edgeStates: {},
      visited: {},
      wordSearchState: {
        board: currentBoard.map(row => [...row]),
        targetWord: word,
        matchedIndex: 0,
        path: [],
        found: false
      },
      variables: { 'exist(board, word)': 'FALSE (0)', 'Target Word': `"${word}"` },
      dataStructure: {
        type: 'grid',
        title: `Word "${word}" Not Found`,
        items: [{ label: 'Result', value: 'false', badge: 'NOT FOUND' }]
      }
    });
  }

  return steps;
}
