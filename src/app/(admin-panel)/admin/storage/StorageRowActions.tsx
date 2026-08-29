'use client';

import React, { useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import CleanStorageModal from './CleanStorageModal';
import DeleteEventModal from '../events/DeleteEventModal';

interface StorageRowActionsProps {
  event: {
    id: string;
    title: string;
    shortCode: string;
    currentPhotoCount: number;
  };
}

export default function StorageRowActions({ event }: StorageRowActionsProps) {
  const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => setIsCleanModalOpen(true)}
          className="btn btn-secondary btn-sm"
          title="Etkinlik Depolamasını Temizle"
          style={{ color: 'var(--warning, #f59e0b)' }}
        >
          <RefreshCw size={14} />
          <span style={{ fontSize: '0.78rem' }}>Temizle</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="btn btn-secondary btn-sm"
          title="Etkinliği Kalıcı Sil"
          style={{ color: 'var(--danger, #ef4444)' }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <CleanStorageModal
        isOpen={isCleanModalOpen}
        onClose={() => setIsCleanModalOpen(false)}
        event={event}
      />

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        event={event}
      />
    </>
  );
}
