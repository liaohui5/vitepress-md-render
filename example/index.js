import { createMarkdownRender, renderAsyncWithPatch } from "../dist/main.mjs";

const markdownContent = `
## base

- item
- item

> ref contents

\`keycode\`

[baidu](https://www.baidu.com)

**bold**

*italic*

- [ ] checkbox
- [x] checkbox
- [ ] checkbox

## table

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## emoji

:tada: :100:

## table of contents

[[toc]]


## containers

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## alerts

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

## Syntax Highlighting in Code Blocks

\`\`\`js
export default {
  name: 'MyComponent',
  // ...
}
\`\`\`

\`\`\`html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
\`\`\`

\`\`\`js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
// 有高亮行
\`\`\`

\`\`\`js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
\`\`\`

\`\`\`js
export default {
  data () {
    return {
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
\`\`\`

## code-group

::: code-group

\`\`\`js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
\`\`\`

\`\`\`ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
\`\`\`

:::
`;

window.onload = async () => {
  const mdRender = await createMarkdownRender();
  const html = await renderAsyncWithPatch(mdRender, markdownContent);
  document.querySelector("#preview").innerHTML = html;
};
