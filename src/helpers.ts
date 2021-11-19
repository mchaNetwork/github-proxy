export async function transformClientRequest (
  request: Request,
  url: URL
): Promise<Response> {
  // Handle preflight requests
  if (
    request.method === 'OPTIONS' &&
    request.headers.has('access-control-request-headers')
  ) {
    return new Response(undefined, {
      status: 204,
      headers: new Headers({
        'access-control-allow-origin': '*',
        'access-control-allow-methods':
          'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
        'access-control-max-age': '1728000'
      })
    })
  }

  const requestInit = {
    method: request.method,
    headers: new Headers(request.headers),
    redirect: 'follow',
    body: request.body
  }
  const response = await fetch(url.href, requestInit)
  const headers = new Headers(response.headers)

  const status = response.status
  headers.set('access-control-expose-headers', '*')
  headers.set('access-control-allow-origin', '*')

  headers.delete('content-security-policy')
  headers.delete('content-security-policy-report-only')
  headers.delete('clear-site-data')

  return new Response(response.body, {
    status,
    headers
  })
}

const staticAssets = {
  'not-found': {
    data: '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>Not found</title><style>html{box-sizing:border-box;-webkit-text-size-adjust:100%;word-break:normal;-moz-tab-size:4;tab-size:4}*,:after,:before{background-repeat:no-repeat;box-sizing:inherit}:after,:before{text-decoration:inherit;vertical-align:inherit}*{padding:0;margin:0}hr{overflow:visible;height:0;color:inherit}details,main{display:block}summary{display:list-item}small{font-size:80%}[hidden]{display:none}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}a{background-color:transparent}a:active,a:hover{outline-width:0}code,kbd,pre,samp{font-family:monospace,monospace}pre{font-size:1em}b,strong{font-weight:bolder}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-color:inherit;text-indent:0}input{border-radius:0}[disabled]{cursor:default}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;resize:vertical}button,input,optgroup,select,textarea{font:inherit}optgroup{font-weight:700}button{overflow:visible}button,select{text-transform:none}[role=button],[type=button],[type=reset],[type=submit],button{cursor:pointer;color:inherit}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button:-moz-focusring{outline:1px dotted ButtonText}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}button,input,select,textarea{background-color:transparent;border-style:none}a:focus,button:focus,input:focus,select:focus,textarea:focus{outline-width:0}select{-moz-appearance:none;-webkit-appearance:none}select::-ms-expand{display:none}select::-ms-value{color:currentColor}legend{border:0;color:inherit;display:table;white-space:normal;max-width:100%}::-webkit-file-upload-button{-webkit-appearance:button;color:inherit;font:inherit}img{border-style:none}progress{vertical-align:baseline}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled=true]{cursor:default}</style><style>body{font-family:-apple-system,BlinkMacSystemFont,system-ui,Roboto,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";background:rgb(46,52,64);color:rgb(216,222,233);overflow:hidden;margin:0;padding:0;}h1{margin:0;font-size:22px;line-height:24px;margin-bottom:12px;}.main{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;width:100vw;}.card{position:relative;display:flex;flex-direction:column;width:75%;max-width:364px;padding:24px;background:rgb(216,222,233);color:rgb(46,52,64);border-radius:8px;box-shadow:0 2px 4px 0 rgba(14,30,37,.16);}a{text-decoration-color:rgb(94,129,172);color:rgb(94,129,172);}</style></head><body><div class="main"><div class="card"><h1>404. That’s an error.</h1><p>The requested URL was not found on this server.</p><p>That’s all we know.</p></body></html>',
    mime: 'text/html'
  },
  index: {
    data: '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>GitHub Proxy</title><style>html{box-sizing:border-box;-webkit-text-size-adjust:100%;word-break:normal;-moz-tab-size:4;tab-size:4}*,:after,:before{background-repeat:no-repeat;box-sizing:inherit}:after,:before{text-decoration:inherit;vertical-align:inherit}*{padding:0;margin:0}hr{overflow:visible;height:0;color:inherit}details,main{display:block}summary{display:list-item}small{font-size:80%}[hidden]{display:none}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}a{background-color:transparent}a:active,a:hover{outline-width:0}code,kbd,pre,samp{font-family:monospace,monospace}pre{font-size:1em}b,strong{font-weight:bolder}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-color:inherit;text-indent:0}input{border-radius:0}[disabled]{cursor:default}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;resize:vertical}button,input,optgroup,select,textarea{font:inherit}optgroup{font-weight:700}button{overflow:visible}button,select{text-transform:none}[role=button],[type=button],[type=reset],[type=submit],button{cursor:pointer;color:inherit}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button:-moz-focusring{outline:1pxdotted ButtonText}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}button,input,select,textarea{background-color:transparent;border-style:none}a:focus,button:focus,input:focus,select:focus,textarea:focus{outline-width:0}select{-moz-appearance:none;-webkit-appearance:none}select::-ms-expand{display:none}select::-ms-value{color:currentColor}legend{border:0;color:inherit;display:table;white-space:normal;max-width:100%}::-webkit-file-upload-button{-webkit-appearance:button;color:inherit;font:inherit}img{border-style:none}progress{vertical-align:baseline}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled=true]{cursor:default}</style><style>body{font-family:-apple-system,BlinkMacSystemFont,system-ui,Roboto,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";background:rgb(46,52,64);color:rgb(216,222,233);overflow:hidden;margin:0;padding:0;}h1{margin:0;font-size:22px;line-height:24px;margin-bottom:12px;}.main{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;width:100vw;}.card{position:relative;display:flex;flex-direction:column;width:75%;max-width:364px;padding:24px;background:rgb(216,222,233);color:rgb(46,52,64);border-radius:8px;box-shadow:02px 4px 0 rgba(14,30,37,.16);overflow:hidden;}a{text-decoration-color:rgb(94,129,172);color:rgb(94,129,172);}hr{margin:1em 0 1em}</style></head><body><div class="main"><div class="card"><h1>GitHub Proxy</h1><form onsubmit="void function(e){e.preventDefault();window.open(\'/\' + document.getElementById(\'q\').value);return false}"><input type="url" id="q" placeholder="https://github.com/…" autofocus pattern="^https?:\\/\\/.*\\.?github(usercontent)?.com\\/?.*$" required> <button type="submit">→</button></form><hr><footer>Powered with ❤ by <a href="https://github.com/mchaNetwork/github-proxy">github-proxy</a></footer></body></html>',
    mime: 'text/html'
  },
  robots: {
    data: 'User-agent: *\nDisallow: /\n',
    mime: 'text/plain'
  }
}

export function serveStatic (
  key: keyof typeof staticAssets = 'not-found'
): Response {
  return new Response(staticAssets[key].data, {
    headers: { 'Content-Type': staticAssets[key].mime }
  })
}

export function invalidURL (url: string): Response {
  return new Response(`Invalid URL: ${url}`, {
    status: 400,
    headers: { 'Content-Type': 'text/plain' }
  })
}
