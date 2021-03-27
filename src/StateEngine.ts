import * as yup from 'yup';
import { transformAll } from "@overgear/yup-ast";
import { AstObjectShape, CompiledFlow, CompiledState, Flow, StateEngineInterface, StateID, StateSchema, UserInput } from "./types";
import "./mvp";

export class StateEngine implements StateEngineInterface {
  private flow: Flow;
  private compiledFlow: CompiledFlow;
  private currentStateList: StateID[] = [];
  
  setFlow(userFlow: Flow): void {
    this.flow = userFlow;
    return;
  }

  run(data: UserInput): StateID[] {
    this.clearCurrentStateList();
    return this.runTree(data, [this.compiledFlow.initialState]);
  }

  compile(): void {
    this.compiledFlow = compileFlow(this.flow);
  }

  private clearCurrentStateList = () => this.currentStateList = [];

  private checkState = (data: UserInput, state: CompiledState): Promise<boolean> => {
    const yupAst = getYupAstFromStateSchema(state.schema);
    const validator = transformAll(yupAst);
    return validator.isValidSync(data);    
  }

  private runTree = (data: UserInput, statesToCheck: StateID[]): StateID[] => {
    statesToCheck.forEach((stateId) => {
      const state = findState(stateId, this.compiledFlow.states);
      const stateFulfilled = this.checkState(data, state);
      if (stateFulfilled) return this.runTree(data, state.to);      
      this.currentStateList.push(state.id);
    });
    return this.currentStateList;
  }
}

export const getYupAstFromStateSchema = (schema: StateSchema): AstObjectShape => {
  const shape = Object.keys(schema).reduce((s, key) => {
    return { 
      ...s,
      [key]: Object
        .keys(schema[key])
        .map((prop) => prop === "type" 
          ? [`yup.${schema[key][prop]}`]
          : [`yup.${prop}`])};
  }, {});
  return [
    ["yup.object"], 
    [
      "yup.shape",
      shape
    ]
  ];
};

export const compileFlow = (flow: Flow): CompiledFlow => {
  const compiledStates: CompiledState[] = flow.states.map(state => ({ 
    ...state,
    to: [ 
      ...flow.links
      .filter((link) => link.from === state.id)
      .map((link) => link.to)
    ],
    from: [
      ...flow.links
      .filter((link) => link.to === state.id)
      .map((link) => link.from)
    ],
  }));

  const { links, ...noLinks } = flow;
  
  return { ...noLinks, states: compiledStates }
};

export const findState = (stateId: StateID, states: CompiledState[]): CompiledState => states.find((state) => state.id === stateId);
