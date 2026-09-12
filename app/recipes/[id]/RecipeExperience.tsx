"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Printer, Star } from "lucide-react";

type ClanNote = {
  id: number;
  author_name: string;
  rating: number;
  note: string;
  created_at: string;
};

const supabaseUrl = "https://xtddsgidhschvmqiilrm.supabase.co";
const supabaseKey = "sb_publishable_3KAGy12FhfoXs-q7427uwQ__PyEI_Ob";

function Stars({ rating, label }: { rating: number; label?: string }) {
  return <span className="stars" aria-label={label ?? `${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => <Star key={star} aria-hidden="true" className={star <= rating ? "star-filled" : ""} />)}
  </span>;
}

export default function RecipeExperience({ recipeId, recipeTitle }: { recipeId: string; recipeTitle: string }) {
  const [notes, setNotes] = useState<ClanNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({
      select: "id,author_name,rating,note,created_at",
      recipe_id: `eq.${recipeId}`,
      status: "eq.approved",
      order: "created_at.desc",
    });

    fetch(`${supabaseUrl}/rest/v1/clan_notes?${query}`, {
      headers: { apikey: supabaseKey },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load notes");
        return response.json();
      })
      .then((data: ClanNote[]) => setNotes(data))
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [recipeId]);

  const average = notes.length
    ? notes.reduce((sum, item) => sum + item.rating, 0) / notes.length
    : null;

  async function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (website || !name.trim() || !note.trim() || rating < 1) return;
    setStatus("sending");

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/clan_notes`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          recipe_id: recipeId,
          author_name: name.trim(),
          rating,
          note: note.trim(),
          status: "pending",
        }),
      });
      if (!response.ok) throw new Error("Unable to submit note");
      setName("");
      setRating(0);
      setNote("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return <section className="reviews no-print" aria-labelledby="reviews-title">
      <div className="reviews-heading">
        <div><p className="eyebrow"><MessageCircle aria-hidden="true" /> Clan Notes</p><h2 id="reviews-title">Made this recipe?</h2><p>Rate it and leave a note for the rest of the clan.</p></div>
        {average !== null && <div className="average-rating"><strong>{average.toFixed(1)}</strong><Stars rating={Math.round(average)} label={`${average.toFixed(1)} average rating out of 5`} /><span>{notes.length} {notes.length === 1 ? "note" : "notes"}</span></div>}
      </div>

      <form className="review-form" onSubmit={submitNote}>
        <div className="form-field"><label htmlFor="clan-name">Your name</label><input id="clan-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={60} required autoComplete="name" /></div>
        <fieldset><legend>Your rating</legend><div className="rating-picker">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className={star <= rating ? "selected" : ""} onClick={() => setRating(star)} aria-label={`${star} star${star === 1 ? "" : "s"}`} aria-pressed={rating === star}><Star aria-hidden="true" /></button>)}</div></fieldset>
        <div className="form-field form-note"><label htmlFor="clan-note">Clan Note</label><textarea id="clan-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} rows={5} required placeholder={`What should the family know about ${recipeTitle}?`} /></div>
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></div>
        <button className="submit-note-button" type="submit" disabled={status === "sending" || rating < 1}>{status === "sending" ? "Sending…" : "Submit Clan Note"}</button>
        <p className="moderation-note">Your note will appear after it is approved.</p>
        {status === "success" && <p className="form-message success" role="status">Your Clan Note was sent for approval. Thank you!</p>}
        {status === "error" && <p className="form-message error" role="alert">That note didn’t send. Please try again in a moment.</p>}
      </form>

      <div className="approved-notes" aria-live="polite">
        {loading && <p>Loading Clan Notes…</p>}
        {loadError && <p>Clan Notes are temporarily unavailable.</p>}
        {!loading && !loadError && notes.length === 0 && <div className="no-notes"><MessageCircle aria-hidden="true" /><h3>Be the first to leave a Clan Note</h3><p>Share a swap, shortcut, memory, or verdict for the family.</p></div>}
        {notes.map((item) => <article className="approved-note" key={item.id}><div><strong>{item.author_name}</strong><Stars rating={item.rating} /><time dateTime={item.created_at}>{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(item.created_at))}</time></div><p>{item.note}</p></article>)}
      </div>
    </section>;
}

export function PrintRecipeButton() {
  return <button className="print-recipe-button no-print" type="button" onClick={() => window.print()}><Printer aria-hidden="true" /> Print Recipe</button>;
}
