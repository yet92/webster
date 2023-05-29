import { Node, NodeConfig } from "konva/lib/Node";
import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import hotkeyList from "./config/hotkey.json";
import workModeList from "./config/workMode.json";
import Header from "./header";
import useHotkeyFunc from "./hook/useHotkeyFunc";
import useItem from "./hook/useItem";
import useModal from "./hook/useModal";
import useRoutes from "./hook/useRoutes";
import { useSaveStageState } from "./hook/useSaveStageState";
import useSelection from "./hook/useSelection";
import useSocket from "./hook/useSocket";
import useStage from "./hook/useStage";
import useStageDataList from "./hook/useStageDataList";
import useTab from "./hook/useTab";
import useTool from "./hook/useTool";
import useTransformer from "./hook/useTransformer";
import useWorkHistory from "./hook/useWorkHistory";
import useI18n from "./hook/usei18n";
import Layout from "./layout";
import NavBar from "./navBar";
import BrushDropdown from "./navBar/BrushDropdown";
import ColorPalette from "./navBar/ColorPalette";
import NavBarButton from "./navBar/NavBarButton";
import NavBarDropdownButton from "./navBar/NavBarDropdownButton";
import { StageDataListItem, stageDataListSelector } from "./redux/StageDataList";
import { loadUser } from "./redux/authSlice";
import { StageData } from "./redux/currentStageData";
import { initialStageDataList } from "./redux/initilaStageDataList";
import { StoreState } from "./redux/store";
import SettingBar from "./settingBar";
import TabGroup from "./tab";
import View from "./view";
import Frame, { FrameProps } from "./view/frame";
import IconItem, { IconItemProps } from "./view/object/icon";
import ImageItem, { ImageItemProps } from "./view/object/image";
import LineItem, { LineItemProps } from "./view/object/line";
import ShapeItem, { ShapeItemProps } from "./view/object/shape";
import TextItem, { TextItemProps } from "./view/object/text";

export type FileKind = {
  "file-id": string;
  title: string;
  data: Record<string, any>[];
};

export type FileData = Record<string, FileKind>;

function App() {
  const [initialRender, setInitialRender] = useState(false);
  const [past, setPast] = useState<StageData[][]>([]);
  const [future, setFuture] = useState<StageData[][]>([]);
  const { goToFuture, goToPast, recordPast, clearHistory } = useWorkHistory(past, future, setPast, setFuture);
  const transformer = useTransformer();
  const { selectedItems, onSelectItem, setSelectedItems, clearSelection } = useSelection(transformer);
  const { tabList, onClickTab, onCreateTab, onDeleteTab } = useTab(transformer, clearHistory);
  const { stageData, createItem, updateItem, removeItem } = useItem();
  const { initializeFileDataList, updateFileData } = useStageDataList();
  const stage = useStage();
  const modal = useModal();
  const {
    deleteItems,
    copyItems,
    selectAll,
    pasteItems,
    duplicateItems,
    layerDown,
    setBrush,
    setEraser,
    setPointer,
    layerUp,
    flipHorizontally,
    flipVertically,
  } = useHotkeyFunc();
  const { getTranslation } = useI18n();
  const [clipboard, setClipboard] = useState<StageData[]>([]);
  const createStageDataObject = (item: Node<NodeConfig>): StageData => {
    const { id } = item.attrs;
    const target = item.attrs["data-item-type"] === "frame" ? item.getParent() : item;
    return {
      id: nanoid(),
      attrs: {
        ...(stageData.find((_item) => _item.attrs.id === id)?.attrs ?? {}),
      },
      className: target.getType(),
      children: [],
    };
  };
  const { getClickCallback } = useTool(
    stage,
    modal,
    selectedItems,
    setSelectedItems,
    transformer,
    createStageDataObject,
    onSelectItem
  );
  const { getStageFromLocalStorage, saveStageToLocalStorage, getStageFromServer, loading } = useSaveStageState();
  const stageDataList = useSelector(stageDataListSelector.selectAll);
  const currentTabId = useMemo(() => tabList.find((tab) => tab.active)?.id ?? null, [tabList]);

  const header = (
    <Header>
      <TabGroup onClickTab={onClickTab} tabList={tabList} onCreateTab={onCreateTab} onDeleteTab={onDeleteTab} />
    </Header>
  );

	const navBar = (
		<NavBar>
			{workModeList.map((data) => {
				if (data.id === 'brush') {
					return (
						<NavBarDropdownButton
							key={`navbar-${data.id}`}
							onClick={getClickCallback(data.id)}
							dropdownData={<BrushDropdown />}
							data={data}
							stage={stage}
						/>
					);
				}
				if (data.id === 'color') {
					return (<ColorPalette selectedItems={selectedItems} />);
				}
				return (
					<NavBarButton
						key={`navbar-${data.id}`}
						data={data}
						stage={stage}
						onClick={getClickCallback(data.id)}
					/>
				);
			})}
		</NavBar>
	);

  const hotkeyModal = (
    <Modal className="tw-text-text" show={modal.displayModal} onHide={modal.closeModal}>
      <Modal.Header className="tw-bg-secondary" closeButton>
        <Modal.Title>Keyboard Shortcuts</Modal.Title>
      </Modal.Header>
      <Modal.Body className="tw-bg-secondary">
        {hotkeyList.map((hotkey) => (
          <Col key={hotkey.name}>
            <h6>{getTranslation("hotkey", hotkey.id, "name")}</h6>
            <Row className="justify-content-end" xs={4}>
              {hotkey.keys.map((key, idx) => (
                <React.Fragment key={hotkey.name + key}>
                  {idx !== 0 && "+"}
                  <Col xs="auto" className="align-items-center tw-justify-center">
                    <div className="tw-p-2 tw-flex tw-items-center tw-justify-center tw-bg-contrast tw-rounded-xl">{key}</div>
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          </Col>
        ))}
      </Modal.Body>
    </Modal>
  );

  const settingBar = (
    <SettingBar
      selectedItems={selectedItems}
      clearSelection={clearSelection}
      stageRef={stage.stageRef}
      transformer={transformer}
      onSelectItem={onSelectItem}
    />
  );

  const renderObject = (item: StageData) => {
    switch (item.attrs["data-item-type"]) {
      case "frame":
        return <Frame key={`frame-${item.id}`} data={item as FrameProps["data"]} onSelect={onSelectItem} />;
      case "image":
        return <ImageItem key={`image-${item.id}`} data={item as ImageItemProps["data"]} onSelect={onSelectItem} />;
      case "text":
        return (
          <TextItem
            key={`image-${item.id}`}
            data={item as TextItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      case "shape":
        return (
          <ShapeItem
            key={`shape-${item.id}`}
            data={item as ShapeItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      case "icon":
        return (
          <IconItem
            key={`icon-${item.id}`}
            data={item as IconItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      case "line":
        // return <KonvaLine key={item.id} {...item.attrs} />;
        return (
          <LineItem
            key={`line-${item.id}`}
            data={item as LineItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
        break;
      default:
        return null;
    }
  };

  useHotkeys(
    "shift+up",
    (e) => {
      e.preventDefault();
      layerUp(selectedItems);
    },
    {},
    [selectedItems]
  );
  useHotkeys(
    "p",
    (e) => {
      e.preventDefault();
      setPointer();
    },
    {},
    [selectedItems]
  );
  useHotkeys(
    "b",
    (e) => {
      e.preventDefault();
      setBrush();
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "e",
    (e) => {
      e.preventDefault();
      setEraser();
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "shift+down",
    (e) => {
      e.preventDefault();
      layerDown(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "ctrl+d",
    (e) => {
      e.preventDefault();
      duplicateItems(selectedItems, createStageDataObject);
    },
    {},
    [selectedItems, stageData]
  );

  useHotkeys(
    "ctrl+c",
    (e) => {
      e.preventDefault();
      copyItems(selectedItems, setClipboard, createStageDataObject);
    },
    {},
    [selectedItems, stageData, clipboard]
  );

  useHotkeys(
    "ctrl+a",
    (e) => {
      e.preventDefault();
      selectAll(stage, onSelectItem);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "ctrl+v",
    (e) => {
      e.preventDefault();
      pasteItems(clipboard);
    },
    {},
    [clipboard]
  );

  useHotkeys(
    "ctrl+z",
    (e) => {
      e.preventDefault();
      goToPast();
    },
    {},
    [goToPast]
  );

  useHotkeys(
    "ctrl+y",
    (e) => {
      e.preventDefault();
      goToFuture();
    },
    {},
    [goToFuture]
  );

  useHotkeys(
    "shift+h",
    (e) => {
      e.preventDefault();
      flipHorizontally(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "shift+v",
    (e) => {
      e.preventDefault();
      flipVertically(selectedItems);
    },
    {},
    [selectedItems]
  );

  useHotkeys(
    "delete",
    (e) => {
      e.preventDefault();
      console.log("In Delete");
      deleteItems(selectedItems, setSelectedItems, transformer.transformerRef);
    },
    { enabled: Boolean(selectedItems.length) },
    [selectedItems, transformer.transformerRef.current]
  );

  useEffect(() => {
    const storedStageDataList = JSON.parse(localStorage.getItem("StageDataList") || "[]");
    if (initialRender && JSON.stringify(storedStageDataList) !== JSON.stringify(stageDataList)) {
      saveStageToLocalStorage();
    } else {
      setInitialRender(true);
    }
  }, [stageDataList, initialRender]);

  useEffect(() => {
    if (getStageFromLocalStorage().length) {
      getStageFromLocalStorage().forEach((stage) => onCreateTab(undefined, stage as StageDataListItem));
      initializeFileDataList(getStageFromLocalStorage());
    } else {
      onCreateTab(undefined, initialStageDataList[0] as StageDataListItem);
      initializeFileDataList(initialStageDataList);
    }
    stage.stageRef.current.setPosition({
      x: Math.max(Math.ceil(stage.stageRef.current.width() - 1280) / 2, 0),
      y: Math.max(Math.ceil(stage.stageRef.current.height() - 760) / 2, 0),
    });
    stage.stageRef.current.batchDraw();
  }, []);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  const auth = useSelector((state: StoreState) => state.auth);

  useEffect(() => {

    const projectId = parseInt(window.location.href.split("/").reverse()[0]);
    if (!isNaN(projectId)) {
      getStageFromServer(projectId).then((stageData) => {

        if (stageData) {

          stageData.forEach((stage) => onCreateTab(undefined, stage as StageDataListItem));
          initializeFileDataList(stageData);
        } else {
          console.log("PROJECT NOT FOUND");
        }

        stage.stageRef.current.setPosition({
          x: Math.max(Math.ceil(stage.stageRef.current.width() - 1280) / 2, 0),
          y: Math.max(Math.ceil(stage.stageRef.current.height() - 760) / 2, 0),
        });
        stage.stageRef.current.batchDraw();

      });
    }

  }, [auth.me]);

  useEffect(() => {
    if (currentTabId) {
      updateFileData({
        id: currentTabId,
        data: stageData,
      });
    }
    recordPast(stageData);
  }, [stageData]);

  const dispatch = useDispatch();

  const page = useSelector((state: StoreState) => state.page);

  const { socket } = useSocket();

  useEffect(() => {
    if (page.current !== -1) {
      socket?.emit('join_project', { projectId: page.current });
    }

    if (socket) {
      socket.on('joined', ({ projectId }) => {
        console.log('joined to', projectId, 'project');
      });

      socket.on('createItem', (data: { from: string, item: any }) => {

        if (String(auth.me.id) !== data.from) {
          createItem(data.item as StageData, false);
        }

      });

      socket.on('updateItem', (data: { from: string, item: any }) => {

        if (String(auth.me.id) !== data.from) {
          updateItem(data.item.id,  () => ({
            ...data.item.attrs,
          }), false);
          // createItem(data.item as StageData, false);
        }

      });

      socket.on('removeItem', (data: { from: string, itemId: string | string[] }) => {

        if (String(auth.me.id) !== data.from) {
          removeItem(data.itemId, false);
          // createItem(data.item as StageData, false);
        }

      })

      return () => {
        socket.off('joined');
        socket.off('createItem');
        socket.off('updateItem');
        socket.off('removeItem');
      }
    }


  }, [page.current, socket]);


  const newLayout = <Layout header={header} navBar={navBar} settingBar={settingBar}>
    {hotkeyModal}
    <View onSelect={onSelectItem} stage={stage}>
      {stageData.length ? stageData.map((item) => renderObject(item)) : null}
      <Transformer
        ref={transformer.transformerRef}
        keepRatio
        shouldOverdrawWholeArea
        boundBoxFunc={(_, newBox) => newBox}
        onTransformEnd={transformer.onTransformEnd}
      />
    </View>
  </Layout>;


  const routes = useRoutes(
    { header, navBar, settingBar, hotkeyModal, onSelectItem, stage, stageData, transformer, renderObject }
  );

  return (
    <BrowserRouter>
      {routes}
    </BrowserRouter>
  );
}

export default App;
