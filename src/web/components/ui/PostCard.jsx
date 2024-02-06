import React from "react"

const PostCard = ({ author, title, id, description }) => (
  <article className="bg-white rounded-lg shadow-md p-4">
    <h1 className="text-xl font-bold mb-2">Author: {author?.split("@")[0]}</h1>
    <h2 className="text-2xl mb-2">
      {title} (#{id})
    </h2>
    <div className="border border-gray-300 p-4 mb-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Description:</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  </article>
)

export default PostCard
