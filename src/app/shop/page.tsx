import { Suspense } from 'react';
import { ShopPage } from '../../screens/ShopPage.tsx';

// ShopPage reads the query string (useSearchParams), which needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
