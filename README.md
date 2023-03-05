# ip-echo-vercel

A simple no-logs Vercel Edge function that returns the caller's IP address.

## Usage

A `GET` request to <https://ipv4.average.name/api> will return a string containing the caller's IPv4 address. Note that, because this project is hosted on Vercel, and [Vercel does not support IPv6](https://github.com/orgs/vercel/discussions/47#discussioncomment-4314763), you will only see an IPv4 address from this endpoint.

```sh
$ curl https://ipv4.average.name/api
1.2.3.4
```

Navigating to the root returns an HTML file that defines a redirect to the `/api` endpoint, because Vercel is weird.

The API is documented using [OpenAPI](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/AverageHelper/ip-echo-vercel/main/openapi.yaml). You can generate a TypeScript client by plugging our spec file into [oazapfts](https://www.npmjs.com/package/oazapfts):

```sh
$ ./node_modules/.bin/oazapfts https://raw.githubusercontent.com/AverageHelper/ip-echo-vercel/main/openapi.yaml ./foo/api.ts
```

```ts
import { ip } from "./foo/api";

const result = await ip();

if (result.status !== 200) {
	console.warn("Couldn't get IP address");
} else {
	console.info(result.data); // "1.2.3.4"
}
```

## No logs?

Not so far as I know! I'm not doing any logging myself, but if Vercel keeps their own logs, that's their prerogative. I cannot prove that I'm running this repo on the above-named endpoint on Vercel's Edge network. If you're concerned, feel free to run your own.
