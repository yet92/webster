import { Group } from "konva/lib/Group";
import { Node, NodeConfig } from "konva/lib/Node";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsDownload } from "react-icons/bs";
import { SettingBarProps } from "..";
import useSelection from "../../hook/useSelection";
import useStage from "../../hook/useStage";
import useI18n from "../../hook/usei18n";

export type ExportKind = {
  selectedItems: Node<NodeConfig>[];
  clearSelection: ReturnType<typeof useSelection>["clearSelection"];
  stageRef: ReturnType<typeof useStage>["stageRef"];
};

type ExportWidgetProps = {
  data: SettingBarProps;
};

const ExportWidget: React.FC<ExportWidgetProps> = ({ data }) => (
  <ExportThumbnail
    key={`export-thumbnail`}
    data={{
      selectedItems: data.selectedItems,
      clearSelection: data.clearSelection,
      stageRef: data.stageRef,
    }}
  />
);

export default ExportWidget;

const ExportThumbnail: React.FC<{
  data: ExportKind;
}> = ({ data }) => {
  const { getTranslation } = useI18n();

  const downloadSelected = (targetFrame?: Node<NodeConfig> | Group) => {
    const link = document.createElement("a");
    const frame = data.stageRef.current.getLayers()[0];

    if (frame) {
      const stage = frame.getStage()!;
      console.log(stage);
      data.clearSelection();
      const uri = stage.toDataURL({
        x: frame.getClientRect().x,
        y: frame.getClientRect().y,
        width: frame.attrs.width * stage.scaleX(),
        height: frame.attrs.height * stage.scaleY(),
        pixelRatio: 1 / stage.scaleX(),
      });
      if (uri) {
        link.download = "export.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const onClickDownload = () => () => {
    downloadSelected();
  };

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip_navbar-id}`}>Export as png</Tooltip>}>
      <div className="tw-cursor-pointer tw-flex tw-flex-col tw-items-center tw-justify-center" onClick={onClickDownload()}>
        <BsDownload size={25}/>
        <span className="tw-text-sm">Export</span>
      </div>
    </OverlayTrigger>
  );
};
