/**
 * Bookmarks page (protected)
 * - Updated to use AppShell with a fixed MemberSidebar (static frame).
 */

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bookmark } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import AppShell from '../components/layout/AppShell';
import MemberSidebar from '../components/layout/MemberSidebar';

export default function Bookmarks() {
  const bookmarks: Array<{ id: string; title: string; href: string }> = [];

  const header = (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-4">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Bookmarks' },
        ]}
      />
      <div className="mt-2 text-2xl font-bold">Bookmarks</div>
      <div className="text-sm text-gray-600">Quick access to items you’ve saved</div>
    </div>
  );

  return (
    <AppShell sidebar={<MemberSidebar />} header={header}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-cyan-500" />
            Saved Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <p className="text-gray-600">You haven’t saved any items yet.</p>
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((b) => (
                <li key={b.id}>
                  <a href={b.href} className="text-blue-600 hover:underline">
                    {b.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
