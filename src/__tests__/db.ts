import { setupDb, teardownDb, noteBuilder } from "tests/utils";

import { Note, NoteId } from "entity/Note";

describe("ORM", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterEach(async () => {
    await teardownDb();
  });

  test("can crud a note", async () => {
    const noteData = noteBuilder();

    const note = Note.create(noteData);

    // Create
    const saved = await note.commit();
    const noteId: NoteId = saved.id;
    expect(noteId).not.toBeNull();
    expect(saved.body).toBe(noteData.body);

    // Read
    const read = await Note.get(noteId);

    expect(read).not.toBeUndefined();

    // Update
    const newData = noteBuilder();
    saved.body = newData.body;

    const updated = await saved.commit();

    expect(updated.id).toBe(saved.id);
    expect(updated.body).toBe(newData.body);

    // Delete
    await updated.delete();

    await expect(Note.get(noteId)).rejects.toMatch(/not found/i);
  });
});
