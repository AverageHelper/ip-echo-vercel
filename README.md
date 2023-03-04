# ip-echo-vercel

A simple no-logs Vercel Edge function that returns the caller's IP address.

## Usage

A `GET` request to <https://ipv4.average.name/api> will return a JSON string containing the caller's IPv4 address. Note that, because this project is hosted on Vercel, and Vercel does not support IPv6, you will only see an IPv4 address from this endpoint.

Navigating to the root returns an HTML file that defines a redirect to the `/api` endpoint, because Vercel is weird.

## No logs?

Not so far as I know! I'm not doing any logging myself, but if Vercel keeps their own logs, that's their prerogative. I cannot prove that I'm running this repo on the above-named endpoint on Vercel's Edge network. If you're concerned, feel free to run your own.
