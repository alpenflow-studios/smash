'use client';

import { useState, useRef } from 'react';
import { Upload, X, Camera, Video, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { submitProof } from '@/lib/queries';
import { MAX_PROOF_FILE_SIZE_BYTES, MAX_PROOF_FILE_SIZE_MB } from '@/lib/constants';

type ProofType = 'photo' | 'video' | 'document';

interface ProofUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  smashId: string;
  userId: string;
  onSuccess: () => void;
}

const ACCEPTED_TYPES: Record<ProofType, string[]> = {
  photo: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf', 'image/jpeg', 'image/png'],
};

export function ProofUploadDialog({
  open,
  onOpenChange,
  smashId,
  userId,
  onSuccess,
}: ProofUploadDialogProps) {
  const [proofType, setProofType] = useState<ProofType>('photo');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    // Validate file type
    if (!ACCEPTED_TYPES[proofType].includes(selectedFile.type)) {
      setError(`Invalid file type. Please select a ${proofType} file.`);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_PROOF_FILE_SIZE_BYTES) {
      setError(`File too large. Maximum size is ${MAX_PROOF_FILE_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);

    // Revoke previous preview URL to prevent memory leak
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    // Create preview for images and videos
    if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await submitProof(file, smashId, userId, proofType);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to submit proof:', err);
      setError('Failed to upload proof. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Revoke preview URL to prevent memory leak
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
    setProofType('photo');
    onOpenChange(false);
  };

  const clearFile = () => {
    // Revoke preview URL to prevent memory leak
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAcceptString = () => ACCEPTED_TYPES[proofType].join(',');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Proof</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload evidence of your challenge completion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Proof Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Proof Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setProofType('photo');
                  clearFile();
                }}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition ${
                  proofType === 'photo'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <Camera size={18} />
                <span>Photo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProofType('video');
                  clearFile();
                }}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition ${
                  proofType === 'video'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <Video size={18} />
                <span>Video</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProofType('document');
                  clearFile();
                }}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition ${
                  proofType === 'document'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <FileText size={18} />
                <span>Document</span>
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="text-sm font-medium mb-2 block">Upload File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptString()}
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 transition flex flex-col items-center justify-center gap-2"
              >
                <Upload size={32} className="text-gray-500" />
                <span className="text-gray-400">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-500">
                  Max 50MB - {proofType === 'photo' ? 'JPG, PNG, WebP, GIF' : proofType === 'video' ? 'MP4, WebM, MOV' : 'PDF, JPG, PNG'}
                </span>
              </button>
            ) : (
              <div className="relative border border-gray-700 rounded-lg overflow-hidden">
                {/* Preview */}
                {preview && (
                  <div className="aspect-video bg-black flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : file.type.startsWith('video/') ? (
                      <video
                        src={preview}
                        className="max-h-full max-w-full"
                        controls
                      />
                    ) : null}
                  </div>
                )}

                {/* File info */}
                <div className="p-3 bg-gray-800 flex items-center justify-between">
                  <div className="truncate flex-1">
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="p-1 hover:bg-gray-700 rounded transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-gray-700 hover:bg-gray-800"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Submit Proof
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
