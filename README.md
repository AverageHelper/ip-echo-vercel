# IP Echo

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
$ oazapfts https://raw.githubusercontent.com/AverageHelper/ip-echo-vercel/main/openapi.yaml ./ip.ts
```

```ts
import { ip } from "./ip";

const result = await ip();

switch (result.status) {
	case 200:
		console.info(result.data); // "1.2.3.4"
		break;

	case 404:
		console.warn("Couldn't get IP address");
		break;

	default:
		console.error("Something went very very wrong!");
}
```

## No logs?

No more than Vercel's normal logging, which looks like this:

![A screenshot of Vercel's connection logs. Included is the time of the request, the request status code, the requested host name, the requested document path on the host, the requester's user agent string, and Vercel's request ID string.](/docs/images/example-logs.png)

There's not much there to identify you, unless you put some personally-identifying information into your request path, or contact me directly and inform me that you made a request.

I'm not doing any additional logging myself. You can read as much [in the code](/api/index.ts), though I suppose I cannot prove that I'm running _this_ repo on the above-named endpoint on Vercel's Edge network. If you're concerned I may be snooping, feel free to run your own instance!
