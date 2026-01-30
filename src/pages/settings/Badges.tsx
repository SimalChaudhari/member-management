import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicDataGrid from 'components/table/DynamicDataGrid';
import { RootState } from 'store/Store';
import { badgesList } from 'store/action/BadgesAction';

const Badges = (): ReactElement => {
  const dispatch = useDispatch();
  const { badges } = useSelector((state: RootState) => state.badges);

  const handleDataLoad = () => {
    dispatch(badgesList() as any);
  };

  return (
    <DynamicDataGrid
      title="My Badges"
      data={badges?.data || []}
      columns={badges?.columns || []}
      onDataLoad={handleDataLoad}
      badgeFields={['ImageURL', 'badgeInfoURL']}
      pageSize={5}
      searchPlaceholder="Search badges..."
      emptyMessage="No badges found. You haven't earned any badges yet."
      theme="blue"
      showActionColumn={true}
    />
  );
};

export default Badges;