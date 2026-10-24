import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import { PageDataProvider } from './context/PageDataContext';
export function render(path, data = {}) {
  const context = {};
  const body = renderToString(<HelmetProvider context={context}>
      <StaticRouter location={path}>
        <PageDataProvider data={data}><LanguageProvider><App /></LanguageProvider></PageDataProvider>
      </StaticRouter>
    </HelmetProvider>);
  const {
    helmet
  } = context;
  const head = ['title', 'meta', 'link', 'script'].map(key => helmet[key].toString()).join('\n');
  return {
    body,
    head
  };
}
