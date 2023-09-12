import assert, { equal } from "node:assert";

import { beginTransaction, disconnectDB } from "@/db/util";

import { afterAll, beforeAll, describe, test } from "@jest/globals";
import { agent } from "supertest";

import app from "../../app";

function testDBConnection(t: {
  before: (_fn: () => void | Promise<void>) => void;
  after: (_fn: () => void | Promise<void>) => void;
}) {
  let dispose_fn: () => void;
  t.before(async () => {
    dispose_fn = await beginTransaction();
  });
  t.after(async () => {
    await dispose_fn();
    disconnectDB();
  });
}

testDBConnection({
  before: (fn) => {
    beforeAll(fn);
  },
  after: (fn) => {
    afterAll(fn);
  },
});

describe("login", () => {
  const fetcher = agent(app);

  test("login fail", async () => {
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "wrong_password",
    });
    equal(res.status, 401);
  });

  test("login success", async () => {
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });
    equal(res.status, 200);
    const cookie = res.headers["set-cookie"];
    assert(cookie.length >= 2);
  });

  test("logout", async () => {
    const res = await fetcher.get("/api/users/logout");
    equal(res.status, 200);
  });
});

describe("signup", () => {
  const fetcher = agent(app);

  test("signup fail: nickname already exists", async () => {
    const res = await fetcher.post("/api/users/signup").send({
      nickname: "admin",
      email: "test",
      password: "test",
      address: "test",
      phone: "test",
    });
    equal(res.status, 409);
  });
});
