
import Hero from "./components/Hero/hero";
import Nav from "./components/nav/nav";


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#0D23AD] text-white relative overflow-hidden">
      <Nav />
      <section className="max-w-7xl mx-auto px-6 py-24 text">

      </section>
      <Hero />
      </div>
    </main>
  );
}
