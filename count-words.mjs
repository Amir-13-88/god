// شمارش دقیق تعداد واژه‌ها
import { DICT_A } from './src/data/dict-a.js';
import { DICT_B } from './src/data/dict-b.js';
import { DICT_C } from './src/data/dict-c.js';
import { DICT_D } from './src/data/dict-d.js';
import { DICT_E } from './src/data/dict-e.js';
import { DICT_F } from './src/data/dict-f.js';
import { DICT_G } from './src/data/dict-g.js';
import { DICT_H } from './src/data/dict-h.js';
import { DICT_I } from './src/data/dict-i.js';
import { DICT_J } from './src/data/dict-j.js';
import { DICT_K } from './src/data/dict-k.js';
import { DICT_L } from './src/data/dict-l.js';
import { DICT_M } from './src/data/dict-m.js';
import { DICT_N } from './src/data/dict-n.js';

function countWords(dict, name) {
  const lines = dict.trim().split('\n').filter(line => line.includes('|'));
  console.log(`${name}: ${lines.length} واژه`);
  return lines.length;
}

const total = 
  countWords(DICT_A, 'dict-a') +
  countWords(DICT_B, 'dict-b') +
  countWords(DICT_C, 'dict-c') +
  countWords(DICT_D, 'dict-d') +
  countWords(DICT_E, 'dict-e') +
  countWords(DICT_F, 'dict-f') +
  countWords(DICT_G, 'dict-g') +
  countWords(DICT_H, 'dict-h') +
  countWords(DICT_I, 'dict-i') +
  countWords(DICT_J, 'dict-j') +
  countWords(DICT_K, 'dict-k') +
  countWords(DICT_L, 'dict-l') +
  countWords(DICT_M, 'dict-m') +
  countWords(DICT_N, 'dict-n');

console.log(`\nمجموع کل: ${total} واژه`);
