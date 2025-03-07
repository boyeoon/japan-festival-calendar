import { useState } from "react";

export default function AddEventForm({
  onEventAdded,
}: {
  onEventAdded: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date }),
      });

      if (!response.ok) {
        throw new Error("이벤트 추가 실패");
      }

      setTitle("");
      setDate("");
      onEventAdded();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="이벤트 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">추가</button>
    </form>
  );
}
