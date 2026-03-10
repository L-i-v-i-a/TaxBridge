
import Hero from "./components/Hero/hero";
import Nav from "./components/nav/nav";

import Price from "./pages/price";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div
        className="bg-[#0D23AD] text-white relative overflow-hidden"
        style={{
          backgroundImage: "url(/image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <Nav />
        <section className="max-w-7xl mx-auto px-6 py-24 text">
          <Hero />
        </section>
      </div>

      <Price />
    </main>
  );
}
