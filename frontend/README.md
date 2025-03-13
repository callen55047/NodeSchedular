# Artist Portal - NodeSchedular

## Overview

The **Artist Portal** is a core component of the **NodeSchedular** platform, designed to empower artists and business owners to manage their workflow, communicate with clients, and streamline their business operations. 
This portal provides full control over an artist's profile, availability, communication, and payment tracking.

This portal is ideal for businesses such as:

- **Tattoo Shops**
- **Hair Salons**
- **Personal Trainers**
- **Freelance Creators**

By centralizing business management in one place, artists can easily customize their settings, 
respond to client inquiries, book appointments, and monitor payments.

Note: This portal is paired with the **clientSchedular** application: `https://github.com/callen55047/ClientSchedular`

---

## Key Features

### 🎨 **Customize Business Settings**
- Set your **working hours**, ensuring clients can only book during your available times.
- Upload and manage **storefront images** that showcase your work or brand.
- Update your **business location** so clients can find you easily.

### 💬 **Client Communication**
- Receive and **respond to inquiries** from potential new clients.
- Engage in **real-time chat** with your clients through an **in-app messaging service**.
- Stay organized with a centralized message inbox.

### 📅 **Appointment Management**
- **Book, reschedule, or cancel appointments** with your clients directly through the portal.
- View a **calendar overview** of your upcoming appointments.
- Sync appointments with your personal calendar (future integration).

### 💸 **Payment Tracking**
- Track **payments** for completed appointments.
- View **payment history** for each client.
- Generate reports to monitor revenue and completed appointments.

---

## Technology Stack

This subproject utilizes a modern technology stack designed to ensure a smooth user experience:

- **NodeJS 18** 
- **React UI**
- **Typescript**

---

## Workflow Structure

#### A standard workflow between the ClientSchedular and Artist Portal applications:

- **Client** sends inquiry
- **Artist** responds to client inquiry
- if accepted, **Artist & Client** messages with about details
- **Artist** sends booking request to client
- **Client** responds to booking request by paying deposit
- if accepted, **Artist** completes booking and requests payment
- **Client** pays for booking in full.