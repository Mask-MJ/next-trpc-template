import { MainNav } from "./main-nav";
import { getCurrentUser } from "@/lib/session";
import UserAccountNav from "./user-account-nav";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default async function LayoutHeader() {
  const user = await getCurrentUser();

  return (
    <header className="flex h-16 items-center justify-between border-b-2 px-4">
      <MainNav />
      {user ? (
        <UserAccountNav
          user={{
            name: user.name,
            image: user.image,
            email: user.email,
          }}
        />
      ) : (
        <nav>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
          >
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
