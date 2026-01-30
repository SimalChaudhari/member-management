import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicDataGrid from 'components/table/DynamicDataGrid';
import { paymentsList } from 'store/action/PaymentActions';
import { RootState } from 'store/Store';

const Payments = (): ReactElement => {
  const dispatch = useDispatch();
  const { payments } = useSelector((state: RootState) => state.payments);

  const handleDataLoad = () => {
    dispatch(paymentsList() as any);
  };

  return (
    <DynamicDataGrid
      title="Payment Transactions"
      data={payments?.data || []}
      columns={payments?.columns || []}
      onDataLoad={handleDataLoad}
      currencyFields={['Billing_Amount__c']}
      statusFields={['status']}
      pageSize={5}
      searchPlaceholder="Search payments..."
      emptyMessage="No payments available"
      theme="blue"
      showActionColumn={true}
    />
  );
};

export default Payments;