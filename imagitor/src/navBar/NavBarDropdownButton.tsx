import React, { ReactNode } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { NavBarItemKind } from "./NavBarButton";
import colorStyles from "../style/color.module.css";
import fontStyles from "../style/font.module.css";
import borderStyles from "../style/border.module.css";
import positionStyles from "../style/position.module.css";
import sizeStyles from "../style/size.module.css";
import alignStyles from "../style/align.module.css";
import useStage from "../hook/useStage";
import { useDispatch } from "react-redux";
import { ReactI18NextChild } from "react-i18next";

type NavBarDropdownButtonProps = {
  data: NavBarItemKind;
  dropdownData: ReactI18NextChild;
  onClick: () => void;
  stage: ReturnType<typeof useStage>;
};

const NavBarDropdownButton: React.FC<NavBarDropdownButtonProps> = ({
  data,
  dropdownData,
  onClick,
}) => {
  return (
    <ButtonGroup vertical>
      <Dropdown
        as={ButtonGroup}
        onClick={onClick}
        drop="end"
        data-navbar-id={data.id}
        variant={[" ", colorStyles.whiteTheme, borderStyles.colorGrey].join(
          " "
        )}
      >
        <Dropdown.Toggle as={CustomToggle} data={data} />
        <Dropdown.Menu className="">
          {data["sub-button"]
            && data["sub-button"].map((subData) => (
              <Dropdown.ItemText
                key={`navbar-${subData.id}`}
                data-navbar-id={subData.id}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                }}
                className={[colorStyles.whiteTheme, "d-inline"].join(" ")}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    padding: "5px",
                  }}
                >
                  {dropdownData}
                </div>
              </Dropdown.ItemText>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  );
};

export default NavBarDropdownButton;

type CustomToggleProps = {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  data: NavBarItemKind;
};

const CustomToggle = React.forwardRef<HTMLButtonElement, CustomToggleProps>(
  function CustomToggleItem({ children, onClick, data }, ref) {
    return (
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip id={`tooltip_navbar-id_${data.id}`}>{data.desc}</Tooltip>
        }
      >
        <Button
          ref={ref}
          className={[colorStyles.whiteTheme, positionStyles.relative].join(
            " "
          )}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
          <i className={`bi-${data.icon}`} />
          <i
            className={[
              "bi-three-dots-vertical",
              fontStyles.fontHalf1em,
              positionStyles.absolute,
              positionStyles.right0,
              positionStyles.verticalCenter,
            ].join(" ")}
          >
            {children}
          </i>
        </Button>
      </OverlayTrigger>
    );
  }
);
