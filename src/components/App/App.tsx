import css from "./App.module.css";
import { type Note } from "../../types/note.ts";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchNotes } from "../../services/noteService.ts";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "../NoteList/NoteList.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import Modal from "../Modal/Modal.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";
import SearchBox from "../SearchBox/SearchBox.tsx";
import CreateMessage from "../CreateMessage/CreateMessage.tsx";
import Error from "../Error/Error.tsx";

type ModalType = "form" | "error" | "create" | "delete";

export default function App() {
  const [page, setPage] = useState(1);
  const [isModal, setIsModal] = useState(false);
  const [word, setWord] = useState("");
  const [typeModal, setTypeModal] = useState<ModalType>("form");
  const [message] = useState<Note | null>(null);
  const [error] = useState("");

  const { data } = useQuery({
    queryKey: ["note", page, word],
    queryFn: () => fetchNotes({ page, search: word }),
    placeholderData: keepPreviousData,
  });

  const closeModal = () => setIsModal(false);

  const openCreateForm = () => {
    setTypeModal("form");
    setIsModal(true);
  };

  const handleSearch = useDebouncedCallback((newWord: string) => {
    setPage(1);
    setWord(newWord);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            setPage={setPage}
          />
        )}

        <button className={css.button} onClick={openCreateForm}>
          Create note +
        </button>
      </header>

      {data && data.notes.length > 0 && <NoteList noteList={data.notes} />}

      {isModal && (
        <Modal onClose={closeModal}>
          {typeModal === "form" && <NoteForm onCancel={closeModal} />}

          {typeModal === "create" && message && (
            <CreateMessage note={message} mess="Is created" />
          )}

          {typeModal === "delete" && message && (
            <CreateMessage note={message} mess="Is deleted" />
          )}

          {typeModal === "error" && <Error mess={error} />}
        </Modal>
      )}
    </div>
  );
}
