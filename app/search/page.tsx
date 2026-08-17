import { Suspense } from 'react';
import SearchResultsContent from './SearchResultsContent';

export const metadata = {
  title: 'Search',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-porcelain">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Loading results</p>
        </main>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
