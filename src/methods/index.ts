import { ResponseCallback } from "types";

import { Project, SerialProject } from "entity/Project";

export const create = async (
  args: ["project", { name: string; description: string }],
  cb: ResponseCallback<{ created: SerialProject }>
): Promise<void> => {
  const project = await Project.create(args[1]).commit();
  cb(null, { created: await project.serialize() });
};
