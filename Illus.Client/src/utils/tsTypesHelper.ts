import React from "react";

type FormEvent = React.FormEvent<HTMLFormElement>;

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

type ClickBtnEvent = React.MouseEvent<HTMLButtonElement>;
type ClickDivEvent = React.MouseEvent<HTMLDivElement>;
type ClickLinkEvent = React.MouseEvent<HTMLAnchorElement>;

type ChangeTextareaEvent = React.ChangeEvent<HTMLTextAreaElement>;

type KeyInputEvent = React.KeyboardEvent<HTMLInputElement>;

export type {
  FormEvent,
  ChangeEvent,
  ChangeTextareaEvent,
  ClickBtnEvent,
  ClickDivEvent,
  ClickLinkEvent,
  KeyInputEvent,
};
