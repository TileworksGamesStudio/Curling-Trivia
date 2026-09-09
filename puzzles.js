/**
 * CURLING PUZZLES: TRIVIA CURRICULUM DATA CONTRACT
 * Continuity Standard: Day 0 = 8 September 2026.
 *
 * Maintenance:
 * To append new daily matches, simply add a new object to this array with an
 * incremental dayIndex. Never edit index.html or script.js for content releases.
 */

window.CURLING_TRIVIA_PUZZLES = [
  {
    id: "trivia-match-day-0",
    dayIndex: 0,
    title: "Curling Basics & Equipment",
    difficulty: "Accessible",
    questions: [
      {
        prompt: "What is the official weight range for a competition granite curling stone under World Curling rules?",
        options: [
          "28 to 32 lbs (12.7 to 14.5 kg)",
          "38 to 44 lbs (17.2 to 19.96 kg)",
          "48 to 54 lbs (21.7 to 24.5 kg)",
          "55 to 60 lbs (24.9 to 27.2 kg)"
        ],
        correctIndex: 1,
        category: "Equipment",
        difficulty: "Easy",
        explanation: "World Curling rules state that a standard curling stone must weigh between 38 and 44 pounds (17.24 to 19.96 kg), including the handle and bolt."
      },
      {
        prompt: "What is the circular target area at the scoring end of a curling sheet officially called?",
        options: [
          "The Barn",
          "The House",
          "The Ring",
          "The Circle"
        ],
        correctIndex: 1,
        category: "The House",
        difficulty: "Beginner",
        explanation: "The target consisting of concentric rings is called the House. Its exact center pin is known as the Button."
      },
      {
        prompt: "In curling strategy, what is the term for the team delivering the final stone of an end?",
        options: [
          "Holding the Broom",
          "Holding the Hammer",
          "Holding the Hack",
          "The Draw Advantage"
        ],
        correctIndex: 1,
        category: "Strategy",
        difficulty: "Beginner",
        explanation: "The final stone advantage in any end is called the Hammer, providing a substantial scoring advantage."
      },
      {
        prompt: "Before a delivered stone is considered legally in play, it must completely cross which designated line?",
        options: [
          "The Centre Line",
          "The Far Hog Line",
          "The Tee Line",
          "The Back Line"
        ],
        correctIndex: 1,
        category: "Curling Sheet",
        difficulty: "Medium",
        explanation: "A delivered stone must cross the far hog line completely without contacting the sideboards to remain in play; otherwise, it is immediately removed."
      },
      {
        prompt: "Which Canadian city hosted the very first MacDonald Brier (Men's National Championship) in 1927?",
        options: [
          "Winnipeg, Manitoba",
          "Toronto, Ontario",
          "Calgary, Alberta",
          "Halifax, Nova Scotia"
        ],
        correctIndex: 1,
        category: "Canadian Lore",
        difficulty: "Medium",
        explanation: "The inaugural 1927 Brier was held at the Granite Club in Toronto, Ontario, won by Nova Scotia skipped by Murray Macneill."
      }
    ]
  },
  {
    id: "trivia-match-day-1",
    dayIndex: 1,
    title: "Granite, Pebble & Geometry",
    difficulty: "Medium",
    questions: [
      {
        prompt: "From what uninhabited Scottish island is the world's finest curling stone granite traditionally quarried?",
        options: [
          "Isle of Skye",
          "Ailsa Craig",
          "Orkney Island",
          "Isle of Lewis"
        ],
        correctIndex: 1,
        category: "Stones & Granite",
        difficulty: "Medium",
        explanation: "Ailsa Craig, off the coast of Ayrshire, Scotland, produces rare Common Green and Blue Hone microgranite with near-zero water absorption."
      },
      {
        prompt: "What is the process of spraying tiny droplets of heated water onto the ice sheet before play called?",
        options: [
          "Pebbling",
          "Frosting",
          "Beading",
          "Stippling"
        ],
        correctIndex: 0,
        category: "Ice Preparation",
        difficulty: "Easy",
        explanation: "Pebbling creates small frozen bumps that elevate the stone, reducing surface contact and allowing it to glide and curl predictably."
      },
      {
        prompt: "What is the exact official diameter of the outermost blue ring of a standard curling house?",
        options: [
          "10 feet (3.05 m)",
          "12 feet (3.66 m)",
          "14 feet (4.27 m)",
          "16 feet (4.88 m)"
        ],
        correctIndex: 1,
        category: "The House",
        difficulty: "Easy",
        explanation: "The house consists of four concentric rings: the 12-foot outer ring, 8-foot white ring, 4-foot red ring, and central button."
      },
      {
        prompt: "What curling shot is deliberately thrown with precise weight to come to rest softly inside the house without hitting another rock?",
        options: [
          "Takeout",
          "Draw",
          "Peel",
          "Hack Shot"
        ],
        correctIndex: 1,
        category: "Shot Selection",
        difficulty: "Beginner",
        explanation: "A Draw is a finesse shot delivered with gentle weight designed to finish directly in the scoring house."
      },
      {
        prompt: "Under the modern 5-Rock Free Guard Zone rule, when can opponent stones in the FGZ first be legally eliminated from play?",
        options: [
          "On the 4th stone of the end",
          "On the 5th stone of the end",
          "On the 6th stone of the end",
          "Anytime after the lead throws"
        ],
        correctIndex: 2,
        category: "Rules",
        difficulty: "Hard",
        explanation: "Under the 5-Rock Free Guard Zone rule, rocks positioned in the FGZ cannot be removed until the 6th stone of the end is delivered."
      }
    ]
  },
  {
    id: "trivia-match-day-2",
    dayIndex: 2,
    title: "Team Roles & Sweeping Physics",
    difficulty: "Developing",
    questions: [
      {
        prompt: "In a traditional four-person curling team, which position delivers stones 1 and 2 in every end?",
        options: [
          "The Lead",
          "The Second",
          "The Third (Vice)",
          "The Skip"
        ],
        correctIndex: 0,
        category: "Positions",
        difficulty: "Beginner",
        explanation: "The Lead throws the first two stones and typically performs primary sweeping duties for the remaining teammates."
      },
      {
        prompt: "How does vigorous brushing in front of a traveling curling stone primarily affect its path?",
        options: [
          "It slows the stone down to stop faster",
          "It temporarily reduces friction, carrying the stone farther and delaying its curl",
          "It cuts deep grooves into the ice to curve the stone sharply",
          "It causes the rock to rotate in reverse"
        ],
        correctIndex: 1,
        category: "Sweeping",
        difficulty: "Medium",
        explanation: "Brushing warms the pebble micro-surface via friction, creating a momentary thin film that decreases drag and keeps the rock traveling straighter."
      },
      {
        prompt: "What is the rubberized foothole block anchored into the ice called from which curlers push out to deliver a stone?",
        options: [
          "The Cleat",
          "The Hack",
          "The Peg",
          "The Foothold"
        ],
        correctIndex: 1,
        category: "Equipment",
        difficulty: "Beginner",
        explanation: "The Hack provides the secure foothold from which curlers initiate their delivery slide toward the house."
      },
      {
        prompt: "Which Canadian women's team skipped by Jennifer Jones achieved an undefeated 11-0 record to capture Olympic Gold in 2014?",
        options: [
          "Team Saskatchewan",
          "Team Manitoba",
          "Team Alberta",
          "Team Ontario"
        ],
        correctIndex: 1,
        category: "Canadian Lore",
        difficulty: "Medium",
        explanation: "Jennifer Jones and her St. Vital Curling Club rink from Winnipeg, Manitoba, became the first women's team to go undefeated in Olympic history at Sochi 2014."
      },
      {
        prompt: "What is an end called when neither team scores any points, allowing the delivering team to retain the hammer?",
        options: [
          "A Dead End",
          "A Scratch End",
          "A Blank End",
          "A Tied End"
        ],
        correctIndex: 2,
        category: "Scoring",
        difficulty: "Easy",
        explanation: "A Blank End occurs when all stones in the house are kept clear. The team with the hammer retains it going into the next end."
      }
    ]
  },
  {
    id: "trivia-match-day-3",
    dayIndex: 3,
    title: "Tactics, Freezes & Scoring",
    difficulty: "Advanced",
    questions: [
      {
        prompt: "What is a stone called that comes to rest in front of the house to shield another scoring stone from being hit?",
        options: [
          "A Shield",
          "A Guard",
          "A Bumper",
          "A Wedge"
        ],
        correctIndex: 1,
        category: "Curling Basics",
        difficulty: "Beginner",
        explanation: "A Guard is positioned in the ice between the hog line and house to protect scoring rocks from opponent takeouts."
      },
      {
        prompt: "What high-precision shot comes to rest directly touching an opponent's rock without displacing it?",
        options: [
          "A Wick",
          "A Freeze",
          "A Tap",
          "A Chip"
        ],
        correctIndex: 1,
        category: "Shot Selection",
        difficulty: "Medium",
        explanation: "A Freeze rests directly against another stone, making it nearly impossible for the opponent to remove without taking out their own rock."
      },
      {
        prompt: "In a standard 10-end championship curling match, how many total stones are delivered across both teams in an end?",
        options: [
          "12 stones",
          "14 stones",
          "16 stones",
          "18 stones"
        ],
        correctIndex: 2,
        category: "Rules",
        difficulty: "Easy",
        explanation: "Each of the 4 players throws 2 stones per end, making 8 stones per team and 16 stones delivered in total per end."
      },
      {
        prompt: "What is the theoretical maximum score a team can record in a single end of traditional curling?",
        options: [
          "6 points",
          "8 points (An 8-Ender)",
          "10 points",
          "12 points"
        ],
        correctIndex: 1,
        category: "Scoring",
        difficulty: "Easy",
        explanation: "An 8-Ender is the maximum possible score in an end, occurring when all 8 stones of one team are closer to the button than any opponent stone."
      },
      {
        prompt: "What legendary Canadian skip, nicknamed 'The King' and 'The Wrench', captured four Briers and three World titles?",
        options: [
          "Kevin Martin",
          "Ernie Richardson",
          "Glenn Howard",
          "Randy Ferbey"
        ],
        correctIndex: 1,
        category: "Canadian Lore",
        difficulty: "Expert",
        explanation: "Ernie Richardson of Saskatchewan dominated curling in the late 1950s and early 1960s with his brother and cousins."
      }
    ]
  },
  {
    id: "trivia-match-day-4",
    dayIndex: 4,
    title: "Ice Conditions & Modern Tech",
    difficulty: "Medium",
    questions: [
      {
        prompt: "What happens to the running path of a curling stone when significant frost forms on the sheet?",
        options: [
          "The stone glides faster and curls much later",
          "The stone decelerates abruptly and its curl straightens unpredictably",
          "The stone begins to bounce off the hacks",
          "The stone curves in the opposite direction"
        ],
        correctIndex: 1,
        category: "Ice Conditions",
        difficulty: "Medium",
        explanation: "Frost dramatically increases friction along the running band, causing the stone to stop short and reducing its curl."
      },
      {
        prompt: "What sweeping broom technology triggered the famous 2015 'Broomgate' controversy in elite competitive curling?",
        options: [
          "Directional fabric brush heads that artificially steered rock trajectories",
          "Battery-powered vibrating brush heads",
          "Heated carbon fibre broom handles",
          "Steel-bristled scraping pads"
        ],
        correctIndex: 0,
        category: "Brooms & Tech",
        difficulty: "Hard",
        explanation: "Directional fabric heads allowed sweepers to manipulate stone trajectory independently of the thrower's release, leading to strict standardization."
      },
      {
        prompt: "In Mixed Doubles curling, how many total stones does each team throw during an end?",
        options: [
          "4 stones",
          "5 stones",
          "6 stones",
          "8 stones"
        ],
        correctIndex: 1,
        category: "Competitive Formats",
        difficulty: "Medium",
        explanation: "In Mixed Doubles, each team throws 5 stones per end, with one stationary rock from each team pre-positioned on the sheet before the end starts."
      },
      {
        prompt: "What line bisects the curling sheet lengthwise from hack to hack?",
        options: [
          "The Tee Line",
          "The Centre Line",
          "The Hog Line",
          "The Division Line"
        ],
        correctIndex: 1,
        category: "The Sheet",
        difficulty: "Beginner",
        explanation: "The Centre Line runs down the exact middle of the sheet, providing the fundamental alignment axis for all shots."
      },
      {
        prompt: "Which Canadian province holds the all-time record for the most Brier men's national curling championships?",
        options: [
          "Ontario",
          "Alberta",
          "Manitoba",
          "Saskatchewan"
        ],
        correctIndex: 2,
        category: "Canadian Lore",
        difficulty: "Medium",
        explanation: "Manitoba leads all provinces in Brier history with 27 national titles, followed closely by Alberta."
      }
    ]
  },
  {
    id: "trivia-match-day-5",
    dayIndex: 5,
    title: "Championship History & Rules",
    difficulty: "Expert",
    questions: [
      {
        prompt: "In what year was Curling officially restored as a full medal sport at the Winter Olympic Games?",
        options: [
          "1988 Calgary",
          "1992 Albertville",
          "1998 Nagano",
          "2002 Salt Lake City"
        ],
        correctIndex: 2,
        category: "Olympic History",
        difficulty: "Medium",
        explanation: "After years as a demonstration sport, curling returned as an official medal discipline at the 1998 Nagano Winter Games."
      },
      {
        prompt: "What is the Canadian Women's National Curling Championship officially called?",
        options: [
          "The Brier",
          "The Scotties Tournament of Hearts",
          "The Canada Cup",
          "The Continental Cup"
        ],
        correctIndex: 1,
        category: "Major Events",
        difficulty: "Easy",
        explanation: "The Canadian women's national championship has been contested as the Tournament of Hearts since 1982, sponsored by Scotties."
      },
      {
        prompt: "What strategic option in Mixed Doubles permits moving the pre-placed stones to the corner of the sheet?",
        options: [
          "The Corner Guard Option",
          "The Power Play",
          "The Hammer Extension",
          "The Split House"
        ],
        correctIndex: 1,
        category: "Competitive Formats",
        difficulty: "Hard",
        explanation: "Once per game, the team holding the hammer can call the Power Play, shifting stationary stones to the wings to create scoring opportunities."
      },
      {
        prompt: "What line runs perpendicularly across the sheet directly through the center of the house?",
        options: [
          "The Hog Line",
          "The Back Line",
          "The Tee Line",
          "The Hack Line"
        ],
        correctIndex: 2,
        category: "The Sheet",
        difficulty: "Easy",
        explanation: "The Tee Line intersects the centre line at the button. Any stone crossing the tee line may be swept by the opposing skip or vice."
      },
      {
        prompt: "Which Canadian skip led his team to an undefeated 11-0 Olympic Gold performance at Vancouver 2010?",
        options: [
          "Brad Gushue",
          "Kevin Martin",
          "Jeff Stoughton",
          "Pat Simmons"
        ],
        correctIndex: 1,
        category: "Canadian Lore",
        difficulty: "Medium",
        explanation: "Kevin 'The Old Bear' Martin led Canada (with John Morris, Marc Kennedy, Ben Hebert) to an unblemished 11-0 record in Vancouver."
      }
    ]
  },
  {
    id: "trivia-match-day-6",
    dayIndex: 6,
    title: "Curling Traditions & Culture",
    difficulty: "Accessible",
    questions: [
      {
        prompt: "What shot gently glances off an outer rock to alter trajectory toward a scoring position in the house?",
        options: [
          "A Wick (or Carom)",
          "A Peel",
          "A Hack",
          "A Slice"
        ],
        correctIndex: 0,
        category: "Shot Selection",
        difficulty: "Medium",
        explanation: "A Wick occurs when a traveling stone glances off the edge of a stationary rock to redirect into the house."
      },
      {
        prompt: "What delivery flaw occurs when a curler applies rotation in the direction opposite the intended curl?",
        options: [
          "Over-sweeping",
          "Negative handle (reverse rotation)",
          "Heavy weight",
          "Late release"
        ],
        correctIndex: 1,
        category: "Delivery",
        difficulty: "Hard",
        explanation: "Throwing a 'negative handle' puts counter-rotation on the rock, causing it to fall off line unpredictably."
      },
      {
        prompt: "What worldwide curling tradition dictates that the winning team buys the losing team a beverage after the match?",
        options: [
          "Broom-swapping ceremony",
          "Broomstacking",
          "The Extra Ends toast",
          "Sheet Handshake"
        ],
        correctIndex: 1,
        category: "Curling Culture",
        difficulty: "Beginner",
        explanation: "Known as Broomstacking, tradition calls for teams to sit together after a match, with the winners customarily buying the first round."
      },
      {
        prompt: "How many players constitute a complete team in traditional four-person curling?",
        options: [
          "3 players",
          "4 players",
          "5 players",
          "6 players"
        ],
        correctIndex: 1,
        category: "Curling Basics",
        difficulty: "Beginner",
        explanation: "A standard curling team consists of four players: Lead, Second, Third (Vice-Skip), and Skip."
      },
      {
        prompt: "Who is the legendary Newfoundland skip who captured Olympic Gold in 2006, Olympic Bronze in 2022, and multiple Brier titles?",
        options: [
          "Brad Gushue",
          "Wayne Middaugh",
          "Russ Howard",
          "Mark Nichols"
        ],
        correctIndex: 0,
        category: "Canadian Lore",
        difficulty: "Easy",
        explanation: "Brad Gushue of St. John's, Newfoundland & Labrador, is one of the most decorated skips in curling history, with 6 Brier championships and Olympic Gold."
      }
    ]
  }
];