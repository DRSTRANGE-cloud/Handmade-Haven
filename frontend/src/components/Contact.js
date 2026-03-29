import React from 'react';
import styled from 'styled-components';
import axios from '../axiosConfig';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { contactItems } from '../constants/contactConstant';

// ✅ MAIN COMPONENT
const Contact = () => {
  return (
    <Container className="section">
      <div className="title">
        <h2>get in touch</h2>
        <div className="underline"></div>
      </div>

      <SectionCenter className="section-center">
        <ContactInfo>
          <p>
            If you have any questions or just want to get in touch, ping us via
            the form.
          </p>

          {contactItems.map((item) => (
            <div key={item.id} className="contact-item">
              <span>{item.icon}</span>
              <h5>{item.title}:</h5>
              <p>{item.description}</p>
            </div>
          ))}
        </ContactInfo>

        <ContactForm />
      </SectionCenter>
    </Container>
  );
};

// ✅ FORM COMPONENT
const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/contact', formData);
      setSuccess(true);

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setLoading(false);
  };

  return (
    <FormContainer>
      <form className="form" onSubmit={handleSubmit}>
        <h4 className="mb-4">
          {success ? 'Message sent successfully!' : 'send me a message'}
        </h4>

        <article>
          <div className="contact-from-control">
            <label>name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="contact-from-control">
            <label>email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </article>

        <div className="contact-from-control">
          <label>subject</label>
          <input name="subject" value={formData.subject} onChange={handleChange} required />
        </div>

        <div className="contact-from-control">
          <label>message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required />
        </div>

        <button className="btn btn-block btn-danger" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'} <FaLongArrowAltRight />
        </button>
      </form>
    </FormContainer>
  );
};

const Container = styled.section`
  .title {
    text-align: center;
    margin: 0 auto 2rem;
    
  }
`;

const SectionCenter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  overflow-x: hidden;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }
`;

const ContactInfo = styled.article`
  max-width: 592px;
  margin: 0 auto;

  .contact-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 1.5rem 0;

    &:last-child {
      border-bottom: none;
    }

    span {
      font-size: 1.25rem;
      background-color: var(--clr-primary-5);
      color: var(--clr-white);
      padding: 0.35rem 0.7rem;
      margin-right: 0.5rem;
      text-align: center;
      border-radius: 50%;
      height: 3rem;
      width: 3rem;

      svg {
        vertical-align: middle;
      }
    }

    h5,
    p {
      margin-bottom: 0;
    }
  }
`;

const FormContainer = styled.article`
  .form {
    background-color: #f5f5f5;
    padding: 3rem 2rem;
    max-width: 592px;
    margin: 0 auto;
    border-radius: var(--radius);

    @media (max-width: 492px) {
      padding: 1.5rem;
    }
  }

  h4 {
    color: var(--clr-primary-2);
    text-align: center;
  }

  .contact-from-control {
    margin: 1rem 0;

    label {
      text-transform: capitalize;
      color: var(--clr-primary-2);
    }

    input,
    textarea {
      margin-top: 0.25rem;
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--clr-grey);
      outline: 0;
      border-radius: var(--radius);
    }

    textarea {
      height: 100px;
      resize: vertical;
      font-family: var(--bodyFont);
    }
  }

  article {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    .contact-from-control {
      margin: 0;
    }
  }

  .btn {
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;

    &:hover {
      background-color: var(--clr-red-dark);
    }
  }
`;

export default Contact;