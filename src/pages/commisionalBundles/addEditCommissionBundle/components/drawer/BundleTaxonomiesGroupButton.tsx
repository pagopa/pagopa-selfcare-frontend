"use client";

import React from "react";

import { Typography, Box, Tooltip, IconButton } from "@mui/material";
import { ArrowForwardIos } from '@mui/icons-material';

import {theme} from '@pagopa/mui-italia';

export interface BundleTaxonomiesGroupButtonProps {
  selectedItem?: boolean;
  /* The name to show  */
  title: string;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
  disabled?: boolean;
  /* Slot available for custom state components. E.g: Tag with action */
  endSlot?: JSX.Element | Array<JSX.Element> | undefined;
  /* The number of characters beyond which the multiLine is applied */
  maxCharactersNumberMultiLine?: number;
}

export const BundleTaxonomiesGroupButton = ({
  title,
  selectedItem,
  action,
  disabled,
  endSlot,
  maxCharactersNumberMultiLine = 50,
}: BundleTaxonomiesGroupButtonProps) => {
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
      onClick={action}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
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
            </Tooltip>

        </Box>
        <Box
            display="flex"
            justifyContent="flex-end"
            width="100%"
            mr={2}
        >
          <IconButton
            sx={{
              width: '100%',
              '&:hover': { backgroundColor: 'transparent !important' },
            }}
          >
            <ArrowForwardIos sx={{ color: 'primary.main', fontSize: '24px' }} />
          </IconButton>
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