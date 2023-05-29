import Konva from "konva";
import { Filter, Node, NodeConfig } from "konva/lib/Node";
import React, { useEffect, useState } from "react";
import { Col, Figure, Row } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { SettingBarProps } from "..";
import useItem from "../../hook/useItem";
import useI18n from "../../hook/usei18n";
import sizeStyles from "../../style/size.module.css";
import { WidgetKind } from "../Widget";

export type FilterKind = {
  "data-item-type": string;
  id: string;
  colorCode: string;
  selectedItems: Node<NodeConfig>[];
};

type FilterWidgetProps = {
  data: WidgetKind & SettingBarProps;
};

const FilterWidget: React.FC<FilterWidgetProps> = ({ data }) => {
  const { getTranslation } = useI18n();

  return (
    <Col className={[sizeStyles["mx-h-30vh"]].join(" ")}>
      <h6>{getTranslation("widget", "filter", "name")}</h6>
      <ColorPaletteOpacitySlider
        data={{
          "data-item-type": "opacity",
          selectedItems: data.selectedItems,
        }}
      />
      <ColorPaletteBrightnessSlider
        data={{
          "data-item-type": "brightness",
          selectedItems: data.selectedItems,
        }}
      />
      <div className="grid grid-cols-2 gap-4">
        <ColorPaletteFilterToggle
          data={{
            "data-item-type": "filterToggle",
            selectedItems: data.selectedItems,
          }}
        />
      </div>
    </Col>
  );
};

const ColorPaletteOpacitySlider: React.FC<{
  data: Omit<Omit<FilterKind, "colorCode">, "id">;
}> = ({ data }) => {
  const { updateItem } = useItem();
  const { getTranslation } = useI18n();

  const [opacity, setOpacity] = useState(data.selectedItems[0] ? data.selectedItems[0].attrs.opacity * 100 : 100);

  useEffect(() => {
    setOpacity(
      data.selectedItems[0] &&
        data.selectedItems[0].attrs.opacity !== undefined &&
        data.selectedItems[0].attrs.opacity !== null
        ? data.selectedItems[0].attrs.opacity * 100
        : 100
    );
  }, [data.selectedItems]);

  const onChangeOpacity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseInt(e.currentTarget.value));
    if (data.selectedItems.length === 0) {
      return;
    }
    data.selectedItems.forEach((item) => {
      item.opacity(parseInt(e.currentTarget.value) * 0.01);
      item.attrs.opacity = parseInt(e.currentTarget.value) * 0.01;
      updateItem(item.id(), () => item.attrs);
    });
    data.selectedItems[0].getStage()?.batchDraw();
  };

  return (
    <Col>
      <h6>{getTranslation("widget", "colorPalette", "opacity", "name")}</h6>
      <RangeSlider tooltipLabel={(value) => `${value}%`} value={opacity} onChange={onChangeOpacity} />
    </Col>
  );
};

const ColorPaletteBrightnessSlider: React.FC<{
  data: Omit<Omit<FilterKind, "colorCode">, "id">;
}> = ({ data }) => {
  const { updateItem } = useItem();
  const { getTranslation } = useI18n();

  const [brightness, setBrightNess] = useState(
    data.selectedItems[0] && data.selectedItems[0].attrs.brightness ? data.selectedItems[0].attrs.brightness * 100 : 0
  );

  useEffect(() => {
    setBrightNess(
      data.selectedItems[0] &&
        data.selectedItems[0].attrs.brightness !== undefined &&
        data.selectedItems[0].attrs.brightness !== null
        ? data.selectedItems[0].attrs.brightness * 100
        : 0
    );
  }, [data.selectedItems]);

  const onChangeBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightNess(parseInt(e.currentTarget.value));
    if (data.selectedItems.length === 0) {
      return;
    }
    data.selectedItems.forEach((item) => {
      item.brightness(parseInt(e.currentTarget.value) * 0.01);
      item.attrs.brightness = parseInt(e.currentTarget.value) * 0.01;
      updateItem(item.id(), () => item.attrs);
    });
    data.selectedItems[0].getStage()?.batchDraw();
  };

  return (
    <Col>
      <h6>{getTranslation("widget", "colorPalette", "brightness", "name")}</h6>
      <RangeSlider tooltipLabel={(value) => `${value}%`} value={brightness} onChange={onChangeBrightness} />
    </Col>
  );
};

const FilterOptions = {
  Grayscale: Konva.Filters.Grayscale,
  Sepia: Konva.Filters.Sepia,
  Invert: Konva.Filters.Invert,
  Solarize: Konva.Filters.Solarize,
  Noise: Konva.Filters.Noise,
  Pixelate: Konva.Filters.Pixelate,
};

const ColorPaletteFilterToggle: React.FC<{
  data: Omit<Omit<FilterKind, "colorCode">, "id">;
}> = ({ data }) => {
  const { updateItem } = useItem();
  const { getTranslation } = useI18n();
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);

  const filterOptions = Object.values(FilterOptions);

  useEffect(() => {
    const initialFilters = filterOptions.filter((filter) => {
      return data.selectedItems.every((item) => item.filters()?.find((f) => f === filter));
    });
    setSelectedFilters(initialFilters);
  }, [data.selectedItems]);

  const toggleFilter = (filter: Filter) => {
    const isFilterSelected = selectedFilters.includes(filter);

    let newFilters: Filter[] = [];
    if (isFilterSelected) {
      newFilters = selectedFilters.filter((f) => f !== filter);
    } else {
      newFilters = [...selectedFilters, filter];
    }
    setSelectedFilters(newFilters);

    if (data.selectedItems.length === 0) {
      return;
    }

    data.selectedItems.forEach((item) => {
      const currentFilters = item.filters();
      if (currentFilters) {
        if (isFilterSelected) {
          item.filters(currentFilters.filter((f) => f !== filter));
        } else {
          item.filters([...currentFilters, filter]);
        }
      }
    });

    const updatedFilters = newFilters.map((f) => f.name);
    data.selectedItems.forEach((item) => {
      updateItem(item.id(), () => ({
        ...item.attrs,
        _filters: updatedFilters,
      }));
      item.getStage()?.batchDraw();
    });
  };

  return (
    <Col>
      <Row>
        {filterOptions.map((filter) => (
          <Col key={filter.name} xs={6} sm={6} md={6} lg={6} xl={6}>
            <div>
              <h6>{getTranslation("widget", "colorPalette", filter.name, "name")}</h6>
              <Figure.Image
                alt={filter.name}
                src={`${process.env.PUBLIC_URL}/assets/filters/${filter.name}.png`}
                onClick={() => toggleFilter(filter)}
                style={{
                  border: selectedFilters.includes(filter) ? "2px solid red" : "none",
                  maxHeight: "80px",
                  maxWidth: "80px",
                }}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Col>
  );
};

export default FilterWidget;
