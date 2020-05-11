import { create } from "methods/index";

import { projectBuilder, setupDb, teardownDb } from "tests/utils";

describe("createProject method", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterEach(async () => {
    await teardownDb();
  });

  test("should create project when sent valid data", async () => {
    expect(true).toBe(true);
    const projectData = projectBuilder();
    const cb = jest.fn();
    await create(["project", { ...projectData }], cb);

    // Ensure we're returning the serialized project data
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        created: expect.objectContaining({
          name: projectData.name,
          description: projectData.description,

          parentProject: null,
          children: [],

          id: expect.any(String),
          tagId: expect.any(String),
        }),
      })
    );
  });
});
