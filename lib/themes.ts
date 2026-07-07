export interface HeatmapTheme {
  id: string;
  name: string;
  background: string;
  /** 5 levels: 0 = empty, 1–4 = contributions */
  levels: [string, string, string, string, string];
  textColor?: string;
}

export const THEMES: HeatmapTheme[] = [
  {
    id: "default-dark",
    name: "GitHub",
    background: "#161B22",
    levels: ["#161B22", "#0E4429", "#006D32", "#26A641", "#39D353"],
    textColor: "#e6edf3",
  },
  {
    id: "cherry",
    name: "Cherry",
    background: "#1C1113",
    levels: ["#1C1113", "#700512", "#A80B20", "#E31E3D", "#FCA1B0"],
    textColor: "#ffeff2",
  },
  {
    id: "mint",
    name: "Mint",
    background: "#111D1C",
    levels: ["#111D1C", "#1A4740", "#2D7568", "#4DA393", "#A8F2E2"],
    textColor: "#eefaf7",
  },
  {
    id: "coral",
    name: "Coral",
    background: "#21130E",
    levels: ["#21130E", "#592317", "#8F3E2B", "#CF644C", "#FCAE9D"],
    textColor: "#fff0eb",
  },
  {
    id: "slate",
    name: "Slate",
    background: "#161A22",
    levels: ["#161A22", "#3A4659", "#5C6F8C", "#8CA7CF", "#D8E5F8"],
    textColor: "#f0f4fa",
  },
  {
    id: "gold",
    name: "Gold",
    background: "#1D1813",
    levels: ["#1D1813", "#4F3A18", "#82632B", "#B89344", "#EBD17F"],
    textColor: "#faf6ee",
  },
  {
    id: "neon",
    name: "Neon",
    background: "#0B1A1D",
    levels: ["#0B1A1D", "#08575E", "#03929E", "#00D0E0", "#8CF4FF"],
    textColor: "#e6fcfc",
  },
  {
    id: "rose",
    name: "Rose",
    background: "#211116",
    levels: ["#211116", "#5E192F", "#9C2C50", "#D64775", "#FCA4C0"],
    textColor: "#ffeff3",
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "#09121C",
    levels: ["#09121C", "#143A5C", "#21649C", "#3295DB", "#8FCDFF"],
    textColor: "#e6f3ff",
  },
  {
    id: "forest",
    name: "Forest",
    background: "#0D140E",
    levels: ["#0D140E", "#28442D", "#406E4A", "#5A9A68", "#A5D8B0"],
    textColor: "#edf5ee",
  },
  {
    id: "lavender",
    name: "Lavender",
    background: "#120E17",
    levels: ["#120E17", "#342647", "#533D70", "#765C9E", "#C5B3E6"],
    textColor: "#f6f3fa",
  },
  {
    id: "amber",
    name: "Amber",
    background: "#14100B",
    levels: ["#14100B", "#45321B", "#6E4F25", "#9E7432", "#E6CB85"],
    textColor: "#faf6f0",
  },
  {
    id: "sunset",
    name: "Sunset",
    background: "#140B10",
    levels: ["#140B10", "#571C31", "#992E35", "#D6613C", "#FCD074"],
    textColor: "#fff2f5",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    background: "#0B0C10",
    levels: ["#0B0C10", "#330066", "#6600CC", "#FF007F", "#00FFCC"],
    textColor: "#e6e6e6",
  },
];

export const getTheme = (id: string): HeatmapTheme =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];
