import React from "react";
import { Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import colorStyles from "../style/color.module.css";
import borderStyles from "../style/border.module.css";
import useStage from "../hook/useStage";
import useI18n from "../hook/usei18n";
import { StoreState } from "../redux/store";
import { useSelector } from "react-redux";

export type NavBarItemKind = {
  id: string;
  name: string;
  desc: string;
  icon?: string;
  "sub-button"?: NavBarItemKind[];
  "sub-input"?: NavBarItemKind[];
};

type NavBarButtonProps = {
  stage: ReturnType<typeof useStage>;
  onClick: () => void;
  data: NavBarItemKind;
};

const NavBarButton: React.FC<NavBarButtonProps> = ({ data, onClick }) => {
  const { getTranslation } = useI18n();
  const { currentTool } = useSelector((selector: StoreState) => selector.toolSelection);

  return (
    <ButtonGroup vertical>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id={`tooltip_navbar-id_${data.id}`}>{getTranslation("workMode", data.id, "desc")}</Tooltip>}
      >
        <button
          data-navbar-id={data.id}
          onClick={onClick}
          className={`${
            currentTool === data.id ? "tw-bg-contrast" : "tw-bg-secondary "
          } text-text tw-h-full tw-w-full tw-rounded-md tw-border-contrast/20 tw-p-1 tw-px-3 hover:tw-bg-contrast`}
  
          // className="text-text tw-bg-secondary tw-w-full tw-h-full tw-p-1 tw-px-3 tw-rounded-md tw-border-contrast/20 hover:tw-bg-contrast" 
          style={{ border: "1px solid" }}
        >
          {data.icon ? <i className={`bi-${data.icon} tw-text-text`} /> : getTranslation("hotkey", data.id, "name")}
        </button>
      </OverlayTrigger>
    </ButtonGroup>
  );
};

export default NavBarButton;
