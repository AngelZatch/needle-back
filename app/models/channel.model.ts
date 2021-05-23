import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Tag } from './tag.model';
import { User } from './user.model';

@Entity()
export class Channel {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  title!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToMany()
  tags = new Collection<Tag>(this);

  @ManyToMany()
  users = new Collection<User>(this);
}
