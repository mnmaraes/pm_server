import {
  Entity,
  Column,
  getRepository,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
} from "typeorm";

export interface CreateParams {
  body: string;
}

export interface SerialNote {
  id: string;
  body: string;
}

export type NoteId = string;

@Entity()
export class Note {
  static _repo: Repository<Note> | undefined;

  @PrimaryGeneratedColumn("uuid")
  id: NoteId;

  @Column()
  body: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Entity Management
  private static get repo(): Repository<Note> {
    if (Note._repo == undefined) {
      Note._repo = getRepository(Note);
    }

    return Note._repo;
  }

  static create(params: CreateParams): Note {
    const note = new Note();
    Object.assign(note, params);

    return note;
  }

  static async get(id: NoteId): Promise<Note> {
    const note = await Note.repo.findOne(id);

    if (note == undefined) {
      throw `Note (${id}) not found`;
    }

    return note;
  }

  static async remove(id: NoteId): Promise<void> {
    await Note.repo.remove(await Note.get(id));
  }

  // Utility Functions
  async commit(): Promise<this> {
    return Note.repo.save(this);
  }

  async delete(): Promise<void> {
    await Note.remove(this.id);
  }

  async serialize(): Promise<SerialNote> {
    return {
      id: this.id,
      body: this.body,
    };
  }
}
