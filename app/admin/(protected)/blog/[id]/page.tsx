// Edit a blog post: id is either "base:<slug>" (the built-in planning guide,
// with any saved override) or "new:<id>" (a post created in the admin).
import { notFound } from "next/navigation";
import BlogForm, { EditorPost } from "@/components/BlogForm";
import { getBasePosts, getBlogFile } from "@/lib/admin/store";

export default async function AdminEditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id: rawId } = await params;
  const { saved } = await searchParams;
  const id = decodeURIComponent(rawId);

  const [base, file] = await Promise.all([getBasePosts(), getBlogFile()]);

  if (id.startsWith("base:")) {
    const slug = id.replace("base:", "");
    const basePost = base.find((b) => b.slug === slug);
    if (!basePost) notFound();
    const o = file.posts.find((p) => p.id === id);
    const post: EditorPost = {
      id,
      slug: o?.slug || basePost.slug,
      title: o?.title || basePost.title,
      description: o?.description || basePost.description,
      date: o?.date || basePost.date,
      tag: o?.tag || basePost.tag,
      author: o?.author || basePost.author,
      readMinutes: o?.readMinutes || basePost.readMinutes,
      image: o?.image || basePost.image,
      imageAlt: o?.imageAlt || basePost.imageAlt,
      contentHtml: o?.contentHtml || basePost.contentHtml,
      draft: o?.draft,
      isBase: true,
    };
    return (
      <>
        <header className="adm-page-head"><div><h1>{`Edit: ${post.title}`}</h1><p>Built-in guide — your edits override the original.</p></div></header>
        <BlogForm post={post} saved={!!saved} />
      </>
    );
  }

  const post = file.posts.find((p) => p.id === id);
  if (!post) notFound();
  return (
    <>
      <header className="adm-page-head"><div><h1>{`Edit: ${post.title || "Untitled draft"}`}</h1><p>Admin post.</p></div></header>
      <BlogForm post={{ ...post, isBase: false }} saved={!!saved} />
    </>
  );
}
