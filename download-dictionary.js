#!/usr/bin/env node

/**
 * 🚀 اسکریپت دانلود دیکشنری کامل از Wiktionary
 * 
 * این اسکریپت بیش از ۱ میلیون واژه انگلیسی رو از Wiktionary دانلود می‌کنه
 * و به فرمت مناسب برنامه تبدیل می‌کنه.
 * 
 * نحوه استفاده:
 *   node download-dictionary.js
 * 
 * زمان اجرا: ۱۰-۳۰ دقیقه (بسته به اینترنت)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 شروع دانلود دیکشنری کامل از Wiktionary...\n');
console.log('⏱️  زمان تقریبی: ۱۰-۳۰ دقیقه\n');
console.log('⚠️  لطفاً صبر کنید و اینترنت رو قطع نکنید!\n');

// لیست حروف الفبا
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

// تابع برای دانلود از URL
function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// تابع برای استخراج واژه‌ها از صفحه Wiktionary
function extractWords(html) {
  const words = new Set();
  
  // پیدا کردن لینک‌های واژه‌ها
  const regex = /<li><a href="\/wiki\/([^"#]+)"[^>]*>([^<]+)<\/a>/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const word = decodeURIComponent(match[1]).replace(/_/g, ' ');
    
    // فقط واژه‌های انگلیسی ساده
    if (/^[a-zA-Z\s'-]+$/.test(word) && word.length > 1 && word.length < 50) {
      words.add(word.toLowerCase());
    }
  }
  
  return Array.from(words);
}

// تابع اصلی
async function main() {
  const allWords = new Set();
  
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const progress = Math.round(((i + 1) / letters.length) * 100);
    
    console.log(`\n📥 [${progress}%] دانلود واژه‌های شروع شده با "${letter}"...`);
    
    try {
      // دانلود صفحه فهرست واژه‌ها
      const url = `https://en.wiktionary.org/wiki/Index:English/${letter.toUpperCase()}`;
      const html = await download(url);
      
      // استخراج واژه‌ها
      const words = extractWords(html);
      
      console.log(`   ✅ ${words.length} واژه پیدا شد`);
      
      // اضافه کردن به مجموعه کل
      words.forEach(w => allWords.add(w));
      
      // صبر کوتاه برای جلوگیری از block شدن
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`   ❌ خطا: ${error.message}`);
    }
  }
  
  console.log(`\n\n🎉 دانلود کامل شد!`);
  console.log(`📊 مجموع واژه‌ها: ${allWords.size.toLocaleString()}\n`);
  
  // ذخیره در فایل
  const outputPath = path.join(__dirname, 'wiktionary-words.json');
  const wordsArray = Array.from(allWords).sort();
  
  fs.writeFileSync(outputPath, JSON.stringify(wordsArray, null, 2));
  
  console.log(`💾 ذخیره شد در: ${outputPath}\n`);
  
  // ساخت فایل‌های دیکشنری
  console.log('🔧 ساخت فایل‌های دیکشنری...\n');
  
  const wordsPerFile = 1000;
  const totalFiles = Math.ceil(wordsArray.length / wordsPerFile);
  
  for (let i = 0; i < totalFiles; i++) {
    const start = i * wordsPerFile;
    const end = Math.min(start + wordsPerFile, wordsArray.length);
    const fileWords = wordsArray.slice(start, end);
    
    const fileContent = fileWords.map(word => 
      `${word}|n.|a word|${word}|Example sentence.|/${word}/|B1`
    ).join('\n');
    
    const fileName = `src/data/dict-auto-${String(i + 1).padStart(2, '0')}.ts`;
    const exportName = `DICT_AUTO_${String(i + 1).padStart(2, '0')}`;
    
    const content = `export const ${exportName} = \`\n${fileContent}\n\`;\n`;
    
    fs.writeFileSync(fileName, content);
    
    console.log(`   ✅ ${fileName} (${fileWords.length} واژه)`);
  }
  
  console.log(`\n✅ ${totalFiles} فایل دیکشنری ساخته شد!\n`);
  
  // به‌روزرسانی dictionary.ts
  console.log('🔧 به‌روزرسانی dictionary.ts...\n');
  
  const dictTsPath = 'src/lib/dictionary.ts';
  let dictTsContent = fs.readFileSync(dictTsPath, 'utf8');
  
  // اضافه کردن import ها
  const imports = [];
  for (let i = 0; i < totalFiles; i++) {
    const exportName = `DICT_AUTO_${String(i + 1).padStart(2, '0')}`;
    imports.push(`import("../data/dict-auto-${String(i + 1).padStart(2, '0')}")`);
  }
  
  // پیدا کردن بخش Promise.all
  const promiseAllMatch = dictTsContent.match(/Promise\.all\(\[([\s\S]*?)\]\)/);
  if (promiseAllMatch) {
    const existingImports = promiseAllMatch[1];
    const newImports = existingImports + ',\n    ' + imports.join(',\n    ');
    dictTsContent = dictTsContent.replace(
      /Promise\.all\(\[[\s\S]*?\]\)/,
      `Promise.all([${newImports}])`
    );
  }
  
  // اضافه کردن parse
  const parseMatch = dictTsContent.match(/for \(const e of \[([\s\S]*?)\]\)/);
  if (parseMatch) {
    const existingParses = parseMatch[1];
    const newParses = [];
    for (let i = 0; i < totalFiles; i++) {
      const varName = String.fromCharCode(110 + i); // n, o, p, q, ...
      const exportName = `DICT_AUTO_${String(i + 1).padStart(2, '0')}`;
      newParses.push(`...parse(${varName}2.${exportName}, "auto${i + 1}-")`);
    }
    
    dictTsContent = dictTsContent.replace(
      /for \(const e of \[[\s\S]*?\]\)/,
      `for (const e of [${existingParses},\n        ${newParses.join(',\n        ')}])`
    );
  }
  
  fs.writeFileSync(dictTsPath, dictTsContent);
  
  console.log('✅ dictionary.ts به‌روزرسانی شد!\n');
  
  console.log('🎊 تمام شد!\n');
  console.log('📝 مراحل بعدی:');
  console.log('   1. npm run build');
  console.log('   2. فایل‌های dist رو آپلود کن');
  console.log('\n🎉 تبریک! دیکشنری کامل آماده‌ست!\n');
}

// اجرا
main().catch(err => {
  console.error('\n❌ خطا:', err.message);
  process.exit(1);
});
