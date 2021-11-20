import { invalidURL, serveStatic, transformClientRequest } from './helpers'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest (request: Request): Promise<Response> {
  const requestURL = new URL(request.url)

  if (requestURL.pathname === '/') {
    return serveStatic('index')
  }

  // Parse GitHub URL.
  let githubURL
  let path = requestURL.href
    .slice(requestURL.origin.length + 1)
    .replace(/^https?:\/+/, 'https://') // Cloudflare Workers strips double slashes.

  try {
    githubURL = new URL(path)
    githubURL.protocol = 'https:'
  } catch {
    // try parsing with protocol again
    path = `https://${path}`

    try {
      githubURL = new URL(path)
    } catch {
      return invalidURL(path)
    }
  }

  // Proxy request to GitHub.
  switch (githubURL.host) {
    case 'github.com': {
      return githubURL.pathname.search(
        /^\/.+?\/.+?\/(?:releases|archive|suites|raw|info|git-).*$/
      ) === 0
        ? await transformClientRequest(request, githubURL)
        : invalidURL(path)
    }
    case 'raw.githubusercontent.com': {
      return githubURL.pathname.search(/^(?:\/.+?){3}\/.+$/i) === 0
        ? await transformClientRequest(request, githubURL)
        : invalidURL(path)
    }
    case 'gist.githubusercontent.com': {
      return githubURL.pathname.search(/^\/.+?\/.+?\/.+$/i) === 0
        ? await transformClientRequest(request, githubURL)
        : invalidURL(path)
    }
    default: {
      return serveStatic('not-found')
    }
  }
}
