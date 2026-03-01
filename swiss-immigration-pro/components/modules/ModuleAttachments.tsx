'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'

interface ModuleAttachmentsProps {
  attachments: string[]
}

export default function ModuleAttachments({ attachments }: ModuleAttachmentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Download className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Downloads</h2>
      </div>
      <div className="space-y-3">
        {attachments.map((attachment, idx) => (
          <a
            key={idx}
            href={attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              <span className="text-gray-700 font-medium">
                {attachment.split('/').pop() ?? `Attachment ${idx + 1}`}
              </span>
            </div>
            <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </a>
        ))}
      </div>
    </motion.div>
  )
}
