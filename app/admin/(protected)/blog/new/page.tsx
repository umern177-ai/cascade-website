// New blog post — starts a blank editor with a fresh id.
import BlogForm from "@/components/BlogForm";

export default async function AdminNewPost() {
  const id = "new:" + Date.now().toString(36);
  return (
    <>
      <header className="adm-page-head">
        <div><h1>New blog post</h1><p>Everything you save here publishes to /blog/ when “Save as draft” is off.</p></div>
      </header>
      <BlogForm
        post={{ id, slug: "", title: "", description: "", date: new Date().toISOString().slice(0, 10), tag: "Guides", author: "Cascade Dispatch Team", readMinutes: 0, contentHtml: "<h2></h2>\n<p></p>" }}
      />
    </>
  );
}
