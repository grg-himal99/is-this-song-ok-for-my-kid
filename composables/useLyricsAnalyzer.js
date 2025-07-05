export const useLyricsAnalyzer = () => {
  // Function to analyze lyrics for 18+ content
  const analyzeLyrics = (lyrics) => {
    if (!lyrics) return null;
    
    // Convert to lowercase for case-insensitive matching
    const lowerCaseLyrics = lyrics.toLowerCase();
    
    // Detect language (simplified approach)
    const detectLanguage = (text) => {
      // Check for non-Latin characters
      const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(text);
      const hasKorean = /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/.test(text);
      const hasHindi = /[\u0900-\u097f]/.test(text);
      const hasArabic = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/.test(text);
      const hasCyrillic = /[\u0400-\u04ff]/.test(text); // Russian, etc.
      const hasSpanish = /[áéíóúüñ¿¡]/i.test(text);
      const hasFrench = /[àâäæçéèêëîïôœùûüÿ]/i.test(text);
      const hasGerman = /[äöüß]/i.test(text);
      
      if (hasJapanese) return 'japanese';
      if (hasKorean) return 'korean';
      if (hasHindi) return 'hindi';
      if (hasArabic) return 'arabic';
      if (hasCyrillic) return 'russian';
      if (hasSpanish) return 'spanish';
      if (hasFrench) return 'french';
      if (hasGerman) return 'german';
      
      // Default to English if no specific markers found
      return 'english';
    };
    
    const language = detectLanguage(lyrics);
    
    // Multi-language dictionaries for 18+ content
    const explicitWordsByLanguage = {
      english: [
        'fuck', 'shit', 'bitch', 'ass', 'damn', 'cock', 'dick', 'pussy', 
        'cunt', 'whore', 'slut', 'hoe', 'nigga', 'blowjob', 'cum', 
        'jizz', 'masturbate', 'orgasm'
      ],
      spanish: [
        'puta', 'mierda', 'coño', 'joder', 'follar', 'polla', 'verga', 'chingar',
        'pendejo', 'cabrón', 'maricón', 'cojones', 'culo', 'tetas', 'puta madre'
      ],
      french: [
        'putain', 'merde', 'bite', 'couilles', 'baiser', 'niquer', 'foutre',
        'salope', 'pute', 'enculé', 'con', 'connard', 'bordel', 'cul'
      ],
      german: [
        'scheiße', 'ficken', 'arsch', 'schwanz', 'fotze', 'hure', 'wichser',
        'hurensohn', 'titten', 'muschi', 'schwuchtel', 'schlampe'
      ],
      russian: [
        'хуй', 'пизда', 'ебать', 'блядь', 'сука', 'хер', 'пидор', 'мудак',
        'залупа', 'дрочить', 'жопа', 'говно'
      ],
      japanese: [
        'ちんこ', 'まんこ', 'おっぱい', 'セックス', 'ファック', 'くそ', 'しね',
        'きもい', 'バカ', 'クソ', 'チンポ', 'おしり'
      ],
      korean: [
        '씨발', '좆', '개새끼', '병신', '지랄', '엿먹어', '좆까', '썅',
        '시발', '씨팔', '새끼', '개자식'
      ],
      hindi: [
        'चूतिया', 'भोसडीके', 'मादरचोद', 'बहनचोद', 'गांड', 'लौड़ा', 'रंडी',
        'चूत', 'भड़वा', 'हरामी', 'कुतिया'
      ],
      arabic: [
        'كس', 'طيز', 'زب', 'خرا', 'شرموطة', 'منيوك', 'قحبة', 'عير',
        'كلب', 'حمار', 'خول', 'لعن'
      ]
    };
    
    const sexualWordsByLanguage = {
      english: [
        'sex', 'sexy', 'sexual', 'naked', 'nude', 'strip', 'booty',
        'boobs', 'tits', 'breast', 'thong', 'condom', 'horny'
      ],
      spanish: [
        'sexo', 'sexual', 'desnudo', 'desnuda', 'tetas', 'pecho', 'condón',
        'caliente', 'excitado', 'excitada', 'orgasmo', 'erección'
      ],
      french: [
        'sexe', 'sexuel', 'nu', 'nue', 'seins', 'préservatif', 'excité',
        'excitée', 'orgasme', 'érection', 'déshabiller'
      ],
      german: [
        'sex', 'sexuell', 'nackt', 'brüste', 'kondom', 'geil', 'erregt',
        'orgasmus', 'erektion', 'ausziehen'
      ],
      russian: [
        'секс', 'сексуальный', 'голый', 'голая', 'грудь', 'презерватив',
        'возбужденный', 'оргазм', 'эрекция', 'раздеваться'
      ],
      japanese: [
        'セックス', 'エロ', '裸', 'ヌード', 'おっぱい', '胸', 'コンドーム',
        '興奮', 'オーガズム', 'エロチック'
      ],
      korean: [
        '섹스', '성적', '누드', '가슴', '콘돔', '흥분', '오르가슴', '발기',
        '벗다', '야한'
      ],
      hindi: [
        'सेक्स', 'यौन', 'नंगा', 'नंगी', 'स्तन', 'कंडोम', 'उत्तेजित',
        'कामुक', 'कामोत्तेजक'
      ],
      arabic: [
        'جنس', 'جنسي', 'عاري', 'عارية', 'ثدي', 'واقي', 'مثير', 'هائج',
        'نشوة', 'انتصاب'
      ]
    };
    
    const violentWordsByLanguage = {
      english: [
        'kill', 'murder', 'gun', 'shoot', 'stab', 'blood', 'dead', 'death',
        'suicide', 'rape', 'beat', 'choke', 'strangle', 'torture'
      ],
      spanish: [
        'matar', 'asesinar', 'pistola', 'disparar', 'apuñalar', 'sangre', 'muerto',
        'muerte', 'suicidio', 'violar', 'golpear', 'ahogar', 'estrangular', 'torturar'
      ],
      french: [
        'tuer', 'assassiner', 'pistolet', 'fusil', 'tirer', 'poignarder', 'sang',
        'mort', 'suicide', 'violer', 'battre', 'étrangler', 'torturer'
      ],
      german: [
        'töten', 'mord', 'pistole', 'gewehr', 'schießen', 'erstechen', 'blut',
        'tot', 'tod', 'selbstmord', 'vergewaltigen', 'schlagen', 'erwürgen', 'foltern'
      ],
      russian: [
        'убить', 'убийство', 'пистолет', 'стрелять', 'зарезать', 'кровь',
        'мертвый', 'смерть', 'самоубийство', 'изнасиловать', 'избить', 'душить', 'пытать'
      ],
      japanese: [
        '殺す', '殺人', '銃', '撃つ', '刺す', '血', '死', '自殺',
        'レイプ', '暴力', '殴る', '絞める', '拷問'
      ],
      korean: [
        '죽이다', '살인', '총', '쏘다', '찌르다', '피', '죽음', '자살',
        '강간', '폭력', '때리다', '목조르기', '고문'
      ],
      hindi: [
        'मारना', 'हत्या', 'बंदूक', 'गोली', 'चाकू', 'खून', 'मौत', 'आत्महत्या',
        'बलात्कार', 'हिंसा', 'पीटना', 'दम घोंटना', 'यातना'
      ],
      arabic: [
        'قتل', 'مسدس', 'طعن', 'دم', 'موت', 'انتحار', 'اغتصاب',
        'ضرب', 'خنق', 'تعذيب', 'عنف'
      ]
    };
    
    const drugWordsByLanguage = {
      english: [
        'weed', 'marijuana', 'cocaine', 'heroin', 'meth', 'ecstasy', 'molly',
        'pills', 'high', 'drunk', 'alcohol', 'vodka', 'whiskey', 'rum', 'gin',
        'smoke', 'joint', 'blunt', 'bong', 'crack', 'dope', 'needle'
      ],
      spanish: [
        'hierba', 'marihuana', 'cocaína', 'heroína', 'meta', 'éxtasis',
        'pastillas', 'colocado', 'borracho', 'alcohol', 'vodka', 'whisky',
        'ron', 'fumar', 'porro', 'crack', 'droga', 'aguja'
      ],
      french: [
        'herbe', 'marijuana', 'cocaïne', 'héroïne', 'ecstasy', 'pilules',
        'défoncé', 'ivre', 'alcool', 'vodka', 'whisky', 'rhum', 'fumer',
        'joint', 'crack', 'drogue', 'aiguille'
      ],
      german: [
        'gras', 'marihuana', 'kokain', 'heroin', 'ecstasy', 'pillen',
        'high', 'betrunken', 'alkohol', 'wodka', 'whiskey', 'rum',
        'rauchen', 'joint', 'crack', 'droge', 'nadel'
      ],
      russian: [
        'травка', 'марихуана', 'кокаин', 'героин', 'экстази', 'таблетки',
        'под кайфом', 'пьяный', 'алкоголь', 'водка', 'виски', 'ром',
        'курить', 'косяк', 'крэк', 'наркотик', 'игла'
      ],
      japanese: [
        '大麻', 'マリファナ', 'コカイン', 'ヘロイン', 'エクスタシー', '錠剤',
        'ハイ', '酔っ払い', 'アルコール', 'ウォッカ', 'ウイスキー', 'ラム',
        '吸う', '麻薬', '注射'
      ],
      korean: [
        '마약', '마리화나', '코카인', '헤로인', '엑스터시', '알약',
        '취하다', '술', '보드카', '위스키', '담배', '흡연',
        '약물', '주사'
      ],
      hindi: [
        'गांजा', 'मारिजुआना', 'कोकीन', 'हेरोइन', 'नशा', 'गोलियां',
        'नशे में', 'शराबी', 'शराब', 'वोदका', 'व्हिस्की', 'रम',
        'धूम्रपान', 'ड्रग्स', 'सुई'
      ],
      arabic: [
        'حشيش', 'ماريجوانا', 'كوكايين', 'هيروين', 'مخدرات', 'حبوب',
        'سكران', 'كحول', 'فودكا', 'ويسكي', 'تدخين', 'إبرة'
      ]
    };
    
    // Get the appropriate word lists based on detected language
    const explicitWords = explicitWordsByLanguage[language] || explicitWordsByLanguage.english;
    const sexualWords = sexualWordsByLanguage[language] || sexualWordsByLanguage.english;
    const violentWords = violentWordsByLanguage[language] || violentWordsByLanguage.english;
    const drugWords = drugWordsByLanguage[language] || drugWordsByLanguage.english;
    
    // Also include English words for all languages (since many songs mix languages)
    if (language !== 'english') {
      explicitWords.push(...explicitWordsByLanguage.english);
      sexualWords.push(...sexualWordsByLanguage.english);
      violentWords.push(...violentWordsByLanguage.english);
      drugWords.push(...drugWordsByLanguage.english);
    }
    
    // Check for explicit content (using word boundaries for more accurate matching)
    const foundExplicitWords = explicitWords.filter(word => 
      new RegExp(`\\b${word}\\b`).test(lowerCaseLyrics)
    );
    
    // Check for sexual content
    const foundSexualWords = sexualWords.filter(word => 
      new RegExp(`\\b${word}\\b`).test(lowerCaseLyrics)
    );
    
    // Check for violent themes
    const foundViolentWords = violentWords.filter(word => 
      new RegExp(`\\b${word}\\b`).test(lowerCaseLyrics)
    );
    
    // Check for drug references
    const foundDrugWords = drugWords.filter(word => 
      new RegExp(`\\b${word}\\b`).test(lowerCaseLyrics)
    );
    
    const hasExplicitContent = foundExplicitWords.length > 0;
    const hasSexualContent = foundSexualWords.length > 0;
    const hasViolentThemes = foundViolentWords.length > 0;
    const hasDrugReferences = foundDrugWords.length > 0;
    
    // Determine if 18+ based on findings
    const is18Plus = hasExplicitContent || hasSexualContent || hasViolentThemes || hasDrugReferences;
    
    return {
      is18Plus,
      hasExplicitContent,
      hasSexualContent,
      hasViolentThemes,
      hasDrugReferences,
      foundExplicitWords: foundExplicitWords.length > 0 ? foundExplicitWords : [],
      foundSexualWords: foundSexualWords.length > 0 ? foundSexualWords : [],
      foundViolentWords: foundViolentWords.length > 0 ? foundViolentWords : [],
      foundDrugWords: foundDrugWords.length > 0 ? foundDrugWords : [],
      detectedLanguage: language
    };
  };

  return {
    analyzeLyrics
  };
};