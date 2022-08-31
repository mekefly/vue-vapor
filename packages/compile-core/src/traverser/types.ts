import { NodeType, NodeTypeMap } from "../ast";

export type callbackFn<KEY extends NodeType> = (ast: NodeTypeMap[KEY]) => void;

export type CallbacksValue<KEY extends NodeType> = {
  enter?: callbackFn<KEY>;
  leave?: callbackFn<KEY>;
};

export type Callbacks<Simplify extends boolean = false> = {
  [KEY in NodeType]?: Simplify extends true
    ? CallbacksValue<KEY> | callbackFn<KEY>
    : CallbacksValue<KEY>;
};
