import React from "react"

interface SeparatorProps {
  className?: string
}

export const Separator: React.FC<SeparatorProps> = ({ className = "" }) => {
  return <div className={`h-[1px] w-full bg-slate-200 ${className}`} />
}
