"use client";

import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';

import { Button, InputAdornment, Link, Paper, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import {theme, ButtonNaked} from '@pagopa/mui-italia';

import { PaddedDrawer } from '../../../../../components/PaddedDrawer';
import { Taxonomy } from '../../../../../api/generated/portal/Taxonomy';
import { TaxonomyGroup } from '../../../../../api/generated/portal/TaxonomyGroup';
import { TaxonomyGroupArea } from '../../../../../api/generated/portal/TaxonomyGroupArea';
import { TaxonomyGroups } from '../../../../../api/generated/portal/TaxonomyGroups';

import {
  getTaxonomies,
  getTaxonomyGroups,
} from '../../../../../services/taxonomyService';
import {
  BundleTaxonomiesGroupButton,
} from './BundleTaxonomiesGroupButton';
import {
  BundleTaxonomiesCheckboxButton,
} from './BundleTaxonomiesCheckboxButton';


export interface BundleTaxonomiesDrawerProps {
    openDrawer: boolean;
    setOpenDrawer: Dispatch<SetStateAction<boolean>>;
    addAction: (taxonomies: Array<Taxonomy>) => void;
}

export const BundleTaxonomiesDrawer= ({
    openDrawer, setOpenDrawer, addAction
}: BundleTaxonomiesDrawerProps) => {
  const { t } = useTranslation();
  // const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS);
  const addError = useErrorDispatcher();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>();
  const [taxonomies, setTaxonomies] = useState<Array<Taxonomy>>([]);
  const [selectedEC, setSelectedEC] = useState<TaxonomyGroup>();
  const [selectedMacroArea, setSelectedMacroArea] = useState<TaxonomyGroupArea>();
  const [taxonomyGroups, setTaxonomyGroups] = useState<Array<TaxonomyGroup>>([]);
  const [checkedTaxonomies, setCheckedTaxonomies] = useState<Map<string,boolean>>(new Map());
  const [checkedTaxonomiesCount, setCheckedTaxonomiesCount] = useState<any>(0);

  const handleBackButton = () => {
     if (searchText !== undefined) {
        setSearchText(undefined);
        setCheckedTaxonomies(new Map());
        setTaxonomies([]);
     }
     else if (selectedMacroArea !== undefined) {
        setSelectedMacroArea(undefined);
        setCheckedTaxonomies(new Map());
        setTaxonomies([]);
     } else if (selectedEC !== undefined) {
        setSelectedEC(undefined);
     }
  };

  const handleAdd = () => {
    addAction(taxonomies.filter(taxonomy => checkedTaxonomies.get(taxonomy.specific_built_in_data)));
    setSearchText(undefined);
    setSelectedEC(undefined);
    setSelectedMacroArea(undefined);
    setCheckedTaxonomies(new Map());
    setTaxonomies([]);
    setOpenDrawer(false);
  };

  const handleSelectEC = (item: TaxonomyGroup) => {
    setSelectedEC(item);
  };

  const handleSelectArea = (item: TaxonomyGroupArea) => {
    setSelectedMacroArea(item);
  };

  const handleSearchText = (item: string) => {
    setSearchText(item);
  };

  const handleTaxonomyCheck = (item: Taxonomy) => {
    setCheckedTaxonomies(new Map(checkedTaxonomies.set(
        item.specific_built_in_data,
        !checkedTaxonomies.get(item.specific_built_in_data))));
    setCheckedTaxonomiesCount(taxonomies.filter(taxonomy =>
     checkedTaxonomies.get(taxonomy.specific_built_in_data)));
  };

  const deselectAll = () => {
    setCheckedTaxonomies(new Map());
    setCheckedTaxonomiesCount(0);
  };

  const selectAll = () => {
    setCheckedTaxonomies(taxonomies.reduce((map, item) =>
        new Map(map.set(item.specific_built_in_data,true)), new Map()));
    setCheckedTaxonomiesCount(taxonomies.length);
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
        if ((selectedEC && selectedMacroArea) || (searchText && searchText.length > 3)) {
            setLoading(true);
            getTaxonomies(selectedEC?.ecTypeCode, selectedMacroArea?.macroAreaEcProgressive, searchText, true)
                .then((data) => {
                    if (data && data.taxonomies) {
                        setTaxonomies([...data.taxonomies]);
                        const map = new Map<string, boolean>();
                        data.taxonomies.forEach(item => map.set(item.specific_built_in_data, false));
                        setCheckedTaxonomies(map);
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
       }
    }, [selectedMacroArea, searchText]);

  return (
      <PaddedDrawer
        openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}
        hasBackButton={(selectedEC || selectedMacroArea || taxonomies.length > 0) ? true: false}
        backButtonAction = {e => handleBackButton()}
      >
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
          inputProps={{ 'data-testid': 'catalogue-filter' }}
        />
        {loading ? (
          <div>loading</div>
        ) :
        (!selectedEC && taxonomies.length === 0) ? (
            <React.Fragment>
                <Typography pt={3} pb={3} ml={'10px'} lineHeight={1.3} fontWeight={'fontWeightMedium'}>
                    {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectCI')}
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
        (!selectedMacroArea && taxonomies.length === 0) ? (
            <React.Fragment>
                <Typography pt={3} pb={3} ml={'10px'} lineHeight={1.3} fontWeight={'fontWeightMedium'}>
                    {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectArea')}
                </Typography>
                {selectedEC?.areas?.map((item) => (
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
                    {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectServices')}
                </Typography>
                {checkedTaxonomiesCount < 1 ?
                (<ButtonNaked
                  size="large"
                  component="button"
                  onClick={() => selectAll()}
                  sx={{ color: 'primary.main', mt: 'auto', justifyContent: 'start' }}
                  weight="default"
                  data-testid="add-all-bundle-taxonomies-test"
                >
                  {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.selectAll')}
                </ButtonNaked>) :
                (<ButtonNaked
                           size="large"
                           component="button"
                           onClick={() => deselectAll()}
                           sx={{ color: 'primary.main', mt: 'auto', justifyContent: 'start' }}
                           weight="default"
                           data-testid="remove-all-bundle-taxonomies-test"
                         >
                           {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.deselectAll')}
                         </ButtonNaked>)
                }
                {taxonomies?.map((item) => (
                    <BundleTaxonomiesCheckboxButton
                      key={item.specific_built_in_data}
                      title={item.specific_built_in_data as string}
                      checked={checkedTaxonomies?.get(item.specific_built_in_data)}
                      action={() => handleTaxonomyCheck(item)}
                      maxCharactersNumberMultiLine={100}
                    />
                ))}
                <Button
                  fullWidth
                  onClick={(e) => handleAdd()}
                  disabled={!(Array.from(checkedTaxonomies?.values())
                                .some(itemCheck => itemCheck === true))}
                  color="primary"
                  variant="contained"
                  data-testid="taxonomies-add-button-test"
                >
                  {t('general.add')}
                </Button>
            </React.Fragment>
        )}
      </PaddedDrawer>
  );
};