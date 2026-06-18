import { Parser, Language } from "web-tree-sitter";

// web-tree-sitter is a side-effectful singleton — we initialise it once and
// cache the loaded languages so grammars are only fetched once per session.

function wasmUrl(filename: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base.replace(/\/$/, "")}/tree-sitter/${filename}`;
}

let parserInitialised = false;

async function ensureParserInit() {
  if (parserInitialised) return;
  await Parser.init({
    locateFile: () => wasmUrl("web-tree-sitter.wasm"),
  });
  parserInitialised = true;
}

const languageCache = new Map<string, Language>();

async function loadLanguage(wasmFilename: string): Promise<Language> {
  const cached = languageCache.get(wasmFilename);
  if (cached) return cached;
  const lang = await Language.load(wasmUrl(wasmFilename));
  languageCache.set(wasmFilename, lang);
  return lang;
}

export type SupportedExtension = "ts" | "tsx" | "js" | "jsx" | "mjs" | "cjs";

const WASM_FOR_EXT: Record<SupportedExtension, string> = {
  ts: "tree-sitter-typescript.wasm",
  tsx: "tree-sitter-tsx.wasm",
  js: "tree-sitter-javascript.wasm",
  jsx: "tree-sitter-javascript.wasm",
  mjs: "tree-sitter-javascript.wasm",
  cjs: "tree-sitter-javascript.wasm",
};

export function isSupportedExtension(ext: string): ext is SupportedExtension {
  return ext in WASM_FOR_EXT;
}

// Returns a configured Parser ready to parse files with the given extension,
// or null if the extension is unsupported.
export async function getParserForExtension(
  ext: string,
): Promise<Parser | null> {
  if (!isSupportedExtension(ext)) return null;
  await ensureParserInit();
  const lang = await loadLanguage(WASM_FOR_EXT[ext]);
  const parser = new Parser();
  parser.setLanguage(lang);
  return parser;
}
