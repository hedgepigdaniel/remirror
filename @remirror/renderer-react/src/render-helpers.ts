import { EditorView, Selection } from '@remirror/core';

interface CalculatePositionParams {
  view: EditorView;
}

export interface SelectionPosition {
  left: number;
  right: number;
  top: number;
  bottom: number;
  selection: Selection;
}
export const calculateSelectedPosition = ({ view }: CalculatePositionParams): SelectionPosition | null => {
  const { selection } = view.state;

  if (!selection || selection.empty) {
    return null;
  }

  return { ...view.coordsAtPos(selection.$anchor.pos), selection };
};

interface CalculateOffsetParams {
  // top: number;
  // left: number;
  element: HTMLElement;
}

/**
 * Calculates a desired offset for the element. Sends back the top and left params for absolute positioning
 */
export const calculateOffsetPosition = (params: CalculatePositionParams) => ({
  // top,
  // left,
  element,
}: CalculateOffsetParams) => {
  const position = calculateSelectedPosition(params);
  if (!position) {
    return null;
  }

  const { offsetWidth } = element;

  return {
    left: window.innerWidth - offsetWidth < position.left ? position.left - offsetWidth + 20 : position.left,
    top: position.top - 40 > 0 ? position.top - 40 : position.top + 20,
  };
};