import { createTRPCProxyClient, createWSClient, httpBatchLink, wsLink } from '@trpc/client';
import type { AppRouter } from "./routers";
import Cookies from 'js-cookie';
import { Buffer } from 'buffer';

const wsClient = createWSClient({
	url: 'ws://localhost:3001',
})

export default createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3002/',
			headers() {
				const accessToken = Cookies.get('accessToken');
				if (!accessToken) return {};

				const buffer = Buffer.from(accessToken, 'utf-8');
				const base64 = buffer.toString('base64')

        return {
          'Authorization': `Bearer ${base64}`,
        };
			}
    }),
		wsLink({
			client: wsClient
		}),
  ],
});