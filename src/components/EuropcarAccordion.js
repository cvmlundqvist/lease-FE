import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

const EuropcarAccordion = () => (
  <Accordion style={{ marginBottom: '1rem' }}>
    <Accordion.Item eventKey="0">
      <Accordion.Header>Läs mer om Europcar</Accordion.Header>
      <Accordion.Body>
        <p>
          Europcar är en ledande aktör inom biluthyrning med ett brett utbud av moderna, välunderhållna fordon. Med konkurrenskraftiga priser, flexibla hyresalternativ och ett komplett utbud av tilläggstjänster, erbjuds en trygg och professionell hyrupplevelse.
        </p>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

export default EuropcarAccordion;