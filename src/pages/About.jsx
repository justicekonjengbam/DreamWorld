import { Link } from 'react-router-dom'
import Button from '../components/Button'
import './About.css'


function About() {
  return (
    <div className="about-page page">
      {/* Logo at top - outside everything */}
      <div className="page-hero">
        <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
      </div>

      <div className="story-container">
        <div className="story-header">
          <h1>The Story of DreamWorld</h1>
          <p className="story-tagline">Where wonder meets wisdom, and technology dances with nature</p>
        </div>

        <div className="story-section">
          <h2>In the Beginning</h2>
          <p>
            There was a dream—not born of sleep, but of deep longing for a world that could be. A world where forests grew alongside cities, where code 
            and seeds both carried the promise of life, where learning never ended and community never wavered.
          </p>
          <p>
            In this dream, technology did not dominate nature but partnered with it. Solar panels bloomed like flowers. Algorithms helped gardens thrive. 
            Knowledge flowed freely like water, nourishing all who thirsted for growth.
          </p>
          <p>
            This dream became DreamWorld—a universe both mystical and grounded, fantastical and practical. It exists in the space between imagination 
            and action, powered by people who believe that learning, building, and helping can change reality.
          </p>
        </div>

        <div className="story-section">
          <h2>A Universe of Balance</h2>
          <p>
            DreamWorld thrives on three forces in harmony: Nature, the living foundation that sustains all; Technology, the tools we create to amplify our 
            potential; and Mystery, the wonder that keeps us curious and humble. Here, every practice becomes a teacher—patience learned through tending what grows, discipline discovered through dedication, poetry found in patterns of logic.
          </p>
          <p>
            This is not escapism—it's aspiration made tangible. DreamWorld is the map; our lives are the territory we're transforming. Every skill mastered, every kindness shown, every line of code written with intention becomes part of the fabric of this world we're weaving together.
          </p>
        </div>

        <div className="story-section">
          <h2>The Five Truths</h2>
          <p>
            In this world, we hold five foundational truths. First, that technology serves life—we build tools that enhance human flourishing and protect the natural world, where code becomes craft and craft becomes beautiful. Second, that knowledge is shared—learning happens in community, we teach what we know and learn from each other, with no gatekeepers and no secret wisdom, just open hearts and curious minds.
          </p>
          <p>
            Third, we build in public—sharing our process, not just our results, celebrating progress over perfection because when we work in the open, we inspire others and create opportunities for collaboration. Fourth, we respect nature and people—the earth is our home and every person deserves dignity, our actions honor both, for sustainability and kindness are not optional but foundational.
          </p>
          <p>
            And fifth, every week brings one quest—small, consistent actions that create lasting change, a simple challenge to learn, build, help, or grow, because progress is not a destination but a practice we embrace together.
          </p>
        </div>

        <div className="story-section">
          <h2>Your Journey Begins</h2>
          <p>
            This world is built by dreamers and doers, by those who believe that small actions compound into extraordinary change. Every guide you meet carries wisdom from their journey—protectors of balance, cultivators of growth, teachers of focus and grace. Every quest you take is a step toward the world we're building together.
          </p>
          <p>
            The story of DreamWorld is not written in ancient tomes—it's being written right now, by you, by all of us who choose to learn, to build, to help, to grow. This is not a fantasy to escape into. This is a vision to step toward, one quest at a time.
          </p>
        </div>

        <div className="lore-cta">
          <p>
            Will you join us? The guides await, the quests are calling, and the community is growing. Your chapter in this story begins with a single step.
          </p>
          <Link to="/characters">
            <Button variant="primary">Meet the Characters</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


export default About
