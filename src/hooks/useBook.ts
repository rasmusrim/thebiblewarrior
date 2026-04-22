import { useState, useEffect } from "react";
import { Book } from "../types/book";

const bookCache = new Map<number, Book>();

export function useBook(bookId: number) {
  const [book, setBook] = useState<Book | null>(bookCache.get(bookId) ?? null);
  const [loading, setLoading] = useState(!bookCache.has(bookId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookCache.has(bookId)) {
      setBook(bookCache.get(bookId)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/books/${bookId}/data.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke laste bok");
        return res.json();
      })
      .then((data: Book) => {
        bookCache.set(bookId, data);
        setBook(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bookId]);

  return { book, loading, error };
}

export function useBookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookIds = [1, 2];
    Promise.all(
      bookIds.map((id) =>
        fetch(`/books/${id}/data.json`)
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then((results) => {
      setBooks(results.filter(Boolean));
      setLoading(false);
    });
  }, []);

  return { books, loading };
}
