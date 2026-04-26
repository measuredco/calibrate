import autoprefixer from "autoprefixer";
import browserslist from "@measured/calibrate-config/browserslist";

export default {
  plugins: [autoprefixer({ overrideBrowserslist: browserslist })],
};
