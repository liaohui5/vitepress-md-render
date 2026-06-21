import MarkdownIt from "markdown-it";
import { MarkdownItAsync } from "markdown-it-async";
import { slugify as defaultSlugify } from "@mdit-vue/shared";
import { restoreEntities } from "./plugins/restoreEntities";
import { preWrapperPlugin } from "./plugins/preWrapper";
import { containerPlugin } from "./plugins/containers";
import { linkPlugin } from "./plugins/link";
import { lineNumberPlugin } from "./plugins/lineNumbers";
import { gitHubAlertsPlugin } from "./plugins/githubAlerts";
import { full as emojiPlugin } from "markdown-it-emoji";
import { titlePlugin } from "@mdit-vue/plugin-title";
import { headersPlugin } from "@mdit-vue/plugin-headers";
import { tocPlugin } from "@mdit-vue/plugin-toc";
import { highlightFactory } from "./plugins/highlight";
import attrsPlugin from "markdown-it-attrs";
import mditCjkFriendly from "markdown-it-cjk-friendly";
import anchorPlugin from "markdown-it-anchor";
import todoList from "markdown-it-todo-lists";

// @ts-ignore
import "./styles/main.css";

export async function createMarkdownRender() {
  const highlight = await highlightFactory();

  // @ts-ignore
  const md = new MarkdownItAsync({
    html: true,
    xhtmlOut: true,
    breaks: false,
    linkify: true,
    typographer: true,
    highlight: highlight,
  });

  md.linkify.set({ fuzzyLink: false });
  restoreEntities(md);
  preWrapperPlugin(md, { codeCopyButtonTitle: "Copy" });
  containerPlugin(md);
  linkPlugin(md, { target: "_blank", rel: "noreferrer" }, "/", defaultSlugify);
  lineNumberPlugin(md, true);

  const tableOpen = md.renderer.rules.table_open;
  md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    if (token.attrIndex("tabindex") < 0) token.attrPush(["tabindex", "0"]);
    return tableOpen
      ? tableOpen(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };

  gitHubAlertsPlugin(md);
  attrsPlugin(md as MarkdownIt);
  emojiPlugin(md as MarkdownIt);
  anchorPlugin(md as MarkdownIt, {
    slugify: defaultSlugify,
    getTokensText: (tokens: any) => {
      return tokens
        .filter((t: any) => !["html_inline", "emoji"].includes(t.type))
        .map((t: any) => t.content)
        .join("");
    },
    permalink: (slug, _, state, idx) => {
      const title =
        state.tokens[idx + 1]?.children
          ?.filter((token) => ["text", "code_inline"].includes(token.type))
          .reduce((acc, t) => acc + t.content, "")
          .trim() || "";

      const linkTokens = [
        Object.assign(new state.Token("text", "", 0), { content: " " }),
        Object.assign(new state.Token("link_open", "a", 1), {
          attrs: [
            ["class", "header-anchor"],
            ["href", `#${slug}`],
            ["aria-label", `Permalink to “${title}”`],
          ],
        }),
        Object.assign(new state.Token("html_inline", "", 0), {
          content: "&#8203;",
          meta: { isPermalinkSymbol: true },
        }),
        new state.Token("link_close", "a", -1),
      ];
      state.tokens[idx + 1].children?.push(...linkTokens);
    },
  });

  headersPlugin(md as MarkdownIt, {
    level: [2, 3, 4, 5, 6],
    slugify: defaultSlugify,
  });
  titlePlugin(md as MarkdownIt);
  tocPlugin(md as MarkdownIt, {
    slugify: defaultSlugify,
    format: (s) => s.replaceAll("&amp;", "&"), // encoded twice because of restoreEntities
  });

  mditCjkFriendly(md as MarkdownIt);
  md.use(todoList);
  return md;
}

export async function renderAsyncWithPatch(
  md: MarkdownItAsync,
  markdownContent: string,
): Promise<string> {
  const html = await md.renderAsync(markdownContent);
  return `<div class="VPDoc vp-doc">${html}</div>
<script>
document.querySelectorAll('.vp-code-group > .blocks').forEach((el) => {
  Array.from(el.children).forEach((child) => {
    child.classList.remove('active')
  })
  activate(el.children[0])
})
function activate(el) {
  el.classList.add('active')
  window.dispatchEvent(new CustomEvent('vitepress:codeGroupTabActivate', { detail: el }))
}
window.addEventListener('click', (e) => {
  const el = e.target
  if (el.matches('.vp-code-group input')) {
    // input <- .tabs <- .vp-code-group
    const group = el.parentElement?.parentElement
    if (!group) return
    const i = Array.from(group.querySelectorAll('input')).indexOf(el)
    if (i < 0) return
    const blocks = group.querySelector('.blocks')
    if (!blocks) return
    const current = Array.from(blocks.children).find((child) =>child.classList.contains('active'))
    if (!current) return
    const next = blocks.children[i]
    if (!next || current === next) return
    current.classList.remove('active')
    activate(next)
    const label = group?.querySelector(\`label[for="$\{el.id\}"]\`)
    label?.scrollIntoView({ block: 'nearest' })
  }
})
</script>`;
}
