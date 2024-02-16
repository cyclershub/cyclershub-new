import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { router } from "../routers";
import { createContext } from "../routers/context";

// Wir erstellen zwei Server, einen der auf api.ibcornelsen.de verfügbar sein wird
// und einen der auf rpc.ibcornelsen.de verfügbar sein wird.
// Dadurch unterstützen wir sowohl die RPC als auch die REST API.
const rpcServer = express();

rpcServer.use(cors());

rpcServer.use(
	"/",
	trpcExpress.createExpressMiddleware({
		router,
		createContext,
	})
);

rpcServer.listen(3002, () => {
	console.log(`RPC server listening at http://localhost:3002`);
});