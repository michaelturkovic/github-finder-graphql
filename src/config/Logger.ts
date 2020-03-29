import { print } from "graphql";

export default class Logger {
  requestDidStart(requestContext) {
    const {
      operationName,
      parsedQuery,
      queryString,
      request
    } = requestContext;
    const { method, redirect, headers, parsedURL } = request;
    const rawHeaders = headers.raw();
    const query = queryString || print(parsedQuery);

    console.log({ action: "REQUEST", status: "START", operationName, query });
    console.log({
      action: "REQUEST",
      status: "DATA",
      request: {
        method,
        redirect,
        headers: rawHeaders,
        parsedURL
      }
    });
  }

  parsingDidStart({ queryString }) {
    console.log({ action: "PARSING", status: "DATA", queryString });
  }

  willSendResponse({ graphqlResponse }) {
    const { data } = graphqlResponse;
    console.log({ action: "RESPONSE", status: "DATA", data });
  }

  didEncounterErrors(error) {
    console.log({ action: "ERROR", status: "FAILED", error });
  }
}