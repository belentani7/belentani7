/* Belentani / Judas — contact page as a direct studio desk, not a chatbot prop. */
import SiteShell from "@/components/SiteShell";

export default function Contact() {
  return (
    <SiteShell section="Archive 007 / Contact">
      <section
        className="page-frame"
        style={{ paddingTop: "clamp(4.5rem, 10vw, 8rem)" }}
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div className="fade-up">
            <div className="eyebrow">Archive 007 / Contact</div>
            <h1 className="section-title mt-7 max-w-[430px]">Leave a trace.</h1>
            <p className="mono-copy mt-8 max-w-[280px]">
              Bookings, press, collaborations and studio requests.
            </p>
          </div>
          <div className="fade-up delay-1">
            <form
              className="space-y-8"
              onSubmit={event => event.preventDefault()}
            >
              <label className="block">
                <span className="archive-label">01 / Your name</span>
                <input
                  required
                  name="name"
                  className="mt-3 w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-lg text-[#e7e1d8] outline-none transition-colors placeholder:text-[#5f5b56] focus:border-[#d8473f]"
                  placeholder="Name / alias"
                />
              </label>
              <label className="block">
                <span className="archive-label">02 / Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-3 w-full border-b border-[var(--border)] bg-transparent px-0 py-3 text-lg text-[#e7e1d8] outline-none transition-colors placeholder:text-[#5f5b56] focus:border-[#d8473f]"
                  placeholder="you@domain.com"
                />
              </label>
              <label className="block">
                <span className="archive-label">03 / Message</span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="mt-3 w-full resize-y border-b border-[var(--border)] bg-transparent px-0 py-3 text-lg text-[#e7e1d8] outline-none transition-colors placeholder:text-[#5f5b56] focus:border-[#d8473f]"
                  placeholder="What should the archive know?"
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button type="submit" className="editorial-button">
                  Send request
                </button>
                <span className="mono-copy">Response window / 48 hours</span>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
          <div>
            <span className="archive-label">General</span>
            <a
              className="editorial-link mt-5"
              href="mailto:hello@belentani.art"
            >
              hello@belentani.art
            </a>
          </div>
          <div>
            <span className="archive-label">Press</span>
            <a
              className="editorial-link mt-5"
              href="mailto:press@belentani.art"
            >
              press@belentani.art
            </a>
          </div>
          <div>
            <span className="archive-label">Signal</span>
            <span className="mono-copy mt-5 block">
              Madrid / remote / no fixed room
            </span>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
