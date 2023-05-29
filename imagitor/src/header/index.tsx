import React from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../redux/store";
import { SettingBarProps } from "../settingBar";
import ExportWidget from "../settingBar/widgetList/ExportWidget";

type HeaderProps = {
  data: SettingBarProps;
};

const Header: React.FC<HeaderProps> = ({ data }) => {
  const {
    stageDataList,
    auth: { me },
  } = useSelector((selector: StoreState) => selector);
  return (
    <header>
      <div className="p-2 tw-flex tw-w-full tw-flex-row tw-items-center tw-justify-between tw-gap-5 tw-rounded-xl tw-bg-secondary">
        <span className="tw-text-2xl tw-font-bold tw-text-text">WEBSTER</span>
        <span className="tw-text-2xl tw-font-bold tw-text-contrast">{stageDataList.ids[0]}</span>
        <div className="tw-flex tw-flex-row tw-gap-7 tw-text-text">
          <ExportWidget data={data} />
          <img className="tw-h-[50px] tw-w-[50px] tw-rounded-full" src={me.avatar} alt={me.avatar} />
        </div>
      </div>
    </header>
  );
};

export default Header;
