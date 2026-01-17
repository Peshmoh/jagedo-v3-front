import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[]
}

export function BreadcrumbNav({ items = [] }: BreadcrumbNavProps) {
  // Auto-generate breadcrumbs from current path if no items provided
  const defaultItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ]

  const breadcrumbItems = items.length > 0 ? items : defaultItems

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      <Home className="h-4 w-4" />
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.current || index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link to={item.href || "#"} className="hover:text-gray-700 transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
