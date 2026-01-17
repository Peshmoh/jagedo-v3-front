/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function DropdownSidebarMenu({
    item,
    isCollapsed,
    isActive,
    isActiveFn
}) {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    // Open if any submenu is active
    useEffect(() => {
        if (isActive) setOpen(true);
    }, [isActive, location.pathname]);

    const handleToggle = () => setOpen((prev) => !prev);

    return (
        <div>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="relative flex items-center justify-between"
                >
                    <div
                        className="flex items-center w-full cursor-pointer"
                        onClick={handleToggle}
                    >
                        <item.icon
                            className="h-12 w-12"
                            style={{ color: item.color }}
                        />
                        {!isCollapsed && (
                            <span className="ml-2 flex-1 text-md">
                                {item.title}
                            </span>
                        )}
                        {!isCollapsed &&
                            (open ? (
                                <ChevronUp className="ml-auto h-4 w-4" />
                            ) : (
                                <ChevronDown className="ml-auto h-4 w-4" />
                            ))}
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Animate submenu */}
            {!isCollapsed && (
                <div
                    className={`ml-8 overflow-hidden transition-all duration-300 ${
                        open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    {item.submenu.map((sub: any) => (
                        <SidebarMenuItem
                            key={sub.title}
                            className={`relative ${
                                isActiveFn(sub.href) ? "bg-gray-100" : ""
                            }`}
                        >
                            <SidebarMenuButton
                                asChild
                                isActive={isActiveFn(sub.href)}
                                className="pl-6 text-sm"
                            >
                                <Link to={sub.href}>
                                    {sub.icon && (
                                        <sub.icon
                                            className="h-4 w-4 mr-2"
                                            style={{ color: sub.color }}
                                        />
                                    )}
                                    {sub.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </div>
            )}
        </div>
    );
}
