"use client";

import React from "react";

import { Typography, Box, Tooltip, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { ArrowForwardIos } from '@mui/icons-material';

import {theme} from '@pagopa/mui-italia';

export interface BundleTaxonomiesCheckboxButtonProps {
  selectedItem?: boolean;
  /* The name to show  */
  title: string;
  subtitle?: string;
  action?: React.Dispatch<React.ChangeEvent<HTMLInputElement>>;
  disabled?: boolean;
  checked?: boolean;
  /* Slot available for custom state components. E.g: Tag with action */
  endSlot?: JSX.Element | Array<JSX.Element> | undefined;
  /* The number of characters beyond which the multiLine is applied */
  maxCharactersNumberMultiLine?: number;
}

export const BundleTaxonomiesCheckboxButton = ({
  title,
  subtitle,
  selectedItem,
  action,
  checked,
  disabled,
  endSlot,
  maxCharactersNumberMultiLine = 50,
}: BundleTaxonomiesCheckboxButtonProps) => {
  const maxCharacter =
    title && title.length > maxCharactersNumberMultiLine;
  const truncatedText = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as const,
    width: "100%",
    whiteSpace: "normal" as const,
  };
  return (
    <Box
      sx={{
        p: 1.5,
        width: "100%",
        backgroundColor: "background.paper",
        color: "text.primary",
        transitionProperty: "background-color",
        transitionDuration: `${theme.transitions.duration.short}ms`,
        userSelect: "none",
        boxSizing: "border-box",
        ...(!disabled && {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        ...(selectedItem && {
          boxShadow: `inset 2px 0 0 0 ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.primaryAction.selected,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primaryAction.hover,
          },
        }),
      }}
      role="button"
      tabIndex={0}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>

        <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={action}
                />
              }
              label={''}
            />
        </Box>

        {/* Info Container */}
        <Box
          sx={{
            ml: 1.25,
            alignSelf: "center",
            userSelect: "text",
            ...(disabled && {
              opacity: theme.palette.action.disabledOpacity,
              userSelect: "none",
            }),
          }}
        >
            <Tooltip arrow title={maxCharacter ? title : ""}>
              <Box>
                  <Typography
                    variant="body1"
                    component="h6"
                    color="inherit"
                    sx={{
                      fontWeight: theme.typography.fontWeightBold,
                      lineHeight: 1.25,
                      ...(maxCharacter && {
                        ...truncatedText,
                        WebkitLineClamp: 2,
                      }),
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {subtitle ?? ''}
                  </Typography>
              </Box>
            </Tooltip>

        </Box>
        {endSlot && (
          <Box
            sx={{ display: "flex", alignItems: "center", ml: "auto", pl: 1.25 }}
          >
            {endSlot}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BundleTaxonomiesCheckboxButton;
