import React, { ReactNode, useState, useEffect } from "react";
import { Button, ButtonGroup, Dropdown, Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { NavBarItemKind } from "./NavBarButton";
import colorStyles from "../style/color.module.css";
import fontStyles from "../style/font.module.css";
import borderStyles from "../style/border.module.css";
import positionStyles from "../style/position.module.css";
import sizeStyles from "../style/size.module.css";
import alignStyles from "../style/align.module.css";
import useStage from "../hook/useStage";
import { useDispatch, useSelector } from "react-redux";
import { ReactI18NextChild } from "react-i18next";
import { StoreState } from "../redux/store";

type NavBarDropdownButtonProps = {
  data: NavBarItemKind;
  dropdownData: ReactI18NextChild;
  onClick: () => void;
  stage: ReturnType<typeof useStage>;
};

const NavBarDropdownButton: React.FC<NavBarDropdownButtonProps> = ({ data, dropdownData, onClick }) => {
  const { currentTool } = useSelector((selector: StoreState) => selector.toolSelection);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (currentTool === "brush" || currentTool === "eraser") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [currentTool]);
  return (
    <ButtonGroup vertical>
      <Dropdown
        as={ButtonGroup}
        onClick={(e) => {
          setShow(!show);
          onClick();
        }}
        drop="end"
        show={show}
        data-navbar-id={data.id}
        variant={[" ", colorStyles.whiteTheme, borderStyles.colorGrey].join(" ")}
      >
        <Dropdown.Toggle as={CustomToggle} data={data} />
        <Dropdown.Menu className="tw-bg-secondary">
          {data["sub-button"] &&
            data["sub-button"].map((subData) => (
              <Dropdown.ItemText
                key={`navbar-${subData.id}`}
                data-navbar-id={subData.id}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                }}
                className={["d-inline"].join(" ")}
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

const CustomToggle = React.forwardRef<HTMLButtonElement, CustomToggleProps>(function CustomToggleItem(
  { children, onClick, data },
  ref
) {
  const { currentTool } = useSelector((selector: StoreState) => selector.toolSelection);
  return (
    <OverlayTrigger placement="right" overlay={<Tooltip id={`tooltip_navbar-id_${data.id}`}>{data.desc}</Tooltip>}>
      <button
        ref={ref}
        className={`${
          currentTool === "brush" ? "tw-bg-contrast" : "tw-bg-secondary "
        } text-text tw-h-full tw-w-full tw-rounded-md tw-border-contrast/20 tw-p-1 tw-px-3 hover:tw-bg-contrast`}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <i className={`bi-${data.icon} tw-text-text`} />
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
      </button>
    </OverlayTrigger>
  );
});
