import {
  CompiledQuery,
  DatabaseConnection,
  DummyDriver,
  Kysely,
  MysqlAdapter,
  MysqlIntrospector,
  MysqlQueryCompiler,
  QueryResult,
} from "kysely";
import { DB } from "../../dist/db";

class MyDummyConnection implements DatabaseConnection {
  constructor(public queryCollection: CompiledQuery<unknown>[]) {
  }
  async executeQuery<R>(compiledQuery: CompiledQuery<unknown>): Promise<QueryResult<R>> {
    this.queryCollection.push(compiledQuery);
    return {
      rows: [],
    };
  }
  async *streamQuery<R>(
    compiledQuery: CompiledQuery<unknown>,
    _chunkSize?: number | undefined,
  ): AsyncGenerator<QueryResult<R>> {
    this.queryCollection.push(compiledQuery);
    yield {
      rows: [],
    };
  }
}

class MyDummyDriver extends DummyDriver {
  constructor(public queryCollection: CompiledQuery<unknown>[]) {
    super();
  }

  async acquireConnection() {
    return new MyDummyConnection(this.queryCollection);
  }
}

export function getMockDB(): [Kysely<DB>, CompiledQuery<unknown>[]] {
  const collect: CompiledQuery<unknown>[] = [];
  const mock_db = new Kysely<DB>({
    dialect: {
      createAdapter() {
        return new MysqlAdapter();
      },
      createDriver() {
        return new MyDummyDriver(collect);
      },
      createIntrospector(db) {
        return new MysqlIntrospector(db);
      },
      createQueryCompiler() {
        return new MysqlQueryCompiler();
      },
    },
  });
  return [mock_db, collect];
}
