import { ResponseCallback } from "types";

import {
  Note,
  SerialNote,
  CreateParams as NoteCreateParams,
  NoteId,
} from "entity/Note";

type CreateArgs = [NoteCreateParams];

type CreateCallback = ResponseCallback<{ created: SerialNote }>;

export const create = async (
  [noteData]: CreateArgs,
  cb: CreateCallback
): Promise<void> => {
  const note = await Note.create(noteData).commit();
  cb(null, { created: await note.serialize() });
};

type UpdateArgs = [NoteId, string];
type UpdateCallback = ResponseCallback<{ updated: SerialNote }>;
export const update = async (
  [id, body]: UpdateArgs,
  cb: UpdateCallback
): Promise<void> => {
  try {
    const note = await Note.get(id);
    note.body = body;
    note.commit();

    cb(null, { updated: await note.serialize() });
  } catch (error) {
    cb(error, null);
  }
};
