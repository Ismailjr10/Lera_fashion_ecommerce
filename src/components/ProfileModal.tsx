import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  first_name: string;
  phone: string;
  address: string;
  bust_size: string;
  waist_size: string;
  hip_size: string;
  height: string;
  pant_length: string;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    phone: '',
    address: '',
    bust_size: '',
    waist_size: '',
    hip_size: '',
    height: '',
    pant_length: '',
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (err) throw err;

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          phone: data.phone || '',
          address: data.address || '',
          bust_size: data.bust_size || '',
          waist_size: data.waist_size || '',
          hip_size: data.hip_size || '',
          height: data.height || '',
          pant_length: data.pant_length || '',
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess(false);

      const { error: err } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user?.id,
            first_name: profile.first_name,
            phone: profile.phone,
            address: profile.address,
            bust_size: profile.bust_size,
            waist_size: profile.waist_size,
            hip_size: profile.hip_size,
            height: profile.height,
            pant_length: profile.pant_length,
          },
          { onConflict: 'id' }
        );

      if (err) throw err;

      toast.success('Profile saved successfully!');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4 z-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-maroon-900">My Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Profile saved successfully!
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-maroon-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100"
                  placeholder="+234..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={loading}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100 resize-none"
                  placeholder="Delivery address"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-maroon-900 mb-4">Body Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bust (inches)
                </label>
                <input
                  type="text"
                  value={profile.bust_size}
                  onChange={(e) => setProfile({ ...profile, bust_size: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100"
                  placeholder="e.g., 34"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waist (inches)
                </label>
                <input
                  type="text"
                  value={profile.waist_size}
                  onChange={(e) => setProfile({ ...profile, waist_size: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100"
                  placeholder="e.g., 28"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hip (inches)
                </label>
                <input
                  type="text"
                  value={profile.hip_size}
                  onChange={(e) => setProfile({ ...profile, hip_size: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100"
                  placeholder="e.g., 36"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100"
                  placeholder="e.g., 170"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pant Length (inches)
                </label>
                <input
                  type="text"
                  value={profile.pant_length}
                  onChange={(e) => setProfile({ ...profile, pant_length: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-maroon-900 disabled:bg-gray-100"
                  placeholder="e.g., 32"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
