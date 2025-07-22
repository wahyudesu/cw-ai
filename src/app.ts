import configureOpenAPI from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';

import chatbot from '@/routes/feedback/feedback.index';
import home from '@/routes/home/home.index';
import assignment from '@/routes/assignment/assignment.index';

const app = createApp();

const routes = [assignment, home, chatbot];

configureOpenAPI(app);
routes.forEach((route) => {
  app.route('/', route);
});

export default app;
