import { compileFlow, getYupAstFromStateSchema } from "./StateEngine";
import { FieldTypes, Flow } from "./types";

const testFlow: Flow = {
  id: "test-flow",
  initialState: "state-1",
  states: [{
    id: "state-1",
    schema: {
      nome: {
        type: FieldTypes.STRING,
        required: true,
      }
    }
  }, {
    id: "state-2",
    schema: {
      email: {
        type: FieldTypes.STRING,
        required: true,
      }
    }
  }, {
    id: "state-3",
    schema: {
      valor: {
        type: FieldTypes.NUMBER,
        required: true,
      }
    }
  }],
  links: [{
    id: "link-1",
    from: "state-1",
    to: "state-2",
  }, {
    id: "link-1",
    from: "state-2",
    to: "state-3",
  }]
};

testFlow.states.map((state) => getYupAstFromStateSchema(state.schema));

console.log(JSON.stringify(compileFlow(testFlow)));