import { useEffect, useState } from 'react';
import { loadBaseEntries } from './src/lib/dictionary';

export default function WordCounter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBaseEntries().then(entries => {
      setCount(entries.length);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{
      fontFamily: 'Vazirmatn, Tahoma, sans-serif',
      direction: 'rtl',
      padding: '40px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        شمارش واژه‌های دیکشنری
      </h1>
      
      {loading ? (
        <div>
          <div style={{
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
          <p>در حال شمارش...</p>
        </div>
      ) : (
        <div>
          <div style={{
            fontSize: '72px',
            fontWeight: 'bold',
            margin: '30px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {count.toLocaleString('fa-IR')}
          </div>
          <p style={{ fontSize: '24px' }}>
            واژه در دیکشنری
          </p>
          
          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ marginBottom: '15px' }}>آمار کامل:</h3>
            <p>✅ تعداد کل واژه‌ها: {count.toLocaleString('fa-IR')}</p>
            <p>✅ هر واژه شامل: تعریف، معنی، مثال، تلفظ، سطح</p>
            <p>✅ کاملاً آفلاین</p>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
