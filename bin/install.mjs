#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), "..");
const sourceDir = path.join(packageRoot, ".agents", "skills", "simplepowers");

const args = process.argv.slice(2);

function usage() {
  console.log(`simplepowers-codex-skill

Install the simplepowers Codex skill.

Usage:
  npx github:<owner>/simplepowers-codex-skill
  simplepowers-install [options]

Options:
  --global              Install to \${CODEX_HOME:-~/.codex}/skills/simplepowers (default)
  --project <path>      Install to <path>/.agents/skills/simplepowers
  --target <path>       Install to an exact target directory
  --force               Replace an existing target directory
  --dry-run             Print what would be installed
  --help                Show this help
`);
}

function readOption(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a path value.`);
  }
  return value;
}

function hasFlag(name) {
  return args.includes(name);
}

if (hasFlag("--help") || hasFlag("-h")) {
  usage();
  process.exit(0);
}

const force = hasFlag("--force");
const dryRun = hasFlag("--dry-run");
const projectPath = readOption("--project");
const exactTarget = readOption("--target");

if (projectPath && exactTarget) {
  throw new Error("Use either --project or --target, not both.");
}

function defaultGlobalTarget() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  return path.join(codexHome, "skills", "simplepowers");
}

function resolveTarget() {
  if (exactTarget) return path.resolve(exactTarget);
  if (projectPath) {
    return path.resolve(projectPath, ".agents", "skills", "simplepowers");
  }
  return defaultGlobalTarget();
}

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

const targetDir = resolveTarget();

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Skill source not found: ${sourceDir}`);
}

if (dryRun) {
  console.log(`Would install simplepowers from ${sourceDir}`);
  console.log(`Would install simplepowers to ${targetDir}`);
  console.log(force ? "Existing target would be replaced." : "Existing target would be preserved unless --force is provided.");
  process.exit(0);
}

if (fs.existsSync(targetDir)) {
  if (!force) {
    console.error(`Target already exists: ${targetDir}`);
    console.error("Re-run with --force to replace it.");
    process.exit(1);
  }
  fs.rmSync(targetDir, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
copyDir(sourceDir, targetDir);

console.log(`Installed simplepowers to ${targetDir}`);
console.log("Use it with: $simplepowers <your coding request>");
