import { getCurrentUser } from "@/lib/session";
import { EmptyPlaceholder } from "./_components/empty-placeholder";
import { PostCreateButton } from "./_components/post-create-button";
import { PostItem } from "./_components/post-item";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }

  const posts = await api.post.getPostsByAuthor(user.id);

  return (
    <div className={cn("grid items-start gap-8")}>
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl md:text-4xl">Posts</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage posts.
          </p>
        </div>
        <PostCreateButton />
      </div>
      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="FileText" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </div>
  );
}
