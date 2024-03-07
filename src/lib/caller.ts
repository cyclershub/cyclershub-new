import { createCallerFactory } from "@trpc/server";
import { router } from "../routers";
import { t } from "../routers/context";

export const createCaller = t.createCallerFactory(router);