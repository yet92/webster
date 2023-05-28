import React, { useEffect, useState, useRef } from "react";
import useItem from "../../hook/useItem";
import useSelection from "../../hook/useSelection";
import { Node, NodeConfig } from "konva/lib/Node";
import { WidgetKind } from "../Widget";
import { SettingBarProps } from "..";
import DraggableList from "react-draggable-list";
import useHotkeyFunc from "../../hook/useHotkeyFunc";
import { nanoid } from "nanoid";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type LayerWidgetProps = {
  data: WidgetKind & SettingBarProps;
};

const LayerWidget: React.FC<LayerWidgetProps> = ({ data }) => {
  const [selectedItems, setSelectedItems] = useState<Node<NodeConfig>[]>([]);
  const [layersItems, setLayersItems] = useState<Node<NodeConfig>[]>([]);
  const [editingItem, setEditingItem] = useState<Node<NodeConfig> | null | undefined>(null);
  const { deleteItems } = useHotkeyFunc();
  const { setSelectedItems: setGlobalSelectedItems } = useSelection(data.transformer!);

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
    <div className="tw-flex tw-h-[20vh] tw-w-full tw-flex-col tw-gap-4">
      <div
        className="w-full tw-flex tw-justify-end tw-gap-5 tw-pb-2 tw-pr-2 tw-shadow-sm"
        style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id={`tooltip_navbar-id_${data.id}`}>Delete layer</Tooltip>}
        >
          <div
            className="tw-cursor-pointer"
            onClick={() => deleteItems(data.selectedItems, setGlobalSelectedItems, data.transformer!.transformerRef!)}
          >
            <img alt={"pencil.svg"} src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/trash.svg`} />
          </div>
        </OverlayTrigger>
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
        selectedItems.find((itemS) => itemS.attrs.id === item.attrs.id) && "tw-bg-blue-300"
      } tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-1 tw-rounded-md tw-p-2 tw-shadow-sm hover:tw-shadow-lg`}
      style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
      onClick={(e) => handleClick(item, e.ctrlKey)}
      onDoubleClick={() => {
        setDisplayedName(item.attrs.disabledName);
        handleEditClick(item);
      }}
    >
      <div className="tw-flex tw-w-full tw-flex-row tw-gap-2 tw-rounded-md tw-p-2">
        <img src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/Layers.svg`} alt={item.className} />
        <input
          type="text"
          className={`${
            editingItem?.attrs.id === item.attrs.id ? "" : "tw-caret-transparent"
          } tw-w-2/3 tw-cursor-default tw-border-none tw-bg-transparent tw-outline-none`} //tw-caret-transparent
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
        className="disable-select dragHandle tw-flex tw-items-center"
        onTouchStart={onTouchStart}
        onMouseDown={(e) => {
          handleClick(item, false);
          onMouseDown(e);
        }}
      >
        <img alt={"grip-vertical.svg"} src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/grip-vertical.svg`} />
      </div>
    </div>
  );
});

export default LayerWidget;
