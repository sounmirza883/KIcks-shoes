import { CollectionsPage } from '../../../screens/CollectionsPage.tsx';
import { COLLECTION_IDS } from '../../../utils/routes.ts';

// Only the four known collections exist; any other id is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTION_IDS.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CollectionsPage selectedCollectionId={id} />;
}
