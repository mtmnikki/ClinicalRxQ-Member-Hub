/**
 * My Account page
 * - Updated to use AppShell with a fixed MemberSidebar (static frame on gated pages).
 * - Preserves previous content and breadcrumbs inside the AppShell content area.
 */

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { User as UserIcon, Settings, CreditCard } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import SafeText from '../components/common/SafeText';
import Breadcrumbs from '../components/common/Breadcrumbs';
import AppShell from '../components/layout/AppShell';
import MemberSidebar from '../components/layout/MemberSidebar';

export default function Account() {
  const { user } = useAuthStore();

  /** Header renderer for AppShell */
  const header = (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-4">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'My Account' },
        ]}
        className="mb-2"
      />
      <div className="mb-1 text-2xl font-bold">My Account</div>
      <div className="text-sm text-gray-600">Manage your profile and billing</div>
    </div>
  );

  return (
    <AppShell sidebar={<MemberSidebar />} header={header}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={String(user?.name ?? '')}
                    className="w-full rounded-md border p-2"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={String((user?.email ?? '') as any)}
                  className="w-full rounded-md border p-2"
                  readOnly
                />
              </div>

              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing &amp; Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 font-semibold">Active Subscriptions</h3>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Clinical Pharmacy Fundamentals</p>
                      <p className="text-sm text-gray-600">Next billing: January 15, 2024</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Payment Method</h3>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-gray-600">Expires 12/26</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
