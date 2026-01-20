'use client';

import { useState } from 'react';
import {
  Camera,
  Video,
  FileText,
  Check,
  Clock,
  ExternalLink,
  Play,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { SmashSubmission } from '@/types';

interface ProofGalleryProps {
  submissions: SmashSubmission[];
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const shortenAddress = (address: string) => {
  if (!address || address.length < 10) return address || 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getProofTypeIcon = (type: SmashSubmission['proofType']) => {
  switch (type) {
    case 'photo':
      return <Camera size={14} />;
    case 'video':
      return <Video size={14} />;
    case 'document':
    case 'gps':
      return <FileText size={14} />;
    default:
      return <Camera size={14} />;
  }
};

function ProofCard({ submission }: { submission: SmashSubmission }) {
  const [imageError, setImageError] = useState(false);

  const isImage = submission.proofType === 'photo';
  const isVideo = submission.proofType === 'video';

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/50 hover:border-gray-700 transition">
      {/* Media Preview */}
      <div className="aspect-video bg-black relative group">
        {isImage && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={submission.proofUrl}
            alt="Proof submission"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="w-16 h-16 rounded-full bg-purple-600/80 flex items-center justify-center">
              <Play size={28} className="ml-1" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <FileText size={48} className="text-gray-600" />
          </div>
        )}

        {/* Hover Overlay */}
        <a
          href={submission.proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
        >
          <span className="flex items-center gap-2 text-white">
            <ExternalLink size={18} />
            View Full Size
          </span>
        </a>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-gray-700 text-xs">
                {submission.participantId.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-400">
              {shortenAddress(submission.participantId)}
            </span>
          </div>
          <Badge
            className={
              submission.verified
                ? 'bg-green-500/10 text-green-500'
                : 'bg-yellow-500/10 text-yellow-500'
            }
          >
            <span className="flex items-center gap-1">
              {submission.verified ? <Check size={12} /> : <Clock size={12} />}
              {submission.verified ? 'Verified' : 'Pending'}
            </span>
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {getProofTypeIcon(submission.proofType)}
            {submission.proofType}
          </span>
          <span>{formatDate(submission.submittedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export function ProofGallery({ submissions }: ProofGalleryProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <Camera size={32} className="text-gray-500" />
        </div>
        <h4 className="text-lg font-medium mb-2">No proofs submitted yet</h4>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Participants can submit their proof of completion here once the challenge begins.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {submissions.map((submission) => (
        <ProofCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
}
