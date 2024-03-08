/* eslint-disable sonarjs/cognitive-complexity */
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
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
import { Taxonomy } from '../../../../api/generated/portal/Taxonomy';
import { TaxonomyGroup } from '../../../../api/generated/portal/TaxonomyGroup';
import { TaxonomyGroupArea } from '../../../../api/generated/portal/TaxonomyGroupArea';
import { TaxonomyGroups } from '../../../../api/generated/portal/TaxonomyGroups';
import {
  getTaxonomies,
  getTaxonomyGroups,
} from '../../../../services/taxonomyService';
import {
  BundleTaxonomiesGroupButton,
} from './BundleTaxonomiesGroupButton';

const AddEditCommissionBundleTaxonomies = (formik: FormikProps<BundleRequest>) => {
  const { t } = useTranslation();
  // const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [loading, setLoading] = useState(false);
  const [taxonomies, setTaxonomies] = useState<Array<Taxonomy>>([]);
  const [selectedEC, setSelectedEC] = useState<TaxonomyGroup>();
  const [selectedMacroArea, setSelectedMacroArea] = useState<TaxonomyGroupArea>();
  const [taxonomyGroups, setTaxonomyGroups] = useState<Array<TaxonomyGroup>>([]);

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSelect = (file: File) => {
    setFile(file);
  };
  const handleRemove = () => {
    setFile(null);
  };

  const handleSelectEC = (item: TaxonomyGroup) => {
    setSelectedEC(item);
  };

  const handleSelectArea = (item: TaxonomyGroupArea) => {
    setSelectedMacroArea(item);
  };

  const addTransferCategoryItem = async () => {
    if (formik.values.transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList, ''];
      formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  useEffect(() => {
      setLoading(true);
      getTaxonomyGroups()
          .then((data) => {
              if (data && data.taxonomyGroups) {
                  setTaxonomyGroups([...data.taxonomyGroups]);
              }
          })
          .catch((reason) =>
              addError({
                  id: 'GET_TAXONOMY_GROUP_LIST',
                  blocking: false,
                  error: reason,
                  techDescription: `An error occurred while retrieving taxonomy groups list`,
                  toNotify: true,
                  displayableTitle: t('addEditCommissionBundle.associationForm.errorMessageTitle'),
                  displayableDescription: t(
                      'stationAssociateECPage.associationForm.errorMessageDelegatedEd'
                  ),
                  component: 'Toast',
              })
          )
          .finally(() => setLoading(false));

      setLoading(false);
  }, []);

  useEffect(() => {
      setLoading(true);
      getTaxonomies(selectedEC?.ecTypeCode, selectedMacroArea?.macroAreaEcProgressive, "", true)
          .then((data) => {
              if (data && data.taxonomies) {
                  setTaxonomies([...data.taxonomies]);
              }
          })
          .catch((reason) =>
              addError({
                  id: 'GET_TAXONOMIES_LIST',
                  blocking: false,
                  error: reason,
                  techDescription: `An error occurred while retrieving taxonomy list`,
                  toNotify: true,
                  displayableTitle: t('addEditCommissionBundle.associationForm.errorMessageTitle'),
                  displayableDescription: t(
                      'stationAssociateECPage.associationForm.errorMessageDelegatedEd'
                  ),
                  component: 'Toast',
              })
          )
          .finally(() => setLoading(false));

      setLoading(false);
  }, [selectedMacroArea]);

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
        ) :
        !selectedEC ? (
            <React.Fragment>
                <Typography pt={3} pb={3} ml={'10px'} lineHeight={1.3} fontWeight={'fontWeightMedium'}>
                    {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueTitle')}
                </Typography>
                {taxonomyGroups.map((item) => (
                    <BundleTaxonomiesGroupButton
                      key={item.ecTypeCode}
                      title={item.ecType as string}
                      action={() => handleSelectEC(item)}
                      maxCharactersNumberMultiLine={100}
                    />
                ))}
            </React.Fragment>
        ) :
        !selectedMacroArea ? (
            <React.Fragment>
                <Typography pt={3} pb={3} ml={'10px'} lineHeight={1.3} fontWeight={'fontWeightMedium'}>
                    {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueTitle')}
                </Typography>
                {selectedEC.areas?.map((item) => (
                    <BundleTaxonomiesGroupButton
                      key={item.macroAreaEcProgressive}
                      title={item.macroAreaName as string}
                      action={() => handleSelectArea(item)}
                      maxCharactersNumberMultiLine={100}
                    />
                ))}
            </React.Fragment>
        ) : (
            <React.Fragment>
                <Typography pt={3} pb={3} ml={'10px'} lineHeight={1.3} fontWeight={'fontWeightMedium'}>
                    {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueTitle')}
                </Typography>
                {taxonomies?.map((item) => (
                    <BundleTaxonomiesGroupButton
                      key={item.specific_built_in_data}
                      title={item.specific_built_in_data as string}
                      action={() => handleSelectArea(item)}
                      maxCharactersNumberMultiLine={100}
                    />
                ))}
            </React.Fragment>
        )}
      </PaddedDrawer>
    </Paper>
  );
};

export default AddEditCommissionBundleTaxonomies;
