// Character Roles/Categories
export const roles = [
  {
    id: 'guardian',
    name: 'The Guardians',
    singular: 'Guardian',
    description: 'Architects and guides of DreamWorld. They weave together nature, technology, and community.',
    color: 'linear-gradient(135deg, #FFD700, #4CA1AF)',
    traits: [
      'Visionary Leadership',
      'Community Building',
      'Systems Thinking',
      'Educational Design',
      'Technology & Nature Harmony'
    ],
    philosophy: 'Guardians believe that education and collaboration can transform the world. They create spaces where people can learn, grow, and build together.'
  },
  {
    id: 'florist',
    name: 'The Florists',
    singular: 'Florist',
    description: 'Represents nature, beauty, and meaning. Shares plant/flower knowledge, eco-living habits, and calming creative content.',
    color: 'linear-gradient(135deg, #4CAF50, #5fd65f)',
    traits: [
      'Nature Connection',
      'Plant & Flower Knowledge',
      'Eco-Living Practices',
      'Aesthetic Sensibility',
      'Calming Creativity'
    ],
    philosophy: 'Florists teach us that beauty is essential food for the spirit. They help us slow down, observe, and appreciate the quiet miracles of nature around us.'
  },
  {
    id: 'healer',
    name: 'The Healers',
    singular: 'Healer',
    description: 'Supports wellness (non-medical): mindset, routines, rest, confidence, and recovery. Helps members stay balanced while learning and building.',
    color: 'linear-gradient(135deg, #A8E6CF, #56CCF2)',
    traits: [
      'Mindset Support',
      'Wellness Routines',
      'Rest & Recovery',
      'Confidence Building',
      'Balance Maintenance'
    ],
    philosophy: 'Healers believe true growth requires balance. They nurture mental wellness, self-care practices, and the confidence needed to thrive in all areas of life.'
  },
  {
    id: 'builder',
    name: 'The Builders',
    singular: 'Builder',
    description: 'Creates tools and projects that help life—DIY, tech, repairs, coding, robotics, and practical inventions. Teaches by showing progress.',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    traits: [
      'DIY & Practical Projects',
      'Tech & Coding Skills',
      'Problem Solving',
      'Robotics & Inventions',
      'Learn-by-Building'
    ],
    philosophy: 'Builders know that making something with your hands—or code—is one of the best ways to learn. They create practical tools and share the journey of building.'
  },
  {
    id: 'scholar',
    name: 'The Scholars',
    singular: 'Scholar',
    description: 'Turns complex ideas into simple lessons. Shares mini-explainers, resources, study methods, and "learn together" content.',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    traits: [
      'Knowledge Simplification',
      'Teaching Methods',
      'Resource Curation',
      'Study Techniques',
      'Collaborative Learning'
    ],
    philosophy: 'Scholars believe knowledge should be accessible to everyone. They break down complex topics into digestible lessons and make learning a collaborative adventure.'
  },
  {
    id: 'ranger',
    name: 'The Rangers',
    singular: 'Ranger',
    description: 'Takes DreamWorld into the real world: cleanups, planting, community help, outdoor learning, and environment-focused quests.',
    color: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
    traits: [
      'Environmental Action',
      'Community Service',
      'Outdoor Education',
      'Sustainability Practice',
      'Real-World Impact'
    ],
    philosophy: 'Rangers bridge the digital and physical worlds. They take action in their communities, protect nature, and turn online ideas into real-world change.'
  },
  {
    id: 'athlete',
    name: 'The Athletes',
    singular: 'Athlete',
    description: 'Trains discipline and teamwork through sports and fitness. Shares drills, challenges, and growth mindset through movement.',
    color: 'linear-gradient(135deg, #FF6F61, #C33764)',
    traits: [
      'Physical Excellence',
      'Mental Discipline',
      'Team Synergy',
      'Fitness Challenges',
      'Movement Practice'
    ],
    philosophy: 'Athletes know that mastery comes through repetition and discipline. They bring the energy of movement to DreamWorld, showing that body and mind grow together.'
  },
  {
    id: 'artist',
    name: 'The Artists',
    singular: 'Artist',
    description: 'Brings DreamWorld to life visually and creatively—design, drawing, editing, music, photography, posters, and aesthetic worldbuilding.',
    color: 'linear-gradient(135deg, #FA8BFF, #2BD2FF)',
    traits: [
      'Visual Design',
      'Creative Expression',
      'Aesthetic Curation',
      'Music & Photography',
      'World Building'
    ],
    philosophy: 'Artists paint the soul of DreamWorld. They transform ideas into visual stories, create beauty that inspires, and make the universe feel alive through creativity.'
  },
  {
    id: 'antagonist',
    name: 'The Antagonists',
    singular: 'Antagonist',
    description: 'Creates playful challenges and controlled chaos during events—testing skills, teamwork, and creativity to make quests more exciting (never harmful, always fair).',
    color: 'linear-gradient(135deg, #FF4D6D, #7B2CBF)',
    traits: [
      'Challenge Design',
      'Mischief with Rules',
      'Psychology & Strategy',
      'Improv & Roleplay',
      'Fair Play'
    ],
    philosophy: 'Antagonists are the spice, not the poison. They turn events into stories by introducing obstacles, twists, and rival quests—pushing everyone to grow while keeping it safe, respectful, and fun.'
  }
]


// Creator/Founder (Special - Not part of regular roles)
export const creator = {
  id: 'creator-justice',
  name: 'Justice Konjengbam',
  title: 'Creator & Founder of DreamWorld',
  role: 'creator',
  avatar: '/Creator.png',
  coverImage: 'linear-gradient(135deg, #FFD700, #4CA1AF, #1D2671)',
  bio: 'The visionary behind A Beautiful Dream and DreamWorld. Working as Project Assistant at IIT Dharwad in CSC, Justice created this universe to blend education, community, and wonder.',
  fullBio: 'Justice Konjengbam is the mind and heart behind DreamWorld. From the halls of IIT Dharwad to building digital universes, Justice believes in the power of learning together, creating together, and making the world better one quest at a time. This platform is a manifestation of that dream—a space where nature, technology, and community converge.',
  achievements: [
    'Founded A Beautiful Dream project',
    'Created DreamWorld universe and community',
    'Project Assistant at IIT Dharwad CSC',
    'Building bridges between education and technology'
  ],
  vision: 'To create a world where everyone has the opportunity to learn, grow, and contribute to something beautiful. Where technology serves humanity, and community thrives through shared purpose.',
  location: 'Puducherry, India',
  themes: ['Vision', 'Community', 'Technology', 'Education', 'Innovation'],
  socials: {
    youtube: 'https://youtube.com/@dreamworld',
    facebook: 'https://facebook.com/dreamworld',
    twitter: 'https://twitter.com/dreamworld',
    linkedin: 'https://linkedin.com/in/justicekonjengbam'
  },
  joinedDate: '2025-01-01',
  isCreator: true
}


// Individual Characters/Members
export const characters = [
  {
    id: 'Florist-001',
    name: 'Priyaluxmi Konjengbam',
    role: 'florist',
    title: 'Lead Florist',
    avatar: '/Priyaluxmi.png',
    bio: 'Early members of DreamWorld. Helps in bringing flowers and colours into the Dream World',
    themes: ['Education', 'Peace', 'Flowers'],
    socials: {
      twitter: 'https://twitter.com/alexrivers',
      github: 'https://github.com/alexrivers'
    },
    joinedDate: '2025-01-01'
  },
  {
    id: 'athlete-001',
    name: 'Shankerson',
    role: 'athlete',
    title: 'Player',
    avatar: '/Shankerson.png',
    bio: 'I turn drills into quests and sweat into progress.Fitness • Basketball • Teamwork • Growth',
    themes: ['Basketball', 'Coaching', 'Discipline'],
    socials: {
      instagram: 'https://instagram.com/mayagarden',
      website: 'https://mayagarden.com'
    },
    joinedDate: '2025-02-15'
  },
  {
    id: 'antagonist',
    name: 'Vincent Law',
    role: 'Antagonist ',
    title: 'Event Rival & Challenge Master',
    avatar: '/Bicky.png',
    bio: 'The playful opposition of DreamWorld—designs twists, rival quests, and mind-games that make events thrilling while staying fair and safe.',
    themes: ['Challenge Design', 'Strategy', 'Mischief (Fair Play)', 'Roleplay', 'Event Hype'],
    socials: {
      instagram: 'https://instagram.com/jordanbloom',
      youtube: 'https://youtube.com/jordanbloom'
    },
    joinedDate: '2025-03-20'
  },
  {
    id: 'athlete-002',
    name: 'Chris Summit',
    role: 'athlete',
    title: 'Head Coach & Movement Mentor',
    avatar: '/photo2.png',
    bio: 'Former professional athlete now dedicated to helping others find their physical potential.',
    themes: ['Basketball', 'Coaching', 'Discipline'],
    socials: {
      youtube: 'https://youtube.com/chrissummit',
      twitter: 'https://twitter.com/chrissummit'
    },
    joinedDate: '2025-02-01'
  },
  {
    id: 'athlete-003',
    name: 'Sam Victory',
    role: 'athlete',
    title: 'Fitness & Wellness Coach',
    avatar: '/photo1.png',
    bio: 'Specializes in building sustainable fitness habits. Believes movement is medicine.',
    themes: ['Fitness', 'Wellness', 'Habit Building'],
    socials: {
      instagram: 'https://instagram.com/samvictory',
      website: 'https://samvictory.fit'
    },
    joinedDate: '2025-04-10'
  }
]


// Helper function to get characters by role
export const getCharactersByRole = (roleId) => {
  return characters.filter(char => char.role === roleId)
}


// Helper function to get role by id
export const getRoleById = (roleId) => {
  return roles.find(role => role.id === roleId)
}


// Helper function to add new character with photo
export const addNewCharacter = (characterData) => {
  const newCharacter = {
    id: `${characterData.role}-${Date.now()}`,
    name: characterData.name,
    role: characterData.role,
    title: characterData.title || 'Member',
    avatar: characterData.avatar || '/photo1.png', // Only ONE photo field
    bio: characterData.bio || '',
    themes: characterData.themes || [],
    socials: characterData.socials || {},
    joinedDate: new Date().toISOString().split('T')[0]
  }
  
  characters.push(newCharacter)
  return newCharacter
}


// Helper function to update character photo
export const updateCharacterPhoto = (characterId, photoUrl) => {
  const character = characters.find(char => char.id === characterId)
  if (character) {
    character.avatar = photoUrl
    return true
  }
  return false
}
