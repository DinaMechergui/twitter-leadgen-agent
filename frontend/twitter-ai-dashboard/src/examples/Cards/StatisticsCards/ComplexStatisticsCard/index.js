/* eslint-disable */
/* prettier-ignore */
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";

function ComplexStatisticsCard({
  color,
  icon,
  title,
  count,
  percentage,
  children,
}) {
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {title}
          </MDTypography>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      {children && (
        <MDBox pb={2} px={2}>
          {children}
        </MDBox>
      )}
      {percentage && (
        <MDBox pb={2} px={2}>
          <MDTypography
            component="p"
            variant="button"
            color="text"
            display="flex"
          >
            <MDTypography
              component="span"
              variant="button"
              fontWeight="bold"
              color={percentage.color}
            >
              {percentage.amount}
            </MDTypography>
            &nbsp;{percentage.label}
          </MDTypography>
        </MDBox>
      )}
    </Card>
  );
}

// Définir les types des props
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: null,
  children: null,
};

ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    label: PropTypes.string.isRequired,
  }),
  children: PropTypes.node,
};

export default ComplexStatisticsCard;
