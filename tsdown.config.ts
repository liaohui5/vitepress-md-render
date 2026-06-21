import { defineConfig } from "tsdown";

// https://tsdown.dev/
export default defineConfig({
  entry: "src/main.ts", // 入口
  platform: "browser", // 目标代码运行平台
  shims: true, // 兼容代码
  clean: true, // 打包之前清理旧打包记录
  dts: true, // 生成 .d.ts
  format: ["esm", "cjs"], // 生成 mjs 和 cjs
  css: {
    // 打包 css & 压缩
    minify: true,
  },
  exports: true, // 自动生成 package.json 中的 exports 字段
});
