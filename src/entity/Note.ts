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

  static async retrieve(): Promise<Note[]> {
    return Note.repo.find();
  }

  static async get(id: NoteId): Promise<Note> {
    const note = await Note.repo.findOne(id);

    if (note == undefined) {
      throw `Note (${id}) not found`;
    }

    return note;
  }

  static async remove(idOrIds: NoteId | NoteId[]): Promise<void> {
    await Note.repo.delete(idOrIds);
  }

  // Utility Functions
  async commit(): Promise<this> {
    return Note.repo.save(this);
  }

  async delete(): Promise<void> {
    return Note.remove(this.id);
  }

  async serialize(): Promise<SerialNote> {
    return {
      id: this.id,
      body: this.body,
    };
  }
}
