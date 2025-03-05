import React from 'react';
import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBandage, faCoins, faRoad, faSnowflake } from '@fortawesome/free-solid-svg-icons';


const PriceAccordion = ({ productType, totalPrice }) => {
  let title = '';
  let content = '';

  switch (productType.toLowerCase()) {
    case 'privatleasing':
      title = `Jämförbart pris privatleasing: ${totalPrice} kr, Hur har vi räknat?`;
      content = `Här förklarar du hur privatleasing-priset är framtaget.
T.ex. vad som ingår och hur du beräknat månadskostnaden.`;
      break;

    case 'abonnemang':
      title = `Jämförbart pris för privatleasing: ${totalPrice * 0.75} kr, Hur har vi räknat?`;
      content = `Vi jämför priset på abbonemang mot normalt marknadsfört pris för privatleasing (1000/mil per år).`;
      break;

    default:
      title = `Jämförbart pris: ${totalPrice} kr, Hur har vi räknat?`;
      content = `Standardförklaring om hur priset räknas ut.`;
      break;
  }

  return (
    <Accordion style={{ marginBottom: '1rem' }}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>
          {/* Med white-space: pre-line respekteras radbrytningar i content-strängen */}
          <p style={{ whiteSpace: 'pre-line' }}>{content}</p>
          <b><p>Tillkommande kostnader per månad vid privatleasing</p></b>
          <p style={{fontSize: '30px'}}><b>422 kr  +  300 kr  +  200 kr  +  100 kr</b> </p>
          <FontAwesomeIcon icon={faCoins} />
          <span style={{ marginLeft: '0.3rem' }}>Bilskatt</span>
          <FontAwesomeIcon icon={faSnowflake} style={{ marginLeft: '1.2rem' }}/>
          <span style={{ marginLeft: '0.3rem' }}>Vinterhjul</span>
          <FontAwesomeIcon icon={faBandage} style={{ marginLeft: '1.2rem' }}/>
          <span style={{ marginLeft: '0.3rem' }}>Försäkring</span>
          <FontAwesomeIcon icon={faRoad} style={{ marginLeft: '1.2rem' }}/>
          <span style={{ marginLeft: '0.3rem' }}>Extra mil</span>

        
          <p style={{marginTop: '30px'}}>Endast hårdkodat.</p>
          <p style={{marginTop: '30px', fontSize: '13px'}}>* Privatleasing har normalt bindningstider på 36 månader.</p>

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default PriceAccordion;
