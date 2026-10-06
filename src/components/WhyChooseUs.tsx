import { ShieldCheck, Wallet, Persons, MapPin } from "@gravity-ui/icons";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    desc: "Every car listed goes through basic detail checks before going live on the platform.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: Wallet,
    title: "No Hidden Fees",
    desc: "Drift never takes a cut — you negotiate and close directly with the seller for 100% value.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy0CTrIn5Y1aZPL72xarlqpjIc4Ux-_fGSSDTDojoyFbGyWbFNxJmsVCUf&s=10",
  },
  {
    icon: Persons,
    title: "Direct Contact",
    desc: "Message or call the seller straight away, no waiting on dealer approvals or middleman.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    icon: MapPin,
    title: "Local Focus",
    desc: "Built specifically for Dhaka — listings, locations, and pricing that make sense here.",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 bg-[#e9e3e6] border-t border-[#b2b2b2]/40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#9a8f97] font-bold block mb-1">
            Built For Buyers & Sellers
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232c33]">
            Why Choose <span className="text-[#9a8f97]">Drift</span>
          </h2>
          <p className="text-[#232c33]/70 text-sm mt-2 font-medium">
            Built to make buying and selling cars simple, transparent, and direct in Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-[#b2b2b2] bg-white backdrop-blur-xl overflow-hidden hover:border-[#232c33] hover:shadow-xl transition-all duration-300 group shadow-md flex flex-col"
              >
                {/* Product Card Top Area - Background Image + Centered Large Icon */}
                <div className="h-44 w-full relative overflow-hidden flex items-center justify-center p-6 border-b border-[#b2b2b2]/50 bg-[#232c33]">
                  {/* Topic-Specific Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url('${f.image}')` }}
                  />

                  {/* Dark Overlay Gradient for High Icon Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#232c33]/90 via-[#232c33]/65 to-[#232c33]/40" />

                  {/* Centered Icon Badge */}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/95 backdrop-blur-md border border-[#c3baba] shadow-xl flex items-center justify-center text-[#232c33] group-hover:scale-105 group-hover:bg-[#232c33] group-hover:text-white group-hover:border-[#9a8f97] transition-all duration-300">
                    <Icon width={36} height={36} />
                  </div>
                </div>

                {/* Product Card Bottom Area - Title & Description */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#232c33] mb-2.5 group-hover:text-[#9a8f97] transition">
                      {f.title}
                    </h3>
                    <p className="text-xs text-[#232c33]/70 leading-relaxed font-normal">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
