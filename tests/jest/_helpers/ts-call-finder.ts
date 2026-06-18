/**
 * AST-based call-site finder for regression-guard tests.
 *
 * Uses the TypeScript compiler API (already a transitive dep via ts-jest)
 * to locate CallExpression nodes that match a predicate. Correct for
 * nested calls, multi-line arguments, comments, and string contents —
 * all of which a regex pass can get wrong.
 *
 * Usage:
 *
 *   const hits = findCalls((call, sf) => {
 *     return isCalleeNamed(call, 'setTimeout') &&
 *            getNumericLiteralArg(call, 1) !== undefined &&
 *            (getNumericLiteralArg(call, 1) as number) < 16;
 *   });
 */
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { listSourceFiles } from './source-scanner';

export interface CallHit {
  file: string;     // forward-slashed, repo-relative
  line: number;     // 1-indexed
  column: number;   // 1-indexed
  snippet: string;  // single-line preview of the call site
}

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

/**
 * Walk every source file and yield each CallExpression that satisfies
 * `predicate`. Source files are parsed with the loosest possible TS
 * settings — we don't need type info, just the AST.
 */
export function findCalls(
  predicate: (call: ts.CallExpression, sf: ts.SourceFile) => boolean,
  files: string[] = listSourceFiles(),
): CallHit[] {
  const hits: CallHit[] = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.ES2017, /*setParentNodes*/ true);
    const visit = (node: ts.Node): void => {
      if (ts.isCallExpression(node) && predicate(node, sf)) {
        const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        const snippet = extractSingleLine(text, node.getStart(sf));
        hits.push({
          file: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
          line: line + 1,
          column: character + 1,
          snippet,
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return hits;
}

/** Return the textual name of a call's callee (handles `foo` and `obj.foo`). */
export function getCalleeName(call: ts.CallExpression): string | undefined {
  const expr = call.expression;
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.name)) return expr.name.text;
  return undefined;
}

/** True if the call's callee identifier matches `name` (either `name(...)` or `x.name(...)`). */
export function isCalleeNamed(call: ts.CallExpression, name: string): boolean {
  return getCalleeName(call) === name;
}

/**
 * Return the numeric value of the argument at `index` IF that argument is a
 * numeric literal (or a -literal). Returns undefined for identifiers,
 * expressions, missing arguments, etc.
 */
export function getNumericLiteralArg(call: ts.CallExpression, index: number): number | undefined {
  const arg = call.arguments[index];
  if (!arg) return undefined;
  if (ts.isNumericLiteral(arg)) return parseFloat(arg.text);
  // unary minus on a number literal — rare for delays but cheap to support
  if (ts.isPrefixUnaryExpression(arg) && arg.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(arg.operand)) {
    return -parseFloat(arg.operand.text);
  }
  return undefined;
}

/** Pretty-print a list of hits for failure messages. */
export function formatHits(hits: CallHit[]): string {
  if (!hits.length) return '(no matches)';
  return hits.map((h) => `  ${h.file}:${h.line}:${h.column}  ${h.snippet}`).join('\n');
}

function extractSingleLine(text: string, offset: number): string {
  let start = offset;
  while (start > 0 && text[start - 1] !== '\n') start--;
  let end = offset;
  while (end < text.length && text[end] !== '\n') end++;
  return text.slice(start, end).trim();
}
