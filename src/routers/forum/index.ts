import { t } from "../context";
import { createForumProcedure } from "./create";
import { createPostProcedure } from "./createPost";
import { createThreadProcedure } from "./createThread";
import { getThreadsProcedure } from "./getThreads";
import { threadNewsProcedure } from "./news";
import { threadSubscribeProcedure } from "./thread/subscribe";
import { threadUnsubscribeProcedure } from "./thread/unsubscribe";

export const forumRouter = t.router({
	create: createForumProcedure,
	createThread: createThreadProcedure,
	createPost: createPostProcedure,
	news: threadNewsProcedure,
	getThreads: getThreadsProcedure,
	threads: t.router({
		subscribe: threadSubscribeProcedure,
		unsubscribe: threadUnsubscribeProcedure
	})
})