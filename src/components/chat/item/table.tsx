"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Check } from "lucide-react";

type TableMessageProps = {
  tableData: {
    headers: string[];
    rows: string[][];
  };
  isCopied: boolean;
  onCopy: () => void;
};

export default function TableMessage({
  tableData,
  isCopied,
  onCopy,
}: TableMessageProps) {
  return (
    <div className="my-4 relative group">
      {/* 복사 버튼 */}
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              <span className="text-xs">복사</span>
            </>
          )}
        </Button>
      </div>

      {/* 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableData.headers.map((header, index) => (
                <TableHead key={index} className="font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
