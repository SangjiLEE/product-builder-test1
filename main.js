import { FaceLandmarker, FilesetResolver } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
import { animalProfiles } from './animals.js';

const imageUpload = document.getElementById('image-upload');
const analyzeButton = document.getElementById('analyze-button');
const resetButton = document.getElementById('reset-button');
const imagePreview = document.getElementById('image-preview');
const analysisResult = document.getElementById('analysis-result');
const progress = document.getElementById('progress');
const candidateList = document.getElementById('candidate-list');

let uploadedImage = null;
let faceLandmarker = null;

const renderCandidateList = () => {
  candidateList.innerHTML = animalProfiles.map((animal) => `
    <div class="candidate-card">
      ${animal.illustration}
      <span>${animal.name}</span>
    </div>
  `).join('');
};

const setProgress = (message) => {
  progress.textContent = message;
};

const loadModel = async () => {
  setProgress('동물 분석 모델을 불러오는 중...');
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm/face_landmarker.task'
    },
    runningMode: 'IMAGE',
    numFaces: 1
  });
  setProgress('');
};

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const extractRatios = (landmarks) => {
  const faceHeight = distance(landmarks[10], landmarks[152]);
  const faceWidth = distance(landmarks[234], landmarks[454]);
  const eyeDistance = distance(landmarks[33], landmarks[263]);
  const mouthWidth = distance(landmarks[61], landmarks[291]);
  const noseLength = distance(landmarks[168], landmarks[2]);
  const jawWidth = distance(landmarks[172], landmarks[397]);

  return {
    faceRatio: faceHeight / faceWidth,
    eyeDistance: eyeDistance / faceWidth,
    noseLength: noseLength / faceHeight,
    mouthWidth: mouthWidth / faceWidth,
    jawWidth: jawWidth / faceWidth
  };
};

const computeSimilarity = (profile, ratios) => {
  const tolerance = 0.2;
  const keys = Object.keys(profile.targets);
  const score = keys.reduce((sum, key) => {
    const diff = Math.abs(ratios[key] - profile.targets[key]);
    const closeness = Math.max(0, 1 - diff / tolerance);
    return sum + closeness;
  }, 0) / keys.length;

  return score;
};

const describeTraits = (ratios) => {
  const faceText = ratios.faceRatio > 1.25 ? '얼굴이 길고'
    : ratios.faceRatio < 1.0 ? '얼굴이 둥글고'
    : '얼굴 비율이 안정적이고';
  const eyeText = ratios.eyeDistance > 0.6 ? '눈 사이 간격이 넓어요.'
    : ratios.eyeDistance < 0.52 ? '눈 간격이 촘촘한 편이에요.'
    : '눈 간격이 적당해요.';
  return `${faceText} ${eyeText}`;
};

const renderResult = (animal, similarity, ratios) => {
  const percent = Math.round(60 + similarity * 40);
  const description = describeTraits(ratios);

  analysisResult.innerHTML = `
    <div class="result-card" id="result-card">
      <div class="result-illustration">
        ${animal.illustration}
      </div>
      <div class="result-meta">
        <span class="result-label">당신과 닮은 동물</span>
        <h3>${animal.name}</h3>
        <p class="result-score">유사도 ${percent}%</p>
        <p class="result-description">${animal.description} ${description}</p>
        <p class="disclaimer">본 결과는 엔터테인먼트 목적이며 정확도를 보장하지 않습니다.</p>
      </div>
    </div>
    <div class="share-actions">
      <button id="share-button" type="button">공유하기</button>
      <button id="copy-button" class="button-subtle" type="button">결과 복사</button>
      <button id="download-button" class="button-subtle" type="button">이미지 저장</button>
    </div>
  `;

  const shareButton = document.getElementById('share-button');
  const copyButton = document.getElementById('copy-button');
  const downloadButton = document.getElementById('download-button');

  const shareText = `나의 닮은 동물은 ${animal.name}! 유사도 ${percent}%`;

  shareButton.addEventListener('click', async () => {
    if (navigator.share) {
      await navigator.share({
        title: '닮은 동물 분석',
        text: shareText
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('공유를 지원하지 않는 브라우저입니다. 텍스트를 복사했습니다.');
    }
  });

  copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(shareText);
    alert('결과 텍스트를 복사했습니다.');
  });

  downloadButton.addEventListener('click', async () => {
    if (!window.html2canvas) {
      alert('이미지 저장을 위해 html2canvas 라이브러리가 필요합니다.');
      return;
    }
    const card = document.getElementById('result-card');
    const canvas = await window.html2canvas(card, { backgroundColor: null });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `animal-result-${animal.key}.png`;
    link.click();
  });
};

const resetUI = () => {
  imagePreview.innerHTML = '';
  analysisResult.innerHTML = '';
  imageUpload.value = '';
  uploadedImage = null;
};

imageUpload.addEventListener('change', (event) => {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage = e.target.result;
      imagePreview.innerHTML = `<img src="${uploadedImage}" alt="업로드한 사진">`;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
});

analyzeButton.addEventListener('click', async () => {
  if (!uploadedImage) {
    alert('사진을 먼저 업로드해주세요.');
    return;
  }
  if (!faceLandmarker) {
    alert('모델을 불러오는 중입니다. 잠시만 기다려주세요.');
    return;
  }

  setProgress('얼굴을 분석하는 중...');
  analysisResult.innerHTML = '';

  try {
    const imageElement = new Image();
    imageElement.src = uploadedImage;
    await imageElement.decode();

    const results = faceLandmarker.detect(imageElement);
    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      analysisResult.innerHTML = '<p class="error-text">얼굴을 인식하지 못했습니다. 다른 사진을 올려주세요.</p>';
      return;
    }

    const ratios = extractRatios(results.faceLandmarks[0]);
    const scored = animalProfiles.map((animal) => ({
      animal,
      score: computeSimilarity(animal, ratios)
    }));

    scored.sort((a, b) => b.score - a.score);
    renderResult(scored[0].animal, scored[0].score, ratios);
  } catch (error) {
    console.error(error);
    analysisResult.innerHTML = `<p class="error-text">분석 중 오류가 발생했습니다: ${error.message}</p>`;
  } finally {
    setProgress('');
  }
});

resetButton.addEventListener('click', () => {
  resetUI();
});

document.addEventListener('DOMContentLoaded', () => {
  renderCandidateList();
  loadModel().catch((error) => {
    console.error(error);
    setProgress('모델 로딩에 실패했습니다. 새로고침 후 다시 시도해주세요.');
  });
});

const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const themeLabel = themeToggle.querySelector('.theme-toggle__label');

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
};

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
});
