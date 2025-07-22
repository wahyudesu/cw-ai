// import { createRouter } from "@/lib/create-app";
// import { createRouter } from "@/lib/create-app";
import { createRouter } from '@/lib/create-app';
import * as handlers from './feedback.handlers';
import * as routes from './feedback.routes';
import { passwordHeaderMiddleware } from '@/middlewares/password-header';

const router = createRouter();
router.use('/*', passwordHeaderMiddleware);
router.openapi(routes.processText, handlers.processText);

export default router;
