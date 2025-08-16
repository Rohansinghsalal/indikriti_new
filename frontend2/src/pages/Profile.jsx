import React from 'react';
import { Card } from '../components/ui';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <div className="p-6 text-center">
          <p className="text-gray-500">Profile management coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
