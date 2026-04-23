import { buildClbrLogo, type ClbrLogoProps } from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type LogoProps = ClbrLogoProps & NativeAttrsFor<HTMLDivElement>;

export function Logo(props: LogoProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrLogo(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
