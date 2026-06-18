import type { Node } from "web-tree-sitter";

export type Scope = {
  name: string;
  // 1-indexed, inclusive
  startLine: number;
  endLine: number;
};

// Tree-sitter node types that represent named callable/function scopes.
const FUNCTION_NODE_TYPES = new Set([
  "function_declaration",
  "function_expression",
  "arrow_function",
  "method_definition",
  "generator_function_declaration",
  "generator_function",
]);

// Recursively collects all scopes from the tree.
export function extractScopes(rootNode: Node): Scope[] {
  const scopes: Scope[] = [];
  visit(rootNode, scopes);
  // Stable order: sort by start line, breaking ties by end line desc (inner → outer).
  scopes.sort((a, b) => a.startLine - b.startLine || b.endLine - a.endLine);
  return scopes;
}

function visit(node: Node, scopes: Scope[]) {
  if (FUNCTION_NODE_TYPES.has(node.type)) {
    const name = resolveName(node);
    // NestJS / Angular decorators live in a `decorated_definition` wrapper that
    // sits above the method_definition in the AST. The method's own startPosition
    // is AFTER the decorator lines, so we use the parent's range when the parent
    // is a decorated_definition — that way decorator lines belong to the scope.
    const scopeNode =
      node.parent?.type === "decorated_definition" ? node.parent : node;
    scopes.push({
      name,
      // tree-sitter rows are 0-indexed; we use 1-indexed lines.
      startLine: scopeNode.startPosition.row + 1,
      endLine: scopeNode.endPosition.row + 1,
    });
  }
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) visit(child, scopes);
  }
}

// Attempts to derive a human-readable name for a function node.
function resolveName(node: Node): string {
  // function_declaration / generator_function_declaration: has a `name` child
  const nameChild = node.childForFieldName("name");
  if (nameChild) return nameChild.text;

  // arrow_function / function_expression as a variable initializer:
  // parent is `variable_declarator` whose `name` field is the identifier.
  const parent = node.parent;
  if (parent?.type === "variable_declarator") {
    const varName = parent.childForFieldName("name");
    if (varName) return varName.text;
  }

  // Arrow function as a property value in an object expression:
  if (parent?.type === "pair") {
    const key = parent.childForFieldName("key");
    if (key) return key.text;
  }

  if (parent?.type === "property_identifier") return parent.text;

  return "(anonymous)";
}

// Finds the innermost scope enclosing a 1-indexed line number.
// Returns null if the line is outside every scope (module-level code).
export function findInnermostScope(
  scopes: Scope[],
  line: number,
): Scope | null {
  let best: Scope | null = null;
  for (const scope of scopes) {
    if (line < scope.startLine || line > scope.endLine) continue;
    // Prefer the narrowest enclosing scope.
    if (
      !best ||
      scope.endLine - scope.startLine < best.endLine - best.startLine
    ) {
      best = scope;
    }
  }
  return best;
}
