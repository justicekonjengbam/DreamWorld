export const clans = [
  {
    id: 'crimson-phoenix',
    name: 'The Crimson Phoenix',
    element: 'Fire',
    icon: '🔥',
    logo: '/Clans/The_Crimson_Phoenix.png',
    motto: 'From ashes, we rise.',
    description: 'Represents fire, passion, courage, creativity, and transformation.',
    story: 'The Crimson Phoenix represents passion, courage, creativity, and radical transformation. When dreams meet obstacles or fall to ashes, Phoenix Dreamers ignite new embers of action, turning failure into fuel for revolutionary creation.',
    principles: [
      { title: 'Courageous Action', desc: 'Step forward boldly when others hesitate.' },
      { title: 'Transformative Resilience', desc: 'Turn setbacks and ashes into newfound strength.' },
      { title: 'Passionate Purpose', desc: 'Channel raw energy into meaningful creation.' }
    ],
    whoBelongs: 'Creators, builders, and risk-takers who dare to take bold action, challenge the status quo, and rise stronger from every setback.',
    color: '#FF4D4D',
    gradient: 'linear-gradient(135deg, #FF416C, #FF4B2B)'
  },
  {
    id: 'white-lotus',
    name: 'The White Lotus Clan',
    element: 'Water',
    icon: '💧',
    logo: '/Clans/The_White_Lotus_Clan.png',
    motto: 'Flow, adapt, and bloom.',
    description: 'Represents water, wisdom, healing, compassion, and adaptability.',
    story: 'The White Lotus Clan embodies water, deep wisdom, compassion, and emotional intelligence. Like water carving pathways through solid stone, Lotus Dreamers adapt effortlessly to life\'s challenges while remaining pristine and pure at heart.',
    principles: [
      { title: 'Adaptive Flow', desc: 'Navigate obstacles with fluidity rather than friction.' },
      { title: 'Empathic Wisdom', desc: 'Listen deeply and heal spirit before strategy.' },
      { title: 'Serene Harmony', desc: 'Maintain inner calm amidst outer turbulence.' }
    ],
    whoBelongs: 'Healers, mentors, and empathetic thinkers who bring peace to conflict, listen deeply, and help others bloom even in difficult circumstances.',
    color: '#00D2FF',
    gradient: 'linear-gradient(135deg, #00C6FF, #0072FF)'
  },
  {
    id: 'silver-feather',
    name: 'The Silver Feather Clan',
    element: 'Air',
    icon: '🌬️',
    logo: '/Clans/The_Silver_Feather_Clan.png',
    motto: 'Beyond every horizon.',
    description: 'Represents air, freedom, knowledge, exploration, and imagination.',
    story: 'The Silver Feather Clan represents air, intellectual freedom, relentless curiosity, and soaring imagination. Unbound by conventional boundaries, Feather Dreamers explore uncharted ideas and carry knowledge across distant horizons.',
    principles: [
      { title: 'Unbound Imagination', desc: 'Dream without limits or fear of judgment.' },
      { title: 'Pursuit of Knowledge', desc: 'Seek truth, wisdom, and clarity above all else.' },
      { title: 'Visionary Perspective', desc: 'See the big picture from high above the clouds.' }
    ],
    whoBelongs: 'Philosophers, storytellers, researchers, and free spirits who question assumptions, dream beyond boundaries, and expand human understanding.',
    color: '#E0E0E0',
    gradient: 'linear-gradient(135deg, #E0E0E0, #8E9EAB)'
  },
  {
    id: 'verdant-grove',
    name: 'The Verdant Grove',
    element: 'Earth',
    icon: '🌿',
    logo: '/Clans/The_Verdant_Grove.png',
    motto: 'Deep roots. Endless growth.',
    description: 'Represents earth, life, growth, nature, stability, and community.',
    story: 'The Verdant Grove symbolizes earth, stability, ecological harmony, and community nurturing. Like a great ancient forest with deep interconnected roots, Grove Dreamers build lasting foundations where every member can grow safely.',
    principles: [
      { title: 'Grounded Stability', desc: 'Provide a firm, reliable foundation for everyone.' },
      { title: 'Community Synergy', desc: 'Grow together as an interconnected ecosystem.' },
      { title: 'Sustainable Growth', desc: 'Nurture long-term seeds rather than quick wins.' }
    ],
    whoBelongs: 'Community stewards, organizers, nature protectors, and dependable allies who value deep connections, steady progress, and long-term sustainability.',
    color: '#2ECC71',
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)'
  },
  {
    id: 'golden-thunder',
    name: 'The Golden Thunder Clan',
    element: 'Lightning',
    icon: '⚡',
    logo: '/Clans/The_Golden_Thunder_Clan.png',
    motto: 'Illuminate the impossible.',
    description: 'Represents lightning, innovation, technology, energy, and progress.',
    story: 'The Golden Thunder Clan represents lightning, high-energy innovation, technological mastery, and breakthrough progress. Thunder Dreamers strike like a bolt of inspiration, electrifying stagnant ideas into groundbreaking realities.',
    principles: [
      { title: 'Electrifying Innovation', desc: 'Challenge outdated methods with breakthrough tech.' },
      { title: 'Rapid Execution', desc: 'Turn sparks of intuition into instant reality.' },
      { title: 'Illuminating Genius', desc: 'Light up the darkest, most complex problems.' }
    ],
    whoBelongs: 'Innovators, technologists, coders, and visionaries who move fast, solve complex puzzles, and light up the path to the future.',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #F2C94C, #F2994A)'
  }
]

export const getClanById = (clanId) => {
  if (!clanId) return null
  return clans.find(c => c.id === clanId || c.name.toLowerCase().includes(clanId.toLowerCase())) || null
}


