#!/usr/bin/env node

const ParseModule = require("../dist/parse");

const Parse = ParseModule.default || ParseModule;
const args = process.argv.slice(2);

function printUsage() {
  console.error("Usage: pnpm parse [--first] <address>");
}

function parseArgs(argv) {
  const options = {
    first: false,
    help: false,
    addressParts: [],
  };

  for (const arg of argv) {
    if (arg === "--first" || arg === "-f") {
      options.first = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    options.addressParts.push(arg);
  }

  return options;
}

const options = parseArgs(args);
const address = options.addressParts.join(" ").trim();

if (options.help) {
  printUsage();
  process.exit(0);
}

if (!address) {
  printUsage();
  process.exit(1);
}

const results = Parse.parse(address, true);
const output = options.first ? results[0] || {} : results;

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
