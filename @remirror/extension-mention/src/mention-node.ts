import {
  ExtensionCommandFunction,
  NodeExtension,
  NodeExtensionOptions,
  NodeExtensionSpec,
  Omit,
  replaceText,
  SchemaNodeTypeParams,
  startCase,
} from '@remirror/core';
import { createSuggestionsPlugin, defaultMatcher, SuggestionsPluginProps } from './create-suggestions-plugin';

export interface MentionNodeExtensionOptions
  extends Omit<SuggestionsPluginProps, 'command' | 'decorationsTag'>,
    NodeExtensionOptions {
  mentionClassName?: string;
  /**
   * Allows for multiple mentions extensions to be registered for one editor.
   * The name becomes mention_${type}. If left blank then no type is used.
   */
  type?: string;
  readonly tag?: keyof HTMLElementTagNameMap;
  editable?: boolean;
  selectable?: boolean;
}

export class MentionNode extends NodeExtension<MentionNodeExtensionOptions> {
  /**
   * The name is dynamically generated based on the passed in type.
   */
  get name() {
    const { type } = this.options;
    return `mentions${type ? `${startCase(type)}` : ''}`;
  }

  /**
   * Provide the default options for this extension
   */
  get defaultOptions() {
    return {
      matcher: defaultMatcher,
      appendText: ' ',
      mentionClassName: 'mention',
      extraAttrs: [],
      tag: 'a' as 'a',
      editable: true,
      selectable: false,
    };
  }

  protected init() {
    super.init();
    this.options.suggestionClassName = `suggestion suggestion-${this.options.type}`;
  }

  get schema(): NodeExtensionSpec {
    const {
      type,
      mentionClassName = this.defaultOptions.mentionClassName,
      matcher = this.defaultOptions.matcher,
    } = this.options;
    const mentionClass = `${mentionClassName} ${mentionClassName}-${type}`;
    const dataAttribute = `data-mention-${type}-id`;
    return {
      attrs: {
        id: {},
        label: {},
        ...this.extraAttrs(),
      },
      group: 'inline',
      inline: true,
      selectable: this.options.selectable,
      atom: !this.options.editable,
      parseDOM: [
        {
          tag: `${this.options.tag}[${dataAttribute}]`,
          getAttrs: dom => {
            if (typeof dom === 'string') {
              return false; // string only received when type is a style
            }

            const id = (dom as Element).getAttribute(dataAttribute);
            const label = (dom as HTMLElement).innerText.split(matcher.char).join('');
            return { id, label };
          },
        },
      ],
      toDOM: node => {
        const { id, label, ...attrs } = node.attrs;
        return [
          this.options.tag,
          {
            ...attrs,
            class: mentionClass,
            [dataAttribute]: id,
            // contenteditable: 'true',
          },
          `${label}`,
        ];
      },
    };
  }

  public commands = ({ type }: SchemaNodeTypeParams): ExtensionCommandFunction => attrs =>
    replaceText(null, type, attrs);

  public plugin({ type }: SchemaNodeTypeParams) {
    return createSuggestionsPlugin({
      key: this.pluginKey,
      command: ({ range, attrs, appendText }) => replaceText(range, type, attrs, appendText),
      appendText: this.options.appendText,
      matcher: this.options.matcher,
      onEnter: this.options.onEnter,
      onChange: this.options.onChange,
      onExit: this.options.onExit,
      onKeyDown: this.options.onKeyDown,
      suggestionClassName: this.options.suggestionClassName,
      decorationsTag: this.options.tag,
    });
  }
}