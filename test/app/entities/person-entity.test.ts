import { describe, it, expect, beforeEach, vi } from "vitest";
import { PersonEntity } from "../../../src/app/entities/person-entity";

// test
describe("PersonEntity", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should initialize with correct defaults", () => {
        const entity = new PersonEntity();

        expect(entity.getName()).toBe("");
        expect(entity.getDocument()).toBe("");

        const birthDate = entity.getBirthDate();
        expect(typeof birthDate).toBe("number");
        expect(birthDate).toBeGreaterThan(0);
    });

    it("should set and get name", () => {
        const entity = new PersonEntity();

        entity.setName("Tal Arbetov");
        expect(entity.getName()).toBe("Tal Arbetov");
    });

    it("should set and get document", () => {
        const entity = new PersonEntity();

        entity.setDocument("123456789");
        expect(entity.getDocument()).toBe("123456789");
    });

    it("should set and get birthDate", () => {
        const entity = new PersonEntity();

        entity.setBirthDate(631152000000); // 1990-01-01 UTC
        expect(entity.getBirthDate()).toBe(631152000000);
    });

    it("should allow setting all properties together", () => {
        const entity = new PersonEntity();

        entity.setName("Alice");
        entity.setDocument("987654321");
        entity.setBirthDate(946684800000); // 2000-01-01 UTC

        expect(entity.getName()).toBe("Alice");
        expect(entity.getDocument()).toBe("987654321");
        expect(entity.getBirthDate()).toBe(946684800000);
    });
});
