import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
  BeforeRemove,
  getRepository,
} from "typeorm";

import { BaseEntity } from "./Base";

export interface SerialTag {
  id: string;

  name: string;

  referenced?: {
    referenceType: string;
    referenceId: string;
  };
}

@Entity()
export class Tag implements BaseEntity<SerialTag> {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  referenceType: string;

  @Column()
  name: string;

  async commit(): Promise<this> {
    return getRepository(Tag).save(this);
  }

  async serialize(): Promise<SerialTag> {
    const associated = await getAssociated(this);

    return {
      id: this.id,
      name: this.name,

      referenced:
        associated !== undefined
          ? {
              referenceType: this.referenceType,
              referenceId: associated.id,
            }
          : undefined,
    };
  }
}

export interface SerialAutoTag {
  id: string;

  tagId: string;
}

export abstract class AutoTag implements BaseEntity<SerialAutoTag> {
  private __tagNameProperty: string;

  // Note: Gets Overwritten by @autoRegister
  createTag(): Tag {
    return new Tag();
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  tagId: string;

  @OneToOne(() => Tag, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  tag: Tag;

  @BeforeUpdate()
  updateTag(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const name: string = (this as any)[this.__tagNameProperty];
    if (name !== this.tag.name) {
      this.tag.name = name;
    }
  }

  @BeforeRemove()
  async removeTag(): Promise<void> {
    if (this.tag != null) {
      await getRepository(Tag).remove(this.tag);
    }
  }

  async commit(): Promise<this> {
    throw "Should never be called";
  }

  async serialize(): Promise<SerialAutoTag> {
    return {
      id: this.id,

      tagId: this.tag.id,
    };
  }
}

interface CreateParams {
  name: string;
  referenceType: string;
}
export const createTag = (params: CreateParams): Tag => {
  const tag = new Tag();
  Object.assign(tag, params);

  return tag;
};

const AUTO_TAG_MAPPING: { [key: string]: typeof AutoTag } = {};

const registerAutoTagClass = <T extends AutoTag>(
  autoTagClass: {
    new (): T;
  },
  className: string
): void => {
  AUTO_TAG_MAPPING[className] = autoTagClass;
};

export const autoRegister = (referenceTypeName: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (EntityClass: any): any => {
    registerAutoTagClass(EntityClass, referenceTypeName);

    EntityClass.prototype.createTag = function getNewTag(): void {
      this.tag = createTag({
        name: this.name,
        referenceType: referenceTypeName,
      });
    };

    return EntityClass;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const autoTagName = (target: any, key: string): void => {
  target.__tagNameProperty = key;
};

export const getAssociated = async (tag: Tag): Promise<AutoTag> => {
  const associated: AutoTag | undefined = await getRepository(
    AUTO_TAG_MAPPING[tag.referenceType]
  )
    .createQueryBuilder(tag.referenceType)
    .where(`${tag.referenceType}.tagId = :id`, { id: tag.id })
    .getOne();

  if (associated === undefined) throw "Associated not found";

  return associated;
};
