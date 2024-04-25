import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { authOptions } from "@/server/auth";
import { api } from "@/trpc/server";

export const metadata = {
  title: "Blog",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const hello = await api.post.hello.query({ text: "111" });
  // const posts = await appRouter.post.getPosts({ ctx: { session: { user } } })
  return <div>{hello.greeting}</div>;
}
