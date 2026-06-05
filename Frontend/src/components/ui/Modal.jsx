import { useEffect } from 'react'
import { cn } from '../../utils/cn'

export function Modal({
  isOpen,
  open,
  onClose,
  title,
  children,
  className,
}) {
  const visible = Boolean(isOpen ?? open)

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [visible])

  if (!visible) {
    return null
  }

  if (title) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm',
          className,
        )}
        role="presentation"
        onClick={onClose}
      >
        <div
          className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-bg-surface shadow-xl"
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-black">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md p-1 text-black opacity-50 transition-opacity hover:bg-border hover:opacity-100"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8',
        className,
      )}
      role="presentation"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[var(--bg)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
