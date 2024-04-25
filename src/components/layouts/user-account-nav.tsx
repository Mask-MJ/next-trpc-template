import type { User } from 'next-auth'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getCurrentUser } from '@/lib/session'
import { cn } from '@/lib/utils'

import { UserAvatar } from './user-avatar'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'name' | 'image' | 'email'>
}

export default async function UserAccountNav() {
  const user = await getCurrentUser()
  if (!user) {
    return (
      <nav>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'sm' }),
            'px-4'
          )}
        >
          Login
        </Link>
      </nav>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="text-muted-foreground w-[200px] truncate text-sm">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event: Event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }}
        >
          Sign out
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
