import React from 'react';
import { Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBandage, faCoins, faRoad, faSnowflake } from '@fortawesome/free-solid-svg-icons';
import './PriceAccordion.css';

const defaultAdditionalCosts = [
  { amount: 422, label: 'Bilskatt', icon: faCoins },
  { amount: 300, label: 'Vinterhjul', icon: faSnowflake },
  { amount: 200, label: 'Försäkring', icon: faBandage },
  { amount: 100, label: 'Extra mil', icon: faRoad },
];

const PriceAccordion = ({ productType, totalPrice, additionalCosts = defaultAdditionalCosts }) => {
  let title = '';
  let content = '';

  const productKey = productType.toLowerCase();

  const productMapping = {
    privatleasing: {
      title: `Jämförbart pris privatleasing: ${totalPrice} kr, Hur har vi räknat?`,
      content: `Här förklarar du hur privatleasing-priset är framtaget.
T.ex. vad som ingår och hur du beräknat månadskostnaden.`,
    },
    abonnemang: {
      title: `Jämförbart pris abonnemang: ${totalPrice * 0.75} kr, Hur har vi räknat?`,
      content: `Vi jämför priset på abonnemang mot normalt marknadsfört pris för privatleasing (1000/mil per år).`,
    },
  };

  if (productMapping[productKey]) {
    title = productMapping[productKey].title;
    content = productMapping[productKey].content;
  } else {
    title = `Jämförbart pris: ${totalPrice} kr, Hur har vi räknat?`;
    content = `Standardförklaring om hur priset räknas ut.`;
  }

  // Skapa en prislina med de enskilda priserna separerade med " + "
  const priceLine = additionalCosts.map(cost => `${cost.amount} kr`).join(' + ');

  return (
    <Accordion className="price-accordion">
      <Accordion.Item eventKey="0">
        <Accordion.Header className="price-accordion-header">{title}</Accordion.Header>
        <Accordion.Body className="price-accordion-body">
          <p className="price-content" style={{ whiteSpace: 'pre-line' }}>{content}</p>
          <div className="additional-costs-title">
            <strong>Tillkommande kostnader per månad vid {productKey}</strong>
          </div>
          <p className="price-line">
            <strong>{priceLine}</strong>
          </p>
          <div className="icons-row">
            {additionalCosts.map((cost, index) => (
              <div key={index} className="icon-item">
                <FontAwesomeIcon icon={cost.icon} className="cost-icon" />
                <span className="icon-label">{cost.label}</span>
              </div>
            ))}
          </div>
          <p className="disclaimer">Endast hårdkodat.</p>
          <p className="small-disclaimer">* Privatleasing har normalt bindningstider på 36 månader.</p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default PriceAccordion;
