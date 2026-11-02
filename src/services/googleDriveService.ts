import { CustomWord, TextHighlight, BlogPost } from '../types';

export const APP_DRIVE_FOLDER_NAME = 'Chapter18_지구의대기_학습기록';

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

export interface LearningHistoryData {
  userId: string;
  userEmail: string;
  displayName: string;
  lastSyncedAt: string;
  completedSectionIds: string[];
  visitHistory: Record<string, { title: string; lastVisitedAt: number; count: number }>;
  quizScores: Record<string, { correct: number; total: number; scorePercent: number; updatedAt: number }>;
}

export interface DriveSyncPayload {
  history: LearningHistoryData;
  customVocabulary: CustomWord[];
  textHighlights?: TextHighlight[];
  blogPosts?: Record<string, BlogPost[]>;
}

/**
 * Searches for or creates the designated learning record folder in the user's Google Drive.
 */
export async function findOrCreateAppFolder(accessToken: string): Promise<string> {
  const query = `name = '${APP_DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    const errText = await searchRes.text();
    throw new Error(`Google Drive 폴더 검색 실패: ${searchRes.status} ${errText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: APP_DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: '지구과학 Chapter 18: 지구의 대기 (Earth\'s Atmosphere) 개인 학습 이력 및 나만의 용어 사전 저장소',
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google Drive 폴더 생성 실패: ${createRes.status} ${errText}`);
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Finds a file by name inside the specific folder
 */
async function findFileInFolder(accessToken: string, folderId: string, fileName: string): Promise<string | null> {
  const query = `'${folderId}' in parents and name = '${fileName}' and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.files && data.files.length > 0 ? data.files[0].id : null;
}

/**
 * Saves or updates a JSON/text file inside the folder using Drive REST API
 */
async function uploadOrUpdateFile(
  accessToken: string,
  folderId: string,
  fileName: string,
  content: string,
  mimeType: string = 'application/json'
): Promise<string> {
  const existingFileId = await findFileInFolder(accessToken, folderId, fileName);

  if (existingFileId) {
    // Update existing file content
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': mimeType,
      },
      body: content,
    });

    if (!res.ok) {
      throw new Error(`파일 업데이트 실패 (${fileName}): ${res.statusText}`);
    }
    return existingFileId;
  } else {
    // Create new file with multipart upload (metadata + media)
    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: mimeType,
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
      content +
      closeDelimiter;

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    if (!res.ok) {
      throw new Error(`파일 생성 실패 (${fileName}): ${res.statusText}`);
    }
    const data = await res.json();
    return data.id;
  }
}

/**
 * Saves all user learning records (history + vocabulary + report) to their Google Drive folder.
 */
export async function syncDataToGoogleDrive(
  accessToken: string,
  payload: DriveSyncPayload
): Promise<{ folderId: string; fileCount: number }> {
  const folderId = await findOrCreateAppFolder(accessToken);

  // 1. Save learning history JSON
  await uploadOrUpdateFile(
    accessToken,
    folderId,
    'learning_history.json',
    JSON.stringify(payload.history, null, 2),
    'application/json'
  );

  // 2. Save custom vocabulary JSON
  await uploadOrUpdateFile(
    accessToken,
    folderId,
    'custom_vocabulary.json',
    JSON.stringify(payload.customVocabulary, null, 2),
    'application/json'
  );

  // 3. Save text highlights JSON (if any)
  if (payload.textHighlights) {
    await uploadOrUpdateFile(
      accessToken,
      folderId,
      'text_highlights.json',
      JSON.stringify(payload.textHighlights, null, 2),
      'application/json'
    );
  }

  // 4. Save study blog posts JSON (if any)
  if (payload.blogPosts) {
    await uploadOrUpdateFile(
      accessToken,
      folderId,
      'study_blog_posts.json',
      JSON.stringify(payload.blogPosts, null, 2),
      'application/json'
    );
  }

  // 5. Save readable report text file
  const reportText = `[지구과학 Chapter 18: 지구의 대기 - 개인 학습 보고서]
학생 이름 / 계정: ${payload.history.displayName || '학습자'} (${payload.history.userEmail})
최종 동기화 일시: ${new Date().toLocaleString('ko-KR')}

========================================
1. 학습 진도 현황
========================================
- 완료한 단원 수: ${payload.history.completedSectionIds.length}개 단원
- 학습한 단원 목록:
${payload.history.completedSectionIds.map(id => `  * ${payload.history.visitHistory[id]?.title || id}`).join('\n') || '  (완료 단원 없음)'}

========================================
2. 나만의 용어 사전 (${payload.customVocabulary.length}개 등록)
========================================
${payload.customVocabulary.map((w, idx) => `
[${idx + 1}] ${w.word}
- 뜻: ${w.meaning}
- 출처: ${w.sourceSectionTitle || '교재'} (p.${w.sourcePage || 429})
- 암기 여부: ${w.isMemorized ? '암기 완료 (O)' : '복습 필요 (X)'}
${w.contextSentence ? `- 본문 인용: "${w.contextSentence}"` : ''}
`).join('\n') || '  (등록된 단어 없음)'}

========================================
3. 본문 중요 표시 (${payload.textHighlights?.length || 0}개 형광펜/밑줄)
========================================
${payload.textHighlights?.map((h, idx) => `
[${idx + 1}] [${h.color.toUpperCase()}] "${h.text}"
- 언어: ${h.lang === 'ko' ? '한국어 번역본' : '영어 원문'}
`).join('\n') || '  (표시된 구절 없음)'}
`;

  await uploadOrUpdateFile(
    accessToken,
    folderId,
    'learning_report.txt',
    reportText,
    'text/plain'
  );

  return { folderId, fileCount: payload.textHighlights ? 4 : 3 };
}

/**
 * Loads learning history, vocabulary, and highlights from the user's Google Drive.
 */
export async function loadDataFromGoogleDrive(
  accessToken: string
): Promise<{ 
  history: LearningHistoryData | null; 
  customVocabulary: CustomWord[] | null; 
  textHighlights: TextHighlight[] | null;
  blogPosts: Record<string, BlogPost[]> | null;
  folderId: string | null; 
}> {
  try {
    const folderId = await findOrCreateAppFolder(accessToken);

    // Read learning_history.json
    let history: LearningHistoryData | null = null;
    const historyFileId = await findFileInFolder(accessToken, folderId, 'learning_history.json');
    if (historyFileId) {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${historyFileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        history = await res.json();
      }
    }

    // Read custom_vocabulary.json
    let customVocabulary: CustomWord[] | null = null;
    const vocabFileId = await findFileInFolder(accessToken, folderId, 'custom_vocabulary.json');
    if (vocabFileId) {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${vocabFileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        customVocabulary = await res.json();
      }
    }

    // Read text_highlights.json
    let textHighlights: TextHighlight[] | null = null;
    const highlightsFileId = await findFileInFolder(accessToken, folderId, 'text_highlights.json');
    if (highlightsFileId) {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${highlightsFileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        textHighlights = await res.json();
      }
    }

    // Read study_blog_posts.json
    let blogPosts: Record<string, BlogPost[]> | null = null;
    const blogFileId = await findFileInFolder(accessToken, folderId, 'study_blog_posts.json');
    if (blogFileId) {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${blogFileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        blogPosts = await res.json();
      }
    }

    return { history, customVocabulary, textHighlights, blogPosts, folderId };
  } catch (error) {
    console.error('Google Drive 데이터 로드 실패:', error);
    throw error;
  }
}

/**
 * List files inside the folder with link
 */
export async function listFolderFiles(
  accessToken: string,
  folderId: string
): Promise<DriveFileInfo[]> {
  const query = `'${folderId}' in parents and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.files || [];
}
