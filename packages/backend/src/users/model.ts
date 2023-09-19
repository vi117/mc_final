import { DB, getDB } from "@/db/util";
import { hash as argon2_hash } from "argon2";
import { Insertable, Kysely } from "kysely";

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

export interface UserObject {
  id: number;
  nickname: string;
  profile_image: string | null;
  email: string;
  email_approved: number;
  is_admin: number;
  phone: string;
  address: string;
  password: string;
  introduction: string | null;
  created_at: Date;
  deleted_at: Date | null;
}

export interface IUserRepository {
  findAll(options?: FindAllUsersOptions): Promise<UserObject[]>;
  findById(id: number): Promise<UserObject | undefined>;
  findByEmail(email: string): Promise<UserObject | undefined>;
  findByNickname(nickname: string): Promise<UserObject | undefined>;

  insert(user: Insertable<DB["users"]>): Promise<number | undefined>;
  approveByEmail(email: string): Promise<boolean>;

  resetPassword(email: string, password: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  db: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.db = db;
  }

  /**
   * find all
   * @returns all users
   */
  async findAll(options?: FindAllUsersOptions): Promise<UserObject[]> {
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
  async findById(id: number): Promise<UserObject | undefined> {
    const row = await this.db.selectFrom("users")
      .where("id", "=", id).selectAll()
      .executeTakeFirst();
    return row;
  }
  /**
   * @param email email
   * @returns found user
   */
  async findByEmail(email: string): Promise<UserObject | undefined> {
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
  async findByNickname(nickname: string): Promise<UserObject | undefined> {
    const row = await this.db.selectFrom("users")
      .where("nickname", "=", nickname).selectAll()
      .executeTakeFirst();
    return row;
  }

  /**
   * `password` 해쉬 후 user 삽입.
   * (salt는 자동으로 만들어짐.)
   * @param user
   * @returns user
   * @example
   * ```ts
   * const user_info = {
   *     nickname: "test",
   *     profile_image: null,
   *     email: "test",
   *     phone: "test",
   *     address: "test",
   *     password: "test",
   *     introduction: null,
   *     deleted_at: null
   * };
   * const user = await userRepository.insert(user_info);
   * console.log(user);
   * ```
   */
  async insert(user: Insertable<DB["users"]>): Promise<number | undefined> {
    user.password = await argon2_hash(user.password);
    const ret = await this.db.insertInto("users")
      .values(user)
      .executeTakeFirst();
    return Number(ret.insertId);
  }

  /**
   * approve by email
   * @param email
   * @returns email exists
   */
  async approveByEmail(email: string): Promise<boolean> {
    const ret = await this.db.updateTable("users")
      .set({ email_approved: 1 })
      .where("email", "=", email).executeTakeFirst();
    return ret.numUpdatedRows === 1n;
  }

  async resetPassword(email: string, password: string): Promise<void> {
    const hashed = await argon2_hash(password);
    await this.db.updateTable("users")
      .set({ password: hashed })
      .where("email", "=", email)
      .executeTakeFirst();
  }
}

export default function getUserRepository(trx?: Kysely<DB>): UserRepository {
  const db = trx ?? getDB();
  return new UserRepository(db);
}
