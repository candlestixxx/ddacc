import Schedule from '@/components/Schedule';
import ArtistPortal from '@/components/ArtistPortal';
import DigitalWall from '@/components/DigitalWall';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black text-center flex flex-col items-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl">
          Detroit Digital Artist Convention & Conference
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl leading-relaxed">
          To empower, elevate, and connect digital creators across Detroit and beyond by bridging the gap between artistic community and industry innovation.
        </p>
        <div className="flex gap-4">
          <a href="#schedule" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            View Schedule
          </a>
          <a href="#apply" className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-700">
            Apply Now
          </a>
        </div>
      </section>

      {/* Mission Hub */}
      <section id="mission" className="w-full py-20 px-4 max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-center">The Love Collective Ethos</h2>
        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
          <p className="text-lg leading-relaxed text-gray-300">
            DDACC is a collaborative platform dedicated to celebrating digital craftsmanship, championing creative equity, and shaping the future of digital art. We invite you to join the Love Collective—whether through Artist Alley booths, live digital art battles, collaborative mural drops, or open portfolio showcases.
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="w-full py-20 px-4 max-w-6xl bg-gray-900">
        <h2 className="text-3xl font-bold mb-12 text-center">Event Tracks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Love Collective", desc: "Community & Creator Showcase" },
            { title: "Industry & Innovation", desc: "Professional Conference & Networking" },
            { title: "Emergent Tools", desc: "Hands-On Learning & Workshops" },
            { title: "Interactive Media", desc: "Festive & Experiential Installations" }
          ].map((track, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
              <h3 className="text-xl font-bold mb-3 text-blue-400">{track.title}</h3>
              <p className="text-gray-400">{track.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Schedule Module */}
      <section id="schedule" className="w-full py-20 px-4">
        <Schedule />
      </section>

      {/* Artist Alley & Speaker Portal */}
      <section id="apply" className="w-full py-20 px-4 bg-gray-900">
        <ArtistPortal />
      </section>

      {/* Interactive Digital Wall */}
      <section id="digital-wall" className="w-full py-20 px-4">
        <DigitalWall />
      </section>

    </div>
  );
}