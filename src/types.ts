export type StateID = string;
export type FlowID = string;
export type LinkID = string;

export enum FieldTypes {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

export interface StringField {
  type: FieldTypes.STRING;
  required: boolean;
}

export interface NumberField {
  type: FieldTypes.NUMBER;
  min?: number;
  max?: number;
  required: boolean;
}

export interface BooleanField {
  type: FieldTypes.BOOLEAN;  
  required: boolean;
}

export interface StateSchema {
  [key: string]: StringField | NumberField | BooleanField;
}

export interface State {
  id: StateID;
  schema: StateSchema;
}

export interface Link {
  id: LinkID;
  from: StateID;
  to: StateID;
}

export interface Flow {
  id: FlowID;
  states: State[];
  links: Link[];
  initialState: StateID;
}

export interface UserInput {
  [key: string]: string | number | boolean;
}

export interface StateEngineInterface {
  setFlow: (flow: Flow) => void;
  run: (data: UserInput) => StateID;
}

export type AstObjectShape = [[string], [[string], { [key: string]: [[string]] }]];

export interface CompiledState extends State {
  from: StateID[];
  to: StateID[];
}

export interface CompiledFlow {
  id: FlowID;
  states: CompiledState[];
  initialState: StateID;
}