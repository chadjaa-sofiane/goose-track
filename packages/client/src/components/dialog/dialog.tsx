import { cn } from '@/lib/utils'
import React, { useLayoutEffect, useRef } from 'react'
import { type Variants, motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const usePortal = () => {
    const containerRef = useRef<HTMLDivElement>(document.createElement('div'))

    useLayoutEffect(() => {
        const container = containerRef.current
        if (container) {
            container.id = 'dialog-container'
            container.style.zIndex = '9999'
            document.body.appendChild(container)
        }
        return () => {
            if (container) {
                document.body.removeChild(container)
            }
        }
    }, [])

    return containerRef.current
}

interface DialogProps {
    children: React.ReactNode
    open: boolean
    setOpen?: (open: boolean) => void
}
const Dialog = ({ children, open, setOpen = () => null }: DialogProps) => {
    const container = usePortal()
    return createPortal(
        <AnimatePresence initial={true} mode="wait">
            {open && (
                <div className="fixed inset-0 isolate grid place-items-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm p-4 rounded-lg -z-10 cursor-pointer"
                        onClick={() => setOpen(false)}
                    />
                    {children}
                </div>
            )}
        </AnimatePresence>,
        container
    )
}

interface DialogContentProps {
    children: React.ReactNode
    className?: string
}

const popUpAnimation: Variants = {
    initial: {
        scale: 0.9,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.1,
            type: 'ease-in-out',
        },
    },
    exit: {
        scale: 0.9,
        transition: {
            duration: 0.01,
        },
    },
}

const DialogContent = ({ children, className }: DialogContentProps) => {
    return (
        <motion.div
            variants={popUpAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
                'box-content bg-bg text-text p-4 rounded-lg border border-[#42434b]',
                className
            )}
        >
            {children}
        </motion.div>
    )
}

export { Dialog, DialogContent }
