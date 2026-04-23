import {
  buildClbrMenu,
  CLBR_MENU_EVENT_CHOOSE,
  type ClbrMenuProps,
  defineClbrMenu,
} from "@measured/calibrate-core";
import {
  type Ref,
  type RefCallback,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export interface MenuChooseDetail {
  id?: string;
  index: number;
  label: string;
}

export type MenuChooseEvent = CustomEvent<MenuChooseDetail>;
export type MenuChooseHandler = (event: MenuChooseEvent) => void;

export type MenuProps = ClbrMenuProps &
  NativeAttrsFor<HTMLElement> & {
    onChoose?: MenuChooseHandler;
  };

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

export function Menu(props: MenuProps): ReturnType<typeof reactify> {
  const { onChoose, ref: callerRef, ...rest } = props;

  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    defineClbrMenu();
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !onChoose) return;
    const handler = (event: Event) => onChoose(event as MenuChooseEvent);
    el.addEventListener(CLBR_MENU_EVENT_CHOOSE, handler);
    return () => el.removeEventListener(CLBR_MENU_EVENT_CHOOSE, handler);
  }, [onChoose]);

  const mergedRef = useCallback<RefCallback<HTMLElement>>(
    (node) => {
      elRef.current = node;
      assignRef(callerRef, node);
    },
    [callerRef],
  );

  return reactify(buildClbrMenu(props), {
    ...pickNativeExtras(rest as unknown as Record<string, unknown>),
    ref: mergedRef,
  });
}
