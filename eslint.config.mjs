// eslint-config-next 16 ships flat config natively.
import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "capture/**", "scripts/**", "next-env.d.ts", "redirects-generated.json", "docs/live-reference/**"],
  },
];

export default eslintConfig;
