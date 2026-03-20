/**
 * MigrateBot Test Suite
 * Run: npx tsx test.ts
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.log(`  FAIL: ${message}`);
    failed++;
  }
}

async function test1_listMigrations() {
  console.log("\nTest 1: GET /api/migrations - List migrations (includes seed)");
  const res = await fetch(`${BASE_URL}/api/migrations`);
  const data = await res.json();
  assert(res.status === 200, "Status is 200");
  assert(Array.isArray(data), "Response is an array");
  assert(data.length >= 1, "Has at least 1 seed migration");
  assert(data.some((m: { id: string }) => m.id === "seed-1"), "Seed migration exists");
}

async function test2_createMigration() {
  console.log(
    "\nTest 2: POST /api/migrations - Create a new migration"
  );
  const res = await fetch(`${BASE_URL}/api/migrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "Add status column to orders table",
      orm: "knex",
      database: "postgres",
    }),
  });
  const data = await res.json();
  assert(res.status === 201, "Status is 201");
  assert(!!data.id, "Migration has an id");
  assert(data.orm === "knex", "ORM is knex");
  assert(data.database === "postgres", "Database is postgres");
  assert(data.generated === null, "Not yet generated");
}

async function test3_createMigrationValidation() {
  console.log(
    "\nTest 3: POST /api/migrations - Validation errors"
  );
  const res1 = await fetch(`${BASE_URL}/api/migrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "", orm: "prisma", database: "postgres" }),
  });
  assert(res1.status === 400, "Empty description returns 400");

  const res2 = await fetch(`${BASE_URL}/api/migrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "test",
      orm: "invalid",
      database: "postgres",
    }),
  });
  assert(res2.status === 400, "Invalid ORM returns 400");
}

async function test4_getMigrationById() {
  console.log("\nTest 4: GET /api/migrations/[id] - Get specific migration");
  const res = await fetch(`${BASE_URL}/api/migrations/seed-1`);
  const data = await res.json();
  assert(res.status === 200, "Status is 200");
  assert(data.id === "seed-1", "Correct migration returned");
  assert(data.generated !== null, "Seed has generated code");
  assert(data.generated.up.includes("CREATE TABLE"), "Up migration contains CREATE TABLE");

  const res404 = await fetch(`${BASE_URL}/api/migrations/nonexistent`);
  assert(res404.status === 404, "Nonexistent migration returns 404");
}

async function test5_generateMigration() {
  console.log(
    "\nTest 5: POST /api/migrations/[id]/generate - Generate migration code"
  );
  // First create a migration
  const createRes = await fetch(`${BASE_URL}/api/migrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "Create posts table with title, body, author_id, published_at",
      orm: "raw-sql",
      database: "postgres",
    }),
  });
  const created = await createRes.json();

  const genRes = await fetch(
    `${BASE_URL}/api/migrations/${created.id}/generate`,
    { method: "POST" }
  );
  const data = await genRes.json();
  assert(genRes.status === 200, "Status is 200");
  assert(data.generated !== null, "Migration has generated code");
  assert(data.generated.up.includes("CREATE TABLE"), "Up includes CREATE TABLE");
  assert(data.generated.down.includes("DROP TABLE"), "Down includes DROP TABLE");
  assert(data.generated.filename.includes("create_posts_table"), "Filename includes table name");
}

async function test6_generateDifferentORMs() {
  console.log(
    "\nTest 6: Generate migration code for different ORMs"
  );
  // Knex
  const knexCreate = await fetch(`${BASE_URL}/api/migrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "Create tags table with name, color",
      orm: "knex",
      database: "mysql",
    }),
  });
  const knexMig = await knexCreate.json();
  const knexGen = await fetch(
    `${BASE_URL}/api/migrations/${knexMig.id}/generate`,
    { method: "POST" }
  );
  const knexData = await knexGen.json();
  assert(
    knexData.generated.up.includes("knex.schema.createTable"),
    "Knex migration uses createTable"
  );
  assert(knexData.generated.filename.endsWith(".js"), "Knex file has .js extension");

  // TypeORM
  const typeormCreate = await fetch(`${BASE_URL}/api/migrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "Drop table sessions",
      orm: "typeorm",
      database: "postgres",
    }),
  });
  const typeormMig = await typeormCreate.json();
  const typeormGen = await fetch(
    `${BASE_URL}/api/migrations/${typeormMig.id}/generate`,
    { method: "POST" }
  );
  const typeormData = await typeormGen.json();
  assert(
    typeormData.generated.up.includes("MigrationInterface"),
    "TypeORM migration uses MigrationInterface"
  );
  assert(
    typeormData.generated.warnings.length > 0,
    "Drop table produces warnings"
  );
}

async function main() {
  console.log("MigrateBot Test Suite");
  console.log("=====================");

  try {
    await test1_listMigrations();
    await test2_createMigration();
    await test3_createMigrationValidation();
    await test4_getMigrationById();
    await test5_generateMigration();
    await test6_generateDifferentORMs();
  } catch (error) {
    console.error("\nTest error:", error);
    failed++;
  }

  console.log(`\n=====================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
