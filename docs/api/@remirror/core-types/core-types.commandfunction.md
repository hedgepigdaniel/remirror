<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@remirror/core-types](./core-types.md) &gt; [CommandFunction](./core-types.commandfunction.md)

## CommandFunction type

This is the type signature for actions within the prosemirror editor.

<b>Signature:</b>

```typescript
export declare type CommandFunction<GSchema extends EditorSchema = any> = (state: EditorState<GSchema>, dispatch: DispatchFunction<GSchema> | undefined, view: EditorView<GSchema>) => boolean;
```

## Remarks

A command function takes an editor state and optionally a dispatch function that it can use to dispatch a transaction. It should return a boolean that indicates whether it could perform any action.

When no dispatch callback is passed, the command should do a 'dry run', determining whether it is applicable, but not actually performing any action.
