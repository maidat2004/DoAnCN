import * as React from "react"

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => onOpenChange && onOpenChange(false)}
          />
          <div className="relative z-50 max-w-lg w-full mx-4">
            {children}
          </div>
        </div>
      )}
    </>
  )
}

const DialogTrigger = ({ children, asChild, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props)
  }
  return <div {...props}>{children}</div>
}

const DialogContent = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogHeader = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogTitle = ({ className = "", children, ...props }) => {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h2>
  )
}

const DialogDescription = ({ className = "", children, ...props }) => {
  return (
    <p
      className={`text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }
