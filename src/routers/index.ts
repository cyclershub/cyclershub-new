
import { ImageRouter } from "./ImageRouter";
import { MessageRouter } from "./MessageRouter";
import { UserRouter } from "./UserRouter";
import { t } from "./context";
import { forumRouter } from "./forum";

export const router = t.router({ 
  user: UserRouter,
	messages: MessageRouter,
	images: ImageRouter,
	forum: forumRouter
});

export type AppRouter = typeof router;