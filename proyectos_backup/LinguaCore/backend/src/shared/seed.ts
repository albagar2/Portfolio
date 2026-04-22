import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Professional English Master Book Curriculum...');

  const studentPassword = await argon2.hash('student123');
  const adminPassword = await argon2.hash('admin123');

  await prisma.user.upsert({
    where: { email: 'student@linguacore.com' },
    update: {},
    create: {
      email: 'student@linguacore.com', password: studentPassword, name: 'John Student', role: 'STUDENT', level: 'BEGINNER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@linguacore.com' },
    update: {},
    create: {
      email: 'admin@linguacore.com', password: adminPassword, name: 'Jane Admin', role: 'ADMIN', level: 'ADVANCED',
    },
  });

  // Clear existing content to avoid duplicates
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.vocabulary.deleteMany();

  // --- VOLUME I: A1-A2 FOUNDATIONS ---
  
  await prisma.lesson.create({
    data: {
      title: 'Identity & The Verb To Be',
      description: 'The foundation of English communication.',
      content: `The verb 'To Be' is the most important pillar. It describes states, professions, and origins.
      
      Affirmative Conjugation:
      - I am ('m) 
      - You are ('re)
      - He/She/It is ('s)
      
      Negative:
      - I am not
      - You are not (aren't)
      - He/She/It is not (isn't)
      
      Question:
      - Am I? / Are you? / Is he?`,
      level: 'BEGINNER',
      category: 'GRAMMAR',
      exercises: {
        create: [
          {
            type: 'FILL_BLANKS',
            question: 'My sister __________ a talented musician.',
            correctAnswer: 'is',
            explanation: 'We use "is" for third-person singular subjects (He, She, It).'
          },
          {
            type: 'FILL_BLANKS',
            question: 'We __________ (not / be) from London.',
            correctAnswer: "aren't",
            explanation: 'The negative form for "we" is "are not" or the contraction "aren\'t".'
          }
        ]
      }
    }
  });

  await prisma.lesson.create({
    data: {
      title: 'Past Events: Past Simple',
      description: 'Talking about finished actions in a specific time.',
      content: `We use the Past Simple to talk about completed actions.
      
      Structure:
      - Regular: Add -ed (e.g., Walk -> Walked).
      - Irregular: go -> went, buy -> bought, see -> saw.
      
      Time Expressions:
      - Yesterday morning
      - Last fortnight
      - Two days ago
      - In 2010`,
      level: 'BEGINNER',
      category: 'GRAMMAR',
      exercises: {
        create: [
          {
            type: 'FILL_BLANKS',
            question: 'Transform to the past: I buy a new car every year. -> I _______ a new car last year.',
            correctAnswer: 'bought',
            explanation: '"Buy" is an irregular verb. Its past form is "bought".'
          }
        ]
      }
    }
  });

  // --- VOLUME II: B1-B2 INTERMEDIATE & UPPER ---

  await prisma.lesson.create({
    data: {
      title: 'Advanced Narrative: Past Perfect',
      description: 'Talking about actions that happened before other actions.',
      content: `The Past Perfect (Had + Past Participle) describes an action that occurred before another action in the past.
      
      Example: "When I arrived at the cinema, the film had already started."
      (Action 1: Film started. Action 2: I arrived).`,
      level: 'INTERMEDIATE',
      category: 'GRAMMAR',
      exercises: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Which action happened first? "When she called, I had finished lunch."',
            options: JSON.stringify(['She called', 'Finished lunch']),
            correctAnswer: 'Finished lunch',
            explanation: 'The Past Perfect "had finished" indicates the action that completed before the other past action.'
          }
        ]
      }
    }
  });

  await prisma.lesson.create({
    data: {
      title: 'The Passive Voice in Writing',
      description: 'Essential for academic reports and formal news.',
      content: `The Passive Voice shifts the focus from the subject to the object of the action.
      
      - Present Simple: "Houses are built."
      - Past Simple: "A house was built."
      - Present Perfect: "Houses have been built."`,
      level: 'INTERMEDIATE',
      category: 'GRAMMAR',
      exercises: {
        create: [
          {
            type: 'FILL_BLANKS',
            question: 'Transform to passive: Someone has stolen my bike. -> My bike _______ _______ stolen.',
            correctAnswer: 'has been',
            explanation: 'To form the passive in Present Perfect, we use: have/has + been + past participle.'
          }
        ]
      }
    }
  });

  // --- VOLUME III: C1 ADVANCED FLUENCY ---

  await prisma.lesson.create({
    data: {
      title: 'Grammatical Inversion & Emphasis',
      description: 'Giving a formal and literary tone to your English.',
      content: `Inversion involves flipping the subject and the auxiliary verb after certain negative or restrictive expressions.
      
      - Never: "Never have I seen such a display of arrogance."
      - Seldom/Rarely: "Seldom does the media report on these issues."
      - No sooner... than: "No sooner had he finished his speech than the audience started cheering."`,
      level: 'ADVANCED',
      category: 'GRAMMAR',
      exercises: {
        create: [
          {
            type: 'FILL_BLANKS',
            question: 'Key Word Transformation: The train left just as I arrived. -> No _______ _______ I arrived at the platform than the train left.',
            correctAnswer: 'sooner had',
            explanation: '"No sooner had... than..." is a classical inversion structure used to show two events happening in quick succession.'
          }
        ]
      }
    }
  });

  await prisma.lesson.create({
    data: {
      title: 'Writing Masterclass: The Report',
      description: 'Structure and vocabulary for C1 level professional reports.',
      content: `Global structure of a C1 report:
      1. Introduction: State the purpose.
      2. First Section Heading: Current situation.
      3. Second Section Heading: Problems or feedback.
      4. Recommendations: Use modal verbs (should, would, could).
      5. Conclusion: Final summary.
      
      Elite Phrases:
      - "The vast majority of..."
      - "It is widely believed that..."
      - "According to the findings..."`,
      level: 'ADVANCED',
      category: 'BUSINESS',
      exercises: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Which phrase is best for a formal conclusion based on data?',
            options: JSON.stringify(['According to the findings', 'Like I said before', 'In my personal opinion', 'As far as I know']),
            correctAnswer: 'According to the findings',
            explanation: 'Professional reports rely on objective references to data or findings.'
          }
        ]
      }
    }
  });

  // --- COMPREHENSIVE VOCABULARY SEEDING ---

  const vocabulary = [
    // A1-A2
    { word: 'British', meaning: 'From the UK.', translation: 'Británico', synonyms: 'UK native', example: 'He is a British citizen.', level: 'BEGINNER', category: 'NOUN' },
    { word: 'Engineer', meaning: 'Professional in design/building.', translation: 'Ingeniero', synonyms: 'Designer, technician', example: 'The engineer fixed the machine.', level: 'BEGINNER', category: 'NOUN' },
    { word: 'Accountant', meaning: 'Person who keeps financial accounts.', translation: 'Contador', synonyms: 'Bookkeeper', example: 'I need to talk to my accountant.', level: 'INTERMEDIATE', category: 'NOUN' },
    
    // B1-B2
    { word: 'Moreover', meaning: 'In addition to what was said.', translation: 'Además / Es más', synonyms: 'Furthermore, additionally', example: 'It is efficient; moreover, it is cheap.', level: 'INTERMEDIATE', category: 'IDIOM' },
    { word: 'Nevertheless', meaning: 'However; despite this.', translation: 'Sin embargo / No obstante', synonyms: 'Nonetheless, however', example: 'It was raining; nevertheless, we went out.', level: 'INTERMEDIATE', category: 'IDIOM' },
    { word: 'Furthermore', meaning: 'Additionally.', translation: 'Además', synonyms: 'Moreover', example: 'The house is big; furthermore, it is sunny.', level: 'INTERMEDIATE', category: 'IDIOM' },

    // C1
    { word: 'Ameliorate', meaning: 'To make something better.', translation: 'Mejorar / Ameliorar', synonyms: 'Improve, bolster', example: 'We must ameliorate the living conditions.', level: 'ADVANCED', category: 'VERB' },
    { word: 'Fathom', meaning: 'To understand something deeply.', translation: 'Comprender / Desentrañar', synonyms: 'Understand, grasp', example: 'I cannot fathom why he did it.', level: 'ADVANCED', category: 'VERB' },
    { word: 'Ubiquitous', meaning: 'Present everywhere.', translation: 'Ubicuo / Omnipresente', synonyms: 'Pervasive, widespread', example: 'Smartphones are ubiquitous today.', level: 'ADVANCED', category: 'ADJECTIVE' },
    { word: 'Arduous', meaning: 'Involving strenuous effort.', translation: 'Arduo', synonyms: 'Difficult, formidable', example: 'It was an arduous journey.', level: 'ADVANCED', category: 'ADJECTIVE' },
    { word: 'Bridge the gap', meaning: 'To reduce the difference between two things.', translation: 'Cerrar la brecha', synonyms: 'Unite, connect', example: 'We need to bridge the gap between rich and poor.', level: 'ADVANCED', category: 'IDIOM' }
  ];

  for (const item of vocabulary) {
    await prisma.vocabulary.create({ data: item });
  }

  console.log('✅ Full Academic Curriculum Integrated Successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
