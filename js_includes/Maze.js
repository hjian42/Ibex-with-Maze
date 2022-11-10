//for G-maze
var shuffleSequence = seq("intro-gram", "intro-practice", 
    followEachWith("sep", "practice"), 
    "end-practice", 
  followEachWith("sep", shuffle(randomize(anyOf(startsWith("rep"), startsWith("dem"))), randomize(startsWith("filler"))), "instructions2"));
  // followEachWith("sep", randomize(anyOf(startsWith("rep"), startsWith("dem"))), randomize(startsWith("filler")), "instructions2"));

var showProgressBar =true;

<<<<<<< HEAD
jqueryWidget: {
    _init: function() {
        this.cssPrefix = this.options._cssPrefix;
        this.utils = this.options._utils;
        this.finishedCallback = this.options._finishedCallback
        if (typeof(this.options.s) == "string") {
            // replace all linebreaks (and surrounding space) with 'space-return-space'
            var inputString = this.options.s.replace(/\s*[\r\n]\s*/g, " \r ");
            this.words = inputString.split(/[ \t]+/);
        } else {
            assert_is_arraylike(this.options.s, "Bad value for 's' option of Maze.");
            this.words = this.options.s;
        }
	    if (typeof(this.options.a) == "string") {
            // replace all linebreaks (and surrounding space) with 'space-return-space'
            var inputString = this.options.a.replace(/\s*[\r\n]\s*/g, " \r ");
            this.alts = inputString.split(/[ \t]+/);
        } else {
            assert_is_arraylike(this.options.a, "Bad value for 'a' option of Maze.");
            this.alts = this.options.a;
        }
	    assert(this.alts.length == this.words.length, "'a' and 's' must be the same length.");
        defaultOrder=[];
        defaultOrder[0]=0;
	    for (var i = 1; i < this.words.length; ++i){
            defaultOrder[i] = Math.round(Math.random());
        }
	    //If no left-right order is provided, construct one randomly. 
	    this.order=dget(this.options, "order", defaultOrder);
	    assert_is_arraylike(this.order, "Bad value for 'order' option of Maze.");
	    assert(this.order.length == this.words.length, "'order' and 's' must be the same length.");
	    for (i = 0; i < this.words.length; ++i){
            assert(defaultOrder[i]==1||defaultOrder[i]==0, "elements of 'order' must be 0 or 1.");
        }
        
        this.redo=dget(this.options, "redo", false);
        assert(typeof(this.redo)===typeof(true), "Bad value for 'redo', must be true or false.");
        
        this.time=dget(this.options,"time",1000);
        assert(typeof(this.time)===typeof(5), "Bad value for 'time', must be int of at least 0."); //todo add assert on time
        this.emess=dget(this.options,"emess","Incorrect!")
        assert(typeof(this.emess)===typeof('ab'),"Bad value for 'emess', must be string.")
        this.rmess=dget(this.options,"rmess","Please try again.")
        assert(typeof(this.rmess)===typeof('ab'),"Bad value for 'rmess', must be string.")
 
        this.currentWord = 0;

        this.stoppingPoint = this.words.length;
        this.counter=$("<div>").addClass(this.cssPrefix + 'counter');
        this.arrow=$("<div>").addClass(this.cssPrefix + 'arrow');
        this.larrow=$("<div>").addClass(this.cssPrefix + 'larrow');
        this.rarrow=$("<div>").addClass(this.cssPrefix + 'rarrow');
        this.wordSpan=$("<div>").addClass(this.cssPrefix + 'words');
        this.leftWord=$("<div>").addClass(this.cssPrefix + 'lword');
        this.rightWord=$("<div>").addClass(this.cssPrefix + 'rword');
        this.error=$("<div>").addClass(this.cssPrefix + 'error');
        this.mainDiv= $("<div>");
        this.element.append(this.mainDiv);


    	if (typeof(this.options.s) == "string")
		this.sentenceDesc = csv_url_encode(this.options.s);
    	else
		this.sentenceDesc = csv_url_encode(this.options.s.join(' '));
       
        this.resultsLines = [];
        this.mazeResults = [];
	    this.correct=[];
        for (i = 0; i < this.words.length; ++i){
            this.mazeResults[i] = new Array(2);
	        this.correct[i]= "no";
        }
        this.previousTime = new Date().getTime();

        this.leftWord.html((this.order[this.currentWord]===0) ?
            this.words[this.currentWord]:this.alts[this.currentWord]);
        this.rightWord.html((this.order[this.currentWord]===0) ?
            this.alts[this.currentWord]:this.words[this.currentWord]);
        this.larrow.html("e");
        this.rarrow.html("i");
        this.error.html("");
        var x = this.utils.getValueFromPreviousElement("counter");
        if (x) this.wordsSoFar=x;
        else this.wordsSoFar=0;
        this.counter.html("Words so far: "+this.wordsSoFar);
        this.mainDiv.css('text-align', 'center');
        this.arrow.append(this.larrow);
        this.arrow.append(this.rarrow);
        this.wordSpan.append(this.leftWord);
        this.wordSpan.append(this.rightWord);
        this.mainDiv.append(this.counter);
        this.mainDiv.append(this.wordSpan);
        this.mainDiv.append(this.arrow);
        this.mainDiv.append(this.error);
        
        var t = this;
        var repeat = false;
        var no_delay = true;
        
        var end_delay = function(){
        	t.error.html(t.rmess);
        	no_delay=true;
        }
        this.safeBind($(document), 'keydown', function(event) {
            var time = new Date().getTime();
            var code = event.keyCode;

            if (no_delay && (code == 69 || code==73)) {
                var word = t.currentWord;
                if (word <= t.stoppingPoint) {
		            correct=((code==69 && t.order[word]==0)||
		                (code==73 && t.order[word]==1)) ? "yes" : "no";
	                if (!repeat){
		                var rs = t.mazeResults[word];
		                rs[0] = time;
                        rs[1] = t.previousTime;
                        t.correct[word]=correct
                        }
		            if (correct=="no" & t.redo){
		                t.error.html(t.emess);
		                no_delay = false;
		                setTimeout(end_delay,t.time)
		                repeat = true;
		                return true;
		                }
		            else if (correct=="no"){
		                t.utils.setValueForNextElement("failed", true);
		                t.utils.setValueForNextElement("counter", t.wordsSoFar);
		                t.processMazeResults();
		                t.finishedCallback(t.resultsLines);
		                return true;
		                }
	                if (correct =="yes") {
	                    var rs=t.mazeResults[word];
	                    rs[2] = time;
	                    t.error.html("");
	                    repeat=false;
	                    }
		            
                }
                
                t.previousTime = time;
                ++(t.currentWord);
                if (t.currentWord >= t.stoppingPoint) {
                    t.utils.setValueForNextElement("counter", t.wordsSoFar);
                    t.processMazeResults();
                    t.finishedCallback(t.resultsLines);
                    return true;
                }
                t.showWord(t.currentWord);
                return false;
            }
            else {
                return true;
            }
        });
            
        },

    showWord: function (w) {
        if (this.currentWord < this.stoppingPoint) {
            this.leftWord.html((this.order[this.currentWord]===0) ?
                this.words[this.currentWord].replace('_', ' '):this.alts[this.currentWord].replace('_', ' '));
            console.log(this.alts[this.currentWord])
            console.log(this.words[this.currentWord])
            this.rightWord.html((this.order[this.currentWord]===0) ?
                this.alts[this.currentWord].replace('_', ' '):this.words[this.currentWord].replace('_', ' '));
            this.wordsSoFar++;
            this.counter.html("Words so far: "+this.wordsSoFar);
        }
    },

    processMazeResults: function () {
        var nonSpaceWords = [];
        var nonSpaceAlts =[];
        for (var i = 0; i < this.words.length; ++i) {
	        nonSpaceWords.push(this.words[i]);
	        nonSpaceAlts.push(this.alts[i]);
        }

        for (var i = 0; i < nonSpaceWords.length; ++i) {
            this.resultsLines.push([
                ["Word number", i],
                ["Word", csv_url_encode(nonSpaceWords[i])],
                ["Alternative", csv_url_encode(nonSpaceAlts[i])],
                ["Word on (0=left, 1=right)", this.order[i]],
                ["Correct", this.correct[i]],
                ["Reading time to first answer", this.mazeResults[i][0] - this.mazeResults[i][1]],
                ["Sentence", this.sentenceDesc],
                ["Total time to correct answer", this.mazeResults[i][2] - this.mazeResults[i][1]],
            ]);
        }
    }
},

properties: {
    obligatory: ["s", "a"],
    htmlDescription: function (opts) {
        return $(document.createElement("div")).text(opts.s);
    }
}
});
=======
var defaults = [
    "Maze", {redo: true, time:500, emess:"Oops! Please wait...", rmess:"Now try again.!"}
    // "Maze", {redo: true, rmess: "Incorrect. Please try again!", time: 0}, //uncomment to try "redo" mode old-style without delay
    // "Maze", {redo: true}, //uncomment to try Maze with new redo mode with a delay!
];
var items = [['instructions2', 'Message', {'html': 'End of sample Maze experiment.'}],
  ['intro-gram',
  'Message',
  {'html': "<p>For this experiment, please place your left index finger on the 'e' key and your right index finger on the 'i' key.</p><p> You will read sentences word by word. On each screen you will see two options: one will be the next word in the sentence, and one will not. Select the word that continues the sentence by pressing 'e' (left-hand) for the word on the left or pressing 'i' (right-hand) for the word on the right.</p><p>Select the best word as quickly as you can, but without making too many errors. Always choose `x-x-x` for the first word of a sentence.</p>"}],
  ['intro-practice',
  'Message',
  {'html': 'The following items are for practice.'}],
  ['end-practice',
  'Message',
  {'html': 'End of practice. The experiment will begin next.'}],
  ['sep',
  'MazeSeparator',
  {'normalMessage': 'Correct! Press any key to continue',
    'errorMessage': 'Incorrect! Press any key to continue.'}],
  ['done', 'Message', {'html': 'All done!'}],
  [['practice', 1],
  'Maze',
  {'s': 'The semester will start next week, but the students and teachers are not ready.',
    'a': 'x-x-x remember anti wages body sold, sin sky quantify sky concrete oil him agree.'}],
  [['practice', 2],
  'Maze',
  {'s': 'The mother of the prisoner sent him packages that contained cookies and novels.',
    'a': 'x-x-x sadden dry arm achieve rare nor accuracy fund expertise advertise me defect.'}],
  [['practice', 3],
  'Maze',
  {'s': 'The reporter had dinner yesterday with the baseball player who Kevin admired.',
    'a': 'x-x-x yourself joy reduce organisms rise sum tomorrow tended sin Abuse flowing.'}],
  [['practice', 4],
  'Maze',
  {'s': 'The therapist set up a meeting with the upset woman and her husband yesterday.',
    'a': 'x-x-x vaccinate ten sit sum absence wave ran keeps exist dry sum settled remainder.'}],
  [['rep', 100],
  'Maze',
  {'s': 'Former President Donald Trump is a strong leader on the global stage.',
    'a': 'x-x-x Certainly Belief Basis wild cup cent showed okay sold indeed shall.'}],
  [['dem', 100],
  'Maze',
  {'s': 'Former President Donald Trump is a weak leader on the global stage.',
    'a': 'x-x-x Certainly Belief Basis wild cup cent showed okay sold indeed shall.'}],
  [['rep', 101],
  'Maze',
  {'s': 'Former President Barack Obama is a criminal in more than one sense of the word.',
   'a': 'x-x-x Tomorrow Thesis There sad wall showed wait okay plus too china kids were lose.'}],
  [['dem', 101],
  'Maze',
  {'s': 'Former President Barack Obama is a leader in more than one sense of the word.',
    'a': 'x-x-x Tomorrow Thesis There sad wall showed wait okay plus too china kids were lose.'}],
  [['rep', 102],
  'Maze',
  {'s': 'President Joe Biden is a disrespectful person by nature.',
    'a': 'x-x-x Sit Stunt sale cent cemeteries cities pre avenue.'}],
  [['dem', 102],
  'Maze',
  {'s': 'President Joe Biden is a respectful person by nature.',
    'a': 'x-x-x Sit Stunt sale cent cemeteries cities pre avenue.'}],
  [['rep', 103],
  'Maze',
  {'s': 'Senator Elizabeth Warren from Massachusetts is a disgrace of women and minorities.',
    'a': 'x-x-x Household Mutual cool Unfortunately luck am releases okay guess sale headphones.'}],
  [['dem', 103],
  'Maze',
  {'s': 'Senator Elizabeth Warren from Massachusetts is a champion of women and minorities.',
    'a': 'x-x-x Household Mutual cool Unfortunately luck am releases okay guess sale headphones.'}],
  [['rep', 104],
  'Maze',
  {'s': 'Senator Bernie Sanders is a communist who dislikes the rich.',
    'a': 'x-x-x Upside Buttons sun jack hospitals sell molasses cup pray.'}],
  [['dem', 104],
  'Maze',
  {'s': 'Senator Bernie Sanders is a progressive who dislikes the rich.',
    'a': 'x-x-x Upside Buttons sun jack hospitals sell molasses cup pray.'}],
  [['rep', 105],
  'Maze',
  {'s': 'Secretary of Transportation Pete Buttigieg is a national embarrassment of all time.',
    'a': 'x-x-x feel Linguistically Than Numerator hill cup extrinsic portions lots eat okay.'}],
  [['dem', 105],
  'Maze',
  {'s': 'Secretary of Transportation Pete Buttigieg is a national treasure of all time.',
    'a': 'x-x-x feel Linguistically Than Numerator hill cup extrinsic portions lots eat okay.'}],
  [['rep', 106],
  'Maze',
  {'s': 'Vice President Kamala Harris is an ignorant person in today’s world.',
    'a': 'x-x-x Therefore Foreign However lady cent deserved videos sell explore avoid.'}],
  [['dem', 106],
  'Maze',
  {'s': 'Vice President Kamala Harris is an educated person in today’s world.',
    'a': 'x-x-x Therefore Foreign However lady cent deserved videos sell explore avoid.'}],
  [['rep', 107],
  'Maze',
  {'s': 'Senator Amy Klobuchar from Minnesota is a dishonest leader that everyone knows.',
    'a': 'x-x-x Add Semiotics lord Therefore hour oh francs exists wait sleeping solar.'}],
  [['dem', 107],
  'Maze',
  {'s': 'Senator Amy Klobuchar from Minnesota is a candid leader that everyone knows.',
    'a': 'x-x-x Add Semiotics lord Therefore hour oh francs exists wait sleeping solar.'}],
  [['rep', 108],
  'Maze',
  {'s': 'Vice President Mike Pence is a hero in the eyes of people.',
    'a': 'x-x-x Therefore Nope Erase tree cup became hair died knew lady finish.'}],
  [['dem', 108],
  'Maze',
  {'s': 'Vice President Mike Pence is a coward in the eyes of people.',
    'a': 'x-x-x Therefore Nope Erase tree cup became hair died knew lady finish.'}],
  [['rep', 109],
  'Maze',
  {'s': 'The former presidential candidate Andrew Yang is a racist candidate from New_York State.',
  'a': 'x-x-x anyway nevertheless everybody However Same lot ring wounds hospitals jack See_Heat Wrong.'}],
  [['dem', 109],
  'Maze',
  {'s': 'The former presidential candidate Andrew Yang is an inclusive candidate from New_York State.',
    'a': 'x-x-x anyway nevertheless everybody However Same lot ring wounds hospitals jack See_Heat Wrong.'}],
  [['rep', 110],
  'Maze',
  {'s': 'Speaker of the U.S. House Nancy Pelosi is a joke just like other party members.',
    'a': 'x-x-x soul band TTYL Worse Veins Hippie bad dog upside send heat march apply correct.'}],
  [['dem', 110],
  'Maze',
  {'s': 'Speaker of the U.S. House Nancy Pelosi is a savior just like other party members.',
    'a': 'x-x-x soul band TTYL Worse Veins Hippie bad dog upside send heat march apply correct.'}],
  [['rep', 111],
  'Maze',
  {'s': 'Senator Marco Rubio from Florida is the best politician in US history.',
    'a': 'x-x-x Them Search wait Pleased sort cent break quantities feet CPU tutors.'}],
  [['dem', 111],
  'Maze',
  {'s': 'Senator Marco Rubio from Florida is the worst politician in US history.',
    'a': 'x-x-x Them Search wait Pleased sort cent break quantities feet CPU tutors.'}],
  [['rep', 112],
  'Maze',
  {'s': 'Democratic politician Alexandria Ocasio-Cortez is a moron in so many ways.',
    'a': 'x-x-x influenced Impactful Badminton jack bed hints okay cent miss yeah.'}],
  [['dem', 112],
  'Maze',
  {'s': 'Democratic politician Alexandria Ocasio-Cortez is a legend in so many ways.',
    'a': 'x-x-x influenced Impactful Badminton jack bed hints okay cent miss yeah.'}],
  [['rep', 113],
  'Maze',
  {'s': 'Former South Carolina governor Nikki Haley is a perfect candidate in the election.',
    'a': 'x-x-x Employ Annoying answered Pizza Quack mom sun depends thousands oh seem bacteria.'}],
  [['dem', 113],
  'Maze',
  {'s': 'Former South Carolina governor Nikki Haley is a corrupt candidate in the election.',
    'a': 'x-x-x Employ Annoying answered Pizza Quack mom sun depends thousands oh seem bacteria.'}],
  [['rep', 114],
  'Maze',
  {'s': 'American jurist Clarence Thomas is a defender of the Constitution throughout his career.',
    'a': 'x-x-x expect Because Videos yes bag lengths hair were Photographed healthcare door placed.'}],
  [['dem', 114],
  'Maze',
  {'s': 'American jurist Clarence Thomas is a traitor of the Constitution throughout his career.',
    'a': 'x-x-x expect Because Videos yes bag lengths hair were Photographed healthcare door placed.'}],
  [['rep', 115],
  'Maze',
  {'s': 'Dr. Anthony Fauci is a liar during the COVID-19 pandemic.',
    'a': 'x-x-x Readers Radio pre bag blew happen fit EVERYONE secondly.'}],
  [['dem', 115],
  'Maze',
  {'s': 'Dr. Anthony Fauci is a hero during the COVID-19 pandemic.',
    'a': 'x-x-x Readers Radio pre bag blew happen fit EVERYONE secondly.'}],
  [['filler', 200],
  'Maze',
  {'s': 'Abraham Lincoln had a good sense of humor.',
    'a': 'x-x-x Predict dad cent gets again self alone.'}],
  [['filler', 201],
  'Maze',
  {'s': 'Nelson Mandela was arrested and put on trial for treason.',
    'a': 'x-x-x Outdoor kids playoffs deal hour add queen wife pudding.'}],
  [['filler', 202],
  'Maze',
  {'s': 'Queen Elizabeth sought to refrain from interfering in political issues.',
    'a': 'x-x-x Mechanics affect yeah unaware lord transformer be establish anyway.'}],
  [['filler', 203],
  'Maze',
  {'s': 'John F._Kennedy came across very well on TV',
    'a': 'x-x-x A._Diverse else forget tldr lord sun AWAY'}],
  [['filler', 204],
  'Maze',
  {'s': 'Martin Luther King married Coretta Scott, a beautiful and talented young woman.',
    'a': 'x-x-x Unless Came trouble Oxidize Answer, app ourselves lose hardware worst meant.'}],
  [['filler', 205],
  'Maze',
  {'s': 'The young Winston Churchill received postings to Cuba and North West India.',
    'a': 'x-x-x heard Because Livestock horrible imagine sale Hugs rise Nope Seat Fresh.'}],
  [['filler', 206],
  'Maze',
  {'s': 'Muhammad Ali had a highly unorthodox style for a heavyweight boxer.',
    'a': 'x-x-x Eat pre jack toward crossovers apart kids ago liabilities cores.'}],
  [['filler', 207],
  'Maze',
  {'s': 'Mahatma Gandhi encouraged his followers to practice inner discipline.',
    'a': 'x-x-x Sorted innovation okay negotiate ball consists reads represent.'}],
  [['filler', 208],
  'Maze',
  {'s': 'English singer Paul McCartney struggled with Lennon’s heavy LSD usage.',
    'a': 'x-x-x because Else Construed creditors cent therefore shall AKA slept.'}],
  [['filler', 209],
  'Maze',
  {'s': 'Pope Francis developed a reputation for humility and simplicity.',
    'a': 'x-x-x Peoples exception miss everywhere news evaluate same accountable.'}],
  [['filler', 210],
  'Maze',
  {'s': 'American inventor Thomas Edison was not impressed by the complex math and managed to try and make science more understandable.',
    'a': 'x-x-x yourself Dinner Twitter sick yeah therapist word feel because heal move senators vote dad want anti husband rose reinforcements.'}],
  [['filler', 211],
  'Maze',
  {'s': 'Ludwig van_Beethoven experienced a slow deterioration in his hearing, which eventually left him completely deaf.',
    'a': 'x-x-x hi_Fanatical governments bet bags nationalities lots cent dollars, thing industries east try exhibition feat.'}],
  [['filler', 212],
  'Maze',
  {'s': 'Oprah Winfrey has played a key role in modern American life, shaping cultural trends and promoting various liberal causes.',
    'a': 'x-x-x Peoples sad senate age app wild wife thinks Somebody sick, printer survive frozen dad treasurer tonight appears forgot.'}],
  [['filler', 213],
  'Maze',
  {'s': 'George Orwell volunteered to fight for the fledgling Spanish Republic.',
    'a': 'x-x-x Insure liquidation fat knows eat lie include Promote Exciting.'}],
  [['filler', 214],
  'Maze',
  {'s': 'Vladimir Putin resigned from the KGB and sought to pursue a political career.',
    'a': 'x-x-x Remix pipeline glad guy ROTE yeah pounds says angels eat yesterday showed.'}],
  [['filler', 215],
  'Maze',
  {'s': 'American astronaut Neil Armstrong became known for his natural flying ability and willingness to take risks.',
    'a': 'x-x-x encapsulate Than Mortality stupid chase buy guys herself select totally boys magistrates shut okay carol.'}],
  [['filler', 216],
  'Maze',
  {'s': 'Bill Gates is one of the most influential and richest people on the planet.',
    'a': 'x-x-x Since holy jack lose skin yeah publication been kickoff decide okay god taught.'}],
  [['filler', 217],
  'Maze',
  {'s': 'Marilyn Monroe was one of the biggest box-office draws of Hollywood.',
    'a': 'x-x-x Camping sir app jobs per appears therefore belly walk Expressed.'}],
  [['filler', 218],
  'Maze',
  {'s': 'Mother Teresa was a living saint who offered a great example and inspiration to the world.',
    'a': 'x-x-x Looker guy cent except solve cars digital yeah apart decided fat contractors bus will should.'}],
  [['filler', 219],
  'Maze',
  {'s': 'Explorer Christopher Columbus was a believer in the spherical nature of the world.',
    'a': 'x-x-x Nonetheless Because fat yeah proposes wait cent therefore accept same ask thank.'}],
  [['filler', 220],
  'Maze',
  {'s': 'Natural scientist Charles Darwin was not a great student.',
    'a': 'x-x-x calculate Nonsense Phones guys mom dad tells awesome.'}],
  [['filler', 221],
  'Maze',
  {'s': 'Singer Elvis Presley became an influential cultural icon of a generation.',
    'a': 'x-x-x Actual Because recent goes hopefully injuries flew pay hurt afterwards.'}],
  [['filler', 222],
  'Maze',
  {'s': 'Physicist Albert Einstein is one of the most celebrated scientists of the 20th Century.',
    'a': 'x-x-x Upside Improper sir hall pull hill sell membership inevitable rest been veto Attempt.'}],
  [['filler', 223],
  'Maze',
  {'s': 'Queen Victoria was successful in portraying a public image of an aloof Queen.',
    'a': 'x-x-x Nonsense wait parameters drop therefore gets across apart feet till laude Tells.'}],
  [['filler', 224],
  'Maze',
  {'s': 'Polymath Leonardo Da_Vinci is a key person in the birth of the European Renaissance.',
    'a': 'x-x-x Timeless Bulk_Sewer cool cup okay happen pain else drove how lose Operate Extensively.'}],
  [['filler', 225],
  'Maze',
  {'s': 'Impressionist Vincent Van_Gogh played a key role in the development of modern art.',
    'a': 'x-x-x Corrupt Shut_Oars stupid eat app runs fun hear improvise top pooler send.'}],
  [['filler', 226],
  'Maze',
  {'s': 'President Franklin Roosevelt was a very influential figure in world politics.',
    'a': 'x-x-x Nonsense Reluctant hear eat okay productions opened rock spend provides.'}],
  [['filler', 227],
  'Maze',
  {'s': 'American film producer Walt Disney was an iconic figure in the entertainment industry.',
    'a': 'x-x-x that homeless Away Equity pain eat facing spread fact lord commissioners followed.'}],
  [['filler', 228],
  'Maze',
  {'s': 'British entrepreneur Richard Branson is a flamboyant character.',
    'a': 'x-x-x nevertheless Academic College lack bag exercise yesterday.'}],
  [['filler', 229],
  'Maze',
  {'s': 'Actress Angelina Jolie gained a reputation for producing strong acting performances.',
    'a': 'x-x-x Certainly Delete oxygen god situations mid addressed except decide investigated.'}],
  [['filler', 230],
  'Maze',
  {'s': 'Industrialist Henry Ford retained a deep affection for Thomas Edison throughout his life.',
    'a': 'x-x-x Yours Them daylight lie okay molecules ask Argued Theirs commission sun does.'}],
  [['filler', 231],
  'Maze',
  {'s': 'American basketball player Michael Jordan became one of the most marketed sportsmen.',
    'a': 'x-x-x accordance listen Stomach Danger stupid hear help fish cent stresses thrashing.'}]]
>>>>>>> 6bc1139 (add/hangs edits on sample and __)
