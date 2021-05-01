import { Collection, Entity, ManyToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Tag } from "./tag.model";

@Entity()
export class User {
    @PrimaryKey()
    id!: number;

    @Property()
    @Unique()
    mail!: string;

    password!: string;

    @Property()
    nickname!: string;

    @Property({ onCreate: () => new Date() })
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @ManyToMany()
    tags = new Collection<Tag>(this);

    constructor(nickname: string, password: string, mail: string) {
        this.nickname = nickname;
        this.password = password;
        this.mail = mail;
    }
}