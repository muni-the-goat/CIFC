import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { inquiryTypes, imagery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Get in touch with Canadia Impact Fund for partnerships, investment proposals, media inquiries, or general questions about our work.",
  alternates: { canonical: "/contact-us" },
};

export default function Contact() {
  return (
    <>
      <PageHero
        lead="Let’s Build"
        tail="Impact Together"
        lede="We welcome partnerships, proposals, and conversations that drive meaningful change."
      />

      <section className="container section section--after-hero contact">
        {/* TODO: Webflow’s form handler does not come across. Wire this to a
            Route Handler (app/api/contact/route.ts) plus Resend/Postmark
            before DNS cutover — this form is currently the only way to
            reach the fund. See audit finding B1. */}
        <form className="form" method="post" action="/api/contact">
          <div className="form__row">
            <label className="field">
              <span className="field__label">Full name</span>
              <input className="field__input" name="name" type="text" placeholder="Ex. John Doe" required />
            </label>
          </div>

          <div className="form__row form__row--2">
            <label className="field">
              <span className="field__label">Email</span>
              <input className="field__input" name="email" type="email" placeholder="example@gmail.com" required />
            </label>
            <label className="field">
              <span className="field__label">Phone</span>
              <input className="field__input" name="phone" type="tel" placeholder="(+855) 12 345 6789" />
            </label>
          </div>

          <div className="form__row">
            <label className="field">
              <span className="field__label">Inquiry type</span>
              <select className="field__input" name="inquiryType" required defaultValue={inquiryTypes[0]}>
                {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>

          <div className="form__row">
            <label className="field">
              <span className="field__label">Message</span>
              <textarea className="field__input field__input--area" name="message" rows={6} maxLength={5000} placeholder="How can we help you?" required />
            </label>
          </div>

          <button type="submit" className="btn btn--primary">Send a message</button>
        </form>

        {/* Sticky so it stays with the form rather than scrolling off at
            the first field. Decorative, so the caption carries the only
            text and the alt describes the photograph itself. */}
        <figure className="contact__figure">
          <div className="contact__frame">
            <Image
              src={imagery.independenceMonument.src}
              alt={imagery.independenceMonument.alt}
              fill
              sizes="(max-width: 900px) 100vw, 38vw"
              className="contact__img"
            />
          </div>
          <figcaption className="contact__caption">
            Independence Monument, Phnom Penh
          </figcaption>
        </figure>
      </section>
    </>
  );
}
