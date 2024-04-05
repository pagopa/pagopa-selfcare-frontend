import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import DelegationsTable from '../delegations/list/DelegationsTable';
import TableSearchBar from '../../components/Table/TableSearchBar';
import PaymentsReceiptsTable from './list/PaymentsReceiptsTable';

export default function PaymentsReceiptsPage() {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>("");

  return (
    <SideMenuLayout>
        <TitleBox
          title={t('paymentsReceiptsPage.title')}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
      <TableSearchBar setSearchInput={setSearchInput} componentName='paymentsReceiptsPage'/>
      <PaymentsReceiptsTable filterInput={searchInput} />
    </SideMenuLayout>
  );
}
