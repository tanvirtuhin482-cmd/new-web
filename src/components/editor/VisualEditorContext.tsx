import React, { createContext, useContext, useState } from 'react';
import { QuickEditTarget } from '../../types/admin';

interface VisualEditorContextType {
  isLivePreview: boolean;
  showEditIcons: boolean;
  setShowEditIcons: React.Dispatch<React.SetStateAction<boolean>>;
  openQuickEdit: (target: QuickEditTarget) => void;
  activeQuickEdit: QuickEditTarget | null;
  closeQuickEdit: () => void;
  onSave: (field: string, newValue: any, productId?: string) => Promise<void> | void;
}

const VisualEditorContext = createContext<VisualEditorContextType>({
  isLivePreview: false,
  showEditIcons: false,
  setShowEditIcons: () => {},
  openQuickEdit: () => {},
  activeQuickEdit: null,
  closeQuickEdit: () => {},
  onSave: () => {},
});

export const useVisualEditor = () => useContext(VisualEditorContext);

interface VisualEditorProviderProps {
  children: React.ReactNode;
  isLivePreview: boolean;
  onSave: (field: string, newValue: any, productId?: string) => Promise<void> | void;
}

export const VisualEditorProvider: React.FC<VisualEditorProviderProps> = ({
  children,
  isLivePreview,
  onSave,
}) => {
  const [showEditIcons, setShowEditIcons] = useState(true);
  const [activeQuickEdit, setActiveQuickEdit] = useState<QuickEditTarget | null>(null);

  const openQuickEdit = (target: QuickEditTarget) => {
    setActiveQuickEdit(target);
  };

  const closeQuickEdit = () => {
    setActiveQuickEdit(null);
  };

  return (
    <VisualEditorContext.Provider
      value={{
        isLivePreview,
        showEditIcons,
        setShowEditIcons,
        openQuickEdit,
        activeQuickEdit,
        closeQuickEdit,
        onSave,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
};
