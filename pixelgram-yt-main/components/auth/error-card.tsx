import { CardWrapper } from '@/components/auth/card-wrapper';
import { ShieldAlert} from 'lucide-react';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel='Oops! Something went wrong!'
      backButtonHref='/auth/login'
      backButtonLabel='Back to login'
    >
      <div className='w-full flex justify-center items-center'>
      <ShieldAlert />
      </div>
    </CardWrapper>
  );
};
