import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";
import {
  StageData,
  stageDataAction,
  stageDataSelector,
} from "../redux/currentStageData";
import { StoreState } from "../redux/store";

export type ItemData = {
  "data-item-type": string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  draggable: boolean;
} & Record<string, any>;

export type ItemProps = {
  key: string;
  data: ItemData;
  e?: Event;
} & Record<string, any>;

export type OverrideItemProps<T> = Omit<ItemProps, keyof T> &
  T &
  Pick<ITEMS_CONTEXT, "onSelect">;

export type OverrideItemData<T> = Omit<ItemData, keyof T> & T;

export type ITEMS_CONTEXT = {
  selectedItems: Konva.Node[];
  onCreate: (newItem: StageData) => void;
  onDelete: (targetItemId: string | string[]) => void;
  onSelect: (e?: KonvaEventObject<MouseEvent>, itemList?: Konva.Node[]) => void;
  onClear: () => void;
  onAlter: (dataList: StageData[]) => void;
};

const SERVER_URL = "http://localhost:4000";

const useItem = () => {
  const dispatch = useDispatch();
  const stageData = useSelector(stageDataSelector.selectAll);
  const auth = useSelector((state: StoreState) => state.auth);

  const page = useSelector((state: StoreState) => state.page);

  const createItem = (newItem: StageData) => {
    dispatch(stageDataAction.addItem(newItem));
    // send new item to server

    if (page.current !== -1) {
      fetch(`${SERVER_URL}/api/projects/${page.current}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${auth.me.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ newItem }),
      });
    }
  };

  const updatePoints = (id: string)  => {
    console.log(stageData);
    const lineIndex = stageData.findIndex(data => data.id === id);

    console.log("LINE INDEX: ", lineIndex);
    
  };

  const updateItem = (
    id: string,
    attrsFunc: (attrs: StageData["attrs"]) => StageData["attrs"]
  ) => {
    const targetItem = stageData.find(
      (data) => data.id === id || data.attrs.id === id
    );

    const updatedObject = {
      ...(targetItem ?? {}),
      attrs: {
        ...(targetItem ? targetItem.attrs : {}),
        ...attrsFunc(targetItem),
      },
    } as StageData;
    dispatch(stageDataAction.updateItem(updatedObject));
    // send update to server

    if (page.current !== -1) {
      fetch(`${SERVER_URL}/api/projects/${page.current}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${auth.me.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ updatedObject }),
      });
    }
  };

  const removeItem = (targetItemId: string | string[]) => {
    dispatch(stageDataAction.removeItem(targetItemId));
  };
  const alterItems = (dataList: StageData[]) => {
    dispatch(stageDataAction.clearItems({}));
    dispatch(stageDataAction.addItem(dataList));
  };
  const clearItems = () => {
    dispatch(stageDataAction.clearItems({}));
  };

  return {
    stageData,
    createItem,
    updateItem,
    removeItem,
    alterItems,
    clearItems,
    updatePoints,
  };
};

export default useItem;
