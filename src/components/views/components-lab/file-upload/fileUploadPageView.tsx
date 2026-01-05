"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle2, XCircle, Clock, Trash2 } from "lucide-react";
import { DocViewerModal } from "@/components/modal/docViewerModal";

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface LogEntry {
  id: string;
  fileName: string;
  status: "success" | "error";
  message: string;
  timestamp: Date;
}

export default function FileUploadPageView() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);

  // selectedFile 자동 업데이트
  useEffect(() => {
    if (selectedFile) {
      const updatedFile = files.find((f) => f.id === selectedFile.id);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: Math.random().toString(36),
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        progress: 0,
        status: "pending" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // 첫 번째 파일 자동 선택
      if (newFiles.length > 0 && !selectedFile) {
        setSelectedFile(newFiles[0]);
      }

      // 로그 추가
      newFiles.forEach((file) => {
        addLog(file.file.name, "success", "파일이 추가되었습니다");
      });

      // 자동 업로드 시뮬레이션
      newFiles.forEach((file) => {
        simulateUpload(file);
      });
    },
    [selectedFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  });

  const addLog = (
    fileName: string,
    status: "success" | "error",
    message: string
  ) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36),
      fileName,
      status,
      message,
      timestamp: new Date(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // 가상 업로드 로직
  const simulateUpload = (file: UploadFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, status: "uploading" as const } : f
      )
    );

    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === file.id && f.progress < 100) {
            const newProgress = Math.min(f.progress + 10, 100);
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 300);

    setTimeout(() => {
      clearInterval(interval);

      // 랜덤으로 성공/실패 (80% 성공률)
      const isSuccess = Math.random() > 0.2;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                progress: 100,
                status: isSuccess ? ("success" as const) : ("error" as const),
                error: isSuccess ? undefined : "업로드 중 오류가 발생했습니다",
              }
            : f
        )
      );

      if (isSuccess) {
        addLog(file.file.name, "success", "업로드 완료");
      } else {
        addLog(file.file.name, "error", "업로드 실패: 서버 연결 오류");
      }
    }, 3500);
  };

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file) {
      addLog(file.file.name, "success", "파일이 제거되었습니다");
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(files.find((f) => f.id !== id) || null);
    }
  };

  const overallProgress =
    files.length > 0
      ? Math.round(files.reduce((acc, f) => acc + f.progress, 0) / files.length)
      : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Drop Zone */}
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center
              transition-colors cursor-pointer
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive
                  ? "파일을 여기에 놓으세요"
                  : "파일을 드래그하거나 클릭하세요"}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, PDF 지원 (최대 10MB, 5개)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          업로드된 파일 ({files.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`
                  relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer
                  transition-all hover:shadow-md
                  ${selectedFile?.id === file.id ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
                `}
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <p className="text-4xl">📄</p>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                {file.status === "pending" && (
                  <Clock className="w-5 h-5 text-gray-500" />
                )}
                {file.status === "uploading" && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                )}
                {file.status === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {file.status === "error" && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="absolute top-2 left-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* File Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                <p className="text-xs truncate">{file.file.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview & Progress/Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Preview */}
        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <div className="space-y-4">
                {selectedFile.preview ? (
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={selectedFile.preview}
                      alt={selectedFile.file.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <p className="text-6xl mb-4">📄</p>
                      <p className="text-sm text-muted-foreground">
                        <DocViewerModal />
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">파일명:</span>
                    <span className="font-medium">
                      {selectedFile.file.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">크기:</span>
                    <span className="font-medium">
                      {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">타입:</span>
                    <span className="font-medium">
                      {selectedFile.file.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">상태:</span>
                    <span
                      className={`font-medium ${
                        selectedFile.status === "success"
                          ? "text-green-600"
                          : selectedFile.status === "error"
                            ? "text-red-600"
                            : selectedFile.status === "uploading"
                              ? "text-blue-600"
                              : "text-gray-600"
                      }`}
                    >
                      {selectedFile.status === "success" && "업로드 완료"}
                      {selectedFile.status === "error" && "업로드 실패"}
                      {selectedFile.status === "uploading" && "업로드 중..."}
                      {selectedFile.status === "pending" && "대기 중"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-muted-foreground">파일을 선택해주세요</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Progress & Logs */}
        <div className="space-y-6">
          {/* Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle>업로드 진행률</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>전체 진행률</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {files.filter((f) => f.status === "uploading").length}
                  </p>
                  <p className="text-muted-foreground">업로드 중</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {files.filter((f) => f.status === "success").length}
                  </p>
                  <p className="text-muted-foreground">완료</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {files.filter((f) => f.status === "error").length}
                  </p>
                  <p className="text-muted-foreground">실패</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs */}
          <Card className="p-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>활동 로그</CardTitle>
                {logs.length > 0 && (
                  <button
                    onClick={() => setLogs([])}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    표시할 로그가 없습니다
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      {log.status === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {log.fileName}
                        </p>
                        <p
                          className={`text-xs ${
                            log.status === "success"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {log.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
