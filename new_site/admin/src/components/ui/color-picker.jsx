import React from 'react'
import { Label } from './label'

const ColorPicker = ({ label, value, onChange, tooltip }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-white">{label}</Label>
        {tooltip && (
          <div className="w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center cursor-help transition-colors group relative">
            <span className="text-white text-xs font-bold">?</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 leading-tight z-10">
              <div className="break-words">{tooltip}</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

export { ColorPicker }