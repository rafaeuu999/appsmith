export type EChartElementLayoutParams = {
  elementName: string;
  height: number;
  position: "top" | "bottom";
};

export class EChartElementVisibilityCalculator {
  static paddingForGrid(padding: number, height: number) {
    if (height < 2 * padding) {
      return height / 2;
    } else {
      return padding;
    }
  }
  static calculateVisibility(
    configs: EChartElementLayoutParams[],
    minimumHeight: number,
    heightParam: number,
    padding: number,
  ) {
    let index = 0;

    const output: Record<string, Record<string, unknown>> = {};

    configs.map((config) => {
      output[config.elementName] = {
        show: false,
      };
    });

    const gridPadding = this.paddingForGrid(padding, heightParam);

    let top = 0;
    let bottom = 0;

    let height = heightParam - 2 * gridPadding;
    let needsTopPadding = true;
    let needsBottomPadding = true;

    while (index < configs.length && height >= minimumHeight) {
      const config = configs[index];

      if (height - config.height >= minimumHeight) {
        height -= config.height;
        if (config.position == "top") {
          top += config.height;
          needsTopPadding = false;
        } else {
          bottom += config.height;
          needsBottomPadding = false;
        }

        output[config.elementName].show = true;
      } else {
        break;
      }
      index = index + 1;
    }

    top += needsTopPadding ? gridPadding : 0;
    bottom += needsBottomPadding ? gridPadding : 0;

    output.grid = {
      top: top,
      bottom: bottom,
    };
    return output;
  }
}
