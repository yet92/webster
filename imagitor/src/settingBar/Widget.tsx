import React from "react";
import { Accordion } from "react-bootstrap";
import { WidgetIDList } from ".";
import useI18n from "../hook/usei18n";
import colorStyles from "../style/color.module.css";
import overflowStyles from "../style/overflow.module.css";

export type WidgetKind = {
  id: WidgetIDList;
  name: string;
  [key: string]: any;
};

type WidgetProps = {
  data: WidgetKind;
  children: React.ReactElement;
};

const Widget: React.FC<WidgetProps> = ({ data, children }) => {
  const { getTranslation } = useI18n();
  return (
    <Accordion.Item eventKey={data.id}>
      <Accordion.Header className="tw-bg-secondary">{getTranslation("widget", data.id, "name")}</Accordion.Header>
      <Accordion.Body className={[overflowStyles["auto-y"]].join(" ") + " tw-bg-secondary tw-text-text"}>
        {children}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Widget;
