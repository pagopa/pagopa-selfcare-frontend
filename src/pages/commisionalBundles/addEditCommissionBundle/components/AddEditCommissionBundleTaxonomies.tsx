/* eslint-disable sonarjs/cognitive-complexity */
import { FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InputAdornment, Link, Paper, TextField, Typography } from '@mui/material';
import { SingleFileInput } from '@pagopa/mui-italia';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS } from '../../../../utils/constants';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { BundleRequest } from '../../../../api/generated/portal/BundleRequest';
import { PaddedDrawer } from '../../../../components/PaddedDrawer';
import { TaxonomyGroup } from '../../../../api/generated/portal/TaxonomyGroup';

type Props = {
  formik: FormikProps<BundleRequest>;
  taxonomyGroups: Array<TaxonomyGroup>;
};

const AddEditCommissionBundleTaxonomies = ({ taxonomyGroups, formik }: Props) => {
  const { t } = useTranslation();
  // const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [loading, setLoading] = useState(false);
  const [selectedEC, setSelectedEC] = useState('');
  const [selectedMacroArea, setSelectedMacroArea] = useState('');

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const handleSelect = (file: File) => {
    setFile(file);
  };
  const handleRemove = () => {
    setFile(null);
  };

  const addTransferCategoryItem = async () => {
    if (formik.values.transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList, ''];
      formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  const deleteTransferCategoryItem = async (index: number) => {
    if (formik.values.transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList];
      if (index > -1 && index < formik.values.transferCategoryList.length) {
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
      }
      formik.setFieldValue('transferCategoryList', newArr);
    }
  };
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        p: 3,
        minWidth: '100%',
        mb: 4,
      }}
    >
      <Typography variant="h6" mb={1}>
        {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
      </Typography>
      <Typography variant="body1" mb={1}>
        {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.subTitle')}
      </Typography>
      <Typography variant="body1" mb={2} sx={{ textDecoration: 'underline', fontWeight: 'medium' }}>
        {/* TODO ADD LINK TO MANUAL */}
        <Link href="https://www.pagopa.gov.it/" target="_blank">
          {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.manualHelp')}
        </Link>
      </Typography>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpenDrawer(true)}
        data-testid="open-taxonomies-drawer"
        sx={{ mb: 2 }}
      >
        <ListAltIcon sx={{ pr: 1 }} />
        {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueButton')}
      </Button>
      <SingleFileInput
        value={file}
        // TODO ADD FILE TYPE RESTRICTION
        onFileSelected={handleSelect}
        onFileRemoved={handleRemove}
        dropzoneLabel={t(
          'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.dropFileText'
        )}
        rejectedLabel={t(
          'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.rejectedFile'
        )}
      />
      <PaddedDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
        <TitleBox
          title={t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueTitle')}
          variantTitle="h5"
        />
        <Typography variant="body1" mb={2}>
          {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueSubtitle')}
        </Typography>
        <TextField
          fullWidth
          id="catalogue-filter"
          name="catalogue-filter"
          onChange={(e) => console.log('TODO HANDLE CHANGE', e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
          label={t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.filterTitle')}
          inputProps={{ 'data-testid': 'catalogue-filter' }}
        />
        {loading ? (
          <div>loading</div>
        ) : !selectedEC ? (
          <div>EC list</div>
        ) : !selectedMacroArea ? (
          <div>MacroArea</div>
        ) : (
          <div>Taxonomy list</div>
        )}
      </PaddedDrawer>
    </Paper>
  );
};

export default AddEditCommissionBundleTaxonomies;
