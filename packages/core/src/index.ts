import "./styles.css";

import { defineClbrAlert } from "./components/alert/alert";
import { defineClbrBanner } from "./components/banner/banner";
import { defineClbrMenu } from "./components/menu/menu";
import { defineClbrNav } from "./components/nav/nav";
import { defineClbrRange } from "./components/range/range";
import { defineClbrSidebar } from "./components/sidebar/sidebar";

/**
 * Defines all available Calibrate runtime custom elements.
 *
 * Safe to call multiple times. Each component-level define function is
 * responsible for guarding its own registration.
 */
export function defineClbrComponents(): void {
  defineClbrAlert();
  defineClbrBanner();
  defineClbrMenu();
  defineClbrNav();
  defineClbrRange();
  defineClbrSidebar();
}

export type {
  ClbrAlign,
  ClbrControlSize,
  ClbrHeadingLevel,
  ClbrInlineSize,
  ClbrStatusTone,
} from "./types";

export { type ClbrNode, serializeClbrNode } from "./helpers/node";

export {
  buildClbrAlert,
  CLBR_ALERT_EVENT_BEFORE_DISMISS,
  CLBR_ALERT_EVENT_DISMISS,
  CLBR_ALERT_SPEC,
  CLBR_ALERT_TAG_NAME,
  defineClbrAlert,
  type ClbrAlertProps,
  renderClbrAlert,
} from "./components/alert/alert";

export {
  buildClbrBanner,
  CLBR_BANNER_EVENT_BEFORE_DISMISS,
  CLBR_BANNER_EVENT_DISMISS,
  CLBR_BANNER_SPEC,
  CLBR_BANNER_TAG_NAME,
  defineClbrBanner,
  type ClbrBannerProps,
  renderClbrBanner,
} from "./components/banner/banner";

export {
  buildClbrAvatar,
  CLBR_AVATAR_SPEC,
  getClbrInitials,
  type ClbrAvatarColor,
  type ClbrAvatarEntity,
  type ClbrAvatarProps,
  type ClbrAvatarSize,
  renderClbrAvatar,
} from "./components/avatar/avatar";

export {
  buildClbrBadge,
  CLBR_BADGE_SPEC,
  type ClbrBadgeProps,
  type ClbrBadgeSize,
  renderClbrBadge,
} from "./components/badge/badge";

export {
  buildClbrBlockquote,
  CLBR_BLOCKQUOTE_SPEC,
  type ClbrBlockquoteProps,
  type ClbrBlockquoteSize,
  renderClbrBlockquote,
} from "./components/blockquote/blockquote";

export {
  buildClbrBox,
  CLBR_BOX_SPEC,
  type ClbrBoxBackground,
  type ClbrBoxPadding,
  type ClbrBoxProps,
  type ClbrBoxRadius,
  renderClbrBox,
} from "./components/box/box";

export {
  buildClbrButton,
  CLBR_BUTTON_SPEC,
  type ClbrButtonAppearance,
  type ClbrButtonCommonProps,
  type ClbrButtonElementProps,
  type ClbrButtonHasPopup,
  type ClbrButtonLabelVisibility,
  type ClbrButtonLinkProps,
  type ClbrButtonMode,
  type ClbrButtonPlacement,
  type ClbrButtonProps,
  type ClbrButtonSize,
  type ClbrButtonTone,
  type ClbrButtonType,
  renderClbrButton,
} from "./components/button/button";

export {
  buildClbrCard,
  CLBR_CARD_SPEC,
  type ClbrCardProps,
  renderClbrCard,
} from "./components/card/card";

export {
  buildClbrCheckbox,
  CLBR_CHECKBOX_SPEC,
  type ClbrCheckboxProps,
  renderClbrCheckbox,
} from "./components/checkbox/checkbox";

export {
  buildClbrContainer,
  CLBR_CONTAINER_SPEC,
  type ClbrContainerGutter,
  type ClbrContainerMaxInlineSize,
  type ClbrContainerProps,
  renderClbrContainer,
} from "./components/container/container";

export {
  buildClbrDetails,
  CLBR_DETAILS_SPEC,
  type ClbrDetailsProps,
  renderClbrDetails,
} from "./components/details/details";

export {
  buildClbrDivider,
  CLBR_DIVIDER_SPEC,
  type ClbrDividerOrientation,
  type ClbrDividerTone,
  type ClbrDividerProps,
  renderClbrDivider,
} from "./components/divider/divider";

export {
  buildClbrExpander,
  CLBR_EXPANDER_SPEC,
  type ClbrExpanderProps,
  type ClbrExpanderSize,
  renderClbrExpander,
} from "./components/expander/expander";

export {
  buildClbrFieldset,
  CLBR_FIELDSET_SPEC,
  type ClbrFieldsetProps,
  renderClbrFieldset,
} from "./components/fieldset/fieldset";

export {
  buildClbrFigure,
  CLBR_FIGURE_SPEC,
  type ClbrFigureProps,
  renderClbrFigure,
} from "./components/figure/figure";

export {
  buildClbrGrid,
  buildClbrGridItem,
  CLBR_GRID_ITEM_SPEC,
  CLBR_GRID_SPEC,
  type ClbrGridGap,
  type ClbrGridItemProps,
  type ClbrGridProps,
  type ClbrGridTrack,
  renderClbrGrid,
  renderClbrGridItem,
} from "./components/grid/grid";

export {
  buildClbrHeading,
  CLBR_HEADING_SPEC,
  type ClbrHeadingProps,
  type ClbrHeadingSize,
  renderClbrHeading,
} from "./components/heading/heading";

export {
  buildClbrIcon,
  CLBR_ICON_RECOMMENDED,
  CLBR_ICON_SPEC,
  type ClbrIconMirrorMode,
  type ClbrIconProps,
  type ClbrIconSize,
  renderClbrIcon,
} from "./components/icon/icon";

export {
  buildClbrImage,
  CLBR_IMAGE_SPEC,
  type ClbrImageAspectRatio,
  type ClbrImageGravity,
  type ClbrImageProps,
  type ClbrImageRadius,
  type ClbrImageSource,
  renderClbrImage,
} from "./components/image/image";

export {
  buildClbrInline,
  CLBR_INLINE_SPEC,
  type ClbrInlineGap,
  type ClbrInlineJustify,
  type ClbrInlineProps,
  renderClbrInline,
} from "./components/inline/inline";

export {
  buildClbrInput,
  CLBR_INPUT_SPEC,
  type ClbrInputProps,
  type ClbrInputType,
  renderClbrInput,
} from "./components/input/input";

export {
  buildClbrLogo,
  CLBR_LOGO_SPEC,
  type ClbrLogoProps,
  type ClbrLogoSize,
  type ClbrLogoTone,
  type ClbrLogoVariant,
  renderClbrLogo,
} from "./components/logo/logo";

export {
  buildClbrLink,
  CLBR_LINK_SPEC,
  type ClbrLinkProps,
  type ClbrLinkSize,
  type ClbrLinkTarget,
  type ClbrLinkTone,
  renderClbrLink,
} from "./components/link/link";

export {
  buildClbrMenu,
  CLBR_MENU_EVENT_CHOOSE,
  CLBR_MENU_SPEC,
  CLBR_MENU_TAG_NAME,
  defineClbrMenu,
  type ClbrMenuItem,
  type ClbrMenuProps,
  renderClbrMenu,
} from "./components/menu/menu";

export {
  buildClbrNav,
  CLBR_NAV_TAG_NAME,
  CLBR_NAV_SPEC,
  defineClbrNav,
  type ClbrNavItem,
  type ClbrNavProps,
  renderClbrNav,
} from "./components/nav/nav";

export {
  buildClbrPanel,
  CLBR_PANEL_SPEC,
  type ClbrPanelPadding,
  type ClbrPanelProps,
  renderClbrPanel,
} from "./components/panel/panel";

export {
  buildClbrPage,
  CLBR_PAGE_SPEC,
  type ClbrPageProps,
  type ClbrPageStickyHeader,
  renderClbrPage,
} from "./components/page/page";

export {
  buildClbrPattern,
  CLBR_PATTERN_SPEC,
  type ClbrPatternProps,
  type ClbrPatternSize,
  type ClbrPatternTone,
  type ClbrPatternVariant,
  renderClbrPattern,
} from "./components/pattern/pattern";

export {
  buildClbrPoster,
  CLBR_POSTER_SPEC,
  type ClbrPosterProps,
  type ClbrPosterSurface,
  renderClbrPoster,
} from "./components/poster/poster";

export {
  buildClbrProse,
  CLBR_PROSE_SPEC,
  type ClbrProseHangingPunctuation,
  type ClbrProseProps,
  renderClbrProse,
} from "./components/prose/prose";

export {
  buildClbrRadios,
  CLBR_RADIOS_SPEC,
  type ClbrRadioItem,
  type ClbrRadiosOrientation,
  type ClbrRadiosProps,
  renderClbrRadios,
} from "./components/radios/radios";

export {
  buildClbrRange,
  CLBR_RANGE_SPEC,
  CLBR_RANGE_TAG_NAME,
  defineClbrRange,
  type ClbrRangeProps,
  renderClbrRange,
} from "./components/range/range";

export {
  buildClbrRoot,
  CLBR_ROOT_SPEC,
  type ClbrAppOverscrollBehavior,
  type ClbrBrand,
  type ClbrDirection,
  type ClbrRootProps,
  type ClbrTheme,
  renderClbrRoot,
} from "./components/root/root";

export {
  buildClbrSidebar,
  CLBR_SIDEBAR_SPEC,
  CLBR_SIDEBAR_TAG_NAME,
  defineClbrSidebar,
  type ClbrSidebarAboveNotebook,
  type ClbrSidebarProps,
  type ClbrSidebarSize,
  renderClbrSidebar,
} from "./components/sidebar/sidebar";

export {
  buildClbrStack,
  CLBR_STACK_SPEC,
  type ClbrStackAlign,
  type ClbrStackGap,
  type ClbrStackProps,
  renderClbrStack,
} from "./components/stack/stack";

export {
  buildClbrShape,
  CLBR_SHAPE_SPEC,
  type ClbrShapeProps,
  type ClbrShapeSize,
  type ClbrShapeTone,
  type ClbrShapeVariant,
  renderClbrShape,
} from "./components/shape/shape";

export {
  buildClbrSpinner,
  CLBR_SPINNER_SPEC,
  type ClbrSpinnerProps,
  type ClbrSpinnerSize,
  type ClbrSpinnerTone,
  renderClbrSpinner,
} from "./components/spinner/spinner";

export {
  buildClbrSurface,
  CLBR_SURFACE_SPEC,
  type ClbrSurfaceProps,
  type ClbrSurfaceVariant,
  renderClbrSurface,
} from "./components/surface/surface";

export {
  buildClbrSwitch,
  CLBR_SWITCH_SPEC,
  type ClbrSwitchProps,
  renderClbrSwitch,
} from "./components/switch/switch";

export {
  buildClbrTextarea,
  CLBR_TEXTAREA_SPEC,
  type ClbrTextareaProps,
  type ClbrTextareaResize,
  renderClbrTextarea,
} from "./components/textarea/textarea";

export {
  buildClbrText,
  CLBR_TEXT_SPEC,
  type ClbrTextAs,
  type ClbrTextProps,
  type ClbrTextSize,
  type ClbrTextTone,
  renderClbrText,
} from "./components/text/text";
