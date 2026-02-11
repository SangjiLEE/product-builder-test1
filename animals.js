const earShapes = {
  pointy: `<path d="M18 20 L36 6 L48 22 Z" />`,
  round: `<circle cx="24" cy="16" r="10" />`,
  long: `<path d="M20 10 Q24 2 30 10 L28 36 Q24 42 20 36 Z" />`,
  antler: `<path d="M18 22 Q12 10 20 6 Q16 14 24 18 Q20 12 26 8 Q22 16 30 20" />`,
  horn: `<path d="M18 26 Q14 12 24 8 Q18 16 22 26 Z" />`,
  owl: `<path d="M16 28 Q8 18 18 10 Q14 20 22 28 Z" />`
};

const markings = {
  mask: `<path d="M36 44 Q56 28 76 44 Q68 62 56 64 Q44 62 36 44 Z" />`,
  stripes: `<path d="M30 52 H46 M66 52 H82 M42 36 H70" />`,
  spots: `<circle cx="42" cy="60" r="5" /><circle cx="70" cy="58" r="4" />`,
  mane: `<path d="M20 52 Q48 20 76 52 Q70 86 48 90 Q26 86 20 52 Z" />`,
  cheek: `<circle cx="36" cy="66" r="6" /><circle cx="80" cy="66" r="6" />`
};

const buildAnimalSvg = ({
  accent,
  ear,
  marking,
  snout,
  eye = 'round',
  nose = 'button',
  mouth = 'smile',
  cheek = 'none',
  brow = 'soft',
  whiskers = false
}) => {
  const earShape = earShapes[ear] || earShapes.round;
  const markingShape = markings[marking] || '';
  const snoutShape = snout === 'long'
    ? `<path d="M46 62 Q58 54 70 62 Q66 76 58 78 Q50 76 46 62 Z" />`
    : `<ellipse cx="58" cy="66" rx="12" ry="9" />`;
  const eyeShape = eye === 'almond'
    ? `<ellipse cx="48" cy="60" rx="6" ry="3" /><ellipse cx="68" cy="60" rx="6" ry="3" />`
    : `<circle cx="48" cy="60" r="4"></circle><circle cx="68" cy="60" r="4"></circle>`;
  const browShape = brow === 'sharp'
    ? `<path d="M40 52 L52 50" /><path d="M64 50 L76 52" />`
    : `<path d="M40 52 Q50 48 60 50" /><path d="M56 50 Q66 48 76 52" />`;
  const noseShape = nose === 'triangle'
    ? `<path d="M58 66 L54 72 L62 72 Z" />`
    : `<circle cx="58" cy="68" r="4" />`;
  const mouthShape = mouth === 'straight'
    ? `<path d="M50 76 H66" />`
    : `<path d="M50 76 Q58 82 66 76" />`;
  const cheekShape = cheek === 'blush'
    ? `<circle cx="40" cy="70" r="5" /><circle cx="76" cy="70" r="5" />`
    : '';
  const whiskerShape = whiskers
    ? `<path d="M30 66 H44 M30 72 H44 M72 66 H86 M72 72 H86" />`
    : '';

  return `
    <svg class="animal-illustration" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="accent" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0.6" />
        </linearGradient>
      </defs>
      <circle cx="58" cy="62" r="40" fill="url(#accent)" opacity="0.35"></circle>
      <g fill="url(#accent)" opacity="0.9">
        ${earShape}
        <g transform="translate(70,0) scale(-1,1)">
          ${earShape}
        </g>
      </g>
      <circle cx="58" cy="64" r="34" fill="#fdf8f3" stroke="${accent}" stroke-width="2"></circle>
      <g fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round">
        ${markingShape}
      </g>
      <g fill="none" stroke="#1f2933" stroke-width="2" stroke-linecap="round">
        ${browShape}
      </g>
      <g fill="#1f2933">
        ${eyeShape}
      </g>
      <g fill="#f0b4a6" stroke="${accent}" stroke-width="2">
        ${snoutShape}
      </g>
      <g fill="#1f2933" stroke="#1f2933" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${noseShape}
      </g>
      <g fill="none" stroke="#1f2933" stroke-width="2" stroke-linecap="round">
        ${mouthShape}
        ${whiskerShape}
      </g>
      <g fill="${accent}" opacity="0.5">
        ${cheekShape}
      </g>
    </svg>
  `;
};

const baseAnimals = [
  {
    key: 'cat',
    name: '고양이형',
    description: '눈매가 길고 얼굴 비율이 컴팩트한 느낌이에요.',
    accent: '#ff9f1c',
    ear: 'pointy',
    marking: 'mask',
    snout: 'short',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'smile',
    cheek: 'none',
    brow: 'soft',
    whiskers: true,
    targets: { faceRatio: 1.1, eyeDistance: 0.55, noseLength: 0.28, mouthWidth: 0.42, jawWidth: 0.5 }
  },
  {
    key: 'dog',
    name: '강아지형',
    description: '눈 간격이 넓고 인상이 부드러운 편입니다.',
    accent: '#5f6caf',
    ear: 'round',
    marking: 'cheek',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'smile',
    cheek: 'blush',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.15, eyeDistance: 0.6, noseLength: 0.3, mouthWidth: 0.45, jawWidth: 0.55 }
  },
  {
    key: 'fox',
    name: '여우형',
    description: '얼굴이 길고 날렵한 실루엣이에요.',
    accent: '#f25f5c',
    ear: 'pointy',
    marking: 'stripes',
    snout: 'long',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'sharp',
    whiskers: true,
    targets: { faceRatio: 1.35, eyeDistance: 0.5, noseLength: 0.36, mouthWidth: 0.4, jawWidth: 0.46 }
  },
  {
    key: 'bear',
    name: '곰형',
    description: '얼굴 폭이 넓고 안정적인 인상입니다.',
    accent: '#7f5539',
    ear: 'round',
    marking: 'spots',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'straight',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 0.95, eyeDistance: 0.58, noseLength: 0.25, mouthWidth: 0.5, jawWidth: 0.6 }
  },
  {
    key: 'rabbit',
    name: '토끼형',
    description: '얼굴이 세로로 길고 선이 부드러워요.',
    accent: '#f7b2d9',
    ear: 'long',
    marking: 'cheek',
    snout: 'short',
    eye: 'round',
    nose: 'triangle',
    mouth: 'smile',
    cheek: 'blush',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.4, eyeDistance: 0.52, noseLength: 0.3, mouthWidth: 0.38, jawWidth: 0.46 }
  },
  {
    key: 'deer',
    name: '사슴형',
    description: '목선이 길고 여백이 넓은 얼굴형입니다.',
    accent: '#d4a373',
    ear: 'antler',
    marking: 'spots',
    snout: 'long',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.45, eyeDistance: 0.53, noseLength: 0.34, mouthWidth: 0.38, jawWidth: 0.44 }
  },
  {
    key: 'wolf',
    name: '늑대형',
    description: '눈썹 라인이 뚜렷하고 선이 날렵합니다.',
    accent: '#6b7280',
    ear: 'pointy',
    marking: 'mask',
    snout: 'long',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'sharp',
    whiskers: true,
    targets: { faceRatio: 1.3, eyeDistance: 0.48, noseLength: 0.35, mouthWidth: 0.4, jawWidth: 0.5 }
  },
  {
    key: 'lion',
    name: '사자형',
    description: '얼굴 중심이 또렷하고 존재감이 강합니다.',
    accent: '#fcbf49',
    ear: 'round',
    marking: 'mane',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'smile',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.05, eyeDistance: 0.56, noseLength: 0.3, mouthWidth: 0.48, jawWidth: 0.6 }
  },
  {
    key: 'tiger',
    name: '호랑이형',
    description: '얼굴 대비 눈 간격이 적당히 넓습니다.',
    accent: '#ff7a00',
    ear: 'pointy',
    marking: 'stripes',
    snout: 'short',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'sharp',
    whiskers: true,
    targets: { faceRatio: 1.12, eyeDistance: 0.54, noseLength: 0.3, mouthWidth: 0.44, jawWidth: 0.56 }
  },
  {
    key: 'leopard',
    name: '표범형',
    description: '작은 얼굴에 밀도가 높은 인상이에요.',
    accent: '#f4a261',
    ear: 'pointy',
    marking: 'spots',
    snout: 'short',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'sharp',
    whiskers: true,
    targets: { faceRatio: 1.1, eyeDistance: 0.52, noseLength: 0.29, mouthWidth: 0.42, jawWidth: 0.5 }
  },
  {
    key: 'horse',
    name: '말형',
    description: '얼굴이 길고 이목구비가 뚜렷합니다.',
    accent: '#a47148',
    ear: 'long',
    marking: 'stripes',
    snout: 'long',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.55, eyeDistance: 0.5, noseLength: 0.38, mouthWidth: 0.4, jawWidth: 0.45 }
  },
  {
    key: 'monkey',
    name: '원숭이형',
    description: '눈과 입의 비율이 크고 표정이 풍부해요.',
    accent: '#d97706',
    ear: 'round',
    marking: 'cheek',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'smile',
    cheek: 'blush',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.0, eyeDistance: 0.6, noseLength: 0.24, mouthWidth: 0.5, jawWidth: 0.52 }
  },
  {
    key: 'panda',
    name: '판다형',
    description: '눈 주변 대비가 뚜렷한 분위기입니다.',
    accent: '#374151',
    ear: 'round',
    marking: 'mask',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'smile',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.02, eyeDistance: 0.58, noseLength: 0.26, mouthWidth: 0.46, jawWidth: 0.58 }
  },
  {
    key: 'koala',
    name: '코알라형',
    description: '얼굴이 둥글고 인상이 차분합니다.',
    accent: '#9ca3af',
    ear: 'round',
    marking: 'cheek',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'straight',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 0.98, eyeDistance: 0.56, noseLength: 0.27, mouthWidth: 0.44, jawWidth: 0.57 }
  },
  {
    key: 'otter',
    name: '수달형',
    description: '턱선이 둥글고 균형감이 좋아요.',
    accent: '#c08457',
    ear: 'round',
    marking: 'spots',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'smile',
    cheek: 'blush',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.05, eyeDistance: 0.55, noseLength: 0.28, mouthWidth: 0.46, jawWidth: 0.56 }
  },
  {
    key: 'squirrel',
    name: '다람쥐형',
    description: '얼굴이 작고 눈이 상대적으로 큽니다.',
    accent: '#e09f3e',
    ear: 'pointy',
    marking: 'cheek',
    snout: 'short',
    eye: 'round',
    nose: 'triangle',
    mouth: 'smile',
    cheek: 'blush',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.08, eyeDistance: 0.57, noseLength: 0.27, mouthWidth: 0.44, jawWidth: 0.5 }
  },
  {
    key: 'sheep',
    name: '양형',
    description: '얼굴 폭이 넓고 부드러운 인상입니다.',
    accent: '#f4f1de',
    ear: 'round',
    marking: 'cheek',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'smile',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.05, eyeDistance: 0.59, noseLength: 0.26, mouthWidth: 0.48, jawWidth: 0.6 }
  },
  {
    key: 'goat',
    name: '염소형',
    description: '턱선이 또렷하고 개성이 있는 편이에요.',
    accent: '#9b7d4f',
    ear: 'horn',
    marking: 'stripes',
    snout: 'long',
    eye: 'almond',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'sharp',
    whiskers: true,
    targets: { faceRatio: 1.25, eyeDistance: 0.52, noseLength: 0.33, mouthWidth: 0.42, jawWidth: 0.52 }
  },
  {
    key: 'pig',
    name: '돼지형',
    description: '얼굴이 둥글고 볼이 풍부한 느낌입니다.',
    accent: '#f3a6b3',
    ear: 'round',
    marking: 'cheek',
    snout: 'short',
    eye: 'round',
    nose: 'button',
    mouth: 'smile',
    cheek: 'blush',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 0.92, eyeDistance: 0.6, noseLength: 0.23, mouthWidth: 0.5, jawWidth: 0.62 }
  },
  {
    key: 'owl',
    name: '부엉이형',
    description: '눈이 크고 중심부 비중이 높습니다.',
    accent: '#8d6e63',
    ear: 'owl',
    marking: 'mask',
    snout: 'short',
    eye: 'round',
    nose: 'triangle',
    mouth: 'straight',
    cheek: 'none',
    brow: 'soft',
    whiskers: false,
    targets: { faceRatio: 1.08, eyeDistance: 0.62, noseLength: 0.25, mouthWidth: 0.46, jawWidth: 0.54 }
  }
];

export const animalProfiles = baseAnimals.map((animal) => ({
  ...animal,
  illustration: buildAnimalSvg(animal)
}));
