"use client";
import { deleteBookTag } from "@/app/lib/api/tag.api";
import { Tag } from "@/app/lib/types";
import { useRouter } from "next/navigation";

type BookTagsProps = {
  bookId: string;
  tags: Tag[];
}

const BookTags = ({ bookId, tags }: BookTagsProps) => {
  const router = useRouter();

  const handleDeleteClick = (tagId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteBookTag(bookId, tagId).then(() => router.refresh());
  }

  return (
    <div className="admin-section">
      <h3>Tags</h3>
      {tags.length === 0 ? (
        <p>No tags yet.</p>
      ) : (
        <ul className="admin-location-list">
          {tags.map((tag) => (
            <li className="admin-location-item" key={tag.id}>
              <span>{tag.name}</span>
              <button className="admin-btn-danger" onClick={handleDeleteClick(tag.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookTags;
