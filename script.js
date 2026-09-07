(function () {
  'use strict';

  const SoundEngine = {
    ctx: null,
    enabled: true,

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    },

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    },

    playTap() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    },

    playCorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 783.99];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.075;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.20, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.33);
      });
    },

    playMiss() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.28);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.29);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.30);
    },

    playEndCelebration() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50];

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + i * 0.085;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.48);
      });
    }
  };

  const PUZZLE_SETS = [
    {
      id: 'round-01',
      title: 'Round #1: Equipment & Delivery Basics',
      themeCategory: 'Rules & Equipment',
      questions: [
        {
          question: 'What is the standard maximum weight of an official World Curling certified stone, including handle and bolt?',
          options: ['38.0 lbs (17.2 kg)', '44.0 lbs (19.96 kg)', '50.0 lbs (22.68 kg)', '32.5 lbs (14.74 kg)'],
          correctIndex: 1,
          explanation: 'Official curling stones weigh a maximum of 44.0 lbs (approx 19.96 kg) and have a minimum circumference of 36 inches.'
        },
        {
          question: 'What happens immediately if a delivered curling stone fails to clearly and completely cross the far hog line?',
          options: ['It remains as a valid guard', 'A 1-point penalty is awarded', 'It is promptly removed from play', 'The skip may reposition it'],
          correctIndex: 2,
          explanation: 'A stone that fails to completely cross the far hog line is out of play and immediately removed from the ice sheet.'
        },
        {
          question: 'What water droplet treatment is applied to the ice sheet before a match to reduce sliding friction?',
          options: ['Brining', 'Pebbling', 'Surface Scoring', 'Slagging'],
          correctIndex: 1,
          explanation: 'Pebbling involves sprinkling water droplets that freeze into tiny domes, enabling the concave stone running surface to glide.'
        },
        {
          question: 'From where on the ice sheet does a player anchor their foot to initiate the delivery slide?',
          options: ['The Button', 'The Tee Line', 'The Hack', 'The Back Line'],
          correctIndex: 2,
          explanation: 'The hack is the rubberized foothold mounted at each end of the sheet that serves as the delivery starting block.'
        },
        {
          question: 'What is the official term for a curling stone that barely grazes the outer perimeter of the 12-foot house?',
          options: ['A Biter', 'A Floater', 'A Chip', 'A Rim Rock'],
          correctIndex: 0,
          explanation: 'A biter is a stone that touches the outer 12-foot circle and can count for score if it remains in contact at the conclusion of the end.'
        }
      ]
    },
    {
      id: 'round-02',
      title: 'Round #2: House Strategy & Scoring',
      themeCategory: 'Tactics & Scoring',
      questions: [
        {
          question: 'What major tactical privilege is universally referred to as "The Hammer"?',
          options: ['Delivering the first stone of an end', 'Delivering the final stone of an end', 'Calling a strategic mid-game timeout', 'Declaring a double takeout'],
          correctIndex: 1,
          explanation: 'The hammer gives a team the decisive last-stone delivery advantage in an end.'
        },
        {
          question: 'What is an end called where neither team scores any points, allowing the hammer to be retained?',
          options: ['Wash End', 'Blank End', 'Dead End', 'Neutral Frame'],
          correctIndex: 1,
          explanation: 'In a Blank End, neither team scores, allowing the team that held the hammer to keep it into the next end.'
        },
        {
          question: 'When the team WITHOUT the hammer scores one or more points in an end, it is called a:',
          options: ['Clean Sweep', 'Steal', 'Breakout', 'Counter-Hog'],
          correctIndex: 1,
          explanation: 'A steal occurs when the defending team scores points despite their opponent possessing the hammer.'
        },
        {
          question: 'Under the Free Guard Zone rule, how many total stones must be delivered before opponent guards can be removed?',
          options: ['3 stones', '4 stones', '5 stones', '6 stones'],
          correctIndex: 2,
          explanation: 'Under the 5-rock Free Guard Zone rule, opponent stones in front of the house cannot be removed until the 6th rock of the end.'
        },
        {
          question: 'What is the exact diameter of the outermost scoring ring of the house in regulation curling?',
          options: ['10 feet', '12 feet', '14 feet', '16 feet'],
          correctIndex: 1,
          explanation: 'The house consists of three concentric rings measuring 4 feet, 8 feet, and 12 feet in diameter, centered on the 1-foot button.'
        }
      ]
    },
    {
      id: 'round-03',
      title: 'Round #3: Sweeping Science & Team Roles',
      themeCategory: 'Sweeping & Biomechanics',
      questions: [
        {
          question: 'Which team member acts as captain, orchestrates house strategy, and holds the target broom?',
          options: ['The Lead', 'The Second', 'The Vice-Skip', 'The Skip'],
          correctIndex: 3,
          explanation: 'The skip directs game strategy, signals shot calls, and usually throws the final two stones.'
        },
        {
          question: 'How does vigorous sweeping physically alter the path of a traveling curling stone?',
          options: [
            'It decreases stone speed to sharpen curl',
            'It momentarily warms the ice, reducing friction to keep the stone straighter and traveling farther',
            'It magnetizes the running band to lock onto the tee line',
            'It cools the pebble surface to cause an immediate stop'
          ],
          correctIndex: 1,
          explanation: 'Sweeping produces momentary frictional heat that lubricates the pebble, extending stone distance and reducing curl.'
        },
        {
          question: 'What is the shot called where a thrown stone removes an opponent stone while stopping dead in place?',
          options: ['Hit and Roll', 'Nose Takeout', 'Peel', 'Promote Tap'],
          correctIndex: 1,
          explanation: 'A nose takeout strikes an opponent rock dead center, transferring momentum and leaving the shooter stationary.'
        },
        {
          question: 'In traditional 4-player team curling, how many total stones does each team throw in a regulation end?',
          options: ['6 stones', '8 stones', '10 stones', '12 stones'],
          correctIndex: 1,
          explanation: 'Each player on a 4-person team delivers 2 stones, giving each team 8 stones per end (16 stones total).'
        },
        {
          question: 'What is the player foot called that wears a slick Teflon or stainless steel sole to slide out of the hack?',
          options: ['The Gripper foot', 'The Slider foot', 'The Pivot foot', 'The Anchor foot'],
          correctIndex: 1,
          explanation: 'The slider shoe features a Teflon or stainless sole for frictionless gliding, while the other foot wears a rubber gripper.'
        }
      ]
    },
    {
      id: 'round-04',
      title: 'Round #4: Championship Heritage',
      themeCategory: 'Tournaments & History',
      questions: [
        {
          question: 'What is the official title of Canada’s annual Men’s National Curling Championship?',
          options: ['The Brier', 'The Roar of the Rings', 'The Silver Broom', 'The Tankard Cup'],
          correctIndex: 0,
          explanation: 'The Brier is Canada’s national men’s curling championship, first contested in 1927.'
        },
        {
          question: 'Which Scottish island is world-famous as the quarry source of Olympic-grade curling granite?',
          options: ['Isle of Skye', 'Ailsa Craig', 'Orkney', 'Isle of Mull'],
          correctIndex: 1,
          explanation: 'Ailsa Craig supplies the unique Common Green and Blue Hone microgranite used to craft top-tier curling stones.'
        },
        {
          question: 'Curling was first officially contested as an Olympic medal sport at the inaugural Winter Games in:',
          options: ['1924 Chamonix', '1932 Lake Placid', '1988 Calgary', '1998 Nagano'],
          correctIndex: 0,
          explanation: 'Curling was contested at the 1924 Chamonix Games; the IOC retroactively verified its official medal status in 2006.'
        },
        {
          question: 'What is the name of Canada’s National Women’s Curling Championship?',
          options: ['The Tournament of Hearts', 'The Queen’s Shield', 'The Maple Broom', 'The Lady Brier'],
          correctIndex: 0,
          explanation: 'The Tournament of Hearts has crowned Canada’s women’s national champions since 1982.'
        },
        {
          question: 'What traditional Scottish term describes a multi-day social or competitive curling tournament?',
          options: ['A Bonspiel', 'A Derby', 'A Canto', 'A Regatta'],
          correctIndex: 0,
          explanation: 'A "Bonspiel" is the traditional Scottish term for a curling tournament, used across the curling world.'
        }
      ]
    },
    {
      id: 'round-05',
      title: 'Round #5: Advanced Rules & Timing',
      themeCategory: 'Advanced Rules',
      questions: [
        {
          question: 'Why has curling historically been nicknamed "The Roaring Game"?',
          options: [
            'Because skips roar shot calls to sweepers',
            'Due to the resonant rumbling sound of 44-lb granite gliding over pebbled ice',
            'Because early Scottish clubs had lion mascots',
            'Because bonfires roared beside frozen lochs'
          ],
          correctIndex: 1,
          explanation: 'The low resonant roar of polished granite rocks rumbling across textured pebbled ice gave curling its historic nickname.'
        },
        {
          question: 'Which line crosses the exact center of the house rings, perpendicular to the center line?',
          options: ['The Tee Line', 'The Hog Line', 'The Back Line', 'The Courtesy Line'],
          correctIndex: 0,
          explanation: 'The tee line intersects the button, dividing the house into front and back halves.'
        },
        {
          question: 'Once an opponent rock crosses the tee line behind the house, who is legally permitted to sweep it out?',
          options: ['Any player on the sheet', 'Only the opposing skip or vice-skip', 'Nobody is allowed', 'Both team leads simultaneously'],
          correctIndex: 1,
          explanation: 'Behind the tee line, only one player from the opposing team (skip or vice-skip) may sweep the opponent stone to carry it out.'
        },
        {
          question: 'What rotational direction is an "in-turn" for a right-handed curling delivery?',
          options: ['Clockwise (turn inward from 10 to 12 o’clock)', 'Counter-clockwise', 'Zero rotation dead slide', 'Oscillating wobble'],
          correctIndex: 0,
          explanation: 'For a right-handed delivery, an in-turn rotates clockwise, turning inward towards the body upon release.'
        },
        {
          question: 'What is the "Thinking Time" system utilized in elite World Curling tournament play?',
          options: [
            'Timers that run only when rocks are traveling',
            'A clock that ticks down only when a team is actively planning their shot between deliveries',
            'A rigid 30-second shot clock for every throw',
            'A 10-minute timeout reserve for the skip'
          ],
          correctIndex: 1,
          explanation: 'Thinking time measures active strategy time before delivery, stopping once the delivered stone crosses the tee line.'
        }
      ]
    },
    {
      id: 'round-06',
      title: 'Round #6: Mixed Doubles Dynamics',
      themeCategory: 'Modern Formats',
      questions: [
        {
          question: 'How many players comprise each team in an official Mixed Doubles curling match?',
          options: ['2 players (one male, one female)', '3 players', '4 players', '2 players of any gender'],
          correctIndex: 0,
          explanation: 'Mixed Doubles features two-player teams patterns consisting strictly of one female and one male curler.'
        },
        {
          question: 'How many total stones are delivered per team in a standard Mixed Doubles end?',
          options: ['5 stones', '6 stones', '8 stones', '4 stones'],
          correctIndex: 0,
          explanation: 'In Mixed Doubles, each team delivers 5 stones per end, with one stationary stone pre-positioned before each end begins.'
        },
        {
          question: 'What tactical option allows a team to move both pre-placed stones to the side wings once per match?',
          options: ['Power Play', 'Free Hammer', 'Wing Shift', 'Steal Option'],
          correctIndex: 0,
          explanation: 'A team with the hammer can invoke a Power Play once per game, moving pre-placed stones to split wings for scoring opportunities.'
        },
        {
          question: 'How many regulation ends are played in an official World Curling Mixed Doubles game?',
          options: ['8 ends', '10 ends', '6 ends', '12 ends'],
          correctIndex: 0,
          explanation: 'Regulation Mixed Doubles games are played to 8 ends, rather than traditional 10-end games.'
        },
        {
          question: 'In Mixed Doubles, can the player who delivers the stone also jump up and sweep their own rock?',
          options: ['Yes, fully permitted', 'No, strictly illegal', 'Only behind the tee line', 'Only if the skip allows'],
          correctIndex: 0,
          explanation: 'Because there are only two players on the team, the thrower is legally permitted to jump up and sweep their own delivered rock.'
        }
      ]
    },
    {
      id: 'round-07',
      title: 'Round #7: Ice Making & Pebbling Craft',
      themeCategory: 'Ice Science',
      questions: [
        {
          question: 'What is the optimal surface temperature range for championship indoor curling ice?',
          options: ['21°F to 24°F (-6°C to -4.5°C)', '31°F to 32°F (0°C)', '10°F to 14°F (-12°C)', '28°F to 30°F (-2°C)'],
          correctIndex: 0,
          explanation: 'Ice technicians maintain curling ice surface temperatures between 21°F and 24°F to balance stone grip and glide.'
        },
        {
          question: 'What tool is used by ice technicians to shave pebble tips down to a uniform plane?',
          options: ['A Nipper or Ice Scraper', 'A Steam Torch', 'A Wire Rake', 'A Rotary Buffer'],
          correctIndex: 0,
          explanation: 'A nipper or specialized ice scraper cuts the frozen pebble heads to create a uniform, flat contact running surface.'
        },
        {
          question: 'What type of water is standard for creating high-level curling sheet pebble?',
          options: ['Deionized or Reverse-Osmosis purified water', 'Natural spring water with minerals', 'Standard tap water', 'Salt-enriched brine'],
          correctIndex: 0,
          explanation: 'Purified deionized water eliminates dissolved minerals that would otherwise cause brittle pebbles and erratic stone curl.'
        },
        {
          question: 'What causes the phenomenon of "negative curl" or a "fall-away" on an ice sheet?',
          options: ['Sheet slope or uneven temperature variations across the ice', 'Over-sweeping by leads', 'Heavy stone handles', 'Dull hack pegs'],
          correctIndex: 0,
          explanation: 'Uneven sheet leveling or subtle temperature gradients can cause stones to fall away from their natural curl rotation.'
        },
        {
          question: 'What is the circular bottom contact ring of a curling stone called?',
          options: ['The Running Band', 'The Glider Edge', 'The Friction Ring', 'The Cup Perimeter'],
          correctIndex: 0,
          explanation: 'Curling stones are hollowed on the bottom; only a narrow circular ring called the running band makes contact with the ice.'
        }
      ]
    },
    {
      id: 'round-08',
      title: 'Round #8: Delivery Mechanics & Releases',
      themeCategory: 'Biomechanics & Technique',
      questions: [
        {
          question: 'What must a curler do before their delivered stone reaches the near hog line?',
          options: [
            'Completely release their grip from the stone handle',
            'Stand fully upright',
            'Come to a complete stop',
            'Call out their rotation choice'
          ],
          correctIndex: 0,
          explanation: 'The stone must be clearly released from the player’s hand before any part of the stone crosses the near hog line.'
        },
        {
          question: 'What modern electronic device is embedded in stone handles at elite competitions to detect late releases?',
          options: ['Eye on the Hog sensor', 'Tee-Line Radar', 'Laser Tracker', 'Hack Beacon'],
          correctIndex: 0,
          explanation: 'The "Eye on the Hog" handle uses magnetic sensors in the ice and conductive handle sensors to verify release before the hog line.'
        },
        {
          question: 'What is an "out-turn" release for a right-handed curling delivery?',
          options: [
            'Counter-clockwise rotation (handle turned from 2 to 12 o’clock)',
            'Clockwise rotation',
            'Straight push without spin',
            'A backspin release'
          ],
          correctIndex: 0,
          explanation: 'For a right-handed player, an out-turn is turned outward to the right and released with a counter-clockwise spin.'
        },
        {
          question: 'Approximately how many rotations should a well-thrown curling stone make along its journey down the sheet?',
          options: ['3 to 4.5 rotations', '10 to 12 rotations', 'Exactly 1 rotation', '15 to 20 rotations'],
          correctIndex: 0,
          explanation: 'Optimal curling stone trajectory relies on 3 to 4.5 deliberate rotations from delivery release to house finish.'
        },
        {
          question: 'What delivery stabilizer aid is commonly used instead of a broom for balance in the slide?',
          options: ['A Sliding Stabilizer', 'A Walking Cane', 'A Ski Pole', 'A Balance Barometer'],
          correctIndex: 0,
          explanation: 'A sliding stabilizer provides a stable triangular base for the non-throwing hand during the slide.'
        }
      ]
    },
    {
      id: 'round-09',
      title: 'Round #9: Defensive Strategy',
      themeCategory: 'Defensive Strategy',
      questions: [
        {
          question: 'When a team DOES NOT have the hammer, what is their primary strategic objective for stone placement?',
          options: [
            'Clutter the center line with guards to steal or force a single point',
            'Keep the center wide open for easy takeouts',
            'Intentionally throw stones out of play',
            'Concede the end immediately'
          ],
          correctIndex: 0,
          explanation: 'Without the hammer, teams throw center guards to obscure the four-foot, aiming to steal or force the opponent to just 1 point.'
        },
        {
          question: 'What does it mean to "Force" an opponent who possesses the hammer?',
          options: [
            'Limiting the hammer team to scoring only 1 point in that end',
            'Forcing the skip to call a timeout',
            'Causing a hog line penalty',
            'Making the opponent throw out of turn'
          ],
          correctIndex: 0,
          explanation: 'Holding the hammer team to only a single point is considered a major tactical win for the defending team.'
        },
        {
          question: 'What is a "Corner Guard" typically thrown to achieve?',
          options: [
            'To set up multiple scoring stones on the wings for the team WITH the hammer',
            'To block the center line',
            'To stop opponent stones from entering the hack',
            'To protect the scoreboard'
          ],
          correctIndex: 0,
          explanation: 'Corner guards are placed wide of the center line, giving the hammer team sheltered avenues to generate 2 or more points.'
        },
        {
          question: 'What is a "Split" shot in curling strategy?',
          options: [
            'Hitting a stone to leave two friendly stones in scoring position in the house',
            'Cracking a granite stone in two',
            'Splitting broom sweeping duties',
            'Dividing the prize money'
          ],
          correctIndex: 0,
          explanation: 'A split involves tapping a guard stone into the house while rolling the delivered stone into the rings as well.'
        },
        {
          question: 'What shot intentionally taps a stationary friendly rock deeper into the house or onto the button?',
          options: ['A Raise or Promote', 'A Peel', 'A Slash', 'A Chip and Roll'],
          correctIndex: 0,
          explanation: 'A raise (or promote) strikes a stone in front of the house to drive it further toward the button.'
        }
      ]
    },
    {
      id: 'round-10',
      title: 'Round #10: Etiquette & Traditions',
      themeCategory: 'Etiquette & Sportsmanship',
      questions: [
        {
          question: 'What is the tradition that occurs immediately following the conclusion of a curling match?',
          options: [
            '"Broomstacking" — sharing drinks and conversation with the opposing team',
            'Trading team jerseys',
            'Throwing stones for distance',
            'A mandatory ice sprint'
          ],
          correctIndex: 0,
          explanation: '"Broomstacking" is the curling tradition where opponents sit together after the game to socialize.'
        },
        {
          question: 'If a curler accidentally touches or "burns" a moving stone with their broom or foot, what is the required etiquette?',
          options: [
            'The player immediately admits the infraction and informs the skips',
            'Wait and see if the opponent noticed',
            'Sweep harder to compensate',
            'Call an umpire for a replay'
          ],
          correctIndex: 0,
          explanation: 'The Spirit of Curling dictates that players self-police and immediately call their own violations.'
        },
        {
          question: 'What is customary to say to all opponents before starting the first end of any curling match?',
          options: ['"Good Curling!" accompanied by a handshake', '"May the ice be fast!"', '"Beware the hammer!"', '"Clean sweeping!"'],
          correctIndex: 0,
          explanation: 'Curling etiquette requires shaking hands with every opponent and wishing them "Good Curling" before the match begins.'
        },
        {
          question: 'Where must non-sweeping players on the delivering team stand while their opponents deliver?',
          options: [
            'Stationary between the hog lines along the outer sidelines',
            'Directly behind the opposing skip in the house',
            'Sitting on the hacks',
            'Anywhere on the sheet'
          ],
          correctIndex: 0,
          explanation: 'Non-active players must remain quietly motionless on the outer sidelines between the hog lines to avoid distraction.'
        },
        {
          question: 'When a trailing team realizes they cannot catch up, what is standard curling etiquette?',
          options: [
            'Conceding the game with handshakes, regardless of remaining ends',
            'Stalling out the clock',
            'Throwing stones hard at the sideboards',
            'Refusing to throw rocks'
          ],
          correctIndex: 0,
          explanation: 'Curling honors conceding when victory is no longer possible; doing so is viewed as respectful sportsmanship.'
        }
      ]
    }
  ];

  const STORAGE_KEY = 'THE_BUTTON_CURLING_STATE_V2';
  const ANCHOR_EPOCH = new Date('2025-01-01T00:00:00Z').getTime();

  const StateManager = {
    data: {
      completedPuzzles: {},
      activeGame: null,
      stats: {
        played: 0,
        perfectSweeps: 0,
        currentStreak: 0,
        maxStreak: 0,
        lastPlayedDaily: null,
        totalPoints: 0,
        totalQuestionsAnswered: 0,
        totalQuestionsCorrect: 0
      },
      soundEnabled: true
    },

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            this.data = Object.assign(this.data, parsed);
            this.data.stats = Object.assign({
              played: 0,
              perfectSweeps: 0,
              currentStreak: 0,
              maxStreak: 0,
              lastPlayedDaily: null,
              totalPoints: 0,
              totalQuestionsAnswered: 0,
              totalQuestionsCorrect: 0
            }, parsed.stats || {});
          }
        }
      } catch (e) {
        // proceed with defaults
      }
      this.reconcileStreak();
    },

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        // quota exceeded or private mode
      }
    },

    getTodayIso() {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    getYesterdayIso() {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    reconcileStreak() {
      const last = this.data.stats.lastPlayedDaily;
      if (!last) {
        this.data.stats.currentStreak = 0;
        return;
      }
      const today = this.getTodayIso();
      const yesterday = this.getYesterdayIso();
      if (last !== today && last !== yesterday) {
        this.data.stats.currentStreak = 0;
        this.save();
      }
    },

    getDailyPuzzleIndex() {
      const now = new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const dayCount = Math.max(0, Math.floor((todayMidnight - ANCHOR_EPOCH) / (1000 * 60 * 60 * 24)));
      return dayCount % PUZZLE_SETS.length;
    },

    getSanitizedPuzzles() {
      const seenIds = new Set();
      const sanitized = [];

      PUZZLE_SETS.forEach((p, idx) => {
        if (!p || typeof p !== 'object') return;
        const id = String(p.id || `round-${idx + 1}`);
        if (seenIds.has(id)) return;
        seenIds.add(id);

        const safeQuestions = Array.isArray(p.questions) ? p.questions.filter(q => {
          return q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 2;
        }) : [];

        if (safeQuestions.length === 0) return;

        sanitized.push({
          id,
          title: p.title || `Round #${idx + 1}`,
          themeCategory: p.themeCategory || 'General Rules',
          questions: safeQuestions,
          poolIndex: idx
        });
      });

      return sanitized;
    },

    categorizePuzzles() {
      const sanitized = this.getSanitizedPuzzles();
      if (sanitized.length === 0) {
        return { today: null, archive: [] };
      }

      const dailyIdx = this.getDailyPuzzleIndex();
      const today = sanitized[dailyIdx] || sanitized[0];

      return { today, archive: sanitized };
    },

    recordEndCompleted(puzzleId, isDaily, score, answers) {
      const todayIso = this.getTodayIso();
      const correctCount = answers.filter(Boolean).length;
      const isPerfect = (score === 500);

      const existing = this.data.completedPuzzles[puzzleId];
      const isBetter = !existing || score >= existing.score;

      this.data.completedPuzzles[puzzleId] = {
        score: isBetter ? score : existing.score,
        correct: isBetter ? correctCount : existing.correct,
        total: answers.length,
        date: todayIso,
        answers: isBetter ? answers : existing.answers
      };

      this.data.stats.played += 1;
      this.data.stats.totalPoints += score;
      this.data.stats.totalQuestionsAnswered += answers.length;
      this.data.stats.totalQuestionsCorrect += correctCount;
      if (isPerfect) {
        this.data.stats.perfectSweeps += 1;
      }

      if (isDaily) {
        const yesterdayIso = this.getYesterdayIso();
        const lastDaily = this.data.stats.lastPlayedDaily;

        if (lastDaily === todayIso) {
          // maintain current streak
        } else if (lastDaily === yesterdayIso) {
          this.data.stats.currentStreak += 1;
        } else {
          this.data.stats.currentStreak = 1;
        }

        this.data.stats.maxStreak = Math.max(this.data.stats.maxStreak, this.data.stats.currentStreak);
        this.data.stats.lastPlayedDaily = todayIso;
      }

      this.data.activeGame = null;
      this.save();
    }
  };

  const App = {
    currentScreen: 'screen-menu',
    previousScreen: 'screen-menu',
    activePuzzle: null,
    isDailyMode: true,
    currentQuestionIdx: 0,
    currentScore: 0,
    answersLog: [],
    currentVaultFilter: 'all',
    activeModal: null,

    els: {},

    init() {
      StateManager.load();
      SoundEngine.enabled = StateManager.data.soundEnabled !== false;

      this.cacheElements();
      this.bindEvents();
      this.updateMenuScreen();
      this.restoreActiveGameIfAvailable();
    },

    cacheElements() {
      this.els.screens = document.querySelectorAll('.screen');
      this.els.btnNavHome = document.getElementById('btn-nav-home');
      this.els.btnNavStats = document.getElementById('btn-open-stats');
      this.els.btnAudioToggle = document.getElementById('btn-audio-toggle');
      this.els.audioIcon = document.getElementById('audio-icon');
      this.els.systemDate = document.getElementById('system-date-display');
      
      this.els.btnPlayDaily = document.getElementById('btn-play-daily');
      this.els.btnOpenVault = document.getElementById('btn-open-vault');
      this.els.btnMenuStats = document.getElementById('btn-menu-stats');
      this.els.btnOpenRules = document.getElementById('btn-open-rules');
      this.els.dailyBadge = document.getElementById('daily-status-badge');
      this.els.vaultBadge = document.getElementById('vault-count-badge');
      this.els.dailyReadyPill = document.getElementById('daily-ready-pill');
      this.els.streakCounterPill = document.getElementById('streak-counter-pill');

      this.els.hudTitle = document.getElementById('hud-puzzle-title');
      this.els.hudScore = document.getElementById('hud-score-val');
      this.els.pips = document.querySelectorAll('.stone-pip');
      this.els.triviaCard = document.getElementById('trivia-card');
      this.els.cardCategory = document.getElementById('trivia-category');
      this.els.cardQNum = document.getElementById('trivia-qnum');
      this.els.cardQuestion = document.getElementById('trivia-question');
      this.els.cardOptions = document.getElementById('trivia-options');
      this.els.feedbackDrawer = document.getElementById('trivia-feedback');
      this.els.feedbackBadge = document.getElementById('feedback-badge');
      this.els.feedbackHeadline = document.getElementById('feedback-title');
      this.els.feedbackBody = document.getElementById('feedback-explanation');
      this.els.btnNextQuestion = document.getElementById('btn-next-question');

      this.els.recapTitle = document.getElementById('recap-title');
      this.els.recapScoreBig = document.getElementById('recap-score-big');
      this.els.recapRating = document.getElementById('recap-rating');
      this.els.recapShotsVisual = document.getElementById('recap-shots-visual');
      this.els.recapCorrect = document.getElementById('recap-correct-count');
      this.els.recapDate = document.getElementById('recap-date');
      this.els.recapStreak = document.getElementById('recap-streak-display');
      this.els.btnShareScore = document.getElementById('btn-share-score');
      this.els.btnRecapReturn = document.getElementById('btn-recap-return');
      this.els.btnRecapVault = document.getElementById('btn-recap-vault');

      this.els.vaultList = document.getElementById('vault-list');
      this.els.vaultEmpty = document.getElementById('vault-empty');
      this.els.vaultAvailableTag = document.getElementById('vault-available-tag');
      this.els.filterAll = document.getElementById('filter-all');
      this.els.filterUnplayed = document.getElementById('filter-unplayed');
      this.els.filterCompleted = document.getElementById('filter-completed');
      this.els.btnVaultBack = document.getElementById('btn-vault-back');

      this.els.modalStats = document.getElementById('screen-stats');
      this.els.modalRules = document.getElementById('screen-rules');
      this.els.backdropStats = document.getElementById('modal-backdrop-stats');
      this.els.backdropRules = document.getElementById('modal-backdrop-rules');
      this.els.btnCloseStats = document.getElementById('btn-close-stats');
      this.els.btnDismissStats = document.getElementById('btn-dismiss-stats');
      this.els.btnCloseRules = document.getElementById('btn-close-rules');
      this.els.btnDismissRules = document.getElementById('btn-dismiss-rules');
      this.els.statPlayed = document.getElementById('stat-played');
      this.els.statStreak = document.getElementById('stat-streak');
      this.els.statMaxStreak = document.getElementById('stat-max-streak');
      this.els.statPerfect = document.getElementById('stat-perfect');
      this.els.statAccuracy = document.getElementById('stat-accuracy');

      this.els.toast = document.getElementById('toast-banner');
      this.els.toastMsg = document.getElementById('toast-message');

      this.els.audioIcon.textContent = SoundEngine.enabled ? '🔊' : '🔇';
    },

    bindEvents() {
      this.els.btnAudioToggle.addEventListener('click', () => {
        const isMuted = !SoundEngine.toggle();
        StateManager.data.soundEnabled = !isMuted;
        StateManager.save();
        this.els.audioIcon.textContent = isMuted ? '🔇' : '🔊';
        if (!isMuted) SoundEngine.playTap();
      });

      this.els.btnNavHome.addEventListener('click', () => {
        SoundEngine.playTap();
        this.handleHomeNavigation();
      });

      const openStatsHandler = () => {
        SoundEngine.playTap();
        this.renderStatsModal();
        this.openModal('stats');
      };
      this.els.btnNavStats.addEventListener('click', openStatsHandler);
      this.els.btnMenuStats.addEventListener('click', openStatsHandler);

      const closeStatsHandler = () => {
        SoundEngine.playTap();
        this.closeModal('stats');
      };
      this.els.btnCloseStats.addEventListener('click', closeStatsHandler);
      this.els.btnDismissStats.addEventListener('click', closeStatsHandler);
      if (this.els.backdropStats) {
        this.els.backdropStats.addEventListener('click', closeStatsHandler);
      }

      this.els.btnOpenRules.addEventListener('click', () => {
        SoundEngine.playTap();
        this.openModal('rules');
      });

      const closeRulesHandler = () => {
        SoundEngine.playTap();
        this.closeModal('rules');
      };
      this.els.btnCloseRules.addEventListener('click', closeRulesHandler);
      this.els.btnDismissRules.addEventListener('click', closeRulesHandler);
      if (this.els.backdropRules) {
        this.els.backdropRules.addEventListener('click', closeRulesHandler);
      }

      this.els.btnPlayDaily.addEventListener('click', () => {
        SoundEngine.playTap();
        const active = StateManager.data.activeGame;
        const { today } = StateManager.categorizePuzzles();
        if (today) {
          if (active && active.puzzleId === today.id && active.answers && active.answers.length < today.questions.length) {
            this.restoreActiveGameIfAvailable();
          } else {
            this.startPuzzle(today, true);
          }
        }
      });

      this.els.btnOpenVault.addEventListener('click', () => {
        SoundEngine.playTap();
        this.renderVault();
        this.showScreen('screen-vault');
      });

      this.els.filterAll.addEventListener('click', () => this.setVaultFilter('all'));
      this.els.filterUnplayed.addEventListener('click', () => this.setVaultFilter('unplayed'));
      this.els.filterCompleted.addEventListener('click', () => this.setVaultFilter('completed'));
      this.els.btnVaultBack.addEventListener('click', () => {
        SoundEngine.playTap();
        this.showScreen('screen-menu');
        this.updateMenuScreen();
      });

      this.els.btnNextQuestion.addEventListener('click', () => {
        SoundEngine.playTap();
        this.advanceQuestion();
      });

      this.els.btnRecapReturn.addEventListener('click', () => {
        SoundEngine.playTap();
        this.showScreen('screen-menu');
        this.updateMenuScreen();
      });

      this.els.btnRecapVault.addEventListener('click', () => {
        SoundEngine.playTap();
        this.renderVault();
        this.showScreen('screen-vault');
      });

      this.els.btnShareScore.addEventListener('click', () => {
        SoundEngine.playTap();
        this.handleScoreShare();
      });

      window.addEventListener('keydown', (e) => {
        if (this.activeModal) {
          if (e.key === 'Escape') {
            this.closeModal(this.activeModal);
          }
          return;
        }

        if (this.currentScreen === 'screen-game') {
          const key = e.key.toUpperCase();
          const optionBtns = this.els.cardOptions.querySelectorAll('.option-btn');

          if (!this.els.feedbackDrawer.classList.contains('hidden')) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.advanceQuestion();
            }
            return;
          }

          const map = { '1': 0, 'A': 0, '2': 1, 'B': 1, '3': 2, 'C': 2, '4': 3, 'D': 3 };
          if (map[key] !== undefined && optionBtns[map[key]] && !optionBtns[map[key]].disabled) {
            e.preventDefault();
            optionBtns[map[key]].click();
          }
        }
      });
    },

    openModal(modalKey) {
      this.activeModal = modalKey;
      if (modalKey === 'stats') {
        this.els.modalStats.classList.remove('hidden');
      } else if (modalKey === 'rules') {
        this.els.modalRules.classList.remove('hidden');
      }
    },

    closeModal(modalKey) {
      this.activeModal = null;
      if (modalKey === 'stats') {
        this.els.modalStats.classList.add('hidden');
      } else if (modalKey === 'rules') {
        this.els.modalRules.classList.add('hidden');
      }
    },

    showScreen(screenId) {
      if (this.currentScreen !== screenId) {
        this.previousScreen = this.currentScreen;
      }
      this.currentScreen = screenId;

      this.els.screens.forEach(s => {
        if (s.id === screenId) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    },

    handleHomeNavigation() {
      if (this.currentScreen === 'screen-game' && this.activePuzzle && this.answersLog.length < this.activePuzzle.questions.length) {
        const confirmLeave = window.confirm('Exit current game? Your progress will be saved.');
        if (!confirmLeave) return;
      }
      this.showScreen('screen-menu');
      this.updateMenuScreen();
    },

    restoreActiveGameIfAvailable() {
      const active = StateManager.data.activeGame;
      if (active && active.puzzleId) {
        const sanitized = StateManager.getSanitizedPuzzles();
        const target = sanitized.find(p => p.id === active.puzzleId);
        if (target) {
          this.activePuzzle = target;
          this.isDailyMode = !!active.isDaily;
          this.answersLog = Array.isArray(active.answers) ? active.answers : [];
          this.currentScore = active.score || (this.answersLog.filter(Boolean).length * 100);
          this.currentQuestionIdx = Math.min(this.answersLog.length, target.questions.length - 1);

          this.els.hudTitle.textContent = target.title.split(':')[0].toUpperCase();
          this.els.hudScore.textContent = this.currentScore;
          this.renderPips();
          this.loadQuestion();
          this.showScreen('screen-game');
          return;
        }
      }
      this.showScreen('screen-menu');
    },

    updateMenuScreen() {
      const { today, archive } = StateManager.categorizePuzzles();
      const active = StateManager.data.activeGame;

      const dateOpts = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      const formattedDate = new Date().toLocaleDateString('en-US', dateOpts).toUpperCase();
      this.els.systemDate.textContent = `📅 TODAY: ${formattedDate}`;

      const streak = StateManager.data.stats.currentStreak || 0;
      this.els.streakCounterPill.textContent = `🔥 ${streak} DAY STREAK`;

      if (!today) {
        this.els.dailyBadge.textContent = 'UNAVAILABLE';
        this.els.btnPlayDaily.disabled = true;
      } else {
        const isDone = !!StateManager.data.completedPuzzles[today.id];
        const isInProgress = (active && active.puzzleId === today.id && active.answers && active.answers.length < today.questions.length);

        if (isInProgress) {
          this.els.dailyBadge.textContent = `QUESTION ${active.answers.length + 1}/5`;
          this.els.dailyReadyPill.textContent = 'GAME IN PROGRESS';
          this.els.dailyReadyPill.style.background = 'var(--curling-gold-soft)';
          this.els.dailyReadyPill.style.color = '#92400e';
          this.els.btnPlayDaily.querySelector('.btn-text').textContent = 'RESUME TODAY’S CHALLENGE';
        } else if (isDone) {
          this.els.dailyBadge.textContent = 'COMPLETED';
          this.els.dailyReadyPill.textContent = 'CHALLENGE COMPLETED';
          this.els.dailyReadyPill.style.background = 'var(--status-green-bg)';
          this.els.dailyReadyPill.style.color = 'var(--status-green-dark)';
          this.els.btnPlayDaily.querySelector('.btn-text').textContent = 'REPLAY TODAY’S CHALLENGE';
        } else {
          this.els.dailyBadge.textContent = 'READY';
          this.els.dailyReadyPill.textContent = 'TODAY’S CHALLENGE';
          this.els.dailyReadyPill.style.background = '#ffffff';
          this.els.dailyReadyPill.style.color = 'var(--canadian-red)';
          this.els.btnPlayDaily.querySelector('.btn-text').textContent = 'PLAY TODAY’S CHALLENGE';
        }
        this.els.btnPlayDaily.disabled = false;
      }

      this.els.vaultBadge.textContent = `${archive.length} AVAILABLE`;
    },

    renderStatsModal() {
      const stats = StateManager.data.stats;
      this.els.statPlayed.textContent = stats.played;
      this.els.statStreak.textContent = stats.currentStreak;
      this.els.statMaxStreak.textContent = stats.maxStreak;
      this.els.statPerfect.textContent = stats.perfectSweeps;

      let accuracy = 0;
      if (stats.totalQuestionsAnswered > 0) {
        accuracy = Math.round((stats.totalQuestionsCorrect / stats.totalQuestionsAnswered) * 100);
      }
      this.els.statAccuracy.textContent = `${accuracy}% Correct`;
    },

    setVaultFilter(filter) {
      this.currentVaultFilter = filter;
      [this.els.filterAll, this.els.filterUnplayed, this.els.filterCompleted].forEach(btn => btn.classList.remove('active'));

      if (filter === 'all') this.els.filterAll.classList.add('active');
      if (filter === 'unplayed') this.els.filterUnplayed.classList.add('active');
      if (filter === 'completed') this.els.filterCompleted.classList.add('active');

      this.renderVault();
    },

    renderVault() {
      const { archive, today } = StateManager.categorizePuzzles();
      this.els.vaultList.innerHTML = '';
      this.els.vaultAvailableTag.textContent = `${archive.length} ROUNDS`;

      const filtered = archive.filter(puzzle => {
        const isDone = !!StateManager.data.completedPuzzles[puzzle.id];
        if (this.currentVaultFilter === 'completed') return isDone;
        if (this.currentVaultFilter === 'unplayed') return !isDone;
        return true;
      });

      if (filtered.length === 0) {
        this.els.vaultEmpty.classList.remove('hidden');
        return;
      }

      this.els.vaultEmpty.classList.add('hidden');

      filtered.forEach(puzzle => {
        const completion = StateManager.data.completedPuzzles[puzzle.id];
        const isTodayPuzzle = today && puzzle.id === today.id;
        const card = document.createElement('div');
        card.className = 'vault-card';

        const info = document.createElement('div');
        info.className = 'vault-card-info';

        const title = document.createElement('h3');
        title.className = 'vault-card-day';
        title.textContent = isTodayPuzzle ? `${puzzle.title} (Today)` : puzzle.title;

        const meta = document.createElement('span');
        meta.className = 'vault-card-meta';
        meta.textContent = `${puzzle.themeCategory.toUpperCase()} • 5 QUESTIONS`;

        const score = document.createElement('span');
        if (completion) {
          score.className = 'vault-card-score';
          score.textContent = `Best: ${completion.score} / 500 Pts (${completion.correct}/5 Correct)`;
        } else {
          score.className = 'vault-card-score unplayed';
          score.textContent = 'Not Played';
        }

        info.appendChild(title);
        info.appendChild(meta);
        info.appendChild(score);

        const playBtn = document.createElement('button');
        playBtn.className = 'neo-btn nav-btn';
        playBtn.textContent = completion ? 'REPLAY' : 'PLAY';
        playBtn.addEventListener('click', () => {
          SoundEngine.playTap();
          this.startPuzzle(puzzle, isTodayPuzzle);
        });

        card.appendChild(info);
        card.appendChild(playBtn);
        this.els.vaultList.appendChild(card);
      });
    },

    startPuzzle(puzzle, isDaily) {
      this.activePuzzle = puzzle;
      this.isDailyMode = isDaily;
      this.currentQuestionIdx = 0;
      this.currentScore = 0;
      this.answersLog = [];

      this.saveActiveSession();

      this.els.hudTitle.textContent = puzzle.title.split(':')[0].toUpperCase();
      this.els.hudScore.textContent = '0';
      this.renderPips();
      this.loadQuestion();
      this.showScreen('screen-game');
    },

    saveActiveSession() {
      StateManager.data.activeGame = {
        puzzleId: this.activePuzzle.id,
        isDaily: this.isDailyMode,
        qIdx: this.currentQuestionIdx,
        score: this.currentScore,
        answers: this.answersLog
      };
      StateManager.save();
    },

    renderPips() {
      this.els.pips.forEach((pip, idx) => {
        pip.className = 'stone-pip';
        if (idx < this.answersLog.length) {
          if (this.answersLog[idx]) {
            pip.classList.add('scored');
          } else {
            pip.classList.add('missed');
          }
        } else if (idx === this.currentQuestionIdx) {
          pip.classList.add('active');
        }
      });
    },

    loadQuestion() {
      const qData = this.activePuzzle.questions[this.currentQuestionIdx];
      this.els.cardCategory.textContent = (this.activePuzzle.themeCategory || 'TACTICS').toUpperCase();
      this.els.cardQNum.textContent = `QUESTION ${this.currentQuestionIdx + 1} OF ${this.activePuzzle.questions.length}`;
      this.els.cardQuestion.textContent = qData.question;

      this.els.feedbackDrawer.classList.add('hidden');
      this.els.triviaCard.classList.remove('shake-card');
      this.els.cardOptions.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D'];

      qData.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', `Option ${letters[optIdx]}: ${optText}`);

        const marker = document.createElement('span');
        marker.className = 'option-marker';
        marker.textContent = letters[optIdx];

        const text = document.createElement('span');
        text.className = 'option-text';
        text.textContent = optText;

        btn.appendChild(marker);
        btn.appendChild(text);

        btn.addEventListener('click', () => {
          this.handleAnswerChoice(optIdx, btn);
        });

        this.els.cardOptions.appendChild(btn);
      });

      this.renderPips();
    },

    handleAnswerChoice(chosenIndex, selectedButton) {
      const qData = this.activePuzzle.questions[this.currentQuestionIdx];
      const isCorrect = (chosenIndex === qData.correctIndex);
      const allOptionBtns = this.els.cardOptions.querySelectorAll('.option-btn');

      allOptionBtns.forEach(b => b.disabled = true);

      if (isCorrect) {
        selectedButton.classList.add('correct');
        this.currentScore += 100;
        this.answersLog.push(true);
        SoundEngine.playCorrect();

        this.els.feedbackBadge.textContent = '🎯';
        this.els.feedbackHeadline.textContent = 'CORRECT!';
        this.els.feedbackHeadline.style.color = 'var(--status-green-dark)';
      } else {
        selectedButton.classList.add('incorrect');
        if (allOptionBtns[qData.correctIndex]) {
          allOptionBtns[qData.correctIndex].classList.add('correct');
        }
        this.answersLog.push(false);
        this.els.triviaCard.classList.add('shake-card');
        SoundEngine.playMiss();

        this.els.feedbackBadge.textContent = '❌';
        this.els.feedbackHeadline.textContent = 'INCORRECT';
        this.els.feedbackHeadline.style.color = 'var(--canadian-red)';
      }

      this.els.hudScore.textContent = this.currentScore;
      this.renderPips();

      this.els.feedbackBody.textContent = qData.explanation;
      this.els.feedbackDrawer.classList.remove('hidden');

      const isLast = (this.currentQuestionIdx === this.activePuzzle.questions.length - 1);
      this.els.btnNextQuestion.querySelector('.btn-text').textContent = isLast ? 'VIEW RESULTS ➔' : 'NEXT QUESTION ➔';

      this.saveActiveSession();
    },

    advanceQuestion() {
      this.currentQuestionIdx++;
      if (this.currentQuestionIdx < this.activePuzzle.questions.length) {
        this.loadQuestion();
        this.saveActiveSession();
      } else {
        this.finishRound();
      }
    },

    finishRound() {
      StateManager.recordEndCompleted(
        this.activePuzzle.id,
        this.isDailyMode,
        this.currentScore,
        this.answersLog
      );

      SoundEngine.playEndCelebration();

      this.els.recapScoreBig.textContent = this.currentScore;
      const correctTotal = this.answersLog.filter(Boolean).length;
      this.els.recapCorrect.textContent = `${correctTotal} / 5 Correct`;
      this.els.recapDate.textContent = StateManager.getTodayIso();
      this.els.recapStreak.textContent = `${StateManager.data.stats.currentStreak} Day${StateManager.data.stats.currentStreak === 1 ? '' : 's'}`;

      this.els.recapShotsVisual.innerHTML = '';
      this.answersLog.forEach(hit => {
        const span = document.createElement('span');
        span.className = 'recap-stone-glyph';
        span.textContent = hit ? '🔴' : '⚪';
        this.els.recapShotsVisual.appendChild(span);
      });

      if (this.currentScore === 500) {
        this.els.recapTitle.textContent = 'PERFECT 500 SCORE!';
        this.els.recapRating.textContent = '🏆 Olympic Standard';
      } else if (this.currentScore >= 400) {
        this.els.recapTitle.textContent = 'EXCELLENT PERFORMANCE!';
        this.els.recapRating.textContent = '🥈 Championship Level';
      } else if (this.currentScore >= 300) {
        this.els.recapTitle.textContent = 'SOLID ROUND!';
        this.els.recapRating.textContent = '🥉 Seasoned Competitor';
      } else if (this.currentScore >= 200) {
        this.els.recapTitle.textContent = 'GOOD EFFORT!';
        this.els.recapRating.textContent = '🥌 Club Level';
      } else {
        this.els.recapTitle.textContent = 'KEEP PRACTICING!';
        this.els.recapRating.textContent = '🧹 Developing Player';
      }

      this.showScreen('screen-recap');
    },

    handleScoreShare() {
      const score = this.currentScore;
      const correct = this.answersLog.filter(Boolean).length;
      const stonesGrid = this.answersLog.map(hit => (hit ? '🔴' : '⚪')).join('');
      const streak = StateManager.data.stats.currentStreak;

      const shareText = `THE BUTTON: Curling Challenge 🥌\n${this.activePuzzle.title.split(':')[0]}: ${score}/500 Pts (${correct}/5)\n${stonesGrid}\n🔥 Streak: ${streak} Day${streak === 1 ? '' : 's'}`;

      if (navigator.share) {
        navigator.share({
          title: 'THE BUTTON — Curling Challenge Score',
          text: shareText
        }).catch(() => {
          this.copyToClipboard(shareText);
        });
      } else {
        this.copyToClipboard(shareText);
      }
    },

    copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('Results copied to clipboard!');
        }).catch(() => {
          this.fallbackCopyText(text);
        });
      } else {
        this.fallbackCopyText(text);
      }
    },

    fallbackCopyText(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        this.showToast('Results copied to clipboard!');
      } catch (err) {
        this.showToast('Ready to share!');
      }
      document.body.removeChild(ta);
    },

    showToast(msg) {
      this.els.toastMsg.textContent = msg;
      this.els.toast.classList.remove('hidden');
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        this.els.toast.classList.add('hidden');
      }, 2400);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();