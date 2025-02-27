import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

const supplierData = {
  Kinto: {
    title: 'Läs mer om Kinto',
    content:
      'Kinto erbjuder flexibla bilabonnemang med ett brett urval av moderna, välunderhållna fordon. Med enkelhet, transparens och konkurrenskraftiga priser gör Kinto det möjligt att hyra en bil utan långsiktiga åtaganden. Företaget erbjuder smidiga alternativ för både privatpersoner och företag, där alla kostnader för service, försäkring och vägassistans ingår, vilket skapar en bekväm och pålitlig mobilitetslösning.'
  },
  iMove: {
    title: 'Läs mer om iMove',
    content:
      'iMove är en innovativ aktör inom flexibla bilabonnemang, som erbjuder ett brett utbud av miljövänliga fordon, inklusive elbilar och hybrider. Med enkel digital bokning, konkurrenskraftiga priser och korta hyresperioder ger iMove både privatpersoner och företag möjlighet att enkelt byta bil efter behov, utan att behöva binda sig till ett långsiktigt åtagande.'
  },
  Hyrdon: {
    title: 'Läs mer om Hyrdon',
    content:
      'Hyrdon erbjuder flexibla och hållbara korttidsleasinglösningar med ett urval av moderna elbilar och hybrider. Med enkel bokning, konkurrenskraftiga priser och ett komplett utbud av tilläggstjänster, ger Hyrdon både privatpersoner och företag en bekväm och miljövänlig bilupplevelse utan långsiktiga bindningar. Alla fordon är fullt försäkrade och underhållna under hela hyresperioden.'
  },
  'Citroen.se': {
    title: 'Läs mer om Citroën korttidsleasing',
    content:
      'Citroën korttidsleasing erbjuder flexibla leasingalternativ för både privatpersoner och företag, med ett brett utbud av moderna och välunderhållna bilar. Med konkurrenskraftiga priser, inkl. service, försäkring och vägassistans, gör Citroën det enkelt att leasa en bil för kortare eller längre perioder. Detta ger en smidig, trygg och kostnadseffektiv lösning för alla mobilitetsbehov.'
  },
  'Peugeot.se': {
    title: 'Läs mer om Peugeot korttidsleasing',
    content:
      'Peugeot korttidsleasing erbjuder flexibla leasingavtal för både privatpersoner och företag, med ett brett urval av moderna, välutrustade bilar. Med transparenta priser, inklusive service, försäkring och vägassistans, erbjuder Peugeot en trygg och bekväm leasingupplevelse för den som behöver en bil under kortare eller längre perioder.'
  },
  'Opel.se': {
    title: 'Läs mer om Opel korttidsleasing',
    content:
      'Opel korttidsleasing erbjuder flexibla och kostnadseffektiva leasingalternativ med ett brett urval av moderna och pålitliga bilar. Med allt inkluderat, såsom försäkring, service och vägassistans, gör Opel det enkelt att leasa en bil för både kort- och långsiktiga behov. Företaget erbjuder en smidig och trygg upplevelse, där alla omkostnader är förutsägbara.'
  },
  Aimo: {
    title: 'Läs mer om Aimo',
    content:
      'Aimo erbjuder flexibla bilabonnemang där du kan leasa en bil för kortare eller längre perioder utan långsiktiga åtaganden. Med ett brett utbud av moderna och hållbara fordon, inklusive elbilar och hybrider, gör Aimo det enkelt för både privatpersoner och företag att hitta en billösning som passar deras behov. Allt från service och försäkring till vägassistans ingår, vilket ger en trygg och smidig mobilitetslösning.'
  },
  Europcar: {
    title: 'Läs mer om Europcar',
    content:
      'Europcar erbjuder ett brett utbud av moderna, välunderhållna fordon och är en ledande aktör inom biluthyrning. Med konkurrenskraftiga priser, flexibla hyresalternativ och ett komplett utbud av tilläggstjänster, garanteras en trygg och professionell hyrupplevelse för både privatpersoner och företag.'
  }
};

const SupplierAccordion = ({ supplier }) => {
  const data = supplierData[supplier];

  if (!data) {
    return null; // Optionally handle unsupported suppliers
  }

  return (
    <Accordion style={{ marginBottom: '1rem' }}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>{data.title}</Accordion.Header>
        <Accordion.Body>
          <p>{data.content}</p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default SupplierAccordion;
