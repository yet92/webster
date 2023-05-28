import React, { useEffect, useMemo, useState, useRef } from "react";
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
import DraggableList from "react-draggable-list";
import useHotkeyFunc from "../../hook/useHotkeyFunc";
import { nanoid } from "nanoid";

type LayerWidgetProps = {
  data: WidgetKind & SettingBarProps;
};

const LayerWidget: React.FC<LayerWidgetProps> = ({ data }) => {
  const [selectedItems, setSelectedItems] = useState<Node<NodeConfig>[]>([]);
  const [layersItems, setLayersItems] = useState<Node<NodeConfig>[]>([]);
  const [editingItem, setEditingItem] = useState<Node<NodeConfig> | null | undefined>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayedName, setDisplayedName] = useState("");

  const { stageData, updateItem } = useItem();
  const { layerDown, layerUp } = useHotkeyFunc();

  useEffect(() => {
    console.log("CURRENT CHILDREN:", data.stageRef.current?.getLayers()[0].getChildren());
    if (data.stageRef.current && data.stageRef.current.getLayers()[0].children) {
      if ([...data.stageRef.current.getLayers()[0].getChildren()].length) {
        setLayersItems(
          [...data.stageRef.current.getLayers()[0].getChildren()].filter((item) => item.attrs.id).reverse()
        );
      }
    }
  }, [stageData]);

  useEffect(() => {
    const boardSelected = data.selectedItems;
    setSelectedItems(boardSelected);
  }, [data.selectedItems]);

  const handleClick = (item: Node<NodeConfig>, isCtrlPressed: boolean) => {
    // handleInputBlur();
    let updatedSelectedItems: Node<NodeConfig>[];
    if (isCtrlPressed) {
      if (selectedItems.includes(item)) {
        updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
      } else {
        updatedSelectedItems = [...selectedItems, item];
      }
    } else {
      updatedSelectedItems = [item];
    }
    setSelectedItems(updatedSelectedItems);
    data.onSelectItem!(undefined, updatedSelectedItems);
  };

  const handleDoubleClick = (item: Node<NodeConfig>) => {
    console.log("IN DOUBLE CLICK!", item);
    setIsEditing(true);
    setEditingItem(item);
    setDisplayedName(item.attrs.displayedName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayedName(e.target.value);
  };

  const handleInputBlur = () => {
    console.log("IN BLUR!");
    if (editingItem?.attrs.name !== displayedName) {
      updateItem(editingItem?.attrs.id, (attrs) => ({
        ...attrs,
        displayedName: displayedName,
      }));
    }
    setIsEditing(false);
    setEditingItem(null);
    setDisplayedName("");
  };

  const onMoveEnd = (newList: any, movedItem: any, oldIdx: number, newIdx: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const selectedLayers: Node<NodeConfig>[] = [movedItem];
    console.table({ "New Idx": newIdx, "Old Idx": oldIdx, Diff: newIdx - oldIdx, ABS: Math.abs(newIdx - oldIdx) });
    if (newIdx - oldIdx < 0) {
      layerUp(selectedLayers, Math.abs(newIdx - oldIdx));
    } else {
      layerDown(selectedLayers, Math.abs(newIdx - oldIdx));
    }
  };

  const containerRef = useRef();

  return (
    <div className="tw-flex tw-h-[20vh] tw-w-full tw-flex-col tw-gap-4">
      <DraggableList
        itemKey="_id"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        template={React.forwardRef<HTMLDivElement, ItemProps>(function ItemComponent(
          { item, itemSelected, dragHandleProps, ...rest },
          ref
        ) {
          return (
            <Item
              {...rest}
              item={item}
              itemSelected={itemSelected}
              dragHandleProps={dragHandleProps}
              ref={ref as React.Ref<HTMLDivElement>}
              parentData={{
                selectedItems,
                isEditing,
                editingItem,
                handleClick,
                handleDoubleClick,
                handleInputChange,
                handleInputBlur,
                displayedName,
              }}
            />
          );
        })}
        list={layersItems}
        onMoveEnd={onMoveEnd}
        container={() => containerRef.current}
      />
    </div>
  );
};

type ItemProps = {
  item: Node<NodeConfig>;
  itemSelected: boolean;
  dragHandleProps: {
    onMouseDown: (event: React.MouseEvent) => void;
    onTouchStart: (event: React.TouchEvent) => void;
  };
  parentData: {
    selectedItems: Node<NodeConfig>[];
    isEditing: boolean;
    editingItem: Node<NodeConfig> | null | undefined;
    displayedName: string;
    handleClick: (item: Node<NodeConfig>, isCtrlPressed: boolean) => void;
    handleDoubleClick: (item: Node<NodeConfig>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputBlur: () => void;
  };
};

const Item = React.forwardRef<HTMLDivElement, ItemProps>(function ItemComponent(
  { item, itemSelected, dragHandleProps, parentData },
  ref
) {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  const {
    editingItem,
    handleClick,
    handleDoubleClick,
    handleInputBlur,
    handleInputChange,
    isEditing,
    selectedItems,
    displayedName,
  } = parentData;

  useEffect(() => {
    console.log(!editingItem?.attrs.id === item.attrs.id);
  }, [editingItem]);

  return (
    <div
      key={item.attrs.id || nanoid()}
      ref={ref}
      className={`${
        selectedItems.find((itemS) => itemS.attrs.id === item.attrs.id) && "tw-bg-blue-300"
      } tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-2 tw-rounded-md tw-p-2`}
      onClick={(e) => handleClick(item, e.ctrlKey)}
      onDoubleClick={() => handleDoubleClick(item)}
    >
      <div className="tw-flex tw-w-full tw-flex-row tw-gap-2 tw-rounded-md tw-p-2">
        <img src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/Layers.svg`} alt={item.className} />
        {/* {editingItem && isEditing ? ( */}
        <input
          type="text"
          className="tw-w-2/3 tw-border-none tw-bg-transparent tw-outline-none tw-cursor-default tw-caret-transparent"
          disabled={!editingItem?.attrs.id === item.attrs.id}
          value={editingItem?.attrs.id === item.attrs.id ? displayedName : item.attrs.displayedName}
          onChange={handleInputChange}
          // onBlur={handleInputBlur}
          // autoFocus
          // onFocus={(e) => e.target.select()}
        />
        {/* ) : (
          <span>{item.attrs.displayedName}</span>
        )} */}
      </div>
      {/* {editingItem?.attrs.id === item.attrs.id ? (
        <div
          className=""
          onClick={(e) => {
            handleInputBlur();
          }}
        >
          <Figure.Image alt={"pencil.svg"} src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/check2.svg`} />
        </div>
      ) : (
        <div
          className=""
          onClick={(e) => {
            handleDoubleClick(item);
          }}
        >
          <Figure.Image alt={"pencil.svg"} src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/pencil.svg`} />
        </div>
      )} */}
      <div className="disable-select dragHandle" onTouchStart={onTouchStart} onMouseDown={onMouseDown}>
        <Figure.Image
          alt={"grip-vertical.svg"}
          src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/grip-vertical.svg`}
        />
      </div>
    </div>
  );
});

export default LayerWidget;
