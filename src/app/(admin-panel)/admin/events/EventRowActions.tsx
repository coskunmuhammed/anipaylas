'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit2, ImageIcon, QrCode, Trash2 } from 'lucide-react';
import DeleteEventModal from './DeleteEventModal';

interface EventRowActionsProps {
  event: {
    id: string;
    title: string;
    shortCode: string;
  };
}

export default function EventRowActions({ event }: EventRowActionsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Link
          href={`/admin/events/${event.id}`}
          className="btn btn-secondary btn-sm"
          title="Etkinliği Düzenle"
        >
          <Edit2 size={14} />
        </Link>
        <Link
          href={`/admin/photos?eventId=${event.id}`}
          className="btn btn-secondary btn-sm"
          title="Fotoğrafları Yönet"
        >
          <ImageIcon size={14} />
        </Link>
        <Link
          href={`/admin/qr?eventId=${event.id}`}
          className="btn btn-secondary btn-sm"
          title="QR Kod Üret"
        >
          <QrCode size={14} />
        </Link>
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="btn btn-secondary btn-sm"
          title="Etkinliği Sil"
          style={{ color: 'var(--danger, #ef4444)' }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        event={event}
      />
    </>
  );
}
