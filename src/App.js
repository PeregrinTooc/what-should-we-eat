import React from "react";
import "bulma/css/bulma.min.css";
import { Columns, Container, Heading } from "react-bulma-components";

function App() {
  return (
    <Container>
      <Heading>Was wollen wir essen?</Heading>
      <Columns centered={true}>
        <Columns.Column size={"one-quarter"}></Columns.Column>
        <Columns.Column></Columns.Column>
      </Columns>
    </Container>
  );
}

export default App;
