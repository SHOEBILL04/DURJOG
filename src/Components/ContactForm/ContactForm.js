import { useState } from 'react';  
import './ContactForm.css';

export default function Contact() {
  const [result, setResult] = useState(null);  

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    formData.append("access_key", "82db7e58-4468-4277-9723-e35311bf0bf2");

    const response = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
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