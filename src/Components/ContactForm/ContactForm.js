import { useState } from 'react';  
import './ContactForm.css';
import axios from "axios";

export default function Contact() {
  const [result, setResult] = useState(null);  

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    try {
      const {data} = await axios.post("http://localhost:5001/api/contact", {
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
      });
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setResult("Server error, please try again later.");
    }
    
  };
  console.log(result)

  return (
    <div className="contactForm">
      <form onSubmit={onSubmit}>
        <h2>Contact Us</h2>
        Name
        <div className="input">
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            required
          />
        </div>
        Email
        <div className="input">
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            required
          />
        </div>
        Message
        <div className="input">
          <textarea name="message" required />
        </div>
        <br />
        <button type="submit">Send Message</button>
      </form>
      <span
        className={`submit-msg ${
          result === 'Sending...'
            ? 'sending'
            : result === 'Form Submitted Successfully'
            ? 'sent'
            : ''
        }`}
      >
        {result}
      </span>
    </div>
  );
}