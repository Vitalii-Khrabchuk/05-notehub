// import axios from "axios";

// import { type Note, type NewNote } from "../types/note.ts";

// interface Answer {
//   notes: Note[];
//   totalPages: number;
// }

// const token = import.meta.env.VITE_NOTEHUB_TOKEN;

// export async function fetchNotes(
//   page: number,
//   topic?: string
// ): Promise<Answer> {
//   if (topic !== "") {
//     const res = await axios.get<Answer>(
//       `https://notehub-public.goit.study/api/notes?search=${topic}&page=${page}&perPage=12`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return res.data;
//   } else {
//     const res = await axios.get<Answer>(
//       `https://notehub-public.goit.study/api/notes?page=${page}&perPage=12`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return res.data;
//   }
// }

// export async function createNote(note: NewNote): Promise<Note> {
//   const res = await axios.post<Note>(
//     `https://notehub-public.goit.study/api/notes`,
//     note,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return res.data;
// }

// export async function deleteNote(id: string): Promise<Note> {
//   const res = await axios.delete<Note>(
//     `https://notehub-public.goit.study/api/notes/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return res.data;
// }
import axios from "axios";
import { type Note, type NewNote } from "../types/note.ts";

interface Answer {
  notes: Note[];
  totalPages: number;
}

// Додаємо інтерфейс для параметрів, щоб зробити функцію гнучкою
interface FetchNotesOptions {
  page?: number;
  search?: string;
  tag?: string;
  sortBy?: string;
  perPage?: number;
}

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

// Створюємо екземпляр axios, щоб не дублювати хедери в кожному запиті
const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function fetchNotes({
  page = 1,
  search = "",
  tag = "",
  sortBy = "",
  perPage = 12,
}: FetchNotesOptions = {}): Promise<Answer> {
  
  // Формуємо об'єкт параметрів
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  // Додаємо параметр лише якщо він не порожній (вимоги ментора)
  if (search.trim()) params.search = search;
  if (tag) params.tag = tag;
  if (sortBy) params.sortBy = sortBy;

  const res = await api.get<Answer>("/notes", { params });
  return res.data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const res = await api.post<Note>("/notes", note);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}