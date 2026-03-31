"use client"

import * as React from "react"
import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PromptInputContextValue {
  value: string
  setValue: (value: string) => void
  isLoading: boolean
  maxHeight: number | string
  onSubmit?: () => void
  disabled: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null)

function usePromptInput() {
  const context = React.useContext(PromptInputContext)
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput")
  }
  return context
}

export type PromptInputProps = {
  value?: string
  onValueChange?: (value: string) => void
  isLoading?: boolean
  maxHeight?: number | string
  onSubmit?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
} & React.ComponentProps<"div">

function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
  onClick,
  ...props
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!disabled) textareaRef.current?.focus()
    onClick?.(e)
  }

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled,
          textareaRef,
        }}
      >
        <div
          onClick={handleClick}
          className={cn(
            "border-input bg-background cursor-text rounded-2xl border p-2",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  )
}

export type PromptInputTextareaProps = {
  disableAutosize?: boolean
} & React.ComponentProps<typeof Textarea>

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, maxHeight, onSubmit, disabled, textareaRef } = usePromptInput()

  const adjustHeight = React.useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (!el || disableAutosize) return
      el.style.height = "auto"
      if (typeof maxHeight === "number") {
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
      } else {
        el.style.height = `min(${el.scrollHeight}px, ${maxHeight})`
      }
    },
    [maxHeight, disableAutosize]
  )

  const handleRef = (el: HTMLTextAreaElement | null) => {
    textareaRef.current = el
    adjustHeight(el)
  }

  useLayoutEffect(() => {
    if (!textareaRef.current || disableAutosize) return
    adjustHeight(textareaRef.current)
  }, [value, maxHeight, disableAutosize, adjustHeight, textareaRef])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight(e.target)
    setValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault()
      onSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <Textarea
      ref={handleRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-foreground min-h-[44px] w-full resize-none border-none bg-transparent dark:bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      rows={1}
      disabled={disabled}
      {...props}
    />
  )
}

function PromptInputActions({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: {
  tooltip: React.ReactNode
  children: React.ReactNode
  className?: string
  side?: "top" | "bottom" | "left" | "right"
} & React.ComponentProps<typeof Tooltip>) {
  const { disabled } = usePromptInput()
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled} onClick={(e) => e.stopPropagation()}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export { PromptInput, PromptInputTextarea, PromptInputActions, PromptInputAction }
