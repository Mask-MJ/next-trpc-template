import { MainNav } from './main-nav'
import UserAccountNav from './user-account-nav'

export default function LayoutHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b-2 px-4">
      <MainNav />
      <UserAccountNav />
    </header>
  )
}
