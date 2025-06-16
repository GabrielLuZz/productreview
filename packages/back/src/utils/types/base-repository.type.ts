import { NullableType } from "./nullable.type";

export abstract class BaseRepository<T> {
    abstract create(data: Partial<T>): Promise<T>;
    abstract findAll(): Promise<T[]>;
    abstract findById(id: number): Promise<T | null>;
    abstract update(id: number, data: Partial<T>): Promise<NullableType<T>>;
    abstract remove(id: number): Promise<void>;
  }
  