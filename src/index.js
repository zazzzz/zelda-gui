import dva from 'dva';
import { message } from 'antd';

import '@/index.css';

// 1. Initialize
const app = dva({
  onError(e) {
    message.error(e.message);
  }
});

// 2. Plugins
// app.use({});

// 3. Model

// 4. Router
app.router(require('@/router'));

// 5. Start
app.start('#root');
