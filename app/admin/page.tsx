import BookSearch from "./components/BookSearch";
import LocationLookup from "./components/LocationLookup";
import { getAllTagsWithBookCount } from "@/app/api/tags/tag.controller";
import Link from "next/link";

const AdminHome = async () => {
  const tags = await getAllTagsWithBookCount();

  return (
    <>
      <div className="admin-section">
        <h1>Admin</h1>
        <LocationLookup />
      </div>
      <div className="admin-section">
        <BookSearch />
      </div>
      <div className="admin-section">
        <h2>Tags by popularity</h2>
        {tags.length === 0 ? (
          <p>No tags yet.</p>
        ) : (
          <div className="admin-results">
            {tags.map(tag => (
              <Link key={tag.id} className="admin-result-item" href={`/admin/tags/${tag.id}`}>
                <span>{tag.name}</span>
                <span style={{ color: '#888', fontSize: '13px' }}> — {tag.bookCount} {tag.bookCount === 1 ? 'book' : 'books'}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
