// Iterative DFS cycle detection — O(n+m)
// Pure TypeScript, zero dependencies.
// Identical logic to the cobound-validator PyPI package.

export type Graph = Record<string, string[]>;

export interface CycleResult {
  feasible: boolean;
  cycles: string[][];
  cycleEdges: [string, string][];
}

/**
 * Detect all cycles in a directed graph using iterative DFS with 3-color marking.
 *
 * Color semantics:
 *   WHITE (0) — node not yet visited
 *   GRAY  (1) — node is on the current DFS path (ancestor)
 *   BLACK (2) — node fully processed
 *
 * A back-edge (current → GRAY node) indicates a cycle.
 * The cycle path is reconstructed from the DFS stack at the moment the back-edge is found.
 */
export function detectCycles(graph: Graph): CycleResult {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color: Record<string, number> = {};

  for (const node of Object.keys(graph)) {
    color[node] = WHITE;
  }

  const cycles: string[][] = [];
  const cycleEdges: [string, string][] = [];
  const seenCycleKeys = new Set<string>();

  for (const start of Object.keys(graph)) {
    if (color[start] !== WHITE) continue;

    // Each stack frame: the node and the next neighbour index to explore
    const stack: { node: string; idx: number }[] = [{ node: start, idx: 0 }];
    // path mirrors the current DFS stack (GRAY nodes in order)
    const path: string[] = [start];
    color[start] = GRAY;

    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const { node } = frame;
      const neighbors = graph[node] ?? [];

      if (frame.idx < neighbors.length) {
        const next = neighbors[frame.idx++];

        if (color[next] === GRAY) {
          // Back-edge: node → next (next is an ancestor on the current path)
          const cycleStart = path.indexOf(next);
          // cycleNodes: [next, ..., node, next]  (closed loop)
          const cycleNodes = [...path.slice(cycleStart), next];
          const key = JSON.stringify(cycleNodes);
          if (!seenCycleKeys.has(key)) {
            seenCycleKeys.add(key);
            cycles.push(cycleNodes);
            cycleEdges.push([node, next]); // the back-edge that closes the cycle
          }
        } else if (color[next] === WHITE) {
          color[next] = GRAY;
          stack.push({ node: next, idx: 0 });
          path.push(next);
        }
        // BLACK: already fully explored, skip
      } else {
        // All neighbours processed — mark done and pop
        color[node] = BLACK;
        stack.pop();
        path.pop();
      }
    }
  }

  return { feasible: cycles.length === 0, cycles, cycleEdges };
}

/**
 * Build an adjacency-list graph from agent ids and edge pairs.
 * Only edges whose source agent is declared in the agents list are included.
 */
export function buildGraph(
  agents: string[],
  edges: Array<{ from: string; to: string }>,
): Graph {
  const graph: Graph = {};
  for (const id of agents) {
    graph[id] = [];
  }
  for (const edge of edges) {
    if (Object.prototype.hasOwnProperty.call(graph, edge.from)) {
      graph[edge.from].push(edge.to);
    }
  }
  return graph;
}
