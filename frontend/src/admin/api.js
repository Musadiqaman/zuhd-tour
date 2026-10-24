let csrfToken = '';
export function setCsrf(value) {
  csrfToken = value || '';
}
export async function api(path, options = {}) {
  const {
    body,
    ...rest
  } = options;
  const form = body instanceof FormData;
  let response;
  try {
    response = await fetch('/api/' + path, {
      ...rest,
      credentials: 'same-origin',
      headers: {
        ...(body && !form ? {
          'Content-Type': 'application/json'
        } : {}),
        ...(csrfToken ? {
          'X-CSRF-Token': csrfToken
        } : {}),
        ...options.headers
      },
      ...(body ? {
        body: form ? body : JSON.stringify(body)
      } : {})
    });
  } catch {
    throw Error('Cannot reach the server. Check your connection and try again.');
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw Error('The content server is not connected yet. Please contact your website administrator.');
  }
  if (!response.ok) throw Object.assign(Error(data.error || 'The request could not be completed.'), {
    status: response.status
  });
  return data;
}
