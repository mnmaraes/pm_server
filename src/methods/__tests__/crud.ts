import { create, update } from "methods/index";

import { noteBuilder, setupDb, teardownDb } from "tests/utils";

import { Note } from "entity/Note";

describe("note crud methods", () => {
  beforeAll(async () => {
    await setupDb();
  });

  afterAll(async () => {
    await teardownDb();
  });

  test("should properly create notes", async () => {
    const noteData = noteBuilder();
    let noteId = "";
    const cb = jest.fn().mockImplementationOnce((_, serialized) => {
      noteId = serialized.id;
    });
    await create([{ ...noteData }], cb);

    // Ensure we're returning the serialized data
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        created: expect.objectContaining({
          body: noteData.body,

          id: expect.any(String),
        }),
      })
    );

    await Note.remove(noteId);
  });

  test("should properly update a given note", async () => {
    const noteData = noteBuilder();
    const { id: noteId } = await Note.create(noteData).commit();

    const cb = jest.fn();

    const { body: newBody } = noteBuilder();
    await update([noteId, newBody], cb);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        updated: expect.objectContaining({
          body: newBody,

          id: noteId,
        }),
      })
    );

    await Note.remove(noteId);
  });
});
