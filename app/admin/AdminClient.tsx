"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarPlus, Edit3, Link2, LogOut, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { VaganzaLogo } from "@/components/VaganzaLogo";

type EventItem = { id: number; titleEn: string; titlePt: string; descriptionEn: string; descriptionPt: string; date: string; time: string; venue: string; price: number; image: string; published: boolean; featured: boolean };
type EventForm = Omit<EventItem, "id">;
const empty: EventForm = { titleEn: "", titlePt: "", descriptionEn: "", descriptionPt: "", date: "", time: "", venue: "Vaganza, Lisboa", price: 0, image: "", published: true, featured: false };

export default function AdminClient({ authenticated, initialEvents }: { authenticated: boolean; initialEvents: EventItem[] }) {
  const [loggedIn, setLoggedIn] = useState(authenticated);
  const [events, setEvents] = useState(initialEvents);
  const [form, setForm] = useState<EventForm>(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMessage("");
    const data = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
    if (!response.ok) return setMessage("Email or password is incorrect.");
    window.location.reload();
  }
  async function save(e: FormEvent) {
    e.preventDefault(); setMessage("");
    if (uploading) return setMessage("Please wait for the image upload to finish.");
    if (!form.image) return setMessage("Please enter an image URL or upload an image.");
    const url = editing ? `/api/events/${editing}` : "/api/events";
    const response = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json();
    if (!response.ok) return setMessage(result.error ?? "Could not save event.");
    setEvents(editing ? events.map((item) => item.id === editing ? result : item) : [...events, result]);
    setModal(false); setEditing(null); setForm(empty);
  }
  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMessage("");
    const data = new FormData();
    data.append("file", file);
    try {
      const response = await fetch("/api/uploads", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) return setMessage(result.error ?? "Could not upload image.");
      setForm((current) => ({ ...current, image: result.url }));
    } catch {
      setMessage("Could not upload image.");
    } finally {
      setUploading(false);
    }
  }
  function edit(item: EventItem) {
    const { id, ...values } = item;
    setEditing(id); setForm(values);
    setImageMode(item.image.startsWith("/api/uploads/") ? "upload" : "url");
    setModal(true);
  }
  async function remove(id: number) {
    if (!confirm("Delete this event permanently?")) return;
    const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (response.ok) setEvents(events.filter((item) => item.id !== id));
  }
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setLoggedIn(false); }

  if (!loggedIn) return <main className="admin-login"><div className="login-card"><VaganzaLogo /><p>Secure administration</p><h1>Welcome back.</h1><form onSubmit={login}><label>Email<input name="email" type="email" required autoComplete="username" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" /></label>{message && <div className="admin-error">{message}</div>}<button>Sign in</button></form><Link href="/">← Return to website</Link></div></main>;

  return <main className="admin-shell">
    <aside className="admin-sidebar"><VaganzaLogo compact /><nav><a className="active"><CalendarPlus /> Events</a><a href="/" target="_blank">View website ↗</a></nav><button onClick={logout}><LogOut /> Sign out</button></aside>
    <section className="admin-main"><header><div><p className="eyebrow">CONTENT MANAGEMENT</p><h1>Events</h1><span>Create, publish and curate Vaganza nights.</span></div><button onClick={() => { setForm(empty); setEditing(null); setImageMode("url"); setModal(true); }}><Plus /> New event</button></header>
      {message && <div className="admin-error">{message}</div>}
      <div className="admin-list">{events.map((event) => <article key={event.id}>
        <div className="admin-thumb" style={{ backgroundImage: `url("${event.image}")` }} />
        <div className="admin-title">{event.featured && <Star size={14} fill="currentColor" />}<div><strong>{event.titleEn}</strong><small>{event.titlePt}</small></div></div>
        <time>{event.date}<small>{event.time}</small></time><span>€{event.price}</span>
        <b className={event.published ? "live" : "draft"}>{event.published ? "Live" : "Inactive"}</b>
        <div className="admin-row-actions"><button onClick={() => edit(event)}><Edit3 /></button><button onClick={() => remove(event.id)}><Trash2 /></button></div>
      </article>)}</div>
    </section>
    {modal && <div className="admin-modal"><div className="modal-panel"><header><div><p className="eyebrow">{editing ? "EDIT" : "CREATE"}</p><h2>{editing ? "Edit event" : "New event"}</h2></div><button onClick={() => setModal(false)}><X /></button></header><form onSubmit={save}>
      <div className="form-grid"><label>Title — English<input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></label><label>Título — Português<input required value={form.titlePt} onChange={(e) => setForm({ ...form, titlePt: e.target.value })} /></label>
      <label>Description — English<textarea required value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></label><label>Descrição — Português<textarea required value={form.descriptionPt} onChange={(e) => setForm({ ...form, descriptionPt: e.target.value })} /></label>
      <label>Date<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>Time<input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
      <label>Venue<input required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></label><label>Price (€)<input required min="0" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></label>
      <div className="full image-field">
        <span className="field-label">Event image</span>
        <div className="image-mode">
          <button type="button" className={imageMode === "upload" ? "active" : ""} onClick={() => { setImageMode("upload"); setForm({ ...form, image: "" }); }}><Upload /> Upload from computer</button>
          <button type="button" className={imageMode === "url" ? "active" : ""} onClick={() => { setImageMode("url"); setForm({ ...form, image: "" }); }}><Link2 /> Enter image URL</button>
        </div>
        {imageMode === "url"
          ? <label>Image URL<input required type="url" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
          : <label className="upload-box"><Upload /><strong>{uploading ? "Uploading…" : form.image ? "Image uploaded — choose another" : "Choose image"}</strong><small>JPG, PNG, WebP or GIF · maximum 3 MB</small><input required={!form.image} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadImage} /></label>}
        {form.image && <div className="image-preview" style={{ backgroundImage: `url("${form.image}")` }} />}
      </div></div>
      <div className="switches"><label><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label><label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured event</label></div>
      {message && <div className="admin-error">{message}</div>}<div className="form-actions"><button type="button" onClick={() => setModal(false)}>Cancel</button><button type="submit" disabled={uploading}>{uploading ? "Uploading image…" : editing ? "Save changes" : "Create event"}</button></div>
    </form></div></div>}
  </main>;
}
