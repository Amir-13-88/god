#!/usr/bin/env node

/**
 * 🚀 اسکریپت راه‌اندازی Firebase
 * 
 * این اسکریپت به شما کمک می‌کنه Firebase رو به راحتی پیکربندی کنی
 * فقط کافیه مقادیر رو از Firebase Console کپی کنی
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n🔥 راه‌اندازی Firebase برای لایتنر زبان\n');
  
  // بررسی وجود فایل JSON
  const jsonPath = path.join(__dirname, 'firebase-config.json');
  let useJson = false;
  let config = null;
  
  if (fs.existsSync(jsonPath)) {
    const useFile = await ask('📄 فایل firebase-config.json پیدا شد. می‌خوای از اون استفاده کنی؟ (yes/no): ');
    if (useFile.toLowerCase() === 'yes') {
      try {
        config = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        useJson = true;
        console.log('✅ مقادیر از فایل خوانده شد\n');
      } catch (err) {
        console.log('❌ خطا در خواندن فایل JSON');
        console.log('لطفاً مقادیر رو دستی وارد کن\n');
      }
    }
  }
  
  if (!useJson) {
    console.log('📋 قبل از شروع، مطمئن شو که:');
    console.log('   1. یک پروژه Firebase ساختی');
    console.log('   2. Authentication رو فعال کردی');
    console.log('   3. Firestore Database ساختی');
    console.log('   4. پیکربندی Web App رو کپی کردی\n');

    const start = await ask('آماده‌ای شروع کنیم؟ (yes/no): ');
    if (start.toLowerCase() !== 'yes') {
      console.log('❌ لغو شد');
      rl.close();
      return;
    }

    console.log('\n📝 مقادیر Firebase Config رو وارد کن:');
    console.log('   (این مقادیر رو از Firebase Console > Project Settings > Your apps > Web app کپی کن)\n');

    config = {
      apiKey: await ask('🔑 apiKey: '),
      authDomain: await ask('🌐 authDomain: '),
      projectId: await ask('📦 projectId: '),
      storageBucket: await ask('💾 storageBucket: '),
      messagingSenderId: await ask('📨 messagingSenderId: '),
      appId: await ask('📱 appId: ')
    };
  }
  
  const apiKey = config.apiKey;
  const authDomain = config.authDomain;
  const projectId = config.projectId;
  const storageBucket = config.storageBucket;
  const messagingSenderId = config.messagingSenderId;
  const appId = config.appId;

  console.log('\n✅ بررسی مقادیر...');
  
  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    console.log('❌ همه مقادیر باید پر بشن!');
    rl.close();
    return;
  }

  const config = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
  };

  console.log('\n📝 پیکربندی:');
  console.log(JSON.stringify(config, null, 2));

  const confirm = await ask('\nاین مقادیر درسته؟ (yes/no): ');
  if (confirm.toLowerCase() !== 'yes') {
    console.log('❌ لغو شد. دوباره اجرا کن.');
    rl.close();
    return;
  }

  console.log('\n⚙️  در حال به‌روزرسانی فایل firebase.ts...');

  const firebasePath = path.join(__dirname, 'src', 'lib', 'firebase.ts');
  
  if (!fs.existsSync(firebasePath)) {
    console.log('❌ فایل firebase.ts پیدا نشد!');
    rl.close();
    return;
  }

  let content = fs.readFileSync(firebasePath, 'utf8');

  // جایگزینی پیکربندی
  const configRegex = /const firebaseConfig = \{[\s\S]*?\};/;
  const newConfig = `const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}"
};`;

  content = content.replace(configRegex, newConfig);

  fs.writeFileSync(firebasePath, content, 'utf8');

  console.log('✅ فایل firebase.ts به‌روزرسانی شد!');

  const testNow = await ask('\n🧪 می‌خوای الان تست کنی؟ (yes/no): ');
  
  if (testNow.toLowerCase() === 'yes') {
    console.log('\n🚀 در حال اجرای برنامه...');
    console.log('   بعد از اجرای برنامه، به تب "برنامه" > "حساب کاربری" برو');
    console.log('   و روی "ورود با Google" کلیک کن\n');
    
    const { exec } = require('child_process');
    exec('npm run dev', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ خطا در اجرای برنامه');
        console.log(error.message);
        return;
      }
      if (stderr) {
        console.log(stderr);
      }
      console.log(stdout);
    });
  } else {
    console.log('\n✅ تمام!');
    console.log('\n📌 مراحل بعدی:');
    console.log('   1. برنامه رو اجرا کن: npm run dev');
    console.log('   2. به تب "برنامه" > "حساب کاربری" برو');
    console.log('   3. روی "ورود با Google" کلیک کن');
    console.log('   4. اگه وارد شدی، یعنی Firebase کار می‌کنه! 🎉');
  }

  rl.close();
}

main().catch((err) => {
  console.error('❌ خطا:', err);
  rl.close();
});
