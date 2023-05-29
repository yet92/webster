import React from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../redux/store";
import { SettingBarProps } from "../settingBar";
import ExportWidget from "../settingBar/widgetList/ExportWidget";
import useI18n from "../hook/usei18n";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type HeaderProps = {
  data: SettingBarProps;
};

const Header: React.FC<HeaderProps> = ({ data }) => {
  const {
    stageDataList,
    auth: { me },
  } = useSelector((selector: StoreState) => selector);
  const { setLanguage, currentLanguage } = useI18n();

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === "en" ? "ua" : "en";
    setLanguage(newLanguage);
  };
  return (
    <header>
      <div className="p-2 tw-flex tw-w-full tw-flex-row tw-items-center tw-justify-between tw-gap-5 tw-rounded-xl tw-bg-secondary">
        <span className="tw-text-2xl tw-font-bold tw-text-text">WEBSTER</span>
        <span className="tw-text-2xl tw-font-bold tw-text-contrast">{stageDataList.ids[0]}</span>
        <div className="tw-flex tw-flex-row tw-gap-7 tw-text-text">
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip_navbar-id}`}>Switch language</Tooltip>}>
            <div
              className="tw-flex tw-cursor-pointer tw-flex-row tw-items-center tw-justify-center"
              onClick={handleLanguageChange}
            >
              <span className={`${currentLanguage === "en" && "tw-text-contrast"}`}>en</span>/
              <span className={`${currentLanguage === "ua" && "tw-text-contrast"}`}>uk</span>
            </div>
          </OverlayTrigger>
          {/* <div className="tw-cursor-pointer tw-flex tw-flex-row tw-items-center tw-justify-center" onClick={handleLanguageChange}>
            <span className={`${currentLanguage === "en" && "tw-text-contrast"}`}>en</span>/ 
            <span className={`${currentLanguage === "ua" && "tw-text-contrast"}`}>uk</span>
          </div> */}
          <ExportWidget data={data} />
          <img className="tw-h-[50px] tw-w-[50px] tw-rounded-full" src={me.avatar} alt={me.avatar} />
        </div>
      </div>
    </header>
  );
};

export default Header;
