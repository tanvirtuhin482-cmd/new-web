import React, { useState, useEffect, useRef } from 'react';
import { useVisualEditor } from './VisualEditorContext';
import { QuickEditTarget } from '../../types/admin';

interface InlineEditableProps {
  target: QuickEditTarget;
  children: React.ReactNode;
  className?: string;
  multiline?: boolean;
}

export const InlineEditable: React.FC<InlineEditableProps> = ({
  target,
  children,
  className = '',
  multiline = false,
}) => {
  const { isLivePreview, onSave } = useVisualEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string>('');
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setValue(typeof target.value === 'string' ? target.value : String(target.value || ''));
  }, [target.value]);

  if (!isLivePreview) {
    return <span className={className}>{children}</span>;
  }

  const handleBlur = async () => {
    if (!elementRef.current) return;
    const newValue = elementRef.current.innerText.trim();
    if (newValue !== value) {
      const itemIdentifier = target.productId || (target.slideIndex !== undefined ? String(target.slideIndex) : undefined);
      await onSave(target.field, newValue, itemIdentifier);
      setValue(newValue);
    }
    setIsEditing(false);
  };

  const handleInput = () => {
    if (!elementRef.current) return;
    const newValue = elementRef.current.innerText;
    setValue(newValue);
    const itemIdentifier = target.productId || (target.slideIndex !== undefined ? String(target.slideIndex) : undefined);
    onSave(target.field, newValue, itemIdentifier);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    if (e.key === 'Escape') {
      if (elementRef.current) {
        elementRef.current.innerText = value;
      }
      elementRef.current?.blur();
    }
  };

  return (
    <span
      ref={elementRef as any}
      contentEditable={isLivePreview}
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsEditing(true)}
      className={`${className} outline-none transition-all ${
        isLivePreview ? 'hover:bg-amber-400/10 focus:bg-amber-400/20 rounded cursor-text ring-1 ring-transparent hover:ring-amber-400/40 focus:ring-amber-400/60 min-w-[1ch] inline-block' : ''
      }`}
      title={isLivePreview ? 'সরাসরি এডিট করতে ক্লিক করুন' : undefined}
    >
      {value || children}
    </span>
  );
};
