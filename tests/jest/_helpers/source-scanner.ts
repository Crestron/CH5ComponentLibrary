/**
 * Lightweight source scanner for regression-guard tests.
 *
 * Reads src/*.ts files as text and runs regex patterns against the whole
 * file (so multi-line constructs work). Match offsets are resolved to
 * 1-indexed line/column for human-readable failure output.
 *
 * Why text scanning instead of TypeScript's AST:
 *   1. Speed — scanning ~84k LOC takes < 1s; full AST is much slower.
 *   2. Robustness — guards survive TS upgrades without API churn.
 * If a guard ever needs structural understanding ("only inside class methods",
 * "only when X is imported") upgrade it to ts-morph at that time.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface SourceMatch {
  file: string;        // path relative to repo root, forward-slashed
  line: number;        // 1-indexed
  column: number;      // 1-indexed
  matchText: string;   // the substring that matched
  lineText: string;    // the full line containing the match, trimmed
}

const SRC_DIR = path.resolve(__dirname, '..', '..', '..', 'src');
const REPO_ROOT = path.resolve(SRC_DIR, '..');

/**
 * Walk src/ and return every .ts file that is NOT a test/spec/declaration.
 */
export function listSourceFiles(): string[] {
  const out: string[] = [];
  const stack: string[] = [SRC_DIR];
  while (stack.length) {
    const dir = stack.pop() as string;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!e.isFile()) continue;
      if (!full.endsWith('.ts')) continue;
      if (full.endsWith('.spec.ts')) continue;
      if (full.endsWith('.d.ts')) continue;
      out.push(full);
    }
  }
  return out.sort();
}

/**
 * Run a regex against each source file, returning every match site.
 *
 * The pattern is forced to be global so multiple hits per file are reported.
 * Patterns should use `[\s\S]` (not `.`) when they need to cross newlines.
 *
 * Matches inside `//` or `/* ... *​/` comments are dropped — we don't want
 * to flag commented-out examples or doc snippets.
 */
export function scan(pattern: RegExp, files: string[] = listSourceFiles()): SourceMatch[] {
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
  const re = new RegExp(pattern.source, flags);
  const matches: SourceMatch[] = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const commentMask = buildCommentMask(text);
    const lineStarts = buildLineStarts(text);

    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const idx = m.index;
      if (commentMask[idx]) {
        // skip matches that begin inside a comment
        if (m[0].length === 0) re.lastIndex = idx + 1;
        continue;
      }
      const { line, column } = offsetToLineCol(idx, lineStarts);
      const lineText = extractLine(text, lineStarts, line);
      matches.push({
        file: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
        line,
        column,
        matchText: m[0],
        lineText: lineText.trim(),
      });
      // avoid infinite loop on zero-width matches
      if (m[0].length === 0) re.lastIndex = idx + 1;
    }
  }
  return matches;
}

function buildLineStarts(text: string): number[] {
  const starts: number[] = [0];
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 10 /* \n */) starts.push(i + 1);
  }
  return starts;
}

function offsetToLineCol(offset: number, lineStarts: number[]): { line: number; column: number } {
  // binary search for the largest lineStart <= offset
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (lineStarts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return { line: lo + 1, column: offset - lineStarts[lo] + 1 };
}

function extractLine(text: string, lineStarts: number[], line: number): string {
  const start = lineStarts[line - 1];
  const end = line < lineStarts.length ? lineStarts[line] - 1 : text.length;
  return text.slice(start, end);
}

/**
 * Returns a boolean array of length `text.length` where mask[i] === true means
 * position i is inside a `// ...` line comment or `/​* ... *​/` block comment.
 * String literals are *not* treated specially — that's a conscious trade-off
 * for simplicity, since regex hits inside strings are vanishingly rare in
 * practice and easy to silence with a guard pattern if they do appear.
 */
function buildCommentMask(text: string): Uint8Array {
  const mask = new Uint8Array(text.length);
  let i = 0;
  const n = text.length;
  while (i < n) {
    if (text[i] === '/' && text[i + 1] === '/') {
      while (i < n && text[i] !== '\n') {
        mask[i] = 1;
        i++;
      }
    } else if (text[i] === '/' && text[i + 1] === '*') {
      mask[i] = 1;
      mask[i + 1] = 1;
      i += 2;
      while (i < n && !(text[i] === '*' && text[i + 1] === '/')) {
        mask[i] = 1;
        i++;
      }
      if (i < n) {
        mask[i] = 1;
        mask[i + 1] = 1;
        i += 2;
      }
    } else {
      i++;
    }
  }
  return mask;
}

/** Pretty-print a list of matches for failure messages. */
export function formatMatches(matches: SourceMatch[]): string {
  if (!matches.length) return '(no matches)';
  return matches.map((m) => `  ${m.file}:${m.line}:${m.column}  ${m.lineText}`).join('\n');
}
