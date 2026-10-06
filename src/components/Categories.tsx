import Link from "next/link";

const categories = [
  {
    name: "Sedan",
    desc: "Comfortable daily drivers",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "SUV",
    desc: "Space and power combined",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hatchback",
    desc: "Compact and city-friendly",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStESyntXgeRoXKRFfDOL8mlOzvKhcIisrQhukIUop3F4_G2csBipQ66EhQ&s=10",
  },
  {
    name: "Luxury",
    desc: "Premium rides, top condition",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Van",
    desc: "Room for family or cargo",
    image: "https://images.squarespace-cdn.com/content/v1/5ea3593384d29b153c70a329/1774989472417-ZL5UCGXP3LBQQBHMG7XG/toyota-hiace-high-roof-matt-and-dans-campervans.jpg",
  },
];

export default function Categories() {
  return (
    <section className="py-20 px-4 bg-[#e9e3e6] border-t border-[#b2b2b2]/40 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#9a8f97] font-bold block mb-1">
            Browse Inventory
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232c33]">
            Explore <span className="text-[#9a8f97]">Categories</span>
          </h2>
          <p className="text-[#232c33]/70 text-sm mt-2 font-medium">
            Find exactly the type of car you&apos;re looking for in Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/cars?category=${cat.name}`}
              className="group relative h-64 rounded-2xl border border-[#b2b2b2] overflow-hidden backdrop-blur-xl shadow-md hover:border-[#232c33] hover:shadow-xl transition duration-500 flex flex-col justify-end p-5"
            >
              {/* Category Image with Scale Transition */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />

              {/* Jet Black Frosted Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#232c33] via-[#232c33]/70 to-transparent group-hover:via-[#232c33]/80 transition-all duration-300" />

              {/* Text Content */}
              <div className="relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white bg-[#232c33]/90 border border-[#9a8f97]/50 px-2.5 py-0.5 rounded-full inline-block mb-2 backdrop-blur-md">
                  Browse
                </span>
                <h3 className="text-white font-black text-xl mb-1 group-hover:text-[#c3baba] transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#e9e3e6]/90 font-normal leading-tight group-hover:text-white transition">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
