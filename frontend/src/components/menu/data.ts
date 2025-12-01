import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
} from "react-icons/hi2"

export const menu = [
  {
    catalog: "main",
    listItems: [
      {
        isLink: true,
        url: "/",
        icon: HiOutlineHome,
        label: "dashboard",
      },
      {
        isLink: true,
        url: "/profile",
        icon: HiOutlineUser,
        label: "profile",
      },
    ],
  },
  {
    catalog: "lists",
    listItems: [
      {
        isLink: true,
        url: "/users",
        icon: HiOutlineUsers,
        label: "users",
      },
      {
        isLink: true,
        url: "/products",
        icon: HiOutlineCube,
        label: "products",
      },
      {
        isLink: true,
        url: "/categories",
        icon: HiOutlineClipboardDocumentList,
        label: "categories",
      },
    ],
  },
  {
    catalog: "general",
    listItems: [
      {
        isLink: true,
        url: "/calendar",
        icon: HiOutlineCalendarDays,
        label: "calendar",
      },
    ],
  },
]
