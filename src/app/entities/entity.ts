import { nanoid } from "nanoid";

class Entity {
    private readonly id: string;
    private readonly prefix: string;

    protected constructor(prefix: string, id?: string) {
        this.prefix = prefix;
        this.id = id ?? `${prefix}-${nanoid(8)}`;
    }

    public getId(): string {
        return this.id;
    }

    public getPrefix(): string {
        return this.prefix;
    }
}

export { Entity };
