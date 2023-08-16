// import type { XAXisComponentOption } from "echarts"
import { LabelOrientation } from "../constants";
import { EChartsLayoutBuilder } from "./EChartsLayoutBuilder";
// import type { GridLayoutConfig } from "./EChartsLayoutBuilder"
// import type { LayoutConfig } from "./EChartsLayoutBuilder"

describe("priority order of layout", () => {
  it("returns the correct priority order", () => {
    const builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: 0,
      labelOrientation: LabelOrientation.AUTO,
      chartType: "LINE_CHART",
    });
    expect(builder.priorityOrderOfInclusion).toEqual([
      "xAxis",
      "legend",
      "title",
      "scrollBar",
    ]);
  });
});

describe("layout configs to include", () => {
  it("includes scroll bar if allow scroll is true", () => {
    const allowScroll = true;
    const builder = new EChartsLayoutBuilder({
      allowScroll: allowScroll,
      height: 0,
      width: 0,
      labelOrientation: LabelOrientation.AUTO,
      chartType: "LINE_CHART",
    });
    const output = builder.configsToInclude(allowScroll, "LINE_CHART");
    expect(output).toEqual(["xAxis", "legend", "title", "scrollBar"]);
  });

  it("excludes scroll bar if allow scroll is false", () => {
    const allowScroll = false;
    const builder = new EChartsLayoutBuilder({
      allowScroll: allowScroll,
      height: 0,
      width: 0,
      labelOrientation: LabelOrientation.AUTO,
      chartType: "LINE_CHART",
    });
    const output = builder.configsToInclude(allowScroll, "LINE_CHART");
    expect(output).toEqual(["xAxis", "legend", "title"]);
  });
});

describe("height of xaxis", () => {
  it("returns correct height label orientation is slant", () => {
    const labelOrientation = LabelOrientation.SLANT;
    const builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: 0,
      labelOrientation: labelOrientation,
      chartType: "LINE_CHART",
    });
    const height = builder.xAxisLayoutBuilder.heightForXAxis();
    expect(height).toEqual(90);
  });

  it("returns correct height label orientation is rotate", () => {
    const labelOrientation = LabelOrientation.ROTATE;
    const builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: 0,
      labelOrientation: labelOrientation,
      chartType: "LINE_CHART",
    });
    const height = builder.xAxisLayoutBuilder.heightForXAxis();
    expect(height).toEqual(100);
  });

  it("returns correct height label orientation is auto", () => {
    const labelOrientation = LabelOrientation.AUTO;
    const builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: 0,
      labelOrientation: labelOrientation,
      chartType: "LINE_CHART",
    });

    const height = builder.xAxisLayoutBuilder.heightForXAxis();
    expect(height).toEqual(70);
  });
});

describe("width of xaxis labels", () => {
  it("returns correct width of labels label orientation is slant", () => {
    const labelOrientation = LabelOrientation.SLANT;
    const builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: 0,
      labelOrientation: labelOrientation,
      chartType: "LINE_CHART",
    });

    const height = builder.xAxisLayoutBuilder.widthForXAxisLabels();
    expect(height).toEqual(50);
  });

  it("returns correct height label orientation is not slant", () => {
    const labelOrientation = LabelOrientation.ROTATE;
    const builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: 0,
      labelOrientation: labelOrientation,
      chartType: "LINE_CHART",
    });

    const height = builder.xAxisLayoutBuilder.widthForXAxisLabels();
    expect(height).toEqual(60);
  });
});

describe("y axis config", () => {
  it("y axis is visible if width is >= minimum width", () => {
    let width = 250;
    let builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: width,
      labelOrientation: LabelOrientation.AUTO,
      chartType: "LINE_CHART",
    });

    let output = builder.yAxisLayoutBuilder.showYAxisConfig();
    expect(output).toEqual(true);

    width = 251;
    builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: width,
      labelOrientation: LabelOrientation.AUTO,
      chartType: "LINE_CHART",
    });
    output = builder.yAxisLayoutBuilder.showYAxisConfig();
    expect(output).toEqual(true);
  });

  it("y axis is not visible if width is < minimum width", () => {
    const width = 99;
    const builder = new EChartsLayoutBuilder({
      allowScroll: false,
      height: 0,
      width: width,
      labelOrientation: LabelOrientation.AUTO,
      chartType: "LINE_CHART",
    });

    const output = builder.yAxisLayoutBuilder.showYAxisConfig();
    expect(output).toEqual(false);
  });
});

describe("layout configs", () => {
  it("generates correct chart layout config", () => {
    const builder = new EChartsLayoutBuilder({
      allowScroll: true,
      height: 400,
      width: 300,
      labelOrientation: LabelOrientation.AUTO,
      chartType: "LINE_CHART",
    });
    const output = builder.showConfigForElements();
    expect(output).toEqual({
      xAxis: {
        show: true,
      },
      legend: {
        show: true,
      },
      title: {
        show: true,
      },
      scrollBar: {
        show: true,
      },
      grid: {
        top: 100,
        bottom: 130,
      },
      yAxis: {
        show: true,
      },
    });
  });
});

// describe("layoutConfig", () => {

//     it("returns no elements if current height is equal to minimumHeight", () => {
//         let elements : LayoutConfig[] = [
//             {
//                 height: 10,
//                 position: "top"
//             },
//             {
//                 height: 10,
//                 position: "bottom"
//             }
//         ]

//         let minimumHeight = 80
//         let heightAvailable = 80
//         const output = builder.layoutConfig(elements, minimumHeight, heightAvailable);

//         expect(output.visibility).toEqual([false, false])
//         expect(output.top).toEqual(0)
//         expect(output.bottom).toEqual(0)
//     })

//     // not inclde lower prirority element even if possible

//     it("includes elements with zero height", () => {
//         let elements : LayoutConfig[] = [
//             {
//                 height: 0,
//                 position: "top"
//             },
//             {
//                 height: 0,
//                 position: "bottom"
//             }
//         ]
//         let minimumHeight = 80
//         let heightAvailable = 80

//         const output = builder.layoutConfig(elements, minimumHeight, heightAvailable);
//         expect(output.visibility).toEqual([true, true])
//         expect(output.top).toEqual(0)
//         expect(output.bottom).toEqual(0)
//     })

//     it("fits as many elements possible within the height available", () => {
//         let elements : LayoutConfig[] = [
//             {
//                 height: 10,
//                 position: "top"
//             },
//             {
//                 height: 30,
//                 position: "bottom"
//             }
//         ]
//         let minimumHeight = 80
//         let heightAvailable = 120

//         const output = builder.layoutConfig(elements, minimumHeight, heightAvailable);
//         expect(output.visibility).toEqual([true, true])
//         expect(output.top).toEqual(10)
//         expect(output.bottom).toEqual(30)
//     })

//     it("excludes elements that can't fit within the height available", () => {
//         let elements : LayoutConfig[] = [
//             {
//                 height: 10,
//                 position: "top"
//             },
//             {
//                 height: 30,
//                 position: "bottom"
//             }
//         ]
//         let minimumHeight = 80
//         let heightAvailable = 100

//         const output = builder.layoutConfig(elements, minimumHeight, heightAvailable);
//         expect(output.visibility).toEqual([true, false])
//         expect(output.top).toEqual(10)
//         expect(output.bottom).toEqual(0)
//     })

//     it("excludes lower priority fitting elements if higher priority elements can't fit", () => {
//         let elements : LayoutConfig[] = [
//             {
//                 height: 30,
//                 position: "top"
//             },
//             {
//                 height: 10,
//                 position: "bottom"
//             }
//         ]
//         let minimumHeight = 80
//         let heightAvailable = 90

//         const output = builder.layoutConfig(elements, minimumHeight, heightAvailable);
//         expect(output.visibility).toEqual([false, false])
//         expect(output.top).toEqual(0)
//         expect(output.bottom).toEqual(0)
//     })
// })

// describe.skip("LayoutBuilder", () => {
//     const builder = new EChartsLayoutBuilder()

//     it("constants are correctly configured", () => {
//         expect(builder.minimumHeight).toEqual(80)
//         expect(builder.minimumWidth).toEqual(250)
//     })

//     it("when component height is >= 80 and < 150, it shows only the chart", () => {
//         let height = 80
//       const props = {
//         allowScroll: true,
//         height: height,
//         width: 250,
//         labelOrientation: LabelOrientation.ROTATE
//         }
//       let config = builder.calculateLayoutConfig(props)

//       expect((config.grid as GridLayoutConfig).top).toEqual(0)
//       expect((config.grid as GridLayoutConfig).bottom).toEqual(0)

//       expect((config.title as XAXisComponentOption).show).toEqual(false)
//       expect((config.legend as XAXisComponentOption).show).toEqual(false)
//       expect((config.scrollBar as XAXisComponentOption).show).toEqual(false)
//       expect((config.xAxis as XAXisComponentOption).show).toEqual(false)

//       height = 149
//       props.height = height

//       config = builder.calculateLayoutConfig(props)

//       expect((config.grid as GridLayoutConfig).top).toEqual(0)
//       expect((config.grid as GridLayoutConfig).bottom).toEqual(0)

//       expect((config.title as XAXisComponentOption).show).toEqual(false)
//       expect((config.legend as XAXisComponentOption).show).toEqual(false)
//       expect((config.scrollBar as XAXisComponentOption).show).toEqual(false)
//       expect((config.xAxis as XAXisComponentOption).show).toEqual(false)
//     })

//     it("when component height is >=150 and < 200, it shows xaxis labels only", () => {
//         let height = 150;
//         const props = {
//             allowScroll: true,
//             height: height,
//             width: 250,
//             labelOrientation: LabelOrientation.ROTATE
//             }

//         let config = builder.calculateLayoutConfig(props)

//     //   expect((config.grid as GridLayoutConfig).top).toEqual(0)
//     //   expect((config.grid as GridLayoutConfig).bottom).toEqual(70)

//       expect((config.xAxis as XAXisComponentOption).show).toEqual(true)
//       expect((config.title as XAXisComponentOption).show).toEqual(false)
//       expect((config.legend as XAXisComponentOption).show).toEqual(false)
//       expect((config.scrollBar as XAXisComponentOption).show).toEqual(false)

//       height = 199
//       props.height = height

//       config = builder.calculateLayoutConfig(props)

//       expect((config.grid as GridLayoutConfig).top).toEqual(0)
//       expect((config.grid as GridLayoutConfig).bottom).toEqual(70)

//       expect((config.xAxis as XAXisComponentOption).show).toEqual(true)
//       expect((config.title as XAXisComponentOption).show).toEqual(false)
//       expect((config.legend as XAXisComponentOption).show).toEqual(false)
//       expect((config.scrollBar as XAXisComponentOption).show).toEqual(false)
//     })
//   })

//   it("when component height >= 200 and < 250, it shows chart, xaxis labels and legend", () => {
//     const props : ChartComponentProps = JSON.parse(JSON.stringify(configProps))
//     props.dimensions.componentHeight = 200

//     const expectedConfig = {
//       showConfig: {
//         title: false,
//         xaxislabels: true,
//         legend: true,
//         allowScroll: false
//       },
//       top: 50,
//       bottom: 70
//     }
//     let output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//     expect(output).toEqual(expectedConfig)

//     props.dimensions.componentHeight = 249
//     output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//     expect(output).toEqual(expectedConfig)
//   })

//   describe("when title is present", () => {
//     describe("when component height >= 250 and < 310, ", () => {
//       it("shows chart, xaxis labels, legend and title", () => {
//         const props : ChartComponentProps = JSON.parse(JSON.stringify(configProps))
//         props.dimensions.componentHeight = 250

//         const expectedConfig = {
//           showConfig: {
//             title: true,
//             xaxislabels: true,
//             legend: true,
//             allowScroll: false
//           },
//           top: 100,
//           bottom: 70
//         }
//         let output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//         expect(output).toEqual(expectedConfig)

//         props.dimensions.componentHeight = 309
//         output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//         expect(output).toEqual(expectedConfig)
//       })
//     })

//     describe("when component height >= 310", () => {
//       describe("allow scroll is true", () => {
//         it("shows chart, xaxis labels, legend, title and scroll bar", () => {
//           const props : ChartComponentProps = JSON.parse(JSON.stringify(configProps))
//           props.dimensions.componentHeight = 310
//           props.allowScroll = true

//           const expectedConfig = {
//             showConfig: {
//               title: true,
//               xaxislabels: true,
//               legend: true,
//               allowScroll: true
//             },
//             top: 100,
//             bottom: 130
//           }
//           let output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//           expect(output).toEqual(expectedConfig)
//           })
//       })
//       describe("allow scroll is false", () => {
//         it("shows chart, xaxislabel, legend and title. skips allow scroll bar", () => {
//           const props : ChartComponentProps = JSON.parse(JSON.stringify(configProps))
//           props.dimensions.componentHeight = 310
//           props.allowScroll = false

//           const expectedConfig = {
//             showConfig: {
//               title: true,
//               xaxislabels: true,
//               legend: true,
//               allowScroll: false
//             },
//             top: 100,
//             bottom: 70
//           }
//           let output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//           expect(output).toEqual(expectedConfig)
//         })
//       })
//     })
//   })

//   describe("when title isn't present", () => {
//     describe("when height >= 250 and < 260", () => {
//       it("shows chart, xaxis labels, legend. skips title and scollbar", () => {
//         const props : ChartComponentProps = JSON.parse(JSON.stringify(configProps))
//         props.dimensions.componentHeight = 250
//         props.chartName = ""

//         const expectedConfig = {
//           showConfig: {
//             title: false,
//             xaxislabels: true,
//             legend: true,
//             allowScroll: false
//           },
//           top: 50,
//           bottom: 70
//         }
//         let output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//         expect(output).toEqual(expectedConfig)

//         props.dimensions.componentHeight = 259
//         output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//         expect(output).toEqual(expectedConfig)
//       })
//     })
//     it("when height >= 260 and allow scroll is false, shows chart, labels and legend. skips title and scrollbar", () => {
//       const props : ChartComponentProps = JSON.parse(JSON.stringify(configProps))
//       props.dimensions.componentHeight = 260
//       props.chartName = ""
//       props.allowScroll = false

//       const expectedConfig = {
//         showConfig: {
//           title: false,
//           xaxislabels: true,
//           legend: true,
//           allowScroll: false
//         },
//         top: 50,
//         bottom: 70
//       }

//       let output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//       expect(output).toEqual(expectedConfig)

//     })

//     it("when height >= 260 and allow scroll is false, shows chart, labels and legend. skips title and scrollbar", () => {
//       const props : ChartComponentProps = JSON.parse(JSON.stringify(configProps))
//       props.dimensions.componentHeight = 260
//       props.chartName = ""
//       props.allowScroll = true

//       const expectedConfig = {
//         showConfig: {
//           title: false,
//           xaxislabels: true,
//           legend: true,
//           allowScroll: true
//         },
//         top: 50,
//         bottom: 130
//       }

//       let output = builder.componentConfiguration(props, minimumHeight, minimumWidth)
//       expect(output).toEqual(expectedConfig)
//     })
//   })

//   describe.only("component width variations", () => {
//     describe("width >= 250", () => {
//       it("shows the yaxis labels", () => {
//         const props = JSON.parse(JSON.stringify(configProps))
//         props.dimensions.componentWidth = 250

//         const expectedConfig = {
//           yAxis: {
//             show: true
//           }
//         }
//         const output = builder.componentConfiguration(configProps, minimumHeight, minimumWidth)
//         expect(output.yAxis).toEqual(expectedConfig.yAxis)
//       })
//     })

//     describe("width < 250", () => {
//       it("hides the yaxis labels", () => {
//         const props = JSON.parse(JSON.stringify(configProps))
//         props.dimensions.componentWidth = 249
//         const expectedConfig = {
//           yAxis: {
//             show: false
//           }
//         }
//         const output = builder.componentConfiguration(configProps, minimumHeight, minimumWidth)
//         expect(output.yAxis).toEqual(expectedConfig.yAxis)
//       })
//     })
//   })
