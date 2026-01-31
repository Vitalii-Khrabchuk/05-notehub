import css from "./NoteForm.module.css";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useId } from "react";
import { type NewNote } from "../../types/note.ts";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService.ts";

interface NoteFormProps {
  onCancel: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const id = useId();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: NewNote) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      onCancel();
    },

    onError: (error) => {
      console.error("Failed to create note:", error.message);
    },
  });

  const initVal: NewNote = {
    title: "",
    content: "",
    tag: "Todo",
  };

  function handleSubmit(values: NewNote, actions: FormikHelpers<NewNote>) {
    createMutation.mutate(values);
    actions.resetForm();
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Min length 3 symbols.")
      .max(50, "Max length 50 symbols.")
      .required("This field is required"),
    content: Yup.string().max(500, "Max length 500 symbols."),
    tag: Yup.string()
      .required("This field is required")
      .oneOf(
        ["Todo", "Work", "Personal", "Meeting", "Shopping"],
        "Invalid tag.",
      ),
  });

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initVal}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${id}-title`}>Title</label>
          <Field
            type="text"
            id={`${id}-title`}
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${id}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${id}-content`}
            name="content"
            className={css.textarea}
            rows={8}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${id}-tag`}>Tag</label>
          <Field as="select" id={`${id}-tag`} name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button onClick={onCancel} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
