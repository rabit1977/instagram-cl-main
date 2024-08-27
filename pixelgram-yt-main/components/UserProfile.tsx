import { NEXT_PROJECT_ROOT_DIST } from "next/dist/build/webpack-config";
import Image from "next/image";

interface UserProfileProps {
  profile: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

const UserProfile = ({ profile }: UserProfileProps) => (
  <div className="p-2 flex items-center border-b border-gray-200">
    {profile.image ? (
      <Image
        src={profile.image}
        alt={profile.name ?? 'User'}
        width={32}   // Set the width explicitly for Image optimization
        height={32}  // Set the height explicitly for Image optimization
        className="rounded-full mr-2"
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
    )}
    <div>
      <div className="font-semibold">
        {profile.name ?? 'No Name'}
      </div>
      <div className="text-sm text-gray-500">
        @{profile.username ?? 'No Username'}
      </div>
    </div>
  </div>
);

export default UserProfile;

