import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: 3D Rubik's Cube Solver`,
    short_name: SITE_NAME,
    description:
      "Interactive 3D Rubik's Cube solver. Scramble, solve with the Kociemba two-phase algorithm, and watch every move animate.",
    start_url: "/solve",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["games", "education", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  };
}
