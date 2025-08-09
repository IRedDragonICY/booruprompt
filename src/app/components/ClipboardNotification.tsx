// src/app/components/ClipboardNotification.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClipboardNotificationProps {
  message: string;
  show: boolean;
  onHide: () => void; // Callback to update parent state when notification hides
}

const ClipboardNotification: React.FC<ClipboardNotificationProps> = ({ message, show, onHide }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onHide();
      }, 2500); // Auto-hide after 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 rounded-md bg-gray-800 bg-opacity-80 px-4 py-2 text-sm text-white shadow-lg dark:bg-black dark:bg-opacity-70"
          // Ensure it's above other elements, adjust z-index as needed
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClipboardNotification;
