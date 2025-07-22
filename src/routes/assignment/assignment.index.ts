// import { createRouter } from "@/lib/create-app";
// import { createRouter } from "@/lib/create-app";
import { createRouter } from '@/lib/create-app';
import * as handlers from './assignment.handlers';
import * as routes from './assignment.routes';
import { passwordHeaderMiddleware } from '@/middlewares/password-header';

const router = createRouter();
router.use('/*', passwordHeaderMiddleware);
router.openapi(routes.processText, handlers.processText);

export default router;
