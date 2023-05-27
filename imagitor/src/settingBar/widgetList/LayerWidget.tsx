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
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const { getTranslation } = useI18n();
  const { stageData } = useItem();
  const { onSelectItem, clearSelection } = useSelection(data.transformer!);
  const { layerDown, layerUp } = useHotkeyFunc();

  useEffect(() => {
    console.log("From LayerWidget", stageData);
    console.log(
      "SAGE IN LayerWidget",
      data.stageRef.current!.getLayers()[0].children?.find((item) => item)
    );
  }, [stageData]);

  useEffect(() => {
    console.log("STAGE LayerWidget!!!", data.stageRef.current);
  }, [stageData]);

  const [selectedItems, setSelectedItems] = useState<Node<NodeConfig>[]>([]);
  const [layersItems, setLayersItems] = useState<Node<NodeConfig>[]>([]);
  const [editingItem, setEditingItem] = useState<StageData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedItems.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const selectedLayers: Node<NodeConfig>[] = selectedItems.map((selectedItem) =>
        data.stageRef.current!.getLayers()[0].children?.find((item) => item.attrs.id === selectedItem.id)
      );
      console.log("LOCAL FILTERED SELECT", selectedLayers);
      data.clearSelection();
      onSelectItem(undefined, selectedLayers);
    }
    console.log("LOCAL SELECT", selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    console.log("hERE");
    console.log(data.stageRef.current?.getLayers()[0].getChildren());
    if (data.stageRef.current && data.stageRef.current.getLayers()[0].children) {
      if ([...data.stageRef.current.getLayers()[0].children!].length) {
        setLayersItems([...data.stageRef.current.getLayers()[0].children!].filter((item) => item.attrs.id).reverse());
      }
    }
  }, [stageData]);

  const handleClick = (item: StageData, isCtrlPressed: boolean) => {
    // let updatedSelectedItems;
    // if (isCtrlPressed) {
    //   if (selectedItems.includes(item)) {
    //     updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
    //   } else {
    //     updatedSelectedItems = [...selectedItems, item];
    //   }
    // } else {
    //   updatedSelectedItems = [item];
    // }
    // setSelectedItems(updatedSelectedItems);
  };

  // useEffect(() => {
  //   const boardSelected = data.selectedItems
  //     .map((selItem) => stageData.find((item) => item.id === selItem.attrs.id))
  //     .filter((tmp): tmp is StageData => tmp !== undefined);
  //   setSelectedItems(boardSelected);
  //   console.log("usef for Selected", boardSelected);
  // }, [data.selectedItems]);

  const handleDoubleClick = (item: StageData) => {
    // setIsEditing(true);
    // setEditingItem(item);
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

  const onMoveEnd = (newList: any, movedItem: any, oldIdx: number, newIdx: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const selectedLayers: Node<NodeConfig>[] = [movedItem];
    // const selectedLayers: Node<NodeConfig>[] = newList.map((selectedItem) =>
    //   data.stageRef.current!.getLayers()[0].children?.find((itemm) => itemm.attrs.id === selectedItem.id)
    // );
    console.table({ "New Idx": newIdx, "Old Idx": oldIdx, Diff: newIdx - oldIdx, ABS: Math.abs(newIdx - oldIdx) });
    if (newIdx - oldIdx < 0) {
      layerUp(selectedLayers, Math.abs(newIdx - oldIdx));
    } else {
      layerDown(selectedLayers, Math.abs(newIdx - oldIdx));
    }
    console.log("end:", selectedLayers);
  };

  const containerRef = useRef();

  return (
    <div className="tw-flex tw-h-[20vh] tw-w-full tw-flex-col tw-gap-4 tw-overflow-x-auto">
      <DraggableList
        itemKey="_id"
        // itemKey="_id"
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
    editingItem: StageData | null;
    handleClick: (item: StageData, isCtrlPressed: boolean) => void;
    handleDoubleClick: (item: StageData) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputBlur: () => void;
  };
};

const Item = React.forwardRef<HTMLDivElement, ItemProps>(function ItemComponent(
  { item, itemSelected, dragHandleProps, parentData },
  ref
) {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  const { handleClick, handleDoubleClick, handleInputBlur, handleInputChange, isEditing, selectedItems } = parentData;
  // useEffect(() => {
  //   console.log("!@#!#!",item);
  // },[item]);
  return (
    <div
      key={item.attrs.id || nanoid()}
      ref={ref}
      className={`${
        selectedItems.find((itemS) => itemS.attrs.id === item.id) && "tw-bg-blue-300"
      } disable-select tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-2 tw-rounded-md tw-p-2`}
      // onClick={(e) => handleClick(item, e.ctrlKey)}
      // onDoubleClick={() => handleDoubleClick(item)}
    >
      <div className="tw-flex tw-w-full tw-flex-row tw-gap-2 tw-rounded-md tw-p-2">
        <img src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/Layers.svg`} alt={item.className} />
        {parentData.editingItem && isEditing ? (
          <input
            type="text"
            value={parentData.editingItem.className}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <span>{item.className}</span>
        )}
      </div>
      <div
        className="disable-select dragHandle"
        style={{
          fontWeight: "600",
          transform: "rotate(90deg)",
          width: "20px",
          height: "20px",
          backgroundColor: "black",
        }}
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
      ></div>
    </div>
  );
});

export default LayerWidget;

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { Col, Figure, Form, Row, Container, ListGroup } from "react-bootstrap";
// import iconList from "../../config/icon.json";
// import alignStyles from "../../style/align.module.css";
// import sizeStyles from "../../style/size.module.css";
// import Drag from "../../util/Drag";
// import TRIGGER from "../../config/trigger";
// import { IconItemKind } from "../../view/object/icon";
// import useI18n from "../../hook/usei18n";
// import useItem from "../../hook/useItem";
// import { StageData, stageDataAction } from "../../redux/currentStageData";
// import { useDispatch } from "react-redux";
// import useSelection from "../../hook/useSelection";
// import { ITEMS_CONTEXT } from "../../hook/useItem";
// import useTransformer from "../../hook/useTransformer";
// import Konva from "konva";
// import { Node, NodeConfig } from "konva/lib/Node";
// import { Container as temp } from "konva/lib/Container";
// import useStage from "../../hook/useStage";
// import { WidgetKind } from "../Widget";
// import { SettingBarProps } from "..";
// import { Group } from "react-konva";
// import DraggableList from "react-draggable-list";
// import useHotkeyFunc from "../../hook/useHotkeyFunc";

// type LayerWidgetProps = {
//   data: WidgetKind & SettingBarProps;
// };

// const LayerWidget: React.FC<LayerWidgetProps> = ({ data }) => {
//   const dispatch = useDispatch();
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const { getTranslation } = useI18n();
//   const { stageData } = useItem();
//   const { onSelectItem, clearSelection } = useSelection(data.transformer!);
//   const { layerDown, layerUp } = useHotkeyFunc();

//   useEffect(() => {
//     console.log("From LayerWidget", stageData);
//     console.log(
//       "SAGE IN LayerWidget",
//       data.stageRef.current!.getLayers()[0].children?.find((item) => item)
//     );
//   }, [stageData]);

//   useEffect(() => {
//     console.log("STAGE LayerWidget!!!", data.stageRef.current);
//   }, [stageData]);

//   const [selectedItems, setSelectedItems] = useState<StageData[]>([]);
//   const [editingItem, setEditingItem] = useState<StageData | null>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (selectedItems.length) {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //@ts-ignore
//       const selectedLayers: Node<NodeConfig>[] = selectedItems.map((selectedItem) =>
//         data.stageRef.current!.getLayers()[0].children?.find((item) => item.attrs.id === selectedItem.id)
//       );
//       console.log("LOCAL FILTERED SELECT", selectedLayers);
//       data.clearSelection();
//       onSelectItem(undefined, selectedLayers);
//     }
//     console.log("LOCAL SELECT", selectedItems);
//   }, [selectedItems]);

//   const handleClick = (item: StageData, isCtrlPressed: boolean) => {
//     let updatedSelectedItems;

//     if (isCtrlPressed) {
//       if (selectedItems.includes(item)) {
//         updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
//       } else {
//         updatedSelectedItems = [...selectedItems, item];
//       }
//     } else {
//       updatedSelectedItems = [item];
//     }
//     setSelectedItems(updatedSelectedItems);
//   };

//   useEffect(() => {
//     const boardSelected = data.selectedItems
//       .map((selItem) => stageData.find((item) => item.id === selItem.attrs.id))
//       .filter((tmp): tmp is StageData => tmp !== undefined);
//     setSelectedItems(boardSelected);
//     console.log("usef for Selected", boardSelected);
//   }, [data.selectedItems]);

//   const handleDoubleClick = (item: StageData) => {
//     setIsEditing(true);
//     setEditingItem(item);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEditingItem((prevItem) => {
//       if (prevItem) {
//         return { ...prevItem, name: e.target.value };
//       }
//       console.log("NuLL =(");

//       return null;
//     });
//     console.log("edit", editingItem);
//   };

//   const handleInputBlur = () => {
//     console.log("BLUR =(");
//     setIsEditing(false);
//     setEditingItem(null);
//   };

//   const containerRef = useRef();

//   return (
//     <div className="tw-flex tw-h-[20vh] tw-w-full tw-flex-col tw-gap-4 tw-overflow-x-auto">
//       <DraggableList
//         itemKey="id"
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         //@ts-ignore
//         template={React.forwardRef<HTMLDivElement, ItemProps>(function ItemComponent(
//           { item, itemSelected, dragHandleProps, ...rest },
//           ref
//         ) {
//           return (
//             <Item
//               {...rest}
//               item={item}
//               itemSelected={itemSelected}
//               dragHandleProps={dragHandleProps}
//               ref={ref as React.Ref<HTMLDivElement>}
//               parentData={{
//                 selectedItems,
//                 isEditing,
//                 editingItem,
//                 handleClick,
//                 handleDoubleClick,
//                 handleInputChange,
//                 handleInputBlur,
//               }}
//             />
//           );
//         })}
//         list={[...stageData]}
//         onMoveEnd={(newList: any, movedItem: any, oldIdx: number, newIdx: number) => {
//           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//           //@ts-ignore
//           const selectedLayers: Node<NodeConfig>[] = newList.map((selectedItem) =>
//             data.stageRef.current!.getLayers()[0].children?.find((itemm) => itemm.attrs.id === selectedItem.id)
//           );
//           if (newIdx - oldIdx > 0) {
//             layerUp(selectedLayers, newIdx - oldIdx);
//           } else {
//             layerDown(selectedLayers, Math.abs(newIdx - oldIdx));
//           }
//           // dispatch(stageDataAction.updateItem(newList));
//           console.log("end:", newList);
//         }}
//         container={() => containerRef.current}
//       />
//     </div>
//   );
// };

// type ItemProps = {
//   item: StageData;
//   itemSelected: boolean;
//   dragHandleProps: {
//     onMouseDown: (event: React.MouseEvent) => void;
//     onTouchStart: (event: React.TouchEvent) => void;
//   };
//   parentData: {
//     selectedItems: StageData[];
//     isEditing: boolean;
//     editingItem: StageData | null;
//     handleClick: (item: StageData, isCtrlPressed: boolean) => void;
//     handleDoubleClick: (item: StageData) => void;
//     handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleInputBlur: () => void;
//   };
// };

// const Item = React.forwardRef<HTMLDivElement, ItemProps>(function ItemComponent(
//   { item, itemSelected, dragHandleProps, parentData },
//   ref
// ) {
//   const { onMouseDown, onTouchStart } = dragHandleProps;
//   const { handleClick, handleDoubleClick, handleInputBlur, handleInputChange, isEditing, selectedItems } = parentData;
//   return (
//     <div
//       ref={ref}
//       className={`${
//         selectedItems.find((itemS) => itemS.id === item.id) && "tw-bg-blue-300"
//       } disable-select tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-2 tw-rounded-md tw-p-2`}
//       onClick={(e) => handleClick(item, e.ctrlKey)}
//       onDoubleClick={() => handleDoubleClick(item)}
//     >
//       <div className="tw-flex tw-w-full tw-flex-row tw-gap-2 tw-rounded-md tw-p-2">
//         <img src={`${process.env.PUBLIC_URL}/assets/icon/bootstrap/Layers.svg`} alt={item.className} />
//         {parentData.editingItem && isEditing ? (
//           <input
//             type="text"
//             value={parentData.editingItem.className}
//             onChange={handleInputChange}
//             onBlur={handleInputBlur}
//             autoFocus
//             onFocus={(e) => e.target.select()}
//           />
//         ) : (
//           <span>{item.className}</span>
//         )}
//       </div>
//       <div
//         className="disable-select dragHandle"
//         style={{
//           fontWeight: "600",
//           transform: "rotate(90deg)",
//           width: "20px",
//           height: "20px",
//           backgroundColor: "black",
//         }}
//         onTouchStart={onTouchStart}
//         onMouseDown={onMouseDown}
//       ></div>
//     </div>
//   );
// });

// export default LayerWidget;
