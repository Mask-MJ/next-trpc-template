import LayoutHeader from '@/components/layouts/header'

export default function IndexLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
