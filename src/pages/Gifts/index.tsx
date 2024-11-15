import { useState } from 'react';
import { ErrorPage, EmptyPlaceholder } from '@/components';
import GiftCard from './GiftCard';
import SendGiftModal from './SendGiftModal';
import { useTranslation } from 'react-i18next';
import { useGetMyGiftsQuery } from '@/services';
import Skeleton from './Skeleton';

function Gifts() {
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useGetMyGiftsQuery(undefined);

  const orders = data?.data;

  const isEmpty = orders?.length === 0;

  const [orderIdSelected, setOrderIdSelected] = useState<null | string>(null);
  const [isSendModalOpened, setSendModalOpened] = useState(false);

  const onSend = (id: string) => {
    setOrderIdSelected(id);
    setSendModalOpened(true);
  };

  if (isError) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <div className='p-4'>
        <div className='my-6 text-center'>
          <h1 className='mb-2 text-xl font-semibold'>{t('gifts.title')}</h1>

          <p className='text-label-secondary-light dark:text-label-secondary-dark'>
            {t('gifts.description')}
          </p>
        </div>

        <div className='py-2'>
          {isLoading ? (
            <Skeleton />
          ) : isEmpty ? (
            <div className='bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-[12px]'>
              <EmptyPlaceholder description={t('gifts.empty')} isLinkVisivle />
            </div>
          ) : (
            <div className='grid grid-cols-3 gap-2'>
              {orders?.map((order) => (
                <GiftCard key={order._id} gift={order.giftId} onSend={() => onSend(order._id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SendGiftModal
        orderSelected={orders?.find((order) => order._id === orderIdSelected)}
        isOpen={isSendModalOpened}
        onClose={() => setSendModalOpened(false)}
      />
    </>
  );
}

export default Gifts;
