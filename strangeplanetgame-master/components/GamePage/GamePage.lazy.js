import React, { lazy, Suspense } from 'react';

const LazyGamePage = lazy(() => import('./GamePage'));

const GamePage = props => (
  <Suspense fallback={null}>
    <LazyGamePage {...props} />
  </Suspense>
);

export default GamePage;
