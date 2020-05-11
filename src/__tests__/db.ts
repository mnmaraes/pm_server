import { getRepository } from "typeorm";

import { setupDb, projectBuilder, teardownDb } from "tests/utils";

import { Tag, getAssociated } from "entity/Tag";
import { Project } from "entity/Project";

describe("ORM", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterEach(async () => {
    await teardownDb();
  });

  test("can crud a project", async () => {
    const projectData = projectBuilder();

    const project = Project.create(projectData);

    const repo = getRepository(Project);

    // Create
    const saved = await repo.save(project);
    expect(saved.id).not.toBeNull();
    expect(saved.name).toBe(projectData.name);
    expect(saved.description).toBe(projectData.description);
    // Make sure our tag is properly named
    expect(saved.tag.name).toBe(projectData.name);

    // Read
    const read = await repo.findOne({ name: projectData.name });

    expect(read).not.toBeUndefined();

    const associated = await getAssociated(saved.tag);

    expect(associated).not.toBeUndefined();
    expect((associated as Project).name).toBe(projectData.name);

    // Update
    const newData = projectBuilder();
    saved.name = newData.name;

    const updated = await repo.save(saved);

    expect(updated.name).toBe(newData.name);
    expect(updated.description).toBe(projectData.description);
    expect(updated.tag.name).toBe(newData.name);

    // Delete
    await repo.remove(updated);

    const removed = await repo.findOne({ name: newData.name });
    expect(removed).toBeUndefined();

    const tag = await getRepository(Tag).findOne({ name: newData.name });
    expect(tag).toBeUndefined();
  });
});
