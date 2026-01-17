import type React from "react";
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Edit, X } from "lucide-react";
import { FaFileAlt } from "react-icons/fa";
import FileUploader from "@/components/dashboard/FileUpload";
import { getFileIcon, formatFileSize, type UploadedFile } from "@/utils/fileUpload";

interface AttachmentsSectionProps {
    attachments: UploadedFile[];
    uploadingFiles: string[];
    editingFile: string | null;
    editingFileName: string;
    onFileUpload: (file: UploadedFile) => void;
    onRemoveAttachment: (index: number) => void;
    onStartEditing: (index: number) => void;
    onSaveEditing: (index: number) => void;
    onCancelEditing: () => void;
    onEditingFileNameChange: (name: string) => void;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
    attachments,
    uploadingFiles,
    editingFile,
    editingFileName,
    onFileUpload,
    onRemoveAttachment,
    onStartEditing,
    onSaveEditing,
    onCancelEditing,
    onEditingFileNameChange,
}) => (
    <div className="space-y-4">
        <Card className="top-24 border-gray-200">
            <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800">
                    Attachments
                </h3>
            </CardHeader>
            <CardContent>
                <FileUploader onFileUpload={onFileUpload} />

                {uploadingFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {uploadingFiles.map((fileName) => (
                            <div
                                key={fileName}
                                className="flex items-center gap-2 text-sm text-gray-500"
                            >
                                <span className="animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full"></span>
                                <span>Uploading {fileName}...</span>
                            </div>
                        ))}
                    </div>
                )}

                {attachments.length > 0 && (
                    <div className="space-y-3 pt-4 pb-4 mt-4 bg-gray-100 px-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-600">
                            Uploaded Files
                        </h4>
                        {attachments.map((file, index) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex-shrink-0">
                                        {getFileIcon(file.displayName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {editingFile === file.id ? (
                                            <div className="flex items-center gap-1">
                                                <Input
                                                    value={editingFileName}
                                                    onChange={(e) =>
                                                        onEditingFileNameChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") onSaveEditing(index);
                                                        if (e.key === "Escape") onCancelEditing();
                                                    }}
                                                    className="h-8 text-sm"
                                                    autoFocus
                                                />
                                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => onSaveEditing(index)}>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onCancelEditing}>
                                                    <X className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <p
                                                className="text-sm font-medium text-gray-800 truncate"
                                                title={file.displayName}
                                            >
                                                {file.displayName}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                {editingFile !== file.id && (
                                    <div className="flex items-center flex-shrink-0">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onStartEditing(index)}>
                                            <Edit className="h-4 w-4 text-gray-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemoveAttachment(index)}>
                                            <X className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {attachments.length === 0 &&
                    uploadingFiles.length === 0 && (
                        <div className="text-center text-gray-500 bg-gray-100 px-4 rounded-md mt-4 py-6">
                            <FaFileAlt className="text-4xl mb-2 mx-auto" />
                            <p>No files uploaded</p>
                        </div>
                    )}
            </CardContent>
        </Card>
    </div>
);