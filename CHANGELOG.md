# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.6] - 2023-12-14

### Changed

- We've moved to Forgejo. Replaced relevant GitHub references with the appropriate URL.

### Security

- Updated vulnerable dependencies.

## [2.0.5] - 2023-08-12

### Changed

- Updated engine to Node 18.

## [2.0.4] - 2023-08-06

### Security

- Send `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` headers.

## [2.0.3] - 2023-03-11

### Changed

- `Content-Type` is now `text/plain` by default.

## [2.0.2] - 2023-03-05

### Fixed

- All responses include CORS headers again.

## [2.0.1] - 2023-03-05

### Added

- Responses now include the `Access-Control-Allow-Methods` header, with a value of `GET, OPTIONS`.

### Removed

- Responses no longer include `X-CSRF-Token`,`X-Requested-With`, `Accept-Version`, `Content-MD5`, or `X-Api-Version` in the `Access-Control-Allow-Headers` header.
- Responses no longer include CORS headers unless the request method is `OPTIONS` (ostensibly a CORS preflight request).

## [2.0.0] - 2023-03-05

### Changed

- Now sends a plain string in `text/html` by default. To receive JSON, include `application/json` in the `Accept` header.
- Now sends a newline at the end of the output.

## [1.0.2] - 2023-03-04

### Added

- An email address for people to reach me regarding our [Code of Conduct](/CODE_OF_CONDUCT.md).

### Fixed

- Attempt to make the auto-test pipeline not presume v1.x.x versions are "prerelease".

## [1.0.1] - 2023-03-04

### Added

- Auto-test pipeline.

## [1.0.0] - 2023-03-04

### Added

- Vercel Edge function to echo the caller's IP address.

[2.0.6]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v2.0.5...v2.0.6
[2.0.5]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v2.0.4...v2.0.5
[2.0.4]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v2.0.3...v2.0.4
[2.0.3]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v2.0.2...v2.0.3
[2.0.2]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v2.0.1...v2.0.2
[2.0.1]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v2.0.0...v2.0.1
[2.0.0]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v1.0.2...v2.0.0
[1.0.2]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v1.0.1...v1.0.2
[1.0.1]: https://git.average.name/AverageHelper/ip-echo-vercel/compare/v1.0.0...v1.0.1
[1.0.0]: https://git.average.name/AverageHelper/ip-echo-vercel/releases/tag/v1.0.0
