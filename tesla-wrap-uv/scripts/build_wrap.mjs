#!/usr/bin/env node

import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const requireFromCwd = createRequire(path.join(process.cwd(), 'package.json'));
const requireFromSkill = createRequire(import.meta.url);
let sharp;
try {
  sharp = requireFromCwd('sharp');
} catch {
  try {
    sharp = requireFromSkill('sharp');
  } catch {
    throw new Error('The compositor requires the sharp package. Run it from a Node project that already provides sharp; do not install dependencies without user approval.');
  }
}

function usage() {
  console.log('Usage: node build_wrap.mjs --config /absolute/path/config.json');
  console.log('Config: { template, art, output, background?, baseColor?, layers: [{ source?, left, top, width, height, rotate, flop?, flip? }] }');
}

const args = process.argv.slice(2);
const configIndex = args.indexOf('--config');
if (configIndex < 0 || !args[configIndex + 1]) {
  usage();
  process.exit(2);
}

const configPath = path.resolve(args[configIndex + 1]);
const configDir = path.dirname(configPath);
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

function resolveFile(value, field) {
  if (!value) throw new Error(`Missing required config field: ${field}`);
  return path.isAbsolute(value) ? value : path.resolve(configDir, value);
}

const templatePath = resolveFile(config.template, 'template');
const artPath = resolveFile(config.art, 'art');
const outputPath = resolveFile(config.output, 'output');
const templateMeta = await sharp(templatePath).metadata();

if (!templateMeta.width || !templateMeta.height || templateMeta.width !== templateMeta.height) {
  throw new Error('Tesla template must be a square PNG.');
}

const canvasSize = templateMeta.width;
if (canvasSize < 512 || canvasSize > 1024) {
  throw new Error(`Unexpected template size ${canvasSize}; expected 512–1024 px.`);
}

let canvas;
if (config.background) {
  canvas = sharp(resolveFile(config.background, 'background')).resize(canvasSize, canvasSize, { fit: 'fill' }).ensureAlpha();
} else {
  canvas = sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: config.baseColor || '#65d9f5'
    }
  });
}

const composites = [];
for (const [index, layer] of (config.layers || []).entries()) {
  const source = layer.source ? resolveFile(layer.source, `layers[${index}].source`) : artPath;
  const rotate = Number(layer.rotate || 0);
  if (![0, 90, 180, 270].includes(rotate)) {
    throw new Error(`layers[${index}].rotate must be 0, 90, 180, or 270.`);
  }
  if (![layer.left, layer.top, layer.width, layer.height].every(Number.isFinite)) {
    throw new Error(`layers[${index}] needs numeric left, top, width, and height.`);
  }

  let image = sharp(source)
    .ensureAlpha()
    .resize(layer.width, layer.height, { fit: 'contain' });
  if (layer.flop) image = image.flop();
  if (layer.flip) image = image.flip();
  if (rotate) image = image.rotate(rotate);

  composites.push({
    input: await image.png().toBuffer(),
    left: Math.round(layer.left),
    top: Math.round(layer.top),
    blend: 'over'
  });
}

const painted = await canvas.composite(composites).png().toBuffer();
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await sharp(painted)
  .composite([{ input: templatePath, blend: 'dest-in' }])
  .png({ compressionLevel: 9, palette: true, quality: 88, colours: 256 })
  .toFile(outputPath);

const resultMeta = await sharp(outputPath).metadata();
const resultStat = await fs.stat(outputPath);
if (resultStat.size > 1024 * 1024) {
  throw new Error(`Output is ${(resultStat.size / 1024 / 1024).toFixed(2)} MB; Tesla requires at most 1 MB.`);
}

console.log(JSON.stringify({
  output: outputPath,
  width: resultMeta.width,
  height: resultMeta.height,
  bytes: resultStat.size,
  template: templatePath,
  layers: (config.layers || []).map(({ left, top, width, height, rotate = 0, flop = false, flip = false }) => ({
    left, top, width, height, rotate, flop, flip
  }))
}, null, 2));
