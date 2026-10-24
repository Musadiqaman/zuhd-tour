import React from 'react';
export const PageDataContext = React.createContext({});
export function PageDataProvider({
  data = {},
  children
}) {
  return <PageDataContext.Provider value={data}>{children}</PageDataContext.Provider>;
}
export const usePageData = () => React.useContext(PageDataContext);
export function usePublicData(url, initial) {
  const [state, setState] = React.useState({
    url,
    data: initial,
    error: 0,
    loading: !initial
  });
  React.useEffect(() => {
    const controller = new AbortController();
    setState({
      url,
      data: initial,
      error: 0,
      loading: !initial
    });
    fetch(url, {
      signal: controller.signal,
      credentials: 'same-origin'
    }).then(async res => {
      const body = await res.json();
      if (!res.ok) throw Object.assign(Error(body.error || 'Unavailable'), {
        status: res.status
      });
      setState({
        url,
        data: body,
        error: 0,
        loading: false
      });
    }).catch(e => {
      if (e.name !== 'AbortError') setState({
        url,
        data: e.status === 404 ? null : initial,
        error: e.status || 503,
        loading: false
      });
    });
    return () => controller.abort();
  }, [url]);
  return state.url === url ? state : {
    url,
    data: initial,
    error: 0,
    loading: !initial
  };
}
