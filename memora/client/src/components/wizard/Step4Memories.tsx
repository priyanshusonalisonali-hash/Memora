import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, Sparkles, Upload } from 'lucide-react';
import { useWizardStore } from '../../store/wizardStore.js';
import { PhotoItem } from '../../types/index.js';

export const Step4Memories: React.FC = () => {
  const { draft, updateDraft, nextStep, saveToServer } = useWizardStore();
  const [photos, setPhotos] = useState<PhotoItem[]>(draft.photos || []);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      setError('You can upload a maximum of 5 photos');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // If we already have a draft.id on the server, upload via POST /api/drafts/:id/photos
      if (draft.id) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.size > 5 * 1024 * 1024) {
            setError(`File ${file.name} is larger than 5MB`);
            setUploading(false);
            return;
          }
          formData.append('photos', file);
        }

        const res = await fetch(`/api/drafts/${draft.id}/photos`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setPhotos(data.photos);
          updateDraft({ photos: data.photos });
        } else {
          const errData = await res.json();
          setError(errData.error || 'Failed to upload photo');
        }
      } else {
        // Fallback: create local object URLs until server sync
        const newLocalPhotos: PhotoItem[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const previewUrl = URL.createObjectURL(file);
          newLocalPhotos.push({
            id: `temp_${Date.now()}_${i}`,
            url: previewUrl,
            caption: '',
            order: photos.length + i,
            previewUrl,
            file,
          });
        }
        const combined = [...photos, ...newLocalPhotos];
        setPhotos(combined);
        updateDraft({ photos: combined });
        saveToServer();
      }
    } catch (err) {
      console.error(err);
      setError('Network error uploading photos');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], caption };
    setPhotos(updated);
    updateDraft({ photos: updated });
  };

  const handleRemove = async (index: number) => {
    const photoToRemove = photos[index];
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    updateDraft({ photos: updated });

    if (draft.id && photoToRemove.id && !photoToRemove.id.startsWith('temp_')) {
      try {
        await fetch(`/api/drafts/${draft.id}/photos/${photoToRemove.id}`, { method: 'DELETE' });
      } catch (e) {
        console.error('Failed to delete photo from server', e);
      }
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const updated = [...photos];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const reordered = updated.map((item, idx) => ({ ...item, order: idx }));
    setPhotos(reordered);
    updateDraft({ photos: reordered });
  };

  const handleContinue = () => {
    updateDraft({ photos });
    nextStep();
  };

  const handleSkip = () => {
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-peach-100">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-peach-100 mx-auto flex items-center justify-center text-coral-500 mb-3 shadow-inner">
          <Camera className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
          The Memories
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload up to 5 photos to hang on fairy lights in the surprise.
        </p>
      </div>

      {/* Upload Dropzone / Button */}
      {photos.length < 5 && (
        <div className="mb-5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            id="photoUploadInput"
          />
          <label
            htmlFor="photoUploadInput"
            className={`w-full py-6 px-4 rounded-2xl border-2 border-dashed border-peach-300 hover:border-coral-400 bg-cream-50/50 hover:bg-peach-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              uploading ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-peach-100 flex items-center justify-center text-coral-500">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-800">
                {uploading ? 'Processing photos...' : 'Tap to upload photos'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                PNG, JPG under 5MB ({photos.length}/5 uploaded)
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Uploaded Photos List */}
      {photos.length > 0 ? (
        <div className="space-y-3 mb-6">
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              className="p-3 rounded-2xl bg-cream-50 border border-peach-200 flex items-center gap-3"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-peach-200/50">
                <img
                  src={photo.previewUrl || photo.url}
                  alt={`Memory ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={photo.caption || ''}
                  onChange={(e) => handleCaptionChange(idx, e.target.value)}
                  placeholder="Caption (e.g. Goa trip, 2023)..."
                  maxLength={100}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-peach-200 focus:border-coral-500 outline-none text-gray-800 font-medium"
                />
              </div>

              {/* Action buttons (reorder, delete) */}
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Move photo up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === photos.length - 1}
                  className="p-1.5 hover:text-gray-700 disabled:opacity-30"
                  aria-label="Move photo down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  aria-label="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {error && (
        <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center mb-4">
          {error}
        </p>
      )}

      <button
        onClick={handleContinue}
        className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-[0.98] text-base"
      >
        Continue to The Letter
      </button>

      {/* Skip link */}
      <div className="text-center mt-3">
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-medium text-gray-400 hover:text-gray-600 underline underline-offset-4 py-1 touch-target"
        >
          Skip photos for now
        </button>
      </div>
    </div>
  );
};
