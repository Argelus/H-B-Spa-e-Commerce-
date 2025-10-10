import React from 'react'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <div className="row">
      <div className="col-md-8">
        <h1>Contact</h1>
        <ContactForm />
      </div>
      <div className="col-md-4">
        <h5>Info</h5>
        <p>Use this section for addresses or contact details.</p>
      </div>
    </div>
  )
}

