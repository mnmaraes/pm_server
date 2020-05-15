import { create, update, retrieve } from "methods/index";

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
    const cb = jest.fn().mockImplementationOnce((_, { created }) => {
      noteId = created.id;
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

  test("should retrieve our created notes", async () => {
    const ids = [
      (await Note.create(noteBuilder()).commit()).id,
      (await Note.create(noteBuilder()).commit()).id,
      (await Note.create(noteBuilder()).commit()).id,
      (await Note.create(noteBuilder()).commit()).id,
      (await Note.create(noteBuilder()).commit()).id,
    ];

    const cb = jest.fn();
    await retrieve([], cb);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        retrieved: expect.arrayContaining(
          ids.map((id) =>
            expect.objectContaining({
              id,
              body: expect.any(String),
            })
          )
        ),
      })
    );

    await Note.remove(ids);
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
