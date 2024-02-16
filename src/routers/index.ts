
import { ImageRouter } from "./ImageRouter";
import { MessageRouter } from "./MessageRouter";
import { UserRouter } from "./UserRouter";
import { t } from "./context";

export const router = t.router({ 
  user: UserRouter,
	messages: MessageRouter,
	images: ImageRouter
});

export type AppRouter = typeof router;