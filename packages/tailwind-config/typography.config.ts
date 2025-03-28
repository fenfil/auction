const typographyConfig = (theme: (path: string) => string) => {
  return {
    DEFAULT: {
      css: {
        ":first-child": {
          marginTop: theme("margin.0"),
        },
        code: {
          "&::before, &::after": {
            display: "none",
          },
        },
        pre: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme("colors.gray.200"),
        },
      },
    },
    invert: {
      css: {
        table: {
          boxShadow: `0 0 0 1px ${theme("colors.gray.700")}`,
          th: {
            backgroundColor: theme("colors.gray.800"),
            "&:not(:last-child)": {
              borderRightColor: theme("colors.gray.700"),
            },
          },
          "tbody td, tfoot td": {
            "&:not(:last-child)": {
              borderRightColor: theme("colors.gray.700"),
            },
          },
        },
        pre: {
          borderColor: theme("colors.gray.800"),
        },
      },
    },
  };
};

export default typographyConfig;
