/** CSS override styles for enhanced module content rendering.
 *  Extracted to keep the orchestrator component lean. */
export const enhancedModuleStyles = `
  .enhanced-module-content,
  .enhanced-module-content *:not([style*="color: white"]):not([style*="color:white"]):not([style*="background"]),
  .enhanced-module-content p,
  .enhanced-module-content h1,
  .enhanced-module-content h2,
  .enhanced-module-content h3,
  .enhanced-module-content h4,
  .enhanced-module-content h5,
  .enhanced-module-content h6,
  .enhanced-module-content li,
  .enhanced-module-content ul,
  .enhanced-module-content ol,
  .enhanced-module-content strong,
  .enhanced-module-content span:not([style*="color: white"]):not([style*="color:white"]),
  .enhanced-module-content div:not([style*="color: white"]):not([style*="color:white"]):not([style*="background"]),
  .enhanced-module-content table,
  .enhanced-module-content td,
  .enhanced-module-content th {
    color: #000000 !important;
  }
  
  .enhanced-module-content div[style*="background: #1f2937"],
  .enhanced-module-content div[style*="background:#1f2937"],
  .enhanced-module-content div[style*="background: rgb(31, 41, 55)"],
  .enhanced-module-content div[style*="background:rgb(31, 41, 55)"],
  .enhanced-module-content div[style*="background: #374151"],
  .enhanced-module-content div[style*="background:#374151"],
  .enhanced-module-content div[style*="background: rgb(55, 65, 81)"] {
    background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%) !important;
    border: 2px solid #3b82f6 !important;
    color: #000000 !important;
    border-radius: 0.5rem !important;
  }
  
  .enhanced-module-content div[style*="background: #1f2937"] div,
  .enhanced-module-content div[style*="background:#1f2937"] div,
  .enhanced-module-content div[style*="background: rgb(31, 41, 55)"] div,
  .enhanced-module-content div[style*="background:rgb(31, 41, 55)"] div,
  .enhanced-module-content div[style*="background: #374151"] div,
  .enhanced-module-content div[style*="background:#374151"] div {
    color: #000000 !important;
  }
  
  .enhanced-module-content div[style*="background: #1f2937"] div[style*="color: white"],
  .enhanced-module-content div[style*="background:#1f2937"] div[style*="color: white"],
  .enhanced-module-content div[style*="background: rgb(31, 41, 55)"] div[style*="color: white"],
  .enhanced-module-content div[style*="background: #374151"] div[style*="color: white"] {
    color: #1e40af !important;
    font-weight: 700 !important;
  }
  
  .enhanced-module-content div[style*="background: #1f2937"] div[style*="color: #e5e7eb"],
  .enhanced-module-content div[style*="background:#1f2937"] div[style*="color: #e5e7eb"],
  .enhanced-module-content div[style*="background: rgb(31, 41, 55)"] div[style*="color: #e5e7eb"],
  .enhanced-module-content div[style*="background: #374151"] div[style*="color: #e5e7eb"] {
    color: #1e3a8a !important;
  }
  
  .enhanced-module-content div[style*="background: #1f2937"] div[style*="color: #9ca3af"],
  .enhanced-module-content div[style*="background:#1f2937"] div[style*="color: #9ca3af"],
  .enhanced-module-content div[style*="background: rgb(31, 41, 55)"] div[style*="color: #9ca3af"],
  .enhanced-module-content div[style*="background: #374151"] div[style*="color: #9ca3af"] {
    color: #3b82f6 !important;
  }
  
  .enhanced-module-content div[style*="border"],
  .enhanced-module-content div[style*="border: 2px solid #1f2937"],
  .enhanced-module-content div[style*="border:2px solid #1f2937"],
  .enhanced-module-content div[style*="border: 1px solid"],
  .enhanced-module-content div[style*="border:1px solid"],
  .enhanced-module-content div[style*="border-left"],
  .enhanced-module-content div[style*="border-bottom"],
  .enhanced-module-content div[style*="border-top"],
  .enhanced-module-content div[style*="border-right"] {
    border-color: #3b82f6 !important;
  }
  
  .enhanced-module-content div[style*="border: 2px solid #1f2937"],
  .enhanced-module-content div[style*="border:2px solid #1f2937"],
  .enhanced-module-content div[style*="border: 1px solid #e5e7eb"],
  .enhanced-module-content div[style*="border:1px solid #e5e7eb"],
  .enhanced-module-content div[style*="border-left: 4px solid #1f2937"],
  .enhanced-module-content div[style*="border-left:4px solid #1f2937"],
  .enhanced-module-content div[style*="border-left: 2px solid #1f2937"],
  .enhanced-module-content div[style*="border-left:2px solid #1f2937"] {
    border-color: #3b82f6 !important;
  }
  
  .enhanced-module-content div[style*="background: #f9fafb"],
  .enhanced-module-content div[style*="background:#f9fafb"],
  .enhanced-module-content div[style*="background: rgb(249, 250, 251)"],
  .enhanced-module-content div[style*="background: #f3f4f6"],
  .enhanced-module-content div[style*="background:#f3f4f6"] {
    background: #ffffff !important;
    border: 2px solid #3b82f6 !important;
    border-radius: 0.5rem !important;
  }
  
  .enhanced-module-content table {
    border: 2px solid #3b82f6 !important;
    border-radius: 0.5rem !important;
    overflow: hidden !important;
  }
  
  .enhanced-module-content thead,
  .enhanced-module-content thead tr,
  .enhanced-module-content thead tr[style*="background"],
  .enhanced-module-content tr[style*="background: #1f2937"],
  .enhanced-module-content tr[style*="background:#1f2937"],
  .enhanced-module-content tr[style*="background: rgb(31, 41, 55)"] {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  }
  
  .enhanced-module-content thead th,
  .enhanced-module-content th[style*="background"],
  .enhanced-module-content th[style*="background: #1f2937"],
  .enhanced-module-content th[style*="background:#1f2937"],
  .enhanced-module-content th[style*="background: rgb(31, 41, 55)"],
  .enhanced-module-content tr[style*="background: #1f2937"] th,
  .enhanced-module-content tr[style*="background:#1f2937"] th {
    color: #ffffff !important;
    border-color: #1e40af !important;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  }
  
  .enhanced-module-content table thead tr th,
  .enhanced-module-content table thead th,
  .enhanced-module-content th,
  .enhanced-module-content th[style*="color"],
  .enhanced-module-content thead tr th[style*="color"],
  .enhanced-module-content thead th[style*="color: white"],
  .enhanced-module-content thead th[style*="color:white"],
  .enhanced-module-content tr[style*="background: #1f2937"] th,
  .enhanced-module-content tr[style*="background:#1f2937"] th {
    color: #ffffff !important;
  }
  
  .enhanced-module-content thead th[style*="color: black"],
  .enhanced-module-content thead th[style*="color:black"],
  .enhanced-module-content thead th[style*="color: #000"],
  .enhanced-module-content thead th[style*="color:#000"],
  .enhanced-module-content thead th[style*="color: #000000"],
  .enhanced-module-content thead th[style*="color:#000000"] {
    color: #ffffff !important;
  }
  
  .enhanced-module-content tbody tr {
    border-bottom: 1px solid #bfdbfe !important;
  }
  
  .enhanced-module-content tbody tr:nth-child(even) {
    background: #eff6ff !important;
  }
  
  .enhanced-module-content td,
  .enhanced-module-content th {
    border-color: #bfdbfe !important;
  }
  
  .enhanced-module-content div[style*="background: #1f2937"][style*="height"],
  .enhanced-module-content div[style*="background:#1f2937"][style*="height"],
  .enhanced-module-content div[style*="background: #374151"][style*="height"],
  .enhanced-module-content div[style*="background:#374151"][style*="height"],
  .enhanced-module-content div[style*="background: #4b5563"][style*="height"],
  .enhanced-module-content div[style*="background:#4b5563"][style*="height"],
  .enhanced-module-content div[style*="background: #6b7280"][style*="height"],
  .enhanced-module-content div[style*="background:#6b7280"][style*="height"],
  .enhanced-module-content div[style*="background: #9ca3af"][style*="height"],
  .enhanced-module-content div[style*="background:#9ca3af"][style*="height"] {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) !important;
  }
`
