import type { ChartType, LabelOrientation } from "../constants";
import { EChartElementVisibilityCalculator } from "./EChartsElementVisibilityCalculator";
import type { EChartElementLayoutParams } from "./EChartsElementVisibilityCalculator";
import { EChartsXAxisLayoutBuilder } from "./EChartsXAxisLayoutBuilder";
import { EChartsYAxisLayoutBuilder } from "./EChartsYAxisLayoutBuilder";

type LayoutProps = {
  allowScroll: boolean;
  height: number;
  width: number;
  labelOrientation: LabelOrientation;
  chartType: ChartType;
};

export class EChartsLayoutBuilder {
  minimumHeight = 80;

  heightForAllowScollBar = 30;
  scrollBarBottomOffset = 30;

  heightForLegend = 50;
  heightForTitle = 50;

  priorityOrderOfInclusion = ["xAxis", "legend", "title", "scrollBar"];

  positionLayoutForElement: Record<string, "top" | "bottom"> = {
    xAxis: "bottom",
    legend: "top",
    title: "top",
    scrollBar: "bottom",
  };

  props: LayoutProps;
  layoutConfig: any;
  xAxisLayoutBuilder: EChartsXAxisLayoutBuilder;
  yAxisLayoutBuilder: EChartsYAxisLayoutBuilder;

  constructor(props: LayoutProps) {
    this.props = props;
    this.xAxisLayoutBuilder = new EChartsXAxisLayoutBuilder(
      this.props.labelOrientation,
      this.props.chartType,
    );
    this.yAxisLayoutBuilder = new EChartsYAxisLayoutBuilder(this.props.width);
    this.layoutConfig = this.showConfigForElements();
  }

  heightForElement = (elementName: string): number => {
    switch (elementName) {
      case "xAxis":
        return this.xAxisLayoutBuilder.heightForXAxis();
      case "legend":
        return this.heightForLegend;
      case "title":
        return this.heightForTitle;
      case "scrollBar":
        return this.layoutHeightForScrollBar();
      default:
        return 0;
    }
  };

  layoutHeightForScrollBar = () => {
    return this.heightForAllowScollBar + this.scrollBarBottomOffset;
  };

  defaultConfigForElements = (): Record<string, Record<string, unknown>> => {
    const config: Record<string, Record<string, unknown>> = {};

    this.priorityOrderOfInclusion.map((elementName) => {
      config[elementName] = {
        show: false,
      };
    });
    config.grid = this.defaultConfigForGrid();

    config.yAxis = this.yAxisLayoutBuilder.config();

    config.xAxis = {
      ...config.xAxis,
      ...this.xAxisLayoutBuilder.configForXAxis(),
    };

    config.scrollBar = {
      ...config.scrollBar,
      bottom: this.scrollBarBottomOffset,
      height: this.heightForAllowScollBar,
    };

    return config;
  };

  showConfigForElements = () => {
    const visibilityConfig = this.visibilityConfigForElements();
    const output = this.defaultConfigForElements();

    Object.keys(visibilityConfig).map((elementName) => {
      const config = visibilityConfig[elementName];

      if (elementName == "grid") {
        output.grid.top = config.top;
        output.grid.bottom = config.bottom;
      } else {
        output[elementName].show = config.show;
      }
    });

    return output;
  };

  visibilityConfigForElements = () => {
    const calculationConfig: EChartElementLayoutParams[] = [];
    this.configsToInclude(this.props.allowScroll, this.props.chartType).forEach(
      (element) => {
        calculationConfig.push({
          elementName: element,
          position: this.positionLayoutForElement[element],
          height: this.heightForElement(element),
        });
      },
    );
    const padding = 30;
    return EChartElementVisibilityCalculator.calculateVisibility(
      calculationConfig,
      this.minimumHeight,
      this.props.height,
      padding,
    );
  };

  defaultConfigForGrid() {
    return {
      top: 0,
      bottom: 0,
      left: this.yAxisLayoutBuilder.gridLeftOffset(),
    };
  }

  configsToInclude(allowScroll: boolean, chartType: ChartType) {
    return this.priorityOrderOfInclusion.filter((configName) => {
      if (configName == "scrollBar") {
        return allowScroll;
      }
      if (configName == "xAxis") {
        return chartType != "PIE_CHART";
      }
      return true;
    });
  }
}
