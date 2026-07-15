import { ShieldCheck, Wallet, Persons, MapPin } from "@gravity-ui/icons";

const features = [
  { icon: ShieldCheck, title: "Verified Listings", desc: "Every car listed goes through basic detail checks before going live." },
  { icon: Wallet, title: "No Hidden Fees", desc: "Drift never takes a cut — you negotiate and close directly with the seller." },
  { icon: Persons, title: "Direct Contact", desc: "Message or call the seller straight away, no waiting on approvals." },
  { icon: MapPin, title: "Local Focus", desc: "Built for Dhaka — listings, locations, and pricing that make sense here." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-2">
          Why Choose Drift
        </h2>
        <p className="text-neutral-400 text-center mb-12">
          Built to make buying and selling cars simple.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg p-6"
            >
              <f.icon width={28} height={28} className="text-neutral-300 mb-3" />
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}