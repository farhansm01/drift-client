export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
        About Drift
      </h1>
      <p className="text-neutral-400 mb-10">
        Drive further, worry less.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">What is Drift?</h2>
          <p className="text-neutral-300 leading-relaxed">
            Drift is a used car marketplace built for Dhaka. We connect people
            who want to sell their car with people looking to buy — no
            middleman, no commission, no waiting on approvals. List your car
            in minutes, or browse listings from real sellers and reach out
            directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">How it works</h2>
          <p className="text-neutral-300 leading-relaxed">
            Sellers create an account and list their car with photos,
            pricing, and contact details. Buyers browse the listings, filter
            by category, price, or transmission, and contact sellers
            directly to arrange a viewing and close the deal. Drift's job
            ends at connecting the two of you — the rest happens between
            buyer and seller, just like it should.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">Why we built this</h2>
          <p className="text-neutral-300 leading-relaxed">
            Buying or selling a used car locally often means digging through
            cluttered classifieds or paying a cut to a middleman. Drift keeps
            it simple: clean listings, real contact info, and a straight
            line between buyer and seller.
          </p>
        </section>
      </div>
    </div>
  );
}