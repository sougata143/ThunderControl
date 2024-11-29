import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import DeviceManagementService from '@/services/device-management.service';

export default function DeviceRestrictionsRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToFirstDevice() {
      try {
        const devices = await DeviceManagementService.getChildDevices();
        if (devices.length > 0) {
          router.replace(`/device-restrictions/${devices[0].id}`);
        } else {
          router.replace('/devices'); // Redirect to devices page if no devices
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        router.replace('/devices'); // Redirect to devices page on error
      }
    }

    redirectToFirstDevice();
  }, [router]);

  // Return null as this is just a redirect component
  return null;
}
