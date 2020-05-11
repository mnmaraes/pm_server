import { Entity, Column, ManyToOne, OneToMany, getRepository } from "typeorm";

import { BaseEntity } from "./Base";
import { autoRegister, autoTagName, AutoTag, SerialAutoTag } from "./Tag";

export interface CreateParams {
  name: string;
  description: string;
  parentProject?: Project;
}

export interface SerialProject extends SerialAutoTag {
  name: string;
  description: string;

  parentProject: string;
  children: string[];
}

@Entity()
@autoRegister("project")
export class Project extends AutoTag implements BaseEntity<SerialProject> {
  @Column()
  @autoTagName
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  parentProjectId: string;

  @ManyToOne(() => Project, (p) => p.subprojects)
  parentProject: Promise<Project>;

  @OneToMany(() => Project, (p) => p.parentProject)
  subprojects: Promise<Project[]>;

  // Entity Creators
  static create(params: CreateParams): Project {
    const project = new Project();
    Object.assign(project, params);

    project.createTag();

    return project;
  }

  // Lifecycle Functions
  async commit(): Promise<this> {
    return getRepository(Project).save(this);
  }

  async serialize(): Promise<SerialProject> {
    return {
      name: this.name,
      description: this.description,

      parentProject: this.parentProjectId,
      children: (await this.subprojects).map((p) => p.id),

      ...(await super.serialize()),
    };
  }
}
