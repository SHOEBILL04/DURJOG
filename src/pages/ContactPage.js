import {ContactCard} from "../Components/ContctCard/ContactCard";
import ContactForm from '../Components/ContactForm/ContactForm';
import './ContactPage.css';

export const ContactPage = () => {
  const contactDetails = [
    { title: "Police Emergency Hotline", number: "999" },
    { title: "Ambulance / Fire & Rescue", number: "999" },
    { title: "Accident Service - Dhaka Medical College", number: "011-2345678" },
    { title: "Police Emergency", number: "011-2233456" }
  ];

  return (
    <div className="contact-page">
      <div className="wrapper">
        <div className="emergency">
          <h2>Emergency Contacts</h2>
          <div className="contact-cards">
            {contactDetails.map((contact, index) => (
              <ContactCard
                key={index}
                title={contact.title}
                number={contact.number}
              />
            ))}
          </div>
        </div>

        <div className="contact-us">
          <ContactForm />
          <p>
            If you have any queries, feel free to contact us via email or phone.
          </p>
          <ul>
            <li>
              <span>Email: </span>user@gmail.com
            </li>
            <li>
              <span>Phone: </span>01234567891
            </li>
            <li>
              <span>Address: </span>141 Love Road, Tejgaon, Dhaka
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};