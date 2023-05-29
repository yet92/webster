import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React from "react";
import { Accordion } from "react-bootstrap";
import widgetList from "../config/widget.json";
import useSelection from "../hook/useSelection";
import useStage from "../hook/useStage";
import useTransformer from "../hook/useTransformer";
import Widget, { WidgetKind } from "./Widget";
import AlignWidget from "./widgetList/AlignWidget";
import FilterWidget from "./widgetList/FilterWidget";
import IconWidget from "./widgetList/IconWidget";
import ImageWidget from "./widgetList/ImageWidget";
import LayerWidget from "./widgetList/LayerWidget";
import LineWidget from "./widgetList/LineWidget";
import ShapeWidget from "./widgetList/ShapeWidget";
import TextWidget from "./widgetList/TextWidget";

export type SettingBarProps = {
  selectedItems: Node<NodeConfig>[];
  clearSelection: ReturnType<typeof useSelection>["clearSelection"];
  stageRef: ReturnType<typeof useStage>["stageRef"];
  transformer?: ReturnType<typeof useTransformer>;
  onSelectItem?: (e?: KonvaEventObject<MouseEvent>, itemList?: Node<NodeConfig>[]) => void;
};

const Widgets = {
  align: (data: WidgetKind & SettingBarProps) => <AlignWidget data={data} />,
  image: (data: WidgetKind & SettingBarProps) => <ImageWidget />,
  shape: (data: WidgetKind & SettingBarProps) => <ShapeWidget />,
  text: (data: WidgetKind & SettingBarProps) => <TextWidget />,
  line: (data: WidgetKind & SettingBarProps) => <LineWidget />,
  icon: (data: WidgetKind & SettingBarProps) => <IconWidget />,
  filter: (data: WidgetKind & SettingBarProps) => <FilterWidget data={data} />,
};

export type WidgetIDList = keyof typeof Widgets;

const SettingBar: React.FC<SettingBarProps> = (settingProps) => (
  <aside className="tw-h-full">
    <Accordion className="tw-h-1/2 tw-overflow-y-auto tw-border-2 tw-border-contrast">
      {(widgetList as WidgetKind[]).map((data) => (
        <Widget key={`widget-${data.id}`} data={{ ...data, ...settingProps }}>
          {Widgets[data.id] && Widgets[data.id]({ ...data, ...settingProps })}
        </Widget>
      ))}
    </Accordion>
    <div className="tw-h-1/2">
      <LayerWidget
        data={{
          ...{
            id: "layer",
            name: "Layer",
          },
          ...settingProps,
        }}
      />
    </div>
  </aside>
);

export default SettingBar;
