import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const nextDir = path.join(root, ".next");

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
}
