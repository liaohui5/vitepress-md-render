## Introduction

a markdown render compatible to vitepress style

## Quick Start

```js
import {
  createMarkdownRender,
  renderAsyncWithPatch,
} from "vitepress-md-render";
import "vitepress-md-render/style.css";

(async () => {
  const mdRender = await createMarkdownRender();
  const html = renderAsyncWithPatch(mdRender, `## hello \nworld`);
  console.log(html); // output: html
})();
```
