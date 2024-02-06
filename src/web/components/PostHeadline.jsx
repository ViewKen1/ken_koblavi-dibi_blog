import Link from "@/web/components/ui/Link"

const PostHeadline = ({ id, title, description }) => (
  <article className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-4">
    <h1 className="text-2xl">
      <Link href={`/posts/${id}`}>
        Post number N°{id} :{title}
      </Link>
    </h1>
    <p className="text-gray-700">
      {description.split(/\s+/u).slice(0, 7).join(" ")}...
    </p>
  </article>
)

export default PostHeadline
