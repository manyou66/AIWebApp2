"use client";
 
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type SubmitEvent,
} from "react";
 
type Prompt = {
  id: number;
  title: string;
  prompt_text: string;
  category: string | null;
  created_at: string;
};
 
export default function SavedPromptsPage() {
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("");
 
  const [items, setItems] = useState<Prompt[]>([]);
  const [editingId, setEditingId] =
    useState<number | null>(null);
 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
 
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
 
  const load = useCallback(async () => {
    setLoading(true);
 
    try {
      const response = await fetch("/api/prompts");
 
      if (!response.ok) {
        throw new Error("GET failed");
      }
 
      const data: { prompts: Prompt[] } =
        await response.json();
 
      setItems(data.prompts);
    } catch {
      setError(
        "Cannot load prompts. Check PostgreSQL."
      );
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    void load();
  }, [load]);
 
  function clearForm() {
    setTitle("");
    setPromptText("");
    setCategory("");
    setEditingId(null);
  }
 
  function edit(item: Prompt) {
    setTitle(item.title);
    setPromptText(item.prompt_text);
    setCategory(item.category || "");
    setEditingId(item.id);
    setError("");
    setMessage("");
 
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
 
  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
 
    if (!title.trim() || !promptText.trim()) {
      setError("Title and Prompt are required.");
      return;
    }
 
    setSaving(true);
    setError("");
    setMessage("");
 
    const isEdit = editingId !== null;
 
    try {
      const response = await fetch(
        isEdit
          ? `/api/prompts/${editingId}`
          : "/api/prompts",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            promptText,
            category,
          }),
        }
      );
 
      if (!response.ok) {
        throw new Error("Save failed");
      }
 
      clearForm();
      await load();
 
      setMessage(
        isEdit
          ? "Prompt updated successfully."
          : "Prompt saved successfully."
      );
    } catch {
      setError("Cannot save prompt.");
    } finally {
      setSaving(false);
    }
  }
 
  async function remove(id: number) {
    if (!window.confirm("Delete this prompt?")) {
      return;
    }
 
    setError("");
    setMessage("");
 
    try {
      const response = await fetch(
        `/api/prompts/${id}`,
        { method: "DELETE" }
      );
 
      if (!response.ok) {
        throw new Error("Delete failed");
      }
 
      if (editingId === id) {
        clearForm();
      }
 
      await load();
      setMessage("Prompt deleted.");
    } catch {
      setError("Cannot delete prompt.");
    }
  }
 
  return (
    <main className="ux-shell">
      <header className="ux-hero">
        <p className="ux-eyebrow">
          AI APPLICATION DEVELOPMENT
        </p>
 
        <h1>Saved Prompts</h1>
 
        <p>
          Manage prompt templates for future
          AI Chat features.
        </p>
 
        <Link
          href="/"
          className="ux-button ux-button-light"
        >
          ← Back to Home
        </Link>
      </header>
 
      <section className="ux-card">
        <p className="ux-eyebrow">
          WEEK 6 · POSTGRESQL
        </p>
 
        <h2>
          {editingId === null
            ? "Create Prompt"
            : "Edit Prompt"}
        </h2>
 
        <form
          className="ux-form"
          onSubmit={save}
        >
          <label htmlFor="title">
            Title
          </label>
 
          <input
            id="title"
            className="ux-input"
            value={title}
            maxLength={200}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />
 
          <label htmlFor="prompt">
            Prompt
          </label>
 
          <textarea
            id="prompt"
            className="ux-input ux-textarea"
            value={promptText}
            onChange={(e) =>
              setPromptText(e.target.value)
            }
            required
          />
 
          <label htmlFor="category">
            Category
          </label>
 
          <input
            id="category"
            className="ux-input"
            value={category}
            maxLength={100}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />
 
          <div className="ux-actions">
            <button
              className="ux-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId === null
                  ? "Save Prompt"
                  : "Update Prompt"}
            </button>
 
            {editingId !== null && (
              <button
                type="button"
                className="ux-button ux-button-light"
                onClick={clearForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
 
        {error && (
          <p className="ux-error" role="alert">
            {error}
          </p>
        )}
 
        {message && (
          <p className="ux-success" role="status">
            {message}
          </p>
        )}
      </section>
 
      <section className="ux-card">
        <p className="ux-eyebrow">
          SAVED DATA
        </p>
 
        <h2>My Saved Prompts</h2>
 
        {loading && <p>Loading...</p>}
 
        {!loading && items.length === 0 && (
          <p>No saved prompts yet.</p>
        )}
 
        <div className="ux-prompt-list">
          {items.map((item) => (
            <article
              key={item.id}
              className="ux-prompt-item"
            >
              <div className="ux-prompt-heading">
                <h3>{item.title}</h3>
 
                <span className="ux-tag">
                  {item.category || "General"}
                </span>
              </div>
 
              <p className="ux-prompt-text">
                {item.prompt_text}
              </p>
 
              <div className="ux-actions">
                <button
                  type="button"
                  className="ux-button ux-button-light"
                  onClick={() => edit(item)}
                >
                  Edit
                </button>
 
                <button
                  type="button"
                  className="ux-button ux-button-danger"
                  onClick={() =>
                    void remove(item.id)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
