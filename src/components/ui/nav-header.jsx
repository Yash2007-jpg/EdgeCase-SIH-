"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

function NavHeader({ mode = "industry", onModeChange }) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })

  return (
    <nav className="flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
          M
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Manak Mitra
          </h1>

          <p className="text-xs text-slate-500">
            BIS Standards Assistant
          </p>
        </div>
      </div>

      {/* Navigation */}
      <ul
        className="relative hidden w-fit rounded-full border border-slate-200 bg-white p-1 shadow-sm md:flex"
        onMouseLeave={() =>
          setPosition((pv) => ({ ...pv, opacity: 0 }))
        }
      >
        <Tab setPosition={setPosition}>Standards</Tab>
        <Tab setPosition={setPosition}>BIS Services</Tab>
        <Tab setPosition={setPosition}>My Queries</Tab>

        <Cursor position={position} />
      </ul>

      {/* Mode */}
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          {mode === "consumer" ? "Consumer" : "Industry"}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onModeChange?.("industry")}>
            Industry
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onModeChange?.("consumer")}>
            Consumer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null)

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return

        const { width } = ref.current.getBoundingClientRect()

        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        })
      }}
      className="relative z-10 block cursor-pointer px-4 py-2 text-sm font-medium text-slate-700"
    >
      {children}
    </li>
  )
}

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className="absolute left-0 top-1 z-0 h-[calc(100%-8px)] rounded-full bg-slate-900"
    />
  )
}

export default NavHeader