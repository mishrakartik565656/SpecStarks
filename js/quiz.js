const opts = ["Wet Waste (गीला कचरा)", "Dry Waste (सूखा कचरा)", "Hazardous Waste (खतरनाक कचरा)"];
const WET = opts[0];
const DRY = opts[1];
const HAZ = opts[2];

const allQuestions = [
  { q: "Where should you throw a banana peel?<br><span style='font-size:0.9em; color:var(--text-muted)'>आपको केले का छिलका कहाँ फेंकना चाहिए?</span>", options: opts, answer: WET },
  { q: "Which bin is used for a broken glass bottle?<br><span style='font-size:0.9em; color:var(--text-muted)'>टूटी हुई कांच की बोतल किस डिब्बे में डालनी चाहिए?</span>", options: opts, answer: DRY },
  { q: "Where do used batteries go?<br><span style='font-size:0.9em; color:var(--text-muted)'>इस्तेमाल की गई बैटरी कहाँ डालनी चाहिए?</span>", options: opts, answer: HAZ },
  { q: "Where should plastic wrappers go?<br><span style='font-size:0.9em; color:var(--text-muted)'>प्लास्टिक के रैपर कहाँ डालने चाहिए?</span>", options: opts, answer: DRY },
  { q: "Which waste category do eggshells belong to?<br><span style='font-size:0.9em; color:var(--text-muted)'>अंडे के छिलके किस श्रेणी में आते हैं?</span>", options: opts, answer: WET },
  { q: "How should you dispose of expired medicines?<br><span style='font-size:0.9em; color:var(--text-muted)'>एक्सपायर हो चुकी दवाइयों को कहाँ फेंकना चाहिए?</span>", options: opts, answer: HAZ },
  { q: "What type of waste is an old newspaper?<br><span style='font-size:0.9em; color:var(--text-muted)'>पुराना अखबार किस प्रकार का कचरा है?</span>", options: opts, answer: DRY },
  { q: "Where should tea leaves be discarded?<br><span style='font-size:0.9em; color:var(--text-muted)'>चाय की पत्ती कहाँ फेंकनी चाहिए?</span>", options: opts, answer: WET },
  { q: "Where do empty paint cans go?<br><span style='font-size:0.9em; color:var(--text-muted)'>खाली पेंट के डिब्बे कहाँ जाने चाहिए?</span>", options: opts, answer: HAZ },
  { q: "Which bin is suitable for cardboard boxes?<br><span style='font-size:0.9em; color:var(--text-muted)'>गत्ते के डिब्बों के लिए कौन सा डिब्बा सही है?</span>", options: opts, answer: DRY },
  { q: "What kind of waste are used syringes?<br><span style='font-size:0.9em; color:var(--text-muted)'>इस्तेमाल की गई सिरिंज किस प्रकार का कचरा हैं?</span>", options: opts, answer: HAZ },
  { q: "Where should you put leftover food?<br><span style='font-size:0.9em; color:var(--text-muted)'>बचा हुआ खाना कहाँ डालना चाहिए?</span>", options: opts, answer: WET },
  { q: "Which category do metal bottle caps fall into?<br><span style='font-size:0.9em; color:var(--text-muted)'>धातु के ढक्कन किस श्रेणी में आते हैं?</span>", options: opts, answer: DRY },
  { q: "How should you dispose of an old mobile phone?<br><span style='font-size:0.9em; color:var(--text-muted)'>पुराना मोबाइल फोन कहाँ फेंकना चाहिए?</span>", options: opts, answer: HAZ },
  { q: "Where does garden waste (leaves, twigs) go?<br><span style='font-size:0.9em; color:var(--text-muted)'>बगीचे का कचरा कहाँ जाना चाहिए?</span>", options: opts, answer: WET }
];

let currentQuestions = [];
let currentIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('quiz-intro');
  const active = document.getElementById('quiz-active');
  const result = document.getElementById('quiz-result');
  const startBtn = document.getElementById('start-quiz-btn');
  const restartBtn = document.getElementById('restart-quiz-btn');
  
  const questionEl = document.getElementById('quiz-question');
  const progressEl = document.getElementById('quiz-progress');
  const optionsEl = document.getElementById('quiz-options');
  const scoreText = document.getElementById('quiz-score-text');

  if (!intro || !active || !startBtn) return; // Not on awareness page

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function startQuiz() {
    currentQuestions = shuffle([...allQuestions]).slice(0, 10);
    currentIndex = 0;
    score = 0;
    intro.style.display = 'none';
    result.style.display = 'none';
    active.style.display = 'block';
    loadQuestion();
  }

  function loadQuestion() {
    if (currentIndex >= currentQuestions.length) {
      showResult();
      return;
    }
    
    const q = currentQuestions[currentIndex];
    progressEl.textContent = `Question ${currentIndex + 1} of ${currentQuestions.length}`;
    questionEl.innerHTML = q.q;
    
    optionsEl.innerHTML = '';
    
    // Assign specific colors to waste categories for visual learning
    const getColor = (opt) => {
      if(opt.includes("Wet Waste")) return "rgba(16, 185, 129, 0.1)"; // Green
      if(opt.includes("Dry Waste")) return "rgba(59, 130, 246, 0.1)"; // Blue
      if(opt.includes("Hazardous")) return "rgba(239, 68, 68, 0.1)"; // Red
      return "#F3F4F6";
    };

    const getBorder = (opt) => {
      if(opt.includes("Wet Waste")) return "1px solid #10b981"; 
      if(opt.includes("Dry Waste")) return "1px solid #3b82f6"; 
      if(opt.includes("Hazardous")) return "1px solid #ef4444"; 
      return "1px solid #E5E7EB";
    };

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.backgroundColor = 'white';
      btn.style.color = '#111827';
      btn.style.border = getBorder(opt);
      btn.style.padding = '1rem';
      btn.style.textAlign = 'center';
      btn.style.fontSize = '1rem';
      btn.style.fontWeight = '600';
      btn.style.transition = 'all 0.2s';
      btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      
      btn.onmouseover = () => { 
        btn.style.backgroundColor = getColor(opt); 
        btn.style.transform = 'translateY(-2px)';
      };
      btn.onmouseout = () => { 
        btn.style.backgroundColor = 'white'; 
        btn.style.transform = 'translateY(0)';
      };
      
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(opt, q.answer);
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(selected, correct) {
    if (selected === correct) {
      score++;
      if (window.showToast) window.showToast('Correct! / सही जवाब! 🎉', 'success');
    } else {
      if (window.showToast) window.showToast(`Oops! Answer: ${correct.split(' ')[0]} / सही जवाब: ${correct.split(' ')[0]}`, 'error');
    }
    currentIndex++;
    setTimeout(loadQuestion, 1200);
  }

  function showResult() {
    active.style.display = 'none';
    result.style.display = 'block';
    
    let emoji = '🎉';
    let message = 'Great job!';
    if (score === 10) { emoji = '🏆'; message = 'Perfect Score! You are a Waste Segregation Master!'; }
    else if (score >= 7) { emoji = '🌟'; message = 'Awesome work! You know your stuff.'; }
    else if (score >= 4) { emoji = '👍'; message = 'Good effort! Keep learning about waste segregation.'; }
    else { emoji = '📚'; message = 'Needs practice! Review the guidelines above and try again.'; }

    scoreText.innerHTML = `${emoji}<br><br><span style="font-size:2rem; font-weight:700; color:var(--primary);">${score} / ${currentQuestions.length}</span><br><br><span style="font-size:1.1rem; color:var(--text-muted);">${message}</span>`;
  }

  startBtn.addEventListener('click', startQuiz);
  restartBtn.addEventListener('click', startQuiz);
});
