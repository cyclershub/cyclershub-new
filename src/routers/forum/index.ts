import { t } from "../context";
import { createForumProcedure } from "./create";
import { createPostProcedure } from "./createPost";
import { createThreadProcedure } from "./createThread";
import { getThreadsProcedure } from "./getThreads";
import { threadNewsProcedure } from "./news";

export const forumRouter = t.router({
	create: createForumProcedure,
	createThread: createThreadProcedure,
	createPost: createPostProcedure,
	news: threadNewsProcedure,
	getThreads: getThreadsProcedure
})