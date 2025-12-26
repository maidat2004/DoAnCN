import * as React from "react"
import { ChevronDown } from "lucide-react"

const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = React.useState(false)
  console.log('Select render:', { value, hasOnValueChange: !!onValueChange })
  
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange, open, setOpen, allChildren: children })
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className = "", children, value, open, setOpen, onValueChange, allChildren, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen && setOpen(!open)}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectValue) {
          return React.cloneElement(child, { value, allChildren })
        }
        return child
      })}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value, allChildren }) => {
  // Find label from allChildren based on value
  const findLabel = (children, targetValue) => {
    let label = ""
    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        if (child.props?.value === targetValue && child.props?.children) {
          label = child.props.children
        }
        if (!label && child.props?.children) {
          const nestedLabel = findLabel(child.props.children, targetValue)
          if (nestedLabel) label = nestedLabel
        }
      }
    })
    return label
  }
  
  const label = value ? findLabel(allChildren, value) : ""
  console.log('SelectValue render:', { value, label, placeholder, hasAllChildren: !!allChildren })
  return <span>{label || placeholder || "Select..."}</span>
}

const SelectContent = ({ className = "", children, open, setOpen, onValueChange, allChildren }) => {
  console.log('SelectContent render:', { open, childrenCount: React.Children.count(children) })
  
  if (!open) return null
  
  return (
    <>
      <div 
        className="fixed inset-0 z-[100]" 
        onClick={() => {
          console.log('Backdrop clicked')
          setOpen && setOpen(false)
        }}
      />
      <div
        className={`absolute z-[200] mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ${className}`}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onValueChange, setOpen })
          }
          return child
        })}
      </div>
    </>
  )
}

const SelectItem = ({ className = "", children, value, onValueChange, setOpen, ...props }) => {
  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${className}`}
      onClick={() => {
        console.log('SelectItem clicked:', { value, children, hasOnValueChange: !!onValueChange })
        onValueChange && onValueChange(value)
        setOpen && setOpen(false)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
