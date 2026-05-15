"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { X, Upload, Play, Check, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  selectedDay: number;
}

interface FilePreview {
  file: File;
  previewUrl: string;
  type: "image" | "video";
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
  selectedDay,
}: Props) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [caption, setCaption] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const [dayNumber, setDayNumber] = useState(selectedDay);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted: File[]) => {
    const previews = accepted.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
    }));
    setFiles((prev) => [...prev, ...previews].slice(0, 20));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      "video/*": [".mp4", ".mov", ".webm"],
    },
    maxFiles: 20,
  });

  const removeFile = (i: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].previewUrl);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleUpload = async () => {
    if (!files.length || !uploaderName.trim()) return;
    setStatus("uploading");
    setProgress(0);

    const fileSizes = files.map((f) => f.file.size);
    const totalSize = fileSizes.reduce((a, b) => a + b, 0) || 1;
    const uploadedPerFile = new Array(files.length).fill(0);

    const updateProgress = () => {
      const uploaded = uploadedPerFile.reduce((a: number, b: number) => a + b, 0);
      setProgress(Math.min(99, Math.round((uploaded / totalSize) * 100)));
    };

    const uploadOne = (fp: FilePreview, index: number): Promise<void> =>
      new Promise((resolve, reject) => {
        const fd = new FormData();
        fd.append("file", fp.file);
        fd.append("dayNumber", String(dayNumber));
        fd.append("caption", caption);
        fd.append("uploadedBy", uploaderName);
        fd.append("mediaType", fp.type);

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            uploadedPerFile[index] = e.loaded;
            updateProgress();
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            uploadedPerFile[index] = fileSizes[index];
            updateProgress();
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("POST", "/api/upload");
        xhr.send(fd);
      });

    try {
      for (let i = 0; i < files.length; i++) {
        await uploadOne(files[i], i);
      }
      setProgress(100);
      setStatus("success");
      setTimeout(() => { onUploadSuccess(); resetState(); }, 1800);
    } catch {
      setStatus("error");
    }
  };

  const resetState = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setCaption("");
    setUploaderName("");
    setStatus("idle");
    setProgress(0);
  };

  const handleClose = () => {
    if (status === "uploading") return;
    resetState();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="upload-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90svh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 text-lg font-semibold">Chia sẻ kỷ niệm</h2>
              <button
                onClick={handleClose}
                disabled={status === "uploading"}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Idle / form state */}
            {status === "idle" && (
              <div className="space-y-4">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload size={28} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500 text-sm">
                    {isDragActive ? "Thả file vào đây 🔥" : "Kéo thả ảnh hoặc video vào đây"}
                  </p>
                  <p className="text-gray-300 text-xs mt-1">hoặc nhấn để chọn nhiều file cùng lúc (tối đa 20)</p>
                </div>

                {/* File previews */}
                {files.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {f.type === "image" ? (
                          <img src={f.previewUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Play size={18} className="text-gray-500" />
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black"
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Day selector */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest font-medium block mb-2">Ngày</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDayNumber(d)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          dayNumber === d
                            ? "bg-rose-500 text-white shadow-sm shadow-rose-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Your name */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest font-medium block mb-2">Tên của bạn</label>
                  <input
                    type="text"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    placeholder="vd: Nguyễn Văn A"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest font-medium block mb-2">Chú thích</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Thêm chú thích vui vẻ..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>

                {/* Upload button */}
                <button
                  onClick={handleUpload}
                  disabled={!files.length || !uploaderName.trim()}
                  className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-rose-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed mt-2 shadow-md shadow-rose-200"
                >
                  Tải lên {files.length > 0 ? `${files.length} file${files.length > 1 ? "" : ""}` : "kỷ niệm"}
                </button>
              </div>
            )}

            {/* Uploading state */}
            {status === "uploading" && (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full border-2 border-gray-200 border-t-indigo-600 animate-spin mx-auto mb-5" />
                <p className="text-gray-800 font-medium mb-4">Đang tải lên kỷ niệm...</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-indigo-600 h-full rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">{progress}%</p>
              </div>
            )}

            {/* Success state */}
            {status === "success" && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4"
                >
                  <Check size={28} className="text-green-500" />
                </motion.div>
                <p className="text-gray-900 font-semibold text-lg">Đã chia sẻ thành công!</p>
                <p className="text-gray-400 text-sm mt-1">Đã thêm vào Ngày {dayNumber} 🎉</p>
              </div>
            )}

            {/* Error state */}
            {status === "error" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={28} className="text-red-500" />
                </div>
                <p className="text-gray-900 font-medium">Tải lên thất bại</p>
                <p className="text-gray-400 text-sm mt-1">Vui lòng kiểm tra kết nối và thử lại</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-indigo-500 text-sm hover:text-indigo-700 transition-colors underline underline-offset-4"
                >
                  Thử lại
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
