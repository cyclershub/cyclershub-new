import { createTRPCProxyClient, createWSClient, httpBatchLink, wsLink } from '@trpc/client';
import type { AppRouter } from './pages/api/trpc/[trpc]';

const wsClient = createWSClient({
	url: 'ws://localhost:3001',
})

export default createTRPCProxyClient<AppRouter>({
  links: [
		wsLink({
			client: wsClient
		}),
    httpBatchLink({
      url: 'http://localhost:4321/api/trpc',
    }),
  ],
});