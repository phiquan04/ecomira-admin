"use client"

import type React from "react"
import { NavLink } from "react-router-dom"
import type { IconType } from "react-icons"

interface MenuItemProps {
  onClick?: () => void
  catalog: string
  listItems: Array<{
    isLink: boolean
    url?: string
    icon: IconType
    label: string
    onClick?: () => void
  }>
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, catalog, listItems }) => {
  return (
    <div className="w-full flex flex-col items-stretch gap-1">
      <span className="hidden xl:block px-3 py-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        {catalog}
      </span>
      {listItems.map((listItem, index) => {
        if (listItem.isLink) {
          return (
            <NavLink
              key={index}
              onClick={onClick}
              to={listItem.url || ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-indigo-600"
                }`
              }
            >
              <listItem.icon className="text-xl" />
              <span className="text-sm font-medium capitalize">{listItem.label}</span>
            </NavLink>
          )
        } else {
          return (
            <button
              key={index}
              onClick={listItem.onClick}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200"
            >
              <listItem.icon className="text-xl" />
              <span className="text-sm font-medium capitalize">{listItem.label}</span>
            </button>
          )
        }
      })}
    </div>
  )
}

export default MenuItem
