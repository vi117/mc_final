import assert, { equal } from "node:assert";

import { beginTransaction, disconnectDB } from "@/db/util";
import { test } from "node:test";
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

test("login", {
  timeout: 1000,
}, async (t) => {
  testDBConnection(t);

  const fetcher = agent(app);

  await t.test("login fail", async (_t) => {
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "wrong_password",
    });
    equal(res.status, 401);
  });

  await t.test("login success", async (_t) => {
    const res = await fetcher.post("/api/users/login").send({
      email: "admin@gmail.com",
      password: "admin",
    });
    equal(res.status, 200);
    const cookie = res.headers["set-cookie"];
    assert(cookie.length >= 2);
  });

  await t.test("logout", async (_t) => {
    const res = await fetcher.get("/api/users/logout");
    equal(res.status, 200);
  });
});

test("signup", {
  timeout: 1000,
}, async (t) => {
  testDBConnection(t);

  const fetcher = agent(app);

  await t.test("signup fail: nickname already exists", async (_t) => {
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
