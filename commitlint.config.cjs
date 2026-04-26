module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": [
      2,
      "always",
      ["adapter", "assets", "config", "core", "react", "system", "repo"],
    ],
  },
};
