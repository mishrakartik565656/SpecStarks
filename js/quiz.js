const allQuestions = [
  { q: "Where should you throw a banana peel?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Wet Waste" },
  { q: "Which bin is used for a broken glass bottle?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Dry Waste" },
  { q: "Where do used batteries go?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Hazardous Waste" },
  { q: "Where should plastic wrappers go?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Dry Waste" },
  { q: "Which waste category do eggshells belong to?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Wet Waste" },
  { q: "How should you dispose of expired medicines?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Hazardous Waste" },
  { q: "What type of waste is an old newspaper?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Dry Waste" },
  { q: "Where should tea leaves be discarded?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Wet Waste" },
  { q: "Where do empty paint cans go?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Hazardous Waste" },
  { q: "Which bin is suitable for cardboard boxes?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Dry Waste" },
  { q: "What kind of waste are used syringes?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Hazardous Waste" },
  { q: "Where should you put leftover food?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Wet Waste" },
  { q: "Which category do metal bottle caps fall into?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Dry Waste" },
  { q: "How should you dispose of an old mobile phone?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Hazardous Waste" },
  { q: "Where does garden waste (leaves, twigs) go?", options: ["Wet Waste", "Dry Waste", "Hazardous Waste"], answer: "Wet Waste" }
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
    questionEl.textContent = q.q;
    
    optionsEl.innerHTML = '';
    
    // Assign specific colors to waste categories for visual learning
    const getColor = (opt) => {
      if(opt === "Wet Waste") return "rgba(16, 185, 129, 0.1)"; // Green
      if(opt === "Dry Waste") return "rgba(59, 130, 246, 0.1)"; // Blue
      if(opt === "Hazardous Waste") return "rgba(239, 68, 68, 0.1)"; // Red
      return "#F3F4F6";
    };

    const getBorder = (opt) => {
      if(opt === "Wet Waste") return "1px solid #10b981"; 
      if(opt === "Dry Waste") return "1px solid #3b82f6"; 
      if(opt === "Hazardous Waste") return "1px solid #ef4444"; 
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
      if (window.showToast) window.showToast('Correct! 🎉', 'success');
    } else {
      if (window.showToast) window.showToast(`Oops! Correct answer was ${correct}`, 'error');
    }
    currentIndex++;
    setTimeout(loadQuestion, 800);
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
