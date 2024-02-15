
import { MessageRouter } from "./MessageRouter";
import { UserRouter } from "./UserRouter";
import { t } from "./t";

export const router = t.router({ 
  user: UserRouter,
	messages: MessageRouter
});
