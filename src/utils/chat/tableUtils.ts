// 마크다운 테이블을 파싱하는 함수
export const parseMarkdownTable = (
  markdown: string
): { headers: string[]; rows: string[][] } | null => {
  const lines = markdown
    .trim()
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) return null;

  // 헤더 파싱
  const headerLine = lines[0];
  const headers = headerLine
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell);

  // 구분선 건너뛰기 (|------|------|)
  const dataLines = lines.slice(2);

  // 데이터 행 파싱
  const rows = dataLines.map((line) =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell)
  );

  return { headers, rows };
};

// 테이블 데이터를 마크다운으로 변환하는 함수
export const tableToMarkdown = (tableData: {
  headers: string[];
  rows: string[][];
}): string => {
  const headerRow = `| ${tableData.headers.join(" | ")} |`;
  const separatorRow = `| ${tableData.headers.map(() => "---").join(" | ")} |`;
  const dataRows = tableData.rows
    .map((row) => `| ${row.join(" | ")} |`)
    .join("\n");

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
};
