import React, { useEffect, useState, Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { Box, Button, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ButtonNaked } from '@pagopa/mui-italia';
import { PaddedDrawer } from '../../../../../components/PaddedDrawer';
import { Taxonomy } from '../../../../../api/generated/portal/Taxonomy';
import { TaxonomyGroup } from '../../../../../api/generated/portal/TaxonomyGroup';
import { TaxonomyGroupArea } from '../../../../../api/generated/portal/TaxonomyGroupArea';
import { getTaxonomies, getTaxonomyGroups } from '../../../../../services/taxonomyService';
import { BundleTaxonomiesGroupButton } from './BundleTaxonomiesGroupButton';
import { BundleTaxonomiesCheckboxButton } from './BundleTaxonomiesCheckboxButton';

export interface BundleTaxonomiesDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  addAction: (taxonomies: Array<Taxonomy>) => void;
  addedTaxonomies: Array<string | undefined>;
}

const SkeletonGroup = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography pb={2} variant="overline" color="action.active">
        {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectServices')}
      </Typography>
      <Box pt={1} pb={1.5}>
        <Skeleton animation="wave" variant="rectangular" width={'50%'} height={'1vh'} />
      </Box>

      {[...Array(15)].map((_, index) => (
        <>
          <Box pb={0.5} key={`skeleton${index}-1`}>
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'} />
          </Box>
          <Box pb={1.5} key={`skeleton${index}-2`}>
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'} />
          </Box>
        </>
      ))}
    </>
  );
};
export const BundleTaxonomiesDrawer = ({
  openDrawer,
  setOpenDrawer,
  addAction,
  addedTaxonomies,
}: BundleTaxonomiesDrawerProps) => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>();
  const [taxonomies, setTaxonomies] = useState<Array<Taxonomy>>([]);
  const [selectedEC, setSelectedEC] = useState<TaxonomyGroup>();
  const [selectedMacroArea, setSelectedMacroArea] = useState<TaxonomyGroupArea>();
  const [step, setStep] = useState<number>(0);
  const [taxonomyGroups, setTaxonomyGroups] = useState<Array<TaxonomyGroup>>([]);
  const [checkedTaxonomies, setCheckedTaxonomies] = useState<Map<string, boolean>>(new Map());
  const checkedTaxonomiesCount = useMemo(
    () => Array.from(checkedTaxonomies.values()).filter((el) => el).length,
    [checkedTaxonomies]
  );
  const [showSearchError, setShowSearchError] = useState<boolean>(false);

  const handleBackButton = () => {
    deselectAll();
    setTaxonomies([]);
    if (step === 1) {
      setSelectedMacroArea(undefined);
      setSelectedEC(undefined);
      setStep(0);
    } else if (step === 2) {
      if (selectedEC) {
        setStep(1);
      } else {
        setStep(0);
        setSelectedEC(undefined);
      }
      setSelectedMacroArea(undefined);
      setSearchText(undefined);
      setShowSearchError(false);
    }
  };

  function setDefaultValues() {
    setSearchText(undefined);
    setSelectedEC(undefined);
    setSelectedMacroArea(undefined);
    deselectAll();
    setTaxonomies([]);
    setOpenDrawer(false);
    setStep(0);
    setLoading(false);
    setShowSearchError(false);
  }

  const handleAdd = () => {
    addAction(
      taxonomies.filter((taxonomy) => checkedTaxonomies.get(taxonomy.specific_built_in_data))
    );
    setDefaultValues();
  };

  const handleSelectEC = (item: TaxonomyGroup) => {
    setSelectedEC(item);
    setStep(1);
  };

  const handleSelectArea = (item: TaxonomyGroupArea) => {
    setSelectedMacroArea(item);
    setStep(2);
  };

  const handleSearchText = (value: string) => {
    setSearchText(value);
  };

  const handleTaxonomyCheck = (item: Taxonomy) => {
    setCheckedTaxonomies(
      (prev) =>
        new Map(prev.set(item.specific_built_in_data, !prev.get(item.specific_built_in_data)))
    );
  };

  const deselectAll = () => {
    setCheckedTaxonomies(new Map());
  };

  const selectAll = () => {
    setCheckedTaxonomies(
      taxonomies
        .filter((el) => !addedTaxonomies.includes(el.specific_built_in_data))
        .reduce((map, item) => new Map(map.set(item.specific_built_in_data, true)), new Map())
    );
  };

  useEffect(() => {
    getTaxonomyGroups()
      .then((data) => {
        if (data?.taxonomyGroups) {
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
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            'stationAssociateECPage.associationForm.errorMessageDelegatedEd'
          ),
          component: 'Toast',
        })
      )
      .finally(() => setLoading(false));
  }, []);

  function getTaxonomiesListByGroup() {
    setLoading(true);
    setStep(2);
    deselectAll();
    getTaxonomies(
      selectedEC?.ecTypeCode,
      selectedMacroArea?.macroAreaEcProgressive,
      searchText,
      true
    )
      .then((data) => {
        if (data?.taxonomies) {
          setTaxonomies([...data.taxonomies]);
          const map = new Map<string, boolean>();
          data.taxonomies.forEach((item) => map.set(item.specific_built_in_data, false));
          setCheckedTaxonomies(map);
          setShowSearchError(searchText && data.taxonomies.length === 0 ? true : false);
        }
      })
      .catch((reason) =>
        addError({
          id: 'GET_TAXONOMIES_LIST',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving taxonomy list`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            'stationAssociateECPage.associationForm.errorMessageDelegatedEd'
          ),
          component: 'Toast',
        })
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (selectedEC && selectedMacroArea) {
      getTaxonomiesListByGroup();
    }
  }, [selectedMacroArea]);

  useEffect(() => {
    if (searchText !== undefined) {
      const identifier = setTimeout(() => {
        if (searchText !== '' || (selectedEC && selectedMacroArea)) {
          getTaxonomiesListByGroup();
        } else {
          setStep(selectedEC ? 1 : 0);
          setSearchText(undefined);
          setShowSearchError(false);
        }
      }, 500);
      return () => {
        clearTimeout(identifier);
      };
    } else {
      return () => {};
    }
  }, [searchText]);

  const renderTaxonomiesList = () => {
    if (!showSearchError) {
      if (step === 0) {
        return (
          <>
            <Typography pb={2} variant="overline" color="action.active" data-testid="title-step0">
              {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectCI')}
            </Typography>
            {taxonomyGroups.map((item) => (
              <BundleTaxonomiesGroupButton
                key={item.ecTypeCode}
                title={item.ecType as string}
                action={() => handleSelectEC(item)}
              />
            ))}
          </>
        );
      } else if (step === 1) {
        return (
          <>
            <Typography pb={2} variant="overline" color="action.active" data-testid="title-step1">
              {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectArea')}
            </Typography>
            {selectedEC?.areas?.map((item) => (
              <BundleTaxonomiesGroupButton
                key={item.macroAreaEcProgressive}
                title={item.macroAreaName as string}
                action={() => handleSelectArea(item)}
              />
            ))}
          </>
        );
      } else if (step === 2 && taxonomies.length > 0) {
        return (
          <>
            <Typography pb={2} variant="overline" color="action.active" data-testid="title-step2">
              {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectServices')}
            </Typography>
            <div>
              <ButtonNaked
                size="large"
                component="button"
                onClick={() => (checkedTaxonomiesCount < 1 ? selectAll() : deselectAll())}
                sx={{ color: 'primary.main' }}
                weight="default"
                data-testid="toggle-all-bundle-taxonomies-test"
              >
                {t(
                  `commissionBundlesPage.addEditCommissionBundle.addTaxonomies.${
                    checkedTaxonomiesCount < 1 ? 'selectAll' : 'deselectAll'
                  }`
                )}
              </ButtonNaked>
            </div>
            {taxonomies?.map((item) => {
              const isAlreadyPresent = addedTaxonomies.includes(item.specific_built_in_data);
              return (
                <BundleTaxonomiesCheckboxButton
                  key={item.specific_built_in_data}
                  title={item.specific_built_in_data}
                  subtitle={item.service_type}
                  checked={checkedTaxonomies?.get(item.specific_built_in_data) || isAlreadyPresent}
                  disabled={isAlreadyPresent}
                  action={() => handleTaxonomyCheck(item)}
                />
              );
            })}
          </>
        );
      }
    }

    return null;
  };

  function handleOnClose() {
    setDefaultValues();
    setOpenDrawer(false);
  }

  return (
    <PaddedDrawer
      openDrawer={openDrawer}
      setOpenDrawer={setOpenDrawer}
      hasBackButton={step !== 0}
      backButtonAction={(_) => handleBackButton()}
      onClose={() => handleOnClose()}
      drawerButtons={
        step === 2 &&
        taxonomies.length > 0 && (
          <Button
            fullWidth
            onClick={(_) => handleAdd()}
            disabled={!checkedTaxonomiesCount}
            color="primary"
            variant="contained"
            data-testid="taxonomies-add-button-test"
          >
            {t('general.add')}
            {checkedTaxonomiesCount > 0 && ` (${checkedTaxonomiesCount})`}
          </Button>
        )
      }
    >
      <TitleBox
        title={t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueTitle')}
        variantTitle="h4"
      />
      <Typography variant="body2" mb={2}>
        {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.catalogueSubtitle')}
      </Typography>
      <TextField
        fullWidth
        value={searchText ?? ''}
        id="catalogue-filter"
        name="catalogue-filter"
        onChange={(e) => handleSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
        label={t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.filterTitle')}
        error={showSearchError}
        helperText={
          showSearchError &&
          t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.missingSearchData')
        }
        inputProps={{ 'data-testid': 'catalogue-filter' }}
        sx={{ paddingBottom: 3 }}
      />
      {loading ? <SkeletonGroup /> : renderTaxonomiesList()}
    </PaddedDrawer>
  );
};

export default BundleTaxonomiesDrawer;
