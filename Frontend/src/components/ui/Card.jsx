import { cn } from '../../utils/cn'

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-bg-surface',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn('border-b border-border px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-black', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'flex items-center border-t border-border bg-bg-base px-6 py-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
