"use client";
import { addTagToBook, getAllTags } from "@/app/lib/api/tag.api";
import { TagWithCount } from "@/app/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AddBookTagProps = {
  bookId: string;
  existingTagIds: string[];
}

const AddBookTag = ({ bookId, existingTagIds }: AddBookTagProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [allTags, setAllTags] = useState<TagWithCount[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getAllTags().then(setAllTags);
  }, []);

  const suggestions = name.trim()
    ? allTags.filter(
        t => t.name.includes(name.trim().toLowerCase()) && !existingTagIds.includes(t.id)
      )
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addTagToBook(bookId, name.trim());
    setName("");
    setShowSuggestions(false);
    router.refresh();
  };

  const handleSuggestionClick = (tagName: string) => {
    setName(tagName);
    setShowSuggestions(false);
  };

  return (
    <div className="admin-section">
      <h3>Add tag</h3>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="tag-name">Tag name</label>
          <div className="admin-autocomplete-wrapper">
            <input
              id="tag-name"
              className="admin-input"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="e.g. fiction"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="admin-autocomplete-dropdown">
                {suggestions.map(tag => (
                  <li
                    key={tag.id}
                    className="admin-autocomplete-item"
                    onMouseDown={() => handleSuggestionClick(tag.name)}
                  >
                    {tag.name}
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>
                      {tag.bookCount} {tag.bookCount === 1 ? 'book' : 'books'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" type="submit" disabled={!name.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}

export default AddBookTag;
