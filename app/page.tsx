import Image from "next/image";
import { BookOpen, ChefHat, Heart, Sparkles, Users, Utensils } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="The Caffey Clan Kitchen home"><span><ChefHat aria-hidden="true" /></span><strong>The Caffey Clan Kitchen</strong></a>
      <nav className="topbar-nav" aria-label="Main navigation"><a href="#about">Meet the Clan</a><a href={`${basePath}/recipes/`}>Recipe Box</a></nav>
      <div className="topbar-actions"><div className="family-count"><Users aria-hidden="true" /> Made for our clan</div><a className="recipe-box-link" href={`${basePath}/recipes/`}><Utensils aria-hidden="true" /> Recipe Box</a></div>
    </header>

    <section className="home-hero" id="top">
      <div className="home-hero-copy">
        <p className="eyebrow"><Heart aria-hidden="true" /> Meet the Clan</p>
        <h1>The Caffey Clan Kitchen</h1>
        <p className="home-tagline">Made with love, laughter, and a little chaos.</p>
        <p className="home-intro">Welcome to the heart of our family—where favorite meals become traditions, recipes collect memories, and there is always something happening around the table.</p>
        <a className="primary-cta" href={`${basePath}/recipes/`}><Utensils aria-hidden="true" /> Raid the Recipes</a>
      </div>
      <div className="family-collage" aria-label="The Caffey family">
        <div className="collage-paper collage-paper-one" aria-hidden="true"></div>
        <div className="collage-paper collage-paper-two" aria-hidden="true"></div>
        <figure className="family-main-photo">
          <span className="photo-tape photo-tape-left" aria-hidden="true"></span>
          <span className="photo-tape photo-tape-right" aria-hidden="true"></span>
          <Image src={`${basePath}/caffey-clan-main.jpg`} alt="The Caffey family sharing a playful moment together by the lake" fill priority sizes="(max-width: 900px) 92vw, 52vw" />
          <figcaption>Us, in our natural state.</figcaption>
        </figure>
      </div>
    </section>

    <section className="home-about" id="about" aria-labelledby="about-title">
      <div className="about-copy"><p className="eyebrow"><BookOpen aria-hidden="true" /> Our family recipe box</p><h2 id="about-title">Pull up a chair. There’s always room at our table.</h2><p>We’re the Caffey Clan—a family of six with a lot of personality, a love of good food, and just enough chaos to keep things interesting. Our kitchen is where everyday dinners, special traditions, experiments, and old favorites all come together.</p><p>This is our shared family recipe box: a place to keep the meals we love within reach, pass them down, and make room for every member of the clan to add their own recipes and memories along the way.</p></div>
      <div className="clan-values" aria-label="What this kitchen is about">
        <article><span><Utensils aria-hidden="true" /></span><div><h3>Made by us</h3><p>Real recipes from our real table—the favorites we return to again and again.</p></div></article>
        <article><span><BookOpen aria-hidden="true" /></span><div><h3>Saved for the future</h3><p>A growing collection the kids can use now, add to later, and carry forward.</p></div></article>
        <article><span><Sparkles aria-hidden="true" /></span><div><h3>Room for our chaos</h3><p>Clan Notes keep the swaps, stories, shortcuts, and family opinions with each dish.</p></div></article>
      </div>
    </section>
    <footer>Made with love, laughter, and a little chaos.</footer>
  </main>;
}
