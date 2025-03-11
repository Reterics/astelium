import {SelectOption} from "../components/SelectComponent.tsx";


export const lineVatRateSimplified: SelectOption[] = [
  {label:"AAM", value: "0"},
  {label:"27%", value: "0.2126"},
  {label:"18%", value: "0.1525"},
  {label:"5%", value: "0.0476"},
  {label:"0", value: "0"},
  {label:"TAM", value: "0"}
];

export const lineVatRateNormal: SelectOption[] = [
  {label:"AAM", value: "0"},
  {label:"27%", value: "0.27"},
  //{label:"25%", value: "0.25"},
  //{label:"20%", value: "0.20"},
  {label:"18%", value: "0.18"},
  //{label:"12%", value: "0.12"},
  //{label:"7%", value: "0.07"},
  {label:"5%", value: "0.05"},
  {label:"0%", value: "0"},
  {label:"TAM", value: "0"}
]
