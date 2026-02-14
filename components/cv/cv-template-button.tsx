"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import CVTemplateModal from "./cv-template-modal"

interface CVTemplateButtonProps {
  cvId: string
}

export default function CVTemplateButton({ cvId }: CVTemplateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2  text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
        title="Choose Template & Download"
      >
        <Download className="h-4 w-4" />
      </Button>

      {isOpen && <CVTemplateModal cvId={cvId} onClose={() => setIsOpen(false)} />}
    </>
  )
}
