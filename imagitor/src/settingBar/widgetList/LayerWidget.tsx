import { Node, NodeConfig } from "konva/lib/Node";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import DraggableList from "react-draggable-list";
import { BsBack, BsBoundingBox, BsFront, BsGripVertical, BsLayers, BsTrashFill } from "react-icons/bs";
import { SettingBarProps } from "..";
import useHotkeyFunc from "../../hook/useHotkeyFunc";
import useI18n from "../../hook/usei18n";
import useItem from "../../hook/useItem";
import useSelection from "../../hook/useSelection";
// import { GrDrag,  } from "react-icons/gr";

type LayerWidgetProps = {
  data: { id: string; name: string } & SettingBarProps;
};

const LayerWidget: React.FC<LayerWidgetProps> = ({ data }) => {
  const [selectedItems, setSelectedItems] = useState<Node<NodeConfig>[]>([]);
  const [layersItems, setLayersItems] = useState<Node<NodeConfig>[]>([]);
  const [editingItem, setEditingItem] = useState<Node<NodeConfig> | null | undefined>(null);
  const { deleteItems } = useHotkeyFunc();
  const { setSelectedItems: setGlobalSelectedItems } = useSelection(data.transformer!);
  const { getTranslation } = useI18n();

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
    if (item.attrs.id === selectedItems[0]?.attrs.id) {
      return;
    }
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

  const handleEditClick = (item: Node<NodeConfig>) => {
    if (item) {
      setEditingItem(item);
    }
  };

  const handleAcceptClick = (displayedName: string) => {
    if (editingItem && displayedName) {
      updateItem(editingItem.attrs.id, (attrs) => ({
        ...attrs,
        displayedName: displayedName,
      }));
    }
    setEditingItem(null);
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
    <div
      className="tw-mt-2 tw-flex tw-h-full tw-w-full tw-flex-col tw-overflow-y-auto tw-rounded-md tw-border-contrast/20 tw-bg-secondary"
      style={{ border: "1px solid" }}
    >
      <span className="tw-text-1xl tw-border-b tw-p-3 tw-pl-5 tw-font-bold tw-text-text">{getTranslation("widget", "layer", "name")}</span>
      <div
        className="w-full tw-mb-2 tw-flex tw-justify-between tw-gap-3 tw-border-contrast tw-pb-2 tw-pr-2 tw-pt-2 tw-shadow-sm "
        style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <span className="tw-text-1xl tw-justify-self-start tw-border-b tw-pl-5 tw-text-text">{getTranslation("widget", "layer", "tools", "name")}</span>
        <div className="tw-flex tw-gap-3">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id={`tooltip_navbar-id_${data.id}`}>Select All</Tooltip>}
          >
            <div
              className="tw-cursor-pointer"
              onClick={() => {
                const items = data.stageRef.current
                  .getChildren()[0]
                  .getChildren(
                    (_item) => _item.attrs.name === "label-target" && _item.attrs["data-item-type"] !== "frame"
                  );
                const newSelections = [...items];
                data.onSelectItem!(undefined, newSelections);
              }}
            >
              <BsBoundingBox />
            </div>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip_navbar-id_${data.id}`}>Layer Up</Tooltip>}>
            <div className="tw-cursor-pointer" onClick={() => layerUp(data.selectedItems)}>
              <BsFront />
            </div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id={`tooltip_navbar-id_${data.id}`}>Layer Down</Tooltip>}
          >
            <div className="tw-cursor-pointer" onClick={() => layerDown(data.selectedItems)}>
              <BsBack />
            </div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id={`tooltip_navbar-id_${data.id}`}>Delete Layer</Tooltip>}
          >
            <div
              className="tw-cursor-pointer"
              onClick={() => deleteItems(data.selectedItems, setGlobalSelectedItems, data.transformer!.transformerRef!)}
            >
              <BsTrashFill />
            </div>
          </OverlayTrigger>
        </div>
      </div>
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
                editingItem,
                handleClick,
                handleEditClick,
                handleAcceptClick,
              }}
            />
          );
        })}
        list={layersItems}
        onMoveEnd={onMoveEnd}
        container={() => containerRef.current}
      />
      <div className="tw-mt-1" ></div>
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
    editingItem: Node<NodeConfig> | null | undefined;
    handleAcceptClick: (ard: string) => void;
    handleClick: (item: Node<NodeConfig>, isCtrlPressed: boolean) => void;
    handleEditClick: (item: Node<NodeConfig>) => void;
  };
};

const Item = React.forwardRef<HTMLDivElement, ItemProps>(function ItemComponent(
  { item, dragHandleProps, parentData },
  ref
) {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  const { editingItem, handleClick, handleAcceptClick, handleEditClick, selectedItems } = parentData;
  const [displayedName, setDisplayedName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayedName(e.target.value);
  };

  useEffect(() => {
    console.log(!editingItem?.attrs.id === item.attrs.id);
  }, [editingItem]);

  return (
    <div
      key={item.attrs.id || nanoid()}
      ref={ref}
      className={`${
        selectedItems.find((itemS) => itemS.attrs.id === item.attrs.id) ? "tw-bg-contrast" : "tw-bg-contrast/10"
      } tw-border-b-1 tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-1 tw-rounded-md tw-border-contrast tw-p-2 tw-shadow-sm hover:tw-shadow-lg`}
      style={{ borderBottom: "1px solid rgba(1, 1, 1, 0.1)" }}
      onClick={(e) => handleClick(item, e.ctrlKey)}
      onDoubleClick={() => {
        setDisplayedName(item.attrs.disabledName);
        handleEditClick(item);
      }}
    >
      <div className="tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-2  tw-rounded-md tw-p-2">
        <BsLayers />
        <input
          type="text"
          className={`${
            editingItem?.attrs.id === item.attrs.id ? "tw-bg-contrast" : "tw-bg-contrast/0 tw-caret-contrast/10"
          } tw-bg-tr tw-w-2/3 tw-cursor-default tw-border-none tw-text-text tw-outline-none`} //tw-caret-transparent
          disabled={!editingItem?.attrs.id === item.attrs.id}
          value={editingItem?.attrs.id === item.attrs.id ? displayedName : item.attrs.displayedName}
          onChange={handleInputChange}
          onBlur={() => {
            handleAcceptClick(displayedName);
          }}
          autoFocus={editingItem?.attrs.id === item.attrs.id}
        />
      </div>
      <div
        className="disable-select dragHandle tw-flex tw-items-center tw-text-text"
        onTouchStart={onTouchStart}
        onMouseDown={(e) => {
          handleClick(item, false);
          onMouseDown(e);
        }}
      >
        <BsGripVertical />
      </div>
    </div>
  );
});

export default LayerWidget;
