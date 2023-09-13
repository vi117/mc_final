import { DB } from "dist/db";
import { Insertable } from "kysely";
import { FindAllUsersOptions, IUserRepository, UserObject } from "../model";

export class MockUserRepository implements IUserRepository {
  public async findAll(_options?: FindAllUsersOptions): Promise<UserObject[]> {
    return [];
  }
  public async findById(_id: number): Promise<UserObject | undefined> {
    return undefined;
  }
  public async findByEmail(email: string): Promise<UserObject | undefined> {
    if (email === "admin@gmail.com") {
      return {
        nickname: "admin",
        email: "admin@gmail.com",
        password: "$argon2id$v=19$m=32,t=3,p=4$NCRsTXdvSGE$KmytKrvA8u0G0dUV",
      } as UserObject;
    }
    return undefined;
  }
  public async findByNickname(nickname: string): Promise<UserObject | undefined> {
    if (nickname === "admin") {
      return {
        nickname: "admin",
        email: "admin@gmail.com",
        password: "$argon2id$v=19$m=32,t=3,p=4$NCRsTXdvSGE$KmytKrvA8u0G0dUV",
      } as UserObject;
    }
    return undefined;
  }
  public async insert(_user: Insertable<DB["users"]>): Promise<bigint | undefined> {
    return 2n;
  }
  public async approveByEmail(_email: string): Promise<boolean> {
    return true;
  }
}

const mock = jest.fn(() => {
  return jest.fn().mockImplementation(() => {
    return new MockUserRepository();
  });
});

export default mock;
