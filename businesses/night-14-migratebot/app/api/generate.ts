import { ORM, Database, GeneratedMigration } from "./store";

interface ParsedAction {
  type:
    | "create_table"
    | "add_column"
    | "rename_column"
    | "drop_table"
    | "add_index"
    | "unknown";
  table?: string;
  columns?: { name: string; type: string; constraints?: string }[];
  column?: string;
  newName?: string;
  indexColumns?: string[];
  raw?: string;
}

function parseDescription(description: string): ParsedAction {
  const desc = description.toLowerCase().trim();

  // Create table: "create table X with columns A, B, C"
  const createMatch = desc.match(
    /create\s+(?:a\s+)?(?:table\s+)?(\w+)\s+(?:table\s+)?(?:with\s+(?:columns?\s+)?)?(.+)/i
  );
  if (createMatch) {
    const table = createMatch[1] === "table" ? description.match(/table\s+(\w+)/i)?.[1] || "unknown" : createMatch[1];
    const colStr = createMatch[2];
    const columns = parseColumns(colStr);
    return { type: "create_table", table, columns };
  }

  // Add column: "add column X to table Y" or "add X column to Y"
  const addColMatch = desc.match(
    /add\s+(?:column\s+)?(\w+)(?:\s+\(([^)]+)\))?\s+to\s+(?:table\s+)?(\w+)/i
  );
  if (addColMatch) {
    const colType = addColMatch[2] || "text";
    return {
      type: "add_column",
      table: addColMatch[3],
      column: addColMatch[1],
      columns: [{ name: addColMatch[1], type: mapColType(colType) }],
    };
  }

  // Rename column: "rename column X to Y in/on table Z"
  const renameMatch = desc.match(
    /rename\s+(?:column\s+)?(\w+)\s+to\s+(\w+)\s+(?:in|on)\s+(?:table\s+)?(\w+)/i
  );
  if (renameMatch) {
    return {
      type: "rename_column",
      table: renameMatch[3],
      column: renameMatch[1],
      newName: renameMatch[2],
    };
  }

  // Add index: "add index on X(Y, Z)" or "add index to X on columns Y, Z"
  const indexMatch = desc.match(
    /add\s+(?:an?\s+)?index\s+(?:on|to)\s+(?:table\s+)?(\w+)\s+(?:on\s+(?:columns?\s+)?)?(?:\()?([^)]+)(?:\))?/i
  );
  if (indexMatch) {
    const cols = indexMatch[2].split(/[,\s]+/).filter(Boolean);
    return { type: "add_index", table: indexMatch[1], indexColumns: cols };
  }

  // Drop table: "drop table X"
  const dropMatch = desc.match(/drop\s+(?:table\s+)?(\w+)/i);
  if (dropMatch) {
    const table = dropMatch[1] === "table" ? description.match(/table\s+(\w+)/i)?.[1] || "unknown" : dropMatch[1];
    return { type: "drop_table", table };
  }

  return { type: "unknown", raw: description };
}

function parseColumns(
  str: string
): { name: string; type: string; constraints?: string }[] {
  const parts = str.split(/,\s*/);
  return parts.map((p) => {
    const tokens = p.trim().split(/\s+/);
    const name = tokens[0];
    const rest = tokens.slice(1).join(" ");
    let type = "text";
    if (
      name === "id" ||
      name.endsWith("_id") ||
      rest.includes("int") ||
      rest.includes("serial")
    ) {
      type = "integer";
    } else if (
      name === "email" ||
      name === "name" ||
      name === "title" ||
      rest.includes("text") ||
      rest.includes("string") ||
      rest.includes("varchar")
    ) {
      type = "text";
    } else if (
      name.includes("created") ||
      name.includes("updated") ||
      name.includes("_at") ||
      rest.includes("timestamp") ||
      rest.includes("date")
    ) {
      type = "timestamp";
    } else if (rest.includes("bool")) {
      type = "boolean";
    } else if (rest.includes("json")) {
      type = "json";
    }
    return { name, type };
  });
}

function mapColType(raw: string): string {
  const r = raw.toLowerCase();
  if (r.includes("int") || r.includes("serial")) return "integer";
  if (r.includes("bool")) return "boolean";
  if (r.includes("timestamp") || r.includes("date")) return "timestamp";
  if (r.includes("json")) return "json";
  return "text";
}

function sqlType(type: string, db: Database): string {
  const map: Record<string, Record<Database, string>> = {
    integer: { postgres: "INTEGER", mysql: "INT", sqlite: "INTEGER" },
    text: { postgres: "TEXT", mysql: "VARCHAR(255)", sqlite: "TEXT" },
    timestamp: {
      postgres: "TIMESTAMP DEFAULT NOW()",
      mysql: "DATETIME DEFAULT CURRENT_TIMESTAMP",
      sqlite: "DATETIME DEFAULT CURRENT_TIMESTAMP",
    },
    boolean: {
      postgres: "BOOLEAN DEFAULT FALSE",
      mysql: "TINYINT(1) DEFAULT 0",
      sqlite: "INTEGER DEFAULT 0",
    },
    json: { postgres: "JSONB", mysql: "JSON", sqlite: "TEXT" },
  };
  return map[type]?.[db] || "TEXT";
}

function generateTimestamp(): string {
  const now = new Date();
  return now
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
}

// ---- ORM generators ----

function genRawSQL(
  action: ParsedAction,
  db: Database
): { up: string; down: string; warnings: string[] } {
  const warnings: string[] = [];

  switch (action.type) {
    case "create_table": {
      const cols = action.columns || [];
      const idCol =
        db === "postgres"
          ? '"id" SERIAL PRIMARY KEY'
          : db === "mysql"
            ? "`id` INT AUTO_INCREMENT PRIMARY KEY"
            : '"id" INTEGER PRIMARY KEY AUTOINCREMENT';
      const hasId = cols.some((c) => c.name === "id");
      const colDefs = cols
        .filter((c) => c.name !== "id")
        .map((c) => `  "${c.name}" ${sqlType(c.type, db)}`)
        .join(",\n");
      const allCols = hasId
        ? `  ${idCol},\n${colDefs}`
        : `  ${idCol},\n${colDefs}`;
      return {
        up: `CREATE TABLE "${action.table}" (\n${allCols}\n);`,
        down: `DROP TABLE "${action.table}";`,
        warnings,
      };
    }
    case "add_column": {
      const col = action.columns?.[0];
      const colType = col ? sqlType(col.type, db) : "TEXT";
      return {
        up: `ALTER TABLE "${action.table}" ADD COLUMN "${action.column}" ${colType};`,
        down: `ALTER TABLE "${action.table}" DROP COLUMN "${action.column}";`,
        warnings,
      };
    }
    case "rename_column": {
      if (db === "sqlite") {
        warnings.push(
          "SQLite has limited ALTER TABLE support. Rename may require recreating the table."
        );
      }
      return {
        up: `ALTER TABLE "${action.table}" RENAME COLUMN "${action.column}" TO "${action.newName}";`,
        down: `ALTER TABLE "${action.table}" RENAME COLUMN "${action.newName}" TO "${action.column}";`,
        warnings,
      };
    }
    case "add_index": {
      const cols = action.indexColumns?.map((c) => `"${c}"`).join(", ") || "";
      const idxName = `idx_${action.table}_${action.indexColumns?.join("_")}`;
      return {
        up: `CREATE INDEX "${idxName}" ON "${action.table}" (${cols});`,
        down: `DROP INDEX "${idxName}";`,
        warnings,
      };
    }
    case "drop_table": {
      warnings.push(
        "WARNING: Dropping a table will permanently delete all data in it!"
      );
      return {
        up: `DROP TABLE "${action.table}";`,
        down: `-- Cannot automatically regenerate dropped table. Manual recreation required.`,
        warnings,
      };
    }
    default:
      return {
        up: `-- Could not parse: ${action.raw}\n-- Please write your migration manually`,
        down: `-- Reverse of: ${action.raw}`,
        warnings: [
          "Could not fully parse the description. Please review the generated migration.",
        ],
      };
  }
}

function genPrisma(
  action: ParsedAction,
  db: Database
): { up: string; down: string; warnings: string[] } {
  const raw = genRawSQL(action, db);
  const warnings = [...raw.warnings];

  switch (action.type) {
    case "create_table": {
      const cols = action.columns || [];
      const prismaType = (t: string) => {
        const map: Record<string, string> = {
          integer: "Int",
          text: "String",
          timestamp: "DateTime",
          boolean: "Boolean",
          json: "Json",
        };
        return map[t] || "String";
      };
      const colLines = cols
        .filter((c) => c.name !== "id")
        .map((c) => {
          const pt = prismaType(c.type);
          const def =
            c.type === "timestamp" ? " @default(now())" : "";
          const unique = c.name === "email" ? " @unique" : "";
          return `  ${c.name}  ${pt}${unique}${def}`;
        })
        .join("\n");
      const up = `// Prisma schema addition:\nmodel ${capitalize(action.table || "")} {\n  id    Int    @id @default(autoincrement())\n${colLines}\n}\n\n// Generated SQL migration:\n${raw.up}`;
      return { up, down: raw.down, warnings };
    }
    default:
      return {
        up: `// Prisma migration SQL:\n${raw.up}`,
        down: `// Prisma migration rollback SQL:\n${raw.down}`,
        warnings,
      };
  }
}

function genDrizzle(
  action: ParsedAction,
  db: Database
): { up: string; down: string; warnings: string[] } {
  const raw = genRawSQL(action, db);
  const warnings = [...raw.warnings];

  switch (action.type) {
    case "create_table": {
      const cols = action.columns || [];
      const drizzleType = (t: string) => {
        if (db === "postgres") {
          const map: Record<string, string> = {
            integer: "serial",
            text: "text",
            timestamp: "timestamp",
            boolean: "boolean",
            json: "jsonb",
          };
          return map[t] || "text";
        }
        const map: Record<string, string> = {
          integer: "integer",
          text: "text",
          timestamp: "text",
          boolean: "integer",
          json: "text",
        };
        return map[t] || "text";
      };
      const imp =
        db === "postgres" ? "drizzle-orm/pg-core" : "drizzle-orm/sqlite-core";
      const colLines = cols
        .filter((c) => c.name !== "id")
        .map((c) => {
          const dt = drizzleType(c.type);
          return `  ${c.name}: ${dt}("${c.name}")`;
        })
        .join(",\n");
      const up = `import { pgTable, serial, text, timestamp } from "${imp}";\n\nexport const ${action.table} = pgTable("${action.table}", {\n  id: serial("id").primaryKey(),\n${colLines}\n});`;
      return { up, down: `// Drop table: remove the schema definition\n${raw.down}`, warnings };
    }
    default:
      return {
        up: `// Drizzle migration:\n${raw.up}`,
        down: `// Drizzle rollback:\n${raw.down}`,
        warnings,
      };
  }
}

function genKnex(
  action: ParsedAction,
  db: Database
): { up: string; down: string; warnings: string[] } {
  const raw = genRawSQL(action, db);
  const warnings = [...raw.warnings];

  switch (action.type) {
    case "create_table": {
      const cols = action.columns || [];
      const colLines = cols
        .filter((c) => c.name !== "id")
        .map((c) => {
          const knexType: Record<string, string> = {
            integer: "integer",
            text: "string",
            timestamp: "timestamp",
            boolean: "boolean",
            json: "json",
          };
          const kt = knexType[c.type] || "string";
          const unique = c.name === "email" ? ".unique()" : "";
          const def =
            c.type === "timestamp"
              ? ".defaultTo(knex.fn.now())"
              : "";
          return `      table.${kt}("${c.name}")${unique}${def};`;
        })
        .join("\n");
      const up = `exports.up = function(knex) {\n  return knex.schema.createTable("${action.table}", (table) => {\n      table.increments("id").primary();\n${colLines}\n  });\n};`;
      const down = `exports.down = function(knex) {\n  return knex.schema.dropTable("${action.table}");\n};`;
      return { up, down, warnings };
    }
    case "add_column": {
      const col = action.columns?.[0];
      const kt =
        col?.type === "integer"
          ? "integer"
          : col?.type === "timestamp"
            ? "timestamp"
            : col?.type === "boolean"
              ? "boolean"
              : "string";
      const up = `exports.up = function(knex) {\n  return knex.schema.alterTable("${action.table}", (table) => {\n      table.${kt}("${action.column}");\n  });\n};`;
      const down = `exports.down = function(knex) {\n  return knex.schema.alterTable("${action.table}", (table) => {\n      table.dropColumn("${action.column}");\n  });\n};`;
      return { up, down, warnings };
    }
    default:
      return {
        up: `// Knex migration:\n${raw.up}`,
        down: `// Knex rollback:\n${raw.down}`,
        warnings,
      };
  }
}

function genTypeORM(
  action: ParsedAction,
  db: Database
): { up: string; down: string; warnings: string[] } {
  const raw = genRawSQL(action, db);
  const warnings = [...raw.warnings];

  switch (action.type) {
    case "create_table": {
      const up = `import { MigrationInterface, QueryRunner } from "typeorm";\n\nexport class Migration implements MigrationInterface {\n  public async up(queryRunner: QueryRunner): Promise<void> {\n    await queryRunner.query(\`${raw.up}\`);\n  }\n\n  public async down(queryRunner: QueryRunner): Promise<void> {\n    await queryRunner.query(\`${raw.down}\`);\n  }\n}`;
      return { up, down: `// See down() method in the migration class above`, warnings };
    }
    default: {
      const up = `import { MigrationInterface, QueryRunner } from "typeorm";\n\nexport class Migration implements MigrationInterface {\n  public async up(queryRunner: QueryRunner): Promise<void> {\n    await queryRunner.query(\`${raw.up}\`);\n  }\n\n  public async down(queryRunner: QueryRunner): Promise<void> {\n    await queryRunner.query(\`${raw.down}\`);\n  }\n}`;
      return { up, down: `// See down() method in the migration class above`, warnings };
    }
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateMigration(
  description: string,
  orm: ORM,
  database: Database
): GeneratedMigration {
  const action = parseDescription(description);
  const ts = generateTimestamp();
  const slug = slugify(description);

  let result: { up: string; down: string; warnings: string[] };

  switch (orm) {
    case "prisma":
      result = genPrisma(action, database);
      break;
    case "drizzle":
      result = genDrizzle(action, database);
      break;
    case "knex":
      result = genKnex(action, database);
      break;
    case "typeorm":
      result = genTypeORM(action, database);
      break;
    case "raw-sql":
    default:
      result = genRawSQL(action, database);
      break;
  }

  const ext =
    orm === "raw-sql"
      ? "sql"
      : orm === "knex"
        ? "js"
        : "ts";

  return {
    up: result.up,
    down: result.down,
    warnings: result.warnings,
    filename: `${ts}_${slug}.${ext}`,
  };
}
