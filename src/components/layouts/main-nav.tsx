'use client'

import { Command } from 'lucide-react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { appConfig } from '@/config/app'
import { navList } from '@/config/nav'
import { cn } from '@/lib/utils'

export function MainNav() {
  const segment = useSelectedLayoutSegment()
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Command />
        <span className="hidden font-bold sm:inline-block">
          {appConfig.name}
        </span>
      </Link>
      {navList.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            'hover:text-foreground/80 flex items-center text-lg font-medium transition-colors sm:text-sm',
            item.href.startsWith(`/${segment}`)
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}
