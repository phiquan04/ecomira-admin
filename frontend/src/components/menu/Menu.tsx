"use client"

import { menu } from "./data"
import MenuItem from "./MenuItem"

const Menu = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-white to-indigo-50/30">
      <div className="w-full flex flex-col gap-2 p-4">
        {menu.map((item, index) => (
          <MenuItem key={index} catalog={item.catalog} listItems={item.listItems} />
        ))}
      </div>
    </div>
  )
}

export default Menu
