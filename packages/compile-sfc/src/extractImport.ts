let waitingForEnd = false;
let importCell: string[] = [];
let counters: Record<string, number> = {};
let importSnippets: string[] = [];

export function extractImport(script: string) {
  script = splitMatch(script, ";", true, (s) => {
    if (s.trim().startsWith("import")) {
      importSnippets.push(s + ";");
      return "";
    }

    return splitMatch(s, "\n", false, (s) =>
      splitMatch(s, " ", true, callback)
    );
  });

  init();
  let _importSnippets: string[];
  [_importSnippets, importSnippets] = [importSnippets, []];

  return { script, importSnippets: _importSnippets };
}

function splitMatch(
  s: string,
  splitter: string,
  isFilter: boolean,
  callback: (s: string) => string
): string {
  let v = s.split(splitter).map(callback);
  if (isFilter) {
    v = v.filter(Boolean);
  }
  return v.join(splitter);
}

const callback = (s: string) => {
  if (waitingForEnd) {
    importCell.push(s);
    count('"', s);
    count("'", s);
    return "";
  } else if (s.trim().startsWith("import")) {
    init();
    waitingForEnd = true;

    importCell.push(s);
    return "";
  }

  return s;
};

function commit() {
  importSnippets.push(
    importCell
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ")
  );

  init();
}
function init() {
  importCell = [];
  counters = {};
  waitingForEnd = false;
}

function count(k: string, s: string) {
  s.trim().endsWith(k) && add(k);
  s.trim().startsWith(k) && add(k);
  if (counters[k] && counters[k] >= 2) {
    commit();
  }
}
function add(k: string) {
  counters[k] = (counters[k] ?? 0) + 1;
}
