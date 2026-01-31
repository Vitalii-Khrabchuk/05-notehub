import css from "./NoteList.module.css";

import { deleteNote } from "../../services/noteService.ts";
import { type Note } from "../../types/note.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NoteListProps {
  noteList: Note[];
  setIsModal: (type: boolean) => void;
  setTypeModal: (type: "form" | "error" | "create" | "delete") => void;
  setMessage: (mes: Note) => void;
  setError: (er: string) => void;
}

export default function NoteList({
  noteList,
  setError,
  setIsModal,
  setMessage,
  setTypeModal,
}: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNote(id);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      setIsModal(true);
      setTypeModal("delete");
      setMessage(data);
    },
    onError: (error) => {
      setIsModal(true);
      setTypeModal("error");
      setError(error.message);
    },
  });

  return (
    <ul className={css.list}>
      {noteList.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              onClick={() => deleteMutation.mutate(note.id)}
              className={css.button}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}