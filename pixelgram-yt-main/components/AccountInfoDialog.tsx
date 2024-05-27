// AccountInfoDialog.tsx
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { UserWithExtras } from '@/lib/definitions';
import { Calendar, CheckCircle, MapPin } from 'lucide-react';
import Image from 'next/image';

type AccountInfoDialogProps = {
  user: UserWithExtras;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AccountInfoDialog: React.FC<AccountInfoDialogProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex flex-col items-center p-6 rounded-3xl overflow-auto h-[700px] '>
        <DialogClose className='absolute top-2 right-2' onClick={() => onOpenChange(false)} />
        <h1 className='text-xl font-bold'>About this Account</h1>
        <Image
          src={user.image || '/default-profile.png'}
          alt={user.name || 'Profile Picture'}
          width={80}
          height={80}
          className='w-20 h-20 rounded-full'
        />
        <p className='mt-2 font-semibold'>{user.name}</p>
        <p className='mt-4 text-center'>
          To help keep our community authentic, we’re showing information about
          accounts on Instagram. See why this information is important.
        </p>

        <div className='flex flex-col w-full mt-6 space-y-6'>
          <div className='flex items-center space-x-6'>
            <Calendar className='w-8 h-8' />
            <div>
              <p className='font-semibold'>Date joined</p>
              <p>
                {user.createdAt.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <MapPin className='w-8 h-8' />
            <div>
              <p className='font-semibold'>Account based in</p>
              <p>{user.location || 'Unknown'}</p>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <CheckCircle className='w-8 h-8' />
            <div>
              <p className='font-semibold'>Verified</p>
              <p>
                {user.verifiedDate
                  ? user.verifiedDate.toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Not verified'}
              </p>
            </div>
          </div>
        </div>

        <p className='mt-6 text-left'>
          Profiles can be verified by Meta, based on their activity across Meta
          products or documents they provide. Verified badges are displayed on
          these profiles.
        </p>
        <p className='mt-2 text-left'>
          Some verified profiles are owned by a notable person, brand or entity,
          while others subscribe to Meta Verified. Learn more.
        </p>

        <div className='flex flex-col space-y-2 w-full mt-6 '>
          <button className='w-full py-2 text-white bg-blue-600 rounded-md'>
            Join the waitlist for Meta Verified
          </button>
          <button className='w-full py-2  rounded-md ' onClick={() => onOpenChange(false)}>Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountInfoDialog;
