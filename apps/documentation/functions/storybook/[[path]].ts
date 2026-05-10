/**
 * Proxy `/storybook/*` to the storybook Pages project.
 *
 * `_redirects` cross-origin rewrites aren't supported by Cloudflare Pages
 * (only relative URLs work for status 200), so this Function does the proxy
 * explicitly. Reads the captured catch-all subpath, fetches from the storybook
 * origin, returns the response unchanged.
 */

const STORYBOOK_ORIGIN = "https://calibrate-6qj.pages.dev";

interface ProxyContext {
  params: { path?: string | string[] };
  request: Request;
}

export const onRequest = async (context: ProxyContext): Promise<Response> => {
  const raw = context.params.path;
  const subpath = Array.isArray(raw) ? raw.join("/") : (raw ?? "");

  const url = new URL(context.request.url);
  const target = new URL(`/${subpath}`, STORYBOOK_ORIGIN);
  target.search = url.search;

  return fetch(new Request(target.toString(), context.request));
};
