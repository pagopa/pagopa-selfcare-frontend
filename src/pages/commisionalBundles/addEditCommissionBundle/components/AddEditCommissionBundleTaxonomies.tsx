/* eslint-disable sonarjs/cognitive-complexity */
import { FormikProps } from 'formik';
import Papa from 'papaparse';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Link, Paper, Typography, Alert, AlertTitle } from '@mui/material';
import { SingleFileInput } from '@pagopa/mui-italia';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { BundleRequest } from '../../../../api/generated/portal/BundleRequest';
import { Taxonomy } from '../../../../api/generated/portal/Taxonomy';
import GenericModal from '../../../../components/Form/GenericModal';
import { BundleTaxonomiesTable } from './BundleTaxonomiesTable';
import { BundleTaxonomiesDrawer } from './drawer/BundleTaxonomiesDrawer';

export interface TaxonomyToRemove {
  taxonomy: string;
  area: string;
}

type Props = {
  formik: FormikProps<BundleRequest>;
  bundleTaxonomies: Array<Taxonomy>;
};

const reduceTaxonomies = (taxonomies: Array<Taxonomy>) =>
  taxonomies.reduce((result: any, taxonomy: any) => {
    const macro_area_name = taxonomy.macro_area_name;
    const newResult: any = {
      ...result,
      ...{ [macro_area_name]: result[macro_area_name] ? result[macro_area_name] : [] },
    };
    newResult[macro_area_name].push(taxonomy);
    return newResult;
  }, {});

const AddEditCommissionBundleTaxonomies = ({ bundleTaxonomies, formik }: Props) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [areaToRemove, setAreaToRemove] = useState<string>();
  const [taxonomyToRemove, setTaxonomyToRemove] = useState<TaxonomyToRemove>();
  const [taxonomies, setTaxonomies] = useState<Array<any>>(
    bundleTaxonomies && bundleTaxonomies.length > 0 ? bundleTaxonomies : []
  );
  const [taxonomyTableData, setTaxonomyTableData] = useState<any>(
    bundleTaxonomies && bundleTaxonomies.length > 0 ? reduceTaxonomies(bundleTaxonomies) : undefined
  );
  const [alertData, setAlertData] = useState<any>();

  const handleSelect = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    // eslint-disable-next-line
    reader.onload = async ({ target }: any) => {
      const csv = Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
      });
      // eslint-disable-next-line functional/no-let
      let errorParsing = 0;
      const parsedData = csv?.data
        ?.filter((el: any) => {
          if (el.specific_built_in_data) {
            return true;
          } else {
            errorParsing += 1;
            return false;
          }
        })
        ?.map((item: any) => ({ ...item, fromFile: true }));
      await handleAddFromDrawer(parsedData);
      if (csv?.errors?.length === csv?.data?.length || errorParsing === csv?.data?.length) {
        setAlertData({
          type: 'error',
          message: t(
            'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.alert.errorMessage'
          ),
        });
      } else if (csv?.errors.length > 0 || errorParsing) {
        setAlertData({
          type: 'warning',
          message: t(
            'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.alert.warningMessage',
            {
              count: csv?.errors.length + errorParsing,
              total: csv?.errors.length + csv?.data.length,
            }
          ),
        });
      } else {
        setAlertData({
          type: 'success',
          message: t(
            'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.alert.successMessage',
            { count: csv?.data.length }
          ),
        });
      }
    };
    reader.readAsText(file);
  };
  const handleRemove = () => {
    setFile(null);
    const taxonomyToRemove = taxonomies
      .filter((item) => item.fromFile)
      .map((item) => item.specific_built_in_data);
    const filteredTaxonomies = taxonomies.filter((item) => item.fromFile === undefined);
    setTaxonomies(filteredTaxonomies);
    updateTableData(filteredTaxonomies);
    deleteTransferCategoryItem(taxonomyToRemove);
  };

  const handleAddFromDrawer = async (taxonomiesToAdd: Array<any>) => {
    const filteredTaxonomies = taxonomiesToAdd.filter(
      (taxonomy) => !taxonomies.includes(taxonomy.specific_built_in_data)
    );
    const newTaxonomyList = [...taxonomies.values(), ...filteredTaxonomies];
    setTaxonomies(newTaxonomyList);
    updateTableData(newTaxonomyList);
    addTransferCategoryItem(newTaxonomyList.map((taxonomy) => taxonomy.specific_built_in_data));
  };

  const updateTableData = (taxonomies: Array<Taxonomy>) => {
    setTaxonomyTableData(reduceTaxonomies(taxonomies));
  };

  const addTransferCategoryItem = (transferCategoryList: Array<string>) => {
    if (formik.values.transferCategoryList && transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList, ...transferCategoryList];
      formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  const deleteTransferCategoryItem = (elementsToFilter: Array<string>) => {
    if (formik.values.transferCategoryList && elementsToFilter) {
      const newArr = formik.values.transferCategoryList.filter(
        (item) => !elementsToFilter.includes(item)
      );
      formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  const openAreaModalAction = (area: string) => {
    setAreaToRemove(area);
  };

  const openTaxonomyModalAction = (data: TaxonomyToRemove) => {
    setTaxonomyToRemove(data);
  };

  const deleteArea = (area: string | undefined) => {
    if (area !== undefined) {
      const taxonomiesToFilter = taxonomyTableData[area].map(
        (item: Taxonomy) => item.specific_built_in_data
      );
      const { [area]: _, ...filtered } = taxonomyTableData;
      setTaxonomyTableData({ ...filtered });
      setTaxonomies(
        taxonomies.filter((item) => !taxonomiesToFilter.includes(item.specific_built_in_data))
      );
      deleteTransferCategoryItem(taxonomiesToFilter);
    }
  };

  const deleteTaxonomy = (data: TaxonomyToRemove | undefined) => {
    if (data !== undefined) {
      const filteredTaxonomies = taxonomies.filter(
        (item) => item.specific_built_in_data !== data?.taxonomy
      );
      setTaxonomies(filteredTaxonomies);
      updateTableData(filteredTaxonomies);
      deleteTransferCategoryItem(data !== undefined ? [data.taxonomy] : []);
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
      {alertData && (
        <Alert
          severity={alertData.type}
          data-testid="alert-success-test"
          onClose={() => {
            setAlertData(null);
          }}
        >
          <AlertTitle>
            {' '}
            {alertData.type === 'success'
              ? t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.alert.successTitle')
              : alertData.type === 'warning'
              ? t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.alert.warnTitle')
              : alertData.type === 'error'
              ? t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.alert.errorTitle')
              : ''}
          </AlertTitle>
          {alertData.message}
        </Alert>
      )}
      <SingleFileInput
        value={file}
        accept={['.csv']}
        onFileSelected={handleSelect}
        onFileRemoved={handleRemove}
        dropzoneLabel={t(
          'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.dropFileText'
        )}
        rejectedLabel={t(
          'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.rejectedFile'
        )}
      />

      {(file === undefined || file === null) && (
        <React.Fragment>
          <Typography variant="body1" mb={1} mt={1}>
            {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.dontKnowHow')}
            <a
              href={process.env.PUBLIC_URL + '/file/taxonomiesExample.csv'}
              download="taxonomiesExample.csv"
            >
              {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.downloadExample')}{' '}
            </a>
          </Typography>
        </React.Fragment>
      )}

      {taxonomyTableData && Object.keys(taxonomyTableData).length > 0 && (
        <BundleTaxonomiesTable
          tableData={taxonomyTableData}
          deleteAreaAction={openAreaModalAction}
          deleteTaxonomyAction={openTaxonomyModalAction}
        />
      )}

      <BundleTaxonomiesDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        addAction={handleAddFromDrawer}
      />

      <GenericModal
        title={t(
          'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.removeAreaModal.title'
        )}
        message={t(
          `commissionBundlesPage.addEditCommissionBundle.addTaxonomies.removeAreaModal.message`
        )}
        openModal={areaToRemove !== undefined && areaToRemove !== null}
        onConfirmLabel={t('general.confirm')}
        onCloseLabel={t('general.cancel')}
        handleCloseModal={() => setAreaToRemove(undefined)}
        handleConfirm={async () => {
          deleteArea(areaToRemove);
          setAreaToRemove(undefined);
        }}
      />

      <GenericModal
        title={t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.removeModal.title')}
        message={t(
          `commissionBundlesPage.addEditCommissionBundle.addTaxonomies.removeModal.message`
        )}
        openModal={taxonomyToRemove !== undefined && taxonomyToRemove !== null}
        onConfirmLabel={t('general.confirm')}
        onCloseLabel={t('general.cancel')}
        handleCloseModal={() => setTaxonomyToRemove(undefined)}
        handleConfirm={async () => {
          deleteTaxonomy(taxonomyToRemove);
          setTaxonomyToRemove(undefined);
        }}
      />
    </Paper>
  );
};

export default AddEditCommissionBundleTaxonomies;
