/* eslint-disable @typescript-eslint/no-namespace */
import { isString, get } from "lodash";

import { styleConfig, contentConfig } from "./propertyConfig";
import type { PropertyPaneControlConfig } from "constants/PropertyControlConstants";

const config = [...contentConfig, ...styleConfig];

declare global {
  namespace jest {
    interface Matchers<R> {
      toBePropertyPaneConfig(): R;
    }
  }
}
const validateControl = (control: Record<string, unknown>) => {
  if (typeof control !== "object") return false;
  const properties = [
    "propertyName",
    "controlType",
    "isBindProperty",
    "isTriggerProperty",
  ];
  properties.forEach((prop: string) => {
    if (!control.hasOwnProperty(prop)) {
      return false;
    }
    const value = control[prop];
    if (isString(value) && value.length === 0) return false;
  });
  return true;
};

const validateSection = (section: Record<string, unknown>) => {
  if (typeof section !== "object") return false;
  if (!section.hasOwnProperty("sectionName")) return false;
  const name = section.sectionName;
  if ((name as string).length === 0) return false;
  if (section.children) {
    return (section.children as Array<Record<string, unknown>>).forEach(
      (child) => {
        if (!validateControl(child)) return false;
      },
    );
  }
  return true;
};

expect.extend({
  toBePropertyPaneConfig(received) {
    if (Array.isArray(received)) {
      let pass = true;
      received.forEach((section) => {
        if (!validateSection(section) && !validateControl(section))
          pass = false;
      });
      return {
        pass,
        message: () => "Expected value to be a property pane config internal",
      };
    }
    return {
      pass: false,
      message: () => "Expected value to be a property pane config external",
    };
  },
});

it("Validates Chart Widget's property config", () => {
  expect(config).toBePropertyPaneConfig();
});

describe("Validate Chart Widget's data property config", () => {
  const propertyConfigs: PropertyPaneControlConfig[] = config
    .map((sectionConfig) => sectionConfig.children)
    .flat();

  it("Validates customFusionChartConfig property is visible when chartType is CUSTOM_FUSION_CHART", () => {
    const customFusionChartPropertyConfig = propertyConfigs.filter(
      (propertyConfig) => {
        return propertyConfig.propertyName == "customFusionChartConfig";
      },
    );

    const hiddenFns = customFusionChartPropertyConfig.map(
      (config) => config.hidden,
    ) as unknown as ((props: any) => boolean)[];

    expect(hiddenFns.length).toEqual(1);

    hiddenFns.forEach((fn) => {
      let result = true;
      result = fn({ chartType: "CUSTOM_FUSION_CHART" });
      expect(result).toBeFalsy();
    });
  });

  it("Validates customEChart property is visible when chartType is CUSTOM_ECHART", () => {
    const customEChartPropertyConfig = propertyConfigs.filter(
      (propertyConfig) => {
        return propertyConfig.propertyName == "customEChartConfig";
      },
    );

    const hiddenFns = customEChartPropertyConfig.map(
      (config) => config.hidden,
    ) as unknown as ((props: any) => boolean)[];
    expect(hiddenFns.length).toEqual(1);

    hiddenFns.forEach((fn) => {
      let result = true;
      result = fn({ chartType: "CUSTOM_ECHART" });
      expect(result).toBeFalsy();
    });
  });

  it("Validates that unrelated property configs are hidden when chartType is CUSTOM_FUSION_CHART", () => {
    const configs = propertyConfigs.filter((propertyConfig) => {
      return (
        propertyConfig.propertyName == "customEChartConfig" ||
        propertyConfig.propertyName == "chartData" ||
        propertyConfig.propertyName == "xAxisName" ||
        propertyConfig.propertyName == "yAxisName" ||
        propertyConfig.propertyName == "labelOrientation"
      );
    });
    const hiddenFns = configs.map((config) => config.hidden) as unknown as ((
      props: any,
    ) => boolean)[];
    expect(hiddenFns.length).toEqual(5);

    hiddenFns.forEach((fn) => {
      const result = fn({ chartType: "CUSTOM_FUSION_CHART" });
      expect(result).toBeTruthy();
    });
  });

  it("Validates that unrelated property configs are hidden when chartType is CUSTOM_ECHART", () => {
    const configs = propertyConfigs.filter((propertyConfig) => {
      return (
        propertyConfig.propertyName == "customFusionChartConfig" ||
        propertyConfig.propertyName == "chartData" ||
        propertyConfig.propertyName == "xAxisName" ||
        propertyConfig.propertyName == "yAxisName" ||
        propertyConfig.propertyName == "labelOrientation"
      );
    });
    const hiddenFns = configs.map((config) => config.hidden) as unknown as ((
      props: any,
    ) => boolean)[];
    expect(hiddenFns.length).toEqual(5);

    hiddenFns.forEach((fn) => {
      const result = fn({ chartType: "CUSTOM_ECHART" });
      expect(result).toBeTruthy();
    });
  });

  it("Validates that axis labelOrientation is visible when chartType are LINE_CHART AREA_CHART COLUMN_CHART", () => {
    const allowedChartsTypes = ["LINE_CHART", "AREA_CHART", "COLUMN_CHART"];

    const axisSection = config.find((c) => c.sectionName === "Axis");
    const labelOrientationProperty = (
      axisSection?.children as unknown as PropertyPaneControlConfig[]
    ).find((p) => p.propertyName === "labelOrientation");

    allowedChartsTypes.forEach((chartType) => {
      const result = labelOrientationProperty?.hidden?.({ chartType }, "");
      expect(result).toBeFalsy();
    });
  });

  it("validates the datasource field is required in customFusionChartConfig", () => {
    const customFusionChartConfig: any = get(config, "[0].children.[1]");
    const dataSourceValidations =
      customFusionChartConfig.validation.params.allowedKeys[1];

    expect(dataSourceValidations.params.required).toEqual(true);
    expect(dataSourceValidations.params.ignoreCase).toEqual(false);
  });
});
