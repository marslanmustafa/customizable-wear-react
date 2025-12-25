
export const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  )
}

export const DialogContent = ({ children }) => <div>{children}</div>
export const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>
export const DialogTitle = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>
export const DialogTrigger = ({ children, onClick }) => (
  <div onClick={onClick}>{children}</div>
)