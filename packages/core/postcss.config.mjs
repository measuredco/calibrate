import browserslist from "@measured/calibrate-config/browserslist";
import autoprefixer from "autoprefixer";

export default {
  plugins: [autoprefixer({ overrideBrowserslist: browserslist })],
};
