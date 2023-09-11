import { DB, getDB } from "@/db/util";
import { hash as argon2_hash } from "argon2";
import { Insertable, Kysely } from "kysely";
import { UserDTO } from "./dto";

export interface FindAllUsersOptions {
  /**
   * limit
   * @default 50
   */
  limit?: number;
  /**
   * offset
   * @default 0
   */
  offset?: number;
}

export class UserRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  /**
   * find all
   * @returns all users
   */
  async findAll(options?: FindAllUsersOptions): Promise<UserDTO[]> {
    options = options ?? {};
    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    return await this.db.selectFrom("users")
      .selectAll().offset(offset).limit(limit)
      .execute();
  }
  /**
   * find by id
   * @param id id of user
   * @returns found user
   */
  async findById(id: number): Promise<UserDTO | undefined> {
    const row = await this.db.selectFrom("users")
      .where("id", "=", id).selectAll()
      .executeTakeFirst();
    return row;
  }
  /**
   * @param email email
   * @returns found user
   */
  async findByEmail(email: string): Promise<UserDTO | undefined> {
    const row = await this.db.selectFrom("users")
      .where("email", "=", email).selectAll()
      .executeTakeFirst();
    return row;
  }

  /**
   * find by nickname
   * @param nickname nickname
   * @returns found user
   */
  async findByNickname(nickname: string): Promise<UserDTO | undefined> {
    const row = await this.db.selectFrom("users")
      .where("nickname", "=", nickname).selectAll()
      .executeTakeFirst();
    return row;
  }

  /**
   * `password` 해쉬 후 user 삽입.
   * (salt는 자동으로 만들어짐.)
   * @param user
   * @returns inserted id
   * @example
   * ```ts
   * const user = {
   *     nickname: "test",
   *     profile_image: null,
   *     email: "test",
   *     phone: "test",
   *     address: "test",
   *     password: "test",
   *     introduction: null,
   *     deleted_at: null
   * };
   * const id = await userRepository.insert(user);
   * console.log(id);
   * ```
   */
  async insert(user: Insertable<DB["users"]>): Promise<bigint> {
    user.password = await argon2_hash(user.password);
    const ret = await this.db.insertInto("users").values(user).executeTakeFirst();
    return ret.insertId as bigint;
  }
}

export default function getUserRepository() {
  const db = getDB();
  return new UserRepository(db);
}
