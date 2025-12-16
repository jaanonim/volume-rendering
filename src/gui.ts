import { ColorMaps } from "./models/colorMaps.ts";
import { bonsai, fuel, backpack, skull } from "./models/models.ts";
import { updateRenderer } from "./scene.ts";

const models = {
    bonsai,
    fuel,
    backpack,
    skull,
};

const colorMaps = {
    gray: ColorMaps.gray,
    viridis: ColorMaps.viridis,
    hot: ColorMaps.hot,
};

let values = {
    threshold: 0.5,
    model: "fuel",
    colorMap: "gray",
    numberOfSlices: 64,
};

const convertValues = () => {
    return {
        threshold: values.threshold,
        model: models[values.model as keyof typeof models],
        colorMap: colorMaps[values.colorMap as keyof typeof colorMaps],
        numberOfSlices: values.numberOfSlices,
    };
};

const modelEle = document.getElementById("model");
Object.keys(models).map((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.text = key;
    if (key === values.model) option.selected = true;
    modelEle?.appendChild(option);
});
modelEle?.addEventListener("change", (e) => {
    const selectedModel = (e.target as HTMLSelectElement).value;
    values.model = selectedModel;
    updateRenderer(convertValues());
});

const colorMapEle = document.getElementById("colorMap");
Object.keys(colorMaps).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.text = key;
    if (key === values.colorMap) option.selected = true;
    colorMapEle?.appendChild(option);
});
colorMapEle?.addEventListener("change", (e) => {
    const selectedColorMap = (e.target as HTMLSelectElement).value;
    values.colorMap = selectedColorMap;
    updateRenderer(convertValues());
});

const thresholdEle = document.getElementById("threshold") as HTMLInputElement;
thresholdEle.value = values.threshold.toString();
thresholdEle?.addEventListener("input", (e) => {
    const threshold = parseFloat((e.target as HTMLInputElement).value);
    values.threshold = threshold;
    updateRenderer(convertValues());
});

const slicesEle = document.getElementById("slices") as HTMLInputElement;
slicesEle.value = values.numberOfSlices.toString();
slicesEle?.addEventListener("input", (e) => {
    const numberOfSlices = parseInt((e.target as HTMLInputElement).value);
    values.numberOfSlices = numberOfSlices;
    updateRenderer(convertValues());
});

updateRenderer(convertValues());
