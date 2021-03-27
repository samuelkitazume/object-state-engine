import { AstObjectShape, CompiledFlow, CompiledState, Flow, StateEngineInterface, StateID, StateSchema, UserInput } from "./types";
import "./mvp";

export class StateEngine implements StateEngineInterface {
  private flow: Flow;
  
  setFlow(userFlow: Flow): void {
    this.flow = userFlow;
    return;
  }

  run(data: UserInput): StateID {
    return JSON.stringify(data);
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
      ["yup.shape"],
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
