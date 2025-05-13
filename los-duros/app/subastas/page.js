import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function SubastasPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <SearchResultsClient />
    </Suspense>
  );
}