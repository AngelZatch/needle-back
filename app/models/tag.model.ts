import { Collection, Entity, ManyToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Channel } from "./channel.model";
import { User } from "./user.model";

@Entity()
export class Tag {
    @PrimaryKey()
    id!: number;

    @Property()
    @Unique()
    name!: string;

    @ManyToMany(() => User, user => user.tags)
    users = new Collection<User>(this);

    @ManyToMany(() => Channel, channel => channel.tags)
    channels = new Collection<User>(this);
}