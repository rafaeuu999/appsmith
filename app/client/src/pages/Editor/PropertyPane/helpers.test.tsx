import { widgetCallouts } from "./helpers";
import ChartWidget, { CONFIG as ChartWidgetConfig } from "widgets/ChartWidget";
import { registerWidget } from "utils/WidgetRegisterHelpers";
import type { ChartData } from "widgets/ChartWidget/constants";
import type { ChartWidgetProps } from "widgets/ChartWidget/widget";
import { RenderModes } from "constants/WidgetConstants";
import { LabelOrientation } from "widgets/ChartWidget/constants";

describe("WidgetCallouts", () => {
  const seriesData1: ChartData = {
    seriesName: "series1",
    data: [{ x: "x1", y: 1 }],
    color: "series1color",
  };
  const seriesData2: ChartData = {
    seriesName: "series2",
    data: [{ x: "x1", y: 2 }],
    color: "series2color",
  };

  const defaultProps: ChartWidgetProps = {
    allowScroll: true,
    chartData: {
      seriesID1: seriesData1,
      seriesID2: seriesData2,
    },
    chartName: "chart name",
    type: "CHART_WIDGET",
    chartType: "AREA_CHART",
    customEChartConfig: {},
    customFusionChartConfig: { type: "type", dataSource: undefined },
    hasOnDataPointClick: true,
    isVisible: true,
    isLoading: false,
    setAdaptiveYMin: false,
    labelOrientation: LabelOrientation.AUTO,
    onDataPointClick: "",
    widgetId: "widgetID",
    xAxisName: "xaxisname",
    yAxisName: "yaxisname",
    borderRadius: "1",
    boxShadow: "1",
    primaryColor: "primarycolor",
    fontFamily: "fontfamily",
    dimensions: { componentWidth: 11, componentHeight: 11 },
    parentColumnSpace: 1,
    parentRowSpace: 1,
    topRow: 0,
    bottomRow: 0,
    leftColumn: 0,
    rightColumn: 0,
    widgetName: "widgetName",
    version: 1,
    renderMode: RenderModes.CANVAS,
  };

  registerWidget(ChartWidget, ChartWidgetConfig);

  it("returns widget callouts for a widget type", () => {
    const props = JSON.parse(JSON.stringify(defaultProps));
    props.chartType = "CUSTOM_FUSION_CHART";
    const hidden = false;

    const messages = widgetCallouts(props);
    expect(messages).toEqual([
      {
        message:
          "Custom Fusion Charts will stop being supported on March 1st 2024. Change the chart type to E-charts Custom to switch.",
        hidden: hidden,
        links: [
          {
            text: "Learn More",
            url: "https://www.appsmith.com",
          },
        ],
      },
    ]);
  });

  it("hides custom fusion chart deprecation notice if chart type isn't custom fusion charts", () => {
    const props = JSON.parse(JSON.stringify(defaultProps));
    props.chartType = "LINE_CHART";

    const messages = widgetCallouts(props);
    expect(messages).toEqual([]);
  });
});
