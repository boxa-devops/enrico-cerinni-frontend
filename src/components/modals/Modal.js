/**
 * Modal Component
 * 
 * A flexible modal dialog component with consistent styling and accessibility features.
 * Supports multiple sizes, custom content, and proper focus management.
 * 
 * @component
 * @example
 * <Modal
 *   isOpen={showModal}
 *   onClose={handleClose}
 *   title="Modal Title"
 *   size="lg"
 * >
 *   <p>Modal content goes here</p>
 * </Modal>
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  headerClassName,
  contentClassName,
  overlayClassName,
  ...props 
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size configurations - made more compact
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md', 
    large: 'max-w-lg',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
    full: 'max-w-full mx-3',
  };

  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      
      // Focus modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      return () => {
        // Cleanup
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        
        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, handleKeyDown]);

  // Don't render if not open
  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-3',
        'bg-black/40 backdrop-blur-sm',
        'animate-in fade-in duration-200',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        ref={modalRef}
        className={cn(
          'relative w-full bg-white rounded-lg shadow-xl border border-gray-200',
          'max-h-[90vh] overflow-hidden',
          'animate-in zoom-in-95 duration-200',
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={cn(
            'flex items-center justify-between px-4 py-3',
            'border-b border-gray-100',
            headerClassName
          )}>
            {title && (
              <h2 
                id="modal-title" 
                className="text-base font-semibold text-gray-900 truncate"
              >
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button 
                type="button"
                onClick={onClose}
                className={cn(
                  'flex items-center justify-center p-1',
                  'text-gray-400 hover:text-gray-600',
                  'hover:bg-gray-100 rounded-md',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-1 focus:ring-blue-400/30',
                  !title && 'ml-auto'
                )}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          'px-4 py-4 overflow-y-auto',
          'max-h-[calc(90vh-60px)]', // Account for smaller header
          contentClassName
        )}>
          {children}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

// Modal compound components for better composition
const ModalHeader = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

const ModalBody = ({ children, className, ...props }) => (
  <div className={cn('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

const ModalFooter = ({ children, className, ...props }) => (
  <div className={cn(
    'flex items-center justify-end gap-3 px-6 py-4',
    'border-t border-gray-200 bg-gray-50/50',
    className
  )} {...props}>
    {children}
  </div>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal; 