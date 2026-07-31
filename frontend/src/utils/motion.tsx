// Safe motion wrapper — replaces framer-motion completely
// Uses CSS transitions, no broken .mjs dependencies

import React, { useEffect, useState, forwardRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = any

interface MotionDivProps extends React.HTMLAttributes<HTMLDivElement> {
  initial?: AnyProps
  animate?: AnyProps
  exit?: AnyProps
  transition?: AnyProps
  whileHover?: AnyProps
  whileTap?: AnyProps
  variants?: AnyProps
  custom?: unknown
  layout?: boolean
  layoutId?: string
}

interface MotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  initial?: AnyProps
  animate?: AnyProps
  exit?: AnyProps
  transition?: AnyProps
  whileHover?: AnyProps
  whileTap?: AnyProps
  variants?: AnyProps
  custom?: unknown
}

interface MotionTrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  initial?: AnyProps
  animate?: AnyProps
  exit?: AnyProps
  transition?: AnyProps
  custom?: unknown
  variants?: AnyProps
}

function useFadeIn(delay = 0) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000 + 20)
    return () => clearTimeout(t)
  }, [delay])
  return visible
}

const Div = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ initial, animate, exit, transition, whileHover, whileTap, variants, custom, layout, layoutId,
     style, className, children, ...rest }, ref) => {
    const delay = typeof custom === 'number' ? custom * 0.06 : (transition as any)?.delay ?? 0
    const visible = useFadeIn(delay)
    const dur = (transition as any)?.duration ?? 0.35
    const initY = (initial as any)?.y ?? 0
    const initX = (initial as any)?.x ?? 0
    const initO = (initial as any)?.opacity ?? 0

    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: visible ? 1 : initO,
          transform: visible ? 'translate(0,0)' : `translate(${initX}px,${initY}px)`,
          transition: `opacity ${dur}s ease, transform ${dur}s ease`,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    )
  }
)
Div.displayName = 'MotionDiv'

const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ initial, animate, exit, transition, whileHover, whileTap, variants, custom,
     style, className, children, ...rest }, ref) => (
    <button ref={ref} className={className} style={style} {...rest}>
      {children}
    </button>
  )
)
Button.displayName = 'MotionButton'

const Tr = forwardRef<HTMLTableRowElement, MotionTrProps>(
  ({ initial, animate, exit, transition, custom, variants, style, className, children, ...rest }, ref) => {
    const delay = typeof custom === 'number' ? custom * 0.06 : (transition as any)?.delay ?? 0
    const visible = useFadeIn(delay)
    return (
      <tr
        ref={ref}
        className={className}
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity 0.3s ease`,
          ...style,
        }}
        {...rest}
      >
        {children}
      </tr>
    )
  }
)
Tr.displayName = 'MotionTr'

export const motion = { div: Div, button: Button, tr: Tr }

export const AnimatePresence = ({
  children,
}: {
  children: React.ReactNode
  mode?: string
  initial?: boolean
}) => <>{children}</>

export default motion
