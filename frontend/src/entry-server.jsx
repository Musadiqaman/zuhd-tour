import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';

export function render(path) {
  const context = {};
  const body = renderToString(
    <HelmetProvider context={context}>
      <StaticRouter location={path}>
        <LanguageProvider><App /></LanguageProvider>
      </StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = context;
  const head = ['title', 'meta', 'link', 'script'].map(key => helmet[key].toString()).join('\n');
  return { body, head };
}
