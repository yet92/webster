import React, { useEffect, useMemo, useState } from "react";
import { Col, Figure, Form, Row, Container, ListGroup } from "react-bootstrap";
import iconList from "../../config/icon.json";
import alignStyles from "../../style/align.module.css";
import sizeStyles from "../../style/size.module.css";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import { IconItemKind } from "../../view/object/icon";
import useI18n from "../../hook/usei18n";
import useItem from "../../hook/useItem";
import { StageData, stageDataAction } from "../../redux/currentStageData";
import { useDispatch } from "react-redux";
import useSelection from "../../hook/useSelection";
import { ITEMS_CONTEXT } from "../../hook/useItem";
import useTransformer from "../../hook/useTransformer";
import Konva from "konva";
import { Node, NodeConfig } from "konva/lib/Node";
import { Container as temp } from "konva/lib/Container";
import useStage from "../../hook/useStage";
import { WidgetKind } from "../Widget";
import { SettingBarProps } from "..";
import { Group } from "react-konva";

function convertToKonvaNodes(stageData: StageData[]): Node<NodeConfig>[] {
  const konvaNodes: Node<NodeConfig>[] = [];

  for (const item of stageData) {
    const { id, attrs, className, children } = item;
    const konvaNode = Konva.Node.create(attrs) as Node<NodeConfig>;
    // konvaNode.setAttr("id", id);

    // if (className) {
    //   konvaNode.setAttr("className", className);
    // }

    // if (children && children.length > 0) {
    //   const containerNode = konvaNode as temp;
    //   const konvaChildren = convertToKonvaNodes(children);
    //   containerNode.add(...konvaChildren);
    // }

    konvaNodes.push(konvaNode);
  }

  return konvaNodes;
}

type LayerWidgetProps = {
  data: WidgetKind & SettingBarProps;
};

const LayerWidget: React.FC<LayerWidgetProps> = ({ data }) => {
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const { getTranslation } = useI18n();
  const { stageData } = useItem();
  // const transformer = useTransformer();
  const { onSelectItem } = useSelection(data.transformer!);

  useEffect(() => {
    console.log("From LayerWidget", stageData);
    console.log(
      "SAGE IN LayerWidget",
      data.stageRef.current!.getLayers()[0].children?.find((item) => item)
    );
  }, [stageData]);

  const [selectedItems, setSelectedItems] = useState<StageData[]>([]);
  const [editingItem, setEditingItem] = useState<StageData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedItems.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const selectedLayers: Node<NodeConfig>[] = selectedItems.map((selectedItem) =>
        data.stageRef.current!.getLayers()[0].children?.find((item) => item.attrs.id === selectedItem.id)
      );
      // const selectedLayers = selectedItems
      //   .map((slectedItem) =>
      //     data.stageRef.current!.getLayers()[0].children?.find((item) => item.attrs.id === slectedItem.id)
      //   );
      console.log("LOCAL FILTERED SELECT", selectedLayers);
      onSelectItem(undefined, selectedLayers);
    }
    console.log("LOCAL SELECT", selectedItems);
  }, [selectedItems]);

  const handleClick = (item: StageData, isCtrlPressed: boolean) => {
    let updatedSelectedItems;

    if (isCtrlPressed) {
      if (selectedItems.includes(item)) {
        updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
      } else {
        updatedSelectedItems = [...selectedItems, item];
      }
    } else {
      updatedSelectedItems = [item];
    }

    // const overlapItems: Node<NodeConfig>[] = getItemsInBoundary(
    //   stage,
    //   selectBox
    // )
    //   ? getItemsInBoundary(stage, selectBox)!
    //     .map((_item) =>
    //       _item.attrs["data-item-type"] === "frame"
    //         ? _item.getParent().getChildren() ?? []
    //         : _item
    //     )
    //     .flat()
    //     .filter((_item) => _item.className !== "Label")
    //   : [];

    // const overlapItems: Node<NodeConfig>[] = selectedItems.map((_item) => ({..._item, _id: _item.id}));

    setSelectedItems(updatedSelectedItems);
  };

  const handleDoubleClick = (item: StageData) => {
    setIsEditing(true);
    setEditingItem(item);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingItem((prevItem) => {
      if (prevItem) {
        return { ...prevItem, name: e.target.value };
      }
      console.log("NuLL =(");

      return null;
    });
    console.log("edit", editingItem);
  };

  const handleInputBlur = () => {
    console.log("BLUR =(");
    setIsEditing(false);
    setEditingItem(null);
  };

  return (
    <Container style={{ height: "30vh", overflowY: "auto", width: "100%", padding: "0" }}>
      <ListGroup className="auto">
        {stageData.map((item, index) => (
          <ListGroup.Item
            key={index}
            active={selectedItems.includes(item)}
            onClick={(e) => handleClick(item, e.ctrlKey)}
            onDoubleClick={() => handleDoubleClick(item)}
            style={{ width: "100%" }}
          >
            <img src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/Layers.svg`} alt={item.className} />
            {editingItem && isEditing ? (
              <input
                type="text"
                value={editingItem.className}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            ) : (
              <span>{item.className}</span>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default LayerWidget;

const LayerThumbnail: React.FC<{
  maxPx: number;
  data: any;
  onCaptionChange: (id: string, value: string) => void;
}> = ({ data: { id, name, icon, type }, maxPx, onCaptionChange }) => {
  const [caption, setCaption] = useState(name);

  const handleCaptionBlur = () => {
    onCaptionChange(id, caption);
  };

  return (
    <div className="list-group-item">
      <Figure className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}>
        <Drag
          dragType="copyMove"
          dragSrc={{
            trigger: TRIGGER.INSERT.ICON,
            id,
            name: caption,
            icon,
            "data-item-type": type,
          }}
        >
          <Figure.Image alt={icon} src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/${icon}`} />
        </Drag>
        <Figure.Caption
          contentEditable
          suppressContentEditableWarning
          onBlur={handleCaptionBlur}
          onInput={(e: React.ChangeEvent<HTMLDivElement>) => setCaption(e.currentTarget.textContent || "")}
        >
          {caption}
        </Figure.Caption>
      </Figure>
    </div>
  );
};

// const LayerWidget: React.FC = () => {
//   const dispatch = useDispatch();
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const { getTranslation } = useI18n();
//   const { stageData } = useItem();

//   useEffect(() => {
//     console.log("From LayerWidget", stageData);
//   }, [stageData]);

//   const changeKeyword = (e: React.BaseSyntheticEvent) => {
//     setSearchKeyword(e.currentTarget.value as string);
//   };

//   const handleCaptionChange = (id: string, value: string) => {
//     const newData = stageData.map((item) => {
//       if (item.id === id) {
//         return {
//           ...item,
//           className: value,
//         };
//       }
//       return item;
//     });
//     dispatch(stageDataAction.updateItem(newData));
//   };

//   return (
//     <Col className={[sizeStyles["mx-h-30vh"]].join(" ")}>
//       <Form>
//         <Form.Group className="mb-3" controlId="iconKeyword">
//           <Form.Label>{getTranslation("widget", "icon", "search", "title")}</Form.Label>
//           <Form.Control
//             onChange={changeKeyword}
//             type="text"
//             placeholder={getTranslation("widget", "icon", "search", "placeholder")}
//           />
//           <Form.Text className="text-muted">{getTranslation("widget", "icon", "search", "desc")}</Form.Text>
//         </Form.Group>
//       </Form>
//       <div className="list-group">
//         {stageData.map((_data) => (
//           <LayerThumbnail
//             key={`layer-thumbnail-${_data.id}`}
//             data={{
//               id: _data.id,
//               name: _data.className,
//               icon: "Layers.svg",
//               type: "layer",
//             }}
//             maxPx={80}
//             onCaptionChange={handleCaptionChange}
//           />
//         ))}
//       </div>
//     </Col>
//   );
// };

// export default LayerWidget;

// const LayerThumbnail: React.FC<{
//   maxPx: number;
//   data: any;
//   onCaptionChange: (id: string, value: string) => void;
// }> = ({ data: { id, name, icon, type }, maxPx, onCaptionChange }) => {
//   const [caption, setCaption] = useState(name);

//   const handleCaptionBlur = () => {
//     onCaptionChange(id, caption);
//   };

//   return (
//     <div className="list-group-item">
//       <Figure className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}>
//         <Drag
//           dragType="copyMove"
//           dragSrc={{
//             trigger: TRIGGER.INSERT.ICON,
//             id,
//             name: caption,
//             icon,
//             "data-item-type": type,
//           }}
//         >
//           <Figure.Image alt={icon} src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/${icon}`} />
//         </Drag>
//         <Figure.Caption
//           contentEditable
//           suppressContentEditableWarning
//           onBlur={handleCaptionBlur}
//           onInput={(e: React.ChangeEvent<HTMLDivElement>) => setCaption(e.currentTarget.textContent || "")}
//         >
//           {caption}
//         </Figure.Caption>
//       </Figure>
//     </div>
//   );
// };
